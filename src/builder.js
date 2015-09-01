import isPlainObject from 'lodash.isplainobject';

import RunLevel from './run-level';
import AppContext from './app-context';

export default class Builder {
  constructor() {
    this.runlevels = {};
    this.properties = {};
  }

  runlevel(level) {
    level = AppContext.resolveRunLevel(level);
    return this.runlevels[level] || (this.runlevels[level] = new RunLevel(this, level));
  }

  set() {
    let opts;
    if (arguments.length === 1 && isPlainObject(arguments[0])) {
      opts = arguments[0];
    } else if (arguments.length === 2 && typeof(arguments[0]) === 'string') {
      opts = {[arguments[0]]: arguments[1]};
    }

    Object.keys(opts).forEach((k) => {
      const v = opts[k];
      this.properties[k] = v;
    });
  }

  get(key) {
    return this.properties[key] || Builder.defaults[key];
  }
}

Builder.defaults = {
  timeout: 10000
};
