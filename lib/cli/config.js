'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.description = undefined;
exports.execute = execute;

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _jsonStringifySafe = require('json-stringify-safe');

var _jsonStringifySafe2 = _interopRequireDefault(_jsonStringifySafe);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var description = exports.description = 'Print configuration';

function execute(args, opts) {
  var context = undefined;

  if (opts.g || opts.global) {
    context = _2.default.loadGlobal();
  } else {
    context = _2.default.load();
  }

  return context.transitionTo('configured').then(function () {
    console.log(['', (0, _jsonStringifySafe2.default)((0, _utils.orderObject)(APP.config), null, 2), ''].join(_os2.default.EOL));
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGkvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztRQVFnQixPQUFPLEdBQVAsT0FBTzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRmhCLElBQU0sV0FBVyxXQUFYLFdBQVcsR0FBRyxxQkFBcUIsQ0FBQzs7QUFFMUMsU0FBUyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtBQUNsQyxNQUFJLE9BQU8sWUFBQSxDQUFDOztBQUVaLE1BQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3pCLFdBQU8sR0FBRyxXQUFXLFVBQVUsRUFBRSxDQUFDO0dBQ25DLE1BQU07QUFDTCxXQUFPLEdBQUcsV0FBVyxJQUFJLEVBQUUsQ0FBQztHQUM3Qjs7QUFFRCxTQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVc7QUFDeEQsV0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUNWLEVBQUUsRUFDRixpQ0FBVSxXQWhCUixXQUFXLEVBZ0JTLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQzNDLEVBQUUsQ0FDSCxDQUFDLElBQUksQ0FBQyxhQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDakIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBzdHJpbmdpZnkgZnJvbSAnanNvbi1zdHJpbmdpZnktc2FmZSc7XG5cbmltcG9ydCBBcHBDb250ZXh0IGZyb20gJy4uLy4uLyc7XG5pbXBvcnQge29yZGVyT2JqZWN0fSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBkZXNjcmlwdGlvbiA9ICdQcmludCBjb25maWd1cmF0aW9uJztcblxuZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGUoYXJncywgb3B0cykge1xuICBsZXQgY29udGV4dDtcblxuICBpZiAob3B0cy5nIHx8IG9wdHMuZ2xvYmFsKSB7XG4gICAgY29udGV4dCA9IEFwcENvbnRleHQubG9hZEdsb2JhbCgpO1xuICB9IGVsc2Uge1xuICAgIGNvbnRleHQgPSBBcHBDb250ZXh0LmxvYWQoKTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0LnRyYW5zaXRpb25UbygnY29uZmlndXJlZCcpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coW1xuICAgICAgJycsXG4gICAgICBzdHJpbmdpZnkob3JkZXJPYmplY3QoQVBQLmNvbmZpZyksIG51bGwsIDIpLFxuICAgICAgJydcbiAgICBdLmpvaW4ob3MuRU9MKSk7XG4gIH0pO1xufVxuIl19