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

      var opts = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCLE87QUFDbkIscUJBQWM7QUFBQTs7QUFDWixTQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFDRDs7Ozs2QkFFUSxLLEVBQU87QUFDZCxjQUFRLHFCQUFXLGVBQVgsQ0FBMkIsS0FBM0IsQ0FBUjtBQUNBLGFBQU8sS0FBSyxTQUFMLENBQWUsS0FBZixNQUEwQixLQUFLLFNBQUwsQ0FBZSxLQUFmLElBQXdCLHVCQUFhLElBQWIsRUFBbUIsS0FBbkIsQ0FBbEQsQ0FBUDtBQUNEOzs7MEJBRUs7QUFBQTs7QUFDSixVQUFJLGFBQUo7QUFDQSxVQUFJLFVBQVUsTUFBVixLQUFxQixDQUFyQixJQUEwQixzQkFBYyxVQUFVLENBQVYsQ0FBZCxDQUE5QixFQUEyRDtBQUN6RCxlQUFPLFVBQVUsQ0FBVixDQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUksVUFBVSxNQUFWLEtBQXFCLENBQXJCLElBQTBCLE9BQU8sVUFBVSxDQUFWLENBQVAsS0FBeUIsUUFBdkQsRUFBaUU7QUFDdEUsbUNBQVMsVUFBVSxDQUFWLENBQVQsRUFBd0IsVUFBVSxDQUFWLENBQXhCO0FBQ0Q7O0FBRUQsYUFBTyxJQUFQLENBQVksSUFBWixFQUFrQixPQUFsQixDQUEwQixVQUFDLENBQUQsRUFBTztBQUMvQixZQUFNLElBQUksS0FBSyxDQUFMLENBQVY7QUFDQSxjQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsSUFBcUIsQ0FBckI7QUFDRCxPQUhEO0FBSUQ7Ozt3QkFFRyxHLEVBQUs7QUFDUCxhQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixLQUF3QixRQUFRLFFBQVIsQ0FBaUIsR0FBakIsQ0FBL0I7QUFDRDs7Ozs7O2tCQTNCa0IsTzs7O0FBOEJyQixRQUFRLFFBQVIsR0FBbUI7QUFDakIsV0FBUztBQURRLENBQW5CIiwiZmlsZSI6ImJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2guaXNwbGFpbm9iamVjdCc7XG5cbmltcG9ydCBSdW5MZXZlbCBmcm9tICcuL3J1bi1sZXZlbCc7XG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuL2FwcC1jb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucnVubGV2ZWxzID0ge307XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gIH1cblxuICBydW5sZXZlbChsZXZlbCkge1xuICAgIGxldmVsID0gQXBwQ29udGV4dC5yZXNvbHZlUnVuTGV2ZWwobGV2ZWwpO1xuICAgIHJldHVybiB0aGlzLnJ1bmxldmVsc1tsZXZlbF0gfHwgKHRoaXMucnVubGV2ZWxzW2xldmVsXSA9IG5ldyBSdW5MZXZlbCh0aGlzLCBsZXZlbCkpO1xuICB9XG5cbiAgc2V0KCkge1xuICAgIGxldCBvcHRzO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIGlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdKSkge1xuICAgICAgb3B0cyA9IGFyZ3VtZW50c1swXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mKGFyZ3VtZW50c1swXSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRzID0ge1thcmd1bWVudHNbMF1dOiBhcmd1bWVudHNbMV19O1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goKGspID0+IHtcbiAgICAgIGNvbnN0IHYgPSBvcHRzW2tdO1xuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tdID0gdjtcbiAgICB9KTtcbiAgfVxuXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2tleV0gfHwgQnVpbGRlci5kZWZhdWx0c1trZXldO1xuICB9XG59XG5cbkJ1aWxkZXIuZGVmYXVsdHMgPSB7XG4gIHRpbWVvdXQ6IDEwMDAwXG59O1xuIl19