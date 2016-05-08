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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvY29uc29sZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFLZ0IsTyxHQUFBLE87O0FBTGhCOzs7O0FBQ0E7O0lBQVksTzs7Ozs7O0FBRUwsSUFBTSxvQ0FBYyw0QkFBcEI7O0FBRUEsU0FBUyxPQUFULEdBQW1CO0FBQ3hCLFNBQU8sV0FBVyxJQUFYLEdBQWtCLFlBQWxCLENBQStCLFdBQVcsUUFBWCxDQUFvQixXQUFuRCxFQUFnRSxJQUFoRSxDQUFxRSxZQUFXO0FBQ3JGLFdBQU8sUUFBUSxLQUFSLENBQWM7QUFDbkIsWUFBTSxJQUFJLElBQUosSUFBWSxhQURDO0FBRW5CLGVBQVMsSUFBSSxPQUFKLEdBQWMsQ0FBQyxJQUFJLE9BQUosQ0FBWSxLQUFiLEVBQW9CLElBQUksT0FBSixDQUFZLEtBQWhDLEVBQXVDLElBQUksT0FBSixDQUFZLEtBQW5ELEVBQTBELElBQTFELENBQStELEdBQS9ELENBQWQsR0FBb0YsT0FGMUU7QUFHbkIsbUJBQWEsSUFBSTtBQUhFLEtBQWQsQ0FBUDtBQUtELEdBTk0sQ0FBUDtBQU9EIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vLi4vJztcbmltcG9ydCAqIGFzIENvbnNvbGUgZnJvbSAnLi9jb25zb2xlJztcblxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0luaXRpYWxpemUgYW5kIG9wZW4gYSBSRVBMJztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG4gIHJldHVybiBBcHBDb250ZXh0LmxvYWQoKS50cmFuc2l0aW9uVG8oQXBwQ29udGV4dC5SdW5MZXZlbC5Jbml0aWFsaXplZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gQ29uc29sZS5zdGFydCh7XG4gICAgICBuYW1lOiBBUFAubmFtZSB8fCAnYXBwLWNvbnRleHQnLFxuICAgICAgdmVyc2lvbjogQVBQLnZlcnNpb24gPyBbQVBQLnZlcnNpb24ubWFqb3IsIEFQUC52ZXJzaW9uLm1pbm9yLCBBUFAudmVyc2lvbi5wYXRjaF0uam9pbignLicpIDogJzAuMC4wJyxcbiAgICAgIGVudmlyb25tZW50OiBBUFAuZW52aXJvbm1lbnRcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=