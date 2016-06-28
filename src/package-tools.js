import fs from 'fs';
import path from 'path';

function findPackageFile(dir = process.cwd()) {
  const filename = path.join(dir, 'package.json');
  if (fs.existsSync(filename)) {
    return filename;
  }

  const parentDir = path.join(dir, '..');
  if (dir === parentDir) {
    return undefined;
  }

  return findPackageFile(parentDir);
}

function findPackageDir(dir = process.cwd()) {
  const filename = findPackageFile(dir);
  return filename ? path.dirname(filename) : undefined;
}

function loadPackageFile(dir = process.cwd()) {
  const filename = findPackageFile(dir);
  return filename ? require(filename) : undefined;
}

//
// static getAppContextFilenameFromPackage(shouldThrow = true) {
//   try {
//     return this.findAndLoadPackage()['app-context'];
//   } catch (err) {
//     if (shouldThrow) { throw err; }
//   }
// }

export {
  findPackageDir,
  findPackageFile,
  loadPackageFile
};
