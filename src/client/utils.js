
var Inherits = function(child, parent) {
  for (var key in parent) {
    if (Utils.has(parent, key)) child[key] = parent[key];
  }
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
  child.__super__ = parent.prototype;
  return child;
};

var Ajax = function () {
  var e;
  if (window.XMLHttpRequest != null) {
    return new XMLHttpRequest();
  }
  try {
    return new ActiveXObject('msxml2.xmlhttp.6.0');
  } catch (_error) {
    e = _error;
  }
  try {
    return new ActiveXObject('msxml2.xmlhttp.3.0');
  } catch (_error) {
    e = _error;
  }
  try {
    return new ActiveXObject('msxml2.xmlhttp');
  } catch (_error) {
    e = _error;
  }
};

var CreateElement = function (tag, options) {
  options = options || {};
  var $ = Resource.$;
  var $elm = $(document.createElement(tag));
  if (Utils.has(options,'attr')) {
    $elm.attr(options.attr);
  }

  if (Utils.has(options,'className')) {
    $elm.addClass(options.className);
  }
  return $elm;
}
