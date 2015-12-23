'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.execute = execute;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Initialize and start your project';

function execute() {
  return _2.default.load().transitionTo(10).then(function () {
    return new _bluebird2.default(function (resolve, reject) {
      process.on('SIGINT', function () {
        resolve();
      });
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc3RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBTWdCLE9BQU8sR0FBUCxPQUFPOzs7Ozs7Ozs7Ozs7QUFGaEIsSUFBTSxXQUFXLFdBQVgsV0FBVyxHQUFHLG1DQUFtQyxDQUFDOztBQUV4RCxTQUFTLE9BQU8sR0FBRztBQUN4QixTQUFPLFdBQVcsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFXO0FBQ3hELFdBQU8sdUJBQVksVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFO0FBQzNDLGFBQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFlBQVc7QUFDOUIsZUFBTyxFQUFFLENBQUM7T0FDWCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJzdGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcblxuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0luaXRpYWxpemUgYW5kIHN0YXJ0IHlvdXIgcHJvamVjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKCkge1xuICByZXR1cm4gQXBwQ29udGV4dC5sb2FkKCkudHJhbnNpdGlvblRvKDEwKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHByb2Nlc3Mub24oJ1NJR0lOVCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=