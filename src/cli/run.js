import path from 'path';
import Promise from 'bluebird';

import * as errors from '../errors';
import AppContext from '../../';

export function usage() {
  return 'run <script>';
}

export const description = 'Initialize and run a script';

export function execute([script]) {
  if (!script) { throw errors.usage('Must supply a script to app-context run.'); }

  let fullPath;
  try {
    fullPath = require.resolve(path.join(process.cwd(), script));
  } catch (err) {
    throw errors.message('Could not find script ' + script + '.');
  }

  return AppContext.load().transitionTo('initialized').then(function() {
    let scriptModule;
    try {
      scriptModule = require(fullPath);
    } catch (err) {
      console.log(err.stack);
      throw errors.message('There was an error while loading your script.', err);
    }
    const method = scriptModule && typeof(scriptModule.execute) === 'function' ? scriptModule.execute : typeof(scriptModule) === 'function' ? scriptModule : null;

    if (method == null) {
      throw errors.message('The script module you are running does not export a method or have key named execute that is a method.');
    }

    return new Promise(function(resolve, reject) {
      if (method.length === 2) {
        method(APP, function(err) {
          if (err) { return reject(err); }
          resolve();
        });
      } else {
        resolve(method(APP));
      }
    });
  });
}
