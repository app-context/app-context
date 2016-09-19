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

var _es6require = require('@mattinsler/es6require');

var _es6require2 = _interopRequireDefault(_es6require);

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
      scriptModule = (0, _es6require2.default)(fullPath);
    } catch (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbInVzYWdlIiwiZXhlY3V0ZSIsImVycm9ycyIsImRlc2NyaXB0aW9uIiwic2NyaXB0IiwiZnVsbFBhdGgiLCJyZXF1aXJlIiwicmVzb2x2ZSIsImpvaW4iLCJwcm9jZXNzIiwiY3dkIiwiZXJyIiwibWVzc2FnZSIsImxvYWQiLCJ0cmFuc2l0aW9uVG8iLCJ0aGVuIiwic2NyaXB0TW9kdWxlIiwibWV0aG9kIiwiUHJvbWlzZSIsInJlamVjdCIsImxlbmd0aCIsIkFQUCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O1FBTWdCQSxLLEdBQUFBLEs7UUFNQUMsTyxHQUFBQSxPOztBQVpoQjs7OztBQUNBOzs7O0FBRUE7O0lBQVlDLE07O0FBQ1o7Ozs7Ozs7O0FBRU8sU0FBU0YsS0FBVCxHQUFpQjtBQUN0QixTQUFPLGNBQVA7QUFDRDs7QUFFTSxJQUFNRyxvQ0FBYyw2QkFBcEI7O0FBRUEsU0FBU0YsT0FBVCxPQUEyQjtBQUFBOztBQUFBLE1BQVRHLE1BQVM7O0FBQ2hDLE1BQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQUUsVUFBTUYsT0FBT0YsS0FBUCxDQUFhLDBDQUFiLENBQU47QUFBaUU7O0FBRWhGLE1BQUlLLGlCQUFKO0FBQ0EsTUFBSTtBQUNGQSxlQUFXQyxRQUFRQyxPQUFSLENBQWdCLGVBQUtDLElBQUwsQ0FBVUMsUUFBUUMsR0FBUixFQUFWLEVBQXlCTixNQUF6QixDQUFoQixDQUFYO0FBQ0QsR0FGRCxDQUVFLE9BQU9PLEdBQVAsRUFBWTtBQUNaLFVBQU1ULE9BQU9VLE9BQVAsQ0FBZSwyQkFBMkJSLE1BQTNCLEdBQW9DLEdBQW5ELENBQU47QUFDRDs7QUFFRCxTQUFPLFdBQVdTLElBQVgsR0FBa0JDLFlBQWxCLENBQStCLGFBQS9CLEVBQThDQyxJQUE5QyxDQUFtRCxZQUFXO0FBQ25FLFFBQUlDLHFCQUFKO0FBQ0EsUUFBSTtBQUNGQSxxQkFBZSwwQkFBV1gsUUFBWCxDQUFmO0FBQ0QsS0FGRCxDQUVFLE9BQU9NLEdBQVAsRUFBWTtBQUNaLFlBQU1ULE9BQU9VLE9BQVAsQ0FBZSwrQ0FBZixFQUFnRUQsR0FBaEUsQ0FBTjtBQUNEO0FBQ0QsUUFBTU0sU0FBU0QsZ0JBQWdCLE9BQU9BLGFBQWFmLE9BQXBCLEtBQWlDLFVBQWpELEdBQThEZSxhQUFhZixPQUEzRSxHQUFxRixPQUFPZSxZQUFQLEtBQXlCLFVBQXpCLEdBQXNDQSxZQUF0QyxHQUFxRCxJQUF6Sjs7QUFFQSxRQUFJQyxVQUFVLElBQWQsRUFBb0I7QUFDbEIsWUFBTWYsT0FBT1UsT0FBUCxDQUFlLHdHQUFmLENBQU47QUFDRDs7QUFFRCxXQUFPLElBQUlNLE9BQUosQ0FBWSxVQUFTWCxPQUFULEVBQWtCWSxNQUFsQixFQUEwQjtBQUMzQyxVQUFJRixPQUFPRyxNQUFQLEtBQWtCLENBQXRCLEVBQXlCO0FBQ3ZCSCxlQUFPSSxHQUFQLEVBQVksVUFBU1YsR0FBVCxFQUFjO0FBQ3hCLGNBQUlBLEdBQUosRUFBUztBQUFFLG1CQUFPUSxPQUFPUixHQUFQLENBQVA7QUFBcUI7QUFDaENKO0FBQ0QsU0FIRDtBQUlELE9BTEQsTUFLTztBQUNMQSxnQkFBUVUsT0FBT0ksR0FBUCxDQUFSO0FBQ0Q7QUFDRixLQVRNLENBQVA7QUFVRCxHQXZCTSxDQUFQO0FBd0JEIiwiZmlsZSI6InJ1bi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGVzNnJlcXVpcmUgZnJvbSAnQG1hdHRpbnNsZXIvZXM2cmVxdWlyZSc7XG5cbmltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ3J1biA8c2NyaXB0Pic7XG59XG5cbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdJbml0aWFsaXplIGFuZCBydW4gYSBzY3JpcHQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZShbc2NyaXB0XSkge1xuICBpZiAoIXNjcmlwdCkgeyB0aHJvdyBlcnJvcnMudXNhZ2UoJ011c3Qgc3VwcGx5IGEgc2NyaXB0IHRvIGFwcC1jb250ZXh0IHJ1bi4nKTsgfVxuXG4gIGxldCBmdWxsUGF0aDtcbiAgdHJ5IHtcbiAgICBmdWxsUGF0aCA9IHJlcXVpcmUucmVzb2x2ZShwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgc2NyaXB0KSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdDb3VsZCBub3QgZmluZCBzY3JpcHQgJyArIHNjcmlwdCArICcuJyk7XG4gIH1cblxuICByZXR1cm4gQXBwQ29udGV4dC5sb2FkKCkudHJhbnNpdGlvblRvKCdpbml0aWFsaXplZCcpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgbGV0IHNjcmlwdE1vZHVsZTtcbiAgICB0cnkge1xuICAgICAgc2NyaXB0TW9kdWxlID0gZXM2cmVxdWlyZShmdWxsUGF0aCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnVGhlcmUgd2FzIGFuIGVycm9yIHdoaWxlIGxvYWRpbmcgeW91ciBzY3JpcHQuJywgZXJyKTtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gc2NyaXB0TW9kdWxlICYmIHR5cGVvZihzY3JpcHRNb2R1bGUuZXhlY3V0ZSkgPT09ICdmdW5jdGlvbicgPyBzY3JpcHRNb2R1bGUuZXhlY3V0ZSA6IHR5cGVvZihzY3JpcHRNb2R1bGUpID09PSAnZnVuY3Rpb24nID8gc2NyaXB0TW9kdWxlIDogbnVsbDtcblxuICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1RoZSBzY3JpcHQgbW9kdWxlIHlvdSBhcmUgcnVubmluZyBkb2VzIG5vdCBleHBvcnQgYSBtZXRob2Qgb3IgaGF2ZSBrZXkgbmFtZWQgZXhlY3V0ZSB0aGF0IGlzIGEgbWV0aG9kLicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmIChtZXRob2QubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIG1ldGhvZChBUFAsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUobWV0aG9kKEFQUCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==