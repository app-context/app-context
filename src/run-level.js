import * as errors from './errors';
import AppContext from './app-context';
import Initializer from './initializer';

const debug = require('debug')('app-context:run-level');

export default class RunLevel {
  constructor(builder, level) {
    this.builder = builder;
    this.level = level;
    this.name = AppContext.getRunLevelName(level);
    this.initializers = [];
  }

  /**
    * use('redis', {cache: '$redis.cache', sessions: '$redis.sessions'})
    * use('connie', 'file', 'config/${environment}.json')
    * use(require('./foobar'))
    * use(require('./foobar'), '$configvar')
    * use(function(context) { return new Promise(...) })
    * use(function(context, done) { done() })
   **/
  use(...args) {
    if (args.length === 0) { throw errors.message('Cannot call .use() without any arguments.'); }

    let first = args.shift();

    if (typeof(first) === 'string') {
      this.initializers.push(Initializer.createFromModule(this, first, args));
    } else if (typeof(first) === 'function') {
      this.initializers.push(Initializer.createFromMethod(this, first, args));
    }

    return this;
  }

  transition(context) {
    debug('transition to level ' + this.level);

    let step = 0;

    return this.initializers.reduce((lastPromise, initializer) => {
      return lastPromise.then(() => {
        debug('transition to level ' + this.level + ' step ' + step);

        return initializer.execute(context).then(() => {
          debug('transition to level ' + this.level + ' step ' + step + ' DONE');
          ++step;
        }).catch((err) => {
          err.runlevel = this.level;
          err.runlevelName = this.name;
          err.step = step;
          err.initializer = initializer;
          debug('transition to level ' + this.level + ' step ' + step + ' ERROR: ' + err.message);
          throw errors.initializer(err);
        });
      });
    }, Promise.resolve()).then(() => {
      debug('transition to level ' + this.level + ' DONE');
    }).catch((err) => {
      debug('transition to level ' + this.level + ' ERROR on step ' + step);
      throw err;
    });
  }
}
