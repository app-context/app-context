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

      // handle babel...
      var babelFile = _path2.default.join(process.cwd(), '.babelrc');
      if (_fs2.default.existsSync(babelFile)) {
        var babelData = JSON.parse(_fs2.default.readFileSync(babelFile, 'utf8'));

        var unmetRequirements = [].concat((babelData.presets || []).map(function (p) {
          return 'babel-preset-' + p;
        }), (babelData.plugins || []).map(function (p) {
          return 'babel-plugin-' + p;
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

      var contextInitializer = require(filename);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0lBQVksTTs7Ozs7Ozs7QUFFWixJQUFNLFFBQVEsUUFBUSxPQUFSLEVBQWlCLGFBQWpCLENBQWQ7O0FBRUEsSUFBTSxXQUFXO0FBQ2YsUUFBTSxDQURTO0FBRWYsU0FBTyxDQUZRO0FBR2YsY0FBWSxDQUhHO0FBSWYsYUFBVyxDQUpJO0FBS2YsZUFBYSxDQUxFO0FBTWYsV0FBUztBQU5NLENBQWpCOztBQVNBLElBQU0sY0FBYyxPQUFPLElBQVAsQ0FBWSxRQUFaLEVBQXNCLE1BQXRCLENBQTZCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUN6RCxNQUFJLElBQUksU0FBUyxDQUFULENBQVI7QUFDQSxJQUFFLEVBQUUsV0FBRixFQUFGLElBQXFCLENBQXJCO0FBQ0EsSUFBRSxDQUFGLElBQU8sQ0FBUDtBQUNBLFNBQU8sQ0FBUDtBQUNELENBTG1CLEVBS2pCLEVBTGlCLENBQXBCOzs7Ozs7SUFVcUIsVTtBQUNuQixzQkFBWSxJQUFaLEVBQWtCO0FBQUE7O0FBQ2hCLFFBQUksY0FBYyxXQUFXLGVBQVgsRUFBbEI7O0FBRUEsUUFBSSxXQUFKLEVBQWlCO0FBQ2YsV0FBSyxPQUFMLEdBQWUsUUFBUSxXQUFSLENBQWY7QUFDQSxVQUFJLEtBQUssT0FBTCxDQUFhLElBQWpCLEVBQXVCO0FBQ3JCLGFBQUssSUFBTCxHQUFZLEtBQUssT0FBTCxDQUFhLElBQXpCO0FBQ0Q7QUFDRCxVQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsSUFBd0IsMkJBQTJCLElBQTNCLENBQWdDLEtBQUssT0FBTCxDQUFhLE9BQTdDLENBQTVCLEVBQW1GO0FBQ2pGLFlBQUksVUFBVSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLEtBQXJCLENBQTJCLEdBQTNCLENBQWQ7O0FBRUEsYUFBSyxPQUFMLEdBQWU7QUFD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QUVELGFBQU8sT0FBUDtBQUNEOzs7Ozs7a0JBM01rQixVOzs7QUE4TXJCLFdBQVcsUUFBWCxHQUFzQixRQUF0QiIsImZpbGUiOiJhcHAtY29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IG9zZW52IGZyb20gJ29zZW52JztcblxuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4vZXJyb3JzJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dCcpO1xuXG5jb25zdCBSdW5MZXZlbCA9IHtcbiAgTm9uZTogMCxcbiAgU2V0dXA6IDEsXG4gIENvbmZpZ3VyZWQ6IDMsXG4gIENvbm5lY3RlZDogNSxcbiAgSW5pdGlhbGl6ZWQ6IDcsXG4gIFJ1bm5pbmc6IDlcbn07XG5cbmNvbnN0IFJ1bkxldmVsTWFwID0gT2JqZWN0LmtleXMoUnVuTGV2ZWwpLnJlZHVjZSgobywgaykgPT4ge1xuICBsZXQgdiA9IFJ1bkxldmVsW2tdO1xuICBvW2sudG9Mb3dlckNhc2UoKV0gPSB2O1xuICBvW3ZdID0gaztcbiAgcmV0dXJuIG87XG59LCB7fSk7XG5cbi8qKlxuICogQGNsYXNzIEFwcENvbnRleHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBsZXQgcGFja2FnZUZpbGUgPSBBcHBDb250ZXh0LmZpbmRQYWNrYWdlRmlsZSgpO1xuXG4gICAgaWYgKHBhY2thZ2VGaWxlKSB7XG4gICAgICB0aGlzLnBhY2thZ2UgPSByZXF1aXJlKHBhY2thZ2VGaWxlKTtcbiAgICAgIGlmICh0aGlzLnBhY2thZ2UubmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLnBhY2thZ2UubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhY2thZ2UudmVyc2lvbiAmJiAvXlswLTldK1xcLlswLTldK1xcLlswLTldKyQvLnRlc3QodGhpcy5wYWNrYWdlLnZlcnNpb24pKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy5wYWNrYWdlLnZlcnNpb24uc3BsaXQoJy4nKTtcblxuICAgICAgICB0aGlzLnZlcnNpb24gPSB7XG4gICAgICAgICAgbWFqb3I6IHBhcnNlSW50KHZlcnNpb25bMF0pLFxuICAgICAgICAgIG1pbm9yOiBwYXJzZUludCh2ZXJzaW9uWzFdKSxcbiAgICAgICAgICBwYXRjaDogcGFyc2VJbnQodmVyc2lvblsyXSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIHRoaXMucm9vdCA9IG9wdHMucm9vdCB8fCBwcm9jZXNzLmN3ZCgpO1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBvcHRzLmVudmlyb25tZW50IHx8ICdkZXZlbG9wbWVudCc7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIHRoaXMucnVubGV2ZWxzID0ge307XG4gICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSAwO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRSdW5sZXZlbE5hbWUoKSB7IHJldHVybiBBcHBDb250ZXh0LmdldFJ1bkxldmVsTmFtZSh0aGlzLmN1cnJlbnRSdW5sZXZlbCk7IH1cblxuICB0cmFuc2l0aW9uVG8obGV2ZWwgPSAxMCkge1xuICAgIGxldmVsID0gQXBwQ29udGV4dC5yZXNvbHZlUnVuTGV2ZWwobGV2ZWwpO1xuICAgIGlmIChsZXZlbCA8IHRoaXMuY3VycmVudFJ1bmxldmVsKSB7IHRocm93IG5ldyBFcnJvcignYXBwLWNvbnRleHQgY2FuIG9ubHkgdHJhbnNpdGlvbiB0byBhIGxldmVsIGdyZWF0IHRoYW4gdGhlIGN1cnJlbnQgcnVuIGxldmVsLicpOyB9XG4gICAgaWYgKGxldmVsID09PSB0aGlzLmN1cnJlbnRSdW5sZXZlbCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cblxuICAgIGlmIChnbG9iYWwuQVBQICE9PSB0aGlzKSB7IGdsb2JhbC5BUFAgPSB0aGlzOyB9XG5cbiAgICBsZXQgcnVubGV2ZWxzID0gT2JqZWN0LmtleXModGhpcy5ydW5sZXZlbHMpLm1hcCgobCkgPT4gcGFyc2VJbnQobCkpLmZpbHRlcigobCkgPT4gbCA+IHRoaXMuY3VycmVudFJ1bmxldmVsICYmIGwgPD0gbGV2ZWwpO1xuICAgIHJ1bmxldmVscy5zb3J0KCk7XG5cbiAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpJyk7XG5cbiAgICByZXR1cm4gcnVubGV2ZWxzLnJlZHVjZSgobGFzdFByb21pc2UsIHJ1bmxldmVsKSA9PiB7XG4gICAgICByZXR1cm4gbGFzdFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bmxldmVsc1tydW5sZXZlbF0udHJhbnNpdGlvbih0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRSdW5sZXZlbCA9IHJ1bmxldmVsO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRE9ORScpO1xuICAgICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSBsZXZlbDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRVJST1InKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZXNvbHZlUnVuTGV2ZWwobGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mKGxldmVsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChSdW5MZXZlbE1hcFtsZXZlbC50b0xvd2VyQ2FzZSgpXSA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gcnVuIGxldmVsIG5hbWVkICcgKyBsZXZlbCk7IH1cbiAgICAgIGxldmVsID0gUnVuTGV2ZWxNYXBbbGV2ZWwudG9Mb3dlckNhc2UoKV07XG4gICAgfVxuXG4gICAgaWYgKGxldmVsIDwgMCB8fCBsZXZlbCA+IDEwKSB7IHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgYXNrZWQgZm9yIGEgcnVuIGxldmVsIGlzIG91dHNpZGUgb2YgdGhlIGFsbG93ZWQgcmFuZ2UgKDAgLSAxMCknKTsgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG5cbiAgc3RhdGljIGdldFJ1bkxldmVsTmFtZShsZXZlbCkge1xuICAgIHJldHVybiBSdW5MZXZlbE1hcFtsZXZlbF07XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKGNvbnRleHRJbml0aWFsaXplciwgb3B0cykge1xuICAgIGNvbnN0IEJ1aWxkZXIgPSByZXF1aXJlKCcuL2J1aWxkZXInKTtcbiAgICBsZXQgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG5cbiAgICBpZiAodHlwZW9mKGNvbnRleHRJbml0aWFsaXplcikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRleHRJbml0aWFsaXplci5jYWxsKGJ1aWxkZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mKGNvbnRleHRJbml0aWFsaXplci5kZWZhdWx0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29udGV4dEluaXRpYWxpemVyLmRlZmF1bHQuY2FsbChidWlsZGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbXVzdCBwYXNzIGEgbWV0aG9kIHRvIGNyZWF0ZSBhbiBhcHAtY29udGV4dCcpO1xuICAgIH1cblxuICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XG4gICAgaWYgKG9wdHMuZW52aXJvbm1lbnQgPT0gbnVsbCkgeyBvcHRzLmVudmlyb25tZW50ID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlY7IH1cbiAgICBpZiAob3B0cy5yb290ID09IG51bGwpIHsgb3B0cy5yb290ID0gcHJvY2Vzcy5jd2QoKTsgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBBcHBDb250ZXh0KG9wdHMpO1xuXG4gICAgY29udGV4dC5ydW5sZXZlbHMgPSBidWlsZGVyLnJ1bmxldmVscztcblxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgc3RhdGljIGxvYWRGcm9tRmlsZShmaWxlbmFtZSwgb3B0cywgc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVuYW1lID0gcmVxdWlyZS5yZXNvbHZlKGZpbGVuYW1lKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnQ291bGQgbm90IGZpbmQgYW4gYXBwLWNvbnRleHQgYXQgJyArIGZpbGVuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBkZWJ1ZygnTG9hZCBmcm9tIGZpbGU6ICcgKyBmaWxlbmFtZSk7XG5cbiAgICBsZXQgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKTtcbiAgICBpZiAoZXh0ZW5zaW9uICE9PSAnLmpzJykgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnYXBwLWNvbnRleHQgY2FuIG9ubHkgYmUgbG9hZGVkIGZyb20gLmpzIGZpbGVzJyk7IH1cblxuICAgIC8vIGhhbmRsZSBiYWJlbC4uLlxuICAgIGNvbnN0IGJhYmVsRmlsZSA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnLmJhYmVscmMnKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhiYWJlbEZpbGUpKSB7XG4gICAgICBjb25zdCBiYWJlbERhdGEgPSBKU09OLnBhcnNlKGZzLnJlYWRGaWxlU3luYyhiYWJlbEZpbGUsICd1dGY4JykpO1xuXG4gICAgICBjb25zdCB1bm1ldFJlcXVpcmVtZW50cyA9IFtdLmNvbmNhdChcbiAgICAgICAgKGJhYmVsRGF0YS5wcmVzZXRzIHx8IFtdKS5tYXAoKHApID0+IGBiYWJlbC1wcmVzZXQtJHtwfWApLFxuICAgICAgICAoYmFiZWxEYXRhLnBsdWdpbnMgfHwgW10pLm1hcCgocCkgPT4gYGJhYmVsLXBsdWdpbi0ke3B9YClcbiAgICAgICkuZmlsdGVyKChuYW1lKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzJywgbmFtZSkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAodW5tZXRSZXF1aXJlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZShbXG4gICAgICAgICAgJ1VubWV0IGJhYmVsIHJlcXVpcmVtZW50czogJyArIHVubWV0UmVxdWlyZW1lbnRzLmpvaW4oJywgJyksXG4gICAgICAgICAgJ0ZpeCB0aGlzIGJ5IHJ1bm5pbmcgXCJucG0gaW5zdGFsbCAtLXNhdmUgLS1zYXZlLWV4YWN0ICcgKyB1bm1ldFJlcXVpcmVtZW50cy5qb2luKCcgJykgKyAnXCInXG4gICAgICAgIF0uam9pbihvcy5FT0wpKVxuICAgICAgfVxuXG4gICAgICByZXF1aXJlKCdiYWJlbC1yZWdpc3RlcicpKHtcbiAgICAgICAgc291cmNlUm9vdDogcHJvY2Vzcy5jd2QoKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbGV0IGNvbnRleHRJbml0aWFsaXplciA9IHJlcXVpcmUoZmlsZW5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZShjb250ZXh0SW5pdGlhbGl6ZXIsIG9wdHMpO1xuICB9XG5cbiAgc3RhdGljIGZpbmRQYWNrYWdlRmlsZShkaXIpIHtcbiAgICBpZiAoZGlyID09IG51bGwpIGRpciA9IHByb2Nlc3MuY3dkKCk7XG5cbiAgICBsZXQgcGFja2FnZUZpbGUgPSBwYXRoLmpvaW4oZGlyLCAncGFja2FnZS5qc29uJyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGFja2FnZUZpbGUpKSB7XG4gICAgICBkZWJ1ZygnRm91bmQgcGFja2FnZS5qc29uIGF0OiAnICsgcGFja2FnZUZpbGUpO1xuICAgICAgcmV0dXJuIHBhY2thZ2VGaWxlO1xuICAgIH1cbiAgICBpZiAoZGlyID09PSBwYXRoLnNlcCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgcmV0dXJuIHRoaXMuZmluZFBhY2thZ2VGaWxlKHBhdGguam9pbihkaXIsICcuLicpKTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kQW5kTG9hZFBhY2thZ2UoZGlyKSB7XG4gICAgbGV0IHBhY2thZ2VGaWxlID0gdGhpcy5maW5kUGFja2FnZUZpbGUoZGlyKTtcbiAgICBpZiAocGFja2FnZUZpbGUgPT0gbnVsbCkgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnVW5hYmxlIHRvIGZpbmQgcGFja2FnZS5qc29uIGZpbGUnKTsgfVxuXG4gICAgcmV0dXJuIHJlcXVpcmUocGFja2FnZUZpbGUpO1xuICB9XG5cbiAgc3RhdGljIGdldEFwcENvbnRleHRGaWxlbmFtZUZyb21QYWNrYWdlKHNob3VsZFRocm93ID0gdHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQW5kTG9hZFBhY2thZ2UoKVsnYXBwLWNvbnRleHQnXTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykgeyB0aHJvdyBlcnI7IH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbG9hZEdsb2JhbCgpIHtcbiAgICBjb25zdCByb290ID0gb3NlbnYuaG9tZSgpO1xuICAgIHJldHVybiB0aGlzLmxvYWRGcm9tRmlsZShwYXRoLmpvaW4ocm9vdCwgJ2FwcC1jb250ZXh0JyksIHtyb290OiByb290fSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZEZyb21QYWNrYWdlKHNob3VsZFRocm93ID0gdHJ1ZSkge1xuICAgIGxldCBmaWxlbmFtZSA9IHRoaXMuZ2V0QXBwQ29udGV4dEZpbGVuYW1lRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cpO1xuICAgIGlmIChmaWxlbmFtZSA9PSBudWxsKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1lvdXIgcGFja2FnZS5qc29uIGRvZXMgbm90IGRlZmluZSBhbiBcImFwcC1jb250ZXh0XCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWJ1ZygnRm91bmQgY29udGV4dCBpbiBwYWNrYWdlOiAnICsgZmlsZW5hbWUpO1xuICAgIHJldHVybiB0aGlzLmxvYWRGcm9tRmlsZShmaWxlbmFtZSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZCgvKiBvcHRpb25hbCAqLyBmaWxlbmFtZSkge1xuICAgIGxldCBjb250ZXh0ID0gbnVsbDtcblxuICAgIGlmIChmaWxlbmFtZSkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbUZpbGUoZmlsZW5hbWUpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbVBhY2thZ2UoZmFsc2UpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbUZpbGUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdhcHAtY29udGV4dCcpLCB7fSwgZmFsc2UpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgZGVidWcoJ05vIGNvbnRleHQgZmlsZSwgbG9hZGluZyBhbiBlbXB0eSBjb250ZXh0Jyk7XG4gICAgICBjb250ZXh0ID0gdGhpcy5jcmVhdGUoZnVuY3Rpb24oKXt9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxufVxuXG5BcHBDb250ZXh0LlJ1bkxldmVsID0gUnVuTGV2ZWw7XG4iXX0=