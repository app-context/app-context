import AppContext from '../../../';
import * as Console from './console';

export const description = 'Initialize and open a REPL';

export function execute() {
  return AppContext.load().transitionTo(AppContext.RunLevel.Initialized).then(function() {
    return Console.start({
      name: APP.name || 'app-context',
      version: APP.version ? [APP.version.major, APP.version.minor, APP.version.patch].join('.') : '0.0.0',
      environment: APP.environment
    });
  });
}
