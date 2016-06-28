'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerBabel = exports.installBabel = exports.getBabelModuleNamesFromConfig = exports.getBabelModuleNames = exports.loadBabelConfig = exports.hasBabel = exports.findBabelFile = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moduleTools = require('./module-tools');

var _packageTools = require('./package-tools');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function findBabelFile() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var packageDir = (0, _packageTools.findPackageDir)(dir);
  var filename = _path2.default.join(packageDir, '.babelrc');
  return fs.existsSync(filename) ? filename : undefined;
}

function loadBabelConfig() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var filename = findBabelFile(dir);
  if (filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  var pkg = (0, _packageTools.loadPackageFile)(dir);
  if (pkg && pkg.babel) {
    return pkg.babel;
  }

  return undefined;

  // environment configuration
  // if (babelConfig.env) {
  //   const environment = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
  //   if (babelConfig.env[environment]) {
  //
  //   }
  // }
}

function getBabelModuleNames() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  return getBabelModuleNamesFromConfig(loadBabelConfig(dir));
}

function getBabelModuleNamesFromConfig() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var presets = config.presets || [];
  var plugins = config.plugins || [];

  if (config.env) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.values(config.env)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var envConfig = _step.value;

        presets.push.apply(presets, _toConsumableArray(envConfig.presets || []));
        plugins.push.apply(plugins, _toConsumableArray(envConfig.plugins || []));
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  return [].concat(presets.map(function (p) {
    return p.startsWith('babel-preset-') ? p : 'babel-preset-' + p;
  }), plugins.map(function (p) {
    var name = Array.isArray(p) ? p[0] : p;
    return name.startsWith('babel-plugin-') ? name : 'babel-plugin-' + name;
  }));
}

function hasBabel() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  return !!loadBabelConfig(dir);
}

function installBabel() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var config = loadBabelConfig(dir);
  var packageDir = (0, _packageTools.findPackageDir)(dir);
  return (0, _moduleTools.installNpmModules)(getBabelModuleNamesFromConfig(config), packageDir);
}

function registerBabel() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  require('babel-register')({
    sourceRoot: (0, _packageTools.findPackageDir)(dir)
  });
}

