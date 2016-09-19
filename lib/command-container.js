'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function rpad(v, len, c) {
  v = v.toString();
  c = (c || ' ').toString();
  return v + Array(Math.max(0, len - v.length) + 1).join(c);
}

var CommandContainer = function () {
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

      return new Promise(function (resolve, reject) {
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
}();

exports.default = CommandContainer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6WyJycGFkIiwidiIsImxlbiIsImMiLCJ0b1N0cmluZyIsIkFycmF5IiwiTWF0aCIsIm1heCIsImxlbmd0aCIsImpvaW4iLCJDb21tYW5kQ29udGFpbmVyIiwicHJvZ3JhbU5hbWUiLCJjb21tYW5kcyIsImRlYnVnIiwiY29tbWFuZE5hbWUiLCJjb21tYW5kIiwiRXJyb3IiLCJuYW1lIiwiZXJyIiwibGluZXMiLCJwdXNoIiwicmVkIiwic3RhY2siLCJtZXNzYWdlIiwiY3lhbiIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhIiwiYiIsInNvcnQiLCJmb3JFYWNoIiwibWFnZW50YSIsImdyYXkiLCJkZXNjcmlwdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJFT0wiLCJhcmd2IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1aXJlIiwiYm9vbGVhbiIsIkRFQlVHIiwiXyIsInVzYWdlIiwic2hpZnQiLCJzdWJjb21tYW5kcyIsImV4ZWN1dGUiLCJ0aGVuIiwiY2F0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxTQUFTQSxJQUFULENBQWNDLENBQWQsRUFBaUJDLEdBQWpCLEVBQXNCQyxDQUF0QixFQUF5QjtBQUN2QkYsTUFBSUEsRUFBRUcsUUFBRixFQUFKO0FBQ0FELE1BQUksQ0FBQ0EsS0FBSyxHQUFOLEVBQVdDLFFBQVgsRUFBSjtBQUNBLFNBQU9ILElBQUlJLE1BQU1DLEtBQUtDLEdBQUwsQ0FBUyxDQUFULEVBQVlMLE1BQU1ELEVBQUVPLE1BQXBCLElBQThCLENBQXBDLEVBQXVDQyxJQUF2QyxDQUE0Q04sQ0FBNUMsQ0FBWDtBQUNEOztJQUVvQk8sZ0I7QUFDbkIsNEJBQVlDLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBS0EsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxTQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBS0Ms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R0FBRCxFQUFTO0FBQ2hCLFlBQUlBLElBQUlELElBQUosS0FBYSxZQUFqQixFQUErQjtBQUM3QixpQkFBTyxPQUFLNkIsS0FBTCxDQUFXNUIsR0FBWCxDQUFQO0FBQ0QsU0FGRCxNQUVPLElBQUlBLElBQUlELElBQUosS0FBYSxjQUFqQixFQUFpQztBQUN0Q2tCLGtCQUFRQyxHQUFSLENBQVksZ0JBQU1mLEdBQU4sQ0FBVUgsSUFBSUssT0FBZCxDQUFaO0FBQ0QsU0FGTSxNQUVBO0FBQ0xZLGtCQUFRQyxHQUFSLENBQVksZ0JBQU1mLEdBQU4sQ0FBVUgsSUFBSUksS0FBZCxDQUFaO0FBQ0EsaUJBQU8sR0FBUDtBQUNEO0FBQ0YsT0E5Qk0sQ0FBUDtBQStCRDs7Ozs7O2tCQXpFa0JaLGdCIiwiZmlsZSI6ImNvbW1hbmQtY29udGFpbmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmZ1bmN0aW9uIHJwYWQodiwgbGVuLCBjKSB7XG4gIHYgPSB2LnRvU3RyaW5nKCk7XG4gIGMgPSAoYyB8fCAnICcpLnRvU3RyaW5nKCk7XG4gIHJldHVybiB2ICsgQXJyYXkoTWF0aC5tYXgoMCwgbGVuIC0gdi5sZW5ndGgpICsgMSkuam9pbihjKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZENvbnRhaW5lciB7XG4gIGNvbnN0cnVjdG9yKHByb2dyYW1OYW1lKSB7XG4gICAgdGhpcy5wcm9ncmFtTmFtZSA9IHByb2dyYW1OYW1lO1xuICAgIHRoaXMuY29tbWFuZHMgPSB7fTtcbiAgICB0aGlzLmRlYnVnID0gZmFsc2U7XG4gIH1cblxuICBhZGQoY29tbWFuZE5hbWUsIGNvbW1hbmQpIHtcbiAgICBpZiAodGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0pIHsgdGhyb3cgbmV3IEVycm9yKCdDb21tYW5kICcgKyBjb21tYW5kTmFtZSArICcgaXMgYWxyZWFkeSBkZWZpbmVkJyk7IH1cbiAgICBjb21tYW5kLm5hbWUgPSBjb21tYW5kTmFtZTtcbiAgICB0aGlzLmNvbW1hbmRzW2NvbW1hbmROYW1lXSA9IGNvbW1hbmQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1c2FnZShlcnIpIHtcbiAgICBsZXQgbGluZXMgPSBbJyddO1xuXG4gICAgaWYgKGVycikge1xuICAgICAgbGluZXMucHVzaChjaGFsay5yZWQodGhpcy5kZWJ1ZyA/IGVyci5zdGFjayA6IGVyci5tZXNzYWdlKSwgJycpO1xuICAgIH1cblxuICAgIGxpbmVzLnB1c2goXG4gICAgICBgVXNhZ2U6ICR7Y2hhbGsuY3lhbih0aGlzLnByb2dyYW1OYW1lKX0gW29wdGlvbnNdIFtjb21tYW5kXWAsXG4gICAgICAnJyxcbiAgICAgICdDb21tYW5kczonLFxuICAgICAgJydcbiAgICApO1xuXG4gICAgY29uc3QgbGVuID0gT2JqZWN0LmtleXModGhpcy5jb21tYW5kcykucmVkdWNlKCgoYSwgYikgPT4gTWF0aC5tYXgoYSwgYi5sZW5ndGgpKSwgMCk7XG4gICAgT2JqZWN0LmtleXModGhpcy5jb21tYW5kcykuc29ydCgpLmZvckVhY2goKGNvbW1hbmROYW1lKSA9PiB7XG4gICAgICBjb25zdCBjID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV07XG4gICAgICBsaW5lcy5wdXNoKGAgICR7Y2hhbGsubWFnZW50YShycGFkKGMubmFtZSwgbGVuICsgNSkpfSR7Y2hhbGsuZ3JheShjLmRlc2NyaXB0aW9uKX1gKTtcbiAgICB9KTtcblxuICAgIGxpbmVzLnB1c2goJycpO1xuXG4gICAgY29uc29sZS5sb2cobGluZXMuam9pbihvcy5FT0wpKTtcblxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgZXhlY3V0ZShhcmd2KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGFyZ3YgPSByZXF1aXJlKCdtaW5pbWlzdCcpKGFyZ3YsIHtcbiAgICAgICAgYm9vbGVhbjogWydnJywgJ2dsb2JhbCddXG4gICAgICB9KTtcblxuICAgICAgaWYgKGFyZ3YuREVCVUcpIHtcbiAgICAgICAgdGhpcy5kZWJ1ZyA9IHRydWU7XG4gICAgICAgIGRlbGV0ZSBhcmd2LkRFQlVHO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXJndi5fLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gdGhpcy51c2FnZSgpOyB9XG5cbiAgICAgIGNvbnN0IGNvbW1hbmROYW1lID0gYXJndi5fLnNoaWZ0KCk7XG4gICAgICBjb25zdCBjb21tYW5kID0gdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV07XG5cbiAgICAgIGlmIChjb21tYW5kID09IG51bGwpIHsgcmV0dXJuIHRoaXMudXNhZ2UobmV3IEVycm9yKGBJbnZhbGlkIGNvbW1hbmQ6ICR7Y29tbWFuZE5hbWV9YCkpOyB9XG5cbiAgICAgIGNvbnN0IHN1YmNvbW1hbmRzID0gYXJndi5fO1xuICAgICAgZGVsZXRlIGFyZ3YuXztcblxuICAgICAgcmV0dXJuIHJlc29sdmUoY29tbWFuZC5leGVjdXRlKHN1YmNvbW1hbmRzLCBhcmd2KSkudGhlbigoKSA9PiAwKTtcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyLm5hbWUgPT09ICdVc2FnZUVycm9yJykge1xuICAgICAgICByZXR1cm4gdGhpcy51c2FnZShlcnIpO1xuICAgICAgfSBlbHNlIGlmIChlcnIubmFtZSA9PT0gJ01lc3NhZ2VFcnJvcicpIHtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKGVyci5tZXNzYWdlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmxvZyhjaGFsay5yZWQoZXJyLnN0YWNrKSk7XG4gICAgICAgIHJldHVybiAxMjc7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==