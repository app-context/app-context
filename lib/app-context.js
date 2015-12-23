'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _osenv = require('osenv');

var _osenv2 = _interopRequireDefault(_osenv);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('app-context');

require('babel-register')({
  presets: [require('babel-preset-es2015')],
  plugins: [require('babel-plugin-add-module-exports'), require('babel-plugin-transform-async-to-generator')],
  sourceMaps: 'inline',
  ignore: new RegExp(_path2.default.sep + 'node_modules' + _path2.default.sep)
});
require('babel-polyfill');

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

var AppContext = (function () {
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
        return _bluebird2.default.resolve();
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
      }, _bluebird2.default.resolve()).then(function () {
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
})();

exports.default = AppContext;

AppContext.RunLevel = RunLevel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hcHAtY29udGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUtZLE1BQU07Ozs7Ozs7O0FBRWxCLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFOUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEIsU0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekMsU0FBTyxFQUFFLENBQ1AsT0FBTyxDQUFDLGlDQUFpQyxDQUFDLEVBQzFDLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUNyRDtBQUNELFlBQVUsRUFBRSxRQUFRO0FBQ3BCLFFBQU0sRUFBRSxJQUFJLE1BQU0sQ0FBQyxlQUFLLEdBQUcsR0FBRyxjQUFjLEdBQUcsZUFBSyxHQUFHLENBQUM7Q0FDekQsQ0FBQyxDQUFDO0FBQ0gsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRTFCLElBQU0sUUFBUSxHQUFHO0FBQ2YsTUFBSSxFQUFFLENBQUM7QUFDUCxPQUFLLEVBQUUsQ0FBQztBQUNSLFlBQVUsRUFBRSxDQUFDO0FBQ2IsV0FBUyxFQUFFLENBQUM7QUFDWixhQUFXLEVBQUUsQ0FBQztBQUNkLFNBQU8sRUFBRSxDQUFDO0NBQ1gsQ0FBQzs7QUFFRixJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDekQsTUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BCLEdBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNULFNBQU8sQ0FBQyxDQUFDO0NBQ1YsRUFBRSxFQUFFLENBQUM7Ozs7O0FBQUM7SUFLYyxVQUFVO0FBQzdCLFdBRG1CLFVBQVUsQ0FDakIsSUFBSSxFQUFFOzBCQURDLFVBQVU7O0FBRTNCLFFBQUksV0FBVyxHQUFHLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFL0MsUUFBSSxXQUFXLEVBQUU7QUFDZixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNwQyxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO0FBQ3JCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7T0FDL0I7QUFDRCxVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxJQUFJLDBCQUEwQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO0FBQ2pGLFlBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFOUMsWUFBSSxDQUFDLE9BQU8sR0FBRztBQUNiLGVBQUssRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLGVBQUssRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzNCLGVBQUssRUFBRSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCLENBQUM7T0FDSDtLQUNGOztBQUVELFFBQUksSUFBSSxJQUFJLElBQUksRUFBRTtBQUFFLFVBQUksR0FBRyxFQUFFLENBQUM7S0FBRTtBQUNoQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ3ZDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxhQUFhLENBQUM7O0FBRXJELFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDO0dBQzFCOztlQTNCa0IsVUFBVTs7bUNBK0JKOzs7VUFBWixLQUFLLHlEQUFHLEVBQUU7O0FBQ3JCLFdBQUssR0FBRyxVQUFVLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUU7QUFBRSxjQUFNLElBQUksS0FBSyxDQUFDLDhFQUE4RSxDQUFDLENBQUM7T0FBRTtBQUN0SSxVQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQUUsZUFBTyxtQkFBUSxPQUFPLEVBQUUsQ0FBQztPQUFFOztBQUVqRSxVQUFJLE1BQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQUUsY0FBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7T0FBRTs7QUFFL0MsVUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztlQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQztlQUFLLENBQUMsR0FBRyxNQUFLLGVBQWUsSUFBSSxDQUFDLElBQUksS0FBSztPQUFBLENBQUMsQ0FBQztBQUMxSCxlQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRWpCLFdBQUssQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLEdBQUcsS0FBSyxHQUFHLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztBQUVqRyxhQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBQyxXQUFXLEVBQUUsUUFBUSxFQUFLO0FBQ2pELGVBQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzVCLGlCQUFPLE1BQUssU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFVBQVUsT0FBTSxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQzFELGtCQUFLLGVBQWUsR0FBRyxRQUFRLENBQUM7V0FDakMsQ0FBQyxDQUFDO1NBQ0osQ0FBQyxDQUFDO09BQ0osRUFBRSxtQkFBUSxPQUFPLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFNO0FBQy9CLGFBQUssQ0FBQyxhQUFhLEdBQUcsTUFBSyxlQUFlLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUN0RyxjQUFLLGVBQWUsR0FBRyxLQUFLLENBQUM7QUFDN0IscUJBQVk7T0FDYixDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ2hCLGFBQUssQ0FBQyxhQUFhLEdBQUcsTUFBSyxlQUFlLEdBQUcsTUFBTSxHQUFHLEtBQUssR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQztBQUN2RyxjQUFNLEdBQUcsQ0FBQztPQUNYLENBQUMsQ0FBQztLQUNKOzs7d0JBNUJ5QjtBQUFFLGFBQU8sVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FBRTs7O29DQThCL0QsS0FBSyxFQUFFO0FBQzVCLFVBQUksT0FBTyxLQUFLLEFBQUMsS0FBSyxRQUFRLEVBQUU7QUFDOUIsWUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQUUsZ0JBQU0sSUFBSSxLQUFLLENBQUMsOEJBQThCLEdBQUcsS0FBSyxDQUFDLENBQUM7U0FBRTtBQUMxRyxhQUFLLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO09BQzFDOztBQUVELFVBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFO0FBQUUsY0FBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO09BQUU7O0FBRTVILGFBQU8sS0FBSyxDQUFDO0tBQ2Q7OztvQ0FFc0IsS0FBSyxFQUFFO0FBQzVCLGFBQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCOzs7MkJBRWEsa0JBQWtCLEVBQUUsSUFBSSxFQUFFO0FBQ3RDLFVBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNyQyxVQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDOztBQUU1QixVQUFJLE9BQU8sa0JBQWtCLEFBQUMsS0FBSyxVQUFVLEVBQUU7QUFDN0MsMEJBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ2xDLE1BQU07QUFDTCxjQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7T0FDcEU7O0FBRUQsVUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO0FBQUUsWUFBSSxHQUFHLEVBQUUsQ0FBQztPQUFFO0FBQ2hDLFVBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7QUFBRSxZQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO09BQUU7QUFDMUUsVUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksRUFBRTtBQUFFLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO09BQUU7O0FBRXJELFVBQU0sT0FBTyxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyQyxhQUFPLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7O0FBRXRDLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7aUNBRW1CLFFBQVEsRUFBRSxJQUFJLEVBQXNCO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDcEQsVUFBSTtBQUNGLGdCQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUN0QyxDQUFDLE9BQU8sR0FBRyxFQUFFO0FBQ1osWUFBSSxXQUFXLEVBQUU7QUFDZixnQkFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLG1DQUFtQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQ3RFLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUM7U0FDYjtPQUNGO0FBQ0QsV0FBSyxDQUFDLGtCQUFrQixHQUFHLFFBQVEsQ0FBQyxDQUFDOztBQUVyQyxVQUFJLFNBQVMsR0FBRyxlQUFLLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QyxVQUFJLFNBQVMsS0FBSyxLQUFLLEVBQUU7QUFBRSxjQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztPQUFFOztBQUVuRyxVQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDOUM7OztvQ0FFc0IsR0FBRyxFQUFFO0FBQzFCLFVBQUksR0FBRyxJQUFJLElBQUksRUFBRSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDOztBQUVyQyxVQUFJLFdBQVcsR0FBRyxlQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDakQsVUFBSSxhQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUM5QixhQUFLLENBQUMseUJBQXlCLEdBQUcsV0FBVyxDQUFDLENBQUM7QUFDL0MsZUFBTyxXQUFXLENBQUM7T0FDcEI7QUFDRCxVQUFJLEdBQUcsS0FBSyxlQUFLLEdBQUcsRUFBRTtBQUFFLGVBQU8sU0FBUyxDQUFDO09BQUU7QUFDM0MsYUFBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQUssSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ25EOzs7dUNBRXlCLEdBQUcsRUFBRTtBQUM3QixVQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVDLFVBQUksV0FBVyxJQUFJLElBQUksRUFBRTtBQUFFLGNBQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO09BQUU7O0FBRXRGLGFBQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzdCOzs7dURBRTJEO1VBQXBCLFdBQVcseURBQUcsSUFBSTs7QUFDeEQsVUFBSTtBQUNGLGVBQU8sSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7T0FDakQsQ0FBQyxPQUFPLEdBQUcsRUFBRTtBQUNaLFlBQUksV0FBVyxFQUFFO0FBQUUsZ0JBQU0sR0FBRyxDQUFDO1NBQUU7T0FDaEM7S0FDRjs7O2lDQUVtQjtBQUNsQixVQUFNLElBQUksR0FBRyxnQkFBTSxJQUFJLEVBQUUsQ0FBQztBQUMxQixhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBSyxJQUFJLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7S0FDeEU7OztzQ0FFMEM7VUFBcEIsV0FBVyx5REFBRyxJQUFJOztBQUN2QyxVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEUsVUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO0FBQ3BCLFlBQUksV0FBVyxFQUFFO0FBQ2YsZ0JBQU0sTUFBTSxDQUFDLE9BQU8sQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1NBQzdFLE1BQU07QUFDTCxpQkFBTyxJQUFJLENBQUM7U0FDYjtPQUNGOztBQUVELFdBQUssQ0FBQyw0QkFBNEIsR0FBRyxRQUFRLENBQUMsQ0FBQztBQUMvQyxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDcEM7Ozt3Q0FFMEIsUUFBUSxFQUFFO0FBQ25DLFVBQUksT0FBTyxHQUFHLElBQUksQ0FBQzs7QUFFbkIsVUFBSSxRQUFRLEVBQUU7QUFBRSxlQUFPLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUFFO0FBQ3hELFVBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUFFLGVBQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQUU7QUFDL0QsVUFBSSxPQUFPLElBQUksSUFBSSxFQUFFO0FBQUUsZUFBTyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUFFO0FBQ3pHLFVBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUNuQixhQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztBQUNuRCxlQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFVLEVBQUUsQ0FBQyxDQUFDO09BQ3JDOztBQUVELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0E1S2tCLFVBQVU7OztrQkFBVixVQUFVOztBQStLL0IsVUFBVSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMiLCJmaWxlIjoiYXBwLWNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3NlbnYgZnJvbSAnb3NlbnYnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuXG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi9lcnJvcnMnO1xuXG5jb25zdCBkZWJ1ZyA9IHJlcXVpcmUoJ2RlYnVnJykoJ2FwcC1jb250ZXh0Jyk7XG5cbnJlcXVpcmUoJ2JhYmVsLXJlZ2lzdGVyJykoe1xuICBwcmVzZXRzOiBbcmVxdWlyZSgnYmFiZWwtcHJlc2V0LWVzMjAxNScpXSxcbiAgcGx1Z2luczogW1xuICAgIHJlcXVpcmUoJ2JhYmVsLXBsdWdpbi1hZGQtbW9kdWxlLWV4cG9ydHMnKSxcbiAgICByZXF1aXJlKCdiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWFzeW5jLXRvLWdlbmVyYXRvcicpXG4gIF0sXG4gIHNvdXJjZU1hcHM6ICdpbmxpbmUnLFxuICBpZ25vcmU6IG5ldyBSZWdFeHAocGF0aC5zZXAgKyAnbm9kZV9tb2R1bGVzJyArIHBhdGguc2VwKVxufSk7XG5yZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpO1xuXG5jb25zdCBSdW5MZXZlbCA9IHtcbiAgTm9uZTogMCxcbiAgU2V0dXA6IDEsXG4gIENvbmZpZ3VyZWQ6IDMsXG4gIENvbm5lY3RlZDogNSxcbiAgSW5pdGlhbGl6ZWQ6IDcsXG4gIFJ1bm5pbmc6IDlcbn07XG5cbmNvbnN0IFJ1bkxldmVsTWFwID0gT2JqZWN0LmtleXMoUnVuTGV2ZWwpLnJlZHVjZSgobywgaykgPT4ge1xuICBsZXQgdiA9IFJ1bkxldmVsW2tdO1xuICBvW2sudG9Mb3dlckNhc2UoKV0gPSB2O1xuICBvW3ZdID0gaztcbiAgcmV0dXJuIG87XG59LCB7fSk7XG5cbi8qKlxuICogQGNsYXNzIEFwcENvbnRleHRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBsZXQgcGFja2FnZUZpbGUgPSBBcHBDb250ZXh0LmZpbmRQYWNrYWdlRmlsZSgpO1xuXG4gICAgaWYgKHBhY2thZ2VGaWxlKSB7XG4gICAgICB0aGlzLnBhY2thZ2UgPSByZXF1aXJlKHBhY2thZ2VGaWxlKTtcbiAgICAgIGlmICh0aGlzLnBhY2thZ2UubmFtZSkge1xuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLnBhY2thZ2UubmFtZTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnBhY2thZ2UudmVyc2lvbiAmJiAvXlswLTldK1xcLlswLTldK1xcLlswLTldKyQvLnRlc3QodGhpcy5wYWNrYWdlLnZlcnNpb24pKSB7XG4gICAgICAgIHZhciB2ZXJzaW9uID0gdGhpcy5wYWNrYWdlLnZlcnNpb24uc3BsaXQoJy4nKTtcblxuICAgICAgICB0aGlzLnZlcnNpb24gPSB7XG4gICAgICAgICAgbWFqb3I6IHBhcnNlSW50KHZlcnNpb25bMF0pLFxuICAgICAgICAgIG1pbm9yOiBwYXJzZUludCh2ZXJzaW9uWzFdKSxcbiAgICAgICAgICBwYXRjaDogcGFyc2VJbnQodmVyc2lvblsyXSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cyA9PSBudWxsKSB7IG9wdHMgPSB7fTsgfVxuICAgIHRoaXMucm9vdCA9IG9wdHMucm9vdCB8fCBwcm9jZXNzLmN3ZCgpO1xuICAgIHRoaXMuZW52aXJvbm1lbnQgPSBvcHRzLmVudmlyb25tZW50IHx8ICdkZXZlbG9wbWVudCc7XG5cbiAgICB0aGlzLmNvbmZpZyA9IHt9O1xuICAgIHRoaXMucnVubGV2ZWxzID0ge307XG4gICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSAwO1xuICB9XG5cbiAgZ2V0IGN1cnJlbnRSdW5sZXZlbE5hbWUoKSB7IHJldHVybiBBcHBDb250ZXh0LmdldFJ1bkxldmVsTmFtZSh0aGlzLmN1cnJlbnRSdW5sZXZlbCk7IH1cblxuICB0cmFuc2l0aW9uVG8obGV2ZWwgPSAxMCkge1xuICAgIGxldmVsID0gQXBwQ29udGV4dC5yZXNvbHZlUnVuTGV2ZWwobGV2ZWwpO1xuICAgIGlmIChsZXZlbCA8IHRoaXMuY3VycmVudFJ1bmxldmVsKSB7IHRocm93IG5ldyBFcnJvcignYXBwLWNvbnRleHQgY2FuIG9ubHkgdHJhbnNpdGlvbiB0byBhIGxldmVsIGdyZWF0IHRoYW4gdGhlIGN1cnJlbnQgcnVuIGxldmVsLicpOyB9XG4gICAgaWYgKGxldmVsID09PSB0aGlzLmN1cnJlbnRSdW5sZXZlbCkgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IH1cblxuICAgIGlmIChnbG9iYWwuQVBQICE9PSB0aGlzKSB7IGdsb2JhbC5BUFAgPSB0aGlzOyB9XG5cbiAgICBsZXQgcnVubGV2ZWxzID0gT2JqZWN0LmtleXModGhpcy5ydW5sZXZlbHMpLm1hcCgobCkgPT4gcGFyc2VJbnQobCkpLmZpbHRlcigobCkgPT4gbCA+IHRoaXMuY3VycmVudFJ1bmxldmVsICYmIGwgPD0gbGV2ZWwpO1xuICAgIHJ1bmxldmVscy5zb3J0KCk7XG5cbiAgICBkZWJ1ZygndHJhbnNpdGlvbiAnICsgdGhpcy5jdXJyZW50UnVubGV2ZWwgKyAnID0+ICcgKyBsZXZlbCArICcgKCcgKyBydW5sZXZlbHMuam9pbignLCAnKSArICcpJyk7XG5cbiAgICByZXR1cm4gcnVubGV2ZWxzLnJlZHVjZSgobGFzdFByb21pc2UsIHJ1bmxldmVsKSA9PiB7XG4gICAgICByZXR1cm4gbGFzdFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLnJ1bmxldmVsc1tydW5sZXZlbF0udHJhbnNpdGlvbih0aGlzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRSdW5sZXZlbCA9IHJ1bmxldmVsO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRE9ORScpO1xuICAgICAgdGhpcy5jdXJyZW50UnVubGV2ZWwgPSBsZXZlbDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uICcgKyB0aGlzLmN1cnJlbnRSdW5sZXZlbCArICcgPT4gJyArIGxldmVsICsgJyAoJyArIHJ1bmxldmVscy5qb2luKCcsICcpICsgJykgRVJST1InKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZXNvbHZlUnVuTGV2ZWwobGV2ZWwpIHtcbiAgICBpZiAodHlwZW9mKGxldmVsKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmIChSdW5MZXZlbE1hcFtsZXZlbC50b0xvd2VyQ2FzZSgpXSA9PSBudWxsKSB7IHRocm93IG5ldyBFcnJvcignVGhlcmUgaXMgbm8gcnVuIGxldmVsIG5hbWVkICcgKyBsZXZlbCk7IH1cbiAgICAgIGxldmVsID0gUnVuTGV2ZWxNYXBbbGV2ZWwudG9Mb3dlckNhc2UoKV07XG4gICAgfVxuXG4gICAgaWYgKGxldmVsIDwgMCB8fCBsZXZlbCA+IDEwKSB7IHRocm93IG5ldyBFcnJvcignWW91IGhhdmUgYXNrZWQgZm9yIGEgcnVuIGxldmVsIGlzIG91dHNpZGUgb2YgdGhlIGFsbG93ZWQgcmFuZ2UgKDAgLSAxMCknKTsgfVxuXG4gICAgcmV0dXJuIGxldmVsO1xuICB9XG5cbiAgc3RhdGljIGdldFJ1bkxldmVsTmFtZShsZXZlbCkge1xuICAgIHJldHVybiBSdW5MZXZlbE1hcFtsZXZlbF07XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlKGNvbnRleHRJbml0aWFsaXplciwgb3B0cykge1xuICAgIGNvbnN0IEJ1aWxkZXIgPSByZXF1aXJlKCcuL2J1aWxkZXInKTtcbiAgICBsZXQgYnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG5cbiAgICBpZiAodHlwZW9mKGNvbnRleHRJbml0aWFsaXplcikgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnRleHRJbml0aWFsaXplci5jYWxsKGJ1aWxkZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHBhc3MgYSBtZXRob2QgdG8gY3JlYXRlIGFuIGFwcC1jb250ZXh0Jyk7XG4gICAgfVxuXG4gICAgaWYgKG9wdHMgPT0gbnVsbCkgeyBvcHRzID0ge307IH1cbiAgICBpZiAob3B0cy5lbnZpcm9ubWVudCA9PSBudWxsKSB7IG9wdHMuZW52aXJvbm1lbnQgPSBwcm9jZXNzLmVudi5OT0RFX0VOVjsgfVxuICAgIGlmIChvcHRzLnJvb3QgPT0gbnVsbCkgeyBvcHRzLnJvb3QgPSBwcm9jZXNzLmN3ZCgpOyB9XG5cbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IEFwcENvbnRleHQob3B0cyk7XG5cbiAgICBjb250ZXh0LnJ1bmxldmVscyA9IGJ1aWxkZXIucnVubGV2ZWxzO1xuXG4gICAgcmV0dXJuIGNvbnRleHQ7XG4gIH1cblxuICBzdGF0aWMgbG9hZEZyb21GaWxlKGZpbGVuYW1lLCBvcHRzLCBzaG91bGRUaHJvdyA9IHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgZmlsZW5hbWUgPSByZXF1aXJlLnJlc29sdmUoZmlsZW5hbWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgaWYgKHNob3VsZFRocm93KSB7XG4gICAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdDb3VsZCBub3QgZmluZCBhbiBhcHAtY29udGV4dCBhdCAnICsgZmlsZW5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIGRlYnVnKCdMb2FkIGZyb20gZmlsZTogJyArIGZpbGVuYW1lKTtcblxuICAgIGxldCBleHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpO1xuICAgIGlmIChleHRlbnNpb24gIT09ICcuanMnKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdhcHAtY29udGV4dCBjYW4gb25seSBiZSBsb2FkZWQgZnJvbSAuanMgZmlsZXMnKTsgfVxuXG4gICAgbGV0IGNvbnRleHRJbml0aWFsaXplciA9IHJlcXVpcmUoZmlsZW5hbWUpO1xuICAgIHJldHVybiB0aGlzLmNyZWF0ZShjb250ZXh0SW5pdGlhbGl6ZXIsIG9wdHMpO1xuICB9XG5cbiAgc3RhdGljIGZpbmRQYWNrYWdlRmlsZShkaXIpIHtcbiAgICBpZiAoZGlyID09IG51bGwpIGRpciA9IHByb2Nlc3MuY3dkKCk7XG5cbiAgICBsZXQgcGFja2FnZUZpbGUgPSBwYXRoLmpvaW4oZGlyLCAncGFja2FnZS5qc29uJyk7XG4gICAgaWYgKGZzLmV4aXN0c1N5bmMocGFja2FnZUZpbGUpKSB7XG4gICAgICBkZWJ1ZygnRm91bmQgcGFja2FnZS5qc29uIGF0OiAnICsgcGFja2FnZUZpbGUpO1xuICAgICAgcmV0dXJuIHBhY2thZ2VGaWxlO1xuICAgIH1cbiAgICBpZiAoZGlyID09PSBwYXRoLnNlcCkgeyByZXR1cm4gdW5kZWZpbmVkOyB9XG4gICAgcmV0dXJuIHRoaXMuZmluZFBhY2thZ2VGaWxlKHBhdGguam9pbihkaXIsICcuLicpKTtcbiAgfVxuXG4gIHN0YXRpYyBmaW5kQW5kTG9hZFBhY2thZ2UoZGlyKSB7XG4gICAgbGV0IHBhY2thZ2VGaWxlID0gdGhpcy5maW5kUGFja2FnZUZpbGUoZGlyKTtcbiAgICBpZiAocGFja2FnZUZpbGUgPT0gbnVsbCkgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnVW5hYmxlIHRvIGZpbmQgcGFja2FnZS5qc29uIGZpbGUnKTsgfVxuXG4gICAgcmV0dXJuIHJlcXVpcmUocGFja2FnZUZpbGUpO1xuICB9XG5cbiAgc3RhdGljIGdldEFwcENvbnRleHRGaWxlbmFtZUZyb21QYWNrYWdlKHNob3VsZFRocm93ID0gdHJ1ZSkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gdGhpcy5maW5kQW5kTG9hZFBhY2thZ2UoKVsnYXBwLWNvbnRleHQnXTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChzaG91bGRUaHJvdykgeyB0aHJvdyBlcnI7IH1cbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbG9hZEdsb2JhbCgpIHtcbiAgICBjb25zdCByb290ID0gb3NlbnYuaG9tZSgpO1xuICAgIHJldHVybiB0aGlzLmxvYWRGcm9tRmlsZShwYXRoLmpvaW4ocm9vdCwgJ2FwcC1jb250ZXh0JyksIHtyb290OiByb290fSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZEZyb21QYWNrYWdlKHNob3VsZFRocm93ID0gdHJ1ZSkge1xuICAgIGxldCBmaWxlbmFtZSA9IHRoaXMuZ2V0QXBwQ29udGV4dEZpbGVuYW1lRnJvbVBhY2thZ2Uoc2hvdWxkVGhyb3cpO1xuICAgIGlmIChmaWxlbmFtZSA9PSBudWxsKSB7XG4gICAgICBpZiAoc2hvdWxkVGhyb3cpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1lvdXIgcGFja2FnZS5qc29uIGRvZXMgbm90IGRlZmluZSBhbiBcImFwcC1jb250ZXh0XCIuJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZWJ1ZygnRm91bmQgY29udGV4dCBpbiBwYWNrYWdlOiAnICsgZmlsZW5hbWUpO1xuICAgIHJldHVybiB0aGlzLmxvYWRGcm9tRmlsZShmaWxlbmFtZSk7XG4gIH1cblxuICBzdGF0aWMgbG9hZCgvKiBvcHRpb25hbCAqLyBmaWxlbmFtZSkge1xuICAgIGxldCBjb250ZXh0ID0gbnVsbDtcblxuICAgIGlmIChmaWxlbmFtZSkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbUZpbGUoZmlsZW5hbWUpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbVBhY2thZ2UoZmFsc2UpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkgeyBjb250ZXh0ID0gdGhpcy5sb2FkRnJvbUZpbGUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdhcHAtY29udGV4dCcpLCB7fSwgZmFsc2UpOyB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgZGVidWcoJ05vIGNvbnRleHQgZmlsZSwgbG9hZGluZyBhbiBlbXB0eSBjb250ZXh0Jyk7XG4gICAgICBjb250ZXh0ID0gdGhpcy5jcmVhdGUoZnVuY3Rpb24oKXt9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxufVxuXG5BcHBDb250ZXh0LlJ1bkxldmVsID0gUnVuTGV2ZWw7XG4iXX0=