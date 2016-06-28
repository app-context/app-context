import os from 'os';
import fs from 'fs';
import path from 'path';
import { cyan, gray, magenta, red } from 'chalk';

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
    if (this.commands[commandName]) { throw new Error(`Command ${commandName} is already defined`); }
    command.name = commandName;
    this.commands[commandName] = command;
    return this;
  }

  addDirectory(dirname) {
    const names = fs.readdirSync(dirname)
      .filter(f => f.match(/\.js$/))
      .map(f => f.replace(/\.js$/, ''));

    for (const name of names) {
      if (name === 'index') { continue; }

      const command = require(path.join(dirname, name));
      if (command.name) {
        this.add(command.name, command);
      } else if (typeof(command.usage) === 'function') {
        this.add(command.usage().split(' ')[0], command);
      } else {
        this.add(name, command);
      }
    }
  }

  usage(err) {
    let lines = [''];

    if (err) {
      lines.push(red(this.debug ? err.stack : err.message), '');
    }

    lines.push(
      `Usage: ${cyan(this.programName)} [options] [command]`,
      '',
      'Commands:',
      ''
    );

    const len = Object.keys(this.commands).reduce(((a, b) => Math.max(a, b.length)), 0);
    Object.keys(this.commands).sort().forEach((commandName) => {
      const c = this.commands[commandName];
      lines.push(`  ${magenta(rpad(c.name, len + 5))}${gray(c.description)}`);
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
        console.log(red(err.message));
      } else {
        console.log(red(err.stack));
        return 127;
      }
    });
  }
}
