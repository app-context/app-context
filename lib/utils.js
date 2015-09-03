'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getValue = getValue;
exports.setValue = setValue;
exports.orderObject = orderObject;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

function getValue(obj, key) {
  var o = obj;
  var keys = Array.isArray(key) ? key : key.split('.');

  for (var x = 0; x < keys.length - 1; ++x) {
    var k = keys[x];
    if (o[k] == null) {
      return;
    }
    o = o[k];
  }

  return o[keys[keys.length - 1]];
}

function setValue(obj, key, value) {
  var o = obj;
  var keys = Array.isArray(key) ? key : key.split('.');

  for (var x = 0; x < keys.length - 1; ++x) {
    var k = keys[x];
    if (o[k] == null) {
      o[k] = {};
    }
    o = o[k];
  }

  o[keys[keys.length - 1]] = value;
}

function orderObject(obj) {
  return Object.keys(obj).sort().reduce(function (o, k) {
    var v = obj[k];
    o[k] = (0, _lodashIsplainobject2['default'])(v) ? orderObject(v) : v;
    return o;
  }, {});
}