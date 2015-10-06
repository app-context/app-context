import os from 'os';
import stringify from 'json-stringify-safe';

import AppContext from '../../';
import {orderObject} from '../utils';

export const description = 'Print configuration';

export function execute(args, opts) {
  let context;

  if (opts.g || opts.global) {
    context = AppContext.loadGlobal();
  } else {
    context = AppContext.load();
  }

  return context.transitionTo('configured').then(function() {
    console.log([
      '',
      stringify(orderObject(APP.config), null, 2),
      ''
    ].join(os.EOL));
  });
}
