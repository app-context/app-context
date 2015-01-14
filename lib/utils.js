exports.getValue = function(obj, key) {
  var o = obj;
  var keys = Array.isArray(key) ? key : key.split('.');
  
  for (var x = 0; x < keys.length - 1; ++x) {
    var k = keys[x];
    if (!o[k]) return;
    o = o[k];
  }
  
  return o[keys[keys.length - 1]];
};

exports.setValue = function(obj, key, value) {
  var o = obj;
  var keys = Array.isArray(key) ? key : key.split('.');
  
  for (var x = 0; x < keys.length - 1; ++x) {
    var k = keys[x];
    if (!o[k]) o[k] = {};
    o = o[k];
  }
  
  o[keys[keys.length - 1]] = value;
};
