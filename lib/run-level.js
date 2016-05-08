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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ydW4tbGV2ZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7SUFBWSxNOztBQUNaOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFFBQVEsUUFBUSxPQUFSLEVBQWlCLHVCQUFqQixDQUFkOztJQUVxQixRO0FBQ25CLG9CQUFZLE9BQVosRUFBcUIsS0FBckIsRUFBNEI7QUFBQTs7QUFDMUIsU0FBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxTQUFLLElBQUwsR0FBWSxxQkFBVyxlQUFYLENBQTJCLEtBQTNCLENBQVo7QUFDQSxTQUFLLFlBQUwsR0FBb0IsRUFBcEI7QUFDRDs7Ozs7Ozs7Ozs7Ozs7MEJBVVk7QUFBQSx3Q0FBTixJQUFNO0FBQU4sWUFBTTtBQUFBOztBQUNYLFVBQUksS0FBSyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQUUsY0FBTSxPQUFPLE9BQVAsQ0FBZSwyQ0FBZixDQUFOO0FBQW9FOztBQUU3RixVQUFJLFFBQVEsS0FBSyxLQUFMLEVBQVo7O0FBRUEsVUFBSSxPQUFPLEtBQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLHNCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLEtBQW5DLEVBQTBDLElBQTFDLENBQXZCO0FBQ0QsT0FGRCxNQUVPLElBQUksT0FBTyxLQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ3ZDLGFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixzQkFBWSxnQkFBWixDQUE2QixJQUE3QixFQUFtQyxLQUFuQyxFQUEwQyxJQUExQyxDQUF2QjtBQUNEOztBQUVELGFBQU8sSUFBUDtBQUNEOzs7K0JBRVUsTyxFQUFTO0FBQUE7O0FBQ2xCLFlBQU0seUJBQXlCLEtBQUssS0FBcEM7O0FBRUEsVUFBSSxPQUFPLENBQVg7O0FBRUEsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsVUFBQyxXQUFELEVBQWMsV0FBZCxFQUE4QjtBQUM1RCxlQUFPLFlBQVksSUFBWixDQUFpQixZQUFNO0FBQzVCLGdCQUFNLHlCQUF5QixNQUFLLEtBQTlCLEdBQXNDLFFBQXRDLEdBQWlELElBQXZEOztBQUVBLGlCQUFPLFlBQVksT0FBWixDQUFvQixPQUFwQixFQUE2QixJQUE3QixDQUFrQyxZQUFNO0FBQzdDLGtCQUFNLHlCQUF5QixNQUFLLEtBQTlCLEdBQXNDLFFBQXRDLEdBQWlELElBQWpELEdBQXdELE9BQTlEO0FBQ0EsY0FBRSxJQUFGO0FBQ0QsV0FITSxFQUdKLEtBSEksQ0FHRSxVQUFDLEdBQUQsRUFBUztBQUNoQixnQkFBSSxRQUFKLEdBQWUsTUFBSyxLQUFwQjtBQUNBLGdCQUFJLFlBQUosR0FBbUIsTUFBSyxJQUF4QjtBQUNBLGdCQUFJLElBQUosR0FBVyxJQUFYO0FBQ0EsZ0JBQUksV0FBSixHQUFrQixXQUFsQjtBQUNBLGtCQUFNLHlCQUF5QixNQUFLLEtBQTlCLEdBQXNDLFFBQXRDLEdBQWlELElBQWpELEdBQXdELFVBQXhELEdBQXFFLElBQUksT0FBL0U7QUFDQSxrQkFBTSxPQUFPLFdBQVAsQ0FBbUIsR0FBbkIsQ0FBTjtBQUNELFdBVk0sQ0FBUDtBQVdELFNBZE0sQ0FBUDtBQWVELE9BaEJNLEVBZ0JKLFFBQVEsT0FBUixFQWhCSSxFQWdCZSxJQWhCZixDQWdCb0IsWUFBTTtBQUMvQixjQUFNLHlCQUF5QixNQUFLLEtBQTlCLEdBQXNDLE9BQTVDO0FBQ0QsT0FsQk0sRUFrQkosS0FsQkksQ0FrQkUsVUFBQyxHQUFELEVBQVM7QUFDaEIsY0FBTSx5QkFBeUIsTUFBSyxLQUE5QixHQUFzQyxpQkFBdEMsR0FBMEQsSUFBaEU7QUFDQSxjQUFNLEdBQU47QUFDRCxPQXJCTSxDQUFQO0FBc0JEOzs7Ozs7a0JBekRrQixRIiwiZmlsZSI6InJ1bi1sZXZlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVycm9ycyBmcm9tICcuL2Vycm9ycyc7XG5pbXBvcnQgQXBwQ29udGV4dCBmcm9tICcuL2FwcC1jb250ZXh0JztcbmltcG9ydCBJbml0aWFsaXplciBmcm9tICcuL2luaXRpYWxpemVyJztcblxuY29uc3QgZGVidWcgPSByZXF1aXJlKCdkZWJ1ZycpKCdhcHAtY29udGV4dDpydW4tbGV2ZWwnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUnVuTGV2ZWwge1xuICBjb25zdHJ1Y3RvcihidWlsZGVyLCBsZXZlbCkge1xuICAgIHRoaXMuYnVpbGRlciA9IGJ1aWxkZXI7XG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMubmFtZSA9IEFwcENvbnRleHQuZ2V0UnVuTGV2ZWxOYW1lKGxldmVsKTtcbiAgICB0aGlzLmluaXRpYWxpemVycyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAgKiB1c2UoJ3JlZGlzJywge2NhY2hlOiAnJHJlZGlzLmNhY2hlJywgc2Vzc2lvbnM6ICckcmVkaXMuc2Vzc2lvbnMnfSlcbiAgICAqIHVzZSgnY29ubmllJywgJ2ZpbGUnLCAnY29uZmlnLyR7ZW52aXJvbm1lbnR9Lmpzb24nKVxuICAgICogdXNlKHJlcXVpcmUoJy4vZm9vYmFyJykpXG4gICAgKiB1c2UocmVxdWlyZSgnLi9mb29iYXInKSwgJyRjb25maWd2YXInKVxuICAgICogdXNlKGZ1bmN0aW9uKGNvbnRleHQpIHsgcmV0dXJuIG5ldyBQcm9taXNlKC4uLikgfSlcbiAgICAqIHVzZShmdW5jdGlvbihjb250ZXh0LCBkb25lKSB7IGRvbmUoKSB9KVxuICAgKiovXG4gIHVzZSguLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7IHRocm93IGVycm9ycy5tZXNzYWdlKCdDYW5ub3QgY2FsbCAudXNlKCkgd2l0aG91dCBhbnkgYXJndW1lbnRzLicpOyB9XG5cbiAgICBsZXQgZmlyc3QgPSBhcmdzLnNoaWZ0KCk7XG5cbiAgICBpZiAodHlwZW9mKGZpcnN0KSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZXJzLnB1c2goSW5pdGlhbGl6ZXIuY3JlYXRlRnJvbU1vZHVsZSh0aGlzLCBmaXJzdCwgYXJncykpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mKGZpcnN0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5pbml0aWFsaXplcnMucHVzaChJbml0aWFsaXplci5jcmVhdGVGcm9tTWV0aG9kKHRoaXMsIGZpcnN0LCBhcmdzKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB0cmFuc2l0aW9uKGNvbnRleHQpIHtcbiAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCk7XG5cbiAgICBsZXQgc3RlcCA9IDA7XG5cbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplcnMucmVkdWNlKChsYXN0UHJvbWlzZSwgaW5pdGlhbGl6ZXIpID0+IHtcbiAgICAgIHJldHVybiBsYXN0UHJvbWlzZS50aGVuKCgpID0+IHtcbiAgICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIHN0ZXAgJyArIHN0ZXApO1xuXG4gICAgICAgIHJldHVybiBpbml0aWFsaXplci5leGVjdXRlKGNvbnRleHQpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGRlYnVnKCd0cmFuc2l0aW9uIHRvIGxldmVsICcgKyB0aGlzLmxldmVsICsgJyBzdGVwICcgKyBzdGVwICsgJyBET05FJyk7XG4gICAgICAgICAgKytzdGVwO1xuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgZXJyLnJ1bmxldmVsID0gdGhpcy5sZXZlbDtcbiAgICAgICAgICBlcnIucnVubGV2ZWxOYW1lID0gdGhpcy5uYW1lO1xuICAgICAgICAgIGVyci5zdGVwID0gc3RlcDtcbiAgICAgICAgICBlcnIuaW5pdGlhbGl6ZXIgPSBpbml0aWFsaXplcjtcbiAgICAgICAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCArICcgc3RlcCAnICsgc3RlcCArICcgRVJST1I6ICcgKyBlcnIubWVzc2FnZSk7XG4gICAgICAgICAgdGhyb3cgZXJyb3JzLmluaXRpYWxpemVyKGVycik7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSwgUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oKCkgPT4ge1xuICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIERPTkUnKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCArICcgRVJST1Igb24gc3RlcCAnICsgc3RlcCk7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==