exports.findBabelFile = findBabelFile;
exports.hasBabel = hasBabel;
exports.loadBabelConfig = loadBabelConfig;
exports.getBabelModuleNames = getBabelModuleNames;
exports.getBabelModuleNamesFromConfig = getBabelModuleNamesFromConfig;
exports.installBabel = installBabel;
exports.registerBabel = registerBabel;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iYWJlbC10b29scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBUyxhQUFULEdBQTRDO0FBQUEsTUFBckIsR0FBcUIseURBQWYsUUFBUSxHQUFSLEVBQWU7O0FBQzFDLE1BQU0sYUFBYSxrQ0FBZSxHQUFmLENBQW5CO0FBQ0EsTUFBTSxXQUFXLGVBQUssSUFBTCxDQUFVLFVBQVYsRUFBc0IsVUFBdEIsQ0FBakI7QUFDQSxTQUFPLEdBQUcsVUFBSCxDQUFjLFFBQWQsSUFBMEIsUUFBMUIsR0FBcUMsU0FBNUM7QUFDRDs7QUFFRCxTQUFTLGVBQVQsR0FBOEM7QUFBQSxNQUFyQixHQUFxQix5REFBZixRQUFRLEdBQVIsRUFBZTs7QUFDNUMsTUFBTSxXQUFXLGNBQWMsR0FBZCxDQUFqQjtBQUNBLE1BQUksUUFBSixFQUFjO0FBQ1osV0FBTyxLQUFLLEtBQUwsQ0FBVyxHQUFHLFlBQUgsQ0FBZ0IsUUFBaEIsRUFBMEIsTUFBMUIsQ0FBWCxDQUFQO0FBQ0Q7O0FBRUQsTUFBTSxNQUFNLG1DQUFnQixHQUFoQixDQUFaO0FBQ0EsTUFBSSxPQUFPLElBQUksS0FBZixFQUFzQjtBQUNwQixXQUFPLElBQUksS0FBWDtBQUNEOztBQUVELFNBQU8sU0FBUDs7Ozs7Ozs7O0FBU0Q7O0FBRUQsU0FBUyxtQkFBVCxHQUFrRDtBQUFBLE1BQXJCLEdBQXFCLHlEQUFmLFFBQVEsR0FBUixFQUFlOztBQUNoRCxTQUFPLDhCQUE4QixnQkFBZ0IsR0FBaEIsQ0FBOUIsQ0FBUDtBQUNEOztBQUVELFNBQVMsNkJBQVQsR0FBb0Q7QUFBQSxNQUFiLE1BQWEseURBQUosRUFBSTs7QUFDbEQsTUFBTSxVQUFVLE9BQU8sT0FBUCxJQUFrQixFQUFsQztBQUNBLE1BQU0sVUFBVSxPQUFPLE9BQVAsSUFBa0IsRUFBbEM7O0FBRUEsTUFBSSxPQUFPLEdBQVgsRUFBZ0I7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDZCwyQkFBd0IsT0FBTyxNQUFQLENBQWMsT0FBTyxHQUFyQixDQUF4Qiw4SEFBbUQ7QUFBQSxZQUF4QyxTQUF3Qzs7QUFDakQsZ0JBQVEsSUFBUixtQ0FBZ0IsVUFBVSxPQUFWLElBQXFCLEVBQXJDO0FBQ0EsZ0JBQVEsSUFBUixtQ0FBZ0IsVUFBVSxPQUFWLElBQXFCLEVBQXJDO0FBQ0Q7QUFKYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS2Y7O0FBRUQsU0FBTyxHQUFHLE1BQUgsQ0FDTCxRQUFRLEdBQVIsQ0FBWTtBQUFBLFdBQUssRUFBRSxVQUFGLENBQWEsZUFBYixJQUFnQyxDQUFoQyxxQkFBb0QsQ0FBekQ7QUFBQSxHQUFaLENBREssRUFFTCxRQUFRLEdBQVIsQ0FBWSxhQUFLO0FBQ2YsUUFBTSxPQUFPLE1BQU0sT0FBTixDQUFjLENBQWQsSUFBbUIsRUFBRSxDQUFGLENBQW5CLEdBQTBCLENBQXZDO0FBQ0EsV0FBTyxLQUFLLFVBQUwsQ0FBZ0IsZUFBaEIsSUFBbUMsSUFBbkMscUJBQTBELElBQWpFO0FBQ0QsR0FIRCxDQUZLLENBQVA7QUFPRDs7QUFFRCxTQUFTLFFBQVQsR0FBdUM7QUFBQSxNQUFyQixHQUFxQix5REFBZixRQUFRLEdBQVIsRUFBZTs7QUFDckMsU0FBTyxDQUFDLENBQUMsZ0JBQWdCLEdBQWhCLENBQVQ7QUFDRDs7QUFFRCxTQUFTLFlBQVQsR0FBMkM7QUFBQSxNQUFyQixHQUFxQix5REFBZixRQUFRLEdBQVIsRUFBZTs7QUFDekMsTUFBTSxTQUFTLGdCQUFnQixHQUFoQixDQUFmO0FBQ0EsTUFBTSxhQUFhLGtDQUFlLEdBQWYsQ0FBbkI7QUFDQSxTQUFPLG9DQUFrQiw4QkFBOEIsTUFBOUIsQ0FBbEIsRUFBeUQsVUFBekQsQ0FBUDtBQUNEOztBQUVELFNBQVMsYUFBVCxHQUE0QztBQUFBLE1BQXJCLEdBQXFCLHlEQUFmLFFBQVEsR0FBUixFQUFlOztBQUMxQyxVQUFRLGdCQUFSLEVBQTBCO0FBQ3hCLGdCQUFZLGtDQUFlLEdBQWY7QUFEWSxHQUExQjtBQUdEOztRQUdDLGEsR0FBQSxhO1FBQ0EsUSxHQUFBLFE7UUFDQSxlLEdBQUEsZTtRQUNBLG1CLEdBQUEsbUI7UUFDQSw2QixHQUFBLDZCO1FBQ0EsWSxHQUFBLFk7UUFDQSxhLEdBQUEsYSIsImZpbGUiOiJiYWJlbC10b29scy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgaW5zdGFsbE5wbU1vZHVsZXMgfSBmcm9tICcuL21vZHVsZS10b29scyc7XG5pbXBvcnQgeyBmaW5kUGFja2FnZURpciwgbG9hZFBhY2thZ2VGaWxlIH0gZnJvbSAnLi9wYWNrYWdlLXRvb2xzJztcblxuZnVuY3Rpb24gZmluZEJhYmVsRmlsZShkaXIgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gIGNvbnN0IHBhY2thZ2VEaXIgPSBmaW5kUGFja2FnZURpcihkaXIpO1xuICBjb25zdCBmaWxlbmFtZSA9IHBhdGguam9pbihwYWNrYWdlRGlyLCAnLmJhYmVscmMnKTtcbiAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoZmlsZW5hbWUpID8gZmlsZW5hbWUgOiB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGxvYWRCYWJlbENvbmZpZyhkaXIgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gIGNvbnN0IGZpbGVuYW1lID0gZmluZEJhYmVsRmlsZShkaXIpO1xuICBpZiAoZmlsZW5hbWUpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUsICd1dGY4JykpO1xuICB9XG5cbiAgY29uc3QgcGtnID0gbG9hZFBhY2thZ2VGaWxlKGRpcik7XG4gIGlmIChwa2cgJiYgcGtnLmJhYmVsKSB7XG4gICAgcmV0dXJuIHBrZy5iYWJlbDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG5cbiAgLy8gZW52aXJvbm1lbnQgY29uZmlndXJhdGlvblxuICAvLyBpZiAoYmFiZWxDb25maWcuZW52KSB7XG4gIC8vICAgY29uc3QgZW52aXJvbm1lbnQgPSBwcm9jZXNzLmVudi5CQUJFTF9FTlYgfHwgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgfHwgJ2RldmVsb3BtZW50JztcbiAgLy8gICBpZiAoYmFiZWxDb25maWcuZW52W2Vudmlyb25tZW50XSkge1xuICAvL1xuICAvLyAgIH1cbiAgLy8gfVxufVxuXG5mdW5jdGlvbiBnZXRCYWJlbE1vZHVsZU5hbWVzKGRpciA9IHByb2Nlc3MuY3dkKCkpIHtcbiAgcmV0dXJuIGdldEJhYmVsTW9kdWxlTmFtZXNGcm9tQ29uZmlnKGxvYWRCYWJlbENvbmZpZyhkaXIpKTtcbn1cblxuZnVuY3Rpb24gZ2V0QmFiZWxNb2R1bGVOYW1lc0Zyb21Db25maWcoY29uZmlnID0ge30pIHtcbiAgY29uc3QgcHJlc2V0cyA9IGNvbmZpZy5wcmVzZXRzIHx8IFtdO1xuICBjb25zdCBwbHVnaW5zID0gY29uZmlnLnBsdWdpbnMgfHwgW107XG5cbiAgaWYgKGNvbmZpZy5lbnYpIHtcbiAgICBmb3IgKGNvbnN0IGVudkNvbmZpZyBvZiBPYmplY3QudmFsdWVzKGNvbmZpZy5lbnYpKSB7XG4gICAgICBwcmVzZXRzLnB1c2goLi4uZW52Q29uZmlnLnByZXNldHMgfHwgW10pO1xuICAgICAgcGx1Z2lucy5wdXNoKC4uLmVudkNvbmZpZy5wbHVnaW5zIHx8IFtdKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gW10uY29uY2F0KFxuICAgIHByZXNldHMubWFwKHAgPT4gcC5zdGFydHNXaXRoKCdiYWJlbC1wcmVzZXQtJykgPyBwIDogYGJhYmVsLXByZXNldC0ke3B9YCksXG4gICAgcGx1Z2lucy5tYXAocCA9PiB7XG4gICAgICBjb25zdCBuYW1lID0gQXJyYXkuaXNBcnJheShwKSA/IHBbMF0gOiBwO1xuICAgICAgcmV0dXJuIG5hbWUuc3RhcnRzV2l0aCgnYmFiZWwtcGx1Z2luLScpID8gbmFtZSA6IGBiYWJlbC1wbHVnaW4tJHtuYW1lfWA7XG4gICAgfSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gaGFzQmFiZWwoZGlyID0gcHJvY2Vzcy5jd2QoKSkge1xuICByZXR1cm4gISFsb2FkQmFiZWxDb25maWcoZGlyKTtcbn1cblxuZnVuY3Rpb24gaW5zdGFsbEJhYmVsKGRpciA9IHByb2Nlc3MuY3dkKCkpIHtcbiAgY29uc3QgY29uZmlnID0gbG9hZEJhYmVsQ29uZmlnKGRpcik7XG4gIGNvbnN0IHBhY2thZ2VEaXIgPSBmaW5kUGFja2FnZURpcihkaXIpO1xuICByZXR1cm4gaW5zdGFsbE5wbU1vZHVsZXMoZ2V0QmFiZWxNb2R1bGVOYW1lc0Zyb21Db25maWcoY29uZmlnKSwgcGFja2FnZURpcik7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyQmFiZWwoZGlyID0gcHJvY2Vzcy5jd2QoKSkge1xuICByZXF1aXJlKCdiYWJlbC1yZWdpc3RlcicpKHtcbiAgICBzb3VyY2VSb290OiBmaW5kUGFja2FnZURpcihkaXIpXG4gIH0pO1xufVxuXG5leHBvcnQge1xuICBmaW5kQmFiZWxGaWxlLFxuICBoYXNCYWJlbCxcbiAgbG9hZEJhYmVsQ29uZmlnLFxuICBnZXRCYWJlbE1vZHVsZU5hbWVzLFxuICBnZXRCYWJlbE1vZHVsZU5hbWVzRnJvbUNvbmZpZyxcbiAgaW5zdGFsbEJhYmVsLFxuICByZWdpc3RlckJhYmVsXG59O1xuIl19