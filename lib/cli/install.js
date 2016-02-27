'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.usage = usage;
exports.execute = execute;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _errors = require('../errors');

var errors = _interopRequireWildcard(_errors);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function usage() {
  return 'install';
}

var description = exports.description = 'Install all initializers from NPM';

function getInitializerModules(context) {
  return [].concat.apply([], [].concat.apply([], Object.values(context.runlevels)).map(function (r) {
    return r.initializers;
  })).filter(function (i) {
    return i.type === 'module';
  }).map(function (i) {
    return i.module;
  });
}

function execute() {
  var context = _2.default.load();

  var initializerModules = getInitializerModules(context);
  var command = 'npm install --save --save-exact ' + initializerModules.join(' ');

  return new Promise(function (resolve, reject) {
    var proc = (0, _child_process.spawn)('sh', ['-c', command], { cwd: process.cwd(), stdio: 'inherit' });
    proc.on('close', function (code) {
      if (code !== 0) {
        return reject(new Error(command + ' exited with code ' + code));
      }
      resolve();
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5zdGFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFNZ0I7UUFnQkE7Ozs7Ozs7Ozs7SUFuQko7Ozs7Ozs7Ozs7QUFHTCxTQUFTLEtBQVQsR0FBaUI7QUFDdEIsU0FBTyxTQUFQLENBRHNCO0NBQWpCOztBQUlBLElBQU0sb0NBQWMsbUNBQWQ7O0FBRWIsU0FBUyxxQkFBVCxDQUErQixPQUEvQixFQUF3QztBQUN0QyxTQUFPLEdBQUcsTUFBSCxDQUFVLEtBQVYsQ0FBZ0IsRUFBaEIsRUFDTCxHQUFHLE1BQUgsQ0FBVSxLQUFWLENBQWdCLEVBQWhCLEVBQ0UsT0FBTyxNQUFQLENBQWMsUUFBUSxTQUFSLENBRGhCLEVBRUUsR0FGRixDQUVNLFVBQUMsQ0FBRDtXQUFPLEVBQUUsWUFBRjtHQUFQLENBSEQsRUFLTixNQUxNLENBS0MsVUFBQyxDQUFEO1dBQU8sRUFBRSxJQUFGLEtBQVcsUUFBWDtHQUFQLENBTEQsQ0FNTixHQU5NLENBTUYsVUFBQyxDQUFEO1dBQU8sRUFBRSxNQUFGO0dBQVAsQ0FOTCxDQURzQztDQUF4Qzs7QUFVTyxTQUFTLE9BQVQsR0FBbUI7QUFDeEIsTUFBTSxVQUFVLFdBQVcsSUFBWCxFQUFWLENBRGtCOztBQUd4QixNQUFNLHFCQUFxQixzQkFBc0IsT0FBdEIsQ0FBckIsQ0FIa0I7QUFJeEIsTUFBTSwrQ0FBNkMsbUJBQW1CLElBQW5CLENBQXdCLEdBQXhCLENBQTdDLENBSmtCOztBQU14QixTQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEMsUUFBTSxPQUFPLDBCQUFNLElBQU4sRUFBWSxDQUFDLElBQUQsRUFBTyxPQUFQLENBQVosRUFBNkIsRUFBRSxLQUFLLFFBQVEsR0FBUixFQUFMLEVBQW9CLE9BQU8sU0FBUCxFQUFuRCxDQUFQLENBRGdDO0FBRXRDLFNBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxJQUFELEVBQVU7QUFDekIsVUFBSSxTQUFTLENBQVQsRUFBWTtBQUFFLGVBQU8sT0FBTyxJQUFJLEtBQUosQ0FBYSxpQ0FBNEIsSUFBekMsQ0FBUCxDQUFQLENBQUY7T0FBaEI7QUFDQSxnQkFGeUI7S0FBVixDQUFqQixDQUZzQztHQUFyQixDQUFuQixDQU53QjtDQUFuQiIsImZpbGUiOiJpbnN0YWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBzcGF3biB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuXG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi4vZXJyb3JzJztcbmltcG9ydCBBcHBDb250ZXh0IGZyb20gJy4uLy4uLyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2FnZSgpIHtcbiAgcmV0dXJuICdpbnN0YWxsJztcbn1cblxuZXhwb3J0IGNvbnN0IGRlc2NyaXB0aW9uID0gJ0luc3RhbGwgYWxsIGluaXRpYWxpemVycyBmcm9tIE5QTSc7XG5cbmZ1bmN0aW9uIGdldEluaXRpYWxpemVyTW9kdWxlcyhjb250ZXh0KSB7XG4gIHJldHVybiBbXS5jb25jYXQuYXBwbHkoW10sXG4gICAgW10uY29uY2F0LmFwcGx5KFtdLFxuICAgICAgT2JqZWN0LnZhbHVlcyhjb250ZXh0LnJ1bmxldmVscylcbiAgICApLm1hcCgocikgPT4gci5pbml0aWFsaXplcnMpXG4gIClcbiAgLmZpbHRlcigoaSkgPT4gaS50eXBlID09PSAnbW9kdWxlJylcbiAgLm1hcCgoaSkgPT4gaS5tb2R1bGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXhlY3V0ZSgpIHtcbiAgY29uc3QgY29udGV4dCA9IEFwcENvbnRleHQubG9hZCgpO1xuXG4gIGNvbnN0IGluaXRpYWxpemVyTW9kdWxlcyA9IGdldEluaXRpYWxpemVyTW9kdWxlcyhjb250ZXh0KTtcbiAgY29uc3QgY29tbWFuZCA9IGBucG0gaW5zdGFsbCAtLXNhdmUgLS1zYXZlLWV4YWN0ICR7aW5pdGlhbGl6ZXJNb2R1bGVzLmpvaW4oJyAnKX1gO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgcHJvYyA9IHNwYXduKCdzaCcsIFsnLWMnLCBjb21tYW5kXSwgeyBjd2Q6IHByb2Nlc3MuY3dkKCksIHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgcHJvYy5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgICAgaWYgKGNvZGUgIT09IDApIHsgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoYCR7Y29tbWFuZH0gZXhpdGVkIHdpdGggY29kZSAke2NvZGV9YCkpOyB9XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH0pO1xufVxuIl19