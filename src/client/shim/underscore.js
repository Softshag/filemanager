
var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    cache = {},
    __slice = Array.prototype.slice;

var Utils = {
  extend: function() {
    var o, obj, objects, prop, _i, _len;
    obj = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      o = objects[_i];
      if (o === null) {
        continue;
      }
      for (prop in o) {
        obj[prop] = o[prop];
      }
    }
    return obj;
  },
  isFunction: function (obj) { return typeof obj === 'function';},
  isObject: function (obj) { return obj == Object(obj);},
  isString: function (obj) { return toString.call(obj) === '[object String]';},
  isArray: function (obj) { return toString.call(obj) === '[object Array]';},
  isElement: function (obj) { return !!obj && obj.nodeType === 1;},
  result: function (obj,p) { return Utils.isFunction(obj[p])?obj[p]():obj[p];},
  pick: function (obj,props) {
    var o={}, k;
    for (var i=0;i<props.length;i++) {
      k=props[i];
      if (Utils.has(obj,k)) o[k] = obj[k];
    }
    return o;
  },
  map: function (array, fn) {
    var o=[];
    this.each(array, function (v) {
      o.push(fn(v));
    });
    return o;
  },
  has: function (obj, k) { return obj != null && hasOwnProperty.call(obj, k);},
  each: function (obj, iteratee, context) {
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = Object.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  },
  bind: function() {
    var args, fBound, fNOP, fn, oThis;
    fn = arguments[0], oThis = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    if (!this.isFunction(fn)) {
      throw new TypeError("Function.prototype.bind - what is tying to be bound is not callable");
    }
    fNOP = function() {};
    return fBound = function() {
      var newThis;
      newThis = this instanceof fNOP && oThis ? this : oThis;
      return fn.apply(newThis, args.concat(Array.prototype.slice.call(arguments)));
    };
  }
};
