'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _es6require = require('@mattinsler/es6require');

var _es6require2 = _interopRequireDefault(_es6require);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('app-context');

var RunLevel = {
  None: 0,
  Setup: 1,
  Configured: 3,
  Connected: 5,
  Initialized: 7,
  Running: 9
};

var RunLevelMap = Object.keys(RunLevel).reduce(function (o, k) {
  var v = RunLevel[k];
  o[k.toLowerCase()] = v;
  o[v] = k;
  return o;
}, {});

/**
 * @class AppContext
 */

var AppContext = function () {
  function AppContext(opts) {
    _classCallCheck(this, AppContext);

    var packageFile = AppContext.findPackageFile();

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

    if (opts == null) {
      opts = {};
    }
    this.root = opts.root || process.cwd();
    this.environment = opts.environment || 'development';

    this.config = {};
    this.runlevels = {};
    this.currentRunlevel = 0;
  }

  _createClass(AppContext, [{
    key: 'transitionTo',
    value: function transitionTo() {
      var _this = this;

      var level = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0];

      level = AppContext.resolveRunLevel(level);
      if (level < this.currentRunlevel) {
        throw new Error('app-context can only transition to a level great than the current run level.');
      }
      if (level === this.currentRunlevel) {
        return Promise.resolve();
      }

      if (global.APP !== this) {
        global.APP = this;
      }

      var runlevels = Object.keys(this.runlevels).map(function (l) {
        return parseInt(l);
      }).filter(function (l) {
        return l > _this.currentRunlevel && l <= level;
      });
      runlevels.sort();

      debug('transition ' + this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ')');

      return runlevels.reduce(function (lastPromise, runlevel) {
        return lastPromise.then(function () {
          return _this.runlevels[runlevel].transition(_this).then(function () {
            _this.currentRunlevel = runlevel;
          });
        });
      }, Promise.resolve()).then(function () {
        debug('transition ' + _this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ') DONE');
        _this.currentRunlevel = level;
        return _this;
      }).catch(function (err) {
        debug('transition ' + _this.currentRunlevel + ' => ' + level + ' (' + runlevels.join(', ') + ') ERROR');
        throw err;
      });
    }
  }, {
    key: 'currentRunlevelName',
    get: function get() {
      return AppContext.getRunLevelName(this.currentRunlevel);
    }
  }], [{
    key: 'resolveRunLevel',
    value: function resolveRunLevel(level) {
      if (typeof level === 'string') {
        if (RunLevelMap[level.toLowerCase()] == null) {
          throw new Error('There is no run level named ' + level);
        }
        level = RunLevelMap[level.toLowerCase()];
      }

      if (level < 0 || level > 10) {
        throw new Error('You have asked for a run level is outside of the allowed range (0 - 10)');
      }

      return level;
    }
  }, {
    key: 'getRunLevelName',
    value: function getRunLevelName(level) {
      return RunLevelMap[level];
    }
  }, {
    key: 'create',
    value: function create(contextInitializer, opts) {
      var Builder = require('./builder');
      var builder = new Builder();

      if (typeof contextInitializer === 'function') {
        contextInitializer.call(builder);
      } else if (typeof contextInitializer.default === 'function') {
        contextInitializer.default.call(builder);
      } else {
        throw new Error('You must pass a method to create an app-context');
      }

      if (opts == null) {
        opts = {};
      }
      if (opts.environment == null) {
        opts.environment = process.env.NODE_ENV;
      }
      if (opts.root == null) {
        opts.root = process.cwd();
      }

      var context = new AppContext(opts);

      context.runlevels = builder.runlevels;

      return context;
    }
  }, {
    key: 'loadBabel',
    value: function loadBabel() {
      var babelFile = _path2.default.join(process.cwd(), '.babelrc');
      var pkg = this.findAndLoadPackage();

      var babelConfig = void 0;

      if (_fs2.default.existsSync(babelFile)) {
        babelConfig = JSON.parse(_fs2.default.readFileSync(babelFile, 'utf8'));
      } else if (pkg && pkg.babel) {
        babelConfig = pkg.babel;
      } else {
        return;
      }

      // environment configuration
      // if (babelConfig.env) {
      //   const environment = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
      //   if (babelConfig.env[environment]) {
      //
      //   }
      // }

      var unmetRequirements = [].concat((babelConfig.presets || []).map(function (p) {
        return p.startsWith('babel-preset-') ? p : 'babel-preset-' + p;
      }), (babelConfig.plugins || []).map(function (p) {
        var name = Array.isArray(p) ? p[0] : p;
        return name.startsWith('babel-plugin-') ? name : 'babel-plugin-' + name;
      })).filter(function (name) {
        try {
          require.resolve(_path2.default.join(process.cwd(), 'node_modules', name));
          return false;
        } catch (err) {
          return true;
        }
      });

      if (unmetRequirements.length > 0) {
        throw errors.message(['Unmet babel requirements: ' + unmetRequirements.join(', '), 'Fix this by running "npm install --save --save-exact ' + unmetRequirements.join(' ') + '"'].join(_os2.default.EOL));
      }

      require('babel-register')({
        sourceRoot: process.cwd()
      });
    }
  }, {
    key: 'loadFromFile',
    value: function loadFromFile(filename, opts) {
      var shouldThrow = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      try {
        filename = require.resolve(filename);
      } catch (err) {
        if (shouldThrow) {
          throw errors.message('Could not find an app-context at ' + filename);
        } else {
          return null;
        }
      }
      debug('Load from file: ' + filename);

      var extension = _path2.default.extname(filename);
      if (extension !== '.js') {
        throw errors.message('app-context can only be loaded from .js files');
      }

      this.loadBabel();

      var contextInitializer = (0, _es6require2.default)(filename);
      return this.create(contextInitializer, opts);
    }
  }, {
    key: 'findPackageFile',
    value: function findPackageFile(dir) {
      if (dir == null) dir = process.cwd();

      var packageFile = _path2.default.join(dir, 'package.json');
      if (_fs2.default.existsSync(packageFile)) {
        debug('Found package.json at: ' + packageFile);
        return packageFile;
      }
      if (dir === _path2.default.sep) {
        return undefined;
      }
      return this.findPackageFile(_path2.default.join(dir, '..'));
    }
  }, {
    key: 'findAndLoadPackage',
    value: function findAndLoadPackage(dir) {
      var packageFile = this.findPackageFile(dir);
      if (packageFile == null) {
        throw errors.message('Unable to find package.json file');
      }

      return require(packageFile);
    }
  }, {
    key: 'getAppContextFilenameFromPackage',
    value: function getAppContextFilenameFromPackage() {
      var shouldThrow = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      try {
        return this.findAndLoadPackage()['app-context'];
      } catch (err) {
        if (shouldThrow) {
          throw err;
        }
      }
    }
  }, {
    key: 'loadGlobal',
    value: function loadGlobal() {
      var root = _osenv2.default.home();
      return this.loadFromFile(_path2.default.join(root, 'app-context'), { root: root });
    }
  }, {
    key: 'loadFromPackage',
    value: function loadFromPackage() {
      var shouldThrow = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      var filename = this.getAppContextFilenameFromPackage(shouldThrow);
      if (filename == null) {
        if (shouldThrow) {
          throw errors.message('Your package.json does not define an "app-context".');
        } else {
          return null;
        }
      }

      debug('Found context in package: ' + filename);
      return this.loadFromFile(filename);
    }
  }, {
    key: 'load',
    value: function load( /* optional */filename) {
      var context = null;

      if (filename) {
        context = this.loadFromFile(filename);
      }
      if (context == null) {
        context = this.loadFromPackage(false);
      }
      if (context == null) {
        context = this.loadFromFile(_path2.default.join(process.cwd(), 'app-context'), {}, false);
      }
      if (context == null) {
        debug('No context file, loading an empty context');
        context = this.create(function () {});
      }

      return context;
    }
  }]);

  return AppContext;
}();

