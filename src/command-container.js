import os from 'os';
import chalk from 'chalk';

function rpad(v, len, c) {
  v = v.toString();
  c = (c || ' ').toString();
  return v + Array(Math.max(0, len - v.length) + 1).join(c);
}

export default class CommandContainer {
  constructor(programName) {
    this.programName = programName;
    this.commands = {};
    this.debug = false;
  }

  add(commandName, command) {
    if (this.commands[commandName]) { throw new Error('Command ' + commandName + ' is already defined'); }
    command.name = commandName;
    this.commands[commandName] = command;
    return this;
  }

  usage(err) {
    let lines = [''];

    if (err) {
      lines.push(chalk.red(this.debug ? err.stack : err.message), '');
    }

    lines.push(
      `Usage: ${chalk.cyan(this.programName)} [options] [command]`,
      '',
      'Commands:',
      ''
    );

    const len = Object.keys(this.commands).reduce(((a, b) => Math.max(a, b.length)), 0);
    Object.keys(this.commands).sort().forEach((commandName) => {
      const c = this.commands[commandName];
      lines.push(`  ${chalk.magenta(rpad(c.name, len + 5))}${chalk.gray(c.description)}`);
    });

    lines.push('');

    console.log(lines.join(os.EOL));

    return 1;
  }

  execute(argv) {
    return new Promise((resolve, reject) => {
      argv = require('minimist')(argv, {
        boolean: ['g', 'global']
      });

      if (argv.DEBUG) {
        this.debug = true;
        delete argv.DEBUG;
      }

      if (argv._.length === 0) { return this.usage(); }

      const commandName = argv._.shift();
      const command = this.commands[commandName];

      if (command == null) { return this.usage(new Error(`Invalid command: ${commandName}`)); }

      const subcommands = argv._;
      delete argv._;

      return resolve(command.execute(subcommands, argv)).then(() => 0);
    }).catch((err) => {
      if (err.name === 'UsageError') {
        return this.usage(err);
      } else if (err.name === 'MessageError') {
        console.log(chalk.red(err.message));
      } else {
        console.log(chalk.red(err.stack));
        return 127;
      }
    });
  }
}
