'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commandContainer = require('../command-container');

var _commandContainer2 = _interopRequireDefault(_commandContainer);

var commands = new _commandContainer2['default']('app-context');

var rootDir = __dirname;
_fs2['default'].readdirSync(rootDir).forEach(function (filename) {
  var name = filename.replace(/\.js$/, '');
  if (name !== 'index') {
    commands.add(name, require(_path2['default'].join(rootDir, filename)));
  }
});

exports['default'] = function (argv) {
  commands.execute(argv).then(function (code) {
    process.exit(code);
  });
};

module.exports = exports['default'];