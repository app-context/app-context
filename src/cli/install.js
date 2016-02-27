import path from 'path';
import { spawn } from 'child_process';

import * as errors from '../errors';
import AppContext from '../../';

export function usage() {
  return 'install';
}

export const description = 'Install all initializers from NPM';

function getInitializerModules(context) {
  return [].concat.apply([],
    [].concat.apply([],
      Object.values(context.runlevels)
    ).map((r) => r.initializers)
  )
  .filter((i) => i.type === 'module')
  .map((i) => i.module);
}

export function execute() {
  const context = AppContext.load();

  const initializerModules = getInitializerModules(context);
  const command = `npm install --save --save-exact ${initializerModules.join(' ')}`;

  return new Promise((resolve, reject) => {
    const proc = spawn('sh', ['-c', command], { cwd: process.cwd(), stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code !== 0) { return reject(new Error(`${command} exited with code ${code}`)); }
      resolve();
    });
  });
}
