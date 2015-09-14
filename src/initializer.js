import npm from 'npm';
import path from 'path';
import clone from 'clone';
import Promise from 'bluebird';
import isPlainObject from 'lodash.isplainobject';

import * as utils from './utils';

const debug = require('debug')('app-context:initializer');

function npmInstall(moduleName) {
  return new Promise(function(resolve, reject) {
    try {
      resolve(require(path.join(APP.root, 'node_modules', moduleName)));
    } catch (err) {
      let npmOpts = {cwd: APP.root, production: true};
      if (APP.package) { npmOpts.save = true; }

      npm.load(npmOpts, function(err) {
        if (err) { return reject(err); }
        npm.commands.install([moduleName], function(err, data) {
          if (err) { return reject(err); }
          resolve(require(path.join(APP.root, 'node_modules', moduleName)));
        });
      });
    }
  });
}

function transformStrings(item, transformer) {
  if (Array.isArray(item)) {
    return item.map((i) => transformStrings(i, transformer));
  } else if (isPlainObject(item)) {
    return Object.keys(item).reduce((o, k) => {
      let v = item[k];
      o[k] = transformStrings(v, transformer);
      return o;
    }, {});
  } else if (typeof(item) === 'string') {
    return transformer(item);
  } else {
    return item;
  }
}

function resolveContextItem(item, context) {
  return transformStrings(item, function(str) {
    var m;
    while ((m = /\$\{([^\}]+)\}/.exec(str)) != null) {
      let v = utils.getValue(context, m[1]);
      if (v == null) { v = process.env[m[1]]; }
      if (v == null) { throw new Error(`Could not resolve "${m[0]}". It does not exist in the context or as an environment variable.`); }
      if (m[0] === str) {
        str = v;
        break;
      } else {
        str = str.replace(m[0], v);
      }
    }
    return str;
  });
}

function resolveConfigItem(item, config) {
  return transformStrings(item, function(str) {
    if (str[0] !== '$') { return str; }
    let v = utils.getValue(config, str.slice(1));
    if (v == null) { throw new Error(`Could not resolve "${str}". It does not exist in the configuration.`); }
    return v;
  });
}

export default class Initializer {
  constructor(runlevel, opts) {
    this.runlevel = runlevel;
    this.builder = runlevel.builder;
    Object.keys(opts).forEach((k) => this[k] = opts[k]);
  }

  install() {
    debug('install');
    if (this.module == null) { return Promise.resolve(); }
    return npmInstall(this.module).then((method) => {
      this.method = method;
    }).catch(function(err) {
      if (err.code === 'E404') {
        err.type = 'install';
      }

      throw err;
    });
  }

  resolve(context) {
    debug('resolve');

    // resolve context/environment substitution
    this.args = resolveContextItem(this.originalArgs, context);
    // resolve config substitution
    this.args = resolveConfigItem(this.args, context.config);
  }

  execute(context) {
    // resolving args first so that problems can be caught before possibly waiting for an install
    this.resolve(context);

    return this.install().then(() => {
      // check for default args now that we definitely have a method
      if (this.originalArgs.length === 0 && this.method.defaultArgs) {
        // resolve again in case the defaults need it
        this.originalArgs = clone(this.method.defaultArgs);
        if (!Array.isArray(this.originalArgs)) { this.originalArgs = [this.originalArgs]; }
        this.resolve(context);
      }

      // resolve method - initialize if necessary
      if (this.args.length > 0) {
        this.method = this.method.apply(null, clone(this.args));
      }

      const method = this.method;
      const timeoutDuration = this.builder.get('timeout');

      debug('execute');

      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(function() {
          let error = new Error();
          error.type = 'timeout';
          error.timeoutDuration = timeoutDuration;
          reject(error);
        }, timeoutDuration);

        if (method.length === 2) {
          method(context, function(err) {
            clearTimeout(timeoutId);
            if (err) { return reject(err); }
            resolve();
          });
        } else {
          Promise.resolve(method(context)).then(() => {
            clearTimeout(timeoutId);
            resolve();
          }, (err) => {
            clearTimeout(timeoutId);
            reject(err);
          });
        }
      });
    });
  }

  static createFromModule(runlevel, moduleName, args) {
    return new Initializer(runlevel, {
      type: 'module',
      name: moduleName,
      module: `app-context-${moduleName}`,
      originalArgs: args
    });
  }

  static createFromMethod(runlevel, method, args) {
    return new Initializer(runlevel, {
      type: 'method',
      method: method,
      originalArgs: args
    });
  }
}
