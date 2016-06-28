'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

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
    key: 'addDirectory',
    value: function addDirectory(dirname) {
      var names = _fs2.default.readdirSync(dirname).filter(function (f) {
        return f.match(/\.js$/);
      }).map(function (f) {
        return f.replace(/\.js$/, '');
      });

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          if (name === 'index') {
            continue;
          }

          var command = require(_path2.default.join(dirname, name));
          if (command.name) {
            this.add(command.name, command);
          } else if (typeof command.usage === 'function') {
            this.add(command.usage().split(' ')[0], command);
          } else {
            this.add(name, command);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'usage',
    value: function usage(err) {
      var _this = this;

      var lines = [''];

      if (err) {
        lines.push((0, _chalk.red)(this.debug ? err.stack : err.message), '');
      }

      lines.push('Usage: ' + (0, _chalk.cyan)(this.programName) + ' [options] [command]', '', 'Commands:', '');

      var len = Object.keys(this.commands).reduce(function (a, b) {
        return Math.max(a, b.length);
      }, 0);
      Object.keys(this.commands).sort().forEach(function (commandName) {
        var c = _this.commands[commandName];
        lines.push('  ' + (0, _chalk.magenta)(rpad(c.name, len + 5)) + (0, _chalk.gray)(c.description));
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
          console.log((0, _chalk.red)(err.message));
        } else {
          console.log((0, _chalk.red)(err.stack));
          return 127;
        }
      });
    }
  }]);

  return CommandContainer;
}();

