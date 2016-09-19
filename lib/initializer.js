'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _es6require = require('@mattinsler/es6require');

var _es6require2 = _interopRequireDefault(_es6require);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('app-context:initializer');

function transformStrings(item, transformer) {
  if (Array.isArray(item)) {
    return item.map(function (i) {
      return transformStrings(i, transformer);
    });
  } else if ((0, _lodash2.default)(item)) {
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

var Initializer = function () {
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
    key: 'resolveModule',
    value: function resolveModule() {
      debug('resolveModule');
      if (this.module) {
        try {
          this.method = (0, _es6require2.default)(APP.root, 'node_modules', this.module);
        } catch (err) {
          if (err.code === 'E404') {
            err.type = 'install';
          } else if (err.code === 'MODULE_NOT_FOUND') {
            err.type = 'resolveModule';
          }

          throw err;
        }
      }
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
      var _this2 = this;

      // wrap in a promise for consistent error handling
      return new Promise(function (resolve, reject) {
        try {
          (function () {
            // resolving args first so that problems can be caught before possibly waiting for an install
            _this2.resolve(context);
            _this2.resolveModule();

            // check for default args now that we definitely have a method
            if (_this2.originalArgs.length === 0 && _this2.method.defaultArgs) {
              // resolve again in case the defaults need it
              _this2.originalArgs = (0, _clone2.default)(_this2.method.defaultArgs);
              if (!Array.isArray(_this2.originalArgs)) {
                _this2.originalArgs = [_this2.originalArgs];
              }
              _this2.resolve(context);
            }

            // resolve method - initialize if necessary
            if (_this2.args.length > 0) {
              _this2.method = _this2.method.apply(null, (0, _clone2.default)(_this2.args));
            }

            var method = _this2.method;
            var timeoutDuration = _this2.builder.get('timeout');

            debug('execute');

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
              Promise.resolve(method(context)).then(function () {
                clearTimeout(timeoutId);
                resolve();
              }, function (err) {
                clearTimeout(timeoutId);
                reject(err);
              });
            }
          })();
        } catch (err) {
          reject(err);
        }
      });
    }
  }], [{
    key: 'createFromModule',
    value: function createFromModule(runlevel, moduleName, args) {
      var name = void 0;
      var match = moduleName.match(/^@[^\/]+\/(.+)$/);
      if (match) {
        name = match[1];
      } else if (moduleName.indexOf('/') !== -1) {
        throw errors.message('Local initializer names are not supported: ' + moduleName);
      } else {
        name = moduleName;
        moduleName = 'app-context-' + moduleName;
      }

      return new Initializer(runlevel, {
        type: 'module',
        name: name,
        module: moduleName,
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
}();

exports.default = Initializer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbml0aWFsaXplci5qcyJdLCJuYW1lcyI6WyJ1dGlscyIsImVycm9ycyIsImRlYnVnIiwicmVxdWlyZSIsInRyYW5zZm9ybVN0cmluZ3MiLCJpdGVtIiwidHJhbnNmb3JtZXIiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJpIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsIm8iLCJrIiwidiIsInJlc29sdmVDb250ZXh0SXRlbSIsImNvbnRleHQiLCJzdHIiLCJtIiwiZXhlYyIsImdldFZhbHVlIiwicHJvY2VzcyIsImVudiIsIkVycm9yIiwicmVwbGFjZSIsInJlc29sdmVDb25maWdJdGVtIiwiY29uZmlnIiwic2xpY2UiLCJJbml0aWFsaXplciIsInJ1bmxldmVsIiwib3B0cyIsImJ1aWxkZXIiLCJmb3JFYWNoIiwibW9kdWxlIiwibWV0aG9kIiwiQVBQIiwicm9vdCIsImVyciIsImNvZGUiLCJ0eXBlIiwiYXJncyIsIm9yaWdpbmFsQXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVzb2x2ZU1vZHVsZSIsImxlbmd0aCIsImRlZmF1bHRBcmdzIiwiYXBwbHkiLCJ0aW1lb3V0RHVyYXRpb24iLCJnZXQiLCJ0aW1lb3V0SWQiLCJzZXRUaW1lb3V0IiwiZXJyb3IiLCJjbGVhclRpbWVvdXQiLCJ0aGVuIiwibW9kdWxlTmFtZSIsIm5hbWUiLCJtYXRjaCIsImluZGV4T2YiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0lBQVlBLEs7O0FBQ1o7O0lBQVlDLE07Ozs7Ozs7O0FBRVosSUFBTUMsUUFBUUMsUUFBUSxPQUFSLEVBQWlCLHlCQUFqQixDQUFkOztBQUVBLFNBQVNDLGdCQUFULENBQTBCQyxJQUExQixFQUFnQ0MsV0FBaEMsRUFBNkM7QUFDM0MsTUFBSUMsTUFBTUMsT0FBTixDQUFjSCxJQUFkLENBQUosRUFBeUI7QUFDdkIsV0FBT0EsS0FB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S0FBWCxDQUFpQixpQkFBakIsQ0FBWjtBQUNBLFVBQUlBLEtBQUosRUFBVztBQUNURCxlQUFPQyxNQUFNLENBQU4sQ0FBUDtBQUNELE9BRkQsTUFFTyxJQUFJRixXQUFXRyxPQUFYLENBQW1CLEdBQW5CLE1BQTRCLENBQUMsQ0FBakMsRUFBb0M7QUFDekMsY0FBTTVELE9BQU82RCxPQUFQLGlEQUE2REosVUFBN0QsQ0FBTjtBQUNELE9BRk0sTUFFQTtBQUNMQyxlQUFPRCxVQUFQO0FBQ0FBLHNDQUE0QkEsVUFBNUI7QUFDRDs7QUFFRCxhQUFPLElBQUk1QixXQUFKLENBQWdCQyxRQUFoQixFQUEwQjtBQUMvQlUsY0FBTSxRQUR5QjtBQUUvQmtCLGNBQU1BLElBRnlCO0FBRy9CeEIsZ0JBQVF1QixVQUh1QjtBQUkvQmYsc0JBQWNEO0FBSmlCLE9BQTFCLENBQVA7QUFNRDs7O3FDQUV1QlgsUSxFQUFVSyxNLEVBQVFNLEksRUFBTTtBQUM5QyxhQUFPLElBQUlaLFdBQUosQ0FBZ0JDLFFBQWhCLEVBQTBCO0FBQy9CVSxjQUFNLFFBRHlCO0FBRS9CTCxnQkFBUUEsTUFGdUI7QUFHL0JPLHNCQUFjRDtBQUhpQixPQUExQixDQUFQO0FBS0Q7Ozs7OztrQkFqSGtCWixXIiwiZmlsZSI6ImluaXRpYWxpemVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgY2xvbmUgZnJvbSAnY2xvbmUnO1xuaW1wb3J0IGVzNnJlcXVpcmUgZnJvbSAnQG1hdHRpbnNsZXIvZXM2cmVxdWlyZSc7XG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2guaXNwbGFpbm9iamVjdCc7XG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4vZXJyb3JzJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dDppbml0aWFsaXplcicpO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1TdHJpbmdzKGl0ZW0sIHRyYW5zZm9ybWVyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgcmV0dXJuIGl0ZW0ubWFwKChpKSA9PiB0cmFuc2Zvcm1TdHJpbmdzKGksIHRyYW5zZm9ybWVyKSk7XG4gIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhpdGVtKS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAgIGxldCB2ID0gaXRlbVtrXTtcbiAgICAgIG9ba10gPSB0cmFuc2Zvcm1TdHJpbmdzKHYsIHRyYW5zZm9ybWVyKTtcbiAgICAgIHJldHVybiBvO1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YoaXRlbSkgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyKGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDb250ZXh0SXRlbShpdGVtLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmFuc2Zvcm1TdHJpbmdzKGl0ZW0sIGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBtO1xuICAgIHdoaWxlICgobSA9IC9cXCRcXHsoW15cXH1dKylcXH0vLmV4ZWMoc3RyKSkgIT0gbnVsbCkge1xuICAgICAgbGV0IHYgPSB1dGlscy5nZXRWYWx1ZShjb250ZXh0LCBtWzFdKTtcbiAgICAgIGlmICh2ID09IG51bGwpIHsgdiA9IHByb2Nlc3MuZW52W21bMV1dOyB9XG4gICAgICBpZiAodiA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHJlc29sdmUgXCIke21bMF19XCIuIEl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBjb250ZXh0IG9yIGFzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlLmApOyB9XG4gICAgICBpZiAobVswXSA9PT0gc3RyKSB7XG4gICAgICAgIHN0ciA9IHY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobVswXSwgdik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29uZmlnSXRlbShpdGVtLCBjb25maWcpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybVN0cmluZ3MoaXRlbSwgZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHN0clswXSAhPT0gJyQnKSB7IHJldHVybiBzdHI7IH1cbiAgICBsZXQgdiA9IHV0aWxzLmdldFZhbHVlKGNvbmZpZywgc3RyLnNsaWNlKDEpKTtcbiAgICBpZiAodiA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHJlc29sdmUgXCIke3N0cn1cIi4gSXQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGNvbmZpZ3VyYXRpb24uYCk7IH1cbiAgICByZXR1cm4gdjtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluaXRpYWxpemVyIHtcbiAgY29uc3RydWN0b3IocnVubGV2ZWwsIG9wdHMpIHtcbiAgICB0aGlzLnJ1bmxldmVsID0gcnVubGV2ZWw7XG4gICAgdGhpcy5idWlsZGVyID0gcnVubGV2ZWwuYnVpbGRlcjtcbiAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrKSA9PiB0aGlzW2tdID0gb3B0c1trXSk7XG4gIH1cblxuICByZXNvbHZlTW9kdWxlKCkge1xuICAgIGRlYnVnKCdyZXNvbHZlTW9kdWxlJyk7XG4gICAgaWYgKHRoaXMubW9kdWxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IGVzNnJlcXVpcmUoQVBQLnJvb3QsICdub2RlX21vZHVsZXMnLCB0aGlzLm1vZHVsZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRTQwNCcpIHtcbiAgICAgICAgICBlcnIudHlwZSA9ICdpbnN0YWxsJztcbiAgICAgICAgfSBlbHNlIGlmIChlcnIuY29kZSA9PT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAgICAgZXJyLnR5cGUgPSAncmVzb2x2ZU1vZHVsZSc7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZShjb250ZXh0KSB7XG4gICAgZGVidWcoJ3Jlc29sdmUnKTtcblxuICAgIC8vIHJlc29sdmUgY29udGV4dC9lbnZpcm9ubWVudCBzdWJzdGl0dXRpb25cbiAgICB0aGlzLmFyZ3MgPSByZXNvbHZlQ29udGV4dEl0ZW0odGhpcy5vcmlnaW5hbEFyZ3MsIGNvbnRleHQpO1xuICAgIC8vIHJlc29sdmUgY29uZmlnIHN1YnN0aXR1dGlvblxuICAgIHRoaXMuYXJncyA9IHJlc29sdmVDb25maWdJdGVtKHRoaXMuYXJncywgY29udGV4dC5jb25maWcpO1xuICB9XG5cbiAgZXhlY3V0ZShjb250ZXh0KSB7XG4gICAgLy8gd3JhcCBpbiBhIHByb21pc2UgZm9yIGNvbnNpc3RlbnQgZXJyb3IgaGFuZGxpbmdcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVzb2x2aW5nIGFyZ3MgZmlyc3Qgc28gdGhhdCBwcm9ibGVtcyBjYW4gYmUgY2F1Z2h0IGJlZm9yZSBwb3NzaWJseSB3YWl0aW5nIGZvciBhbiBpbnN0YWxsXG4gICAgICAgIHRoaXMucmVzb2x2ZShjb250ZXh0KTtcbiAgICAgICAgdGhpcy5yZXNvbHZlTW9kdWxlKCk7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIGRlZmF1bHQgYXJncyBub3cgdGhhdCB3ZSBkZWZpbml0ZWx5IGhhdmUgYSBtZXRob2RcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxBcmdzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm1ldGhvZC5kZWZhdWx0QXJncykge1xuICAgICAgICAgIC8vIHJlc29sdmUgYWdhaW4gaW4gY2FzZSB0aGUgZGVmYXVsdHMgbmVlZCBpdFxuICAgICAgICAgIHRoaXMub3JpZ2luYWxBcmdzID0gY2xvbmUodGhpcy5tZXRob2QuZGVmYXVsdEFyZ3MpO1xuICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLm9yaWdpbmFsQXJncykpIHsgdGhpcy5vcmlnaW5hbEFyZ3MgPSBbdGhpcy5vcmlnaW5hbEFyZ3NdOyB9XG4gICAgICAgICAgdGhpcy5yZXNvbHZlKGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVzb2x2ZSBtZXRob2QgLSBpbml0aWFsaXplIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLm1ldGhvZCA9IHRoaXMubWV0aG9kLmFwcGx5KG51bGwsIGNsb25lKHRoaXMuYXJncykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gICAgICAgIGNvbnN0IHRpbWVvdXREdXJhdGlvbiA9IHRoaXMuYnVpbGRlci5nZXQoJ3RpbWVvdXQnKTtcblxuICAgICAgICBkZWJ1ZygnZXhlY3V0ZScpO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgZXJyb3IudHlwZSA9ICd0aW1lb3V0JztcbiAgICAgICAgICBlcnJvci50aW1lb3V0RHVyYXRpb24gPSB0aW1lb3V0RHVyYXRpb247XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcblxuICAgICAgICBpZiAobWV0aG9kLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1ldGhvZChjb250ZXh0LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gcmVqZWN0KGVycik7IH1cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kKGNvbnRleHQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tTW9kdWxlKHJ1bmxldmVsLCBtb2R1bGVOYW1lLCBhcmdzKSB7XG4gICAgbGV0IG5hbWU7XG4gICAgbGV0IG1hdGNoID0gbW9kdWxlTmFtZS5tYXRjaCgvXkBbXlxcL10rXFwvKC4rKSQvKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIG5hbWUgPSBtYXRjaFsxXTtcbiAgICB9IGVsc2UgaWYgKG1vZHVsZU5hbWUuaW5kZXhPZignLycpICE9PSAtMSkge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoYExvY2FsIGluaXRpYWxpemVyIG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkOiAke21vZHVsZU5hbWV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBtb2R1bGVOYW1lO1xuICAgICAgbW9kdWxlTmFtZSA9IGBhcHAtY29udGV4dC0ke21vZHVsZU5hbWV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEluaXRpYWxpemVyKHJ1bmxldmVsLCB7XG4gICAgICB0eXBlOiAnbW9kdWxlJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBtb2R1bGU6IG1vZHVsZU5hbWUsXG4gICAgICBvcmlnaW5hbEFyZ3M6IGFyZ3NcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tTWV0aG9kKHJ1bmxldmVsLCBtZXRob2QsIGFyZ3MpIHtcbiAgICByZXR1cm4gbmV3IEluaXRpYWxpemVyKHJ1bmxldmVsLCB7XG4gICAgICB0eXBlOiAnbWV0aG9kJyxcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgb3JpZ2luYWxBcmdzOiBhcmdzXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==