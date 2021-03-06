import isPlainObject from 'lodash.isplainobject';

export function getValue(obj, key) {
  let o = obj;
  const keys = Array.isArray(key) ? key : key.split('.');

  for (let x = 0; x < keys.length - 1; ++x) {
    let k = keys[x];
    if (o[k] == null) { return; }
    o = o[k];
  }

  return o[keys[keys.length - 1]];
}

export function setValue(obj, key, value) {
  let o = obj;
  const keys = Array.isArray(key) ? key : key.split('.');

  for (let x = 0; x < keys.length - 1; ++x) {
    let k = keys[x];
    if (o[k] == null) { o[k] = {}; }
    o = o[k];
  }

  o[keys[keys.length - 1]] = value;
}

export function orderObject(obj) {
  return Object.keys(obj).sort().reduce((o, k) => {
    const v = obj[k];
    o[k] = isPlainObject(v) ? orderObject(v) : v;
    return o;
  }, {});
}
