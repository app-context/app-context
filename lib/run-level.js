'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

var _appContext = require('./app-context');

var _appContext2 = _interopRequireDefault(_appContext);

var _initializer = require('./initializer');

var _initializer2 = _interopRequireDefault(_initializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require('debug')('app-context:run-level');

var RunLevel = function () {
  function RunLevel(builder, level) {
    _classCallCheck(this, RunLevel);

    this.builder = builder;
    this.level = level;
    this.name = _appContext2.default.getRunLevelName(level);
    this.initializers = [];
  }

  /**
    * use('redis', {cache: '$redis.cache', sessions: '$redis.sessions'})
    * use('connie', 'file', 'config/${environment}.json')
    * use(require('./foobar'))
    * use(require('./foobar'), '$configvar')
    * use(function(context) { return new Promise(...) })
    * use(function(context, done) { done() })
   **/


  _createClass(RunLevel, [{
    key: 'use',
    value: function use() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === 0) {
        throw errors.message('Cannot call .use() without any arguments.');
      }

      var first = args.shift();

      if (typeof first === 'string') {
        this.initializers.push(_initializer2.default.createFromModule(this, first, args));
      } else if (typeof first === 'function') {
        this.initializers.push(_initializer2.default.createFromMethod(this, first, args));
      }

      return this;
    }
  }, {
    key: 'transition',
    value: function transition(context) {
      var _this = this;

      debug('transition to level ' + this.level);

      var step = 0;

      return this.initializers.reduce(function (lastPromise, initializer) {
        return lastPromise.then(function () {
          debug('transition to level ' + _this.level + ' step ' + step);

          return initializer.execute(context).then(function () {
            debug('transition to level ' + _this.level + ' step ' + step + ' DONE');
            ++step;
          }).catch(function (err) {
            err.runlevel = _this.level;
            err.runlevelName = _this.name;
            err.step = step;
            err.initializer = initializer;
            debug('transition to level ' + _this.level + ' step ' + step + ' ERROR: ' + err.message);
            throw errors.initializer(err);
          });
        });
      }, Promise.resolve()).then(function () {
        debug('transition to level ' + _this.level + ' DONE');
      }).catch(function (err) {
        debug('transition to level ' + _this.level + ' ERROR on step ' + step);
        throw err;
      });
    }
  }]);

  return RunLevel;
}();

