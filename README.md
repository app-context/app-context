# app-context

Bootloader and context for node projects

### Motivation

app-context is motivated by the middleware stack of libraries like [express](http://expressjs.com/). app-context should provide an ordered initialization
of your app and works on the idea of run levels. Each level is assured to be run in order
so that you can make sure to load your configuration before trying to use it, or connect
to your DBs before booting your HTTP server. The app-context also allows externalization of
the boot process to different run levels. With one line of code you can load an application
so that you can do things like create a REPL into your fully-initialized application
context.

### Installation

```bash
$ npm install --save app-context
```

### Usage

In your `package.json`
```json
{
  "name": "my-project",
  "description": "",
  "version": "0.0.1",
  "app-context": "context.js"
}
```

In your `context.js`
```javascript
var AppContext = require('app-context');
var dbs = require('./initializers/dbs');
var config = require('./initializers/config');
var models = require('./initializers/models');
var server = require('./initializers/server');

module.exports = AppContext.createContext({
  configure: function() {
    // run the config initializer to transition to the "Configured" run level
    this.use(AppContext.RunLevel.Configured, config());
    
    // run the dbs then models initializers to transition to the
    // "Connected" run level
    this.use(AppContext.RunLevel.Connected, dbs(), models());
    
    // boot your http server or tcp service here
    this.use(AppContext.RunLevel.Running,
      server.create(),
      server.listen(),
      function(context) {
        console.log('Running in context', context);
      }
    );
  }
});
```

### Run Levels

Run levels are integers that represent different states of an application.

- AppContext.RunLevel.**Setup** (1)
- AppContext.RunLevel.**Configured** (3)
- AppContext.RunLevel.**Connected** (5)
- AppContext.RunLevel.**Initialized** (7)
- AppContext.RunLevel.**Running** (9)

### Access Your Context

Once your context is loaded, it will be available in the `APP` global. This allows
you to easily access your current context from everywhere in your app.

```javascript
// index handler
var User = APP.models.User;

exports.index = function(req, res) {
  User.array().then(function(users) {
    res.render('index', users);
  });
};
```

### Initializers

Initializers are methods that configure and initialize the context.

Initializers are passed the context and do not have a required return value.

```javascript
module.exports = function(context) {
  
};
```

#### Async Initializers

Initializers can optionally be asynchronous. To make your initializers async, just
return a promise from it.

### Default Context Properties

- version.**major**
- version.**minor**
- version.**patch**
- **environment** NODE_ENV environment variable - defaults to `development`
- **config**
- **initializers**
- **options**
- **currentRunLevel**

### Context Methods

**use(initializers...)** Add one or more initializers
**set**
**deepSet**
**get**

### Loading a Context

##### AppContext.loadFromPackage(runLevel, environment, options)

Finds the `package.json` file from the current working directory, then loads
the app context from the file listed in the `app-context` key, and boots the
context to the run level you specify

- `runLevel` run level to boot to (default: `RunLevel.Running`)
- `environment` environment to run, available from `APP.environment` (default: `process.env.NODE_ENV || 'development`)
- `options` options to pass your app, available from `APP.options` (default: `{}`)

To load the app context from the current package, just call `loadFromPackage`.
This can be called from your `server.js` or `some-script.js`.

For instance, your **server.js** might look like:
```javascript
var AppContext = require('app-context');

AppContext.loadFromPackage().then(function() {
  // your app should be running now
}).catch(function(err) {
  console.log('Error booting:', err.stack);
});
```
