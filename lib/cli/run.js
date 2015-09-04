'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.usage = usage;
exports.execute = execute;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _errors = require('../errors');

var errors = _interopRequireWildcard(_errors);

var _ = require('../../');

var _2 = _interopRequireDefault(_);

function usage() {
  return 'run <script>';
}

var description = 'Initialize and run a script';

exports.description = description;

function execute(_ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var script = _ref2[0];

  if (!script) {
    throw errors.usage('Must supply a script to app-context run.');
  }

  var fullPath = undefined;
  try {
    fullPath = require.resolve(_path2['default'].join(process.cwd(), script));
  } catch (err) {
    throw errors.message('Could not find script ' + script + '.');
  }

  return _2['default'].load().transitionTo('initialized').then(function () {
    var scriptModule = undefined;
    try {
      scriptModule = require(fullPath);
    } catch (err) {
      throw errors.message('There was an error while loading your script.', err);
    }
    var method = scriptModule && typeof scriptModule.execute === 'function' ? scriptModule.execute : typeof scriptModule === 'function' ? scriptModule : null;

    if (method == null) {
      throw errors.message('The script module you are running does not export a method or have key named execute that is a method.');
    }

    return new _bluebird2['default'](function (resolve, reject) {
      if (method.length === 2) {
        method(APP, function (err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      } else {
        resolve(method(APP));
      }
    });
  });
}