exports.default = RunLevel;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ydW4tbGV2ZWwuanMiXSwibmFtZXMiOlsiZXJyb3JzIiwiZGVidWciLCJyZXF1aXJlIiwiUnVuTGV2ZWwiLCJidWlsZGVyIiwibGV2ZWwiLCJuYW1lIiwiZ2V0UnVuTGV2ZWxOYW1lIiwiaW5pdGlhbGl6ZXJzIiwiYXJncyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJmaXJzdCIsInNoaWZ0IiwicHVzaCIsImNyZWF0ZUZyb21Nb2R1bGUiLCJjcmVhdGVGcm9tTWV0aG9kIiwiY29udGV4dCIsInN0ZXAiLCJyZWR1Y2UiLCJsYXN0UHJvbWlzZSIsImluaXRpYWxpemVyIiwidGhlbiIsImV4ZWN1dGUiLCJjYXRjaCIsImVyciIsInJ1bmxldmVsIiwicnVubGV2ZWxOYW1lIiwiUHJvbWlzZSIsInJlc29sdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLE07O0FBQ1o7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1DLFFBQVFDLFFBQVEsT0FBUixFQUFpQix1QkFBakIsQ0FBZDs7SUFFcUJDLFE7QUFDbkIsb0JBQVlDLE9BQVosRUFBcUJDLEtBQXJCLEVBQTRCO0FBQUE7O0FBQzFCLFNBQUtELE9BQUwsR0FBZUEsT0FBZjtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsS0FBYjtBQUNBLFNBQUtDLElBQUwsR0FBWSxxQkFBV0MsZUFBWCxDQUEyQkYsS0FBM0IsQ0FBWjtBQUNBLFNBQUtHLFlBQUwsR0FBb0IsRUFBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7OzBCQVFhO0FBQUEsd0NBQU5DLElBQU07QUFBTkEsWUFBTTtBQUFBOztBQUNYLFVBQUlBLEtBQUtDLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFBRSxjQUFNVixPQUFPVyxPQUFQLENBQWUsMkNBQWYsQ0FBTjtBQUFvRTs7QUFFN0YsVUFBSUMsUUFBUUgsS0FBS0ksS0FBTCxFQUFaOztBQUVBLFVBQUksT0FBT0QsS0FBUCxLQUFrQixRQUF0QixFQUFnQztBQUM5QixhQUFLSixZQUFMLENBQWtCTSxJQUFsQixDQUF1QixzQkFBWUMsZ0JBQVosQ0FBNkIsSUFBN0IsRUFBbUNILEtBQW5DLEVBQTBDSCxJQUExQyxDQUF2QjtBQUNELE9BRkQsTUFFTyxJQUFJLE9BQU9HLEtBQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDdkMsYUFBS0osWUFBTCxDQUFrQk0sSUFBbEIsQ0FBdUIsc0JBQVlFLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DSixLQUFuQyxFQUEwQ0gsSUFBMUMsQ0FBdkI7QUFDRDs7QUFFRCxhQUFPLElBQVA7QUFDRDs7OytCQUVVUSxPLEVBQVM7QUFBQTs7QUFDbEJoQixZQUFNLHlCQUF5QixLQUFLSSxLQUFwQzs7QUFFQSxVQUFJYSxPQUFPLENBQVg7O0FBRUEsYUFBTyxLQUFLVixZQUFMLENBQWtCVyxNQUFsQixDQUF5QixVQUFDQyxXQUFELEVBQWNDLFdBQWQsRUFBOEI7QUFDNUQsZUFBT0QsWUFBWUUsSUFBWixDQUFpQixZQUFNO0FBQzVCckIsZ0JBQU0seUJBQXlCLE1BQUtJLEtBQTlCLEdBQXNDLFFBQXRDLEdBQWlEYSxJQUF2RDs7QUFFQSxpQkFBT0csWUFBWUUsT0FBWixDQUFvQk4sT0FBcEIsRUFBNkJLLElBQTdCLENBQWtDLFlBQU07QUFDN0NyQixrQkFBTSx5QkFBeUIsTUFBS0ksS0FBOUIsR0FBc0MsUUFBdEMsR0FBaURhLElBQWpELEdBQXdELE9BQTlEO0FBQ0EsY0FBRUEsSUFBRjtBQUNELFdBSE0sRUFHSk0sS0FISSxDQUdFLFVBQUNDLEdBQUQsRUFBUztBQUNoQkEsZ0JBQUlDLFFBQUosR0FBZSxNQUFLckIsS0FBcEI7QUFDQW9CLGdCQUFJRSxZQUFKLEdBQW1CLE1BQUtyQixJQUF4QjtBQUNBbUIsZ0JBQUlQLElBQUosR0FBV0EsSUFBWDtBQUNBTyxnQkFBSUosV0FBSixHQUFrQkEsV0FBbEI7QUFDQXBCLGtCQUFNLHlCQUF5QixNQUFLSSxLQUE5QixHQUFzQyxRQUF0QyxHQUFpRGEsSUFBakQsR0FBd0QsVUFBeEQsR0FBcUVPLElBQUlkLE9BQS9FO0FBQ0Esa0JBQU1YLE9BQU9xQixXQUFQLENBQW1CSSxHQUFuQixDQUFOO0FBQ0QsV0FWTSxDQUFQO0FBV0QsU0FkTSxDQUFQO0FBZUQsT0FoQk0sRUFnQkpHLFFBQVFDLE9BQVIsRUFoQkksRUFnQmVQLElBaEJmLENBZ0JvQixZQUFNO0FBQy9CckIsY0FBTSx5QkFBeUIsTUFBS0ksS0FBOUIsR0FBc0MsT0FBNUM7QUFDRCxPQWxCTSxFQWtCSm1CLEtBbEJJLENBa0JFLFVBQUNDLEdBQUQsRUFBUztBQUNoQnhCLGNBQU0seUJBQXlCLE1BQUtJLEtBQTlCLEdBQXNDLGlCQUF0QyxHQUEwRGEsSUFBaEU7QUFDQSxjQUFNTyxHQUFOO0FBQ0QsT0FyQk0sQ0FBUDtBQXNCRDs7Ozs7O2tCQXpEa0J0QixRIiwiZmlsZSI6InJ1bi1sZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuL2FwcC1jb250ZXh0JztcbmltcG9ydCBJbml0aWFsaXplciBmcm9tICcuL2luaXRpYWxpemVyJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dDpydW4tbGV2ZWwnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVuTGV2ZWwge1xuICBjb25zdHJ1Y3RvcihidWlsZGVyLCBsZXZlbCkge1xuICAgIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMubmFtZSA9IEFwcENvbnRleHQuZ2V0UnVuTGV2ZWxOYW1lKGxldmVsKTtcbiAgICB0aGlzLmluaXRpYWxpemVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAgKiB1c2UoJ3JlZGlzJywge2NhY2hlOiAnJHJlZGlzLmNhY2hlJywgc2Vzc2lvbnM6ICckcmVkaXMuc2Vzc2lvbnMnfSlcbiAgICAqIHVzZSgnY29ubmllJywgJ2ZpbGUnLCAnY29uZmlnLyR7ZW52aXJvbm1lbnR9Lmpzb24nKVxuICAgICogdXNlKHJlcXVpcmUoJy4vZm9vYmFyJykpXG4gICAgKiB1c2UocmVxdWlyZSgnLi9mb29iYXInKSwgJyRjb25maWd2YXInKVxuICAgICogdXNlKGZ1bmN0aW9uKGNvbnRleHQpIHsgcmV0dXJuIG5ldyBQcm9taXNlKC4uLikgfSlcbiAgICAqIHVzZShmdW5jdGlvbihjb250ZXh0LCBkb25lKSB7IGRvbmUoKSB9KVxuICAgKiovXG4gIHVzZSguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdDYW5ub3QgY2FsbCAudXNlKCkgd2l0aG91dCBhbnkgYXJndW1lbnRzLicpOyB9XG5cbiAgICBsZXQgZmlyc3QgPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICBpZiAodHlwZW9mKGZpcnN0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZXJzLnB1c2goSW5pdGlhbGl6ZXIuY3JlYXRlRnJvbU1vZHVsZSh0aGlzLCBmaXJzdCwgYXJncykpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mKGZpcnN0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pbml0aWFsaXplcnMucHVzaChJbml0aWFsaXplci5jcmVhdGVGcm9tTWV0aG9kKHRoaXMsIGZpcnN0LCBhcmdzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2l0aW9uKGNvbnRleHQpIHtcbiAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCk7XG5cbiAgICBsZXQgc3RlcCA9IDA7XG5cbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplcnMucmVkdWNlKChsYXN0UHJvbWlzZSwgaW5pdGlhbGl6ZXIpID0+IHtcbiAgICAgIHJldHVybiBsYXN0UHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIHN0ZXAgJyArIHN0ZXApO1xuXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplci5leGVjdXRlKGNvbnRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGRlYnVnKCd0cmFuc2l0aW9uIHRvIGxldmVsICcgKyB0aGlzLmxldmVsICsgJyBzdGVwICcgKyBzdGVwICsgJyBET05FJyk7XG4gICAgICAgICAgKytzdGVwO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgZXJyLnJ1bmxldmVsID0gdGhpcy5sZXZlbDtcbiAgICAgICAgICBlcnIucnVubGV2ZWxOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICAgIGVyci5zdGVwID0gc3RlcDtcbiAgICAgICAgICBlcnIuaW5pdGlhbGl6ZXIgPSBpbml0aWFsaXplcjtcbiAgICAgICAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCArICcgc3RlcCAnICsgc3RlcCArICcgRVJST1I6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgdGhyb3cgZXJyb3JzLmluaXRpYWxpemVyKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIERPTkUnKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCArICcgRVJST1Igb24gc3RlcCAnICsgc3RlcCk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==