'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = exports.description = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _babelTools = require('../babel-tools');

var _errors = require('../errors');

var errors = _interopRequireWildcard(_errors);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = 'Initialize app-context in this directory';

function usage() {
  return 'init [--babel]';
}

var APP_CONTEXT_JS = 'export default function() {\n  /* This level is used to do anything needed before the config is loaded */\n  // this.runlevel(\'setup\').use(...);\n\n  /* This level is used for reading configuration - assign it to APP.config */\n  // this.runlevel(\'configured\').use(...);\n\n  /* This level is used for connecting to databases and such */\n  // this.runlevel(\'connected\').use(...);\n\n  /* This level is used for initializing structures in your application */\n  // this.runlevel(\'initialized\').use(...);\n\n  /* This level is used by app-context to execute the "app-context start" command */\n  // this.runlevel(\'running\').use(...);\n};\n';

var BABEL_RC = {
  presets: ['es2015', 'stage-0']
};

function createAppContextJs() {
  var appContextPath = _path2.default.join(process.cwd(), 'app-context.js');

  if (_fs2.default.existsSync(appContextPath)) {
    return console.log((0, _chalk.yellow)('app-context.js already exists, skipping'));
  }

  _fs2.default.writeFileSync(appContextPath, APP_CONTEXT_JS, 'utf8');
  console.log((0, _chalk.green)('Created app-context.js'));
}

function createBabelrc() {
  var babelrcPath = _path2.default.join(process.cwd(), '.babelrc');

  if (_fs2.default.existsSync(babelrcPath)) {
    return console.log((0, _chalk.yellow)('.babelrc already exists, skipping'));
  }

  _fs2.default.writeFileSync(babelrcPath, JSON.stringify(BABEL_RC, null, 2), 'utf8');
  console.log((0, _chalk.green)('Created .babelrc'));
}

function execute(args, _ref) {
  var _ref$babel = _ref.babel;
  var babel = _ref$babel === undefined ? false : _ref$babel;

  if (!_fs2.default.existsSync(_path2.default.join(process.cwd(), 'package.json'))) {
    throw errors.message('A package.json file must already exist\n       First run ' + (0, _chalk.cyan)('npm init') + ' to create a new package.json file');
  }

  createAppContextJs();
  if (babel) {
    createBabelrc();
    (0, _babelTools.installBabel)();
  }
}

