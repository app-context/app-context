'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _runLevel = require('./run-level');

var _runLevel2 = _interopRequireDefault(_runLevel);

var _appContext = require('./app-context');

var _appContext2 = _interopRequireDefault(_appContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Builder = (function () {
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
})();

exports.default = Builder;

Builder.defaults = {
  timeout: 10000
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idWlsZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBS3FCLE9BQU87QUFDMUIsV0FEbUIsT0FBTyxHQUNaOzBCQURLLE9BQU87O0FBRXhCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBQ3RCOztlQUprQixPQUFPOzs2QkFNakIsS0FBSyxFQUFFO0FBQ2QsV0FBSyxHQUFHLHFCQUFXLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyx1QkFBYSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUEsQUFBQyxDQUFDO0tBQ3JGOzs7MEJBRUs7OztBQUNKLFVBQUksSUFBSSxZQUFBLENBQUM7QUFDVCxVQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLHNCQUFjLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3pELFlBQUksR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDckIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sU0FBUyxDQUFDLENBQUMsQ0FBQyxBQUFDLEtBQUssUUFBUSxFQUFFO0FBQ3RFLFlBQUksdUJBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3ZDOztBQUVELFlBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBQyxFQUFLO0FBQy9CLFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixjQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDeEIsQ0FBQyxDQUFDO0tBQ0o7Ozt3QkFFRyxHQUFHLEVBQUU7QUFDUCxhQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0RDs7O1NBM0JrQixPQUFPOzs7a0JBQVAsT0FBTzs7QUE4QjVCLE9BQU8sQ0FBQyxRQUFRLEdBQUc7QUFDakIsU0FBTyxFQUFFLEtBQUs7Q0FDZixDQUFDIiwiZmlsZSI6ImJ1aWxkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaXNQbGFpbk9iamVjdCBmcm9tICdsb2Rhc2guaXNwbGFpbm9iamVjdCc7XG5cbmltcG9ydCBSdW5MZXZlbCBmcm9tICcuL3J1bi1sZXZlbCc7XG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuL2FwcC1jb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucnVubGV2ZWxzID0ge307XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0ge307XG4gIH1cblxuICBydW5sZXZlbChsZXZlbCkge1xuICAgIGxldmVsID0gQXBwQ29udGV4dC5yZXNvbHZlUnVuTGV2ZWwobGV2ZWwpO1xuICAgIHJldHVybiB0aGlzLnJ1bmxldmVsc1tsZXZlbF0gfHwgKHRoaXMucnVubGV2ZWxzW2xldmVsXSA9IG5ldyBSdW5MZXZlbCh0aGlzLCBsZXZlbCkpO1xuICB9XG5cbiAgc2V0KCkge1xuICAgIGxldCBvcHRzO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIGlzUGxhaW5PYmplY3QoYXJndW1lbnRzWzBdKSkge1xuICAgICAgb3B0cyA9IGFyZ3VtZW50c1swXTtcbiAgICB9IGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDIgJiYgdHlwZW9mKGFyZ3VtZW50c1swXSkgPT09ICdzdHJpbmcnKSB7XG4gICAgICBvcHRzID0ge1thcmd1bWVudHNbMF1dOiBhcmd1bWVudHNbMV19O1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKG9wdHMpLmZvckVhY2goKGspID0+IHtcbiAgICAgIGNvbnN0IHYgPSBvcHRzW2tdO1xuICAgICAgdGhpcy5wcm9wZXJ0aWVzW2tdID0gdjtcbiAgICB9KTtcbiAgfVxuXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2tleV0gfHwgQnVpbGRlci5kZWZhdWx0c1trZXldO1xuICB9XG59XG5cbkJ1aWxkZXIuZGVmYXVsdHMgPSB7XG4gIHRpbWVvdXQ6IDEwMDAwXG59O1xuIl19