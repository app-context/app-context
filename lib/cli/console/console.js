'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.start = start;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _lodashIsplainobject = require('lodash.isplainobject');

var _lodashIsplainobject2 = _interopRequireDefault(_lodashIsplainobject);

var _utils = require('../../utils');

function rpad(value, len, char) {
  value = value.toString();
  char = (char || ' ').toString();
  return value + Array(Math.max(0, len - value.length) + 1).join(char);
}

function prefixLine(prefix, color) {
  return function (line) {
    return _chalk2['default'][color](prefix) + ':  ' + line;
  };
}

function start(opts) {
  var setPrompt = _readline2['default'].Interface.prototype.setPrompt;
  _readline2['default'].Interface.prototype.setPrompt = function () {
    if (arguments.length === 1 && (0, _hasAnsi2['default'])(arguments[0])) {
      return setPrompt.call(this, arguments[0], (0, _stripAnsi2['default'])(arguments[0]).length);
    } else {
      return setPrompt.apply(this, arguments);
    }
  };

  if (!opts.context) opts.context = {};

  if (!opts.prompt) opts.prompt = (opts.name ? opts.name.toLowerCase() : 'console') + ' > ';
  opts.prompt = _chalk2['default'].cyan(opts.prompt);

  var lines = ['', 'Welcome to the ' + _chalk2['default'].cyan(opts.name) + ' REPL!', '  version:     ' + _chalk2['default'].cyan(opts.version), '  environment: ' + _chalk2['default'].cyan(opts.environment)];

  lines.push('', '== Objects ==', '  ' + _chalk2['default'].magenta('APP') + '            Your initialized app-context', '  ' + _chalk2['default'].magenta('$$') + '             Result of last promise', '', '== Commands ==', '  ' + _chalk2['default'].magenta('.exit') + '          Exit this REPL', '');

  console.log(lines.map(prefixLine(opts.name.toLowerCase(), 'cyan')).join(_os2['default'].EOL));

  function formatError(err) {
    return err.stack.split(_os2['default'].EOL).map(prefixLine(opts.name.toLowerCase(), 'red')).join(_os2['default'].EOL);
  }
  function printError(err) {
    console.log(formatError(err));
  }

  process.on('uncaughtException', printError);

  var magic = new require('repl').REPLServer('', new _stream2['default'].PassThrough());

  Object.keys(opts.context).forEach(function (k) {
    return magic.context[key] = opts.context[key];
  });

  var repl = require('repl').start({
    prompt: _chalk2['default'].cyan(opts.prompt),
    eval: function _eval(code, context, file, callback) {
      // don't run blank lines
      /* jshint evil:true */
      if (code.replace(/ *\n */g, '') === '()') {
        return callback(null, undefined);
      }

      magic.eval(code, context, file, function (err, result) {
        // maybe check on context?
        if (err) return callback(null, err);
        _bluebird2['default'].resolve(result).then(function (data) {
          context.$$ = (0, _clone2['default'])(data);
          callback(null, data);
        }, callback);
      });
    },
    writer: function writer(object, options) {
      if (typeof object === 'undefined') return _chalk2['default'].gray(undefined);
      if (object === null) return _chalk2['default'].gray(null);

      if (_util2['default'].isError(object)) {
        return formatError(object);
      }

      var text = undefined;
      if ((0, _lodashIsplainobject2['default'])(object)) {
        text = (0, _jsonStringifySafe2['default'])((0, _utils.orderObject)(object), null, 2);
      } else if (typeof object === 'function') {
        text = object.toString();
      } else {
        text = _util2['default'].format(object);
      }

      return text.split(_os2['default'].EOL).map(prefixLine(opts.name.toLowerCase(), 'cyan')).join(_os2['default'].EOL);
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

  return new _bluebird2['default'](function (resolve, reject) {
    repl.on('exit', resolve);
  });
}