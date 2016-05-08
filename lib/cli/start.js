'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.execute = execute;

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Initialize and start your project';

function execute() {
  return _2.default.load().transitionTo(10).then(function () {
    return new Promise(function (resolve, reject) {
      process.on('SIGINT', function () {
        resolve();
      });
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc3RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBSWdCLE8sR0FBQSxPOztBQUpoQjs7Ozs7O0FBRU8sSUFBTSxvQ0FBYyxtQ0FBcEI7O0FBRUEsU0FBUyxPQUFULEdBQW1CO0FBQ3hCLFNBQU8sV0FBVyxJQUFYLEdBQWtCLFlBQWxCLENBQStCLEVBQS9CLEVBQW1DLElBQW5DLENBQXdDLFlBQVc7QUFDeEQsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsY0FBUSxFQUFSLENBQVcsUUFBWCxFQUFxQixZQUFXO0FBQzlCO0FBQ0QsT0FGRDtBQUdELEtBSk0sQ0FBUDtBQUtELEdBTk0sQ0FBUDtBQU9EIiwiZmlsZSI6InN0YXJ0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0luaXRpYWxpemUgYW5kIHN0YXJ0IHlvdXIgcHJvamVjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKCkge1xuICByZXR1cm4gQXBwQ29udGV4dC5sb2FkKCkudHJhbnNpdGlvblRvKDEwKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=