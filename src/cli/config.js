import os from 'os';
import isPlainObject from 'lodash.isplainobject';

import AppContext from '../../';

function orderObject(obj) {
  return Object.keys(obj).sort().reduce((o, k) => {
    const v = obj[k];
    o[k] = isPlainObject(v) ? orderObject(v) : v;
    return o;
  }, {});
}

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
