'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.start = start;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _vm = require('vm');

var _vm2 = _interopRequireDefault(_vm);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _hasAnsi = require('has-ansi');

var _hasAnsi2 = _interopRequireDefault(_hasAnsi);

var _readline = require('readline');

var _readline2 = _interopRequireDefault(_readline);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rpad(value, len, char) {
  value = value.toString();
  char = (char || ' ').toString();
  return value + Array(Math.max(0, len - value.length) + 1).join(char);
}

function prefixLine(prefix, color) {
  return function (line) {
    return _chalk2.default[color](prefix) + ':  ' + line;
  };
}

function start(opts) {
  var setPrompt = _readline2.default.Interface.prototype.setPrompt;
  _readline2.default.Interface.prototype.setPrompt = function () {
    if (arguments.length === 1 && (0, _hasAnsi2.default)(arguments[0])) {
      return setPrompt.call(this, arguments[0], (0, _stripAnsi2.default)(arguments[0]).length);
    } else {
      return setPrompt.apply(this, arguments);
    }
  };

  if (!opts.context) opts.context = {};

  if (!opts.prompt) opts.prompt = (opts.name ? opts.name.toLowerCase() : 'console') + ' > ';
  opts.prompt = _chalk2.default.cyan(opts.prompt);

  var lines = ['', 'Welcome to the ' + _chalk2.default.cyan(opts.name) + ' REPL!', '  version:     ' + _chalk2.default.cyan(opts.version), '  environment: ' + _chalk2.default.cyan(opts.environment)];

  lines.push('', '== Objects ==', '  ' + _chalk2.default.magenta('APP') + '            Your initialized app-context', '  ' + _chalk2.default.magenta('$$') + '             Result of last promise', '', '== Commands ==', '  ' + _chalk2.default.magenta('.exit') + '          Exit this REPL', '');

  console.log(lines.map(prefixLine(opts.name.toLowerCase(), 'cyan')).join(_os2.default.EOL));

  function formatError(err) {
    return err.stack.split(_os2.default.EOL).map(prefixLine(opts.name.toLowerCase(), 'red')).join(_os2.default.EOL);
  }
  function printError(err) {
    console.log(formatError(err));
  }

  process.on('uncaughtException', printError);

  var magic = new require('repl').REPLServer('', new _stream2.default.PassThrough());

  Object.keys(opts.context).forEach(function (k) {
    return magic.context[key] = opts.context[key];
  });

  var repl = require('repl').start({
    prompt: _chalk2.default.cyan(opts.prompt),
    eval: function _eval(code, context, file, callback) {
      // don't run blank lines
      /* jshint evil:true */
      if (code.replace(/ *\n */g, '') === '()') {
        return callback(null, undefined);
      }

      magic.eval(code, context, file, function (err, result) {
        // maybe check on context?
        if (err) return callback(null, err);
        _bluebird2.default.resolve(result).then(function (data) {
          context.$$ = (0, _clone2.default)(data);
          callback(null, data);
        }, callback);
      });
    },
    writer: function writer(object, options) {
      if (typeof object === 'undefined') return _chalk2.default.gray(undefined);
      if (object === null) return _chalk2.default.gray(null);

      if (_util2.default.isError(object)) {
        return formatError(object);
      }

      var text = undefined;
      if ((0, _lodash2.default)(object)) {
        text = (0, _jsonStringifySafe2.default)((0, _utils.orderObject)(object), null, 2);
      } else if (typeof object === 'function') {
        text = object.toString();
      } else {
        text = _util2.default.format(object);
      }

      return text.split(_os2.default.EOL).map(prefixLine(opts.name.toLowerCase(), 'cyan')).join(_os2.default.EOL);
    }
  });

  repl.context.$_ = function (err, data) {
    if (err) {
      return printError(err);
    }
    if (arguments.length > 2) {
      console.log(Array.prototype.slice.call(arguments, 1));
    } else {
      console.log(data);
    }
  };

  return new _bluebird2.default(function (resolve, reject) {
    repl.on('exit', resolve);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvY29uc29sZS9jb25zb2xlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBNkJnQixLQUFLLEdBQUwsS0FBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFackIsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDOUIsT0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN6QixNQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFBLENBQUUsUUFBUSxFQUFFLENBQUM7QUFDaEMsU0FBTyxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3RFOztBQUVELFNBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDakMsU0FBTyxVQUFTLElBQUksRUFBRTtBQUNwQixXQUFPLGdCQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDNUMsQ0FBQztDQUNIOztBQUVNLFNBQVMsS0FBSyxDQUFDLElBQUksRUFBRTtBQUMxQixNQUFNLFNBQVMsR0FBRyxtQkFBUyxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQztBQUN6RCxxQkFBUyxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFXO0FBQ2xELFFBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksdUJBQVEsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbkQsYUFBTyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUseUJB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Qjs7QUFFRCxhQUFPLElBQUksQ0FDUixLQUFLLENBQUMsYUFBRyxHQUFHLENBQUMsQ0FDYixHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FDaEQsSUFBSSxDQUFDLGFBQUcsR0FBRyxDQUFDLENBQUM7S0FDakI7R0FDRixDQUFDLENBQUM7O0FBRUgsTUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsVUFBUyxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3BDLFFBQUksR0FBRyxFQUFFO0FBQUUsYUFBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7S0FBRTtBQUNwQyxRQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3hCLGFBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZELE1BQU07QUFDTCxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ25CO0dBQ0YsQ0FBQzs7QUFFRixTQUFPLHVCQUFZLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMzQyxRQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJjb25zb2xlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgdm0gZnJvbSAndm0nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5pbXBvcnQgY2xvbmUgZnJvbSAnY2xvbmUnO1xuaW1wb3J0IHN0cmVhbSBmcm9tICdzdHJlYW0nO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IGhhc0Fuc2kgZnJvbSAnaGFzLWFuc2knO1xuaW1wb3J0IHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcbmltcG9ydCBzdHJpcEFuc2kgZnJvbSAnc3RyaXAtYW5zaSc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJ2pzb24tc3RyaW5naWZ5LXNhZmUnO1xuaW1wb3J0IGlzUGxhaW5PYmplY3QgZnJvbSAnbG9kYXNoLmlzcGxhaW5vYmplY3QnO1xuXG5pbXBvcnQge29yZGVyT2JqZWN0fSBmcm9tICcuLi8uLi91dGlscyc7XG5cbmZ1bmN0aW9uIHJwYWQodmFsdWUsIGxlbiwgY2hhcikge1xuICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gIGNoYXIgPSAoY2hhciB8fCAnICcpLnRvU3RyaW5nKCk7XG4gIHJldHVybiB2YWx1ZSArIEFycmF5KE1hdGgubWF4KDAsIGxlbiAtIHZhbHVlLmxlbmd0aCkgKyAxKS5qb2luKGNoYXIpO1xufVxuXG5mdW5jdGlvbiBwcmVmaXhMaW5lKHByZWZpeCwgY29sb3IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICByZXR1cm4gY2hhbGtbY29sb3JdKHByZWZpeCkgKyAnOiAgJyArIGxpbmU7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydChvcHRzKSB7XG4gIGNvbnN0IHNldFByb21wdCA9IHJlYWRsaW5lLkludGVyZmFjZS5wcm90b3R5cGUuc2V0UHJvbXB0O1xuICByZWFkbGluZS5JbnRlcmZhY2UucHJvdG90eXBlLnNldFByb21wdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIGhhc0Fuc2koYXJndW1lbnRzWzBdKSkge1xuICAgICAgcmV0dXJuIHNldFByb21wdC5jYWxsKHRoaXMsIGFyZ3VtZW50c1swXSwgc3RyaXBBbnNpKGFyZ3VtZW50c1swXSkubGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHNldFByb21wdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfTtcblxuICBpZiAoIW9wdHMuY29udGV4dCkgb3B0cy5jb250ZXh0ID0ge307XG5cbiAgaWYgKCFvcHRzLnByb21wdCkgb3B0cy5wcm9tcHQgPSAob3B0cy5uYW1lID8gb3B0cy5uYW1lLnRvTG93ZXJDYXNlKCkgOiAnY29uc29sZScpICsgJyA+ICc7XG4gIG9wdHMucHJvbXB0ID0gY2hhbGsuY3lhbihvcHRzLnByb21wdCk7XG5cbiAgbGV0IGxpbmVzID0gW1xuICAgICcnLFxuICAgIGBXZWxjb21lIHRvIHRoZSAke2NoYWxrLmN5YW4ob3B0cy5uYW1lKX0gUkVQTCFgLFxuICAgIGAgIHZlcnNpb246ICAgICAke2NoYWxrLmN5YW4ob3B0cy52ZXJzaW9uKX1gLFxuICAgIGAgIGVudmlyb25tZW50OiAke2NoYWxrLmN5YW4ob3B0cy5lbnZpcm9ubWVudCl9YFxuICBdO1xuXG4gIGxpbmVzLnB1c2goXG4gICAgJycsXG4gICAgJz09IE9iamVjdHMgPT0nLFxuICAgIGAgICR7Y2hhbGsubWFnZW50YSgnQVBQJyl9ICAgICAgICAgICAgWW91ciBpbml0aWFsaXplZCBhcHAtY29udGV4dGAsXG4gICAgYCAgJHtjaGFsay5tYWdlbnRhKCckJCcpfSAgICAgICAgICAgICBSZXN1bHQgb2YgbGFzdCBwcm9taXNlYCxcbiAgICAnJyxcbiAgICAnPT0gQ29tbWFuZHMgPT0nLFxuICAgIGAgICR7Y2hhbGsubWFnZW50YSgnLmV4aXQnKX0gICAgICAgICAgRXhpdCB0aGlzIFJFUExgLFxuICAgICcnXG4gICk7XG5cbiAgY29uc29sZS5sb2coXG4gICAgbGluZXNcbiAgICAgIC5tYXAocHJlZml4TGluZShvcHRzLm5hbWUudG9Mb3dlckNhc2UoKSwgJ2N5YW4nKSlcbiAgICAgIC5qb2luKG9zLkVPTClcbiAgKTtcblxuICBmdW5jdGlvbiBmb3JtYXRFcnJvcihlcnIpIHtcbiAgICByZXR1cm4gZXJyLnN0YWNrXG4gICAgICAuc3BsaXQob3MuRU9MKVxuICAgICAgLm1hcChwcmVmaXhMaW5lKG9wdHMubmFtZS50b0xvd2VyQ2FzZSgpLCAncmVkJykpXG4gICAgICAuam9pbihvcy5FT0wpO1xuICB9XG4gIGZ1bmN0aW9uIHByaW50RXJyb3IoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZm9ybWF0RXJyb3IoZXJyKSk7XG4gIH1cblxuICBwcm9jZXNzLm9uKCd1bmNhdWdodEV4Y2VwdGlvbicsIHByaW50RXJyb3IpO1xuXG4gIGNvbnN0IG1hZ2ljID0gbmV3IHJlcXVpcmUoJ3JlcGwnKS5SRVBMU2VydmVyKCcnLCBuZXcgc3RyZWFtLlBhc3NUaHJvdWdoKCkpO1xuXG4gIE9iamVjdC5rZXlzKG9wdHMuY29udGV4dCkuZm9yRWFjaCgoaykgPT4gbWFnaWMuY29udGV4dFtrZXldID0gb3B0cy5jb250ZXh0W2tleV0pO1xuXG4gIGNvbnN0IHJlcGwgPSByZXF1aXJlKCdyZXBsJykuc3RhcnQoe1xuICAgIHByb21wdDogY2hhbGsuY3lhbihvcHRzLnByb21wdCksXG4gICAgZXZhbDogZnVuY3Rpb24oY29kZSwgY29udGV4dCwgZmlsZSwgY2FsbGJhY2spIHtcbiAgICAgIC8vIGRvbid0IHJ1biBibGFuayBsaW5lc1xuICAgICAgLyoganNoaW50IGV2aWw6dHJ1ZSAqL1xuICAgICAgaWYgKGNvZGUucmVwbGFjZSgvICpcXG4gKi9nLCAnJykgPT09ICcoKScpIHsgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHVuZGVmaW5lZCk7IH1cblxuICAgICAgbWFnaWMuZXZhbChjb2RlLCBjb250ZXh0LCBmaWxlLCBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICAgICAgICAvLyBtYXliZSBjaGVjayBvbiBjb250ZXh0P1xuICAgICAgICBpZiAoZXJyKSByZXR1cm4gY2FsbGJhY2sobnVsbCwgZXJyKTtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKHJlc3VsdCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgY29udGV4dC4kJCA9IGNsb25lKGRhdGEpO1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIGRhdGEpO1xuICAgICAgICB9LCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIHdyaXRlcjogZnVuY3Rpb24ob2JqZWN0LCBvcHRpb25zKSB7XG4gICAgICBpZiAodHlwZW9mKG9iamVjdCkgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gY2hhbGsuZ3JheSh1bmRlZmluZWQpO1xuICAgICAgaWYgKG9iamVjdCA9PT0gbnVsbCkgcmV0dXJuIGNoYWxrLmdyYXkobnVsbCk7XG5cbiAgICAgIGlmICh1dGlsLmlzRXJyb3Iob2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZm9ybWF0RXJyb3Iob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRleHQ7XG4gICAgICBpZiAoaXNQbGFpbk9iamVjdChvYmplY3QpKSB7XG4gICAgICAgIHRleHQgPSBzdHJpbmdpZnkob3JkZXJPYmplY3Qob2JqZWN0KSwgbnVsbCwgMik7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZihvYmplY3QpID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRleHQgPSBvYmplY3QudG9TdHJpbmcoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRleHQgPSB1dGlsLmZvcm1hdChvYmplY3QpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGV4dFxuICAgICAgICAuc3BsaXQob3MuRU9MKVxuICAgICAgICAubWFwKHByZWZpeExpbmUob3B0cy5uYW1lLnRvTG93ZXJDYXNlKCksICdjeWFuJykpXG4gICAgICAgIC5qb2luKG9zLkVPTCk7XG4gICAgfVxuICB9KTtcblxuICByZXBsLmNvbnRleHQuJF8gPSBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICBpZiAoZXJyKSB7IHJldHVybiBwcmludEVycm9yKGVycik7IH1cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgIGNvbnNvbGUubG9nKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHJlcGwub24oJ2V4aXQnLCByZXNvbHZlKTtcbiAgfSk7XG59XG4iXX0=