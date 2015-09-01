import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import Promise from 'bluebird';

import * as errors from './errors';

const debug = require('debug')('app-context');

const RunLevel = {
  None: 0,
  Setup: 1,
  Configured: 3,
  Connected: 5,
  Initialized: 7,
  Running: 9
};

const RunLevelMap = Object.keys(RunLevel).reduce((o, k) => {
  let v = RunLevel[k];
  o[k.toLowerCase()] = v;
  o[v] = k;
  return o;
}, {});

/**
 * @class AppContext
 */
export default class AppContext {
  constructor(opts) {
    let packageFile = AppContext.findPackageFile();

    if (packageFile) {
      this.package = require(packageFile);
      if (this.package.name) {
        this.name = this.package.name;
      }
      if (this.package.version && /^[0-9]+\.[0-9]+\.[0-9]+$/.test(this.package.version)) {
        var version = this.package.version.split('.');

        this.version = {
          major: parseInt(version[0]),
          minor: parseInt(version[1]),
          patch: parseInt(version[2])
        };
      }
    }

    if (opts == null) { opts = {}; }
    this.root = opts.root || process.cwd();
    this.environment = opts.environment || 'development';

    this.config = {};
    this.runlevels = {};
    this.currentRunlevel = 0;
  }

  transitionTo(level) {
    if (level == null) { level = 10; }
    level = AppContext.resolveRunLevel(level);
    if (level < this.currentRunlevel) { throw new Error('app-context can only transition to a level great than the current run level.'); }
    if (level === this.currentRunlevel) { return Promise.resolve(); }

    if (global.APP !== this) { global.APP = this; }

    let runlevels = Object.keys(this.runlevels).map((l) => parseInt(l)).filter((l) => l > this.currentRunlevel && l <= level);
    runlevels.sort();

    debug('transition ' + this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ')');

    return runlevels.reduce((lastPromise, runlevel) => {
      return lastPromise.then(() => {
        return this.runlevels[runlevel].transition(this).then(() => {
          this.currentRunlevel = runlevel;
        });
      });
    }, Promise.resolve()).then(() => {
      debug('transition ' + this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ') DONE');
      this.currentRunlevel = level;
      return this;
    }).catch((err) => {
      debug('transition ' + this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ') ERROR');
      throw err;
    });
  }

  static resolveRunLevel(level) {
    if (typeof(level) === 'string') {
      if (RunLevelMap[level.toLowerCase()] == null) { throw new Error('There is no run level named ' + level); }
      level = RunLevelMap[level.toLowerCase()];
    }

    if (level < 0 || level > 10) { throw new Error('You have asked for a run level is outside of the allowed range (0 - 10)'); }

    return level;
  }

  static getRunLevelName(level) {
    return RunLevelMap[level];
  }

  static create(contextInitializer, opts) {
    const Builder = require('./builder');
    let builder = new Builder();

    if (typeof(contextInitializer) === 'function') {
      contextInitializer.call(builder);
    } else {
      throw new Error('You must pass a method to create an app-context');
    }

    if (opts == null) { opts = {}; }
    if (opts.environment == null) { opts.environment = process.env.NODE_ENV; }
    if (opts.root == null) { opts.root = process.cwd(); }

    const context = new AppContext(opts);

    context.runlevels = builder.runlevels;

    return context;
  }

  static loadFromFile(filename, opts) {
    debug('Load from file: ' + filename);
    try {
      filename = require.resolve(filename);
    } catch (err) {
      throw errors.message('Could not find an app-context at ' + filename);
    }
    debug('Resolved to: ' + filename);

    let extension = path.extname(filename);
    if (extension !== '.js') { throw errors.message('app-context can only be loaded from .js files'); }

    let contextInitializer = require(filename);
    return this.create(contextInitializer, opts);
  }

  static findPackageFile(dir) {
    if (dir == null) dir = process.cwd();

    let packageFile = path.join(dir, 'package.json');
    if (fs.existsSync(packageFile)) {
      debug('Found package.json at: ' + packageFile);
      return packageFile;
    }
    if (dir === path.sep) { return undefined; }
    return this.findPackageFile(path.join(dir, '..'));
  }

  static findAndLoadPackage(dir) {
    let packageFile = this.findPackageFile(dir);
    if (packageFile == null) { throw new Error('Unable to find package.json file'); }

    return require(packageFile);
  }

  static getAppContextFilenameFromPackage() {
    return this.findAndLoadPackage()['app-context'];
  }

  static loadGlobal() {
    const root = osenv.home();
    return this.loadFromFile(path.join(root, 'app-context'), {root: root});
  }

  static loadFromPackage() {
    let filename = this.getAppContextFilenameFromPackage();
    if (filename == null) { throw new Error('Your package.json does not define an "app-context".'); }

    return this.loadFromFile(filename);
  }

  static load(/* optional */ filename) {
    if (filename) { return this.loadFromFile(filename); }
    if (this.getAppContextFilenameFromPackage()) { return this.loadFromPackage(); }
    return this.loadFromFile(path.join(process.cwd(), 'app-context'));
  }
}

AppContext.RunLevel = RunLevel;
