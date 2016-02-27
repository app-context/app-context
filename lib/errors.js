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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9lcnJvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUE2QmdCO1FBQ0E7UUFTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW5DVjs7O0FBQ0osV0FESSxVQUNKLENBQVksT0FBWixFQUFxQjswQkFEakIsWUFDaUI7O3VFQURqQix3QkFDaUI7O0FBRW5CLFVBQU0saUJBQU4sUUFBOEIsTUFBSyxXQUFMLENBQTlCLENBRm1COztBQUluQixVQUFLLElBQUwsR0FBWSxNQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FKTztBQUtuQixVQUFLLE9BQUwsR0FBZSxPQUFmLENBTG1COztHQUFyQjs7U0FESTtFQUFtQjs7SUFVbkI7Ozs7Ozs7Ozs7RUFBbUI7O0lBQ25COzs7QUFDSixXQURJLFlBQ0osQ0FBWSxPQUFaLEVBQXFCLEdBQXJCLEVBQTBCOzBCQUR0QixjQUNzQjs7d0VBRHRCLHlCQUVJLFVBRGtCOztBQUV4QixRQUFJLE9BQU8sSUFBUCxFQUFhO0FBQ2YsYUFBSyxHQUFMLEdBQVcsR0FBWCxDQURlO0FBRWYsYUFBSyxPQUFMLHVDQUlKLElBQUksS0FBSixDQUFVLEtBQVYsQ0FBZ0IsYUFBRyxHQUFILENBQWhCLENBQXdCLElBQXhCLENBQTZCLGFBQUcsR0FBSCxDQUp6QixDQUZlO0tBQWpCO2tCQUZ3QjtHQUExQjs7U0FESTtFQUFxQjs7QUFjcEIsU0FBUyxLQUFULENBQWUsR0FBZixFQUFvQjtBQUFFLFNBQU8sSUFBSSxVQUFKLENBQWUsR0FBZixDQUFQLENBQUY7Q0FBcEI7QUFDQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsR0FBdEIsRUFBMkI7QUFBRSxTQUFPLElBQUksWUFBSixDQUFpQixHQUFqQixFQUFzQixHQUF0QixDQUFQLENBQUY7Q0FBM0I7O0FBR1AsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCO0FBQzFCLE1BQUksUUFBUSxJQUFSLElBQWdCLEtBQUssTUFBTCxLQUFnQixDQUFoQixFQUFtQjtBQUFFLFdBQU8sRUFBUCxDQUFGO0dBQXZDO0FBQ0EsTUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBaEIsRUFBbUI7QUFBRSxXQUFPLEtBQUssQ0FBTCxDQUFQLENBQUY7R0FBdkI7QUFDQSxTQUFPLGlDQUFVLElBQVYsRUFBZ0IsSUFBaEIsRUFBc0IsQ0FBdEIsRUFBeUIsS0FBekIsQ0FBK0IsYUFBRyxHQUFILENBQS9CLENBQXVDLElBQXZDLENBQTRDLGFBQUcsR0FBSCxHQUFTLFFBQVQsQ0FBbkQsQ0FIMEI7Q0FBNUI7O0FBTU8sU0FBUyxXQUFULENBQXFCLEdBQXJCLEVBQTBCO0FBQy9CLE1BQUksUUFBUSxJQUFJLFlBQUosRUFBUixDQUQyQjs7QUFHL0IsUUFBTSxRQUFOLEdBQWlCLElBQUksUUFBSixDQUhjO0FBSS9CLFFBQU0sWUFBTixHQUFxQixJQUFJLFlBQUosQ0FKVTtBQUsvQixRQUFNLElBQU4sR0FBYSxJQUFJLElBQUosQ0FMa0I7O0FBTy9CLE1BQUksT0FBTyxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsQ0FQb0I7QUFRL0IsTUFBSSxTQUFTLFFBQVQsRUFBbUI7QUFBRSxtQkFBYSxJQUFJLFdBQUosQ0FBZ0IsSUFBaEIsTUFBYixDQUFGO0dBQXZCOztBQUVBLE1BQUksZ0NBQ1csTUFBTSxZQUFOLElBQXNCLE1BQU0sUUFBTixzQkFDM0IsTUFBTSxJQUFOLEdBQWEsQ0FBYixxQkFDQSxrREFFTSxhQUFhLElBQUksV0FBSixDQUFnQixZQUFoQiwyQkFDYixhQUFhLElBQUksV0FBSixDQUFnQixJQUFoQixDQU56QixDQVYyQjs7QUFrQi9CLE1BQUksSUFBSSxJQUFKLEtBQWEsU0FBYixFQUF3QjtBQUMxQixVQUFNLE9BQU4sZ0NBQ29CLElBQUksV0FBSixDQUFnQixJQUFoQixzSUFFdEIsYUFIRSxDQUQwQjtHQUE1QixNQU1PLElBQUksSUFBSSxJQUFKLEtBQWEsU0FBYixFQUF3QjtBQUNqQyxVQUFNLE9BQU4sbURBQ3VDLElBQUksZUFBSix3QkFDekMsYUFGRSxDQURpQztHQUE1QixNQUtBLElBQUksSUFBSSxJQUFKLEtBQWEsZUFBYixFQUE4QjtBQUN2QyxVQUFNLE9BQU4sZ0NBQ29CLElBQUksV0FBSixDQUFnQixJQUFoQixtRUFEcEIsQ0FEdUM7R0FBbEMsTUFLQTtBQUNMLFVBQU0sT0FBTixtRUFFRix3REFJSSxJQUFJLEtBQUosQ0FBVSxLQUFWLENBQWdCLGFBQUcsR0FBSCxDQUFoQixDQUF3QixJQUF4QixDQUE2QixhQUFHLEdBQUgsR0FBUyxJQUFULFFBTi9CLENBREs7R0FMQTs7QUFnQlAsU0FBTyxLQUFQLENBN0MrQjtDQUExQiIsImZpbGUiOiJlcnJvcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgc3RyaW5naWZ5IGZyb20gJ2pzb24tc3RyaW5naWZ5LXNhZmUnO1xuXG5jbGFzcyBCYXNpY0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIoKTtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcblxuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICB9XG59XG5cbmNsYXNzIFVzYWdlRXJyb3IgZXh0ZW5kcyBCYXNpY0Vycm9yIHt9XG5jbGFzcyBNZXNzYWdlRXJyb3IgZXh0ZW5kcyBCYXNpY0Vycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSwgZXJyKSB7XG4gICAgc3VwZXIobWVzc2FnZSk7XG4gICAgaWYgKGVyciAhPSBudWxsKSB7XG4gICAgICB0aGlzLmVyciA9IGVycjtcbiAgICAgIHRoaXMubWVzc2FnZSArPSBgXG5cblN0YWNrIFRyYWNlXG49PT09PT09PT09PVxuJHtlcnIuc3RhY2suc3BsaXQob3MuRU9MKS5qb2luKG9zLkVPTCl9YDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzYWdlKG1zZykgeyByZXR1cm4gbmV3IFVzYWdlRXJyb3IobXNnKTsgfVxuZXhwb3J0IGZ1bmN0aW9uIG1lc3NhZ2UobXNnLCBlcnIpIHsgcmV0dXJuIG5ldyBNZXNzYWdlRXJyb3IobXNnLCBlcnIpOyB9XG5cblxuZnVuY3Rpb24gZm9ybWF0Q29uZmlnKGFyZ3MpIHtcbiAgaWYgKGFyZ3MgPT0gbnVsbCB8fCBhcmdzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gJyc7IH1cbiAgaWYgKGFyZ3MubGVuZ3RoID09PSAxKSB7IGFyZ3MgPSBhcmdzWzBdOyB9XG4gIHJldHVybiBzdHJpbmdpZnkoYXJncywgbnVsbCwgMikuc3BsaXQob3MuRU9MKS5qb2luKG9zLkVPTCArICcgICAgICAnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVyKGVycikge1xuICBsZXQgZXJyb3IgPSBuZXcgTWVzc2FnZUVycm9yKCk7XG5cbiAgZXJyb3IucnVubGV2ZWwgPSBlcnIucnVubGV2ZWw7XG4gIGVycm9yLnJ1bmxldmVsTmFtZSA9IGVyci5ydW5sZXZlbE5hbWU7XG4gIGVycm9yLnN0ZXAgPSBlcnIuc3RlcDtcblxuICBsZXQgdHlwZSA9IGVyci5pbml0aWFsaXplci50eXBlO1xuICBpZiAodHlwZSA9PT0gJ21vZHVsZScpIHsgdHlwZSArPSBgICgke2Vyci5pbml0aWFsaXplci5uYW1lfSlgOyB9XG5cbiAgbGV0IHN0YXR1cyA9IGBcbiAgICBSdW4gTGV2ZWw6ICR7ZXJyb3IucnVubGV2ZWxOYW1lIHx8IGVycm9yLnJ1bmxldmVsfVxuICAgIFN0ZXA6ICR7ZXJyb3Iuc3RlcCArIDF9XG4gICAgVHlwZTogJHt0eXBlfVxuICAgIENvbmZpZ3VyYXRpb246XG4gICAgICBPcmlnaW5hbDogJHtmb3JtYXRDb25maWcoZXJyLmluaXRpYWxpemVyLm9yaWdpbmFsQXJncyl9XG4gICAgICBSZXNvbHZlZDogJHtmb3JtYXRDb25maWcoZXJyLmluaXRpYWxpemVyLmFyZ3MpfWA7XG5cbiAgaWYgKGVyci50eXBlID09PSAnaW5zdGFsbCcpIHtcbiAgICBlcnJvci5tZXNzYWdlID0gYFxuICBDb3VsZCBub3QgZmluZCB0aGUgXCIke2Vyci5pbml0aWFsaXplci5uYW1lfVwiIGluaXRpYWxpemVyIG1vZHVsZSBpbiBOUE0uXG4gIENoZWNrIGh0dHBzOi8vd3d3Lm5wbWpzLmNvbS9icm93c2Uva2V5d29yZC9hcHAtY29udGV4dCBmb3IgYSBsaXN0IG9mIGF2YWlsYWJsZSBpbml0aWFsaXplcnMuXG4ke3N0YXR1c31cbmA7XG4gIH0gZWxzZSBpZiAoZXJyLnR5cGUgPT09ICd0aW1lb3V0Jykge1xuICAgIGVycm9yLm1lc3NhZ2UgPSBgXG4gIFRpbWVvdXQ6IEluaXRpYWxpemVyIHRvb2sgZ3JlYXRlciB0aGFuICR7ZXJyLnRpbWVvdXREdXJhdGlvbn0gbWlsbGlzZWNvbmRzLlxuJHtzdGF0dXN9XG5gO1xuICB9IGVsc2UgaWYgKGVyci50eXBlID09PSAncmVzb2x2ZU1vZHVsZScpIHtcbiAgICBlcnJvci5tZXNzYWdlID0gYFxuICBDb3VsZCBub3QgZmluZCB0aGUgXCIke2Vyci5pbml0aWFsaXplci5uYW1lfVwiIGluaXRpYWxpemVyLlxuICBGaXggdGhpcyBieSBydW5uaW5nIFwiYXBwLWNvbnRleHQgaW5zdGFsbFwiLlxuYDtcbiAgfSBlbHNlIHtcbiAgICBlcnJvci5tZXNzYWdlID0gYFxuICBBbiBlcnJvciBvY2N1cmVkIHdoaWxlIGluaXRpYWxpemluZyB5b3VyIGFwcGxpY2F0aW9uLlxuJHtzdGF0dXN9XG5cbiAgICBTdGFjayBUcmFjZVxuICAgID09PT09PT09PT09XG4gICAgJHtlcnIuc3RhY2suc3BsaXQob3MuRU9MKS5qb2luKG9zLkVPTCArICcgICcpfVxuYDtcbiAgfVxuXG4gIHJldHVybiBlcnJvcjtcbn1cbiJdfQ==