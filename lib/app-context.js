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

var _babelTools = require('./babel-tools');

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
      if (!(0, _babelTools.hasBabel)()) {
        return;
      }

      var unmetRequirements = (0, _babelTools.getBabelModuleNames)().filter(function (name) {
        try {
          require.resolve(_path2.default.join(process.cwd(), 'node_modules', name));
          return false;
        } catch (err) {
          return true;
        }
      });

      if (unmetRequirements.length === 0) {
        return (0, _babelTools.registerBabel)();
      }

      throw errors.message(['Unmet babel requirements: ' + unmetRequirements.join(', '), 'To fix this, either run:', '  "app-context install"', 'or', '  Fix this by running "npm install --save --save-exact ' + unmetRequirements.join(' ') + '"'].join(_os2.default.EOL));
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
//# sourceMappingURL=data:application/json;base64,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LEVBQWlCO0FBQ2YsZ0JBQU0sT0FBTyxPQUFQLENBQWUscURBQWYsQ0FBTjtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFPLElBQVA7QUFDRDtBQUNGOztBQUVELFlBQU0sK0JBQStCLFFBQXJDO0FBQ0EsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsUUFBbEIsQ0FBUDtBQUNEOzs7d0NBRTBCLFEsRUFBVTtBQUNuQyxVQUFJLFVBQVUsSUFBZDs7QUFFQSxVQUFJLFFBQUosRUFBYztBQUFFLGtCQUFVLEtBQUssWUFBTCxDQUFrQixRQUFsQixDQUFWO0FBQXdDO0FBQ3hELFVBQUksV0FBVyxJQUFmLEVBQXFCO0FBQUUsa0JBQVUsS0FBSyxlQUFMLENBQXFCLEtBQXJCLENBQVY7QUFBd0M7QUFDL0QsVUFBSSxXQUFXLElBQWYsRUFBcUI7QUFBRSxrQkFBVSxLQUFLLFlBQUwsQ0FBa0IsZUFBSyxJQUFMLENBQVUsUUFBUSxHQUFSLEVBQVYsRUFBeUIsYUFBekIsQ0FBbEIsRUFBMkQsRUFBM0QsRUFBK0QsS0FBL0QsQ0FBVjtBQUFrRjtBQUN6RyxVQUFJLFdBQVcsSUFBZixFQUFxQjtBQUNuQixjQUFNLDJDQUFOO0FBQ0Esa0JBQVUsS0FBSyxNQUFMLENBQVksWUFBVSxDQUFFLENBQXhCLENBQVY7QUFDRDs7QUFFRCxhQUFPLE9BQVA7QUFDRDs7Ozs7O2tCQXpNa0IsVTs7O0FBNE1yQixXQUFXLFFBQVgsR0FBc0IsUUFBdEIiLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBvc2VudiBmcm9tICdvc2Vudic7XG5pbXBvcnQgZXM2cmVxdWlyZSBmcm9tICdAbWF0dGluc2xlci9lczZyZXF1aXJlJztcblxuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4vZXJyb3JzJztcbmltcG9ydCB7IGdldEJhYmVsTW9kdWxlTmFtZXMsIGhhc0JhYmVsLCByZWdpc3RlckJhYmVsIH0gZnJvbSAnLi9iYWJlbC10b29scyc7XG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwLWNvbnRleHQnKTtcblxuY29uc3QgUnVuTGV2ZWwgPSB7XG4gIE5vbmU6IDAsXG4gIFNldHVwOiAxLFxuICBDb25maWd1cmVkOiAzLFxuICBDb25uZWN0ZWQ6IDUsXG4gIEluaXRpYWxpemVkOiA3LFxuICBSdW5uaW5nOiA5XG59O1xuXG5jb25zdCBSdW5MZXZlbE1hcCA9IE9iamVjdC5rZXlzKFJ1bkxldmVsKS5yZWR1Y2UoKG8sIGspID0+IHtcbiAgbGV0IHYgPSBSdW5MZXZlbFtrXTtcbiAgb1trLnRvTG93ZXJDYXNlKCldID0gdjtcbiAgb1t2XSA9IGs7XG4gIHJldHVybiBvO1xufSwge30pO1xuXG4vKipcbiAqIEBjbGFzcyBBcHBDb250ZXh0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENvbnRleHQge1xuICBjb25zdHJ1Y3RvcihvcHRzKSB7XG4gICAgbGV0IHBhY2thZ2VGaWxlID0gQXBwQ29udGV4dC5maW5kUGFja2FnZUZpbGUoKTtcblxuICAgIGlmIChwYWNrYWdlRmlsZSkge1xuICAgICAgdGhpcy5wYWNrYWdlID0gcmVxdWlyZShwYWNrYWdlRmlsZSk7XG4gICAgICBpZiAodGhpcy5wYWNrYWdlLm5hbWUpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wYWNrYWdlLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5wYWNrYWdlLnZlcnNpb24gJiYgL15bMC05XStcXC5bMC05XStcXC5bMC05XSskLy50ZXN0KHRoaXMucGFja2FnZS52ZXJzaW9uKSkge1xuICAgICAgICB2YXIgdmVyc2lvbiA9IHRoaXMucGFja2FnZS52ZXJzaW9uLnNwbGl0KCcuJyk7XG5cbiAgICAgICAgdGhpcy52ZXJzaW9uID0ge1xuICAgICAgICAgIG1ham9yOiBwYXJzZUludCh2ZXJzaW9uWzBdKSxcbiAgICAgICAgICBtaW5vcjogcGFyc2VJbnQodmVyc2lvblsxXSksXG4gICAgICAgICAgcGF0Y2g6IHBhcnNlSW50KHZlcnNpb25bMl0pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cbiAgICB0aGlzLnJvb3QgPSBvcHRzLnJvb3QgfHwgcHJvY2Vzcy5jd2QoKTtcbiAgICB0aGlzLmVudmlyb25tZW50ID0gb3B0cy5lbnZpcm9ubWVudCB8fCAnZGV2ZWxvcG1lbnQnO1xuXG4gICAgdGhpcy5jb25maWcgPSB7fTtcbiAgICB0aGlzLnJ1bmxldmVscyA9IHt9O1xuICAgIHRoaXMuY3VycmVudFJ1bmxldmVsID0gMDtcbiAgfVxuXG4gIGdldCBjdXJyZW50UnVubGV2ZWxOYW1lKCkgeyByZXR1cm4gQXBwQ29udGV4dC5nZXRSdW5MZXZlbE5hbWUodGhpcy5jdXJyZW50UnVubGV2ZWwpOyB9XG5cbiAgdHJhbnNpdGlvblRvKGxldmVsID0gMTApIHtcbiAgICBsZXZlbCA9IEFwcENvbnRleHQucmVzb2x2ZVJ1bkxldmVsKGxldmVsKTtcbiAgICBpZiAobGV2ZWwgPCB0aGlzLmN1cnJlbnRSdW5sZXZlbCkgeyB0aHJvdyBuZXcgRXJyb3IoJ2FwcC1jb250ZXh0IGNhbiBvbmx5IHRyYW5zaXRpb24gdG8gYSBsZXZlbCBncmVhdCB0aGFuIHRoZSBjdXJyZW50IHJ1biBsZXZlbC4nKTsgfVxuICAgIGlmIChsZXZlbCA9PT0gdGhpcy5jdXJyZW50UnVubGV2ZWwpIHsgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpOyB9XG5cbiAgICBpZiAoZ2xvYmFsLkFQUCAhPT0gdGhpcykgeyBnbG9iYWwuQVBQID0gdGhpczsgfVxuXG4gICAgbGV0IHJ1bmxldmVscyA9IE9iamVjdC5rZXlzKHRoaXMucnVubGV2ZWxzKS5tYXAoKGwpID0+IHBhcnNlSW50KGwpKS5maWx0ZXIoKGwpID0+IGwgPiB0aGlzLmN1cnJlbnRSdW5sZXZlbCAmJiBsIDw9IGxldmVsKTtcbiAgICBydW5sZXZlbHMuc29ydCgpO1xuXG4gICAgZGVidWcoJ3RyYW5zaXRpb24gJyArIHRoaXMuY3VycmVudFJ1bmxldmVsICsgJyA9PiAnICsgbGV2ZWwgKyAnICgnICsgcnVubGV2ZWxzLmpvaW4oJywgJykgKyAnKScpO1xuXG4gICAgcmV0dXJuIHJ1bmxldmVscy5yZWR1Y2UoKGxhc3RQcm9taXNlLCBydW5sZXZlbCkgPT4ge1xuICAgICAgcmV0dXJuIGxhc3RQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5ydW5sZXZlbHNbcnVubGV2ZWxdLnRyYW5zaXRpb24odGhpcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSBydW5sZXZlbDtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9LCBQcm9taXNlLnJlc29sdmUoKSkudGhlbigoKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpIERPTkUnKTtcbiAgICAgIHRoaXMuY3VycmVudFJ1bmxldmVsID0gbGV2ZWw7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpIEVSUk9SJyk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcmVzb2x2ZVJ1bkxldmVsKGxldmVsKSB7XG4gICAgaWYgKHR5cGVvZihsZXZlbCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoUnVuTGV2ZWxNYXBbbGV2ZWwudG9Mb3dlckNhc2UoKV0gPT0gbnVsbCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGlzIG5vIHJ1biBsZXZlbCBuYW1lZCAnICsgbGV2ZWwpOyB9XG4gICAgICBsZXZlbCA9IFJ1bkxldmVsTWFwW2xldmVsLnRvTG93ZXJDYXNlKCldO1xuICAgIH1cblxuICAgIGlmIChsZXZlbCA8IDAgfHwgbGV2ZWwgPiAxMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBoYXZlIGFza2VkIGZvciBhIHJ1biBsZXZlbCBpcyBvdXRzaWRlIG9mIHRoZSBhbGxvd2VkIHJhbmdlICgwIC0gMTApJyk7IH1cblxuICAgIHJldHVybiBsZXZlbDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRSdW5MZXZlbE5hbWUobGV2ZWwpIHtcbiAgICByZXR1cm4gUnVuTGV2ZWxNYXBbbGV2ZWxdO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZShjb250ZXh0SW5pdGlhbGl6ZXIsIG9wdHMpIHtcbiAgICBjb25zdCBCdWlsZGVyID0gcmVxdWlyZSgnLi9idWlsZGVyJyk7XG4gICAgbGV0IGJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuXG4gICAgaWYgKHR5cGVvZihjb250ZXh0SW5pdGlhbGl6ZXIpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb250ZXh0SW5pdGlhbGl6ZXIuY2FsbChidWlsZGVyKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihjb250ZXh0SW5pdGlhbGl6ZXIuZGVmYXVsdCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRleHRJbml0aWFsaXplci5kZWZhdWx0LmNhbGwoYnVpbGRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcGFzcyBhIG1ldGhvZCB0byBjcmVhdGUgYW4gYXBwLWNvbnRleHQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIGlmIChvcHRzLmVudmlyb25tZW50ID09IG51bGwpIHsgb3B0cy5lbnZpcm9ubWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WOyB9XG4gICAgaWYgKG9wdHMucm9vdCA9PSBudWxsKSB7IG9wdHMucm9vdCA9IHByb2Nlc3MuY3dkKCk7IH1cblxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQXBwQ29udGV4dChvcHRzKTtcblxuICAgIGNvbnRleHQucnVubGV2ZWxzID0gYnVpbGRlci5ydW5sZXZlbHM7XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkQmFiZWwoKSB7XG4gICAgaWYgKCFoYXNCYWJlbCgpKSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgdW5tZXRSZXF1aXJlbWVudHMgPSBnZXRCYWJlbE1vZHVsZU5hbWVzKCkuZmlsdGVyKG5hbWUgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbm9kZV9tb2R1bGVzJywgbmFtZSkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodW5tZXRSZXF1aXJlbWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gcmVnaXN0ZXJCYWJlbCgpO1xuICAgIH1cblxuICAgIHRocm93IGVycm9ycy5tZXNzYWdlKFtcbiAgICAgIGBVbm1ldCBiYWJlbCByZXF1aXJlbWVudHM6ICR7dW5tZXRSZXF1aXJlbWVudHMuam9pbignLCAnKX1gLFxuICAgICAgJ1RvIGZpeCB0aGlzLCBlaXRoZXIgcnVuOicsXG4gICAgICAnICBcImFwcC1jb250ZXh0IGluc3RhbGxcIicsXG4gICAgICAnb3InLFxuICAgICAgYCAgRml4IHRoaXMgYnkgcnVubmluZyBcIm5wbSBpbnN0YWxsIC0tc2F2ZSAtLXNhdmUtZXhhY3QgJHt1bm1ldFJlcXVpcmVtZW50cy5qb2luKCcgJyl9XCJgXG4gICAgXS5qb2luKG9zLkVPTCkpO1xuICB9XG5cbiAgc3RhdGljIGxvYWRGcm9tRmlsZShmaWxlbmFtZSwgb3B0cywgc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIGZpbGVuYW1lID0gcmVxdWlyZS5yZXNvbHZlKGZpbGVuYW1lKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnQ291bGQgbm90IGZpbmQgYW4gYXBwLWNvbnRleHQgYXQgJyArIGZpbGVuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBkZWJ1ZygnTG9hZCBmcm9tIGZpbGU6ICcgKyBmaWxlbmFtZSk7XG5cbiAgICBsZXQgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVuYW1lKTtcbiAgICBpZiAoZXh0ZW5zaW9uICE9PSAnLmpzJykgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnYXBwLWNvbnRleHQgY2FuIG9ubHkgYmUgbG9hZGVkIGZyb20gLmpzIGZpbGVzJyk7IH1cblxuICAgIHRoaXMubG9hZEJhYmVsKCk7XG5cbiAgICBsZXQgY29udGV4dEluaXRpYWxpemVyID0gZXM2cmVxdWlyZShmaWxlbmFtZSk7XG4gICAgcmV0dXJuIHRoaXMuY3JlYXRlKGNvbnRleHRJbml0aWFsaXplciwgb3B0cyk7XG4gIH1cblxuICBzdGF0aWMgZmluZFBhY2thZ2VGaWxlKGRpcikge1xuICAgIGlmIChkaXIgPT0gbnVsbCkgZGlyID0gcHJvY2Vzcy5jd2QoKTtcblxuICAgIGxldCBwYWNrYWdlRmlsZSA9IHBhdGguam9pbihkaXIsICdwYWNrYWdlLmpzb24nKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhwYWNrYWdlRmlsZSkpIHtcbiAgICAgIGRlYnVnKCdGb3VuZCBwYWNrYWdlLmpzb24gYXQ6ICcgKyBwYWNrYWdlRmlsZSk7XG4gICAgICByZXR1cm4gcGFja2FnZUZpbGU7XG4gICAgfVxuICAgIGlmIChkaXIgPT09IHBhdGguc2VwKSB7IHJldHVybiB1bmRlZmluZWQ7IH1cbiAgICByZXR1cm4gdGhpcy5maW5kUGFja2FnZUZpbGUocGF0aC5qb2luKGRpciwgJy4uJykpO1xuICB9XG5cbiAgc3RhdGljIGZpbmRBbmRMb2FkUGFja2FnZShkaXIpIHtcbiAgICBsZXQgcGFja2FnZUZpbGUgPSB0aGlzLmZpbmRQYWNrYWdlRmlsZShkaXIpO1xuICAgIGlmIChwYWNrYWdlRmlsZSA9PSBudWxsKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdVbmFibGUgdG8gZmluZCBwYWNrYWdlLmpzb24gZmlsZScpOyB9XG5cbiAgICByZXR1cm4gcmVxdWlyZShwYWNrYWdlRmlsZSk7XG4gIH1cblxuICBzdGF0aWMgZ2V0QXBwQ29udGV4dEZpbGVuYW1lRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLmZpbmRBbmRMb2FkUGFja2FnZSgpWydhcHAtY29udGV4dCddO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7IHRocm93IGVycjsgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBsb2FkR2xvYmFsKCkge1xuICAgIGNvbnN0IHJvb3QgPSBvc2Vudi5ob21lKCk7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZyb21GaWxlKHBhdGguam9pbihyb290LCAnYXBwLWNvbnRleHQnKSwge3Jvb3Q6IHJvb3R9KTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cgPSB0cnVlKSB7XG4gICAgbGV0IGZpbGVuYW1lID0gdGhpcy5nZXRBcHBDb250ZXh0RmlsZW5hbWVGcm9tUGFja2FnZShzaG91bGRUaHJvdyk7XG4gICAgaWYgKGZpbGVuYW1lID09IG51bGwpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykge1xuICAgICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnWW91ciBwYWNrYWdlLmpzb24gZG9lcyBub3QgZGVmaW5lIGFuIFwiYXBwLWNvbnRleHRcIi4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlYnVnKCdGb3VuZCBjb250ZXh0IGluIHBhY2thZ2U6ICcgKyBmaWxlbmFtZSk7XG4gICAgcmV0dXJuIHRoaXMubG9hZEZyb21GaWxlKGZpbGVuYW1lKTtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkKC8qIG9wdGlvbmFsICovIGZpbGVuYW1lKSB7XG4gICAgbGV0IGNvbnRleHQgPSBudWxsO1xuXG4gICAgaWYgKGZpbGVuYW1lKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tRmlsZShmaWxlbmFtZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tUGFja2FnZShmYWxzZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7IGNvbnRleHQgPSB0aGlzLmxvYWRGcm9tRmlsZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2FwcC1jb250ZXh0JyksIHt9LCBmYWxzZSk7IH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgICBkZWJ1ZygnTm8gY29udGV4dCBmaWxlLCBsb2FkaW5nIGFuIGVtcHR5IGNvbnRleHQnKTtcbiAgICAgIGNvbnRleHQgPSB0aGlzLmNyZWF0ZShmdW5jdGlvbigpe30pO1xuICAgIH1cblxuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG59XG5cbkFwcENvbnRleHQuUnVuTGV2ZWwgPSBSdW5MZXZlbDtcbiJdfQ==