import path from 'path';

import { hasBabel, installBabel } from '../babel-tools';
import { installNpmModules } from '../module-tools';
// import * as errors from '../errors';
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

export async function execute() {
  if (hasBabel()) {
    await installBabel();
  }

  const context = AppContext.load();
  return installNpmModules(getInitializerModules(context));
}
