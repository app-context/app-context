'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

var _appContext = require('./app-context');

var _appContext2 = _interopRequireDefault(_appContext);

var _initializer = require('./initializer');

var _initializer2 = _interopRequireDefault(_initializer);

var debug = require('debug')('app-context:run-level');

var RunLevel = (function () {
  function RunLevel(builder, level) {
    _classCallCheck(this, RunLevel);

    this.builder = builder;
    this.level = level;
    this.name = _appContext2['default'].getRunLevelName(level);
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
        this.initializers.push(_initializer2['default'].createFromModule(this, first, args));
      } else if (typeof first === 'function') {
        this.initializers.push(_initializer2['default'].createFromMethod(this, first, args));
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
          })['catch'](function (err) {
            err.runlevel = _this.level;
            err.runlevelName = _this.name;
            err.step = step;
            err.initializer = initializer;
            debug('transition to level ' + _this.level + ' step ' + step + ' ERROR: ' + err.message);
            throw errors.initializer(err);
          });
        });
      }, _bluebird2['default'].resolve()).then(function () {
        debug('transition to level ' + _this.level + ' DONE');
      })['catch'](function (err) {
        debug('transition to level ' + _this.level + ' ERROR on step ' + step);
        throw err;
      });
    }
  }]);

  return RunLevel;
})();

exports['default'] = RunLevel;
module.exports = exports['default'];