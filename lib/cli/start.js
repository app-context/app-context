'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execute = execute;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var description = 'Initialize and start your project';

exports.description = description;

function execute() {
  return _2['default'].load().transitionTo(10).then(function () {
    return new _bluebird2['default'](function (resolve, reject) {
      process.on('SIGINT', function () {
        resolve();
      });
    });
  });
}