'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.execute = execute;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Print configuration';

function execute(args, opts) {
  var context = void 0;

  if (opts.g || opts.global) {
    context = _2.default.loadGlobal();
  } else {
    context = _2.default.load();
  }

  return context.transitionTo('configured').then(function () {
    console.log(['', (0, _jsonStringifySafe2.default)((0, _utils.orderObject)(APP.config), null, 2), ''].join(_os2.default.EOL));
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQVFnQixPLEdBQUEsTzs7QUFSaEI7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFFTyxJQUFNLG9DQUFjLHFCQUFwQjs7QUFFQSxTQUFTLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkI7QUFDbEMsTUFBSSxnQkFBSjs7QUFFQSxNQUFJLEtBQUssQ0FBTCxJQUFVLEtBQUssTUFBbkIsRUFBMkI7QUFDekIsY0FBVSxXQUFXLFVBQVgsRUFBVjtBQUNELEdBRkQsTUFFTztBQUNMLGNBQVUsV0FBVyxJQUFYLEVBQVY7QUFDRDs7QUFFRCxTQUFPLFFBQVEsWUFBUixDQUFxQixZQUFyQixFQUFtQyxJQUFuQyxDQUF3QyxZQUFXO0FBQ3hELFlBQVEsR0FBUixDQUFZLENBQ1YsRUFEVSxFQUVWLGlDQUFVLHdCQUFZLElBQUksTUFBaEIsQ0FBVixFQUFtQyxJQUFuQyxFQUF5QyxDQUF6QyxDQUZVLEVBR1YsRUFIVSxFQUlWLElBSlUsQ0FJTCxhQUFHLEdBSkUsQ0FBWjtBQUtELEdBTk0sQ0FBUDtBQU9EIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJ2pzb24tc3RyaW5naWZ5LXNhZmUnO1xuXG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuLi8uLi8nO1xuaW1wb3J0IHtvcmRlck9iamVjdH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnUHJpbnQgY29uZmlndXJhdGlvbic7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKGFyZ3MsIG9wdHMpIHtcbiAgbGV0IGNvbnRleHQ7XG5cbiAgaWYgKG9wdHMuZyB8fCBvcHRzLmdsb2JhbCkge1xuICAgIGNvbnRleHQgPSBBcHBDb250ZXh0LmxvYWRHbG9iYWwoKTtcbiAgfSBlbHNlIHtcbiAgICBjb250ZXh0ID0gQXBwQ29udGV4dC5sb2FkKCk7XG4gIH1cblxuICByZXR1cm4gY29udGV4dC50cmFuc2l0aW9uVG8oJ2NvbmZpZ3VyZWQnKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFtcbiAgICAgICcnLFxuICAgICAgc3RyaW5naWZ5KG9yZGVyT2JqZWN0KEFQUC5jb25maWcpLCBudWxsLCAyKSxcbiAgICAgICcnXG4gICAgXS5qb2luKG9zLkVPTCkpO1xuICB9KTtcbn1cbiJdfQ==