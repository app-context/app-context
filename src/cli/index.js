import fs from 'fs';
import path from 'path';

import CommandContainer from '../command-container';

const commands = new CommandContainer('app-context');

const rootDir = __dirname;
fs.readdirSync(rootDir).forEach(function(filename) {
  const name = filename.replace(/\.js$/, '');
  if (name !== 'index') {
    commands.add(name, require(path.join(rootDir, filename)));
  }
});

export default function(argv) {
  commands.execute(argv).then(function(code) {
    process.exit(code);
  });
}
