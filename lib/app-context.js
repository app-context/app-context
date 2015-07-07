var q = require('q');
var fs = require('fs');
var path = require('path');
var Properties = require('./properties');

/**
 * @class AppContext
 */
function AppContext(environment) {
  var packageFile = AppContext.findPackage();
  
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
  
  this.environment = environment || 'development';
  
  this.properties = new Properties();
  this.config = {};
  this.initializers = {};
  this.currentRunLevel = 0;
  
  this.set = this.properties.set.bind(this.properties);
  this.deepSet = this.properties.deepSet.bind(this.properties);
  this.get = this.properties.get.bind(this.properties);
}

AppContext.RunLevel = {
  None: 0,
  Setup: 1,
  Configured: 3,
  Connected: 5,
  Initialized: 7,
  Running: 9
};

/** Add an initializer to the context */
AppContext.prototype.use = function(runLevel) {
  if (typeof(runLevel) !== 'number') throw new Error('AppContext::use requires a runLevel for the first parameter.');
  
  var newInitializers = Array.prototype.slice.call(arguments, 1).filter(function(v) {
    return typeof(v) === 'function';
  });
  if (newInitializers.length === 0) throw new Error('AppContext::use requires a list of initializer functions.');
  
  if (!this.initializers[runLevel]) this.initializers[runLevel] = [];
  Array.prototype.push.apply(this.initializers[runLevel], newInitializers);
  return this;
};

/**
 * Transition to a new run level by executing each set of initializers
 * ordered by level then order of call to use().
 * 
 * The requested run level must be greater than the current run level.
 */
AppContext.prototype.transitionTo = function(runLevel) {
  if (runLevel < this.currentRunLevel) throw new Error('AppContext::transitionTo can only transition to a level greater than the current run level');
  if (runLevel === this.currentRunLevel) return;
  
  var currentRunLevel = this.currentRunLevel;
  
  // Get a list of remaining run levels in order
  var runLevels = Object.keys(this.initializers)
    .map(function(i) {
      return parseInt(i);
    })
    .filter(function(level) {
      return level > currentRunLevel && level <= runLevel;
    });
  
  runLevels.sort();
  
  var context = this;
  
  var transitionOneLevel = function(level) {
    return (context.initializers[level] || []).reduce(function(promiseChain, initializer) {
      return promiseChain.then(function() {
        return q.when(initializer(context));
      });
    }, q());
  };
  
  return runLevels.reduce(function(promiseChain, level) {
    return promiseChain.then(function() {
      return transitionOneLevel(level).then(function() {
        context.currentRunLevel = level;
      });
    });
  }, q()).then(function() {
    context.currentRunLevel = runLevel;
    return context;
  });
};

AppContext.createContext = function(contextSpec) {
  if (!contextSpec) throw new Error('Must pass an object with a configure method to AppContext.createContext.');
  if (!contextSpec.configure) throw new Error('Must pass an object with a configure method to AppContext.createContext.');
  
  return {
    load: function(runLevel, env, opts) {
      if (!runLevel) { runLevel = 10; }
      if (!env) { env = process.env.NODE_ENV; }
      
      var context = new AppContext(env);
      context.options = opts || {};
      
      context.set({
        root: process.cwd()
      });
      
      // make context available for initializers
      global.APP = context;

      if (contextSpec.configure) {
        if (typeof(contextSpec.configure) === 'function') {
          contextSpec.configure.call(context);
        } else {
          require('app-context-initialize').context(context, contextSpec.configure);
        }
      }
      
      return context.transitionTo(runLevel);
    }
  };
};

AppContext.findPackage = function(dir) {
  if (!dir) dir = process.cwd();
  
  var packageFile = path.join(dir, 'package.json');
  if (fs.existsSync(packageFile)) return packageFile;
  if (dir === path.sep) return undefined;
  return AppContext.findPackage(path.join(dir, '..'));
};

AppContext.loadFromPackage = function(runLevel, env, opts) {
  return q().then(function() {
    var packageFile = AppContext.findPackage();
    if (!packageFile) throw new Error('Could not find package.json file for your project.');
    var packageObject = require(packageFile);
    if (!packageObject['app-context']) throw new Error('The package.json for your project does not have a "app-context" defined.');
  
    var context = require(path.join(path.dirname(packageFile), packageObject['app-context']));
    return context.load(runLevel, env, opts);
  });
};

module.exports = AppContext;
