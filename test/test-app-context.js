var assert = require('assert');

var q = require('q');
var monotonic = require('monotonic-timestamp');

var AppContext = require('../');

// Helpers
function Sandbox() {
  var methods = [];
  
  this.initializer = function() {
    var index = methods.length;
    methods.push(-1);
    
    return function(context) {
      methods[index] = monotonic();
    };
  };
  
  this.delayedInitializer = function(delayMs) {
    var index = methods.length;
    methods.push(-1);
    
    if (!delayMs) delayMs = 10;
    
    return function(context) {
      return q.delay(delayMs).then(function() {
        methods[index] = monotonic();
      });
    };
  };
  
  this.validate = function(numShouldHaveRun) {
    if (!numShouldHaveRun) numShouldHaveRun = methods.length;
    
    for (var x = 0; x < numShouldHaveRun; ++x) {
      assert(methods[0] !== -1, 'Method ' + x + ' was not executed');
      if (x > 0) {
        assert(methods[x] > methods[x - 1], 'Method ' + x + ' was executed out of order');
      }
    }
  };
}

// Tests
describe('AppContext', function() {
  it('currentRunLevel is initialized to 0', function() {
    var context = new AppContext();
    
    assert.equal(context.currentRunLevel, 0);
  });
  
  describe('.createContext', function() {
    it('must have a configure method', function() {
      assert.throws(function() {
        AppContext.createContext();
      });
    });
    
    it('can create an empty context', function() {
      var context = AppContext.createContext({
        configure: function() {}
      });
    });
  });
  
  describe('::load', function() {
    it('default runLevel is 10', function() {
      var appContext = AppContext.createContext({
        configure: function() {}
      });
      
      return appContext.load().then(function(context) {
        assert.equal(context.currentRunLevel, 10);
      });
    });
    
    it('loads with no initializers', function() {
      var context = AppContext.createContext({
        configure: function() {}
      });
      
      return context.load();
    });
    
    it('loads non-promised initializers in order', function() {
      var sandbox = new Sandbox();
      var context = AppContext.createContext({
        configure: function() {
          this.use(1, sandbox.initializer(), sandbox.initializer(), sandbox.initializer());
        }
      });
      
      return context.load(10).then(function() {
        sandbox.validate();
      });
    });
    
    it('loads promised initializers in order', function() {
      var sandbox = new Sandbox();
      var context = AppContext.createContext({
        configure: function() {
          this.use(1, sandbox.delayedInitializer(100), sandbox.initializer(), sandbox.delayedInitializer(50));
        }
      });
      
      return context.load(10).then(function() {
        sandbox.validate();
      });
    });
    
    it('loads run-level initializers in order', function() {
      var sandbox = new Sandbox();
      var context = AppContext.createContext({
        configure: function() {
          this.use(1, sandbox.delayedInitializer(100));
          this.use(2, sandbox.delayedInitializer(100));
          this.use(3, sandbox.delayedInitializer(1));
          this.use(4, sandbox.initializer());
          this.use(5, sandbox.delayedInitializer(100));
          this.use(6, sandbox.delayedInitializer(100));
        }
      });
      
      return context.load(10).then(function() {
        sandbox.validate();
      });
    });
    
    it('loads run-level initializers for the levels requested', function() {
      var sandbox = new Sandbox();
      var context = AppContext.createContext({
        configure: function() {
          this.use(1, sandbox.delayedInitializer(100));
          this.use(2, sandbox.delayedInitializer(100));
          this.use(3, sandbox.delayedInitializer(1));
          this.use(4, sandbox.initializer());
          this.use(5, sandbox.delayedInitializer(100));
          this.use(6, sandbox.delayedInitializer(100));
        }
      });
      
      return context.load(3).then(function() {
        sandbox.validate(3);
      });
    });
  });
});