exports.default = AppContext;


AppContext.RunLevel = RunLevel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFrQixRQUFsQixDQUFWO0FBQXdDO0FBQ3hELFVBQUksV0FBVyxJQUFmLEVBQXFCO0FBQUUsa0JBQVUsS0FBSyxlQUFMLENBQXFCLEtBQXJCLENBQVY7QUFBd0M7QUFDL0QsVUFBSSxXQUFXLElBQWYsRUFBcUI7QUFBRSxrQkFBVSxLQUFLLFlBQUwsQ0FBa0IsZUFBSyxJQUFMLENBQVUsUUFBUSxHQUFSLEVBQVYsRUFBeUIsYUFBekIsQ0FBbEIsRUFBMkQsRUFBM0QsRUFBK0QsS0FBL0QsQ0FBVjtBQUFrRjtBQUN6RyxVQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixjQUFNLDJDQUFOO0FBQ0Esa0JBQVUsS0FBSyxNQUFMLENBQVksWUFBVSxDQUFFLENBQXhCLENBQVY7QUFDRDs7QUFFRCxhQUFPLE9BQVA7QUFDRDs7Ozs7O2tCQW5Pa0IsVTs7O0FBc09yQixXQUFXLFFBQVgsR0FBc0IsUUFBdEIiLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBvc2VudiBmcm9tICdvc2Vudic7XG5pbXBvcnQgZXM2cmVxdWlyZSBmcm9tICdAbWF0dGluc2xlci9lczZyZXF1aXJlJztcblxuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4vZXJyb3JzJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dCcpO1xuXG5jb25zdCBSdW5MZXZlbCA9IHtcbiAgTm9uZTogMCxcbiAgU2V0dXA6IDEsXG4gIENvbmZpZ3VyZWQ6IDMsXG4gIENvbm5lY3RlZDogNSxcbiAgSW5pdGlhbGl6ZWQ6IDcsXG4gIFJ1bm5pbmc6IDlcbn07XG5cbmNvbnN0IFJ1bkxldmVsTWFwID0gT2JqZWN0LmtleXMoUnVuTGV2ZWwpLnJlZHVjZSgobywgaykgPT4ge1xuICBsZXQgdiA9IFJ1bkxldmVsW2tdO1xuICBvW2sudG9Mb3dlckNhc2UoKV0gPSB2O1xuICBvW3ZdID0gaztcbiAgcmV0dXJuIG87XG59LCB7fSk7XG5cbi8qKlxuICogQGNsYXNzIEFwcENvbnRleHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBsZXQgcGFja2FnZUZpbGUgPSBBcHBDb250ZXh0LmZpbmRQYWNrYWdlRmlsZSgpO1xuXG4gICAgaWYgKHBhY2thZ2VGaWxlKSB7XG4gICAgICB0aGlzLnBhY2thZ2UgPSByZXF1aXJlKHBhY2thZ2VGaWxlKTtcbiAgICAgIGlmICh0aGlzLnBhY2thZ2UubmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLnBhY2thZ2UubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhY2thZ2UudmVyc2lvbiAmJiAvXlswLTldK1xcLlswLTldK1xcLlswLTldKyQvLnRlc3QodGhpcy5wYWNrYWdlLnZlcnNpb24pKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy5wYWNrYWdlLnZlcnNpb24uc3BsaXQoJy4nKTtcblxuICAgICAgICB0aGlzLnZlcnNpb24gPSB7XG4gICAgICAgICAgbWFqb3I6IHBhcnNlSW50KHZlcnNpb25bMF0pLFxuICAgICAgICAgIG1pbm9yOiBwYXJzZUludCh2ZXJzaW9uWzFdKSxcbiAgICAgICAgICBwYXRjaDogcGFyc2VJbnQodmVyc2lvblsyXSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIHRoaXMucm9vdCA9IG9wdHMucm9vdCB8fCBwcm9jZXNzLmN3ZCgpO1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBvcHRzLmVudmlyb25tZW50IHx8ICdkZXZlbG9wbWVudCc7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIHRoaXMucnVubGV2ZWxzID0ge307XG4gICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSAwO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRSdW5sZXZlbE5hbWUoKSB7IHJldHVybiBBcHBDb250ZXh0LmdldFJ1bkxldmVsTmFtZSh0aGlzLmN1cnJlbnRSdW5sZXZlbCk7IH1cblxuICB0cmFuc2l0aW9uVG8obGV2ZWwgPSAxMCkge1xuICAgIGxldmVsID0gQXBwQ29udGV4dC5yZXNvbHZlUnVuTGV2ZWwobGV2ZWwpO1xuICAgIGlmIChsZXZlbCA8IHRoaXMuY3VycmVudFJ1bmxldmVsKSB7IHRocm93IG5ldyBFcnJvcignYXBwLWNvbnRleHQgY2FuIG9ubHkgdHJhbnNpdGlvbiB0byBhIGxldmVsIGdyZWF0IHRoYW4gdGhlIGN1cnJlbnQgcnVuIGxldmVsLicpOyB9XG4gICAgaWYgKGxldmVsID09PSB0aGlzLmN1cnJlbnRSdW5sZXZlbCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cblxuICAgIGlmIChnbG9iYWwuQVBQICE9PSB0aGlzKSB7IGdsb2JhbC5BUFAgPSB0aGlzOyB9XG5cbiAgICBsZXQgcnVubGV2ZWxzID0gT2JqZWN0LmtleXModGhpcy5ydW5sZXZlbHMpLm1hcCgobCkgPT4gcGFyc2VJbnQobCkpLmZpbHRlcigobCkgPT4gbCA+IHRoaXMuY3VycmVudFJ1bmxldmVsICYmIGwgPD0gbGV2ZWwpO1xuICAgIHJ1bmxldmVscy5zb3J0KCk7XG5cbiAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpJyk7XG5cbiAgICByZXR1cm4gcnVubGV2ZWxzLnJlZHVjZSgobGFzdFByb21pc2UsIHJ1bmxldmVsKSA9PiB7XG4gICAgICByZXR1cm4gbGFzdFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bmxldmVsc1tydW5sZXZlbF0udHJhbnNpdGlvbih0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRSdW5sZXZlbCA9IHJ1bmxldmVsO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRE9ORScpO1xuICAgICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSBsZXZlbDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRVJST1InKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZXNvbHZlUnVuTGV2ZWwobGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mKGxldmVsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChSdW5MZXZlbE1hcFtsZXZlbC50b0xvd2VyQ2FzZSgpXSA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gcnVuIGxldmVsIG5hbWVkICcgKyBsZXZlbCk7IH1cbiAgICAgIGxldmVsID0gUnVuTGV2ZWxNYXBbbGV2ZWwudG9Mb3dlckNhc2UoKV07XG4gICAgfVxuXG4gICAgaWYgKGxldmVsIDwgMCB8fCBsZXZlbCA+IDEwKSB7IHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgYXNrZWQgZm9yIGEgcnVuIGxldmVsIGlzIG91dHNpZGUgb2YgdGhlIGFsbG93ZWQgcmFuZ2UgKDAgLSAxMCknKTsgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG5cbiAgc3RhdGljIGdldFJ1bkxldmVsTmFtZShsZXZlbCkge1xuICAgIHJldHVybiBSdW5MZXZlbE1hcFtsZXZlbF07XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKGNvbnRleHRJbml0aWFsaXplciwgb3B0cykge1xuICAgIGNvbnN0IEJ1aWxkZXIgPSByZXF1aXJlKCcuL2J1aWxkZXInKTtcbiAgICBsZXQgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG5cbiAgICBpZiAodHlwZW9mKGNvbnRleHRJbml0aWFsaXplcikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRleHRJbml0aWFsaXplci5jYWxsKGJ1aWxkZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mKGNvbnRleHRJbml0aWFsaXplci5kZWZhdWx0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29udGV4dEluaXRpYWxpemVyLmRlZmF1bHQuY2FsbChidWlsZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBwYXNzIGEgbWV0aG9kIHRvIGNyZWF0ZSBhbiBhcHAtY29udGV4dCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XG4gICAgaWYgKG9wdHMuZW52aXJvbm1lbnQgPT0gbnVsbCkgeyBvcHRzLmVudmlyb25tZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlY7IH1cbiAgICBpZiAob3B0cy5yb290ID09IG51bGwpIHsgb3B0cy5yb290ID0gcHJvY2Vzcy5jd2QoKTsgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBBcHBDb250ZXh0KG9wdHMpO1xuXG4gICAgY29udGV4dC5ydW5sZXZlbHMgPSBidWlsZGVyLnJ1bmxldmVscztcblxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgc3RhdGljIGxvYWRCYWJlbCgpIHtcbiAgICBjb25zdCBiYWJlbEZpbGUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy5iYWJlbHJjJyk7XG4gICAgY29uc3QgcGtnID0gdGhpcy5maW5kQW5kTG9hZFBhY2thZ2UoKTtcblxuICAgIGxldCBiYWJlbENvbmZpZztcblxuICAgIGlmIChmcy5leGlzdHNTeW5jKGJhYmVsRmlsZSkpIHtcbiAgICAgIGJhYmVsQ29uZmlnID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYmFiZWxGaWxlLCAndXRmOCcpKTtcbiAgICB9IGVsc2UgaWYgKHBrZyAmJiBwa2cuYmFiZWwpIHtcbiAgICAgIGJhYmVsQ29uZmlnID0gcGtnLmJhYmVsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvblxuICAgIC8vIGlmIChiYWJlbENvbmZpZy5lbnYpIHtcbiAgICAvLyAgIGNvbnN0IGVudmlyb25tZW50ID0gcHJvY2Vzcy5lbnYuQkFCRUxfRU5WIHx8IHByb2Nlc3MuZW52Lk5PREVfRU5WIHx8ICdkZXZlbG9wbWVudCc7XG4gICAgLy8gICBpZiAoYmFiZWxDb25maWcuZW52W2Vudmlyb25tZW50XSkge1xuICAgIC8vXG4gICAgLy8gICB9XG4gICAgLy8gfVxuXG4gICAgY29uc3QgdW5tZXRSZXF1aXJlbWVudHMgPSBbXS5jb25jYXQoXG4gICAgICAoYmFiZWxDb25maWcucHJlc2V0cyB8fCBbXSkubWFwKChwKSA9PiB7XG4gICAgICAgIHJldHVybiBwLnN0YXJ0c1dpdGgoJ2JhYmVsLXByZXNldC0nKSA/IHAgOiBgYmFiZWwtcHJlc2V0LSR7cH1gO1xuICAgICAgfSksXG4gICAgICAoYmFiZWxDb25maWcucGx1Z2lucyB8fCBbXSkubWFwKChwKSA9PiB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBBcnJheS5pc0FycmF5KHApID8gcFswXSA6IHA7XG4gICAgICAgIHJldHVybiBuYW1lLnN0YXJ0c1dpdGgoJ2JhYmVsLXBsdWdpbi0nKSA/IG5hbWUgOiBgYmFiZWwtcGx1Z2luLSR7bmFtZX1gO1xuICAgICAgfSlcbiAgICApLmZpbHRlcigobmFtZSkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzJywgbmFtZSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodW5tZXRSZXF1aXJlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoW1xuICAgICAgICAnVW5tZXQgYmFiZWwgcmVxdWlyZW1lbnRzOiAnICsgdW5tZXRSZXF1aXJlbWVudHMuam9pbignLCAnKSxcbiAgICAgICAgJ0ZpeCB0aGlzIGJ5IHJ1bm5pbmcgXCJucG0gaW5zdGFsbCAtLXNhdmUgLS1zYXZlLWV4YWN0ICcgKyB1bm1ldFJlcXVpcmVtZW50cy5qb2luKCcgJykgKyAnXCInXG4gICAgICBdLmpvaW4ob3MuRU9MKSk7XG4gICAgfVxuXG4gICAgcmVxdWlyZSgnYmFiZWwtcmVnaXN0ZXInKSh7XG4gICAgICBzb3VyY2VSb290OiBwcm9jZXNzLmN3ZCgpXG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZEZyb21GaWxlKGZpbGVuYW1lLCBvcHRzLCBzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgZmlsZW5hbWUgPSByZXF1aXJlLnJlc29sdmUoZmlsZW5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdDb3VsZCBub3QgZmluZCBhbiBhcHAtY29udGV4dCBhdCAnICsgZmlsZW5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGRlYnVnKCdMb2FkIGZyb20gZmlsZTogJyArIGZpbGVuYW1lKTtcblxuICAgIGxldCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpO1xuICAgIGlmIChleHRlbnNpb24gIT09ICcuanMnKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdhcHAtY29udGV4dCBjYW4gb25seSBiZSBsb2FkZWQgZnJvbSAuanMgZmlsZXMnKTsgfVxuXG4gICAgdGhpcy5sb2FkQmFiZWwoKTtcblxuICAgIGxldCBjb250ZXh0SW5pdGlhbGl6ZXIgPSBlczZyZXF1aXJlKGZpbGVuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGUoY29udGV4dEluaXRpYWxpemVyLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kUGFja2FnZUZpbGUoZGlyKSB7XG4gICAgaWYgKGRpciA9PSBudWxsKSBkaXIgPSBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgbGV0IHBhY2thZ2VGaWxlID0gcGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhY2thZ2VGaWxlKSkge1xuICAgICAgZGVidWcoJ0ZvdW5kIHBhY2thZ2UuanNvbiBhdDogJyArIHBhY2thZ2VGaWxlKTtcbiAgICAgIHJldHVybiBwYWNrYWdlRmlsZTtcbiAgICB9XG4gICAgaWYgKGRpciA9PT0gcGF0aC5zZXApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiB0aGlzLmZpbmRQYWNrYWdlRmlsZShwYXRoLmpvaW4oZGlyLCAnLi4nKSk7XG4gIH1cblxuICBzdGF0aWMgZmluZEFuZExvYWRQYWNrYWdlKGRpcikge1xuICAgIGxldCBwYWNrYWdlRmlsZSA9IHRoaXMuZmluZFBhY2thZ2VGaWxlKGRpcik7XG4gICAgaWYgKHBhY2thZ2VGaWxlID09IG51bGwpIHsgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1VuYWJsZSB0byBmaW5kIHBhY2thZ2UuanNvbiBmaWxlJyk7IH1cblxuICAgIHJldHVybiByZXF1aXJlKHBhY2thZ2VGaWxlKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBcHBDb250ZXh0RmlsZW5hbWVGcm9tUGFja2FnZShzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZEFuZExvYWRQYWNrYWdlKClbJ2FwcC1jb250ZXh0J107XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHsgdGhyb3cgZXJyOyB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGxvYWRHbG9iYWwoKSB7XG4gICAgY29uc3Qgcm9vdCA9IG9zZW52LmhvbWUoKTtcbiAgICByZXR1cm4gdGhpcy5sb2FkRnJvbUZpbGUocGF0aC5qb2luKHJvb3QsICdhcHAtY29udGV4dCcpLCB7cm9vdDogcm9vdH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRGcm9tUGFja2FnZShzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICBsZXQgZmlsZW5hbWUgPSB0aGlzLmdldEFwcENvbnRleHRGaWxlbmFtZUZyb21QYWNrYWdlKHNob3VsZFRocm93KTtcbiAgICBpZiAoZmlsZW5hbWUgPT0gbnVsbCkge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdZb3VyIHBhY2thZ2UuanNvbiBkb2VzIG5vdCBkZWZpbmUgYW4gXCJhcHAtY29udGV4dFwiLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVidWcoJ0ZvdW5kIGNvbnRleHQgaW4gcGFja2FnZTogJyArIGZpbGVuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5sb2FkRnJvbUZpbGUoZmlsZW5hbWUpO1xuICB9XG5cbiAgc3RhdGljIGxvYWQoLyogb3B0aW9uYWwgKi8gZmlsZW5hbWUpIHtcbiAgICBsZXQgY29udGV4dCA9IG51bGw7XG5cbiAgICBpZiAoZmlsZW5hbWUpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21GaWxlKGZpbGVuYW1lKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21QYWNrYWdlKGZhbHNlKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21GaWxlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYXBwLWNvbnRleHQnKSwge30sIGZhbHNlKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIGRlYnVnKCdObyBjb250ZXh0IGZpbGUsIGxvYWRpbmcgYW4gZW1wdHkgY29udGV4dCcpO1xuICAgICAgY29udGV4dCA9IHRoaXMuY3JlYXRlKGZ1bmN0aW9uKCl7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbn1cblxuQXBwQ29udGV4dC5SdW5MZXZlbCA9IFJ1bkxldmVsO1xuIl19