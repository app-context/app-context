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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAtY29udGV4dC5qcyJdLCJuYW1lcyI6WyJlcnJvcnMiLCJkZWJ1ZyIsInJlcXVpcmUiLCJSdW5MZXZlbCIsIk5vbmUiLCJTZXR1cCIsIkNvbmZpZ3VyZWQiLCJDb25uZWN0ZWQiLCJJbml0aWFsaXplZCIsIlJ1bm5pbmciLCJSdW5MZXZlbE1hcCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJvIiwiayIsInYiLCJ0b0xvd2VyQ2FzZSIsIkFwcENvbnRleHQiLCJvcHRzIiwicGFja2FnZUZpbGUiLCJmaW5kUGFja2FnZUZpbGUiLCJwYWNrYWdlIiwibmFtZSIsInZlcnNpb24iLCJ0ZXN0Iiwic3BsaXQiLCJtYWpvciIsInBhcnNlSW50IiwibWlub3IiLCJwYXRjaCIsInJvb3QiLCJwcm9jZXNzIiwiY3dkIiwiZW52aXJvbm1lbnQiLCJjb25maWciLCJydW5sZXZlbHMiLCJjdXJyZW50UnVubGV2ZWwiLCJsZXZlbCIsInJlc29sdmVSdW5MZXZlbCIsIkVycm9yIiwiUHJvbWlzZSIsInJlc29sdmUiLCJnbG9iYWwiLCJBUFAiLCJtYXAiLCJsIiwiZmlsdGVyIiwic29ydCIsImpvaW4iLCJsYXN0UHJvbWlzZSIsInJ1bmxldmVsIiwidGhlbiIsInRyYW5zaXRpb24iLCJjYXRjaCIsImVyciIsImdldFJ1bkxldmVsTmFtZSIsImNvbnRleHRJbml0aWFsaXplciIsIkJ1aWxkZXIiLCJidWlsZGVyIiwiY2FsbCIsImRlZmF1bHQiLCJlbnYiLCJOT0RFX0VOViIsImNvbnRleHQiLCJiYWJlbEZpbGUiLCJwa2ciLCJmaW5kQW5kTG9hZFBhY2thZ2UiLCJiYWJlbENvbmZpZyIsImV4aXN0c1N5bmMiLCJKU09OIiwicGFyc2UiLCJyZWFkRmlsZVN5bmMiLCJiYWJlbCIsInVubWV0UmVxdWlyZW1lbnRzIiwiY29uY2F0IiwicHJlc2V0cyIsInAiLCJzdGFydHNXaXRoIiwicGx1Z2lucyIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsIm1lc3NhZ2UiLCJFT0wiLCJzb3VyY2VSb290IiwiZmlsZW5hbWUiLCJzaG91bGRUaHJvdyIsImV4dGVuc2lvbiIsImV4dG5hbWUiLCJsb2FkQmFiZWwiLCJjcmVhdGUiLCJkaXIiLCJzZXAiLCJ1bmRlZmluZWQiLCJob21lIiwibG9hZEZyb21GaWxlIiwiZ2V0QXBwQ29udGV4dEZpbGVuYW1lRnJvbVBhY2thZ2UiLCJsb2FkRnJvbVBhY2thZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztJQUFZQSxNOzs7Ozs7OztBQUVaLElBQU1DLFFBQVFDLFFBQVEsT0FBUixFQUFpQixhQUFqQixDQUFkOztBQUVBLElBQU1DLFdBQVc7QUFDZkMsUUFBTSxDQURTO0FBRWZDLFNBQU8sQ0FGUTtBQUdmQyxjQUFZLENBSEc7QUFJZkMsYUFBVyxDQUpJO0FBS2ZDLGVBQWEsQ0FMRTtBQU1mQyxXQUFTO0FBTk0sQ0FBakI7O0FBU0EsSUFBTUMsY0FBY0MsT0FBT0MsSUFBUCxDQUFZVCxRQUFaLEVBQXNCVSxNQUF0QixDQUE2QixVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUN6RCxNQUFJQyxJQUFJYixTQUFTWSxDQUFULENBQVI7QUFDQUQsSUFBRUMsRUFBRUUsV0FBRixFQUFGLElBQXFCRCxDQUFyQjtBQUNBRixJQUFFRSxDQUFGLElBQU9ELENBQVA7QUFDQSxTQUFPRCxDQUFQO0FBQ0QsQ0FMbUIsRUFLakIsRUFMaUIsQ0FBcEI7O0FBT0E7Ozs7SUFHcUJJLFU7QUFDbkIsc0JBQVlDLElBQVosRUFBa0I7QUFBQTs7QUFDaEIsUUFBSUMsY0FBY0YsV0FBV0csZUFBWCxFQUFsQjs7QUFFQSxRQUFJRCxXQUFKLEVBQWlCO0FBQ2YsV0FBS0UsT0FBTCxHQUFlcEIsUUFBUWtCLFdBQVIsQ0FBZjtBQUNBLFVBQUksS0FBS0UsT0FBTCxDQUFhQyxJQUFqQixFQUF1QjtBQUNyQixhQUFLQSxJQUFMLEdBQVksS0FBS0QsT0FBTCxDQUFhQyxJQUF6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SStCLFdBQVcsSUFBZixFQUFxQjtBQUNuQi9ELGNBQU0sMkNBQU47QUFDQStELGtCQUFVLEtBQUsyQixNQUFMLENBQVksWUFBVSxDQUFFLENBQXhCLENBQVY7QUFDRDs7QUFFRCxhQUFPM0IsT0FBUDtBQUNEOzs7Ozs7a0JBbk9rQjlDLFU7OztBQXNPckJBLFdBQVdmLFFBQVgsR0FBc0JBLFFBQXRCIiwiZmlsZSI6ImFwcC1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuaW1wb3J0IGVzNnJlcXVpcmUgZnJvbSAnQG1hdHRpbnNsZXIvZXM2cmVxdWlyZSc7XG5cbmltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuL2Vycm9ycyc7XG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwLWNvbnRleHQnKTtcblxuY29uc3QgUnVuTGV2ZWwgPSB7XG4gIE5vbmU6IDAsXG4gIFNldHVwOiAxLFxuICBDb25maWd1cmVkOiAzLFxuICBDb25uZWN0ZWQ6IDUsXG4gIEluaXRpYWxpemVkOiA3LFxuICBSdW5uaW5nOiA5XG59O1xuXG5jb25zdCBSdW5MZXZlbE1hcCA9IE9iamVjdC5rZXlzKFJ1bkxldmVsKS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgbGV0IHYgPSBSdW5MZXZlbFtrXTtcbiAgb1trLnRvTG93ZXJDYXNlKCldID0gdjtcbiAgb1t2XSA9IGs7XG4gIHJldHVybiBvO1xufSwge30pO1xuXG4vKipcbiAqIEBjbGFzcyBBcHBDb250ZXh0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgbGV0IHBhY2thZ2VGaWxlID0gQXBwQ29udGV4dC5maW5kUGFja2FnZUZpbGUoKTtcblxuICAgIGlmIChwYWNrYWdlRmlsZSkge1xuICAgICAgdGhpcy5wYWNrYWdlID0gcmVxdWlyZShwYWNrYWdlRmlsZSk7XG4gICAgICBpZiAodGhpcy5wYWNrYWdlLm5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYWNrYWdlLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYWNrYWdlLnZlcnNpb24gJiYgL15bMC05XStcXC5bMC05XStcXC5bMC05XSskLy50ZXN0KHRoaXMucGFja2FnZS52ZXJzaW9uKSkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHRoaXMucGFja2FnZS52ZXJzaW9uLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgdGhpcy52ZXJzaW9uID0ge1xuICAgICAgICAgIG1ham9yOiBwYXJzZUludCh2ZXJzaW9uWzBdKSxcbiAgICAgICAgICBtaW5vcjogcGFyc2VJbnQodmVyc2lvblsxXSksXG4gICAgICAgICAgcGF0Y2g6IHBhcnNlSW50KHZlcnNpb25bMl0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cbiAgICB0aGlzLnJvb3QgPSBvcHRzLnJvb3QgfHwgcHJvY2Vzcy5jd2QoKTtcbiAgICB0aGlzLmVudmlyb25tZW50ID0gb3B0cy5lbnZpcm9ubWVudCB8fCAnZGV2ZWxvcG1lbnQnO1xuXG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLnJ1bmxldmVscyA9IHt9O1xuICAgIHRoaXMuY3VycmVudFJ1bmxldmVsID0gMDtcbiAgfVxuXG4gIGdldCBjdXJyZW50UnVubGV2ZWxOYW1lKCkgeyByZXR1cm4gQXBwQ29udGV4dC5nZXRSdW5MZXZlbE5hbWUodGhpcy5jdXJyZW50UnVubGV2ZWwpOyB9XG5cbiAgdHJhbnNpdGlvblRvKGxldmVsID0gMTApIHtcbiAgICBsZXZlbCA9IEFwcENvbnRleHQucmVzb2x2ZVJ1bkxldmVsKGxldmVsKTtcbiAgICBpZiAobGV2ZWwgPCB0aGlzLmN1cnJlbnRSdW5sZXZlbCkgeyB0aHJvdyBuZXcgRXJyb3IoJ2FwcC1jb250ZXh0IGNhbiBvbmx5IHRyYW5zaXRpb24gdG8gYSBsZXZlbCBncmVhdCB0aGFuIHRoZSBjdXJyZW50IHJ1biBsZXZlbC4nKTsgfVxuICAgIGlmIChsZXZlbCA9PT0gdGhpcy5jdXJyZW50UnVubGV2ZWwpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyB9XG5cbiAgICBpZiAoZ2xvYmFsLkFQUCAhPT0gdGhpcykgeyBnbG9iYWwuQVBQID0gdGhpczsgfVxuXG4gICAgbGV0IHJ1bmxldmVscyA9IE9iamVjdC5rZXlzKHRoaXMucnVubGV2ZWxzKS5tYXAoKGwpID0+IHBhcnNlSW50KGwpKS5maWx0ZXIoKGwpID0+IGwgPiB0aGlzLmN1cnJlbnRSdW5sZXZlbCAmJiBsIDw9IGxldmVsKTtcbiAgICBydW5sZXZlbHMuc29ydCgpO1xuXG4gICAgZGVidWcoJ3RyYW5zaXRpb24gJyArIHRoaXMuY3VycmVudFJ1bmxldmVsICsgJyA9PiAnICsgbGV2ZWwgKyAnICgnICsgcnVubGV2ZWxzLmpvaW4oJywgJykgKyAnKScpO1xuXG4gICAgcmV0dXJuIHJ1bmxldmVscy5yZWR1Y2UoKGxhc3RQcm9taXNlLCBydW5sZXZlbCkgPT4ge1xuICAgICAgcmV0dXJuIGxhc3RQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5sZXZlbHNbcnVubGV2ZWxdLnRyYW5zaXRpb24odGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSBydW5sZXZlbDtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpIERPTkUnKTtcbiAgICAgIHRoaXMuY3VycmVudFJ1bmxldmVsID0gbGV2ZWw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpIEVSUk9SJyk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcmVzb2x2ZVJ1bkxldmVsKGxldmVsKSB7XG4gICAgaWYgKHR5cGVvZihsZXZlbCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoUnVuTGV2ZWxNYXBbbGV2ZWwudG9Mb3dlckNhc2UoKV0gPT0gbnVsbCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHJ1biBsZXZlbCBuYW1lZCAnICsgbGV2ZWwpOyB9XG4gICAgICBsZXZlbCA9IFJ1bkxldmVsTWFwW2xldmVsLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cblxuICAgIGlmIChsZXZlbCA8IDAgfHwgbGV2ZWwgPiAxMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBoYXZlIGFza2VkIGZvciBhIHJ1biBsZXZlbCBpcyBvdXRzaWRlIG9mIHRoZSBhbGxvd2VkIHJhbmdlICgwIC0gMTApJyk7IH1cblxuICAgIHJldHVybiBsZXZlbDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRSdW5MZXZlbE5hbWUobGV2ZWwpIHtcbiAgICByZXR1cm4gUnVuTGV2ZWxNYXBbbGV2ZWxdO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShjb250ZXh0SW5pdGlhbGl6ZXIsIG9wdHMpIHtcbiAgICBjb25zdCBCdWlsZGVyID0gcmVxdWlyZSgnLi9idWlsZGVyJyk7XG4gICAgbGV0IGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuXG4gICAgaWYgKHR5cGVvZihjb250ZXh0SW5pdGlhbGl6ZXIpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb250ZXh0SW5pdGlhbGl6ZXIuY2FsbChidWlsZGVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihjb250ZXh0SW5pdGlhbGl6ZXIuZGVmYXVsdCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRleHRJbml0aWFsaXplci5kZWZhdWx0LmNhbGwoYnVpbGRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcGFzcyBhIG1ldGhvZCB0byBjcmVhdGUgYW4gYXBwLWNvbnRleHQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIGlmIChvcHRzLmVudmlyb25tZW50ID09IG51bGwpIHsgb3B0cy5lbnZpcm9ubWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WOyB9XG4gICAgaWYgKG9wdHMucm9vdCA9PSBudWxsKSB7IG9wdHMucm9vdCA9IHByb2Nlc3MuY3dkKCk7IH1cblxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQXBwQ29udGV4dChvcHRzKTtcblxuICAgIGNvbnRleHQucnVubGV2ZWxzID0gYnVpbGRlci5ydW5sZXZlbHM7XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkQmFiZWwoKSB7XG4gICAgY29uc3QgYmFiZWxGaWxlID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuYmFiZWxyYycpO1xuICAgIGNvbnN0IHBrZyA9IHRoaXMuZmluZEFuZExvYWRQYWNrYWdlKCk7XG5cbiAgICBsZXQgYmFiZWxDb25maWc7XG5cbiAgICBpZiAoZnMuZXhpc3RzU3luYyhiYWJlbEZpbGUpKSB7XG4gICAgICBiYWJlbENvbmZpZyA9IEpTT04ucGFyc2UoZnMucmVhZEZpbGVTeW5jKGJhYmVsRmlsZSwgJ3V0ZjgnKSk7XG4gICAgfSBlbHNlIGlmIChwa2cgJiYgcGtnLmJhYmVsKSB7XG4gICAgICBiYWJlbENvbmZpZyA9IHBrZy5iYWJlbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb25cbiAgICAvLyBpZiAoYmFiZWxDb25maWcuZW52KSB7XG4gICAgLy8gICBjb25zdCBlbnZpcm9ubWVudCA9IHByb2Nlc3MuZW52LkJBQkVMX0VOViB8fCBwcm9jZXNzLmVudi5OT0RFX0VOViB8fCAnZGV2ZWxvcG1lbnQnO1xuICAgIC8vICAgaWYgKGJhYmVsQ29uZmlnLmVudltlbnZpcm9ubWVudF0pIHtcbiAgICAvL1xuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICAgIGNvbnN0IHVubWV0UmVxdWlyZW1lbnRzID0gW10uY29uY2F0KFxuICAgICAgKGJhYmVsQ29uZmlnLnByZXNldHMgfHwgW10pLm1hcCgocCkgPT4ge1xuICAgICAgICByZXR1cm4gcC5zdGFydHNXaXRoKCdiYWJlbC1wcmVzZXQtJykgPyBwIDogYGJhYmVsLXByZXNldC0ke3B9YDtcbiAgICAgIH0pLFxuICAgICAgKGJhYmVsQ29uZmlnLnBsdWdpbnMgfHwgW10pLm1hcCgocCkgPT4ge1xuICAgICAgICBjb25zdCBuYW1lID0gQXJyYXkuaXNBcnJheShwKSA/IHBbMF0gOiBwO1xuICAgICAgICByZXR1cm4gbmFtZS5zdGFydHNXaXRoKCdiYWJlbC1wbHVnaW4tJykgPyBuYW1lIDogYGJhYmVsLXBsdWdpbi0ke25hbWV9YDtcbiAgICAgIH0pXG4gICAgKS5maWx0ZXIoKG5hbWUpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlcXVpcmUucmVzb2x2ZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcycsIG5hbWUpKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHVubWV0UmVxdWlyZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKFtcbiAgICAgICAgJ1VubWV0IGJhYmVsIHJlcXVpcmVtZW50czogJyArIHVubWV0UmVxdWlyZW1lbnRzLmpvaW4oJywgJyksXG4gICAgICAgICdGaXggdGhpcyBieSBydW5uaW5nIFwibnBtIGluc3RhbGwgLS1zYXZlIC0tc2F2ZS1leGFjdCAnICsgdW5tZXRSZXF1aXJlbWVudHMuam9pbignICcpICsgJ1wiJ1xuICAgICAgXS5qb2luKG9zLkVPTCkpO1xuICAgIH1cblxuICAgIHJlcXVpcmUoJ2JhYmVsLXJlZ2lzdGVyJykoe1xuICAgICAgc291cmNlUm9vdDogcHJvY2Vzcy5jd2QoKVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRGcm9tRmlsZShmaWxlbmFtZSwgb3B0cywgc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVuYW1lID0gcmVxdWlyZS5yZXNvbHZlKGZpbGVuYW1lKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnQ291bGQgbm90IGZpbmQgYW4gYXBwLWNvbnRleHQgYXQgJyArIGZpbGVuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBkZWJ1ZygnTG9hZCBmcm9tIGZpbGU6ICcgKyBmaWxlbmFtZSk7XG5cbiAgICBsZXQgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKTtcbiAgICBpZiAoZXh0ZW5zaW9uICE9PSAnLmpzJykgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnYXBwLWNvbnRleHQgY2FuIG9ubHkgYmUgbG9hZGVkIGZyb20gLmpzIGZpbGVzJyk7IH1cblxuICAgIHRoaXMubG9hZEJhYmVsKCk7XG5cbiAgICBsZXQgY29udGV4dEluaXRpYWxpemVyID0gZXM2cmVxdWlyZShmaWxlbmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlKGNvbnRleHRJbml0aWFsaXplciwgb3B0cyk7XG4gIH1cblxuICBzdGF0aWMgZmluZFBhY2thZ2VGaWxlKGRpcikge1xuICAgIGlmIChkaXIgPT0gbnVsbCkgZGlyID0gcHJvY2Vzcy5jd2QoKTtcblxuICAgIGxldCBwYWNrYWdlRmlsZSA9IHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYWNrYWdlRmlsZSkpIHtcbiAgICAgIGRlYnVnKCdGb3VuZCBwYWNrYWdlLmpzb24gYXQ6ICcgKyBwYWNrYWdlRmlsZSk7XG4gICAgICByZXR1cm4gcGFja2FnZUZpbGU7XG4gICAgfVxuICAgIGlmIChkaXIgPT09IHBhdGguc2VwKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICByZXR1cm4gdGhpcy5maW5kUGFja2FnZUZpbGUocGF0aC5qb2luKGRpciwgJy4uJykpO1xuICB9XG5cbiAgc3RhdGljIGZpbmRBbmRMb2FkUGFja2FnZShkaXIpIHtcbiAgICBsZXQgcGFja2FnZUZpbGUgPSB0aGlzLmZpbmRQYWNrYWdlRmlsZShkaXIpO1xuICAgIGlmIChwYWNrYWdlRmlsZSA9PSBudWxsKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdVbmFibGUgdG8gZmluZCBwYWNrYWdlLmpzb24gZmlsZScpOyB9XG5cbiAgICByZXR1cm4gcmVxdWlyZShwYWNrYWdlRmlsZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0QXBwQ29udGV4dEZpbGVuYW1lRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRBbmRMb2FkUGFja2FnZSgpWydhcHAtY29udGV4dCddO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7IHRocm93IGVycjsgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBsb2FkR2xvYmFsKCkge1xuICAgIGNvbnN0IHJvb3QgPSBvc2Vudi5ob21lKCk7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZyb21GaWxlKHBhdGguam9pbihyb290LCAnYXBwLWNvbnRleHQnKSwge3Jvb3Q6IHJvb3R9KTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy5nZXRBcHBDb250ZXh0RmlsZW5hbWVGcm9tUGFja2FnZShzaG91bGRUaHJvdyk7XG4gICAgaWYgKGZpbGVuYW1lID09IG51bGwpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnWW91ciBwYWNrYWdlLmpzb24gZG9lcyBub3QgZGVmaW5lIGFuIFwiYXBwLWNvbnRleHRcIi4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCdGb3VuZCBjb250ZXh0IGluIHBhY2thZ2U6ICcgKyBmaWxlbmFtZSk7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZyb21GaWxlKGZpbGVuYW1lKTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkKC8qIG9wdGlvbmFsICovIGZpbGVuYW1lKSB7XG4gICAgbGV0IGNvbnRleHQgPSBudWxsO1xuXG4gICAgaWYgKGZpbGVuYW1lKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tRmlsZShmaWxlbmFtZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tUGFja2FnZShmYWxzZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tRmlsZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2FwcC1jb250ZXh0JyksIHt9LCBmYWxzZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgICBkZWJ1ZygnTm8gY29udGV4dCBmaWxlLCBsb2FkaW5nIGFuIGVtcHR5IGNvbnRleHQnKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzLmNyZWF0ZShmdW5jdGlvbigpe30pO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG59XG5cbkFwcENvbnRleHQuUnVuTGV2ZWwgPSBSdW5MZXZlbDtcbiJdfQ==