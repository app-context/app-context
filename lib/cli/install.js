'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = exports.description = undefined;

var execute = exports.execute = function () {
  var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
    var context;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(0, _babelTools.hasBabel)()) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return (0, _babelTools.installBabel)();

          case 3:
            context = _2.default.load();
            return _context.abrupt('return', (0, _moduleTools.installNpmModules)(getInitializerModules(context)));

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function execute() {
    return ref.apply(this, arguments);
  };
}();

exports.usage = usage;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _babelTools = require('../babel-tools');

var _moduleTools = require('../module-tools');

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
// import * as errors from '../errors';


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5zdGFsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzREF1Qk87QUFBQSxRQUtDLE9BTEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUNELDJCQURDO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsbUJBRUcsK0JBRkg7O0FBQUE7QUFLQyxtQkFMRCxHQUtXLFdBQVcsSUFBWCxFQUxYO0FBQUEsNkNBTUUsb0NBQWtCLHNCQUFzQixPQUF0QixDQUFsQixDQU5GOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEc7O2tCQUFlLE87Ozs7O1FBaEJOLEssR0FBQSxLOztBQVBoQjs7OztBQUVBOztBQUNBOztBQUVBOzs7Ozs7Ozs7O0FBRU8sU0FBUyxLQUFULEdBQWlCO0FBQ3RCLFNBQU8sU0FBUDtBQUNEOztBQUVNLElBQU0sb0NBQWMsbUNBQXBCOztBQUVQLFNBQVMscUJBQVQsQ0FBK0IsT0FBL0IsRUFBd0M7QUFDdEMsU0FBTyxHQUFHLE1BQUgsQ0FBVSxLQUFWLENBQWdCLEVBQWhCLEVBQ0wsR0FBRyxNQUFILENBQVUsS0FBVixDQUFnQixFQUFoQixFQUNFLE9BQU8sTUFBUCxDQUFjLFFBQVEsU0FBdEIsQ0FERixFQUVFLEdBRkYsQ0FFTSxVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsWUFBVDtBQUFBLEdBRk4sQ0FESyxFQUtOLE1BTE0sQ0FLQyxVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsSUFBRixLQUFXLFFBQWxCO0FBQUEsR0FMRCxFQU1OLEdBTk0sQ0FNRixVQUFDLENBQUQ7QUFBQSxXQUFPLEVBQUUsTUFBVDtBQUFBLEdBTkUsQ0FBUDtBQU9EIiwiZmlsZSI6Imluc3RhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHsgaGFzQmFiZWwsIGluc3RhbGxCYWJlbCB9IGZyb20gJy4uL2JhYmVsLXRvb2xzJztcbmltcG9ydCB7IGluc3RhbGxOcG1Nb2R1bGVzIH0gZnJvbSAnLi4vbW9kdWxlLXRvb2xzJztcbi8vIGltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi4vLi4vJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ2luc3RhbGwnO1xufVxuXG5leHBvcnQgY29uc3QgZGVzY3JpcHRpb24gPSAnSW5zdGFsbCBhbGwgaW5pdGlhbGl6ZXJzIGZyb20gTlBNJztcblxuZnVuY3Rpb24gZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpIHtcbiAgcmV0dXJuIFtdLmNvbmNhdC5hcHBseShbXSxcbiAgICBbXS5jb25jYXQuYXBwbHkoW10sXG4gICAgICBPYmplY3QudmFsdWVzKGNvbnRleHQucnVubGV2ZWxzKVxuICAgICkubWFwKChyKSA9PiByLmluaXRpYWxpemVycylcbiAgKVxuICAuZmlsdGVyKChpKSA9PiBpLnR5cGUgPT09ICdtb2R1bGUnKVxuICAubWFwKChpKSA9PiBpLm1vZHVsZSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleGVjdXRlKCkge1xuICBpZiAoaGFzQmFiZWwoKSkge1xuICAgIGF3YWl0IGluc3RhbGxCYWJlbCgpO1xuICB9XG5cbiAgY29uc3QgY29udGV4dCA9IEFwcENvbnRleHQubG9hZCgpO1xuICByZXR1cm4gaW5zdGFsbE5wbU1vZHVsZXMoZ2V0SW5pdGlhbGl6ZXJNb2R1bGVzKGNvbnRleHQpKTtcbn1cbiJdfQ==