exports.default = CommandContainer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kLWNvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxTQUFTLElBQVQsQ0FBYyxDQUFkLEVBQWlCLEdBQWpCLEVBQXNCLENBQXRCLEVBQXlCO0FBQ3ZCLE1BQUksRUFBRSxRQUFGLEVBQUo7QUFDQSxNQUFJLENBQUMsS0FBSyxHQUFOLEVBQVcsUUFBWCxFQUFKO0FBQ0EsU0FBTyxJQUFJLE1BQU0sS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLE1BQU0sRUFBRSxNQUFwQixJQUE4QixDQUFwQyxFQUF1QyxJQUF2QyxDQUE0QyxDQUE1QyxDQUFYO0FBQ0Q7O0lBRW9CLGdCO0FBQ25CLDRCQUFZLFdBQVosRUFBeUI7QUFBQTs7QUFDdkIsU0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNEOzs7O3dCQUVHLFcsRUFBYSxPLEVBQVM7QUFDeEIsVUFBSSxLQUFLLFFBQUwsQ0FBYyxXQUFkLENBQUosRUFBZ0M7QUFBRSxjQUFNLElBQUksS0FBSixjQUFxQixXQUFyQix5QkFBTjtBQUErRDtBQUNqRyxjQUFRLElBQVIsR0FBZSxXQUFmO0FBQ0EsV0FBSyxRQUFMLENBQWMsV0FBZCxJQUE2QixPQUE3QjtBQUNBLGFBQU8sSUFBUDtBQUNEOzs7aUNBRVksTyxFQUFTO0FBQ3BCLFVBQU0sUUFBUSxhQUFHLFdBQUgsQ0FBZSxPQUFmLEVBQ1gsTUFEVyxDQUNKO0FBQUEsZUFBSyxFQUFFLEtBQUYsQ0FBUSxPQUFSLENBQUw7QUFBQSxPQURJLEVBRVgsR0FGVyxDQUVQO0FBQUEsZUFBSyxFQUFFLE9BQUYsQ0FBVSxPQUFWLEVBQW1CLEVBQW5CLENBQUw7QUFBQSxPQUZPLENBQWQ7O0FBRG9CO0FBQUE7QUFBQTs7QUFBQTtBQUtwQiw2QkFBbUIsS0FBbkIsOEhBQTBC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RDtBQUFBLGlCQUFNLENBQU47QUFBQSxTQUFqRCxDQUFQO0FBQ0QsT0FyQk0sRUFxQkosS0FyQkksQ0FxQkUsVUFBQyxHQUFELEVBQVM7QUFDaEIsWUFBSSxJQUFJLElBQUosS0FBYSxZQUFqQixFQUErQjtBQUM3QixpQkFBTyxPQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVA7QUFDRCxTQUZELE1BRU8sSUFBSSxJQUFJLElBQUosS0FBYSxjQUFqQixFQUFpQztBQUN0QyxrQkFBUSxHQUFSLENBQVksZ0JBQUksSUFBSSxPQUFSLENBQVo7QUFDRCxTQUZNLE1BRUE7QUFDTCxrQkFBUSxHQUFSLENBQVksZ0JBQUksSUFBSSxLQUFSLENBQVo7QUFDQSxpQkFBTyxHQUFQO0FBQ0Q7QUFDRixPQTlCTSxDQUFQO0FBK0JEOzs7Ozs7a0JBNUZrQixnQiIsImZpbGUiOiJjb21tYW5kLWNvbnRhaW5lci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjeWFuLCBncmF5LCBtYWdlbnRhLCByZWQgfSBmcm9tICdjaGFsayc7XG5cbmZ1bmN0aW9uIHJwYWQodiwgbGVuLCBjKSB7XG4gIHYgPSB2LnRvU3RyaW5nKCk7XG4gIGMgPSAoYyB8fCAnICcpLnRvU3RyaW5nKCk7XG4gIHJldHVybiB2ICsgQXJyYXkoTWF0aC5tYXgoMCwgbGVuIC0gdi5sZW5ndGgpICsgMSkuam9pbihjKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWFuZENvbnRhaW5lciB7XG4gIGNvbnN0cnVjdG9yKHByb2dyYW1OYW1lKSB7XG4gICAgdGhpcy5wcm9ncmFtTmFtZSA9IHByb2dyYW1OYW1lO1xuICAgIHRoaXMuY29tbWFuZHMgPSB7fTtcbiAgICB0aGlzLmRlYnVnID0gZmFsc2U7XG4gIH1cblxuICBhZGQoY29tbWFuZE5hbWUsIGNvbW1hbmQpIHtcbiAgICBpZiAodGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0pIHsgdGhyb3cgbmV3IEVycm9yKGBDb21tYW5kICR7Y29tbWFuZE5hbWV9IGlzIGFscmVhZHkgZGVmaW5lZGApOyB9XG4gICAgY29tbWFuZC5uYW1lID0gY29tbWFuZE5hbWU7XG4gICAgdGhpcy5jb21tYW5kc1tjb21tYW5kTmFtZV0gPSBjb21tYW5kO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYWRkRGlyZWN0b3J5KGRpcm5hbWUpIHtcbiAgICBjb25zdCBuYW1lcyA9IGZzLnJlYWRkaXJTeW5jKGRpcm5hbWUpXG4gICAgICAuZmlsdGVyKGYgPT4gZi5tYXRjaCgvXFwuanMkLykpXG4gICAgICAubWFwKGYgPT4gZi5yZXBsYWNlKC9cXC5qcyQvLCAnJykpO1xuXG4gICAgZm9yIChjb25zdCBuYW1lIG9mIG5hbWVzKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2luZGV4JykgeyBjb250aW51ZTsgfVxuXG4gICAgICBjb25zdCBjb21tYW5kID0gcmVxdWlyZShwYXRoLmpvaW4oZGlybmFtZSwgbmFtZSkpO1xuICAgICAgaWYgKGNvbW1hbmQubmFtZSkge1xuICAgICAgICB0aGlzLmFkZChjb21tYW5kLm5hbWUsIGNvbW1hbmQpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YoY29tbWFuZC51c2FnZSkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5hZGQoY29tbWFuZC51c2FnZSgpLnNwbGl0KCcgJylbMF0sIGNvbW1hbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hZGQobmFtZSwgY29tbWFuZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdXNhZ2UoZXJyKSB7XG4gICAgbGV0IGxpbmVzID0gWycnXTtcblxuICAgIGlmIChlcnIpIHtcbiAgICAgIGxpbmVzLnB1c2gocmVkKHRoaXMuZGVidWcgPyBlcnIuc3RhY2sgOiBlcnIubWVzc2FnZSksICcnKTtcbiAgICB9XG5cbiAgICBsaW5lcy5wdXNoKFxuICAgICAgYFVzYWdlOiAke2N5YW4odGhpcy5wcm9ncmFtTmFtZSl9IFtvcHRpb25zXSBbY29tbWFuZF1gLFxuICAgICAgJycsXG4gICAgICAnQ29tbWFuZHM6JyxcbiAgICAgICcnXG4gICAgKTtcblxuICAgIGNvbnN0IGxlbiA9IE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnJlZHVjZSgoKGEsIGIpID0+IE1hdGgubWF4KGEsIGIubGVuZ3RoKSksIDApO1xuICAgIE9iamVjdC5rZXlzKHRoaXMuY29tbWFuZHMpLnNvcnQoKS5mb3JFYWNoKChjb21tYW5kTmFtZSkgPT4ge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuICAgICAgbGluZXMucHVzaChgICAke21hZ2VudGEocnBhZChjLm5hbWUsIGxlbiArIDUpKX0ke2dyYXkoYy5kZXNjcmlwdGlvbil9YCk7XG4gICAgfSk7XG5cbiAgICBsaW5lcy5wdXNoKCcnKTtcblxuICAgIGNvbnNvbGUubG9nKGxpbmVzLmpvaW4ob3MuRU9MKSk7XG5cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGV4ZWN1dGUoYXJndikge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBhcmd2ID0gcmVxdWlyZSgnbWluaW1pc3QnKShhcmd2LCB7XG4gICAgICAgIGJvb2xlYW46IFsnZycsICdnbG9iYWwnXVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChhcmd2LkRFQlVHKSB7XG4gICAgICAgIHRoaXMuZGVidWcgPSB0cnVlO1xuICAgICAgICBkZWxldGUgYXJndi5ERUJVRztcbiAgICAgIH1cblxuICAgICAgaWYgKGFyZ3YuXy5sZW5ndGggPT09IDApIHsgcmV0dXJuIHRoaXMudXNhZ2UoKTsgfVxuXG4gICAgICBjb25zdCBjb21tYW5kTmFtZSA9IGFyZ3YuXy5zaGlmdCgpO1xuICAgICAgY29uc3QgY29tbWFuZCA9IHRoaXMuY29tbWFuZHNbY29tbWFuZE5hbWVdO1xuXG4gICAgICBpZiAoY29tbWFuZCA9PSBudWxsKSB7IHJldHVybiB0aGlzLnVzYWdlKG5ldyBFcnJvcihgSW52YWxpZCBjb21tYW5kOiAke2NvbW1hbmROYW1lfWApKTsgfVxuXG4gICAgICBjb25zdCBzdWJjb21tYW5kcyA9IGFyZ3YuXztcbiAgICAgIGRlbGV0ZSBhcmd2Ll87XG5cbiAgICAgIHJldHVybiByZXNvbHZlKGNvbW1hbmQuZXhlY3V0ZShzdWJjb21tYW5kcywgYXJndikpLnRoZW4oKCkgPT4gMCk7XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgaWYgKGVyci5uYW1lID09PSAnVXNhZ2VFcnJvcicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudXNhZ2UoZXJyKTtcbiAgICAgIH0gZWxzZSBpZiAoZXJyLm5hbWUgPT09ICdNZXNzYWdlRXJyb3InKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlZChlcnIubWVzc2FnZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVkKGVyci5zdGFjaykpO1xuICAgICAgICByZXR1cm4gMTI3O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG4iXX0=