'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _npm = require('npm');

var _npm2 = _interopRequireDefault(_npm);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var debug = require('debug')('app-context:initializer');

function npmInstall(moduleName) {
  return new _bluebird2['default'](function (resolve, reject) {
    try {
      resolve(require(_path2['default'].join(APP.root, 'node_modules', moduleName)));
    } catch (err) {
      var npmOpts = { cwd: APP.root, production: true };
      if (APP['package']) {
        npmOpts.save = true;
      }

      _npm2['default'].load(npmOpts, function (err) {
        if (err) {
          return reject(err);
        }
        _npm2['default'].commands.install([moduleName], function (err, data) {
          if (err) {
            return reject(err);
          }
          resolve(require(_path2['default'].join(APP.root, 'node_modules', moduleName)));
        });
      });
    }
  });
}

function transformStrings(item, transformer) {
  if (Array.isArray(item)) {
    return item.map(function (i) {
      return transformStrings(i, transformer);
    });
  } else if ((0, _lodashIsplainobject2['default'])(item)) {
    return Object.keys(item).reduce(function (o, k) {
      var v = item[k];
      o[k] = transformStrings(v, transformer);
      return o;
    }, {});
  } else if (typeof item === 'string') {
    return transformer(item);
  } else {
    return item;
  }
}

function resolveContextItem(item, context) {
  return transformStrings(item, function (str) {
    var m;
    while ((m = /\$\{([^\}]+)\}/.exec(str)) != null) {
      var v = utils.getValue(context, m[1]);
      if (v == null) {
        v = process.env[m[1]];
      }
      if (v == null) {
        throw new Error('Could not resolve "' + m[0] + '". It does not exist in the context or as an environment variable.');
      }
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
  return transformStrings(item, function (str) {
    if (str[0] !== '$') {
      return str;
    }
    var v = utils.getValue(config, str.slice(1));
    if (v == null) {
      throw new Error('Could not resolve "' + str + '". It does not exist in the configuration.');
    }
    return v;
  });
}

var Initializer = (function () {
  function Initializer(runlevel, opts) {
    var _this = this;

    _classCallCheck(this, Initializer);

    this.runlevel = runlevel;
    this.builder = runlevel.builder;
    Object.keys(opts).forEach(function (k) {
      return _this[k] = opts[k];
    });
  }

  _createClass(Initializer, [{
    key: 'install',
    value: function install() {
      var _this2 = this;

      debug('install');
      if (this.module == null) {
        return _bluebird2['default'].resolve();
      }
      return npmInstall(this.module).then(function (method) {
        _this2.method = method;
      })['catch'](function (err) {
        if (err.code === 'E404') {
          err.type = 'install';
        }

        throw err;
      });
    }
  }, {
    key: 'resolve',
    value: function resolve(context) {
      debug('resolve');

      // resolve context/environment substitution
      this.args = resolveContextItem(this.originalArgs, context);
      // resolve config substitution
      this.args = resolveConfigItem(this.args, context.config);
    }
  }, {
    key: 'execute',
    value: function execute(context) {
      var _this3 = this;

      // resolving args first so that problems can be caught before possibly waiting for an install
      this.resolve(context);

      return this.install().then(function () {
        // check for default args now that we definitely have a method
        if (_this3.originalArgs.length === 0 && _this3.method.defaultArgs) {
          // resolve again in case the defaults need it
          _this3.originalArgs = (0, _clone2['default'])(_this3.method.defaultArgs);
          if (!Array.isArray(_this3.originalArgs)) {
            _this3.originalArgs = [_this3.originalArgs];
          }
          _this3.resolve(context);
        }

        // resolve method - initialize if necessary
        if (_this3.args.length > 0) {
          _this3.method = _this3.method.apply(null, (0, _clone2['default'])(_this3.args));
        }

        var method = _this3.method;
        var timeoutDuration = _this3.builder.get('timeout');

        debug('execute');

        return new _bluebird2['default'](function (resolve, reject) {
          var timeoutId = setTimeout(function () {
            var error = new Error();
            error.type = 'timeout';
            error.timeoutDuration = timeoutDuration;
            reject(error);
          }, timeoutDuration);

          if (method.length === 2) {
            method(context, function (err) {
              clearTimeout(timeoutId);
              if (err) {
                return reject(err);
              }
              resolve();
            });
          } else {
            _bluebird2['default'].resolve(method(context)).then(function () {
              clearTimeout(timeoutId);
              resolve();
            }, function (err) {
              clearTimeout(timeoutId);
              reject(err);
            });
          }
        });
      });
    }
  }], [{
    key: 'createFromModule',
    value: function createFromModule(runlevel, moduleName, args) {
      return new Initializer(runlevel, {
        type: 'module',
        name: moduleName,
        module: 'app-context-' + moduleName,
        originalArgs: args
      });
    }
  }, {
    key: 'createFromMethod',
    value: function createFromMethod(runlevel, method, args) {
      return new Initializer(runlevel, {
        type: 'method',
        method: method,
        originalArgs: args
      });
    }
  }]);

  return Initializer;
})();

exports['default'] = Initializer;
module.exports = exports['default'];