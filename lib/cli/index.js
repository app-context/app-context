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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5kZXguanMiXSwibmFtZXMiOlsiYXJndiIsImNvbW1hbmRzIiwiZXhlY3V0ZSIsInRoZW4iLCJjb2RlIiwicHJvY2VzcyIsImV4aXQiLCJyb290RGlyIiwiX19kaXJuYW1lIiwicmVhZGRpclN5bmMiLCJmb3JFYWNoIiwiZmlsZW5hbWUiLCJuYW1lIiwicmVwbGFjZSIsImFkZCIsInJlcXVpcmUiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7a0JBZWUsVUFBU0EsSUFBVCxFQUFlO0FBQzVCQyxXQUFTQyxPQUFULENBQWlCRixJQUFqQixFQUF1QkcsSUFBdkIsQ0FBNEIsVUFBU0MsSUFBVCxFQUFlO0FBQ3pDQyxZQUFRQyxJQUFSLENBQWFGLElBQWI7QUFDRCxHQUZEO0FBR0QsQzs7QUFuQkQ7Ozs7QUFDQTs7OztBQUVBOzs7Ozs7QUFFQSxJQUFNSCxXQUFXLCtCQUFxQixhQUFyQixDQUFqQjs7QUFFQSxJQUFNTSxVQUFVQyxTQUFoQjtBQUNBLGFBQUdDLFdBQUgsQ0FBZUYsT0FBZixFQUF3QkcsT0FBeEIsQ0FBZ0MsVUFBU0MsUUFBVCxFQUFtQjtBQUNqRCxNQUFNQyxPQUFPRCxTQUFTRSxPQUFULENBQWlCLE9BQWpCLEVBQTBCLEVBQTFCLENBQWI7QUFDQSxNQUFJRCxTQUFTLE9BQWIsRUFBc0I7QUFDcEJYLGFBQVNhLEdBQVQsQ0FBYUYsSUFBYixFQUFtQkcsUUFBUSxlQUFLQyxJQUFMLENBQVVULE9BQVYsRUFBbUJJLFFBQW5CLENBQVIsQ0FBbkI7QUFDRDtBQUNGLENBTEQiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCBDb21tYW5kQ29udGFpbmVyIGZyb20gJy4uL2NvbW1hbmQtY29udGFpbmVyJztcblxuY29uc3QgY29tbWFuZHMgPSBuZXcgQ29tbWFuZENvbnRhaW5lcignYXBwLWNvbnRleHQnKTtcblxuY29uc3Qgcm9vdERpciA9IF9fZGlybmFtZTtcbmZzLnJlYWRkaXJTeW5jKHJvb3REaXIpLmZvckVhY2goZnVuY3Rpb24oZmlsZW5hbWUpIHtcbiAgY29uc3QgbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoL1xcLmpzJC8sICcnKTtcbiAgaWYgKG5hbWUgIT09ICdpbmRleCcpIHtcbiAgICBjb21tYW5kcy5hZGQobmFtZSwgcmVxdWlyZShwYXRoLmpvaW4ocm9vdERpciwgZmlsZW5hbWUpKSk7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihhcmd2KSB7XG4gIGNvbW1hbmRzLmV4ZWN1dGUoYXJndikudGhlbihmdW5jdGlvbihjb2RlKSB7XG4gICAgcHJvY2Vzcy5leGl0KGNvZGUpO1xuICB9KTtcbn1cbiJdfQ==