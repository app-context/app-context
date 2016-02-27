export function usage() {
  return 'version';
}

export const description = 'Prints the version of app-context';

export function execute() {
  console.log(require('../../package.json').version);
}
