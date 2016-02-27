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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc3RhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBSWdCOzs7Ozs7OztBQUZULElBQU0sb0NBQWMsbUNBQWQ7O0FBRU4sU0FBUyxPQUFULEdBQW1CO0FBQ3hCLFNBQU8sV0FBVyxJQUFYLEdBQWtCLFlBQWxCLENBQStCLEVBQS9CLEVBQW1DLElBQW5DLENBQXdDLFlBQVc7QUFDeEQsV0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFTLE9BQVQsRUFBa0IsTUFBbEIsRUFBMEI7QUFDM0MsY0FBUSxFQUFSLENBQVcsUUFBWCxFQUFxQixZQUFXO0FBQzlCLGtCQUQ4QjtPQUFYLENBQXJCLENBRDJDO0tBQTFCLENBQW5CLENBRHdEO0dBQVgsQ0FBL0MsQ0FEd0I7Q0FBbkIiLCJmaWxlIjoic3RhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuLi8uLi8nO1xuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5pdGlhbGl6ZSBhbmQgc3RhcnQgeW91ciBwcm9qZWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoKSB7XG4gIHJldHVybiBBcHBDb250ZXh0LmxvYWQoKS50cmFuc2l0aW9uVG8oMTApLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcHJvY2Vzcy5vbignU0lHSU5UJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==