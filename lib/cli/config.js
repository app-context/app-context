'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.execute = execute;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function orderObject(obj) {
  return Object.keys(obj).sort().reduce(function (o, k) {
    var v = obj[k];
    o[k] = (0, _lodashIsplainobject2['default'])(v) ? orderObject(v) : v;
    return o;
  }, {});
}

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
    console.log(['', JSON.stringify(orderObject(APP.config), null, 2), ''].join(_os2['default'].EOL));
  });
}