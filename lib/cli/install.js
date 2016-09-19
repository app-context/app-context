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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5zdGFsbC5qcyJdLCJuYW1lcyI6WyJ1c2FnZSIsImV4ZWN1dGUiLCJlcnJvcnMiLCJkZXNjcmlwdGlvbiIsImdldEluaXRpYWxpemVyTW9kdWxlcyIsImNvbnRleHQiLCJjb25jYXQiLCJhcHBseSIsIk9iamVjdCIsInZhbHVlcyIsInJ1bmxldmVscyIsIm1hcCIsInIiLCJpbml0aWFsaXplcnMiLCJmaWx0ZXIiLCJpIiwidHlwZSIsIm1vZHVsZSIsImxvYWQiLCJpbml0aWFsaXplck1vZHVsZXMiLCJjb21tYW5kIiwiam9pbiIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicHJvYyIsImN3ZCIsInByb2Nlc3MiLCJzdGRpbyIsIm9uIiwiY29kZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUFNZ0JBLEssR0FBQUEsSztRQWdCQUMsTyxHQUFBQSxPOztBQXRCaEI7Ozs7QUFDQTs7QUFFQTs7SUFBWUMsTTs7QUFDWjs7Ozs7Ozs7QUFFTyxTQUFTRixLQUFULEdBQWlCO0FBQ3RCLFNBQU8sU0FBUDtBQUNEOztBQUVNLElBQU1HLG9DQUFjLG1DQUFwQjs7QUFFUCxTQUFTQyxxQkFBVCxDQUErQkMsT0FBL0IsRUFBd0M7QUFDdEMsU0FBTyxHQUFHQyxNQUFILENBQVVDLEtBQVYsQ0FBZ0IsRUFBaEIsRUFDTCxHQUFHRCxNQUFILENBQVVDLEtBQVYsQ0FBZ0IsRUFBaEIsRUFDRUMsT0FBT0MsTUFBUCxDQUFjSixRQUFRSyxTQUF0QixDQURGLEVBRUVDLEdBRkYsQ0FFTSxVQUFDQyxDQUFEO0FBQUEsV0FBT0EsRUFBRUMsWUFBVDtBQUFBLEdBRk4sQ0FESyxFQUtOQyxNQUxNLENBS0MsVUFBQ0MsQ0FBRDtBQUFBLFdBQU9BLEVBQUVDLElBQUYsS0FBVyxRQUFsQjtBQUFBLEdBTEQsRUFNTkwsR0FOTSxDQU1GLFVBQUNJLENBQUQ7QUFBQSxXQUFPQSxFQUFFRSxNQUFUO0FBQUEsR0FORSxDQUFQO0FBT0Q7O0FBRU0sU0FBU2hCLE9BQVQsR0FBbUI7QUFDeEIsTUFBTUksVUFBVSxXQUFXYSxJQUFYLEVBQWhCOztBQUVBLE1BQU1DLHFCQUFxQmYsc0JBQXNCQyxPQUF0QixDQUEzQjtBQUNBLE1BQU1lLCtDQUE2Q0QsbUJBQW1CRSxJQUFuQixDQUF3QixHQUF4QixDQUFuRDs7QUFFQSxTQUFPLElBQUlDLE9BQUosQ0FBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDdEMsUUFBTUMsT0FBTywwQkFBTSxJQUFOLEVBQVksQ0FBQyxJQUFELEVBQU9MLE9BQVAsQ0FBWixFQUE2QixFQUFFTSxLQUFLQyxRQUFRRCxHQUFSLEVBQVAsRUFBc0JFLE9BQU8sU0FBN0IsRUFBN0IsQ0FBYjtBQUNBSCxTQUFLSSxFQUFMLENBQVEsT0FBUixFQUFpQixVQUFDQyxJQUFELEVBQVU7QUFDekIsVUFBSUEsU0FBUyxDQUFiLEVBQWdCO0FBQUUsZUFBT04sT0FBTyxJQUFJTyxLQUFKLENBQWFYLE9BQWIsMEJBQXlDVSxJQUF6QyxDQUFQLENBQVA7QUFBa0U7QUFDcEZQO0FBQ0QsS0FIRDtBQUlELEdBTk0sQ0FBUDtBQU9EIiwiZmlsZSI6Imluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ2luc3RhbGwnO1xufVxuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5zdGFsbCBhbGwgaW5pdGlhbGl6ZXJzIGZyb20gTlBNJztcblxuZnVuY3Rpb24gZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpIHtcbiAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSxcbiAgICBbXS5jb25jYXQuYXBwbHkoW10sXG4gICAgICBPYmplY3QudmFsdWVzKGNvbnRleHQucnVubGV2ZWxzKVxuICAgICkubWFwKChyKSA9PiByLmluaXRpYWxpemVycylcbiAgKVxuICAuZmlsdGVyKChpKSA9PiBpLnR5cGUgPT09ICdtb2R1bGUnKVxuICAubWFwKChpKSA9PiBpLm1vZHVsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKCkge1xuICBjb25zdCBjb250ZXh0ID0gQXBwQ29udGV4dC5sb2FkKCk7XG5cbiAgY29uc3QgaW5pdGlhbGl6ZXJNb2R1bGVzID0gZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpO1xuICBjb25zdCBjb21tYW5kID0gYG5wbSBpbnN0YWxsIC0tc2F2ZSAtLXNhdmUtZXhhY3QgJHtpbml0aWFsaXplck1vZHVsZXMuam9pbignICcpfWA7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBwcm9jID0gc3Bhd24oJ3NoJywgWyctYycsIGNvbW1hbmRdLCB7IGN3ZDogcHJvY2Vzcy5jd2QoKSwgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICBwcm9jLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICBpZiAoY29kZSAhPT0gMCkgeyByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgJHtjb21tYW5kfSBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKSk7IH1cbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=