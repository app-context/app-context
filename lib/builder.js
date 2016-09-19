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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9idWlsZGVyLmpzIl0sIm5hbWVzIjpbIkJ1aWxkZXIiLCJydW5sZXZlbHMiLCJwcm9wZXJ0aWVzIiwibGV2ZWwiLCJyZXNvbHZlUnVuTGV2ZWwiLCJvcHRzIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrIiwidiIsImtleSIsImRlZmF1bHRzIiwidGltZW91dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFFcUJBLE87QUFDbkIscUJBQWM7QUFBQTs7QUFDWixTQUFLQyxTQUFMLEdBQWlCLEVBQWpCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNEOzs7OzZCQUVRQyxLLEVBQU87QUFDZEEsY0FBUSxxQkFBV0MsZUFBWCxDQUEyQkQsS0FBM0IsQ0FBUjtBQUNBLGFBQU8sS0FBS0YsU0FBTCxDQUFlRSxLQUFmLE1BQTBCLEtBQUtGLFNBQUwsQ0FBZUUsS0FBZixJQUF3Qix1QkFBYSxJQUFiLEVBQW1CQSxLQUFuQixDQUFsRCxDQUFQO0FBQ0Q7OzswQkFFSztBQUFBOztBQUNKLFVBQUlFLGFBQUo7QUFDQSxVQUFJQyxVQUFVQyxNQUFWLEtBQXFCLENBQXJCLElBQTBCLHNCQUFjRCxVQUFVLENBQVYsQ0FBZCxDQUE5QixFQUEyRDtBQUN6REQsZUFBT0MsVUFBVSxDQUFWLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSUEsVUFBVUMsTUFBVixLQUFxQixDQUFyQixJQUEwQixPQUFPRCxVQUFVLENBQVYsQ0FBUCxLQUF5QixRQUF2RCxFQUFpRTtBQUN0RUQsbUNBQVNDLFVBQVUsQ0FBVixDQUFULEVBQXdCQSxVQUFVLENBQVYsQ0FBeEI7QUFDRDs7QUFFREUsYUFBT0MsSUFBUCxDQUFZSixJQUFaLEVBQWtCSyxPQUFsQixDQUEwQixVQUFDQyxDQUFELEVBQU87QUFDL0IsWUFBTUMsSUFBSVAsS0FBS00sQ0FBTCxDQUFWO0FBQ0EsY0FBS1QsVUFBTCxDQUFnQlMsQ0FBaEIsSUFBcUJDLENBQXJCO0FBQ0QsT0FIRDtBQUlEOzs7d0JBRUdDLEcsRUFBSztBQUNQLGFBQU8sS0FBS1gsVUFBTCxDQUFnQlcsR0FBaEIsS0FBd0JiLFFBQVFjLFFBQVIsQ0FBaUJELEdBQWpCLENBQS9CO0FBQ0Q7Ozs7OztrQkEzQmtCYixPOzs7QUE4QnJCQSxRQUFRYyxRQUFSLEdBQW1CO0FBQ2pCQyxXQUFTO0FBRFEsQ0FBbkIiLCJmaWxlIjoiYnVpbGRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2xvZGFzaC5pc3BsYWlub2JqZWN0JztcblxuaW1wb3J0IFJ1bkxldmVsIGZyb20gJy4vcnVuLWxldmVsJztcbmltcG9ydCBBcHBDb250ZXh0IGZyb20gJy4vYXBwLWNvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5ydW5sZXZlbHMgPSB7fTtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB7fTtcbiAgfVxuXG4gIHJ1bmxldmVsKGxldmVsKSB7XG4gICAgbGV2ZWwgPSBBcHBDb250ZXh0LnJlc29sdmVSdW5MZXZlbChsZXZlbCk7XG4gICAgcmV0dXJuIHRoaXMucnVubGV2ZWxzW2xldmVsXSB8fCAodGhpcy5ydW5sZXZlbHNbbGV2ZWxdID0gbmV3IFJ1bkxldmVsKHRoaXMsIGxldmVsKSk7XG4gIH1cblxuICBzZXQoKSB7XG4gICAgbGV0IG9wdHM7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0pKSB7XG4gICAgICBvcHRzID0gYXJndW1lbnRzWzBdO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMiAmJiB0eXBlb2YoYXJndW1lbnRzWzBdKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG9wdHMgPSB7W2FyZ3VtZW50c1swXV06IGFyZ3VtZW50c1sxXX07XG4gICAgfVxuXG4gICAgT2JqZWN0LmtleXMob3B0cykuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgY29uc3QgdiA9IG9wdHNba107XG4gICAgICB0aGlzLnByb3BlcnRpZXNba10gPSB2O1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiB0aGlzLnByb3BlcnRpZXNba2V5XSB8fCBCdWlsZGVyLmRlZmF1bHRzW2tleV07XG4gIH1cbn1cblxuQnVpbGRlci5kZWZhdWx0cyA9IHtcbiAgdGltZW91dDogMTAwMDBcbn07XG4iXX0=