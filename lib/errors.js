'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.usage = usage;
exports.message = message;
exports.initializer = initializer;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var BasicError = (function (_Error) {
  _inherits(BasicError, _Error);

  function BasicError(message) {
    _classCallCheck(this, BasicError);

    _get(Object.getPrototypeOf(BasicError.prototype), 'constructor', this).call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }

  return BasicError;
})(Error);

var UsageError = (function (_BasicError) {
  _inherits(UsageError, _BasicError);

  function UsageError() {
    _classCallCheck(this, UsageError);

    _get(Object.getPrototypeOf(UsageError.prototype), 'constructor', this).apply(this, arguments);
  }

  return UsageError;
})(BasicError);

var MessageError = (function (_BasicError2) {
  _inherits(MessageError, _BasicError2);

  function MessageError(message, err) {
    _classCallCheck(this, MessageError);

    _get(Object.getPrototypeOf(MessageError.prototype), 'constructor', this).call(this, message);
    if (err != null) {
      this.err = err;
      this.message += '\n\nStack Trace\n===========\n' + err.stack.split(_os2['default'].EOL).join(_os2['default'].EOL);
    }
  }

  return MessageError;
})(BasicError);

function usage(msg) {
  return new UsageError(msg);
}

function message(msg, err) {
  return new MessageError(msg, err);
}

function formatConfig(args) {
  if (args == null || args.length === 0) {
    return '';
  }
  if (args.length === 1) {
    args = args[0];
  }
  return JSON.stringify(args, null, 2).split(_os2['default'].EOL).join(_os2['default'].EOL + '      ');
}

function initializer(err) {
  var error = new MessageError();

  error.runlevel = err.runlevel;
  error.runlevelName = err.runlevelName;
  error.step = err.step;

  var type = err.initializer.type;
  if (type === 'module') {
    type += ' (' + err.initializer.name + ')';
  }

  var status = '\n    Run Level: ' + (error.runlevelName || error.runlevel) + '\n    Step: ' + (error.step + 1) + '\n    Type: ' + type + '\n    Configuration:\n      Original: ' + formatConfig(err.initializer.originalArgs) + '\n      Resolved: ' + formatConfig(err.initializer.args);

  if (err.type === 'install') {
    error.message = '\n  Could not find the "' + err.initializer.name + '" initializer module in NPM.\n  Check https://www.npmjs.com/browse/keyword/app-context for a list of available initializers.\n' + status + '\n';
  } else if (err.type === 'timeout') {
    error.message = '\n  Timeout: Initializer took greater than ' + err.timeoutDuration + ' milliseconds.\n' + status + '\n';
  } else {
    error.message = '\n  An error occured while initializing your application.\n' + status + '\n\n    Stack Trace\n    ===========\n    ' + err.stack.split(_os2['default'].EOL).join(_os2['default'].EOL + '  ') + '\n';
  }

  return error;
}