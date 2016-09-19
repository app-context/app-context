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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvc3RhcnQuanMiXSwibmFtZXMiOlsiZXhlY3V0ZSIsImRlc2NyaXB0aW9uIiwibG9hZCIsInRyYW5zaXRpb25UbyIsInRoZW4iLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsInByb2Nlc3MiLCJvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBSWdCQSxPLEdBQUFBLE87O0FBSmhCOzs7Ozs7QUFFTyxJQUFNQyxvQ0FBYyxtQ0FBcEI7O0FBRUEsU0FBU0QsT0FBVCxHQUFtQjtBQUN4QixTQUFPLFdBQVdFLElBQVgsR0FBa0JDLFlBQWxCLENBQStCLEVBQS9CLEVBQW1DQyxJQUFuQyxDQUF3QyxZQUFXO0FBQ3hELFdBQU8sSUFBSUMsT0FBSixDQUFZLFVBQVNDLE9BQVQsRUFBa0JDLE1BQWxCLEVBQTBCO0FBQzNDQyxjQUFRQyxFQUFSLENBQVcsUUFBWCxFQUFxQixZQUFXO0FBQzlCSDtBQUNELE9BRkQ7QUFHRCxLQUpNLENBQVA7QUFLRCxHQU5NLENBQVA7QUFPRCIsImZpbGUiOiJzdGFydC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcHBDb250ZXh0IGZyb20gJy4uLy4uLyc7XG5cbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdJbml0aWFsaXplIGFuZCBzdGFydCB5b3VyIHByb2plY3QnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgcmV0dXJuIEFwcENvbnRleHQubG9hZCgpLnRyYW5zaXRpb25UbygxMCkudGhlbihmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBwcm9jZXNzLm9uKCdTSUdJTlQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIl19