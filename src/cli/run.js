import path from 'path';

import AppContext from '../../';

export function usage() {
  return 'run [script]';
}

export const description = 'Initialize and run a script';

export function execute([script]) {
  if (!script) { throw new Error('Must supply a script to obi run'); }

  const fullPath = require.resolve(path.join(process.cwd(), script));
  if (!fullPath) { throw new Error('Could not find script ' + script); }

  return AppContext.load().transitionTo('initialized').then(function() {
    const scriptModule = require(fullPath);
    if (scriptModule && typeof(scriptModule.execute) === 'function') {
      return scriptModule.execute(APP);
    } else if (typeof(scriptModule) === 'function') {
      return scriptModule(APP);
    }
  });
}
