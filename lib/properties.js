var utils = require('./utils');

function Properties() {
  this.props = {};
}

Properties.prototype.set = function(properties) {
  var props = this.props;
  
  Object.keys(properties).forEach(function(key) {
    utils.setValue(props, [key], properties[key]);
  });
  
  return this;
};

Properties.prototype.deepSet = function(properties) {
  var props = this.props;
  
  Object.keys(properties).forEach(function(key) {
    utils.setValue(props, key, properties[key]);
  });
  
  return this;
};

Properties.prototype.get = function(keyOrKeys) {
  var props = this.props;
  
  if (arguments.length === 1) return utils.getValue(this.props, arguments[0]);
  
  var result = {};
  
  Array.prototype.forEach.call(arguments, function(key) {
    utils.setValue(result, key, utils.getValue(props, key));
  });
  
  return result;
};

module.exports = Properties;
