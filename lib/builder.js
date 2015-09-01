'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var _runLevel = require('./run-level');

var _runLevel2 = _interopRequireDefault(_runLevel);

var _appContext = require('./app-context');

var _appContext2 = _interopRequireDefault(_appContext);

var Builder = (function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.runlevels = {};
    this.properties = {};
  }

  _createClass(Builder, [{
    key: 'runlevel',
    value: function runlevel(level) {
      level = _appContext2['default'].resolveRunLevel(level);
      return this.runlevels[level] || (this.runlevels[level] = new _runLevel2['default'](this, level));
    }
  }, {
    key: 'set',
    value: function set() {
      var _this = this;

      var opts = undefined;
      if (arguments.length === 1 && (0, _lodashIsplainobject2['default'])(arguments[0])) {
        opts = arguments[0];
      } else if (arguments.length === 2 && typeof arguments[0] === 'string') {
        opts = _defineProperty({}, arguments[0], arguments[1]);
      }

      Object.keys(opts).forEach(function (k) {
        var v = opts[k];
        _this.properties[k] = v;
      });
    }
  }, {
    key: 'get',
    value: function get(key) {
      return this.properties[key] || Builder.defaults[key];
    }
  }]);

  return Builder;
})();

exports['default'] = Builder;

Builder.defaults = {
  timeout: 10000
};
module.exports = exports['default'];