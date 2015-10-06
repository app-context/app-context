import os from 'os';
import util from 'util';
import stringify from 'json-stringify-safe';

class BasicError extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.message = message;
  }
}

class UsageError extends BasicError {}
class MessageError extends BasicError {
  constructor(message, err) {
    super(message);
    if (err != null) {
      this.err = err;
      this.message += `

Stack Trace
===========
${err.stack.split(os.EOL).join(os.EOL)}`;
    }
  }
}

export function usage(msg) { return new UsageError(msg); }
export function message(msg, err) { return new MessageError(msg, err); }


function formatConfig(args) {
  if (args == null || args.length === 0) { return ''; }
  if (args.length === 1) { args = args[0]; }
  return stringify(args, null, 2).split(os.EOL).join(os.EOL + '      ');
}

export function initializer(err) {
  let error = new MessageError();

  error.runlevel = err.runlevel;
  error.runlevelName = err.runlevelName;
  error.step = err.step;

  let type = err.initializer.type;
  if (type === 'module') { type += ` (${err.initializer.name})`; }

  let status = `
    Run Level: ${error.runlevelName || error.runlevel}
    Step: ${error.step + 1}
    Type: ${type}
    Configuration:
      Original: ${formatConfig(err.initializer.originalArgs)}
      Resolved: ${formatConfig(err.initializer.args)}`;

  if (err.type === 'install') {
    error.message = `
  Could not find the "${err.initializer.name}" initializer module in NPM.
  Check https://www.npmjs.com/browse/keyword/app-context for a list of available initializers.
${status}
`;
  } else if (err.type === 'timeout') {
    error.message = `
  Timeout: Initializer took greater than ${err.timeoutDuration} milliseconds.
${status}
`;
  } else {
    error.message = `
  An error occured while initializing your application.
${status}

    Stack Trace
    ===========
    ${err.stack.split(os.EOL).join(os.EOL + '  ')}
`;
  }

  return error;
}
