import path from 'path';
import { installNpmModules } from './module-tools';
import { findPackageDir, loadPackageFile } from './package-tools';

function findBabelFile(dir = process.cwd()) {
  const packageDir = findPackageDir(dir);
  const filename = path.join(packageDir, '.babelrc');
  return fs.existsSync(filename) ? filename : undefined;
}

function loadBabelConfig(dir = process.cwd()) {
  const filename = findBabelFile(dir);
  if (filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  const pkg = loadPackageFile(dir);
  if (pkg && pkg.babel) {
    return pkg.babel;
  }

  return undefined;

  // environment configuration
  // if (babelConfig.env) {
  //   const environment = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
  //   if (babelConfig.env[environment]) {
  //
  //   }
  // }
}

function getBabelModuleNames(dir = process.cwd()) {
  return getBabelModuleNamesFromConfig(loadBabelConfig(dir));
}

function getBabelModuleNamesFromConfig(config = {}) {
  const presets = config.presets || [];
  const plugins = config.plugins || [];

  if (config.env) {
    for (const envConfig of Object.values(config.env)) {
      presets.push(...envConfig.presets || []);
      plugins.push(...envConfig.plugins || []);
    }
  }

  return [].concat(
    presets.map(p => p.startsWith('babel-preset-') ? p : `babel-preset-${p}`),
    plugins.map(p => {
      const name = Array.isArray(p) ? p[0] : p;
      return name.startsWith('babel-plugin-') ? name : `babel-plugin-${name}`;
    })
  );
}

function hasBabel(dir = process.cwd()) {
  return !!loadBabelConfig(dir);
}

function installBabel(dir = process.cwd()) {
  const config = loadBabelConfig(dir);
  const packageDir = findPackageDir(dir);
  return installNpmModules(getBabelModuleNamesFromConfig(config), packageDir);
}

function registerBabel(dir = process.cwd()) {
  require('babel-register')({
    sourceRoot: findPackageDir(dir)
  });
}

export {
  findBabelFile,
  hasBabel,
  loadBabelConfig,
  getBabelModuleNames,
  getBabelModuleNamesFromConfig,
  installBabel,
  registerBabel
};
