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

  var fullPath = undefined;
  try {
    fullPath = require.resolve(_path2.default.join(process.cwd(), script));
  } catch (err) {
    throw errors.message('Could not find script ' + script + '.');
  }

  return _2.default.load().transitionTo('initialized').then(function () {
    var scriptModule = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvcnVuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQUtnQjtRQU1BOzs7Ozs7OztJQVRKOzs7Ozs7Ozs7O0FBR0wsU0FBUyxLQUFULEdBQWlCO0FBQ3RCLFNBQU8sY0FBUCxDQURzQjtDQUFqQjs7QUFJQSxJQUFNLG9DQUFjLDZCQUFkOztBQUVOLFNBQVMsT0FBVCxPQUEyQjs7O01BQVQsa0JBQVM7O0FBQ2hDLE1BQUksQ0FBQyxNQUFELEVBQVM7QUFBRSxVQUFNLE9BQU8sS0FBUCxDQUFhLDBDQUFiLENBQU4sQ0FBRjtHQUFiOztBQUVBLE1BQUksb0JBQUosQ0FIZ0M7QUFJaEMsTUFBSTtBQUNGLGVBQVcsUUFBUSxPQUFSLENBQWdCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLE1BQXpCLENBQWhCLENBQVgsQ0FERTtHQUFKLENBRUUsT0FBTyxHQUFQLEVBQVk7QUFDWixVQUFNLE9BQU8sT0FBUCxDQUFlLDJCQUEyQixNQUEzQixHQUFvQyxHQUFwQyxDQUFyQixDQURZO0dBQVo7O0FBSUYsU0FBTyxXQUFXLElBQVgsR0FBa0IsWUFBbEIsQ0FBK0IsYUFBL0IsRUFBOEMsSUFBOUMsQ0FBbUQsWUFBVztBQUNuRSxRQUFJLHdCQUFKLENBRG1FO0FBRW5FLFFBQUk7QUFDRixxQkFBZSxRQUFRLFFBQVIsQ0FBZixDQURFO0tBQUosQ0FFRSxPQUFPLEdBQVAsRUFBWTtBQUNaLGNBQVEsR0FBUixDQUFZLElBQUksS0FBSixDQUFaLENBRFk7QUFFWixZQUFNLE9BQU8sT0FBUCxDQUFlLCtDQUFmLEVBQWdFLEdBQWhFLENBQU4sQ0FGWTtLQUFaO0FBSUYsUUFBTSxTQUFTLGdCQUFnQixPQUFPLGFBQWEsT0FBYixLQUEwQixVQUFqQyxHQUE4QyxhQUFhLE9BQWIsR0FBdUIsT0FBTyxZQUFQLEtBQXlCLFVBQXpCLEdBQXNDLFlBQXRDLEdBQXFELElBQXJELENBUmpDOztBQVVuRSxRQUFJLFVBQVUsSUFBVixFQUFnQjtBQUNsQixZQUFNLE9BQU8sT0FBUCxDQUFlLHdHQUFmLENBQU4sQ0FEa0I7S0FBcEI7O0FBSUEsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsVUFBSSxPQUFPLE1BQVAsS0FBa0IsQ0FBbEIsRUFBcUI7QUFDdkIsZUFBTyxHQUFQLEVBQVksVUFBUyxHQUFULEVBQWM7QUFDeEIsY0FBSSxHQUFKLEVBQVM7QUFBRSxtQkFBTyxPQUFPLEdBQVAsQ0FBUCxDQUFGO1dBQVQ7QUFDQSxvQkFGd0I7U0FBZCxDQUFaLENBRHVCO09BQXpCLE1BS087QUFDTCxnQkFBUSxPQUFPLEdBQVAsQ0FBUixFQURLO09BTFA7S0FEaUIsQ0FBbkIsQ0FkbUU7R0FBWCxDQUExRCxDQVZnQztDQUEzQiIsImZpbGUiOiJydW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4uL2Vycm9ycyc7XG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuLi8uLi8nO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNhZ2UoKSB7XG4gIHJldHVybiAncnVuIDxzY3JpcHQ+Jztcbn1cblxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0luaXRpYWxpemUgYW5kIHJ1biBhIHNjcmlwdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKFtzY3JpcHRdKSB7XG4gIGlmICghc2NyaXB0KSB7IHRocm93IGVycm9ycy51c2FnZSgnTXVzdCBzdXBwbHkgYSBzY3JpcHQgdG8gYXBwLWNvbnRleHQgcnVuLicpOyB9XG5cbiAgbGV0IGZ1bGxQYXRoO1xuICB0cnkge1xuICAgIGZ1bGxQYXRoID0gcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBzY3JpcHQpKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ0NvdWxkIG5vdCBmaW5kIHNjcmlwdCAnICsgc2NyaXB0ICsgJy4nKTtcbiAgfVxuXG4gIHJldHVybiBBcHBDb250ZXh0LmxvYWQoKS50cmFuc2l0aW9uVG8oJ2luaXRpYWxpemVkJykudGhlbihmdW5jdGlvbigpIHtcbiAgICBsZXQgc2NyaXB0TW9kdWxlO1xuICAgIHRyeSB7XG4gICAgICBzY3JpcHRNb2R1bGUgPSByZXF1aXJlKGZ1bGxQYXRoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVyci5zdGFjayk7XG4gICAgICB0aHJvdyBlcnJvcnMubWVzc2FnZSgnVGhlcmUgd2FzIGFuIGVycm9yIHdoaWxlIGxvYWRpbmcgeW91ciBzY3JpcHQuJywgZXJyKTtcbiAgICB9XG4gICAgY29uc3QgbWV0aG9kID0gc2NyaXB0TW9kdWxlICYmIHR5cGVvZihzY3JpcHRNb2R1bGUuZXhlY3V0ZSkgPT09ICdmdW5jdGlvbicgPyBzY3JpcHRNb2R1bGUuZXhlY3V0ZSA6IHR5cGVvZihzY3JpcHRNb2R1bGUpID09PSAnZnVuY3Rpb24nID8gc2NyaXB0TW9kdWxlIDogbnVsbDtcblxuICAgIGlmIChtZXRob2QgPT0gbnVsbCkge1xuICAgICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoJ1RoZSBzY3JpcHQgbW9kdWxlIHlvdSBhcmUgcnVubmluZyBkb2VzIG5vdCBleHBvcnQgYSBtZXRob2Qgb3IgaGF2ZSBrZXkgbmFtZWQgZXhlY3V0ZSB0aGF0IGlzIGEgbWV0aG9kLicpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGlmIChtZXRob2QubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIG1ldGhvZChBUFAsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHsgcmV0dXJuIHJlamVjdChlcnIpOyB9XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUobWV0aG9kKEFQUCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==