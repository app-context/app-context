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
  }
}

exports.description = description;
exports.execute = execute;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOztBQUVBOztJQUFZLE07Ozs7OztBQUVaLElBQU0sY0FBYywwQ0FBcEI7O0FBRUEsU0FBUyxLQUFULEdBQWlCO0FBQ2YsU0FBTyxnQkFBUDtBQUNEOztBQUVELElBQU0sMnBCQUFOOztBQW1CQSxJQUFNLFdBQVc7QUFDZixXQUFTLENBQUMsUUFBRCxFQUFXLFNBQVg7QUFETSxDQUFqQjs7QUFJQSxTQUFTLGtCQUFULEdBQThCO0FBQzVCLE1BQU0saUJBQWlCLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLGdCQUF6QixDQUF2Qjs7QUFFQSxNQUFJLGFBQUcsVUFBSCxDQUFjLGNBQWQsQ0FBSixFQUFtQztBQUNqQyxXQUFPLFFBQVEsR0FBUixDQUFZLG1CQUFPLHlDQUFQLENBQVosQ0FBUDtBQUNEOztBQUVELGVBQUcsYUFBSCxDQUFpQixjQUFqQixFQUFpQyxjQUFqQyxFQUFpRCxNQUFqRDtBQUNBLFVBQVEsR0FBUixDQUFZLGtCQUFNLHdCQUFOLENBQVo7QUFDRDs7QUFFRCxTQUFTLGFBQVQsR0FBeUI7QUFDdkIsTUFBTSxjQUFjLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLFVBQXpCLENBQXBCOztBQUVBLE1BQUksYUFBRyxVQUFILENBQWMsV0FBZCxDQUFKLEVBQWdDO0FBQzlCLFdBQU8sUUFBUSxHQUFSLENBQVksbUJBQU8sbUNBQVAsQ0FBWixDQUFQO0FBQ0Q7O0FBRUQsZUFBRyxhQUFILENBQWlCLFdBQWpCLEVBQThCLEtBQUssU0FBTCxDQUFlLFFBQWYsRUFBeUIsSUFBekIsRUFBK0IsQ0FBL0IsQ0FBOUIsRUFBaUUsTUFBakU7QUFDQSxVQUFRLEdBQVIsQ0FBWSxrQkFBTSxrQkFBTixDQUFaO0FBQ0Q7O0FBRUQsU0FBUyxPQUFULENBQWlCLElBQWpCLFFBQTBDO0FBQUEsd0JBQWpCLEtBQWlCO0FBQUEsTUFBakIsS0FBaUIsOEJBQVQsS0FBUzs7QUFDeEMsTUFBSSxDQUFDLGFBQUcsVUFBSCxDQUFjLGVBQUssSUFBTCxDQUFVLFFBQVEsR0FBUixFQUFWLEVBQXlCLGNBQXpCLENBQWQsQ0FBTCxFQUE4RDtBQUM1RCxVQUFNLE9BQU8sT0FBUCwrREFBMkUsaUJBQUssVUFBTCxDQUEzRSx3Q0FBTjtBQUNEOztBQUVEO0FBQ0EsTUFBSSxLQUFKLEVBQVc7QUFDVDtBQUNEO0FBQ0Y7O1FBR0MsVyxHQUFBLFc7UUFDQSxPLEdBQUEsTyIsImZpbGUiOiJpbml0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgY3lhbiwgZ3JlZW4sIHllbGxvdyB9IGZyb20gJ2NoYWxrJztcblxuaW1wb3J0ICogYXMgZXJyb3JzIGZyb20gJy4uL2Vycm9ycyc7XG5cbmNvbnN0IGRlc2NyaXB0aW9uID0gJ0luaXRpYWxpemUgYXBwLWNvbnRleHQgaW4gdGhpcyBkaXJlY3RvcnknO1xuXG5mdW5jdGlvbiB1c2FnZSgpIHtcbiAgcmV0dXJuICdpbml0IFstLWJhYmVsXSc7XG59XG5cbmNvbnN0IEFQUF9DT05URVhUX0pTID1cbmBleHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgLyogVGhpcyBsZXZlbCBpcyB1c2VkIHRvIGRvIGFueXRoaW5nIG5lZWRlZCBiZWZvcmUgdGhlIGNvbmZpZyBpcyBsb2FkZWQgKi9cbiAgLy8gdGhpcy5ydW5sZXZlbCgnc2V0dXAnKS51c2UoLi4uKTtcblxuICAvKiBUaGlzIGxldmVsIGlzIHVzZWQgZm9yIHJlYWRpbmcgY29uZmlndXJhdGlvbiAtIGFzc2lnbiBpdCB0byBBUFAuY29uZmlnICovXG4gIC8vIHRoaXMucnVubGV2ZWwoJ2NvbmZpZ3VyZWQnKS51c2UoLi4uKTtcblxuICAvKiBUaGlzIGxldmVsIGlzIHVzZWQgZm9yIGNvbm5lY3RpbmcgdG8gZGF0YWJhc2VzIGFuZCBzdWNoICovXG4gIC8vIHRoaXMucnVubGV2ZWwoJ2Nvbm5lY3RlZCcpLnVzZSguLi4pO1xuXG4gIC8qIFRoaXMgbGV2ZWwgaXMgdXNlZCBmb3IgaW5pdGlhbGl6aW5nIHN0cnVjdHVyZXMgaW4geW91ciBhcHBsaWNhdGlvbiAqL1xuICAvLyB0aGlzLnJ1bmxldmVsKCdpbml0aWFsaXplZCcpLnVzZSguLi4pO1xuXG4gIC8qIFRoaXMgbGV2ZWwgaXMgdXNlZCBieSBhcHAtY29udGV4dCB0byBleGVjdXRlIHRoZSBcImFwcC1jb250ZXh0IHN0YXJ0XCIgY29tbWFuZCAqL1xuICAvLyB0aGlzLnJ1bmxldmVsKCdydW5uaW5nJykudXNlKC4uLik7XG59O1xuYDtcblxuY29uc3QgQkFCRUxfUkMgPSB7XG4gIHByZXNldHM6IFsnZXMyMDE1JywgJ3N0YWdlLTAnXVxufTtcblxuZnVuY3Rpb24gY3JlYXRlQXBwQ29udGV4dEpzKCkge1xuICBjb25zdCBhcHBDb250ZXh0UGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnYXBwLWNvbnRleHQuanMnKTtcblxuICBpZiAoZnMuZXhpc3RzU3luYyhhcHBDb250ZXh0UGF0aCkpIHtcbiAgICByZXR1cm4gY29uc29sZS5sb2coeWVsbG93KCdhcHAtY29udGV4dC5qcyBhbHJlYWR5IGV4aXN0cywgc2tpcHBpbmcnKSk7XG4gIH1cblxuICBmcy53cml0ZUZpbGVTeW5jKGFwcENvbnRleHRQYXRoLCBBUFBfQ09OVEVYVF9KUywgJ3V0ZjgnKTtcbiAgY29uc29sZS5sb2coZ3JlZW4oJ0NyZWF0ZWQgYXBwLWNvbnRleHQuanMnKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhYmVscmMoKSB7XG4gIGNvbnN0IGJhYmVscmNQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICcuYmFiZWxyYycpO1xuXG4gIGlmIChmcy5leGlzdHNTeW5jKGJhYmVscmNQYXRoKSkge1xuICAgIHJldHVybiBjb25zb2xlLmxvZyh5ZWxsb3coJy5iYWJlbHJjIGFscmVhZHkgZXhpc3RzLCBza2lwcGluZycpKTtcbiAgfVxuXG4gIGZzLndyaXRlRmlsZVN5bmMoYmFiZWxyY1BhdGgsIEpTT04uc3RyaW5naWZ5KEJBQkVMX1JDLCBudWxsLCAyKSwgJ3V0ZjgnKTtcbiAgY29uc29sZS5sb2coZ3JlZW4oJ0NyZWF0ZWQgLmJhYmVscmMnKSk7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGUoYXJncywgeyBiYWJlbCA9IGZhbHNlIH0pIHtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncGFja2FnZS5qc29uJykpKSB7XG4gICAgdGhyb3cgZXJyb3JzLm1lc3NhZ2UoYEEgcGFja2FnZS5qc29uIGZpbGUgbXVzdCBhbHJlYWR5IGV4aXN0XFxuICAgICAgIEZpcnN0IHJ1biAke2N5YW4oJ25wbSBpbml0Jyl9IHRvIGNyZWF0ZSBhIG5ldyBwYWNrYWdlLmpzb24gZmlsZWApO1xuICB9XG5cbiAgY3JlYXRlQXBwQ29udGV4dEpzKCk7XG4gIGlmIChiYWJlbCkge1xuICAgIGNyZWF0ZUJhYmVscmMoKTtcbiAgfVxufVxuXG5leHBvcnQge1xuICBkZXNjcmlwdGlvbixcbiAgZXhlY3V0ZVxufTtcbiJdfQ==