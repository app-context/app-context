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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBT1k7Ozs7Ozs7O0FBRVosSUFBTSxRQUFRLFFBQVEsT0FBUixFQUFpQixhQUFqQixDQUFSOztBQUVOLElBQU0sV0FBVztBQUNmLFFBQU0sQ0FBTjtBQUNBLFNBQU8sQ0FBUDtBQUNBLGNBQVksQ0FBWjtBQUNBLGFBQVcsQ0FBWDtBQUNBLGVBQWEsQ0FBYjtBQUNBLFdBQVMsQ0FBVDtDQU5JOztBQVNOLElBQU0sY0FBYyxPQUFPLElBQVAsQ0FBWSxRQUFaLEVBQXNCLE1BQXRCLENBQTZCLFVBQUMsQ0FBRCxFQUFJLENBQUosRUFBVTtBQUN6RCxNQUFJLElBQUksU0FBUyxDQUFULENBQUosQ0FEcUQ7QUFFekQsSUFBRSxFQUFFLFdBQUYsRUFBRixJQUFxQixDQUFyQixDQUZ5RDtBQUd6RCxJQUFFLENBQUYsSUFBTyxDQUFQLENBSHlEO0FBSXpELFNBQU8sQ0FBUCxDQUp5RDtDQUFWLEVBSzlDLEVBTGlCLENBQWQ7Ozs7OztJQVVlO0FBQ25CLFdBRG1CLFVBQ25CLENBQVksSUFBWixFQUFrQjswQkFEQyxZQUNEOztBQUNoQixRQUFJLGNBQWMsV0FBVyxlQUFYLEVBQWQsQ0FEWTs7QUFHaEIsUUFBSSxXQUFKLEVBQWlCO0FBQ2YsV0FBSyxPQUFMLEdBQWUsUUFBUSxXQUFSLENBQWYsQ0FEZTtBQUVmLFVBQUksS0FBSyxPQUFMLENBQWEsSUFBYixFQUFtQjtBQUNyQixhQUFLLElBQUwsR0FBWSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBRFM7T0FBdkI7QUFHQSxVQUFJLEtBQUssT0FBTCxDQUFhLE9BQWIsSUFBd0IsMkJBQTJCLElBQTNCLENBQWdDLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBeEQsRUFBK0U7QUFDakYsWUFBSSxVQUFVLEtBQUssT0FBTCxDQUFhLE9BQWIsQ0FBcUIsS0FBckIsQ0FBMkIsR0FBM0IsQ0FBVixDQUQ2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QUFYLEVBQWlCO0FBQUUsa0JBQVUsS0FBSyxZQUFMLENBQWtCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLGFBQXpCLENBQWxCLEVBQTJELEVBQTNELEVBQStELEtBQS9ELENBQVYsQ0FBRjtPQUFyQjtBQUNBLFVBQUksV0FBVyxJQUFYLEVBQWlCO0FBQ25CLGNBQU0sMkNBQU4sRUFEbUI7QUFFbkIsa0JBQVUsS0FBSyxNQUFMLENBQVksWUFBVSxFQUFWLENBQXRCLENBRm1CO09BQXJCOztBQUtBLGFBQU8sT0FBUCxDQVhtQzs7OztTQTdMbEI7Ozs7OztBQTRNckIsV0FBVyxRQUFYLEdBQXNCLFFBQXRCIiwiZmlsZSI6ImFwcC1jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5cbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuXG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi9lcnJvcnMnO1xuXG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FwcC1jb250ZXh0Jyk7XG5cbmNvbnN0IFJ1bkxldmVsID0ge1xuICBOb25lOiAwLFxuICBTZXR1cDogMSxcbiAgQ29uZmlndXJlZDogMyxcbiAgQ29ubmVjdGVkOiA1LFxuICBJbml0aWFsaXplZDogNyxcbiAgUnVubmluZzogOVxufTtcblxuY29uc3QgUnVuTGV2ZWxNYXAgPSBPYmplY3Qua2V5cyhSdW5MZXZlbCkucmVkdWNlKChvLCBrKSA9PiB7XG4gIGxldCB2ID0gUnVuTGV2ZWxba107XG4gIG9bay50b0xvd2VyQ2FzZSgpXSA9IHY7XG4gIG9bdl0gPSBrO1xuICByZXR1cm4gbztcbn0sIHt9KTtcblxuLyoqXG4gKiBAY2xhc3MgQXBwQ29udGV4dFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBDb250ZXh0IHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIGxldCBwYWNrYWdlRmlsZSA9IEFwcENvbnRleHQuZmluZFBhY2thZ2VGaWxlKCk7XG5cbiAgICBpZiAocGFja2FnZUZpbGUpIHtcbiAgICAgIHRoaXMucGFja2FnZSA9IHJlcXVpcmUocGFja2FnZUZpbGUpO1xuICAgICAgaWYgKHRoaXMucGFja2FnZS5uYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMucGFja2FnZS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMucGFja2FnZS52ZXJzaW9uICYmIC9eWzAtOV0rXFwuWzAtOV0rXFwuWzAtOV0rJC8udGVzdCh0aGlzLnBhY2thZ2UudmVyc2lvbikpIHtcbiAgICAgICAgdmFyIHZlcnNpb24gPSB0aGlzLnBhY2thZ2UudmVyc2lvbi5zcGxpdCgnLicpO1xuXG4gICAgICAgIHRoaXMudmVyc2lvbiA9IHtcbiAgICAgICAgICBtYWpvcjogcGFyc2VJbnQodmVyc2lvblswXSksXG4gICAgICAgICAgbWlub3I6IHBhcnNlSW50KHZlcnNpb25bMV0pLFxuICAgICAgICAgIHBhdGNoOiBwYXJzZUludCh2ZXJzaW9uWzJdKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChvcHRzID09IG51bGwpIHsgb3B0cyA9IHt9OyB9XG4gICAgdGhpcy5yb290ID0gb3B0cy5yb290IHx8IHByb2Nlc3MuY3dkKCk7XG4gICAgdGhpcy5lbnZpcm9ubWVudCA9IG9wdHMuZW52aXJvbm1lbnQgfHwgJ2RldmVsb3BtZW50JztcblxuICAgIHRoaXMuY29uZmlnID0ge307XG4gICAgdGhpcy5ydW5sZXZlbHMgPSB7fTtcbiAgICB0aGlzLmN1cnJlbnRSdW5sZXZlbCA9IDA7XG4gIH1cblxuICBnZXQgY3VycmVudFJ1bmxldmVsTmFtZSgpIHsgcmV0dXJuIEFwcENvbnRleHQuZ2V0UnVuTGV2ZWxOYW1lKHRoaXMuY3VycmVudFJ1bmxldmVsKTsgfVxuXG4gIHRyYW5zaXRpb25UbyhsZXZlbCA9IDEwKSB7XG4gICAgbGV2ZWwgPSBBcHBDb250ZXh0LnJlc29sdmVSdW5MZXZlbChsZXZlbCk7XG4gICAgaWYgKGxldmVsIDwgdGhpcy5jdXJyZW50UnVubGV2ZWwpIHsgdGhyb3cgbmV3IEVycm9yKCdhcHAtY29udGV4dCBjYW4gb25seSB0cmFuc2l0aW9uIHRvIGEgbGV2ZWwgZ3JlYXQgdGhhbiB0aGUgY3VycmVudCBydW4gbGV2ZWwuJyk7IH1cbiAgICBpZiAobGV2ZWwgPT09IHRoaXMuY3VycmVudFJ1bmxldmVsKSB7IHJldHVybiBQcm9taXNlLnJlc29sdmUoKTsgfVxuXG4gICAgaWYgKGdsb2JhbC5BUFAgIT09IHRoaXMpIHsgZ2xvYmFsLkFQUCA9IHRoaXM7IH1cblxuICAgIGxldCBydW5sZXZlbHMgPSBPYmplY3Qua2V5cyh0aGlzLnJ1bmxldmVscykubWFwKChsKSA9PiBwYXJzZUludChsKSkuZmlsdGVyKChsKSA9PiBsID4gdGhpcy5jdXJyZW50UnVubGV2ZWwgJiYgbCA8PSBsZXZlbCk7XG4gICAgcnVubGV2ZWxzLnNvcnQoKTtcblxuICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJyknKTtcblxuICAgIHJldHVybiBydW5sZXZlbHMucmVkdWNlKChsYXN0UHJvbWlzZSwgcnVubGV2ZWwpID0+IHtcbiAgICAgIHJldHVybiBsYXN0UHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucnVubGV2ZWxzW3J1bmxldmVsXS50cmFuc2l0aW9uKHRoaXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY3VycmVudFJ1bmxldmVsID0gcnVubGV2ZWw7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgZGVidWcoJ3RyYW5zaXRpb24gJyArIHRoaXMuY3VycmVudFJ1bmxldmVsICsgJyA9PiAnICsgbGV2ZWwgKyAnICgnICsgcnVubGV2ZWxzLmpvaW4oJywgJykgKyAnKSBET05FJyk7XG4gICAgICB0aGlzLmN1cnJlbnRSdW5sZXZlbCA9IGxldmVsO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVidWcoJ3RyYW5zaXRpb24gJyArIHRoaXMuY3VycmVudFJ1bmxldmVsICsgJyA9PiAnICsgbGV2ZWwgKyAnICgnICsgcnVubGV2ZWxzLmpvaW4oJywgJykgKyAnKSBFUlJPUicpO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIHJlc29sdmVSdW5MZXZlbChsZXZlbCkge1xuICAgIGlmICh0eXBlb2YobGV2ZWwpID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKFJ1bkxldmVsTWFwW2xldmVsLnRvTG93ZXJDYXNlKCldID09IG51bGwpIHsgdGhyb3cgbmV3IEVycm9yKCdUaGVyZSBpcyBubyBydW4gbGV2ZWwgbmFtZWQgJyArIGxldmVsKTsgfVxuICAgICAgbGV2ZWwgPSBSdW5MZXZlbE1hcFtsZXZlbC50b0xvd2VyQ2FzZSgpXTtcbiAgICB9XG5cbiAgICBpZiAobGV2ZWwgPCAwIHx8IGxldmVsID4gMTApIHsgdGhyb3cgbmV3IEVycm9yKCdZb3UgaGF2ZSBhc2tlZCBmb3IgYSBydW4gbGV2ZWwgaXMgb3V0c2lkZSBvZiB0aGUgYWxsb3dlZCByYW5nZSAoMCAtIDEwKScpOyB9XG5cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH1cblxuICBzdGF0aWMgZ2V0UnVuTGV2ZWxOYW1lKGxldmVsKSB7XG4gICAgcmV0dXJuIFJ1bkxldmVsTWFwW2xldmVsXTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGUoY29udGV4dEluaXRpYWxpemVyLCBvcHRzKSB7XG4gICAgY29uc3QgQnVpbGRlciA9IHJlcXVpcmUoJy4vYnVpbGRlcicpO1xuICAgIGxldCBidWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcblxuICAgIGlmICh0eXBlb2YoY29udGV4dEluaXRpYWxpemVyKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29udGV4dEluaXRpYWxpemVyLmNhbGwoYnVpbGRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG11c3QgcGFzcyBhIG1ldGhvZCB0byBjcmVhdGUgYW4gYXBwLWNvbnRleHQnKTtcbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIGlmIChvcHRzLmVudmlyb25tZW50ID09IG51bGwpIHsgb3B0cy5lbnZpcm9ubWVudCA9IHByb2Nlc3MuZW52Lk5PREVfRU5WOyB9XG4gICAgaWYgKG9wdHMucm9vdCA9PSBudWxsKSB7IG9wdHMucm9vdCA9IHByb2Nlc3MuY3dkKCk7IH1cblxuICAgIGNvbnN0IGNvbnRleHQgPSBuZXcgQXBwQ29udGV4dChvcHRzKTtcblxuICAgIGNvbnRleHQucnVubGV2ZWxzID0gYnVpbGRlci5ydW5sZXZlbHM7XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHN0YXRpYyBsb2FkRnJvbUZpbGUoZmlsZW5hbWUsIG9wdHMsIHNob3VsZFRocm93ID0gdHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICBmaWxlbmFtZSA9IHJlcXVpcmUucmVzb2x2ZShmaWxlbmFtZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ0NvdWxkIG5vdCBmaW5kIGFuIGFwcC1jb250ZXh0IGF0ICcgKyBmaWxlbmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgZGVidWcoJ0xvYWQgZnJvbSBmaWxlOiAnICsgZmlsZW5hbWUpO1xuXG4gICAgbGV0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShmaWxlbmFtZSk7XG4gICAgaWYgKGV4dGVuc2lvbiAhPT0gJy5qcycpIHsgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ2FwcC1jb250ZXh0IGNhbiBvbmx5IGJlIGxvYWRlZCBmcm9tIC5qcyBmaWxlcycpOyB9XG5cbiAgICAvLyBoYW5kbGUgYmFiZWwuLi5cbiAgICBjb25zdCBiYWJlbEZpbGUgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy5iYWJlbHJjJyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoYmFiZWxGaWxlKSkge1xuICAgICAgY29uc3QgYmFiZWxEYXRhID0gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoYmFiZWxGaWxlLCAndXRmOCcpKTtcblxuICAgICAgY29uc3QgdW5tZXRSZXF1aXJlbWVudHMgPSBbXS5jb25jYXQoXG4gICAgICAgIChiYWJlbERhdGEucHJlc2V0cyB8fCBbXSkubWFwKChwKSA9PiBgYmFiZWwtcHJlc2V0LSR7cH1gKSxcbiAgICAgICAgKGJhYmVsRGF0YS5wbHVnaW5zIHx8IFtdKS5tYXAoKHApID0+IGBiYWJlbC1wbHVnaW4tJHtwfWApXG4gICAgICApLmZpbHRlcigobmFtZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlcXVpcmUucmVzb2x2ZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcycsIG5hbWUpKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHVubWV0UmVxdWlyZW1lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoW1xuICAgICAgICAgICdVbm1ldCBiYWJlbCByZXF1aXJlbWVudHM6ICcgKyB1bm1ldFJlcXVpcmVtZW50cy5qb2luKCcsICcpLFxuICAgICAgICAgICdGaXggdGhpcyBieSBydW5uaW5nIFwibnBtIGluc3RhbGwgLS1zYXZlIC0tc2F2ZS1leGFjdCAnICsgdW5tZXRSZXF1aXJlbWVudHMuam9pbignICcpICsgJ1wiJ1xuICAgICAgICBdLmpvaW4ob3MuRU9MKSlcbiAgICAgIH1cblxuICAgICAgcmVxdWlyZSgnYmFiZWwtcmVnaXN0ZXInKSh7XG4gICAgICAgIHNvdXJjZVJvb3Q6IHByb2Nlc3MuY3dkKClcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxldCBjb250ZXh0SW5pdGlhbGl6ZXIgPSByZXF1aXJlKGZpbGVuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5jcmVhdGUoY29udGV4dEluaXRpYWxpemVyLCBvcHRzKTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kUGFja2FnZUZpbGUoZGlyKSB7XG4gICAgaWYgKGRpciA9PSBudWxsKSBkaXIgPSBwcm9jZXNzLmN3ZCgpO1xuXG4gICAgbGV0IHBhY2thZ2VGaWxlID0gcGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpO1xuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhY2thZ2VGaWxlKSkge1xuICAgICAgZGVidWcoJ0ZvdW5kIHBhY2thZ2UuanNvbiBhdDogJyArIHBhY2thZ2VGaWxlKTtcbiAgICAgIHJldHVybiBwYWNrYWdlRmlsZTtcbiAgICB9XG4gICAgaWYgKGRpciA9PT0gcGF0aC5zZXApIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuICAgIHJldHVybiB0aGlzLmZpbmRQYWNrYWdlRmlsZShwYXRoLmpvaW4oZGlyLCAnLi4nKSk7XG4gIH1cblxuICBzdGF0aWMgZmluZEFuZExvYWRQYWNrYWdlKGRpcikge1xuICAgIGxldCBwYWNrYWdlRmlsZSA9IHRoaXMuZmluZFBhY2thZ2VGaWxlKGRpcik7XG4gICAgaWYgKHBhY2thZ2VGaWxlID09IG51bGwpIHsgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1VuYWJsZSB0byBmaW5kIHBhY2thZ2UuanNvbiBmaWxlJyk7IH1cblxuICAgIHJldHVybiByZXF1aXJlKHBhY2thZ2VGaWxlKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRBcHBDb250ZXh0RmlsZW5hbWVGcm9tUGFja2FnZShzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMuZmluZEFuZExvYWRQYWNrYWdlKClbJ2FwcC1jb250ZXh0J107XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHsgdGhyb3cgZXJyOyB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGxvYWRHbG9iYWwoKSB7XG4gICAgY29uc3Qgcm9vdCA9IG9zZW52LmhvbWUoKTtcbiAgICByZXR1cm4gdGhpcy5sb2FkRnJvbUZpbGUocGF0aC5qb2luKHJvb3QsICdhcHAtY29udGV4dCcpLCB7cm9vdDogcm9vdH0pO1xuICB9XG5cbiAgc3RhdGljIGxvYWRGcm9tUGFja2FnZShzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICBsZXQgZmlsZW5hbWUgPSB0aGlzLmdldEFwcENvbnRleHRGaWxlbmFtZUZyb21QYWNrYWdlKHNob3VsZFRocm93KTtcbiAgICBpZiAoZmlsZW5hbWUgPT0gbnVsbCkge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdZb3VyIHBhY2thZ2UuanNvbiBkb2VzIG5vdCBkZWZpbmUgYW4gXCJhcHAtY29udGV4dFwiLicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGVidWcoJ0ZvdW5kIGNvbnRleHQgaW4gcGFja2FnZTogJyArIGZpbGVuYW1lKTtcbiAgICByZXR1cm4gdGhpcy5sb2FkRnJvbUZpbGUoZmlsZW5hbWUpO1xuICB9XG5cbiAgc3RhdGljIGxvYWQoLyogb3B0aW9uYWwgKi8gZmlsZW5hbWUpIHtcbiAgICBsZXQgY29udGV4dCA9IG51bGw7XG5cbiAgICBpZiAoZmlsZW5hbWUpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21GaWxlKGZpbGVuYW1lKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21QYWNrYWdlKGZhbHNlKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHsgY29udGV4dCA9IHRoaXMubG9hZEZyb21GaWxlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYXBwLWNvbnRleHQnKSwge30sIGZhbHNlKTsgfVxuICAgIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIGRlYnVnKCdObyBjb250ZXh0IGZpbGUsIGxvYWRpbmcgYW4gZW1wdHkgY29udGV4dCcpO1xuICAgICAgY29udGV4dCA9IHRoaXMuY3JlYXRlKGZ1bmN0aW9uKCl7fSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cbn1cblxuQXBwQ29udGV4dC5SdW5MZXZlbCA9IFJ1bkxldmVsO1xuIl19