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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ydW4tbGV2ZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFZOzs7Ozs7Ozs7Ozs7Ozs7O0FBSVosSUFBTSxRQUFRLFFBQVEsT0FBUixFQUFpQix1QkFBakIsQ0FBUjs7SUFFZTtBQUNuQixXQURtQixRQUNuQixDQUFZLE9BQVosRUFBcUIsS0FBckIsRUFBNEI7MEJBRFQsVUFDUzs7QUFDMUIsU0FBSyxPQUFMLEdBQWUsT0FBZixDQUQwQjtBQUUxQixTQUFLLEtBQUwsR0FBYSxLQUFiLENBRjBCO0FBRzFCLFNBQUssSUFBTCxHQUFZLHFCQUFXLGVBQVgsQ0FBMkIsS0FBM0IsQ0FBWixDQUgwQjtBQUkxQixTQUFLLFlBQUwsR0FBb0IsRUFBcEIsQ0FKMEI7R0FBNUI7Ozs7Ozs7Ozs7OztlQURtQjs7MEJBZ0JOO3dDQUFOOztPQUFNOztBQUNYLFVBQUksS0FBSyxNQUFMLEtBQWdCLENBQWhCLEVBQW1CO0FBQUUsY0FBTSxPQUFPLE9BQVAsQ0FBZSwyQ0FBZixDQUFOLENBQUY7T0FBdkI7O0FBRUEsVUFBSSxRQUFRLEtBQUssS0FBTCxFQUFSLENBSE87O0FBS1gsVUFBSSxPQUFPLEtBQVAsS0FBa0IsUUFBbEIsRUFBNEI7QUFDOUIsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLHNCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLEtBQW5DLEVBQTBDLElBQTFDLENBQXZCLEVBRDhCO09BQWhDLE1BRU8sSUFBSSxPQUFPLEtBQVAsS0FBa0IsVUFBbEIsRUFBOEI7QUFDdkMsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLHNCQUFZLGdCQUFaLENBQTZCLElBQTdCLEVBQW1DLEtBQW5DLEVBQTBDLElBQTFDLENBQXZCLEVBRHVDO09BQWxDOztBQUlQLGFBQU8sSUFBUCxDQVhXOzs7OytCQWNGLFNBQVM7OztBQUNsQixZQUFNLHlCQUF5QixLQUFLLEtBQUwsQ0FBL0IsQ0FEa0I7O0FBR2xCLFVBQUksT0FBTyxDQUFQLENBSGM7O0FBS2xCLGFBQU8sS0FBSyxZQUFMLENBQWtCLE1BQWxCLENBQXlCLFVBQUMsV0FBRCxFQUFjLFdBQWQsRUFBOEI7QUFDNUQsZUFBTyxZQUFZLElBQVosQ0FBaUIsWUFBTTtBQUM1QixnQkFBTSx5QkFBeUIsTUFBSyxLQUFMLEdBQWEsUUFBdEMsR0FBaUQsSUFBakQsQ0FBTixDQUQ0Qjs7QUFHNUIsaUJBQU8sWUFBWSxPQUFaLENBQW9CLE9BQXBCLEVBQTZCLElBQTdCLENBQWtDLFlBQU07QUFDN0Msa0JBQU0seUJBQXlCLE1BQUssS0FBTCxHQUFhLFFBQXRDLEdBQWlELElBQWpELEdBQXdELE9BQXhELENBQU4sQ0FENkM7QUFFN0MsY0FBRSxJQUFGLENBRjZDO1dBQU4sQ0FBbEMsQ0FHSixLQUhJLENBR0UsVUFBQyxHQUFELEVBQVM7QUFDaEIsZ0JBQUksUUFBSixHQUFlLE1BQUssS0FBTCxDQURDO0FBRWhCLGdCQUFJLFlBQUosR0FBbUIsTUFBSyxJQUFMLENBRkg7QUFHaEIsZ0JBQUksSUFBSixHQUFXLElBQVgsQ0FIZ0I7QUFJaEIsZ0JBQUksV0FBSixHQUFrQixXQUFsQixDQUpnQjtBQUtoQixrQkFBTSx5QkFBeUIsTUFBSyxLQUFMLEdBQWEsUUFBdEMsR0FBaUQsSUFBakQsR0FBd0QsVUFBeEQsR0FBcUUsSUFBSSxPQUFKLENBQTNFLENBTGdCO0FBTWhCLGtCQUFNLE9BQU8sV0FBUCxDQUFtQixHQUFuQixDQUFOLENBTmdCO1dBQVQsQ0FIVCxDQUg0QjtTQUFOLENBQXhCLENBRDREO09BQTlCLEVBZ0I3QixRQUFRLE9BQVIsRUFoQkksRUFnQmUsSUFoQmYsQ0FnQm9CLFlBQU07QUFDL0IsY0FBTSx5QkFBeUIsTUFBSyxLQUFMLEdBQWEsT0FBdEMsQ0FBTixDQUQrQjtPQUFOLENBaEJwQixDQWtCSixLQWxCSSxDQWtCRSxVQUFDLEdBQUQsRUFBUztBQUNoQixjQUFNLHlCQUF5QixNQUFLLEtBQUwsR0FBYSxpQkFBdEMsR0FBMEQsSUFBMUQsQ0FBTixDQURnQjtBQUVoQixjQUFNLEdBQU4sQ0FGZ0I7T0FBVCxDQWxCVCxDQUxrQjs7OztTQTlCRCIsImZpbGUiOiJydW4tbGV2ZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlcnJvcnMgZnJvbSAnLi9lcnJvcnMnO1xuaW1wb3J0IEFwcENvbnRleHQgZnJvbSAnLi9hcHAtY29udGV4dCc7XG5pbXBvcnQgSW5pdGlhbGl6ZXIgZnJvbSAnLi9pbml0aWFsaXplcic7XG5cbmNvbnN0IGRlYnVnID0gcmVxdWlyZSgnZGVidWcnKSgnYXBwLWNvbnRleHQ6cnVuLWxldmVsJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJ1bkxldmVsIHtcbiAgY29uc3RydWN0b3IoYnVpbGRlciwgbGV2ZWwpIHtcbiAgICB0aGlzLmJ1aWxkZXIgPSBidWlsZGVyO1xuICAgIHRoaXMubGV2ZWwgPSBsZXZlbDtcbiAgICB0aGlzLm5hbWUgPSBBcHBDb250ZXh0LmdldFJ1bkxldmVsTmFtZShsZXZlbCk7XG4gICAgdGhpcy5pbml0aWFsaXplcnMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgICogdXNlKCdyZWRpcycsIHtjYWNoZTogJyRyZWRpcy5jYWNoZScsIHNlc3Npb25zOiAnJHJlZGlzLnNlc3Npb25zJ30pXG4gICAgKiB1c2UoJ2Nvbm5pZScsICdmaWxlJywgJ2NvbmZpZy8ke2Vudmlyb25tZW50fS5qc29uJylcbiAgICAqIHVzZShyZXF1aXJlKCcuL2Zvb2JhcicpKVxuICAgICogdXNlKHJlcXVpcmUoJy4vZm9vYmFyJyksICckY29uZmlndmFyJylcbiAgICAqIHVzZShmdW5jdGlvbihjb250ZXh0KSB7IHJldHVybiBuZXcgUHJvbWlzZSguLi4pIH0pXG4gICAgKiB1c2UoZnVuY3Rpb24oY29udGV4dCwgZG9uZSkgeyBkb25lKCkgfSlcbiAgICoqL1xuICB1c2UoLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgeyB0aHJvdyBlcnJvcnMubWVzc2FnZSgnQ2Fubm90IGNhbGwgLnVzZSgpIHdpdGhvdXQgYW55IGFyZ3VtZW50cy4nKTsgfVxuXG4gICAgbGV0IGZpcnN0ID0gYXJncy5zaGlmdCgpO1xuXG4gICAgaWYgKHR5cGVvZihmaXJzdCkgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVycy5wdXNoKEluaXRpYWxpemVyLmNyZWF0ZUZyb21Nb2R1bGUodGhpcywgZmlyc3QsIGFyZ3MpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZihmaXJzdCkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZXJzLnB1c2goSW5pdGlhbGl6ZXIuY3JlYXRlRnJvbU1ldGhvZCh0aGlzLCBmaXJzdCwgYXJncykpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdHJhbnNpdGlvbihjb250ZXh0KSB7XG4gICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwpO1xuXG4gICAgbGV0IHN0ZXAgPSAwO1xuXG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZXJzLnJlZHVjZSgobGFzdFByb21pc2UsIGluaXRpYWxpemVyKSA9PiB7XG4gICAgICByZXR1cm4gbGFzdFByb21pc2UudGhlbigoKSA9PiB7XG4gICAgICAgIGRlYnVnKCd0cmFuc2l0aW9uIHRvIGxldmVsICcgKyB0aGlzLmxldmVsICsgJyBzdGVwICcgKyBzdGVwKTtcblxuICAgICAgICByZXR1cm4gaW5pdGlhbGl6ZXIuZXhlY3V0ZShjb250ZXh0KS50aGVuKCgpID0+IHtcbiAgICAgICAgICBkZWJ1ZygndHJhbnNpdGlvbiB0byBsZXZlbCAnICsgdGhpcy5sZXZlbCArICcgc3RlcCAnICsgc3RlcCArICcgRE9ORScpO1xuICAgICAgICAgICsrc3RlcDtcbiAgICAgICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgIGVyci5ydW5sZXZlbCA9IHRoaXMubGV2ZWw7XG4gICAgICAgICAgZXJyLnJ1bmxldmVsTmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgICBlcnIuc3RlcCA9IHN0ZXA7XG4gICAgICAgICAgZXJyLmluaXRpYWxpemVyID0gaW5pdGlhbGl6ZXI7XG4gICAgICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIHN0ZXAgJyArIHN0ZXAgKyAnIEVSUk9SOiAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIHRocm93IGVycm9ycy5pbml0aWFsaXplcihlcnIpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0sIFByb21pc2UucmVzb2x2ZSgpKS50aGVuKCgpID0+IHtcbiAgICAgIGRlYnVnKCd0cmFuc2l0aW9uIHRvIGxldmVsICcgKyB0aGlzLmxldmVsICsgJyBET05FJyk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVidWcoJ3RyYW5zaXRpb24gdG8gbGV2ZWwgJyArIHRoaXMubGV2ZWwgKyAnIEVSUk9SIG9uIHN0ZXAgJyArIHN0ZXApO1xuICAgICAgdGhyb3cgZXJyO1xuICAgIH0pO1xuICB9XG59XG4iXX0=