import fs from 'fs';
import os from 'os';
import vm from 'vm';
import path from 'path';
import util from 'util';
import chalk from 'chalk';
import clone from 'clone';
import stream from 'stream';
import Promise from 'bluebird';
import hasAnsi from 'has-ansi';
import readline from 'readline';
import stripAnsi from 'strip-ansi';
import isPlainObject from 'lodash.isplainobject';

import {orderObject} from '../../utils';

function rpad(value, len, char) {
  value = value.toString();
  char = (char || ' ').toString();
  return value + Array(Math.max(0, len - value.length) + 1).join(char);
}

function prefixLine(prefix, color) {
  return function(line) {
    return chalk[color](prefix) + ':  ' + line;
  };
}

export function start(opts) {
  const setPrompt = readline.Interface.prototype.setPrompt;
  readline.Interface.prototype.setPrompt = function() {
    if (arguments.length === 1 && hasAnsi(arguments[0])) {
      return setPrompt.call(this, arguments[0], stripAnsi(arguments[0]).length);
    } else {
      return setPrompt.apply(this, arguments);
    }
  };

  if (!opts.context) opts.context = {};

  if (!opts.prompt) opts.prompt = (opts.name ? opts.name.toLowerCase() : 'console') + ' > ';
  opts.prompt = chalk.cyan(opts.prompt);

  let lines = [
    '',
    `Welcome to the ${chalk.cyan(opts.name)} REPL!`,
    `  version:     ${chalk.cyan(opts.version)}`,
    `  environment: ${chalk.cyan(opts.environment)}`
  ];

  lines.push(
    '',
    '== Objects ==',
    `  ${chalk.magenta('APP')}            Your initialized app-context`,
    `  ${chalk.magenta('$$')}             Result of last promise`,
    '',
    '== Commands ==',
    `  ${chalk.magenta('.exit')}          Exit this REPL`,
    ''
  );

  console.log(
    lines
      .map(prefixLine(opts.name.toLowerCase(), 'cyan'))
      .join(os.EOL)
  );

  function formatError(err) {
    return err.stack
      .split(os.EOL)
      .map(prefixLine(opts.name.toLowerCase(), 'red'))
      .join(os.EOL);
  }
  function printError(err) {
    console.log(formatError(err));
  }

  process.on('uncaughtException', printError);

  const magic = new require('repl').REPLServer('', new stream.PassThrough());

  Object.keys(opts.context).forEach((k) => magic.context[key] = opts.context[key]);

  const repl = require('repl').start({
    prompt: chalk.cyan(opts.prompt),
    eval: function(code, context, file, callback) {
      // don't run blank lines
      /* jshint evil:true */
      if (code.replace(/ *\n */g, '') === '()') { return callback(null, undefined); }
      
      magic.eval(code, context, file, function(err, result) {
        // maybe check on context?
        if (err) return callback(null, err);
        Promise.resolve(result).then(function(data) {
          context.$$ = clone(data);
          callback(null, data);
        }, callback);
      });
    },
    writer: function(object, options) {
      if (typeof(object) === 'undefined') return chalk.gray(undefined);
      if (object === null) return chalk.gray(null);

      if (util.isError(object)) {
        return formatError(object);
      }

      let text;
      if (isPlainObject(object)) {
        text = JSON.stringify(orderObject(object), null, 2);
      } else if (typeof(object) === 'function') {
        text = object.toString();
      } else {
        text = util.format(object);
      }

      return text
        .split(os.EOL)
        .map(prefixLine(opts.name.toLowerCase(), 'cyan'))
        .join(os.EOL);
    }
  });

  repl.context.$_ = function(err, data) {
    if (err) { return printError(err); }
    if (arguments.length > 2) {
      console.log(Array.prototype.slice.call(arguments, 1));
    } else {
      console.log(data);
    }
  };

  return new Promise(function(resolve, reject) {
    repl.on('exit', resolve);
  });
}
