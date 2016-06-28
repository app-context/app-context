'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installNpmModules = undefined;

var _child_process = require('child_process');

function installNpmModules() {
  var modules = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
  var dir = arguments.length <= 1 || arguments[1] === undefined ? process.cwd() : arguments[1];

  return new Promise(function (resolve, reject) {
    if (modules.length === 0) {
      return resolve();
    }

    var proc = (0, _child_process.spawn)('sh', ['-c', 'npm install --save --save-exact ' + modules.join(' ')], { cwd: dir, stdio: 'inherit' });

    proc.on('close', function (code) {
      if (code !== 0) {
        return reject(new Error(command + ' exited with code ' + code));
      }
      resolve();
    });
  });
}

exports.installNpmModules = installNpmModules;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb2R1bGUtdG9vbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBLFNBQVMsaUJBQVQsR0FBOEQ7QUFBQSxNQUFuQyxPQUFtQyx5REFBekIsRUFBeUI7QUFBQSxNQUFyQixHQUFxQix5REFBZixRQUFRLEdBQVIsRUFBZTs7QUFDNUQsU0FBTyxJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWLEVBQXFCO0FBQ3RDLFFBQUksUUFBUSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQUUsYUFBTyxTQUFQO0FBQW1COztBQUUvQyxRQUFNLE9BQU8sMEJBQU0sSUFBTixFQUFZLENBQ3ZCLElBRHVCLHVDQUVZLFFBQVEsSUFBUixDQUFhLEdBQWIsQ0FGWixDQUFaLEVBR1YsRUFBRSxLQUFLLEdBQVAsRUFBWSxPQUFPLFNBQW5CLEVBSFUsQ0FBYjs7QUFLQSxTQUFLLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFVBQUMsSUFBRCxFQUFVO0FBQ3pCLFVBQUksU0FBUyxDQUFiLEVBQWdCO0FBQUUsZUFBTyxPQUFPLElBQUksS0FBSixDQUFhLE9BQWIsMEJBQXlDLElBQXpDLENBQVAsQ0FBUDtBQUFrRTtBQUNwRjtBQUNELEtBSEQ7QUFJRCxHQVpNLENBQVA7QUFhRDs7UUFHQyxpQixHQUFBLGlCIiwiZmlsZSI6Im1vZHVsZS10b29scy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5cbmZ1bmN0aW9uIGluc3RhbGxOcG1Nb2R1bGVzKG1vZHVsZXMgPSBbXSwgZGlyID0gcHJvY2Vzcy5jd2QoKSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGlmIChtb2R1bGVzLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gcmVzb2x2ZSgpOyB9XG5cbiAgICBjb25zdCBwcm9jID0gc3Bhd24oJ3NoJywgW1xuICAgICAgJy1jJyxcbiAgICAgIGBucG0gaW5zdGFsbCAtLXNhdmUgLS1zYXZlLWV4YWN0ICR7bW9kdWxlcy5qb2luKCcgJyl9YFxuICAgIF0sIHsgY3dkOiBkaXIsIHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG5cbiAgICBwcm9jLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICBpZiAoY29kZSAhPT0gMCkgeyByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihgJHtjb21tYW5kfSBleGl0ZWQgd2l0aCBjb2RlICR7Y29kZX1gKSk7IH1cbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCB7XG4gIGluc3RhbGxOcG1Nb2R1bGVzXG59O1xuIl19