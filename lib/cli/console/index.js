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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvY29uc29sZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFLZ0I7Ozs7Ozs7O0lBSko7Ozs7OztBQUVMLElBQU0sb0NBQWMsNEJBQWQ7O0FBRU4sU0FBUyxPQUFULEdBQW1CO0FBQ3hCLFNBQU8sV0FBVyxJQUFYLEdBQWtCLFlBQWxCLENBQStCLFdBQVcsUUFBWCxDQUFvQixXQUFwQixDQUEvQixDQUFnRSxJQUFoRSxDQUFxRSxZQUFXO0FBQ3JGLFdBQU8sUUFBUSxLQUFSLENBQWM7QUFDbkIsWUFBTSxJQUFJLElBQUosSUFBWSxhQUFaO0FBQ04sZUFBUyxJQUFJLE9BQUosR0FBYyxDQUFDLElBQUksT0FBSixDQUFZLEtBQVosRUFBbUIsSUFBSSxPQUFKLENBQVksS0FBWixFQUFtQixJQUFJLE9BQUosQ0FBWSxLQUFaLENBQXZDLENBQTBELElBQTFELENBQStELEdBQS9ELENBQWQsR0FBb0YsT0FBcEY7QUFDVCxtQkFBYSxJQUFJLFdBQUo7S0FIUixDQUFQLENBRHFGO0dBQVgsQ0FBNUUsQ0FEd0I7Q0FBbkIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuLi8uLi8uLi8nO1xuaW1wb3J0ICogYXMgQ29uc29sZSBmcm9tICcuL2NvbnNvbGUnO1xuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5pdGlhbGl6ZSBhbmQgb3BlbiBhIFJFUEwnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgcmV0dXJuIEFwcENvbnRleHQubG9hZCgpLnRyYW5zaXRpb25UbyhBcHBDb250ZXh0LlJ1bkxldmVsLkluaXRpYWxpemVkKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBDb25zb2xlLnN0YXJ0KHtcbiAgICAgIG5hbWU6IEFQUC5uYW1lIHx8ICdhcHAtY29udGV4dCcsXG4gICAgICB2ZXJzaW9uOiBBUFAudmVyc2lvbiA/IFtBUFAudmVyc2lvbi5tYWpvciwgQVBQLnZlcnNpb24ubWlub3IsIEFQUC52ZXJzaW9uLnBhdGNoXS5qb2luKCcuJykgOiAnMC4wLjAnLFxuICAgICAgZW52aXJvbm1lbnQ6IEFQUC5lbnZpcm9ubWVudFxuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==