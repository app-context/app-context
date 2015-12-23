'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _npm = require('npm');

var _npm2 = _interopRequireDefault(_npm);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('app-context:initializer');

function npmInstall(moduleName) {
  return new _bluebird2.default(function (resolve, reject) {
    try {
      resolve(require(_path2.default.join(APP.root, 'node_modules', moduleName)));
    } catch (err) {
      var npmOpts = { cwd: APP.root, production: true };
      if (APP.package) {
        npmOpts.save = true;
      }

      _npm2.default.load(npmOpts, function (err) {
        if (err) {
          return reject(err);
        }
        _npm2.default.commands.install([moduleName], function (err, data) {
          if (err) {
            return reject(err);
          }
          resolve(require(_path2.default.join(APP.root, 'node_modules', moduleName)));
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
        return _bluebird2.default.resolve();
      }
      return npmInstall(this.module).then(function (method) {
        _this2.method = method;
      }).catch(function (err) {
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
          _this3.originalArgs = (0, _clone2.default)(_this3.method.defaultArgs);
          if (!Array.isArray(_this3.originalArgs)) {
            _this3.originalArgs = [_this3.originalArgs];
          }
          _this3.resolve(context);
        }

        // resolve method - initialize if necessary
        if (_this3.args.length > 0) {
          _this3.method = _this3.method.apply(null, (0, _clone2.default)(_this3.args));
        }

        var method = _this3.method;
        var timeoutDuration = _this3.builder.get('timeout');

        debug('execute');

        return new _bluebird2.default(function (resolve, reject) {
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
            _bluebird2.default.resolve(method(context)).then(function () {
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
      var name = undefined;
      var match = moduleName.match(/^@[^\/]+\/(.+)$/);
      if (match) {
        name = match[1];
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
})();

exports.default = Initializer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFZLEVBQUUsSUFBSTtPQUNuQixDQUFDLENBQUM7S0FDSjs7O1NBeEdrQixXQUFXOzs7a0JBQVgsV0FBVyIsImZpbGUiOiJpbml0aWFsaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBucG0gZnJvbSAnbnBtJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGNsb25lIGZyb20gJ2Nsb25lJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2xvZGFzaC5pc3BsYWlub2JqZWN0JztcblxuaW1wb3J0ICogYXMgdXRpbHMgZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwLWNvbnRleHQ6aW5pdGlhbGl6ZXInKTtcblxuZnVuY3Rpb24gbnBtSW5zdGFsbChtb2R1bGVOYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB0cnkge1xuICAgICAgcmVzb2x2ZShyZXF1aXJlKHBhdGguam9pbihBUFAucm9vdCwgJ25vZGVfbW9kdWxlcycsIG1vZHVsZU5hbWUpKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBsZXQgbnBtT3B0cyA9IHtjd2Q6IEFQUC5yb290LCBwcm9kdWN0aW9uOiB0cnVlfTtcbiAgICAgIGlmIChBUFAucGFja2FnZSkgeyBucG1PcHRzLnNhdmUgPSB0cnVlOyB9XG5cbiAgICAgIG5wbS5sb2FkKG5wbU9wdHMsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBpZiAoZXJyKSB7IHJldHVybiByZWplY3QoZXJyKTsgfVxuICAgICAgICBucG0uY29tbWFuZHMuaW5zdGFsbChbbW9kdWxlTmFtZV0sIGZ1bmN0aW9uKGVyciwgZGF0YSkge1xuICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9XG4gICAgICAgICAgcmVzb2x2ZShyZXF1aXJlKHBhdGguam9pbihBUFAucm9vdCwgJ25vZGVfbW9kdWxlcycsIG1vZHVsZU5hbWUpKSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtU3RyaW5ncyhpdGVtLCB0cmFuc2Zvcm1lcikge1xuICBpZiAoQXJyYXkuaXNBcnJheShpdGVtKSkge1xuICAgIHJldHVybiBpdGVtLm1hcCgoaSkgPT4gdHJhbnNmb3JtU3RyaW5ncyhpLCB0cmFuc2Zvcm1lcikpO1xuICB9IGVsc2UgaWYgKGlzUGxhaW5PYmplY3QoaXRlbSkpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoaXRlbSkucmVkdWNlKChvLCBrKSA9PiB7XG4gICAgICBsZXQgdiA9IGl0ZW1ba107XG4gICAgICBvW2tdID0gdHJhbnNmb3JtU3RyaW5ncyh2LCB0cmFuc2Zvcm1lcik7XG4gICAgICByZXR1cm4gbztcbiAgICB9LCB7fSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mKGl0ZW0pID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cmFuc2Zvcm1lcihpdGVtKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZXNvbHZlQ29udGV4dEl0ZW0oaXRlbSwgY29udGV4dCkge1xuICByZXR1cm4gdHJhbnNmb3JtU3RyaW5ncyhpdGVtLCBmdW5jdGlvbihzdHIpIHtcbiAgICB2YXIgbTtcbiAgICB3aGlsZSAoKG0gPSAvXFwkXFx7KFteXFx9XSspXFx9Ly5leGVjKHN0cikpICE9IG51bGwpIHtcbiAgICAgIGxldCB2ID0gdXRpbHMuZ2V0VmFsdWUoY29udGV4dCwgbVsxXSk7XG4gICAgICBpZiAodiA9PSBudWxsKSB7IHYgPSBwcm9jZXNzLmVudlttWzFdXTsgfVxuICAgICAgaWYgKHYgPT0gbnVsbCkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlIFwiJHttWzBdfVwiLiBJdCBkb2VzIG5vdCBleGlzdCBpbiB0aGUgY29udGV4dCBvciBhcyBhbiBlbnZpcm9ubWVudCB2YXJpYWJsZS5gKTsgfVxuICAgICAgaWYgKG1bMF0gPT09IHN0cikge1xuICAgICAgICBzdHIgPSB2O1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1bMF0sIHYpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUNvbmZpZ0l0ZW0oaXRlbSwgY29uZmlnKSB7XG4gIHJldHVybiB0cmFuc2Zvcm1TdHJpbmdzKGl0ZW0sIGZ1bmN0aW9uKHN0cikge1xuICAgIGlmIChzdHJbMF0gIT09ICckJykgeyByZXR1cm4gc3RyOyB9XG4gICAgbGV0IHYgPSB1dGlscy5nZXRWYWx1ZShjb25maWcsIHN0ci5zbGljZSgxKSk7XG4gICAgaWYgKHYgPT0gbnVsbCkgeyB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCByZXNvbHZlIFwiJHtzdHJ9XCIuIEl0IGRvZXMgbm90IGV4aXN0IGluIHRoZSBjb25maWd1cmF0aW9uLmApOyB9XG4gICAgcmV0dXJuIHY7XG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbml0aWFsaXplciB7XG4gIGNvbnN0cnVjdG9yKHJ1bmxldmVsLCBvcHRzKSB7XG4gICAgdGhpcy5ydW5sZXZlbCA9IHJ1bmxldmVsO1xuICAgIHRoaXMuYnVpbGRlciA9IHJ1bmxldmVsLmJ1aWxkZXI7XG4gICAgT2JqZWN0LmtleXMob3B0cykuZm9yRWFjaCgoaykgPT4gdGhpc1trXSA9IG9wdHNba10pO1xuICB9XG5cbiAgaW5zdGFsbCgpIHtcbiAgICBkZWJ1ZygnaW5zdGFsbCcpO1xuICAgIGlmICh0aGlzLm1vZHVsZSA9PSBudWxsKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgfVxuICAgIHJldHVybiBucG1JbnN0YWxsKHRoaXMubW9kdWxlKS50aGVuKChtZXRob2QpID0+IHtcbiAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgaWYgKGVyci5jb2RlID09PSAnRTQwNCcpIHtcbiAgICAgICAgZXJyLnR5cGUgPSAnaW5zdGFsbCc7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIHJlc29sdmUoY29udGV4dCkge1xuICAgIGRlYnVnKCdyZXNvbHZlJyk7XG5cbiAgICAvLyByZXNvbHZlIGNvbnRleHQvZW52aXJvbm1lbnQgc3Vic3RpdHV0aW9uXG4gICAgdGhpcy5hcmdzID0gcmVzb2x2ZUNvbnRleHRJdGVtKHRoaXMub3JpZ2luYWxBcmdzLCBjb250ZXh0KTtcbiAgICAvLyByZXNvbHZlIGNvbmZpZyBzdWJzdGl0dXRpb25cbiAgICB0aGlzLmFyZ3MgPSByZXNvbHZlQ29uZmlnSXRlbSh0aGlzLmFyZ3MsIGNvbnRleHQuY29uZmlnKTtcbiAgfVxuXG4gIGV4ZWN1dGUoY29udGV4dCkge1xuICAgIC8vIHJlc29sdmluZyBhcmdzIGZpcnN0IHNvIHRoYXQgcHJvYmxlbXMgY2FuIGJlIGNhdWdodCBiZWZvcmUgcG9zc2libHkgd2FpdGluZyBmb3IgYW4gaW5zdGFsbFxuICAgIHRoaXMucmVzb2x2ZShjb250ZXh0KTtcblxuICAgIHJldHVybiB0aGlzLmluc3RhbGwoKS50aGVuKCgpID0+IHtcbiAgICAgIC8vIGNoZWNrIGZvciBkZWZhdWx0IGFyZ3Mgbm93IHRoYXQgd2UgZGVmaW5pdGVseSBoYXZlIGEgbWV0aG9kXG4gICAgICBpZiAodGhpcy5vcmlnaW5hbEFyZ3MubGVuZ3RoID09PSAwICYmIHRoaXMubWV0aG9kLmRlZmF1bHRBcmdzKSB7XG4gICAgICAgIC8vIHJlc29sdmUgYWdhaW4gaW4gY2FzZSB0aGUgZGVmYXVsdHMgbmVlZCBpdFxuICAgICAgICB0aGlzLm9yaWdpbmFsQXJncyA9IGNsb25lKHRoaXMubWV0aG9kLmRlZmF1bHRBcmdzKTtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMub3JpZ2luYWxBcmdzKSkgeyB0aGlzLm9yaWdpbmFsQXJncyA9IFt0aGlzLm9yaWdpbmFsQXJnc107IH1cbiAgICAgICAgdGhpcy5yZXNvbHZlKGNvbnRleHQpO1xuICAgICAgfVxuXG4gICAgICAvLyByZXNvbHZlIG1ldGhvZCAtIGluaXRpYWxpemUgaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAodGhpcy5hcmdzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5tZXRob2QgPSB0aGlzLm1ldGhvZC5hcHBseShudWxsLCBjbG9uZSh0aGlzLmFyZ3MpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0aG9kID0gdGhpcy5tZXRob2Q7XG4gICAgICBjb25zdCB0aW1lb3V0RHVyYXRpb24gPSB0aGlzLmJ1aWxkZXIuZ2V0KCd0aW1lb3V0Jyk7XG5cbiAgICAgIGRlYnVnKCdleGVjdXRlJyk7XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbGV0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICAgICAgZXJyb3IudHlwZSA9ICd0aW1lb3V0JztcbiAgICAgICAgICBlcnJvci50aW1lb3V0RHVyYXRpb24gPSB0aW1lb3V0RHVyYXRpb247XG4gICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgfSwgdGltZW91dER1cmF0aW9uKTtcblxuICAgICAgICBpZiAobWV0aG9kLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIG1ldGhvZChjb250ZXh0LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgaWYgKGVycikgeyByZXR1cm4gcmVqZWN0KGVycik7IH1cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUobWV0aG9kKGNvbnRleHQpKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUZyb21Nb2R1bGUocnVubGV2ZWwsIG1vZHVsZU5hbWUsIGFyZ3MpIHtcbiAgICBsZXQgbmFtZTtcbiAgICBsZXQgbWF0Y2ggPSBtb2R1bGVOYW1lLm1hdGNoKC9eQFteXFwvXStcXC8oLispJC8pO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgbmFtZSA9IG1hdGNoWzFdO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbW9kdWxlTmFtZTtcbiAgICAgIG1vZHVsZU5hbWUgPSBgYXBwLWNvbnRleHQtJHttb2R1bGVOYW1lfWA7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbml0aWFsaXplcihydW5sZXZlbCwge1xuICAgICAgdHlwZTogJ21vZHVsZScsXG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgbW9kdWxlOiBtb2R1bGVOYW1lLFxuICAgICAgb3JpZ2luYWxBcmdzOiBhcmdzXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlRnJvbU1ldGhvZChydW5sZXZlbCwgbWV0aG9kLCBhcmdzKSB7XG4gICAgcmV0dXJuIG5ldyBJbml0aWFsaXplcihydW5sZXZlbCwge1xuICAgICAgdHlwZTogJ21ldGhvZCcsXG4gICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgIG9yaWdpbmFsQXJnczogYXJnc1xuICAgIH0pO1xuICB9XG59XG4iXX0=