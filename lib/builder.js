'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _runLevel = require('./run-level');

var _runLevel2 = _interopRequireDefault(_runLevel);

var _appContext = require('./app-context');

var _appContext2 = _interopRequireDefault(_appContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Builder = function () {
  function Builder() {
    _classCallCheck(this, Builder);

    this.runlevels = {};
    this.properties = {};
  }

  _createClass(Builder, [{
    key: 'runlevel',
    value: function runlevel(level) {
      level = _appContext2.default.resolveRunLevel(level);
      return this.runlevels[level] || (this.runlevels[level] = new _runLevel2.default(this, level));
    }
  }, {
    key: 'set',
    value: function set() {
      var _this = this;

      var opts = undefined;
      if (arguments.length === 1 && (0, _lodash2.default)(arguments[0])) {
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
}();

exports.default = Builder;


Builder.defaults = {
  timeout: 10000
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBS3FCO0FBQ25CLFdBRG1CLE9BQ25CLEdBQWM7MEJBREssU0FDTDs7QUFDWixTQUFLLFNBQUwsR0FBaUIsRUFBakIsQ0FEWTtBQUVaLFNBQUssVUFBTCxHQUFrQixFQUFsQixDQUZZO0dBQWQ7O2VBRG1COzs2QkFNVixPQUFPO0FBQ2QsY0FBUSxxQkFBVyxlQUFYLENBQTJCLEtBQTNCLENBQVIsQ0FEYztBQUVkLGFBQU8sS0FBSyxTQUFMLENBQWUsS0FBZixNQUEwQixLQUFLLFNBQUwsQ0FBZSxLQUFmLElBQXdCLHVCQUFhLElBQWIsRUFBbUIsS0FBbkIsQ0FBeEIsQ0FBMUIsQ0FGTzs7OzswQkFLVjs7O0FBQ0osVUFBSSxnQkFBSixDQURJO0FBRUosVUFBSSxVQUFVLE1BQVYsS0FBcUIsQ0FBckIsSUFBMEIsc0JBQWMsVUFBVSxDQUFWLENBQWQsQ0FBMUIsRUFBdUQ7QUFDekQsZUFBTyxVQUFVLENBQVYsQ0FBUCxDQUR5RDtPQUEzRCxNQUVPLElBQUksVUFBVSxNQUFWLEtBQXFCLENBQXJCLElBQTBCLE9BQU8sVUFBVSxDQUFWLENBQVAsS0FBeUIsUUFBekIsRUFBbUM7QUFDdEUsbUNBQVMsVUFBVSxDQUFWLEdBQWUsVUFBVSxDQUFWLEVBQXhCLENBRHNFO09BQWpFOztBQUlQLGFBQU8sSUFBUCxDQUFZLElBQVosRUFBa0IsT0FBbEIsQ0FBMEIsVUFBQyxDQUFELEVBQU87QUFDL0IsWUFBTSxJQUFJLEtBQUssQ0FBTCxDQUFKLENBRHlCO0FBRS9CLGNBQUssVUFBTCxDQUFnQixDQUFoQixJQUFxQixDQUFyQixDQUYrQjtPQUFQLENBQTFCLENBUkk7Ozs7d0JBY0YsS0FBSztBQUNQLGFBQU8sS0FBSyxVQUFMLENBQWdCLEdBQWhCLEtBQXdCLFFBQVEsUUFBUixDQUFpQixHQUFqQixDQUF4QixDQURBOzs7O1NBekJVOzs7Ozs7QUE4QnJCLFFBQVEsUUFBUixHQUFtQjtBQUNqQixXQUFTLEtBQVQ7Q0FERiIsImZpbGUiOiJidWlsZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnbG9kYXNoLmlzcGxhaW5vYmplY3QnO1xuXG5pbXBvcnQgUnVuTGV2ZWwgZnJvbSAnLi9ydW4tbGV2ZWwnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi9hcHAtY29udGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJ1bmxldmVscyA9IHt9O1xuICAgIHRoaXMucHJvcGVydGllcyA9IHt9O1xuICB9XG5cbiAgcnVubGV2ZWwobGV2ZWwpIHtcbiAgICBsZXZlbCA9IEFwcENvbnRleHQucmVzb2x2ZVJ1bkxldmVsKGxldmVsKTtcbiAgICByZXR1cm4gdGhpcy5ydW5sZXZlbHNbbGV2ZWxdIHx8ICh0aGlzLnJ1bmxldmVsc1tsZXZlbF0gPSBuZXcgUnVuTGV2ZWwodGhpcywgbGV2ZWwpKTtcbiAgfVxuXG4gIHNldCgpIHtcbiAgICBsZXQgb3B0cztcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiBpc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIG9wdHMgPSBhcmd1bWVudHNbMF07XG4gICAgfSBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyICYmIHR5cGVvZihhcmd1bWVudHNbMF0pID09PSAnc3RyaW5nJykge1xuICAgICAgb3B0cyA9IHtbYXJndW1lbnRzWzBdXTogYXJndW1lbnRzWzFdfTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyhvcHRzKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBjb25zdCB2ID0gb3B0c1trXTtcbiAgICAgIHRoaXMucHJvcGVydGllc1trXSA9IHY7XG4gICAgfSk7XG4gIH1cblxuICBnZXQoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMucHJvcGVydGllc1trZXldIHx8IEJ1aWxkZXIuZGVmYXVsdHNba2V5XTtcbiAgfVxufVxuXG5CdWlsZGVyLmRlZmF1bHRzID0ge1xuICB0aW1lb3V0OiAxMDAwMFxufTtcbiJdfQ==