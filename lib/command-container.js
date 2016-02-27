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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdBLFNBQVMsSUFBVCxDQUFjLENBQWQsRUFBaUIsR0FBakIsRUFBc0IsQ0FBdEIsRUFBeUI7QUFDdkIsTUFBSSxFQUFFLFFBQUYsRUFBSixDQUR1QjtBQUV2QixNQUFJLENBQUMsS0FBSyxHQUFMLENBQUQsQ0FBVyxRQUFYLEVBQUosQ0FGdUI7QUFHdkIsU0FBTyxJQUFJLE1BQU0sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sRUFBRSxNQUFGLENBQWxCLEdBQThCLENBQTlCLENBQU4sQ0FBdUMsSUFBdkMsQ0FBNEMsQ0FBNUMsQ0FBSixDQUhnQjtDQUF6Qjs7SUFNcUI7QUFDbkIsV0FEbUIsZ0JBQ25CLENBQVksV0FBWixFQUF5QjswQkFETixrQkFDTTs7QUFDdkIsU0FBSyxXQUFMLEdBQW1CLFdBQW5CLENBRHVCO0FBRXZCLFNBQUssUUFBTCxHQUFnQixFQUFoQixDQUZ1QjtBQUd2QixTQUFLLEtBQUwsR0FBYSxLQUFiLENBSHVCO0dBQXpCOztlQURtQjs7d0JBT2YsYUFBYSxTQUFTO0FBQ3hCLFVBQUksS0FBSyxRQUFMLENBQWMsV0FBZCxDQUFKLEVBQWdDO0FBQUUsY0FBTSxJQUFJLEtBQUosQ0FBVSxhQUFhLFdBQWIsR0FBMkIscUJBQTNCLENBQWhCLENBQUY7T0FBaEM7QUFDQSxjQUFRLElBQVIsR0FBZSxXQUFmLENBRndCO0FBR3hCLFdBQUssUUFBTCxDQUFjLFdBQWQsSUFBNkIsT0FBN0IsQ0FId0I7QUFJeEIsYUFBTyxJQUFQLENBSndCOzs7OzBCQU9wQixLQUFLOzs7QUFDVCxVQUFJLFFBQVEsQ0FBQyxFQUFELENBQVIsQ0FESzs7QUFHVCxVQUFJLEdBQUosRUFBUztBQUNQLGNBQU0sSUFBTixDQUFXLGdCQUFNLEdBQU4sQ0FBVSxLQUFLLEtBQUwsR0FBYSxJQUFJLEtBQUosR0FBWSxJQUFJLE9BQUosQ0FBOUMsRUFBNEQsRUFBNUQsRUFETztPQUFUOztBQUlBLFlBQU0sSUFBTixhQUNZLGdCQUFNLElBQU4sQ0FBVyxLQUFLLFdBQUwsMEJBRHZCLEVBRUUsRUFGRixFQUdFLFdBSEYsRUFJRSxFQUpGLEVBUFM7O0FBY1QsVUFBTSxNQUFNLE9BQU8sSUFBUCxDQUFZLEtBQUssUUFBTCxDQUFaLENBQTJCLE1BQTNCLENBQW1DLFVBQUMsQ0FBRCxFQUFJLENBQUo7ZUFBVSxLQUFLLEdBQUwsQ0FBUyxDQUFULEVBQVksRUFBRSxNQUFGO09BQXRCLEVBQWtDLENBQXJFLENBQU4sQ0FkRztBQWVULGFBQU8sSUFBUCxDQUFZLEtBQUssUUFBTCxDQUFaLENBQTJCLElBQTNCLEdBQWtDLE9BQWxDLENBQTBDLFVBQUMsV0FBRCxFQUFpQjtBQUN6RCxZQUFNLElBQUksTUFBSyxRQUFMLENBQWMsV0FBZCxDQUFKLENBRG1EO0FBRXpELGNBQU0sSUFBTixRQUFnQixnQkFBTSxPQUFOLENBQWMsS0FBSyxFQUFFLElBQUYsRUFBUSxNQUFNLENBQU4sQ0FBM0IsSUFBdUMsZ0JBQU0sSUFBTixDQUFXLEVBQUUsV0FBRixDQUFsRSxFQUZ5RDtPQUFqQixDQUExQyxDQWZTOztBQW9CVCxZQUFNLElBQU4sQ0FBVyxFQUFYLEVBcEJTOztBQXNCVCxjQUFRLEdBQVIsQ0FBWSxNQUFNLElBQU4sQ0FBVyxhQUFHLEdBQUgsQ0FBdkIsRUF0QlM7O0FBd0JULGFBQU8sQ0FBUCxDQXhCUzs7Ozs0QkEyQkgsTUFBTTs7O0FBQ1osYUFBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLGVBQU8sUUFBUSxVQUFSLEVBQW9CLElBQXBCLEVBQTBCO0FBQy9CLG1CQUFTLENBQUMsR0FBRCxFQUFNLFFBQU4sQ0FBVDtTQURLLENBQVAsQ0FEc0M7O0FBS3RDLFlBQUksS0FBSyxLQUFMLEVBQVk7QUFDZCxpQkFBSyxLQUFMLEdBQWEsSUFBYixDQURjO0FBRWQsaUJBQU8sS0FBSyxLQUFMLENBRk87U0FBaEI7O0FBS0EsWUFBSSxLQUFLLENBQUwsQ0FBTyxNQUFQLEtBQWtCLENBQWxCLEVBQXFCO0FBQUUsaUJBQU8sT0FBSyxLQUFMLEVBQVAsQ0FBRjtTQUF6Qjs7QUFFQSxZQUFNLGNBQWMsS0FBSyxDQUFMLENBQU8sS0FBUCxFQUFkLENBWmdDO0FBYXRDLFlBQU0sVUFBVSxPQUFLLFFBQUwsQ0FBYyxXQUFkLENBQVYsQ0FiZ0M7O0FBZXRDLFlBQUksV0FBVyxJQUFYLEVBQWlCO0FBQUUsaUJBQU8sT0FBSyxLQUFMLENBQVcsSUFBSSxLQUFKLHVCQUE4QixXQUE5QixDQUFYLENBQVAsQ0FBRjtTQUFyQjs7QUFFQSxZQUFNLGNBQWMsS0FBSyxDQUFMLENBakJrQjtBQWtCdEMsZUFBTyxLQUFLLENBQUwsQ0FsQitCOztBQW9CdEMsZUFBTyxRQUFRLFFBQVEsT0FBUixDQUFnQixXQUFoQixFQUE2QixJQUE3QixDQUFSLEVBQTRDLElBQTVDLENBQWlEO2lCQUFNO1NBQU4sQ0FBeEQsQ0FwQnNDO09BQXJCLENBQVosQ0FxQkosS0FyQkksQ0FxQkUsVUFBQyxHQUFELEVBQVM7QUFDaEIsWUFBSSxJQUFJLElBQUosS0FBYSxZQUFiLEVBQTJCO0FBQzdCLGlCQUFPLE9BQUssS0FBTCxDQUFXLEdBQVgsQ0FBUCxDQUQ2QjtTQUEvQixNQUVPLElBQUksSUFBSSxJQUFKLEtBQWEsY0FBYixFQUE2QjtBQUN0QyxrQkFBUSxHQUFSLENBQVksZ0JBQU0sR0FBTixDQUFVLElBQUksT0FBSixDQUF0QixFQURzQztTQUFqQyxNQUVBO0FBQ0wsa0JBQVEsR0FBUixDQUFZLGdCQUFNLEdBQU4sQ0FBVSxJQUFJLEtBQUosQ0FBdEIsRUFESztBQUVMLGlCQUFPLEdBQVAsQ0FGSztTQUZBO09BSEEsQ0FyQlQsQ0FEWTs7OztTQXpDSyIsImZpbGUiOiJjb21tYW5kLWNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuXG5mdW5jdGlvbiBycGFkKHYsIGxlbiwgYykge1xuICB2ID0gdi50b1N0cmluZygpO1xuICBjID0gKGMgfHwgJyAnKS50b1N0cmluZygpO1xuICByZXR1cm4gdiArIEFycmF5KE1hdGgubWF4KDAsIGxlbiAtIHYubGVuZ3RoKSArIDEpLmpvaW4oYyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbW1hbmRDb250YWluZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9ncmFtTmFtZSkge1xuICAgIHRoaXMucHJvZ3JhbU5hbWUgPSBwcm9ncmFtTmFtZTtcbiAgICB0aGlzLmNvbW1hbmRzID0ge307XG4gICAgdGhpcy5kZWJ1ZyA9IGZhbHNlO1xuICB9XG5cbiAgYWRkKGNvbW1hbmROYW1lLCBjb21tYW5kKSB7XG4gICAgaWYgKHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdKSB7IHRocm93IG5ldyBFcnJvcignQ29tbWFuZCAnICsgY29tbWFuZE5hbWUgKyAnIGlzIGFscmVhZHkgZGVmaW5lZCcpOyB9XG4gICAgY29tbWFuZC5uYW1lID0gY29tbWFuZE5hbWU7XG4gICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSBjb21tYW5kO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdXNhZ2UoZXJyKSB7XG4gICAgbGV0IGxpbmVzID0gWycnXTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGxpbmVzLnB1c2goY2hhbGsucmVkKHRoaXMuZGVidWcgPyBlcnIuc3RhY2sgOiBlcnIubWVzc2FnZSksICcnKTtcbiAgICB9XG5cbiAgICBsaW5lcy5wdXNoKFxuICAgICAgYFVzYWdlOiAke2NoYWxrLmN5YW4odGhpcy5wcm9ncmFtTmFtZSl9IFtvcHRpb25zXSBbY29tbWFuZF1gLFxuICAgICAgJycsXG4gICAgICAnQ29tbWFuZHM6JyxcbiAgICAgICcnXG4gICAgKTtcblxuICAgIGNvbnN0IGxlbiA9IE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnJlZHVjZSgoKGEsIGIpID0+IE1hdGgubWF4KGEsIGIubGVuZ3RoKSksIDApO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnNvcnQoKS5mb3JFYWNoKChjb21tYW5kTmFtZSkgPT4ge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuICAgICAgbGluZXMucHVzaChgICAke2NoYWxrLm1hZ2VudGEocnBhZChjLm5hbWUsIGxlbiArIDUpKX0ke2NoYWxrLmdyYXkoYy5kZXNjcmlwdGlvbil9YCk7XG4gICAgfSk7XG5cbiAgICBsaW5lcy5wdXNoKCcnKTtcblxuICAgIGNvbnNvbGUubG9nKGxpbmVzLmpvaW4ob3MuRU9MKSk7XG5cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGV4ZWN1dGUoYXJndikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBhcmd2ID0gcmVxdWlyZSgnbWluaW1pc3QnKShhcmd2LCB7XG4gICAgICAgIGJvb2xlYW46IFsnZycsICdnbG9iYWwnXVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhcmd2LkRFQlVHKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgICAgICBkZWxldGUgYXJndi5ERUJVRztcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3YuXy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRoaXMudXNhZ2UoKTsgfVxuXG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGFyZ3YuXy5zaGlmdCgpO1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuXG4gICAgICBpZiAoY29tbWFuZCA9PSBudWxsKSB7IHJldHVybiB0aGlzLnVzYWdlKG5ldyBFcnJvcihgSW52YWxpZCBjb21tYW5kOiAke2NvbW1hbmROYW1lfWApKTsgfVxuXG4gICAgICBjb25zdCBzdWJjb21tYW5kcyA9IGFyZ3YuXztcbiAgICAgIGRlbGV0ZSBhcmd2Ll87XG5cbiAgICAgIHJldHVybiByZXNvbHZlKGNvbW1hbmQuZXhlY3V0ZShzdWJjb21tYW5kcywgYXJndikpLnRoZW4oKCkgPT4gMCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5uYW1lID09PSAnVXNhZ2VFcnJvcicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNhZ2UoZXJyKTtcbiAgICAgIH0gZWxzZSBpZiAoZXJyLm5hbWUgPT09ICdNZXNzYWdlRXJyb3InKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGNoYWxrLnJlZChlcnIubWVzc2FnZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2coY2hhbGsucmVkKGVyci5zdGFjaykpO1xuICAgICAgICByZXR1cm4gMTI3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=