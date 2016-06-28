import fs from 'fs';
import path from 'path';
import { cyan, green, yellow } from 'chalk';

import { installBabel } from '../babel-tools';
import * as errors from '../errors';

const description = 'Initialize app-context in this directory';

function usage() {
  return 'init [--babel]';
}

const APP_CONTEXT_JS =
`export default function() {
  /* This level is used to do anything needed before the config is loaded */
  // this.runlevel('setup').use(...);

  /* This level is used for reading configuration - assign it to APP.config */
  // this.runlevel('configured').use(...);

  /* This level is used for connecting to databases and such */
  // this.runlevel('connected').use(...);

  /* This level is used for initializing structures in your application */
  // this.runlevel('initialized').use(...);

  /* This level is used by app-context to execute the "app-context start" command */
  // this.runlevel('running').use(...);
};
`;

const BABEL_RC = {
  presets: ['es2015', 'stage-0']
};

function createAppContextJs() {
  const appContextPath = path.join(process.cwd(), 'app-context.js');

  if (fs.existsSync(appContextPath)) {
    return console.log(yellow('app-context.js already exists, skipping'));
  }

  fs.writeFileSync(appContextPath, APP_CONTEXT_JS, 'utf8');
  console.log(green('Created app-context.js'));
}

function createBabelrc() {
  const babelrcPath = path.join(process.cwd(), '.babelrc');

  if (fs.existsSync(babelrcPath)) {
    return console.log(yellow('.babelrc already exists, skipping'));
  }

  fs.writeFileSync(babelrcPath, JSON.stringify(BABEL_RC, null, 2), 'utf8');
  console.log(green('Created .babelrc'));
}

function execute(args, { babel = false }) {
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    throw errors.message(`A package.json file must already exist\n       First run ${cyan('npm init')} to create a new package.json file`);
  }

  createAppContextJs();
  if (babel) {
    createBabelrc();
    installBabel();
  }
}

export {
  description,
  execute
};
