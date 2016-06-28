'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commandContainer = require('../command-container');

var _commandContainer2 = _interopRequireDefault(_commandContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

var commands = new _commandContainer2.default('app-context');

commands.addDirectory(__dirname);

exports.default = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(argv) {
    var code;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return commands.execute(argv);

          case 2:
            code = _context.sent;

            process.exit(code);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x) {
    return ref.apply(this, arguments);
  };
}();

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUEsSUFBTSxXQUFXLCtCQUFxQixhQUFyQixDQUFqQjs7QUFFQSxTQUFTLFlBQVQsQ0FBc0IsU0FBdEI7OztzREFFZSxpQkFBZSxJQUFmO0FBQUEsUUFDUCxJQURPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLG1CQUNNLFNBQVMsT0FBVCxDQUFpQixJQUFqQixDQUROOztBQUFBO0FBQ1AsZ0JBRE87O0FBRWIsb0JBQVEsSUFBUixDQUFhLElBQWI7O0FBRmE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDb21tYW5kQ29udGFpbmVyIGZyb20gJy4uL2NvbW1hbmQtY29udGFpbmVyJztcblxuY29uc3QgY29tbWFuZHMgPSBuZXcgQ29tbWFuZENvbnRhaW5lcignYXBwLWNvbnRleHQnKTtcblxuY29tbWFuZHMuYWRkRGlyZWN0b3J5KF9fZGlybmFtZSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uKGFyZ3YpIHtcbiAgY29uc3QgY29kZSA9IGF3YWl0IGNvbW1hbmRzLmV4ZWN1dGUoYXJndik7XG4gIHByb2Nlc3MuZXhpdChjb2RlKTtcbn1cbiJdfQ==