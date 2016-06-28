'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadPackageFile = exports.findPackageFile = exports.findPackageDir = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findPackageFile() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var filename = _path2.default.join(dir, 'package.json');
  if (_fs2.default.existsSync(filename)) {
    return filename;
  }

  var parentDir = _path2.default.join(dir, '..');
  if (dir === parentDir) {
    return undefined;
  }

  return findPackageFile(parentDir);
}

function findPackageDir() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var filename = findPackageFile(dir);
  return filename ? _path2.default.dirname(filename) : undefined;
}

function loadPackageFile() {
  var dir = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];

  var filename = findPackageFile(dir);
  return filename ? require(filename) : undefined;
}

//
// static getAppContextFilenameFromPackage(shouldThrow = true) {
//   try {
//     return this.findAndLoadPackage()['app-context'];
//   } catch (err) {
//     if (shouldThrow) { throw err; }
//   }
// }

exports.findPackageDir = findPackageDir;
exports.findPackageFile = findPackageFile;
exports.loadPackageFile = loadPackageFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9wYWNrYWdlLXRvb2xzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLGVBQVQsR0FBOEM7QUFBQSxNQUFyQixHQUFxQix5REFBZixRQUFRLEdBQVIsRUFBZTs7QUFDNUMsTUFBTSxXQUFXLGVBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxjQUFmLENBQWpCO0FBQ0EsTUFBSSxhQUFHLFVBQUgsQ0FBYyxRQUFkLENBQUosRUFBNkI7QUFDM0IsV0FBTyxRQUFQO0FBQ0Q7O0FBRUQsTUFBTSxZQUFZLGVBQUssSUFBTCxDQUFVLEdBQVYsRUFBZSxJQUFmLENBQWxCO0FBQ0EsTUFBSSxRQUFRLFNBQVosRUFBdUI7QUFDckIsV0FBTyxTQUFQO0FBQ0Q7O0FBRUQsU0FBTyxnQkFBZ0IsU0FBaEIsQ0FBUDtBQUNEOztBQUVELFNBQVMsY0FBVCxHQUE2QztBQUFBLE1BQXJCLEdBQXFCLHlEQUFmLFFBQVEsR0FBUixFQUFlOztBQUMzQyxNQUFNLFdBQVcsZ0JBQWdCLEdBQWhCLENBQWpCO0FBQ0EsU0FBTyxXQUFXLGVBQUssT0FBTCxDQUFhLFFBQWIsQ0FBWCxHQUFvQyxTQUEzQztBQUNEOztBQUVELFNBQVMsZUFBVCxHQUE4QztBQUFBLE1BQXJCLEdBQXFCLHlEQUFmLFFBQVEsR0FBUixFQUFlOztBQUM1QyxNQUFNLFdBQVcsZ0JBQWdCLEdBQWhCLENBQWpCO0FBQ0EsU0FBTyxXQUFXLFFBQVEsUUFBUixDQUFYLEdBQStCLFNBQXRDO0FBQ0Q7Ozs7Ozs7Ozs7O1FBWUMsYyxHQUFBLGM7UUFDQSxlLEdBQUEsZTtRQUNBLGUsR0FBQSxlIiwiZmlsZSI6InBhY2thZ2UtdG9vbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIGZpbmRQYWNrYWdlRmlsZShkaXIgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gIGNvbnN0IGZpbGVuYW1lID0gcGF0aC5qb2luKGRpciwgJ3BhY2thZ2UuanNvbicpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhmaWxlbmFtZSkpIHtcbiAgICByZXR1cm4gZmlsZW5hbWU7XG4gIH1cblxuICBjb25zdCBwYXJlbnREaXIgPSBwYXRoLmpvaW4oZGlyLCAnLi4nKTtcbiAgaWYgKGRpciA9PT0gcGFyZW50RGlyKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiBmaW5kUGFja2FnZUZpbGUocGFyZW50RGlyKTtcbn1cblxuZnVuY3Rpb24gZmluZFBhY2thZ2VEaXIoZGlyID0gcHJvY2Vzcy5jd2QoKSkge1xuICBjb25zdCBmaWxlbmFtZSA9IGZpbmRQYWNrYWdlRmlsZShkaXIpO1xuICByZXR1cm4gZmlsZW5hbWUgPyBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpIDogdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBsb2FkUGFja2FnZUZpbGUoZGlyID0gcHJvY2Vzcy5jd2QoKSkge1xuICBjb25zdCBmaWxlbmFtZSA9IGZpbmRQYWNrYWdlRmlsZShkaXIpO1xuICByZXR1cm4gZmlsZW5hbWUgPyByZXF1aXJlKGZpbGVuYW1lKSA6IHVuZGVmaW5lZDtcbn1cblxuLy9cbi8vIHN0YXRpYyBnZXRBcHBDb250ZXh0RmlsZW5hbWVGcm9tUGFja2FnZShzaG91bGRUaHJvdyA9IHRydWUpIHtcbi8vICAgdHJ5IHtcbi8vICAgICByZXR1cm4gdGhpcy5maW5kQW5kTG9hZFBhY2thZ2UoKVsnYXBwLWNvbnRleHQnXTtcbi8vICAgfSBjYXRjaCAoZXJyKSB7XG4vLyAgICAgaWYgKHNob3VsZFRocm93KSB7IHRocm93IGVycjsgfVxuLy8gICB9XG4vLyB9XG5cbmV4cG9ydCB7XG4gIGZpbmRQYWNrYWdlRGlyLFxuICBmaW5kUGFja2FnZUZpbGUsXG4gIGxvYWRQYWNrYWdlRmlsZVxufTtcbiJdfQ==