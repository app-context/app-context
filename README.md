# app-context

Sequential bootloader and context for node applications

## Installation

```bash
$ npm install -g app-context
```

## Usage

To use `app-context` to boot your application all you need is to install
`app-context` globally and then create your context file. By default, `app-context`
expects an `app-context.js` file in the application's root directory.

### The `app-context.js` file

Your context file should export a method that will set up the different run
levels that `app-context` will load. Each level is made up of one or more
initializers that will be run sequentially. If any initializer fails, the entire
boot process will fail.

To set up a run level, just use `this.runlevel('runlevel name')` and then
call `.use(...)` on the run level.

Here's a sample app-context.js file.

```javascript
var myInitializer = require('./my-initializer');
var initializeModels = require('./initialize-models');

module.exports = function() {
  // initializers that run at the configured run level
  this.runlevel('configured')
    // read a JSON file for the current environment (development by default)
    // and assign it to APP.config
    .use('connie', 'file', 'config/${environment}.json');

  // initializers that run at the connected run level
  this.runlevel('connected')
    // connect to redis endpoints listed at APP.config.redis.cache and APP.config.redis.sessions
    // and assign {cache: ..., sessions:...} to APP.redis
    .use('redis', {
      cache: '$redis.cache',
      sessions: '$redis.sessions'
    })
    // connect to the mongodb endpoint listed at APP.config.mongodb
    // and assign it to APP.mongodb
    .use('mongodb', '$mongodb')
    // custom initializer
    .use(myInitializer);

  // initializers that run at the initialized run level
  this.runlevel('initialized')
    // custom initializer that takes configuration
    .use(initializeModels, '$model-config');

  // initializers that run at the connected running level
  this.runlevel('running')
    // in-line custom initializer using a callback
    .use(function(context, done) {
      require('./my-application')(done);
    });
};
```

Above you can see a few different types of initializers being used. There are
two high-level types: auto-installed and custom. Auto-installed initializers
are simply npm packages that are named `app-context-{initializer name}`. Custom
initializers are methods that are supplied by your application. They work the
exact same way.

### Passing configuration to initializers

Sometimes your initializers will need some extra configuration. For example, the
auto-installed mysql initializer requires that you pass in the connection
string of the database server(s) you wish to connect to. You can either pass
this information directly to the initializer, or let `app-context` lazily pass
through that information from another source. This is incredibly useful for
separating your application's configuration from the initialization process.

Configuration can be passed into the initializer by adding more arguments to the
`.use(...)` call. Configuration that you add to the `use` call is only resolved
and passed to the initializer when the initializer is about to be executed.

#### - from APP.config

To pass values from your configuration, pass a string starting with `$`,
followed by the path of the configuration value you'd like to be passed.

For instance, given the following value of `APP.config`:

```json
{
  "mysql": "mysql://localhost:3306/foobar",
  "redis": {
    "cache": "redis://localhost/1",
    "sessions": "redis://localhost/2"
  },
  "port": 3000
}
```

- `"$mysql"` would resolve to `"mysql://localhost:3306/foobar"`
- `"$redis"` would resolve to `{"cache": "redis://localhost/1", "sessions": "redis://localhost/2"}`
- `"$redis.cache"` would resolve to `"redis://localhost/1"`
- `"$port"` would resolve to `3000`

#### - from environment variables or the context

To pass or substitute values from either an environment variable or from the context (`APP`) that is being created, enclose the value in `${}`.

For instance, given the environment variable `SOME_ENV=production`:

- `"config/${SOME_ENV}.json"` would resolve to `"config/production.json"` (from the SOME_ENV environemtn variable)
- `"config/${environment}.json"` would resolve to `"config/development.json"` (from APP.environment)
- "`${version}`" would resolve to `{"major": 0, "minor": 0, "patch": 1}` (from APP.version given a package.json with {"version":"0.0.1"} in it)

### Automatically installed initializers (via NPM)

To use an auto-installed initializer, just pass the initializer name as the
first argument to a `.use(...)` method. For instance, to use the mongodb
initializer, just call `.use('mongodb', 'mongdb://localhost:27017/foobar')`.

When an auto-installed initializer is executed, it will first try to require the
package named `app-context-{initializer name}`. If that package does not exist
in your `node_modules` directory, `app-context` will attempt to npm install that
package, saving it to your `package.json` file.

#### Available initializers

For a list of currently available initializers that can be auto-installed, check
out https://www.npmjs.com/browse/keyword/app-context for now. There will be a
listing webpage at some point in the future.

## Run Levels

Run levels represent the different states that application can be in. They are
loaded sequentially. So when you load your application to the `initialized` run
level, `app-context` will first load the `setup`, `configured`, and `connected`
run levels first.

You can reference run levels either by their number or by their name. The lowest
run level is 0 and the highest is 10.

- (1) **setup**
- (3) **configured**
- (5) **connected**
- (7) **initialized**
- (9) **running**

## Initializers

Initializers are simply methods that take the current context object. They
can be synchronous or asynchronous, depending on your needs. To make an
asynchronous initializer, simply return a promise or accept a second parameter
as the done callback.

### Synchronous Initializers

```javascript
function init(context) {
  context.foo = 'foobar';
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init);
};
```

#### - with configuration

```javascript
function init(name) {
  return function(context) {
    context.name = name;
  };
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init('foobar'))
    .use(init, 'foobar')
    .use(init, '$name');
};
```

### Asynchronous Initializers (callbacks)

```javascript
function init(context, done) {
  setTimeout(done, 1000);
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init);
};
```

#### - with configuration

```javascript
function(name) {
  return function(context, done) {
    setTimeout(function() {
      context.name = name;
      done();
    }, 1000);
  };
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init('foobar'))
    .use(init, 'foobar')
    .use(init, '$name');
};
```

### Asynchronous Initializers (promises)

```javascript
var Promise = require('bluebird');

function init(context) {
  // either
  return promisedAction(context);

  // or
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000);
  });
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init);
};
```

#### - with configuration

```javascript
var Promise = require('bluebird');

function init(name) {
  return function(context) {
    // either
    return promisedAction(context, name);

    // or
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        context.name = name;
        resolve();
      }, 1000);
    });
  };
}

module.exports = function() {
  this.runlevel('initialized')
    .use(init('foobar'))
    .use(init, 'foobar')
    .use(init, '$name');
};
```

## Accessing Your Context

Once your context is loaded, it will be available in the `APP` global. This allows
you to easily access your current context from everywhere in your app.

For example, a simple controller that accesses a User model that was initialized during
the boot process might look like this.

```javascript
// index handler
var User = APP.models.User;

exports.index = function(req, res, next) {
  User.array().then(function(users) {
    res.render('users/index', users);
  });
};
```

### Properties automatically added to the context

- APP.**package** - *contents of the package.json*
- APP.**name** - *name of the app (from package.json)*
- APP.version.**major** - *major version of the app (from package.json)*
- APP.version.**minor** - *minor version of the app (from package.json)*
- APP.version.**patch** - *patch version of the app (from package.json)*
- APP.**root** - *root directory of the app (where the package.json or app-context.js was found)*
- APP.**environment** - *NODE_ENV environment variable - defaults to `development`*
- APP.**config** - *where configuration should be written to (defaulted to `{}`)*
- APP.**runlevels** - *(internal)*
- APP.**currentRunlevel** - *(internal)*
