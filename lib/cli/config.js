'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execute = execute;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var _utils = require('../utils');

var description = 'Print configuration';

exports.description = description;

function execute(args, opts) {
  var context = undefined;

  if (opts.g || opts.global) {
    context = _2['default'].loadGlobal();
  } else {
    context = _2['default'].load();
  }

  return context.transitionTo('configured').then(function () {
    console.log(['', (0, _jsonStringifySafe2['default'])((0, _utils.orderObject)(APP.config), null, 2), ''].join(_os2['default'].EOL));
  });
}