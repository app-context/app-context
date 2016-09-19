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
        Promise.resolve(result).then(function (data) {
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

      var text = void 0;
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

  return new Promise(function (resolve, reject) {
    repl.on('exit', resolve);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jbGkvY29uc29sZS9jb25zb2xlLmpzIl0sIm5hbWVzIjpbInN0YXJ0IiwicnBhZCIsInZhbHVlIiwibGVuIiwiY2hhciIsInRvU3RyaW5nIiwiQXJyYXkiLCJNYXRoIiwibWF4IiwibGVuZ3RoIiwiam9pbiIsInByZWZpeExpbmUiLCJwcmVmaXgiLCJjb2xvciIsImxpbmUiLCJvcHRzIiwic2V0UHJvbXB0IiwiSW50ZXJmYWNlIiwicHJvdG90eXBlIiwiYXJndW1lbnRzIiwiY2FsbCIsImFwcGx5IiwiY29udGV4dCIsInByb21wdCIsIm5hbWUiLCJ0b0xvd2VyQ2FzZSIsImN5YW4iLCJsaW5lcyIsInZlcnNpb24iLCJlbnZpcm9ubWVudCIsInB1c2giLCJtYWdlbnRhIiwiY29uc29sZSIsImxvZyIsIm1hcCIsIkVPTCIsImZvcm1hdEVycm9yIiwiZXJyIiwic3RhY2siLCJzcGxpdCIsInByaW50RXJyb3IiLCJwcm9jZXNzIiwib24iLCJtYWdpYyIsInJlcXVpcmUiLCJSRVBMU2VydmVyIiwiUGFzc1Rocm91Z2giLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJrZXkiLCJyZXBsIiwiZXZhbCIsImNvZGUiLCJmaWxlIiwiY2FsbGJhY2siLCJyZXBsYWNlIiwidW5kZWZpbmVkIiwicmVzdWx0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiZGF0YSIsIiQkIiwid3JpdGVyIiwib2JqZWN0Iiwib3B0aW9ucyIsImdyYXkiLCJpc0Vycm9yIiwidGV4dCIsImZvcm1hdCIsIiRfIiwic2xpY2UiLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7O1FBNEJnQkEsSyxHQUFBQSxLOztBQTVCaEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUVBLFNBQVNDLElBQVQsQ0FBY0MsS0FB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QVFDLEdBQVIsQ0FBWThCLElBQVo7QUFDRDtBQUNGLEdBUEQ7O0FBU0EsU0FBTyxJQUFJSCxPQUFKLENBQVksVUFBU0MsT0FBVCxFQUFrQmEsTUFBbEIsRUFBMEI7QUFDM0N0QixTQUFLVixFQUFMLENBQVEsTUFBUixFQUFnQm1CLE9BQWhCO0FBQ0QsR0FGTSxDQUFQO0FBR0QiLCJmaWxlIjoiY29uc29sZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHZtIGZyb20gJ3ZtJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgY2hhbGsgZnJvbSAnY2hhbGsnO1xuaW1wb3J0IGNsb25lIGZyb20gJ2Nsb25lJztcbmltcG9ydCBzdHJlYW0gZnJvbSAnc3RyZWFtJztcbmltcG9ydCBoYXNBbnNpIGZyb20gJ2hhcy1hbnNpJztcbmltcG9ydCByZWFkbGluZSBmcm9tICdyZWFkbGluZSc7XG5pbXBvcnQgc3RyaXBBbnNpIGZyb20gJ3N0cmlwLWFuc2knO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcbmltcG9ydCBpc1BsYWluT2JqZWN0IGZyb20gJ2xvZGFzaC5pc3BsYWlub2JqZWN0JztcblxuaW1wb3J0IHtvcmRlck9iamVjdH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5mdW5jdGlvbiBycGFkKHZhbHVlLCBsZW4sIGNoYXIpIHtcbiAgdmFsdWUgPSB2YWx1ZS50b1N0cmluZygpO1xuICBjaGFyID0gKGNoYXIgfHwgJyAnKS50b1N0cmluZygpO1xuICByZXR1cm4gdmFsdWUgKyBBcnJheShNYXRoLm1heCgwLCBsZW4gLSB2YWx1ZS5sZW5ndGgpICsgMSkuam9pbihjaGFyKTtcbn1cblxuZnVuY3Rpb24gcHJlZml4TGluZShwcmVmaXgsIGNvbG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbihsaW5lKSB7XG4gICAgcmV0dXJuIGNoYWxrW2NvbG9yXShwcmVmaXgpICsgJzogICcgKyBsaW5lO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RhcnQob3B0cykge1xuICBjb25zdCBzZXRQcm9tcHQgPSByZWFkbGluZS5JbnRlcmZhY2UucHJvdG90eXBlLnNldFByb21wdDtcbiAgcmVhZGxpbmUuSW50ZXJmYWNlLnByb3RvdHlwZS5zZXRQcm9tcHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiBoYXNBbnNpKGFyZ3VtZW50c1swXSkpIHtcbiAgICAgIHJldHVybiBzZXRQcm9tcHQuY2FsbCh0aGlzLCBhcmd1bWVudHNbMF0sIHN0cmlwQW5zaShhcmd1bWVudHNbMF0pLmxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzZXRQcm9tcHQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKCFvcHRzLmNvbnRleHQpIG9wdHMuY29udGV4dCA9IHt9O1xuXG4gIGlmICghb3B0cy5wcm9tcHQpIG9wdHMucHJvbXB0ID0gKG9wdHMubmFtZSA/IG9wdHMubmFtZS50b0xvd2VyQ2FzZSgpIDogJ2NvbnNvbGUnKSArICcgPiAnO1xuICBvcHRzLnByb21wdCA9IGNoYWxrLmN5YW4ob3B0cy5wcm9tcHQpO1xuXG4gIGxldCBsaW5lcyA9IFtcbiAgICAnJyxcbiAgICBgV2VsY29tZSB0byB0aGUgJHtjaGFsay5jeWFuKG9wdHMubmFtZSl9IFJFUEwhYCxcbiAgICBgICB2ZXJzaW9uOiAgICAgJHtjaGFsay5jeWFuKG9wdHMudmVyc2lvbil9YCxcbiAgICBgICBlbnZpcm9ubWVudDogJHtjaGFsay5jeWFuKG9wdHMuZW52aXJvbm1lbnQpfWBcbiAgXTtcblxuICBsaW5lcy5wdXNoKFxuICAgICcnLFxuICAgICc9PSBPYmplY3RzID09JyxcbiAgICBgICAke2NoYWxrLm1hZ2VudGEoJ0FQUCcpfSAgICAgICAgICAgIFlvdXIgaW5pdGlhbGl6ZWQgYXBwLWNvbnRleHRgLFxuICAgIGAgICR7Y2hhbGsubWFnZW50YSgnJCQnKX0gICAgICAgICAgICAgUmVzdWx0IG9mIGxhc3QgcHJvbWlzZWAsXG4gICAgJycsXG4gICAgJz09IENvbW1hbmRzID09JyxcbiAgICBgICAke2NoYWxrLm1hZ2VudGEoJy5leGl0Jyl9ICAgICAgICAgIEV4aXQgdGhpcyBSRVBMYCxcbiAgICAnJ1xuICApO1xuXG4gIGNvbnNvbGUubG9nKFxuICAgIGxpbmVzXG4gICAgICAubWFwKHByZWZpeExpbmUob3B0cy5uYW1lLnRvTG93ZXJDYXNlKCksICdjeWFuJykpXG4gICAgICAuam9pbihvcy5FT0wpXG4gICk7XG5cbiAgZnVuY3Rpb24gZm9ybWF0RXJyb3IoZXJyKSB7XG4gICAgcmV0dXJuIGVyci5zdGFja1xuICAgICAgLnNwbGl0KG9zLkVPTClcbiAgICAgIC5tYXAocHJlZml4TGluZShvcHRzLm5hbWUudG9Mb3dlckNhc2UoKSwgJ3JlZCcpKVxuICAgICAgLmpvaW4ob3MuRU9MKTtcbiAgfVxuICBmdW5jdGlvbiBwcmludEVycm9yKGVycikge1xuICAgIGNvbnNvbGUubG9nKGZvcm1hdEVycm9yKGVycikpO1xuICB9XG5cbiAgcHJvY2Vzcy5vbigndW5jYXVnaHRFeGNlcHRpb24nLCBwcmludEVycm9yKTtcblxuICBjb25zdCBtYWdpYyA9IG5ldyByZXF1aXJlKCdyZXBsJykuUkVQTFNlcnZlcignJywgbmV3IHN0cmVhbS5QYXNzVGhyb3VnaCgpKTtcblxuICBPYmplY3Qua2V5cyhvcHRzLmNvbnRleHQpLmZvckVhY2goKGspID0+IG1hZ2ljLmNvbnRleHRba2V5XSA9IG9wdHMuY29udGV4dFtrZXldKTtcblxuICBjb25zdCByZXBsID0gcmVxdWlyZSgncmVwbCcpLnN0YXJ0KHtcbiAgICBwcm9tcHQ6IGNoYWxrLmN5YW4ob3B0cy5wcm9tcHQpLFxuICAgIGV2YWw6IGZ1bmN0aW9uKGNvZGUsIGNvbnRleHQsIGZpbGUsIGNhbGxiYWNrKSB7XG4gICAgICAvLyBkb24ndCBydW4gYmxhbmsgbGluZXNcbiAgICAgIC8qIGpzaGludCBldmlsOnRydWUgKi9cbiAgICAgIGlmIChjb2RlLnJlcGxhY2UoLyAqXFxuICovZywgJycpID09PSAnKCknKSB7IHJldHVybiBjYWxsYmFjayhudWxsLCB1bmRlZmluZWQpOyB9XG5cbiAgICAgIG1hZ2ljLmV2YWwoY29kZSwgY29udGV4dCwgZmlsZSwgZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICAgICAgLy8gbWF5YmUgY2hlY2sgb24gY29udGV4dD9cbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGVycik7XG4gICAgICAgIFByb21pc2UucmVzb2x2ZShyZXN1bHQpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIGNvbnRleHQuJCQgPSBjbG9uZShkYXRhKTtcbiAgICAgICAgICBjYWxsYmFjayhudWxsLCBkYXRhKTtcbiAgICAgICAgfSwgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICB3cml0ZXI6IGZ1bmN0aW9uKG9iamVjdCwgb3B0aW9ucykge1xuICAgICAgaWYgKHR5cGVvZihvYmplY3QpID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGNoYWxrLmdyYXkodW5kZWZpbmVkKTtcbiAgICAgIGlmIChvYmplY3QgPT09IG51bGwpIHJldHVybiBjaGFsay5ncmF5KG51bGwpO1xuXG4gICAgICBpZiAodXRpbC5pc0Vycm9yKG9iamVjdCkpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKG9iamVjdCk7XG4gICAgICB9XG5cbiAgICAgIGxldCB0ZXh0O1xuICAgICAgaWYgKGlzUGxhaW5PYmplY3Qob2JqZWN0KSkge1xuICAgICAgICB0ZXh0ID0gc3RyaW5naWZ5KG9yZGVyT2JqZWN0KG9iamVjdCksIG51bGwsIDIpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2Yob2JqZWN0KSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0ZXh0ID0gb2JqZWN0LnRvU3RyaW5nKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdXRpbC5mb3JtYXQob2JqZWN0KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRleHRcbiAgICAgICAgLnNwbGl0KG9zLkVPTClcbiAgICAgICAgLm1hcChwcmVmaXhMaW5lKG9wdHMubmFtZS50b0xvd2VyQ2FzZSgpLCAnY3lhbicpKVxuICAgICAgICAuam9pbihvcy5FT0wpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmVwbC5jb250ZXh0LiRfID0gZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgaWYgKGVycikgeyByZXR1cm4gcHJpbnRFcnJvcihlcnIpOyB9XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAyKSB7XG4gICAgICBjb25zb2xlLmxvZyhBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICByZXBsLm9uKCdleGl0JywgcmVzb2x2ZSk7XG4gIH0pO1xufVxuIl19