exports.description = description;
exports.execute = execute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUVBOztBQUNBOztJQUFZLE07Ozs7OztBQUVaLElBQU0sY0FBYywwQ0FBcEI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2YsU0FBTyxnQkFBUDtBQUNEOztBQUVELElBQU0sMnBCQUFOOztBQW1CQSxJQUFNLFdBQVc7QUFDZixXQUFTLENBQUMsUUFBRCxFQUFXLFNBQVg7QUFETSxDQUFqQjs7QUFJQSxTQUFTLGtCQUFULEdBQThCO0FBQzVCLE1BQU0saUJBQWlCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLGdCQUF6QixDQUF2Qjs7QUFFQSxNQUFJLGFBQUcsVUFBSCxDQUFjLGNBQWQsQ0FBSixFQUFtQztBQUNqQyxXQUFPLFFBQVEsR0FBUixDQUFZLG1CQUFPLHlDQUFQLENBQVosQ0FBUDtBQUNEOztBQUVELGVBQUcsYUFBSCxDQUFpQixjQUFqQixFQUFpQyxjQUFqQyxFQUFpRCxNQUFqRDtBQUNBLFVBQVEsR0FBUixDQUFZLGtCQUFNLHdCQUFOLENBQVo7QUFDRDs7QUFFRCxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsTUFBTSxjQUFjLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLFVBQXpCLENBQXBCOztBQUVBLE1BQUksYUFBRyxVQUFILENBQWMsV0FBZCxDQUFKLEVBQWdDO0FBQzlCLFdBQU8sUUFBUSxHQUFSLENBQVksbUJBQU8sbUNBQVAsQ0FBWixDQUFQO0FBQ0Q7O0FBRUQsZUFBRyxhQUFILENBQWlCLFdBQWpCLEVBQThCLEtBQUssU0FBTCxDQUFlLFFBQWYsRUFBeUIsSUFBekIsRUFBK0IsQ0FBL0IsQ0FBOUIsRUFBaUUsTUFBakU7QUFDQSxVQUFRLEdBQVIsQ0FBWSxrQkFBTSxrQkFBTixDQUFaO0FBQ0Q7O0FBRUQsU0FBUyxPQUFULENBQWlCLElBQWpCLFFBQTBDO0FBQUEsd0JBQWpCLEtBQWlCO0FBQUEsTUFBakIsS0FBaUIsOEJBQVQsS0FBUzs7QUFDeEMsTUFBSSxDQUFDLGFBQUcsVUFBSCxDQUFjLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLGNBQXpCLENBQWQsQ0FBTCxFQUE4RDtBQUM1RCxVQUFNLE9BQU8sT0FBUCwrREFBMkUsaUJBQUssVUFBTCxDQUEzRSx3Q0FBTjtBQUNEOztBQUVEO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVDtBQUNBO0FBQ0Q7QUFDRjs7UUFHQyxXLEdBQUEsVztRQUNBLE8sR0FBQSxPIiwiZmlsZSI6ImluaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjeWFuLCBncmVlbiwgeWVsbG93IH0gZnJvbSAnY2hhbGsnO1xuXG5pbXBvcnQgeyBpbnN0YWxsQmFiZWwgfSBmcm9tICcuLi9iYWJlbC10b29scyc7XG5pbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi4vZXJyb3JzJztcblxuY29uc3QgZGVzY3JpcHRpb24gPSAnSW5pdGlhbGl6ZSBhcHAtY29udGV4dCBpbiB0aGlzIGRpcmVjdG9yeSc7XG5cbmZ1bmN0aW9uIHVzYWdlKCkge1xuICByZXR1cm4gJ2luaXQgWy0tYmFiZWxdJztcbn1cblxuY29uc3QgQVBQX0NPTlRFWFRfSlMgPVxuYGV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICAvKiBUaGlzIGxldmVsIGlzIHVzZWQgdG8gZG8gYW55dGhpbmcgbmVlZGVkIGJlZm9yZSB0aGUgY29uZmlnIGlzIGxvYWRlZCAqL1xuICAvLyB0aGlzLnJ1bmxldmVsKCdzZXR1cCcpLnVzZSguLi4pO1xuXG4gIC8qIFRoaXMgbGV2ZWwgaXMgdXNlZCBmb3IgcmVhZGluZyBjb25maWd1cmF0aW9uIC0gYXNzaWduIGl0IHRvIEFQUC5jb25maWcgKi9cbiAgLy8gdGhpcy5ydW5sZXZlbCgnY29uZmlndXJlZCcpLnVzZSguLi4pO1xuXG4gIC8qIFRoaXMgbGV2ZWwgaXMgdXNlZCBmb3IgY29ubmVjdGluZyB0byBkYXRhYmFzZXMgYW5kIHN1Y2ggKi9cbiAgLy8gdGhpcy5ydW5sZXZlbCgnY29ubmVjdGVkJykudXNlKC4uLik7XG5cbiAgLyogVGhpcyBsZXZlbCBpcyB1c2VkIGZvciBpbml0aWFsaXppbmcgc3RydWN0dXJlcyBpbiB5b3VyIGFwcGxpY2F0aW9uICovXG4gIC8vIHRoaXMucnVubGV2ZWwoJ2luaXRpYWxpemVkJykudXNlKC4uLik7XG5cbiAgLyogVGhpcyBsZXZlbCBpcyB1c2VkIGJ5IGFwcC1jb250ZXh0IHRvIGV4ZWN1dGUgdGhlIFwiYXBwLWNvbnRleHQgc3RhcnRcIiBjb21tYW5kICovXG4gIC8vIHRoaXMucnVubGV2ZWwoJ3J1bm5pbmcnKS51c2UoLi4uKTtcbn07XG5gO1xuXG5jb25zdCBCQUJFTF9SQyA9IHtcbiAgcHJlc2V0czogWydlczIwMTUnLCAnc3RhZ2UtMCddXG59O1xuXG5mdW5jdGlvbiBjcmVhdGVBcHBDb250ZXh0SnMoKSB7XG4gIGNvbnN0IGFwcENvbnRleHRQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdhcHAtY29udGV4dC5qcycpO1xuXG4gIGlmIChmcy5leGlzdHNTeW5jKGFwcENvbnRleHRQYXRoKSkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyh5ZWxsb3coJ2FwcC1jb250ZXh0LmpzIGFscmVhZHkgZXhpc3RzLCBza2lwcGluZycpKTtcbiAgfVxuXG4gIGZzLndyaXRlRmlsZVN5bmMoYXBwQ29udGV4dFBhdGgsIEFQUF9DT05URVhUX0pTLCAndXRmOCcpO1xuICBjb25zb2xlLmxvZyhncmVlbignQ3JlYXRlZCBhcHAtY29udGV4dC5qcycpKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlQmFiZWxyYygpIHtcbiAgY29uc3QgYmFiZWxyY1BhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy5iYWJlbHJjJyk7XG5cbiAgaWYgKGZzLmV4aXN0c1N5bmMoYmFiZWxyY1BhdGgpKSB7XG4gICAgcmV0dXJuIGNvbnNvbGUubG9nKHllbGxvdygnLmJhYmVscmMgYWxyZWFkeSBleGlzdHMsIHNraXBwaW5nJykpO1xuICB9XG5cbiAgZnMud3JpdGVGaWxlU3luYyhiYWJlbHJjUGF0aCwgSlNPTi5zdHJpbmdpZnkoQkFCRUxfUkMsIG51bGwsIDIpLCAndXRmOCcpO1xuICBjb25zb2xlLmxvZyhncmVlbignQ3JlYXRlZCAuYmFiZWxyYycpKTtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZShhcmdzLCB7IGJhYmVsID0gZmFsc2UgfSkge1xuICBpZiAoIWZzLmV4aXN0c1N5bmMocGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdwYWNrYWdlLmpzb24nKSkpIHtcbiAgICB0aHJvdyBlcnJvcnMubWVzc2FnZShgQSBwYWNrYWdlLmpzb24gZmlsZSBtdXN0IGFscmVhZHkgZXhpc3RcXG4gICAgICAgRmlyc3QgcnVuICR7Y3lhbignbnBtIGluaXQnKX0gdG8gY3JlYXRlIGEgbmV3IHBhY2thZ2UuanNvbiBmaWxlYCk7XG4gIH1cblxuICBjcmVhdGVBcHBDb250ZXh0SnMoKTtcbiAgaWYgKGJhYmVsKSB7XG4gICAgY3JlYXRlQmFiZWxyYygpO1xuICAgIGluc3RhbGxCYWJlbCgpO1xuICB9XG59XG5cbmV4cG9ydCB7XG4gIGRlc2NyaXB0aW9uLFxuICBleGVjdXRlXG59O1xuIl19