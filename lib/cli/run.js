'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.usage = usage;
exports.execute = execute;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _errors = require('../errors');

var errors = _interopRequireWildcard(_errors);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usage() {
  return 'run <script>';
}

var description = exports.description = 'Initialize and run a script';

function execute(_ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var script = _ref2[0];

  if (!script) {
    throw errors.usage('Must supply a script to app-context run.');
  }

  var fullPath = void 0;
  try {
    fullPath = require.resolve(_path2.default.join(process.cwd(), script));
  } catch (err) {
    throw errors.message('Could not find script ' + script + '.');
  }

  return _2.default.load().transitionTo('initialized').then(function () {
    var scriptModule = void 0;
    try {
      scriptModule = require(fullPath);
    } catch (err) {
      console.log(err.stack);
      throw errors.message('There was an error while loading your script.', err);
    }
    var method = scriptModule && typeof scriptModule.execute === 'function' ? scriptModule.execute : typeof scriptModule === 'function' ? scriptModule : null;

    if (method == null) {
      throw errors.message('The script module you are running does not export a method or have key named execute that is a method.');
    }

    return new Promise(function (resolve, reject) {
      if (method.length === 2) {
        method(APP, function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else {
        resolve(method(APP));
      }
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQUtnQixLLEdBQUEsSztRQU1BLE8sR0FBQSxPOztBQVhoQjs7OztBQUVBOztJQUFZLE07O0FBQ1o7Ozs7Ozs7O0FBRU8sU0FBUyxLQUFULEdBQWlCO0FBQ3RCLFNBQU8sY0FBUDtBQUNEOztBQUVNLElBQU0sb0NBQWMsNkJBQXBCOztBQUVBLFNBQVMsT0FBVCxPQUEyQjtBQUFBOztBQUFBLE1BQVQsTUFBUzs7QUFDaEMsTUFBSSxDQUFDLE1BQUwsRUFBYTtBQUFFLFVBQU0sT0FBTyxLQUFQLENBQWEsMENBQWIsQ0FBTjtBQUFpRTs7QUFFaEYsTUFBSSxpQkFBSjtBQUNBLE1BQUk7QUFDRixlQUFXLFFBQVEsT0FBUixDQUFnQixlQUFLLElBQUwsQ0FBVSxRQUFRLEdBQVIsRUFBVixFQUF5QixNQUF6QixDQUFoQixDQUFYO0FBQ0QsR0FGRCxDQUVFLE9BQU8sR0FBUCxFQUFZO0FBQ1osVUFBTSxPQUFPLE9BQVAsQ0FBZSwyQkFBMkIsTUFBM0IsR0FBb0MsR0FBbkQsQ0FBTjtBQUNEOztBQUVELFNBQU8sV0FBVyxJQUFYLEdBQWtCLFlBQWxCLENBQStCLGFBQS9CLEVBQThDLElBQTlDLENBQW1ELFlBQVc7QUFDbkUsUUFBSSxxQkFBSjtBQUNBLFFBQUk7QUFDRixxQkFBZSxRQUFRLFFBQVIsQ0FBZjtBQUNELEtBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLGNBQVEsR0FBUixDQUFZLElBQUksS0FBaEI7QUFDQSxZQUFNLE9BQU8sT0FBUCxDQUFlLCtDQUFmLEVBQWdFLEdBQWhFLENBQU47QUFDRDtBQUNELFFBQU0sU0FBUyxnQkFBZ0IsT0FBTyxhQUFhLE9BQXBCLEtBQWlDLFVBQWpELEdBQThELGFBQWEsT0FBM0UsR0FBcUYsT0FBTyxZQUFQLEtBQXlCLFVBQXpCLEdBQXNDLFlBQXRDLEdBQXFELElBQXpKOztBQUVBLFFBQUksVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLFlBQU0sT0FBTyxPQUFQLENBQWUsd0dBQWYsQ0FBTjtBQUNEOztBQUVELFdBQU8sSUFBSSxPQUFKLENBQVksVUFBUyxPQUFULEVBQWtCLE1BQWxCLEVBQTBCO0FBQzNDLFVBQUksT0FBTyxNQUFQLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCLGVBQU8sR0FBUCxFQUFZLFVBQVMsR0FBVCxFQUFjO0FBQ3hCLGNBQUksR0FBSixFQUFTO0FBQUUsbUJBQU8sT0FBTyxHQUFQLENBQVA7QUFBcUI7QUFDaEM7QUFDRCxTQUhEO0FBSUQsT0FMRCxNQUtPO0FBQ0wsZ0JBQVEsT0FBTyxHQUFQLENBQVI7QUFDRDtBQUNGLEtBVE0sQ0FBUDtBQVVELEdBeEJNLENBQVA7QUF5QkQiLCJmaWxlIjoicnVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ3J1biA8c2NyaXB0Pic7XG59XG5cbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdJbml0aWFsaXplIGFuZCBydW4gYSBzY3JpcHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShbc2NyaXB0XSkge1xuICBpZiAoIXNjcmlwdCkgeyB0aHJvdyBlcnJvcnMudXNhZ2UoJ011c3Qgc3VwcGx5IGEgc2NyaXB0IHRvIGFwcC1jb250ZXh0IHJ1bi4nKTsgfVxuXG4gIGxldCBmdWxsUGF0aDtcbiAgdHJ5IHtcbiAgICBmdWxsUGF0aCA9IHJlcXVpcmUucmVzb2x2ZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgc2NyaXB0KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdDb3VsZCBub3QgZmluZCBzY3JpcHQgJyArIHNjcmlwdCArICcuJyk7XG4gIH1cblxuICByZXR1cm4gQXBwQ29udGV4dC5sb2FkKCkudHJhbnNpdGlvblRvKCdpbml0aWFsaXplZCcpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcmlwdE1vZHVsZTtcbiAgICB0cnkge1xuICAgICAgc2NyaXB0TW9kdWxlID0gcmVxdWlyZShmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1RoZXJlIHdhcyBhbiBlcnJvciB3aGlsZSBsb2FkaW5nIHlvdXIgc2NyaXB0LicsIGVycik7XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IHNjcmlwdE1vZHVsZSAmJiB0eXBlb2Yoc2NyaXB0TW9kdWxlLmV4ZWN1dGUpID09PSAnZnVuY3Rpb24nID8gc2NyaXB0TW9kdWxlLmV4ZWN1dGUgOiB0eXBlb2Yoc2NyaXB0TW9kdWxlKSA9PT0gJ2Z1bmN0aW9uJyA/IHNjcmlwdE1vZHVsZSA6IG51bGw7XG5cbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdUaGUgc2NyaXB0IG1vZHVsZSB5b3UgYXJlIHJ1bm5pbmcgZG9lcyBub3QgZXhwb3J0IGEgbWV0aG9kIG9yIGhhdmUga2V5IG5hbWVkIGV4ZWN1dGUgdGhhdCBpcyBhIG1ldGhvZC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAobWV0aG9kLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBtZXRob2QoQVBQLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7IHJldHVybiByZWplY3QoZXJyKTsgfVxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKG1ldGhvZChBUFApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=