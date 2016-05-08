'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

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
          var modulePath = _path2.default.join(APP.root, 'node_modules', this.module);
          this.method = require(modulePath);
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
//# sourceMappingURL=data:application/json;base64,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RUFBVSxVLEVBQVksSSxFQUFNO0FBQ2xELFVBQUksYUFBSjtBQUNBLFVBQUksUUFBUSxXQUFXLEtBQVgsQ0FBaUIsaUJBQWpCLENBQVo7QUFDQSxVQUFJLEtBQUosRUFBVztBQUNULGVBQU8sTUFBTSxDQUFOLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSSxXQUFXLE9BQVgsQ0FBbUIsR0FBbkIsTUFBNEIsQ0FBQyxDQUFqQyxFQUFvQztBQUN6QyxjQUFNLE9BQU8sT0FBUCxpREFBNkQsVUFBN0QsQ0FBTjtBQUNELE9BRk0sTUFFQTtBQUNMLGVBQU8sVUFBUDtBQUNBLHNDQUE0QixVQUE1QjtBQUNEOztBQUVELGFBQU8sSUFBSSxXQUFKLENBQWdCLFFBQWhCLEVBQTBCO0FBQy9CLGNBQU0sUUFEeUI7QUFFL0IsY0FBTSxJQUZ5QjtBQUcvQixnQkFBUSxVQUh1QjtBQUkvQixzQkFBYztBQUppQixPQUExQixDQUFQO0FBTUQ7OztxQ0FFdUIsUSxFQUFVLE0sRUFBUSxJLEVBQU07QUFDOUMsYUFBTyxJQUFJLFdBQUosQ0FBZ0IsUUFBaEIsRUFBMEI7QUFDL0IsY0FBTSxRQUR5QjtBQUUvQixnQkFBUSxNQUZ1QjtBQUcvQixzQkFBYztBQUhpQixPQUExQixDQUFQO0FBS0Q7Ozs7OztrQkFsSGtCLFciLCJmaWxlIjoiaW5pdGlhbGl6ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjbG9uZSBmcm9tICdjbG9uZSc7XG5pbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2guaXNwbGFpbm9iamVjdCc7XG5cbmltcG9ydCAqIGFzIHV0aWxzIGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4vZXJyb3JzJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dDppbml0aWFsaXplcicpO1xuXG5mdW5jdGlvbiB0cmFuc2Zvcm1TdHJpbmdzKGl0ZW0sIHRyYW5zZm9ybWVyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGl0ZW0pKSB7XG4gICAgcmV0dXJuIGl0ZW0ubWFwKChpKSA9PiB0cmFuc2Zvcm1TdHJpbmdzKGksIHRyYW5zZm9ybWVyKSk7XG4gIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChpdGVtKSkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhpdGVtKS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAgIGxldCB2ID0gaXRlbVtrXTtcbiAgICAgIG9ba10gPSB0cmFuc2Zvcm1TdHJpbmdzKHYsIHRyYW5zZm9ybWVyKTtcbiAgICAgIHJldHVybiBvO1xuICAgIH0sIHt9KTtcbiAgfSBlbHNlIGlmICh0eXBlb2YoaXRlbSkgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWVyKGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVDb250ZXh0SXRlbShpdGVtLCBjb250ZXh0KSB7XG4gIHJldHVybiB0cmFuc2Zvcm1TdHJpbmdzKGl0ZW0sIGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBtO1xuICAgIHdoaWxlICgobSA9IC9cXCRcXHsoW15cXH1dKylcXH0vLmV4ZWMoc3RyKSkgIT0gbnVsbCkge1xuICAgICAgbGV0IHYgPSB1dGlscy5nZXRWYWx1ZShjb250ZXh0LCBtWzFdKTtcbiAgICAgIGlmICh2ID09IG51bGwpIHsgdiA9IHByb2Nlc3MuZW52W21bMV1dOyB9XG4gICAgICBpZiAodiA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHJlc29sdmUgXCIke21bMF19XCIuIEl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBjb250ZXh0IG9yIGFzIGFuIGVudmlyb25tZW50IHZhcmlhYmxlLmApOyB9XG4gICAgICBpZiAobVswXSA9PT0gc3RyKSB7XG4gICAgICAgIHN0ciA9IHY7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UobVswXSwgdik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29uZmlnSXRlbShpdGVtLCBjb25maWcpIHtcbiAgcmV0dXJuIHRyYW5zZm9ybVN0cmluZ3MoaXRlbSwgZnVuY3Rpb24oc3RyKSB7XG4gICAgaWYgKHN0clswXSAhPT0gJyQnKSB7IHJldHVybiBzdHI7IH1cbiAgICBsZXQgdiA9IHV0aWxzLmdldFZhbHVlKGNvbmZpZywgc3RyLnNsaWNlKDEpKTtcbiAgICBpZiAodiA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IHJlc29sdmUgXCIke3N0cn1cIi4gSXQgZG9lcyBub3QgZXhpc3QgaW4gdGhlIGNvbmZpZ3VyYXRpb24uYCk7IH1cbiAgICByZXR1cm4gdjtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEluaXRpYWxpemVyIHtcbiAgY29uc3RydWN0b3IocnVubGV2ZWwsIG9wdHMpIHtcbiAgICB0aGlzLnJ1bmxldmVsID0gcnVubGV2ZWw7XG4gICAgdGhpcy5idWlsZGVyID0gcnVubGV2ZWwuYnVpbGRlcjtcbiAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrKSA9PiB0aGlzW2tdID0gb3B0c1trXSk7XG4gIH1cblxuICByZXNvbHZlTW9kdWxlKCkge1xuICAgIGRlYnVnKCdyZXNvbHZlTW9kdWxlJyk7XG4gICAgaWYgKHRoaXMubW9kdWxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBtb2R1bGVQYXRoID0gcGF0aC5qb2luKEFQUC5yb290LCAnbm9kZV9tb2R1bGVzJywgdGhpcy5tb2R1bGUpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IHJlcXVpcmUobW9kdWxlUGF0aCk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgaWYgKGVyci5jb2RlID09PSAnRTQwNCcpIHtcbiAgICAgICAgICBlcnIudHlwZSA9ICdpbnN0YWxsJztcbiAgICAgICAgfSBlbHNlIGlmIChlcnIuY29kZSA9PT0gJ01PRFVMRV9OT1RfRk9VTkQnKSB7XG4gICAgICAgICAgZXJyLnR5cGUgPSAncmVzb2x2ZU1vZHVsZSc7XG4gICAgICAgIH1cblxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVzb2x2ZShjb250ZXh0KSB7XG4gICAgZGVidWcoJ3Jlc29sdmUnKTtcblxuICAgIC8vIHJlc29sdmUgY29udGV4dC9lbnZpcm9ubWVudCBzdWJzdGl0dXRpb25cbiAgICB0aGlzLmFyZ3MgPSByZXNvbHZlQ29udGV4dEl0ZW0odGhpcy5vcmlnaW5hbEFyZ3MsIGNvbnRleHQpO1xuICAgIC8vIHJlc29sdmUgY29uZmlnIHN1YnN0aXR1dGlvblxuICAgIHRoaXMuYXJncyA9IHJlc29sdmVDb25maWdJdGVtKHRoaXMuYXJncywgY29udGV4dC5jb25maWcpO1xuICB9XG5cbiAgZXhlY3V0ZShjb250ZXh0KSB7XG4gICAgLy8gd3JhcCBpbiBhIHByb21pc2UgZm9yIGNvbnNpc3RlbnQgZXJyb3IgaGFuZGxpbmdcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gcmVzb2x2aW5nIGFyZ3MgZmlyc3Qgc28gdGhhdCBwcm9ibGVtcyBjYW4gYmUgY2F1Z2h0IGJlZm9yZSBwb3NzaWJseSB3YWl0aW5nIGZvciBhbiBpbnN0YWxsXG4gICAgICAgIHRoaXMucmVzb2x2ZShjb250ZXh0KTtcbiAgICAgICAgdGhpcy5yZXNvbHZlTW9kdWxlKCk7XG5cbiAgICAgICAgLy8gY2hlY2sgZm9yIGRlZmF1bHQgYXJncyBub3cgdGhhdCB3ZSBkZWZpbml0ZWx5IGhhdmUgYSBtZXRob2RcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxBcmdzLmxlbmd0aCA9PT0gMCAmJiB0aGlzLm1ldGhvZC5kZWZhdWx0QXJncykge1xuICAgICAgICAgIC8vIHJlc29sdmUgYWdhaW4gaW4gY2FzZSB0aGUgZGVmYXVsdHMgbmVlZCBpdFxuICAgICAgICAgIHRoaXMub3JpZ2luYWxBcmdzID0gY2xvbmUodGhpcy5tZXRob2QuZGVmYXVsdEFyZ3MpO1xuICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh0aGlzLm9yaWdpbmFsQXJncykpIHsgdGhpcy5vcmlnaW5hbEFyZ3MgPSBbdGhpcy5vcmlnaW5hbEFyZ3NdOyB9XG4gICAgICAgICAgdGhpcy5yZXNvbHZlKGNvbnRleHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVzb2x2ZSBtZXRob2QgLSBpbml0aWFsaXplIGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB0aGlzLm1ldGhvZCA9IHRoaXMubWV0aG9kLmFwcGx5KG51bGwsIGNsb25lKHRoaXMuYXJncykpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gICAgICAgIGNvbnN0IHRpbWVvdXREdXJhdGlvbiA9IHRoaXMuYnVpbGRlci5nZXQoJ3RpbWVvdXQnKTtcblxuICAgICAgICBkZWJ1ZygnZXhlY3V0ZScpO1xuXG4gICAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgZXJyb3IudHlwZSA9ICd0aW1lb3V0JztcbiAgICAgICAgICBlcnJvci50aW1lb3V0RHVyYXRpb24gPSB0aW1lb3V0RHVyYXRpb247XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcblxuICAgICAgICBpZiAobWV0aG9kLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1ldGhvZChjb250ZXh0LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gcmVqZWN0KGVycik7IH1cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kKGNvbnRleHQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tTW9kdWxlKHJ1bmxldmVsLCBtb2R1bGVOYW1lLCBhcmdzKSB7XG4gICAgbGV0IG5hbWU7XG4gICAgbGV0IG1hdGNoID0gbW9kdWxlTmFtZS5tYXRjaCgvXkBbXlxcL10rXFwvKC4rKSQvKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIG5hbWUgPSBtYXRjaFsxXTtcbiAgICB9IGVsc2UgaWYgKG1vZHVsZU5hbWUuaW5kZXhPZignLycpICE9PSAtMSkge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoYExvY2FsIGluaXRpYWxpemVyIG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkOiAke21vZHVsZU5hbWV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBtb2R1bGVOYW1lO1xuICAgICAgbW9kdWxlTmFtZSA9IGBhcHAtY29udGV4dC0ke21vZHVsZU5hbWV9YDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEluaXRpYWxpemVyKHJ1bmxldmVsLCB7XG4gICAgICB0eXBlOiAnbW9kdWxlJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBtb2R1bGU6IG1vZHVsZU5hbWUsXG4gICAgICBvcmlnaW5hbEFyZ3M6IGFyZ3NcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVGcm9tTWV0aG9kKHJ1bmxldmVsLCBtZXRob2QsIGFyZ3MpIHtcbiAgICByZXR1cm4gbmV3IEluaXRpYWxpemVyKHJ1bmxldmVsLCB7XG4gICAgICB0eXBlOiAnbWV0aG9kJyxcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgb3JpZ2luYWxBcmdzOiBhcmdzXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==