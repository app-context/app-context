'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function rpad(v, len, c) {
  v = v.toString();
  c = (c || ' ').toString();
  return v + Array(Math.max(0, len - v.length) + 1).join(c);
}

var CommandContainer = (function () {
  function CommandContainer(programName) {
    _classCallCheck(this, CommandContainer);

    this.programName = programName;
    this.commands = {};
    this.debug = false;
  }

  _createClass(CommandContainer, [{
    key: 'add',
    value: function add(commandName, command) {
      if (this.commands[commandName]) {
        throw new Error('Command ' + commandName + ' is already defined');
      }
      command.name = commandName;
      this.commands[commandName] = command;
      return this;
    }
  }, {
    key: 'usage',
    value: function usage(err) {
      var _this = this;

      var lines = [''];

      if (err) {
        lines.push(_chalk2['default'].red(this.debug ? err.stack : err.message), '');
      }

      lines.push('Usage: ' + _chalk2['default'].cyan(this.programName) + ' [options] [command]', '', 'Commands:', '');

      var len = Object.keys(this.commands).reduce(function (a, b) {
        return Math.max(a, b.length);
      }, 0);
      Object.keys(this.commands).sort().forEach(function (commandName) {
        var c = _this.commands[commandName];
        lines.push('  ' + _chalk2['default'].magenta(rpad(c.name, len + 5)) + _chalk2['default'].gray(c.description));
      });

      lines.push('');

      console.log(lines.join(_os2['default'].EOL));

      return 1;
    }
  }, {
    key: 'execute',
    value: function execute(argv) {
      var _this2 = this;

      return new _bluebird2['default'](function (resolve, reject) {
        argv = require('minimist')(argv, {
          boolean: ['g', 'global']
        });

        if (argv.DEBUG) {
          _this2.debug = true;
          delete argv.DEBUG;
        }

        if (argv._.length === 0) {
          return _this2.usage();
        }

        var commandName = argv._.shift();
        var command = _this2.commands[commandName];

        if (command == null) {
          return _this2.usage(new Error('Invalid command: ' + commandName));
        }

        var subcommands = argv._;
        delete argv._;

        return resolve(command.execute(subcommands, argv)).then(function () {
          return 0;
        });
      })['catch'](function (err) {
        if (err.name === 'UsageError') {
          return _this2.usage(err);
        } else if (err.name === 'MessageError') {
          console.log(_chalk2['default'].red(err.message));
        } else {
          console.log(_chalk2['default'].red(err.stack));
          return 127;
        }
      });
    }
  }]);

  return CommandContainer;
})();

exports['default'] = CommandContainer;
module.exports = exports['default'];