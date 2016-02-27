'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (argv) {
  commands.execute(argv).then(function (code) {
    process.exit(code);
  });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commandContainer = require('../command-container');

var _commandContainer2 = _interopRequireDefault(_commandContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var commands = new _commandContainer2.default('app-context');

var rootDir = __dirname;
_fs2.default.readdirSync(rootDir).forEach(function (filename) {
  var name = filename.replace(/\.js$/, '');
  if (name !== 'index') {
    commands.add(name, require(_path2.default.join(rootDir, filename)));
  }
});

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQWVlLFVBQVMsSUFBVCxFQUFlO0FBQzVCLFdBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QixJQUF2QixDQUE0QixVQUFTLElBQVQsRUFBZTtBQUN6QyxZQUFRLElBQVIsQ0FBYSxJQUFiLEVBRHlDO0dBQWYsQ0FBNUIsQ0FENEI7Q0FBZjs7Ozs7Ozs7Ozs7Ozs7OztBQVZmLElBQU0sV0FBVywrQkFBcUIsYUFBckIsQ0FBWDs7QUFFTixJQUFNLFVBQVUsU0FBVjtBQUNOLGFBQUcsV0FBSCxDQUFlLE9BQWYsRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBUyxRQUFULEVBQW1CO0FBQ2pELE1BQU0sT0FBTyxTQUFTLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEIsRUFBMUIsQ0FBUCxDQUQyQztBQUVqRCxNQUFJLFNBQVMsT0FBVCxFQUFrQjtBQUNwQixhQUFTLEdBQVQsQ0FBYSxJQUFiLEVBQW1CLFFBQVEsZUFBSyxJQUFMLENBQVUsT0FBVixFQUFtQixRQUFuQixDQUFSLENBQW5CLEVBRG9CO0dBQXRCO0NBRjhCLENBQWhDIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgQ29tbWFuZENvbnRhaW5lciBmcm9tICcuLi9jb21tYW5kLWNvbnRhaW5lcic7XG5cbmNvbnN0IGNvbW1hbmRzID0gbmV3IENvbW1hbmRDb250YWluZXIoJ2FwcC1jb250ZXh0Jyk7XG5cbmNvbnN0IHJvb3REaXIgPSBfX2Rpcm5hbWU7XG5mcy5yZWFkZGlyU3luYyhyb290RGlyKS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGVuYW1lKSB7XG4gIGNvbnN0IG5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKC9cXC5qcyQvLCAnJyk7XG4gIGlmIChuYW1lICE9PSAnaW5kZXgnKSB7XG4gICAgY29tbWFuZHMuYWRkKG5hbWUsIHJlcXVpcmUocGF0aC5qb2luKHJvb3REaXIsIGZpbGVuYW1lKSkpO1xuICB9XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oYXJndikge1xuICBjb21tYW5kcy5leGVjdXRlKGFyZ3YpLnRoZW4oZnVuY3Rpb24oY29kZSkge1xuICAgIHByb2Nlc3MuZXhpdChjb2RlKTtcbiAgfSk7XG59XG4iXX0=