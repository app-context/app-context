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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixHQUFqQixFQUFzQixDQUF0QixFQUF5QjtBQUN2QixNQUFJLEVBQUUsUUFBRixFQUFKO0FBQ0EsTUFBSSxDQUFDLEtBQUssR0FBTixFQUFXLFFBQVgsRUFBSjtBQUNBLFNBQU8sSUFBSSxNQUFNLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxNQUFNLEVBQUUsTUFBcEIsSUFBOEIsQ0FBcEMsRUFBdUMsSUFBdkMsQ0FBNEMsQ0FBNUMsQ0FBWDtBQUNEOztJQUVvQixnQjtBQUNuQiw0QkFBWSxXQUFaLEVBQXlCO0FBQUE7O0FBQ3ZCLFNBQUssV0FBTCxHQUFtQixXQUFuQjtBQUNBLFNBQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDRDs7Ozt3QkFFRyxXLEVBQWEsTyxFQUFTO0FBQ3hCLFVBQUksS0FBSyxRQUFMLENBQWMsV0FBZCxDQUFKLEVBQWdDO0FBQUUsY0FBTSxJQUFJLEtBQUosQ0FBVSxhQUFhLFdBQWIsR0FBMkIscUJBQXJDLENBQU47QUFBb0U7QUFDdEcsY0FBUSxJQUFSLEdBQWUsV0FBZjtBQUNBLFdBQUssUUFBTCxDQUFjLFdBQWQsSUFBNkIsT0FBN0I7QUFDQSxhQUFPLElBQVA7QUFDRDs7OzBCQUVLLEcsRUFBSztBQUFBOztBQUNULFVBQUksUUFBUSxDQUFDLEVBQUQsQ0FBWjs7QUFFQSxVQUFJLEdBQUosRUFBUztBQUNQLGNBQU0sSUFBTixDQUFXLGdCQUFNLEdBQU4sQ0FBVSxLQUFLLEtBQUwsR0FBYSxJQUFJLEtBQWpCLEdBQXlCLElBQUksT0FBdkMsQ0FBWCxFQUE0RCxFQUE1RDtBQUNEOztBQUVELFlBQU0sSUFBTixhQUNZLGdCQUFNLElBQU4sQ0FBVyxLQUFLLFdBQWhCLENBRFosMkJBRUUsRUFGRixFQUdFLFdBSEYsRUFJRSxFQUpGOztBQU9BLFVBQU0sTUFBTSxPQUFPLElBQVAsQ0FBWSxLQUFLLFFBQWpCLEVBQTJCLE1BQTNCLENBQW1DLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxlQUFVLEtBQUssR0FBTCxDQUFTLENBQVQsRUFBWSxFQUFFLE1BQWQsQ0FBVjtBQUFBLE9BQW5DLEVBQXFFLENBQXJFLENBQVo7QUFDQSxhQUFPLElBQVAsQ0FBWSxLQUFLLFFBQWpCLEVBQTJCLElBQTNCLEdBQWtDLE9BQWxDLENBQTBDLFVBQUMsV0FBRCxFQUFpQjtBQUN6RCxZQUFNLElBQUksTUFBSyxRQUFMLENBQWMsV0FBZCxDQUFWO0FBQ0EsY0FBTSxJQUFOLFFBQWdCLGdCQUFNLE9BQU4sQ0FBYyxLQUFLLEVBQUUsSUFBUCxFQUFhLE1BQU0sQ0FBbkIsQ0FBZCxDQUFoQixHQUF1RCxnQkFBTSxJQUFOLENBQVcsRUFBRSxXQUFiLENBQXZEO0FBQ0QsT0FIRDs7QUFLQSxZQUFNLElBQU4sQ0FBVyxFQUFYOztBQUVBLGNBQVEsR0FBUixDQUFZLE1BQU0sSUFBTixDQUFXLGFBQUcsR0FBZCxDQUFaOztBQUVBLGFBQU8sQ0FBUDtBQUNEOzs7NEJBRU8sSSxFQUFNO0FBQUE7O0FBQ1osYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLGVBQU8sUUFBUSxVQUFSLEVBQW9CLElBQXBCLEVBQTBCO0FBQy9CLG1CQUFTLENBQUMsR0FBRCxFQUFNLFFBQU47QUFEc0IsU0FBMUIsQ0FBUDs7QUFJQSxZQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNkLGlCQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0EsaUJBQU8sS0FBSyxLQUFaO0FBQ0Q7O0FBRUQsWUFBSSxLQUFLLENBQUwsQ0FBTyxNQUFQLEtBQWtCLENBQXRCLEVBQXlCO0FBQUUsaUJBQU8sT0FBSyxLQUFMLEVBQVA7QUFBc0I7O0FBRWpELFlBQU0sY0FBYyxLQUFLLENBQUwsQ0FBTyxLQUFQLEVBQXBCO0FBQ0EsWUFBTSxVQUFVLE9BQUssUUFBTCxDQUFjLFdBQWQsQ0FBaEI7O0FBRUEsWUFBSSxXQUFXLElBQWYsRUFBcUI7QUFBRSxpQkFBTyxPQUFLLEtBQUwsQ0FBVyxJQUFJLEtBQUosdUJBQThCLFdBQTlCLENBQVgsQ0FBUDtBQUFrRTs7QUFFekYsWUFBTSxjQUFjLEtBQUssQ0FBekI7QUFDQSxlQUFPLEtBQUssQ0FBWjs7QUFFQSxlQUFPLFFBQVEsUUFBUSxPQUFSLENBQWdCLFdBQWhCLEVBQTZCLElBQTdCLENBQVIsRUFBNEMsSUFBNUMsQ0FBaUQ7QUFBQSxpQkFBTSxDQUFOO0FBQUEsU0FBakQsQ0FBUDtBQUNELE9BckJNLEVBcUJKLEtBckJJLENBcUJFLFVBQUMsR0FBRCxFQUFTO0FBQ2hCLFlBQUksSUFBSSxJQUFKLEtBQWEsWUFBakIsRUFBK0I7QUFDN0IsaUJBQU8sT0FBSyxLQUFMLENBQVcsR0FBWCxDQUFQO0FBQ0QsU0FGRCxNQUVPLElBQUksSUFBSSxJQUFKLEtBQWEsY0FBakIsRUFBaUM7QUFDdEMsa0JBQVEsR0FBUixDQUFZLGdCQUFNLEdBQU4sQ0FBVSxJQUFJLE9BQWQsQ0FBWjtBQUNELFNBRk0sTUFFQTtBQUNMLGtCQUFRLEdBQVIsQ0FBWSxnQkFBTSxHQUFOLENBQVUsSUFBSSxLQUFkLENBQVo7QUFDQSxpQkFBTyxHQUFQO0FBQ0Q7QUFDRixPQTlCTSxDQUFQO0FBK0JEOzs7Ozs7a0JBekVrQixnQiIsImZpbGUiOiJjb21tYW5kLWNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuXG5mdW5jdGlvbiBycGFkKHYsIGxlbiwgYykge1xuICB2ID0gdi50b1N0cmluZygpO1xuICBjID0gKGMgfHwgJyAnKS50b1N0cmluZygpO1xuICByZXR1cm4gdiArIEFycmF5KE1hdGgubWF4KDAsIGxlbiAtIHYubGVuZ3RoKSArIDEpLmpvaW4oYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRDb250YWluZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9ncmFtTmFtZSkge1xuICAgIHRoaXMucHJvZ3JhbU5hbWUgPSBwcm9ncmFtTmFtZTtcbiAgICB0aGlzLmNvbW1hbmRzID0ge307XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICB9XG5cbiAgYWRkKGNvbW1hbmROYW1lLCBjb21tYW5kKSB7XG4gICAgaWYgKHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdKSB7IHRocm93IG5ldyBFcnJvcignQ29tbWFuZCAnICsgY29tbWFuZE5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCcpOyB9XG4gICAgY29tbWFuZC5uYW1lID0gY29tbWFuZE5hbWU7XG4gICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSBjb21tYW5kO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXNhZ2UoZXJyKSB7XG4gICAgbGV0IGxpbmVzID0gWycnXTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGxpbmVzLnB1c2goY2hhbGsucmVkKHRoaXMuZGVidWcgPyBlcnIuc3RhY2sgOiBlcnIubWVzc2FnZSksICcnKTtcbiAgICB9XG5cbiAgICBsaW5lcy5wdXNoKFxuICAgICAgYFVzYWdlOiAke2NoYWxrLmN5YW4odGhpcy5wcm9ncmFtTmFtZSl9IFtvcHRpb25zXSBbY29tbWFuZF1gLFxuICAgICAgJycsXG4gICAgICAnQ29tbWFuZHM6JyxcbiAgICAgICcnXG4gICAgKTtcblxuICAgIGNvbnN0IGxlbiA9IE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnJlZHVjZSgoKGEsIGIpID0+IE1hdGgubWF4KGEsIGIubGVuZ3RoKSksIDApO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnNvcnQoKS5mb3JFYWNoKChjb21tYW5kTmFtZSkgPT4ge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuICAgICAgbGluZXMucHVzaChgICAke2NoYWxrLm1hZ2VudGEocnBhZChjLm5hbWUsIGxlbiArIDUpKX0ke2NoYWxrLmdyYXkoYy5kZXNjcmlwdGlvbil9YCk7XG4gICAgfSk7XG5cbiAgICBsaW5lcy5wdXNoKCcnKTtcblxuICAgIGNvbnNvbGUubG9nKGxpbmVzLmpvaW4ob3MuRU9MKSk7XG5cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGV4ZWN1dGUoYXJndikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBhcmd2ID0gcmVxdWlyZSgnbWluaW1pc3QnKShhcmd2LCB7XG4gICAgICAgIGJvb2xlYW46IFsnZycsICdnbG9iYWwnXVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhcmd2LkRFQlVHKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgICAgICBkZWxldGUgYXJndi5ERUJVRztcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3YuXy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRoaXMudXNhZ2UoKTsgfVxuXG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGFyZ3YuXy5zaGlmdCgpO1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuXG4gICAgICBpZiAoY29tbWFuZCA9PSBudWxsKSB7IHJldHVybiB0aGlzLnVzYWdlKG5ldyBFcnJvcihgSW52YWxpZCBjb21tYW5kOiAke2NvbW1hbmROYW1lfWApKTsgfVxuXG4gICAgICBjb25zdCBzdWJjb21tYW5kcyA9IGFyZ3YuXztcbiAgICAgIGRlbGV0ZSBhcmd2Ll87XG5cbiAgICAgIHJldHVybiByZXNvbHZlKGNvbW1hbmQuZXhlY3V0ZShzdWJjb21tYW5kcywgYXJndikpLnRoZW4oKCkgPT4gMCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5uYW1lID09PSAnVXNhZ2VFcnJvcicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNhZ2UoZXJyKTtcbiAgICAgIH0gZWxzZSBpZiAoZXJyLm5hbWUgPT09ICdNZXNzYWdlRXJyb3InKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZChlcnIubWVzc2FnZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKGVyci5zdGFjaykpO1xuICAgICAgICByZXR1cm4gMTI3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=