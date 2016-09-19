'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.execute = execute;

var _ = require('../../../');

var _2 = _interopRequireDefault(_);

var _console = require('./console');

var Console = _interopRequireWildcard(_console);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Initialize and open a REPL';

function execute() {
  return _2.default.load().transitionTo(_2.default.RunLevel.Initialized).then(function () {
    return Console.start({
      name: APP.name || 'app-context',
      version: APP.version ? [APP.version.major, APP.version.minor, APP.version.patch].join('.') : '0.0.0',
      environment: APP.environment
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvY29uc29sZS9pbmRleC5qcyJdLCJuYW1lcyI6WyJleGVjdXRlIiwiQ29uc29sZSIsImRlc2NyaXB0aW9uIiwibG9hZCIsInRyYW5zaXRpb25UbyIsIlJ1bkxldmVsIiwiSW5pdGlhbGl6ZWQiLCJ0aGVuIiwic3RhcnQiLCJuYW1lIiwiQVBQIiwidmVyc2lvbiIsIm1ham9yIiwibWlub3IiLCJwYXRjaCIsImpvaW4iLCJlbnZpcm9ubWVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBS2dCQSxPLEdBQUFBLE87O0FBTGhCOzs7O0FBQ0E7O0lBQVlDLE87Ozs7OztBQUVMLElBQU1DLG9DQUFjLDRCQUFwQjs7QUFFQSxTQUFTRixPQUFULEdBQW1CO0FBQ3hCLFNBQU8sV0FBV0csSUFBWCxHQUFrQkMsWUFBbEIsQ0FBK0IsV0FBV0MsUUFBWCxDQUFvQkMsV0FBbkQsRUFBZ0VDLElBQWhFLENBQXFFLFlBQVc7QUFDckYsV0FBT04sUUFBUU8sS0FBUixDQUFjO0FBQ25CQyxZQUFNQyxJQUFJRCxJQUFKLElBQVksYUFEQztBQUVuQkUsZUFBU0QsSUFBSUMsT0FBSixHQUFjLENBQUNELElBQUlDLE9BQUosQ0FBWUMsS0FBYixFQUFvQkYsSUFBSUMsT0FBSixDQUFZRSxLQUFoQyxFQUF1Q0gsSUFBSUMsT0FBSixDQUFZRyxLQUFuRCxFQUEwREMsSUFBMUQsQ0FBK0QsR0FBL0QsQ0FBZCxHQUFvRixPQUYxRTtBQUduQkMsbUJBQWFOLElBQUlNO0FBSEUsS0FBZCxDQUFQO0FBS0QsR0FOTSxDQUFQO0FBT0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuLi8uLi8uLi8nO1xuaW1wb3J0ICogYXMgQ29uc29sZSBmcm9tICcuL2NvbnNvbGUnO1xuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5pdGlhbGl6ZSBhbmQgb3BlbiBhIFJFUEwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgcmV0dXJuIEFwcENvbnRleHQubG9hZCgpLnRyYW5zaXRpb25UbyhBcHBDb250ZXh0LlJ1bkxldmVsLkluaXRpYWxpemVkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDb25zb2xlLnN0YXJ0KHtcbiAgICAgIG5hbWU6IEFQUC5uYW1lIHx8ICdhcHAtY29udGV4dCcsXG4gICAgICB2ZXJzaW9uOiBBUFAudmVyc2lvbiA/IFtBUFAudmVyc2lvbi5tYWpvciwgQVBQLnZlcnNpb24ubWlub3IsIEFQUC52ZXJzaW9uLnBhdGNoXS5qb2luKCcuJykgOiAnMC4wLjAnLFxuICAgICAgZW52aXJvbm1lbnQ6IEFQUC5lbnZpcm9ubWVudFxuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==