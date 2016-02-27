import AppContext from '../../';

export const description = 'Initialize and start your project';

export function execute() {
  return AppContext.load().transitionTo(10).then(function() {
    return new Promise(function(resolve, reject) {
      process.on('SIGINT', function() {
        resolve();
      });
    });
  });
}
