'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usage = usage;
exports.message = message;
exports.initializer = initializer;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicError = function (_Error) {
  _inherits(BasicError, _Error);

  function BasicError(message) {
    _classCallCheck(this, BasicError);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BasicError).call(this));

    Error.captureStackTrace(_this, _this.constructor);

    _this.name = _this.constructor.name;
    _this.message = message;
    return _this;
  }

  return BasicError;
}(Error);

var UsageError = function (_BasicError) {
  _inherits(UsageError, _BasicError);

  function UsageError() {
    _classCallCheck(this, UsageError);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UsageError).apply(this, arguments));
  }

  return UsageError;
}(BasicError);

var MessageError = function (_BasicError2) {
  _inherits(MessageError, _BasicError2);

  function MessageError(message, err) {
    _classCallCheck(this, MessageError);

    var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(MessageError).call(this, message));

    if (err != null) {
      _this3.err = err;
      _this3.message += '\n\nStack Trace\n===========\n' + err.stack.split(_os2.default.EOL).join(_os2.default.EOL);
    }
    return _this3;
  }

  return MessageError;
}(BasicError);

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
  return (0, _jsonStringifySafe2.default)(args, null, 2).split(_os2.default.EOL).join(_os2.default.EOL + '      ');
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
  } else if (err.type === 'resolveModule') {
    error.message = '\n  Could not find the "' + err.initializer.name + '" initializer.\n  Fix this by running "app-context install".\n';
  } else {
    error.message = '\n  An error occured while initializing your application.\n' + status + '\n\n    Stack Trace\n    ===========\n    ' + err.stack.split(_os2.default.EOL).join(_os2.default.EOL + '  ') + '\n';
  }

  return error;
}
//# sourceMappingURL=data:application/json;base64,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RixNQUZFLGtEQU1FLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBZ0IsYUFBRyxHQUFuQixFQUF3QixJQUF4QixDQUE2QixhQUFHLEdBQUgsR0FBUyxJQUF0QyxDQU5GO0FBUUQ7O0FBRUQsU0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB1dGlsIGZyb20gJ3V0aWwnO1xuaW1wb3J0IHN0cmluZ2lmeSBmcm9tICdqc29uLXN0cmluZ2lmeS1zYWZlJztcblxuY2xhc3MgQmFzaWNFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKCk7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxufVxuXG5jbGFzcyBVc2FnZUVycm9yIGV4dGVuZHMgQmFzaWNFcnJvciB7fVxuY2xhc3MgTWVzc2FnZUVycm9yIGV4dGVuZHMgQmFzaWNFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGVycikge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIGlmIChlcnIgIT0gbnVsbCkge1xuICAgICAgdGhpcy5lcnIgPSBlcnI7XG4gICAgICB0aGlzLm1lc3NhZ2UgKz0gYFxuXG5TdGFjayBUcmFjZVxuPT09PT09PT09PT1cbiR7ZXJyLnN0YWNrLnNwbGl0KG9zLkVPTCkuam9pbihvcy5FT0wpfWA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2FnZShtc2cpIHsgcmV0dXJuIG5ldyBVc2FnZUVycm9yKG1zZyk7IH1cbmV4cG9ydCBmdW5jdGlvbiBtZXNzYWdlKG1zZywgZXJyKSB7IHJldHVybiBuZXcgTWVzc2FnZUVycm9yKG1zZywgZXJyKTsgfVxuXG5cbmZ1bmN0aW9uIGZvcm1hdENvbmZpZyhhcmdzKSB7XG4gIGlmIChhcmdzID09IG51bGwgfHwgYXJncy5sZW5ndGggPT09IDApIHsgcmV0dXJuICcnOyB9XG4gIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkgeyBhcmdzID0gYXJnc1swXTsgfVxuICByZXR1cm4gc3RyaW5naWZ5KGFyZ3MsIG51bGwsIDIpLnNwbGl0KG9zLkVPTCkuam9pbihvcy5FT0wgKyAnICAgICAgJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplcihlcnIpIHtcbiAgbGV0IGVycm9yID0gbmV3IE1lc3NhZ2VFcnJvcigpO1xuXG4gIGVycm9yLnJ1bmxldmVsID0gZXJyLnJ1bmxldmVsO1xuICBlcnJvci5ydW5sZXZlbE5hbWUgPSBlcnIucnVubGV2ZWxOYW1lO1xuICBlcnJvci5zdGVwID0gZXJyLnN0ZXA7XG5cbiAgbGV0IHR5cGUgPSBlcnIuaW5pdGlhbGl6ZXIudHlwZTtcbiAgaWYgKHR5cGUgPT09ICdtb2R1bGUnKSB7IHR5cGUgKz0gYCAoJHtlcnIuaW5pdGlhbGl6ZXIubmFtZX0pYDsgfVxuXG4gIGxldCBzdGF0dXMgPSBgXG4gICAgUnVuIExldmVsOiAke2Vycm9yLnJ1bmxldmVsTmFtZSB8fCBlcnJvci5ydW5sZXZlbH1cbiAgICBTdGVwOiAke2Vycm9yLnN0ZXAgKyAxfVxuICAgIFR5cGU6ICR7dHlwZX1cbiAgICBDb25maWd1cmF0aW9uOlxuICAgICAgT3JpZ2luYWw6ICR7Zm9ybWF0Q29uZmlnKGVyci5pbml0aWFsaXplci5vcmlnaW5hbEFyZ3MpfVxuICAgICAgUmVzb2x2ZWQ6ICR7Zm9ybWF0Q29uZmlnKGVyci5pbml0aWFsaXplci5hcmdzKX1gO1xuXG4gIGlmIChlcnIudHlwZSA9PT0gJ2luc3RhbGwnKSB7XG4gICAgZXJyb3IubWVzc2FnZSA9IGBcbiAgQ291bGQgbm90IGZpbmQgdGhlIFwiJHtlcnIuaW5pdGlhbGl6ZXIubmFtZX1cIiBpbml0aWFsaXplciBtb2R1bGUgaW4gTlBNLlxuICBDaGVjayBodHRwczovL3d3dy5ucG1qcy5jb20vYnJvd3NlL2tleXdvcmQvYXBwLWNvbnRleHQgZm9yIGEgbGlzdCBvZiBhdmFpbGFibGUgaW5pdGlhbGl6ZXJzLlxuJHtzdGF0dXN9XG5gO1xuICB9IGVsc2UgaWYgKGVyci50eXBlID09PSAndGltZW91dCcpIHtcbiAgICBlcnJvci5tZXNzYWdlID0gYFxuICBUaW1lb3V0OiBJbml0aWFsaXplciB0b29rIGdyZWF0ZXIgdGhhbiAke2Vyci50aW1lb3V0RHVyYXRpb259IG1pbGxpc2Vjb25kcy5cbiR7c3RhdHVzfVxuYDtcbiAgfSBlbHNlIGlmIChlcnIudHlwZSA9PT0gJ3Jlc29sdmVNb2R1bGUnKSB7XG4gICAgZXJyb3IubWVzc2FnZSA9IGBcbiAgQ291bGQgbm90IGZpbmQgdGhlIFwiJHtlcnIuaW5pdGlhbGl6ZXIubmFtZX1cIiBpbml0aWFsaXplci5cbiAgRml4IHRoaXMgYnkgcnVubmluZyBcImFwcC1jb250ZXh0IGluc3RhbGxcIi5cbmA7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IubWVzc2FnZSA9IGBcbiAgQW4gZXJyb3Igb2NjdXJlZCB3aGlsZSBpbml0aWFsaXppbmcgeW91ciBhcHBsaWNhdGlvbi5cbiR7c3RhdHVzfVxuXG4gICAgU3RhY2sgVHJhY2VcbiAgICA9PT09PT09PT09PVxuICAgICR7ZXJyLnN0YWNrLnNwbGl0KG9zLkVPTCkuam9pbihvcy5FT0wgKyAnICAnKX1cbmA7XG4gIH1cblxuICByZXR1cm4gZXJyb3I7XG59XG4iXX0=