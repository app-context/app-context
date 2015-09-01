'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execute = execute;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ = require('../../../');

var _2 = _interopRequireDefault(_);

var _console = require('./console');

var Console = _interopRequireWildcard(_console);

var description = 'Initialize and open a REPL';

exports.description = description;

function execute() {
  return _2['default'].load().transitionTo(_2['default'].RunLevel.Initialized).then(function () {
    return Console.start({
      name: APP.name || 'app-context',
      version: APP.version ? [APP.version.major, APP.version.minor, APP.version.patch].join('.') : '0.0.0',
      environment: APP.environment
    });
  });
}