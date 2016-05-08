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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5zdGFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7UUFNZ0IsSyxHQUFBLEs7UUFnQkEsTyxHQUFBLE87O0FBdEJoQjs7OztBQUNBOztBQUVBOztJQUFZLE07O0FBQ1o7Ozs7Ozs7O0FBRU8sU0FBUyxLQUFULEdBQWlCO0FBQ3RCLFNBQU8sU0FBUDtBQUNEOztBQUVNLElBQU0sb0NBQWMsbUNBQXBCOztBQUVQLFNBQVMscUJBQVQsQ0FBK0IsT0FBL0IsRUFBd0M7QUFDdEMsU0FBTyxHQUFHLE1BQUgsQ0FBVSxLQUFWLENBQWdCLEVBQWhCLEVBQ0wsR0FBRyxNQUFILENBQVUsS0FBVixDQUFnQixFQUFoQixFQUNFLE9BQU8sTUFBUCxDQUFjLFFBQVEsU0FBdEIsQ0FERixFQUVFLEdBRkYsQ0FFTSxVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsWUFBVDtBQUFBLEdBRk4sQ0FESyxFQUtOLE1BTE0sQ0FLQyxVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsSUFBRixLQUFXLFFBQWxCO0FBQUEsR0FMRCxFQU1OLEdBTk0sQ0FNRixVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsTUFBVDtBQUFBLEdBTkUsQ0FBUDtBQU9EOztBQUVNLFNBQVMsT0FBVCxHQUFtQjtBQUN4QixNQUFNLFVBQVUsV0FBVyxJQUFYLEVBQWhCOztBQUVBLE1BQU0scUJBQXFCLHNCQUFzQixPQUF0QixDQUEzQjtBQUNBLE1BQU0sK0NBQTZDLG1CQUFtQixJQUFuQixDQUF3QixHQUF4QixDQUFuRDs7QUFFQSxTQUFPLElBQUksT0FBSixDQUFZLFVBQUMsT0FBRCxFQUFVLE1BQVYsRUFBcUI7QUFDdEMsUUFBTSxPQUFPLDBCQUFNLElBQU4sRUFBWSxDQUFDLElBQUQsRUFBTyxPQUFQLENBQVosRUFBNkIsRUFBRSxLQUFLLFFBQVEsR0FBUixFQUFQLEVBQXNCLE9BQU8sU0FBN0IsRUFBN0IsQ0FBYjtBQUNBLFNBQUssRUFBTCxDQUFRLE9BQVIsRUFBaUIsVUFBQyxJQUFELEVBQVU7QUFDekIsVUFBSSxTQUFTLENBQWIsRUFBZ0I7QUFBRSxlQUFPLE9BQU8sSUFBSSxLQUFKLENBQWEsT0FBYiwwQkFBeUMsSUFBekMsQ0FBUCxDQUFQO0FBQWtFO0FBQ3BGO0FBQ0QsS0FIRDtBQUlELEdBTk0sQ0FBUDtBQU9EIiwiZmlsZSI6Imluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ2luc3RhbGwnO1xufVxuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5zdGFsbCBhbGwgaW5pdGlhbGl6ZXJzIGZyb20gTlBNJztcblxuZnVuY3Rpb24gZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpIHtcbiAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSxcbiAgICBbXS5jb25jYXQuYXBwbHkoW10sXG4gICAgICBPYmplY3QudmFsdWVzKGNvbnRleHQucnVubGV2ZWxzKVxuICAgICkubWFwKChyKSA9PiByLmluaXRpYWxpemVycylcbiAgKVxuICAuZmlsdGVyKChpKSA9PiBpLnR5cGUgPT09ICdtb2R1bGUnKVxuICAubWFwKChpKSA9PiBpLm1vZHVsZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleGVjdXRlKCkge1xuICBjb25zdCBjb250ZXh0ID0gQXBwQ29udGV4dC5sb2FkKCk7XG5cbiAgY29uc3QgaW5pdGlhbGl6ZXJNb2R1bGVzID0gZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpO1xuICBjb25zdCBjb21tYW5kID0gYG5wbSBpbnN0YWxsIC0tc2F2ZSAtLXNhdmUtZXhhY3QgJHtpbml0aWFsaXplck1vZHVsZXMuam9pbignICcpfWA7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBwcm9jID0gc3Bhd24oJ3NoJywgWyctYycsIGNvbW1hbmRdLCB7IGN3ZDogcHJvY2Vzcy5jd2QoKSwgc3RkaW86ICdpbmhlcml0JyB9KTtcbiAgICBwcm9jLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICBpZiAoY29kZSAhPT0gMCkgeyByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgJHtjb21tYW5kfSBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKSk7IH1cbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=