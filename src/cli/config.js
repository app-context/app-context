import os from 'os';
import {orderObject} from '../utils';

import AppContext from '../../';

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
      JSON.stringify(orderObject(APP.config), null, 2),
      ''
    ].join(os.EOL));
  });
}
