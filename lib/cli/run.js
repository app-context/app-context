'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.usage = usage;
exports.execute = execute;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function usage() {
  return 'run [script]';
}

var description = 'Initialize and run a script';

exports.description = description;

function execute(_ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var script = _ref2[0];

  if (!script) {
    throw new Error('Must supply a script to obi run');
  }

  var fullPath = require.resolve(_path2['default'].join(process.cwd(), script));
  if (!fullPath) {
    throw new Error('Could not find script ' + script);
  }

  return _2['default'].load().transitionTo('initialized').then(function () {
    var scriptModule = require(fullPath);
    if (scriptModule && typeof scriptModule.execute === 'function') {
      return scriptModule.execute(APP);
    } else if (typeof scriptModule === 'function') {
      return scriptModule(APP);
    }
  });
}