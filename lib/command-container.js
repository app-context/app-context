'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        lines.push(_chalk2.default.red(this.debug ? err.stack : err.message), '');
      }

      lines.push('Usage: ' + _chalk2.default.cyan(this.programName) + ' [options] [command]', '', 'Commands:', '');

      var len = Object.keys(this.commands).reduce(function (a, b) {
        return Math.max(a, b.length);
      }, 0);
      Object.keys(this.commands).sort().forEach(function (commandName) {
        var c = _this.commands[commandName];
        lines.push('  ' + _chalk2.default.magenta(rpad(c.name, len + 5)) + _chalk2.default.gray(c.description));
      });

      lines.push('');

      console.log(lines.join(_os2.default.EOL));

      return 1;
    }
  }, {
    key: 'execute',
    value: function execute(argv) {
      var _this2 = this;

      return new _bluebird2.default(function (resolve, reject) {
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
      }).catch(function (err) {
        if (err.name === 'UsageError') {
          return _this2.usage(err);
        } else if (err.name === 'MessageError') {
          console.log(_chalk2.default.red(err.message));
        } else {
          console.log(_chalk2.default.red(err.stack));
          return 127;
        }
      });
    }
  }]);

  return CommandContainer;
})();

exports.default = CommandContainer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxTQUFTLElBQUksQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUN2QixHQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pCLEdBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQztBQUMxQixTQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDM0Q7O0lBRW9CLGdCQUFnQjtBQUNuQyxXQURtQixnQkFBZ0IsQ0FDdkIsV0FBVyxFQUFFOzBCQUROLGdCQUFnQjs7QUFFakMsUUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDL0IsUUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7QUFDbkIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7O2VBTGtCLGdCQUFnQjs7d0JBTy9CLFdBQVcsRUFBRSxPQUFPLEVBQUU7QUFDeEIsVUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxFQUFFO0FBQUUsY0FBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxHQUFHLHFCQUFxQixDQUFDLENBQUM7T0FBRTtBQUN0RyxhQUFPLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUMzQixVQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUNyQyxhQUFPLElBQUksQ0FBQztLQUNiOzs7MEJBRUssR0FBRyxFQUFFOzs7QUFDVCxVQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFD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TyxDQUFDLEdBQUcsQ0FBQyxnQkFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDckMsTUFBTTtBQUNMLGlCQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsQyxpQkFBTyxHQUFHLENBQUM7U0FDWjtPQUNGLENBQUMsQ0FBQztLQUNKOzs7U0F6RWtCLGdCQUFnQjs7O2tCQUFoQixnQkFBZ0IiLCJmaWxlIjoiY29tbWFuZC1jb250YWluZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGNoYWxrIGZyb20gJ2NoYWxrJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcblxuZnVuY3Rpb24gcnBhZCh2LCBsZW4sIGMpIHtcbiAgdiA9IHYudG9TdHJpbmcoKTtcbiAgYyA9IChjIHx8ICcgJykudG9TdHJpbmcoKTtcbiAgcmV0dXJuIHYgKyBBcnJheShNYXRoLm1heCgwLCBsZW4gLSB2Lmxlbmd0aCkgKyAxKS5qb2luKGMpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb21tYW5kQ29udGFpbmVyIHtcbiAgY29uc3RydWN0b3IocHJvZ3JhbU5hbWUpIHtcbiAgICB0aGlzLnByb2dyYW1OYW1lID0gcHJvZ3JhbU5hbWU7XG4gICAgdGhpcy5jb21tYW5kcyA9IHt9O1xuICAgIHRoaXMuZGVidWcgPSBmYWxzZTtcbiAgfVxuXG4gIGFkZChjb21tYW5kTmFtZSwgY29tbWFuZCkge1xuICAgIGlmICh0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXSkgeyB0aHJvdyBuZXcgRXJyb3IoJ0NvbW1hbmQgJyArIGNvbW1hbmROYW1lICsgJyBpcyBhbHJlYWR5IGRlZmluZWQnKTsgfVxuICAgIGNvbW1hbmQubmFtZSA9IGNvbW1hbmROYW1lO1xuICAgIHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdID0gY29tbWFuZDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVzYWdlKGVycikge1xuICAgIGxldCBsaW5lcyA9IFsnJ107XG5cbiAgICBpZiAoZXJyKSB7XG4gICAgICBsaW5lcy5wdXNoKGNoYWxrLnJlZCh0aGlzLmRlYnVnID8gZXJyLnN0YWNrIDogZXJyLm1lc3NhZ2UpLCAnJyk7XG4gICAgfVxuXG4gICAgbGluZXMucHVzaChcbiAgICAgIGBVc2FnZTogJHtjaGFsay5jeWFuKHRoaXMucHJvZ3JhbU5hbWUpfSBbb3B0aW9uc10gW2NvbW1hbmRdYCxcbiAgICAgICcnLFxuICAgICAgJ0NvbW1hbmRzOicsXG4gICAgICAnJ1xuICAgICk7XG5cbiAgICBjb25zdCBsZW4gPSBPYmplY3Qua2V5cyh0aGlzLmNvbW1hbmRzKS5yZWR1Y2UoKChhLCBiKSA9PiBNYXRoLm1heChhLCBiLmxlbmd0aCkpLCAwKTtcbiAgICBPYmplY3Qua2V5cyh0aGlzLmNvbW1hbmRzKS5zb3J0KCkuZm9yRWFjaCgoY29tbWFuZE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGMgPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXTtcbiAgICAgIGxpbmVzLnB1c2goYCAgJHtjaGFsay5tYWdlbnRhKHJwYWQoYy5uYW1lLCBsZW4gKyA1KSl9JHtjaGFsay5ncmF5KGMuZGVzY3JpcHRpb24pfWApO1xuICAgIH0pO1xuXG4gICAgbGluZXMucHVzaCgnJyk7XG5cbiAgICBjb25zb2xlLmxvZyhsaW5lcy5qb2luKG9zLkVPTCkpO1xuXG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBleGVjdXRlKGFyZ3YpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgYXJndiA9IHJlcXVpcmUoJ21pbmltaXN0JykoYXJndiwge1xuICAgICAgICBib29sZWFuOiBbJ2cnLCAnZ2xvYmFsJ11cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoYXJndi5ERUJVRykge1xuICAgICAgICB0aGlzLmRlYnVnID0gdHJ1ZTtcbiAgICAgICAgZGVsZXRlIGFyZ3YuREVCVUc7XG4gICAgICB9XG5cbiAgICAgIGlmIChhcmd2Ll8ubGVuZ3RoID09PSAwKSB7IHJldHVybiB0aGlzLnVzYWdlKCk7IH1cblxuICAgICAgY29uc3QgY29tbWFuZE5hbWUgPSBhcmd2Ll8uc2hpZnQoKTtcbiAgICAgIGNvbnN0IGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXTtcblxuICAgICAgaWYgKGNvbW1hbmQgPT0gbnVsbCkgeyByZXR1cm4gdGhpcy51c2FnZShuZXcgRXJyb3IoYEludmFsaWQgY29tbWFuZDogJHtjb21tYW5kTmFtZX1gKSk7IH1cblxuICAgICAgY29uc3Qgc3ViY29tbWFuZHMgPSBhcmd2Ll87XG4gICAgICBkZWxldGUgYXJndi5fO1xuXG4gICAgICByZXR1cm4gcmVzb2x2ZShjb21tYW5kLmV4ZWN1dGUoc3ViY29tbWFuZHMsIGFyZ3YpKS50aGVuKCgpID0+IDApO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIubmFtZSA9PT0gJ1VzYWdlRXJyb3InKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnVzYWdlKGVycik7XG4gICAgICB9IGVsc2UgaWYgKGVyci5uYW1lID09PSAnTWVzc2FnZUVycm9yJykge1xuICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoZXJyLm1lc3NhZ2UpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZChlcnIuc3RhY2spKTtcbiAgICAgICAgcmV0dXJuIDEyNztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuIl19