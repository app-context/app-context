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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQU1nQixLLEdBQUEsSztRQU1BLE8sR0FBQSxPOztBQVpoQjs7OztBQUNBOzs7O0FBRUE7O0lBQVksTTs7QUFDWjs7Ozs7Ozs7QUFFTyxTQUFTLEtBQVQsR0FBaUI7QUFDdEIsU0FBTyxjQUFQO0FBQ0Q7O0FBRU0sSUFBTSxvQ0FBYyw2QkFBcEI7O0FBRUEsU0FBUyxPQUFULE9BQTJCO0FBQUE7O0FBQUEsTUFBVCxNQUFTOztBQUNoQyxNQUFJLENBQUMsTUFBTCxFQUFhO0FBQUUsVUFBTSxPQUFPLEtBQVAsQ0FBYSwwQ0FBYixDQUFOO0FBQWlFOztBQUVoRixNQUFJLGlCQUFKO0FBQ0EsTUFBSTtBQUNGLGVBQVcsUUFBUSxPQUFSLENBQWdCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLE1BQXpCLENBQWhCLENBQVg7QUFDRCxHQUZELENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDWixVQUFNLE9BQU8sT0FBUCxDQUFlLDJCQUEyQixNQUEzQixHQUFvQyxHQUFuRCxDQUFOO0FBQ0Q7O0FBRUQsU0FBTyxXQUFXLElBQVgsR0FBa0IsWUFBbEIsQ0FBK0IsYUFBL0IsRUFBOEMsSUFBOUMsQ0FBbUQsWUFBVztBQUNuRSxRQUFJLHFCQUFKO0FBQ0EsUUFBSTtBQUNGLHFCQUFlLDBCQUFXLFFBQVgsQ0FBZjtBQUNELEtBRkQsQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLFlBQU0sT0FBTyxPQUFQLENBQWUsK0NBQWYsRUFBZ0UsR0FBaEUsQ0FBTjtBQUNEO0FBQ0QsUUFBTSxTQUFTLGdCQUFnQixPQUFPLGFBQWEsT0FBcEIsS0FBaUMsVUFBakQsR0FBOEQsYUFBYSxPQUEzRSxHQUFxRixPQUFPLFlBQVAsS0FBeUIsVUFBekIsR0FBc0MsWUFBdEMsR0FBcUQsSUFBeko7O0FBRUEsUUFBSSxVQUFVLElBQWQsRUFBb0I7QUFDbEIsWUFBTSxPQUFPLE9BQVAsQ0FBZSx3R0FBZixDQUFOO0FBQ0Q7O0FBRUQsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsVUFBSSxPQUFPLE1BQVAsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsZUFBTyxHQUFQLEVBQVksVUFBUyxHQUFULEVBQWM7QUFDeEIsY0FBSSxHQUFKLEVBQVM7QUFBRSxtQkFBTyxPQUFPLEdBQVAsQ0FBUDtBQUFxQjtBQUNoQztBQUNELFNBSEQ7QUFJRCxPQUxELE1BS087QUFDTCxnQkFBUSxPQUFPLEdBQVAsQ0FBUjtBQUNEO0FBQ0YsS0FUTSxDQUFQO0FBVUQsR0F2Qk0sQ0FBUDtBQXdCRCIsImZpbGUiOiJydW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBlczZyZXF1aXJlIGZyb20gJ0BtYXR0aW5zbGVyL2VzNnJlcXVpcmUnO1xuXG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCBBcHBDb250ZXh0IGZyb20gJy4uLy4uLyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2FnZSgpIHtcbiAgcmV0dXJuICdydW4gPHNjcmlwdD4nO1xufVxuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5pdGlhbGl6ZSBhbmQgcnVuIGEgc2NyaXB0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoW3NjcmlwdF0pIHtcbiAgaWYgKCFzY3JpcHQpIHsgdGhyb3cgZXJyb3JzLnVzYWdlKCdNdXN0IHN1cHBseSBhIHNjcmlwdCB0byBhcHAtY29udGV4dCBydW4uJyk7IH1cblxuICBsZXQgZnVsbFBhdGg7XG4gIHRyeSB7XG4gICAgZnVsbFBhdGggPSByZXF1aXJlLnJlc29sdmUocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHNjcmlwdCkpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnQ291bGQgbm90IGZpbmQgc2NyaXB0ICcgKyBzY3JpcHQgKyAnLicpO1xuICB9XG5cbiAgcmV0dXJuIEFwcENvbnRleHQubG9hZCgpLnRyYW5zaXRpb25UbygnaW5pdGlhbGl6ZWQnKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIGxldCBzY3JpcHRNb2R1bGU7XG4gICAgdHJ5IHtcbiAgICAgIHNjcmlwdE1vZHVsZSA9IGVzNnJlcXVpcmUoZnVsbFBhdGgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1RoZXJlIHdhcyBhbiBlcnJvciB3aGlsZSBsb2FkaW5nIHlvdXIgc2NyaXB0LicsIGVycik7XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IHNjcmlwdE1vZHVsZSAmJiB0eXBlb2Yoc2NyaXB0TW9kdWxlLmV4ZWN1dGUpID09PSAnZnVuY3Rpb24nID8gc2NyaXB0TW9kdWxlLmV4ZWN1dGUgOiB0eXBlb2Yoc2NyaXB0TW9kdWxlKSA9PT0gJ2Z1bmN0aW9uJyA/IHNjcmlwdE1vZHVsZSA6IG51bGw7XG5cbiAgICBpZiAobWV0aG9kID09IG51bGwpIHtcbiAgICAgIHRocm93IGVycm9ycy5tZXNzYWdlKCdUaGUgc2NyaXB0IG1vZHVsZSB5b3UgYXJlIHJ1bm5pbmcgZG9lcyBub3QgZXhwb3J0IGEgbWV0aG9kIG9yIGhhdmUga2V5IG5hbWVkIGV4ZWN1dGUgdGhhdCBpcyBhIG1ldGhvZC4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZiAobWV0aG9kLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBtZXRob2QoQVBQLCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICBpZiAoZXJyKSB7IHJldHVybiByZWplY3QoZXJyKTsgfVxuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKG1ldGhvZChBUFApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=