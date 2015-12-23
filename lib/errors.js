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

var BasicError = (function (_Error) {
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
})(Error);

var UsageError = (function (_BasicError) {
  _inherits(UsageError, _BasicError);

  function UsageError() {
    _classCallCheck(this, UsageError);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(UsageError).apply(this, arguments));
  }

  return UsageError;
})(BasicError);

var MessageError = (function (_BasicError2) {
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
  } else {
    error.message = '\n  An error occured while initializing your application.\n' + status + '\n\n    Stack Trace\n    ===========\n    ' + err.stack.split(_os2.default.EOL).join(_os2.default.EOL + '  ') + '\n';
  }

  return error;
}
//# sourceMappingURL=data:application/json;base64,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LFdBQVcsQ0FBQyxJQUFJLENBQUMsQUFBRSxDQUFDOztBQUVyRCxNQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQzFCLFNBQUssQ0FBQyxPQUFPLGdDQUNPLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxzSUFFMUMsTUFBTSxPQUNQLENBQUM7R0FDQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDakMsU0FBSyxDQUFDLE9BQU8sbURBQzBCLEdBQUcsQ0FBQyxlQUFlLHdCQUM1RCxNQUFNLE9BQ1AsQ0FBQztHQUNDLE1BQU07QUFDTCxTQUFLLENBQUMsT0FBTyxtRUFFZixNQUFNLGtEQUlGLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGFBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUNoRCxDQUFDO0dBQ0M7O0FBRUQsU0FBTyxLQUFLLENBQUM7Q0FDZCIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJ2pzb24tc3RyaW5naWZ5LXNhZmUnO1xuXG5jbGFzcyBCYXNpY0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIoKTtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcblxuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmNsYXNzIFVzYWdlRXJyb3IgZXh0ZW5kcyBCYXNpY0Vycm9yIHt9XG5jbGFzcyBNZXNzYWdlRXJyb3IgZXh0ZW5kcyBCYXNpY0Vycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSwgZXJyKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmVyciA9IGVycjtcbiAgICAgIHRoaXMubWVzc2FnZSArPSBgXG5cblN0YWNrIFRyYWNlXG49PT09PT09PT09PVxuJHtlcnIuc3RhY2suc3BsaXQob3MuRU9MKS5qb2luKG9zLkVPTCl9YDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKG1zZykgeyByZXR1cm4gbmV3IFVzYWdlRXJyb3IobXNnKTsgfVxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2UobXNnLCBlcnIpIHsgcmV0dXJuIG5ldyBNZXNzYWdlRXJyb3IobXNnLCBlcnIpOyB9XG5cblxuZnVuY3Rpb24gZm9ybWF0Q29uZmlnKGFyZ3MpIHtcbiAgaWYgKGFyZ3MgPT0gbnVsbCB8fCBhcmdzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7IGFyZ3MgPSBhcmdzWzBdOyB9XG4gIHJldHVybiBzdHJpbmdpZnkoYXJncywgbnVsbCwgMikuc3BsaXQob3MuRU9MKS5qb2luKG9zLkVPTCArICcgICAgICAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVyKGVycikge1xuICBsZXQgZXJyb3IgPSBuZXcgTWVzc2FnZUVycm9yKCk7XG5cbiAgZXJyb3IucnVubGV2ZWwgPSBlcnIucnVubGV2ZWw7XG4gIGVycm9yLnJ1bmxldmVsTmFtZSA9IGVyci5ydW5sZXZlbE5hbWU7XG4gIGVycm9yLnN0ZXAgPSBlcnIuc3RlcDtcblxuICBsZXQgdHlwZSA9IGVyci5pbml0aWFsaXplci50eXBlO1xuICBpZiAodHlwZSA9PT0gJ21vZHVsZScpIHsgdHlwZSArPSBgICgke2Vyci5pbml0aWFsaXplci5uYW1lfSlgOyB9XG5cbiAgbGV0IHN0YXR1cyA9IGBcbiAgICBSdW4gTGV2ZWw6ICR7ZXJyb3IucnVubGV2ZWxOYW1lIHx8IGVycm9yLnJ1bmxldmVsfVxuICAgIFN0ZXA6ICR7ZXJyb3Iuc3RlcCArIDF9XG4gICAgVHlwZTogJHt0eXBlfVxuICAgIENvbmZpZ3VyYXRpb246XG4gICAgICBPcmlnaW5hbDogJHtmb3JtYXRDb25maWcoZXJyLmluaXRpYWxpemVyLm9yaWdpbmFsQXJncyl9XG4gICAgICBSZXNvbHZlZDogJHtmb3JtYXRDb25maWcoZXJyLmluaXRpYWxpemVyLmFyZ3MpfWA7XG5cbiAgaWYgKGVyci50eXBlID09PSAnaW5zdGFsbCcpIHtcbiAgICBlcnJvci5tZXNzYWdlID0gYFxuICBDb3VsZCBub3QgZmluZCB0aGUgXCIke2Vyci5pbml0aWFsaXplci5uYW1lfVwiIGluaXRpYWxpemVyIG1vZHVsZSBpbiBOUE0uXG4gIENoZWNrIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9icm93c2Uva2V5d29yZC9hcHAtY29udGV4dCBmb3IgYSBsaXN0IG9mIGF2YWlsYWJsZSBpbml0aWFsaXplcnMuXG4ke3N0YXR1c31cbmA7XG4gIH0gZWxzZSBpZiAoZXJyLnR5cGUgPT09ICd0aW1lb3V0Jykge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIFRpbWVvdXQ6IEluaXRpYWxpemVyIHRvb2sgZ3JlYXRlciB0aGFuICR7ZXJyLnRpbWVvdXREdXJhdGlvbn0gbWlsbGlzZWNvbmRzLlxuJHtzdGF0dXN9XG5gO1xuICB9IGVsc2Uge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIEFuIGVycm9yIG9jY3VyZWQgd2hpbGUgaW5pdGlhbGl6aW5nIHlvdXIgYXBwbGljYXRpb24uXG4ke3N0YXR1c31cblxuICAgIFN0YWNrIFRyYWNlXG4gICAgPT09PT09PT09PT1cbiAgICAke2Vyci5zdGFjay5zcGxpdChvcy5FT0wpLmpvaW4ob3MuRU9MICsgJyAgJyl9XG5gO1xuICB9XG5cbiAgcmV0dXJuIGVycm9yO1xufVxuIl19