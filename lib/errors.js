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

    var _this = _possibleConstructorReturn(this, (BasicError.__proto__ || Object.getPrototypeOf(BasicError)).call(this));

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

    return _possibleConstructorReturn(this, (UsageError.__proto__ || Object.getPrototypeOf(UsageError)).apply(this, arguments));
  }

  return UsageError;
}(BasicError);

var MessageError = function (_BasicError2) {
  _inherits(MessageError, _BasicError2);

  function MessageError(message, err) {
    _classCallCheck(this, MessageError);

    var _this3 = _possibleConstructorReturn(this, (MessageError.__proto__ || Object.getPrototypeOf(MessageError)).call(this, message));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcnJvcnMuanMiXSwibmFtZXMiOlsidXNhZ2UiLCJtZXNzYWdlIiwiaW5pdGlhbGl6ZXIiLCJCYXNpY0Vycm9yIiwiRXJyb3IiLCJjYXB0dXJlU3RhY2tUcmFjZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsIlVzYWdlRXJyb3IiLCJNZXNzYWdlRXJyb3IiLCJlcnIiLCJzdGFjayIsInNwbGl0IiwiRU9MIiwiam9pbiIsIm1zZyIsImZvcm1hdENvbmZpZyIsImFyZ3MiLCJsZW5ndGgiLCJlcnJvciIsInJ1bmxldmVsIiwicnVubGV2ZWxOYW1lIiwic3RlcCIsInR5cGUiLCJzdGF0dXMiLCJvcmlnaW5hbEFyZ3MiLCJ0aW1lb3V0RHVyYXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7O1FBNkJnQkEsSyxHQUFBQSxLO1FBQ0FDLE8sR0FBQUEsTztRQVNBQyxXLEdBQUFBLFc7O0FBdkNoQjs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVNQyxVOzs7QUFDSixzQkFBWUYsT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUVuQkcsVUFBTUMsaUJBQU4sUUFBOEIsTUFBS0MsV0FBbkM7O0FBRUEsVUFBS0MsSUFBTCxHQUFZLE1BQUtELFdBQUwsQ0FBaUJDLElBQTdCO0FBQ0EsVUFBS04sT0FBTCxHQUFlQSxPQUFmO0FBTG1CO0FBTXBCOzs7RUFQc0JHLEs7O0lBVW5CSSxVOzs7Ozs7Ozs7O0VBQW1CTCxVOztJQUNuQk0sWTs7O0FBQ0osd0JBQVlSLE9BQVosRUFBcUJTLEdBQXJCLEVBQTBCO0FBQUE7O0FBQUEsNkhBQ2xCVCxPQURrQjs7QUFFeEIsUUFBSVMsT0FBTyxJQUFYLEVBQWlCO0FBQ2YsYUFBS0EsR0FBTCxHQUFXQSxHQUFYO0FBQ0EsYUFBS1QsT0FBTCx1Q0FJSlMsSUFBSUMsS0FBSixDQUFVQyxLQUFWLENBQWdCLGFBQUdDLEdBQW5CLEVBQXdCQyxJQUF4QixDQUE2QixhQUFHRCxHQUFoQyxDQUpJO0FBS0Q7QUFUdUI7QUFVekI7OztFQVh3QlYsVTs7QUFjcEIsU0FBU0gsS0FBVCxDQUFlZSxHQUFmLEVBQW9CO0FBQUUsU0FBTyxJQUFJUCxVQUFKLENBQWVPLEdBQWYsQ0FBUDtBQUE2QjtBQUNuRCxTQUFTZCxPQUFULENBQWlCYyxHQUFqQixFQUFzQkwsR0FBdEIsRUFBMkI7QUFBRSxTQUFPLElBQUlELFlBQUosQ0FBaUJNLEdBQWpCLEVBQXNCTCxHQUF0QixDQUFQO0FBQW9DOztBQUd4RSxTQUFTTSxZQUFULENBQXNCQyxJQUF0QixFQUE0QjtBQUMxQixNQUFJQSxRQUFRLElBQVIsSUFBZ0JBLEtBQUtDLE1BQUwsS0FBZ0IsQ0FBcEMsRUFBdUM7QUFBRSxXQUFPLEVBQVA7QUFBWTtBQUNyRCxNQUFJRCxLQUFLQyxNQUFMLEtBQWdCLENBQXBCLEVBQXVCO0FBQUVELFdBQU9BLEtBQUssQ0FBTCxDQUFQO0FBQWlCO0FBQzFDLFNBQU8saUNBQVVBLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUJMLEtBQXpCLENBQStCLGFBQUdDLEdBQWxDLEVBQXVDQyxJQUF2QyxDQUE0QyxhQUFHRCxHQUFILEdBQVMsUUFBckQsQ0FBUDtBQUNEOztBQUVNLFNBQVNYLFdBQVQsQ0FBcUJRLEdBQXJCLEVBQTBCO0FBQy9CLE1BQUlTLFFBQVEsSUFBSVYsWUFBSixFQUFaOztBQUVBVSxRQUFNQyxRQUFOLEdBQWlCVixJQUFJVSxRQUFyQjtBQUNBRCxRQUFNRSxZQUFOLEdBQXFCWCxJQUFJVyxZQUF6QjtBQUNBRixRQUFNRyxJQUFOLEdBQWFaLElBQUlZLElBQWpCOztBQUVBLE1BQUlDLE9BQU9iLElBQUlSLFdBQUosQ0FBZ0JxQixJQUEzQjtBQUNBLE1BQUlBLFNBQVMsUUFBYixFQUF1QjtBQUFFQSxtQkFBYWIsSUFBSVIsV0FBSixDQUFnQkssSUFBN0I7QUFBdUM7O0FBRWhFLE1BQUlpQixnQ0FDV0wsTUFBTUUsWUFBTixJQUFzQkYsTUFBTUMsUUFEdkMsc0JBRU1ELE1BQU1HLElBQU4sR0FBYSxDQUZuQixxQkFHTUMsSUFITiw4Q0FLWVAsYUFBYU4sSUFBSVIsV0FBSixDQUFnQnVCLFlBQTdCLENBTFosMEJBTVlULGFBQWFOLElBQUlSLFdBQUosQ0FBZ0JlLElBQTdCLENBTmhCOztBQVFBLE1BQUlQLElBQUlhLElBQUosS0FBYSxTQUFqQixFQUE0QjtBQUMxQkosVUFBTWxCLE9BQU4sZ0NBQ29CUyxJQUFJUixXQUFKLENBQWdCSyxJQURwQyxzSUFHRmlCLE1BSEU7QUFLRCxHQU5ELE1BTU8sSUFBSWQsSUFBSWEsSUFBSixLQUFhLFNBQWpCLEVBQTRCO0FBQ2pDSixVQUFNbEIsT0FBTixtREFDdUNTLElBQUlnQixlQUQzQyx3QkFFRkYsTUFGRTtBQUlELEdBTE0sTUFLQSxJQUFJZCxJQUFJYSxJQUFKLEtBQWEsZUFBakIsRUFBa0M7QUFDdkNKLFVBQU1sQixPQUFOLGdDQUNvQlMsSUFBSVIsV0FBSixDQUFnQkssSUFEcEM7QUFJRCxHQUxNLE1BS0E7QUFDTFksVUFBTWxCLE9BQU4sbUVBRUZ1QixNQUZFLGtEQU1FZCxJQUFJQyxLQUFKLENBQVVDLEtBQVYsQ0FBZ0IsYUFBR0MsR0FBbkIsRUFBd0JDLElBQXhCLENBQTZCLGFBQUdELEdBQUgsR0FBUyxJQUF0QyxDQU5GO0FBUUQ7O0FBRUQsU0FBT00sS0FBUDtBQUNEIiwiZmlsZSI6ImVycm9ycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgdXRpbCBmcm9tICd1dGlsJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnanNvbi1zdHJpbmdpZnktc2FmZSc7XG5cbmNsYXNzIEJhc2ljRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcigpO1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIH1cbn1cblxuY2xhc3MgVXNhZ2VFcnJvciBleHRlbmRzIEJhc2ljRXJyb3Ige31cbmNsYXNzIE1lc3NhZ2VFcnJvciBleHRlbmRzIEJhc2ljRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBlcnIpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgICBpZiAoZXJyICE9IG51bGwpIHtcbiAgICAgIHRoaXMuZXJyID0gZXJyO1xuICAgICAgdGhpcy5tZXNzYWdlICs9IGBcblxuU3RhY2sgVHJhY2Vcbj09PT09PT09PT09XG4ke2Vyci5zdGFjay5zcGxpdChvcy5FT0wpLmpvaW4ob3MuRU9MKX1gO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNhZ2UobXNnKSB7IHJldHVybiBuZXcgVXNhZ2VFcnJvcihtc2cpOyB9XG5leHBvcnQgZnVuY3Rpb24gbWVzc2FnZShtc2csIGVycikgeyByZXR1cm4gbmV3IE1lc3NhZ2VFcnJvcihtc2csIGVycik7IH1cblxuXG5mdW5jdGlvbiBmb3JtYXRDb25maWcoYXJncykge1xuICBpZiAoYXJncyA9PSBudWxsIHx8IGFyZ3MubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJzsgfVxuICBpZiAoYXJncy5sZW5ndGggPT09IDEpIHsgYXJncyA9IGFyZ3NbMF07IH1cbiAgcmV0dXJuIHN0cmluZ2lmeShhcmdzLCBudWxsLCAyKS5zcGxpdChvcy5FT0wpLmpvaW4ob3MuRU9MICsgJyAgICAgICcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZXIoZXJyKSB7XG4gIGxldCBlcnJvciA9IG5ldyBNZXNzYWdlRXJyb3IoKTtcblxuICBlcnJvci5ydW5sZXZlbCA9IGVyci5ydW5sZXZlbDtcbiAgZXJyb3IucnVubGV2ZWxOYW1lID0gZXJyLnJ1bmxldmVsTmFtZTtcbiAgZXJyb3Iuc3RlcCA9IGVyci5zdGVwO1xuXG4gIGxldCB0eXBlID0gZXJyLmluaXRpYWxpemVyLnR5cGU7XG4gIGlmICh0eXBlID09PSAnbW9kdWxlJykgeyB0eXBlICs9IGAgKCR7ZXJyLmluaXRpYWxpemVyLm5hbWV9KWA7IH1cblxuICBsZXQgc3RhdHVzID0gYFxuICAgIFJ1biBMZXZlbDogJHtlcnJvci5ydW5sZXZlbE5hbWUgfHwgZXJyb3IucnVubGV2ZWx9XG4gICAgU3RlcDogJHtlcnJvci5zdGVwICsgMX1cbiAgICBUeXBlOiAke3R5cGV9XG4gICAgQ29uZmlndXJhdGlvbjpcbiAgICAgIE9yaWdpbmFsOiAke2Zvcm1hdENvbmZpZyhlcnIuaW5pdGlhbGl6ZXIub3JpZ2luYWxBcmdzKX1cbiAgICAgIFJlc29sdmVkOiAke2Zvcm1hdENvbmZpZyhlcnIuaW5pdGlhbGl6ZXIuYXJncyl9YDtcblxuICBpZiAoZXJyLnR5cGUgPT09ICdpbnN0YWxsJykge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIENvdWxkIG5vdCBmaW5kIHRoZSBcIiR7ZXJyLmluaXRpYWxpemVyLm5hbWV9XCIgaW5pdGlhbGl6ZXIgbW9kdWxlIGluIE5QTS5cbiAgQ2hlY2sgaHR0cHM6Ly93d3cubnBtanMuY29tL2Jyb3dzZS9rZXl3b3JkL2FwcC1jb250ZXh0IGZvciBhIGxpc3Qgb2YgYXZhaWxhYmxlIGluaXRpYWxpemVycy5cbiR7c3RhdHVzfVxuYDtcbiAgfSBlbHNlIGlmIChlcnIudHlwZSA9PT0gJ3RpbWVvdXQnKSB7XG4gICAgZXJyb3IubWVzc2FnZSA9IGBcbiAgVGltZW91dDogSW5pdGlhbGl6ZXIgdG9vayBncmVhdGVyIHRoYW4gJHtlcnIudGltZW91dER1cmF0aW9ufSBtaWxsaXNlY29uZHMuXG4ke3N0YXR1c31cbmA7XG4gIH0gZWxzZSBpZiAoZXJyLnR5cGUgPT09ICdyZXNvbHZlTW9kdWxlJykge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIENvdWxkIG5vdCBmaW5kIHRoZSBcIiR7ZXJyLmluaXRpYWxpemVyLm5hbWV9XCIgaW5pdGlhbGl6ZXIuXG4gIEZpeCB0aGlzIGJ5IHJ1bm5pbmcgXCJhcHAtY29udGV4dCBpbnN0YWxsXCIuXG5gO1xuICB9IGVsc2Uge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIEFuIGVycm9yIG9jY3VyZWQgd2hpbGUgaW5pdGlhbGl6aW5nIHlvdXIgYXBwbGljYXRpb24uXG4ke3N0YXR1c31cblxuICAgIFN0YWNrIFRyYWNlXG4gICAgPT09PT09PT09PT1cbiAgICAke2Vyci5zdGFjay5zcGxpdChvcy5FT0wpLmpvaW4ob3MuRU9MICsgJyAgJyl9XG5gO1xuICB9XG5cbiAgcmV0dXJuIGVycm9yO1xufVxuIl19