var Qwery = (function() {
  /*!
   * @preserve Qwery - A selector engine
   * https://github.com/ded/qwery
   * (c) Dustin Diaz 2014 | License MIT
   */
  var classOnly = /^\.([\w\-]+)$/,
    doc = document,
    win = window,
    html = doc.documentElement,
    nodeType = 'nodeType';
  var isAncestor = 'compareDocumentPosition' in html ?
    function(element, container) {
      return (container.compareDocumentPosition(element) & 16) == 16;
    } :
    function(element, container) {
      container = container == doc || container == window ? html :
        container;
      return container !== element && container.contains(element);
    };

  function toArray(ar) {
    return [].slice.call(ar, 0);
  }

  function isNode(el) {
    var t;
    return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 ||
      t ==
      9);
  }

  function arrayLike(o) {
    return (typeof o === 'object' && isFinite(o.length));
  }

  function flatten(ar) {
    for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ?
      (r =
        r.concat(ar[i])) : (r[r.length] = ar[i]);
    return r;
  }

  function uniq(ar) {
    var a = [],
      i, j;
    label:
      for (i = 0; i < ar.length; i++) {
        for (j = 0; j < a.length; j++) {
          if (a[j] == ar[i]) {
            continue label;
          }
        }
        a[a.length] = ar[i];
      }
    return a;
  }


  function normalizeRoot(root) {
    if (!root) return doc;
    if (typeof root == 'string') return qwery(root)[0];
    if (!root[nodeType] && arrayLike(root)) return root[0];
    return root;
  }

  /**
   * @param {string|Array.<Element>|Element|Node} selector
   * @param {string|Array.<Element>|Element|Node=} opt_root
   * @return {Array.<Element>}
   */
  function qwery(selector, opt_root) {
    var m, root = normalizeRoot(opt_root);
    if (!root || !selector) return [];
    if (selector === win || isNode(selector)) {
      return !opt_root || (selector !== win && isNode(root) && isAncestor(
        selector, root)) ? [selector] : [];
    }
    if (selector && arrayLike(selector)) return flatten(selector);


    if (doc.getElementsByClassName && selector == 'string' && (m =
        selector.match(
          classOnly))) {
      return toArray((root).getElementsByClassName(m[1]));
    }
    // using duck typing for 'a' window or 'a' document (not 'the' window || document)
    if (selector && (selector.document || (selector.nodeType && selector.nodeType ==
        9))) {
      return !opt_root ? [selector] : [];
    }
    return toArray((root).querySelectorAll(selector));
  }

  qwery.uniq = uniq;

  return qwery;
})();


var Dom = (function() {

  function Dom(s, r) {
    var elements, i, value, _i, _len;
    this.selector = s;
    if (typeof s === 'undefined') {
      elements = [];
      this.selector = '';
    } else if (typeof s === 'string' || s.nodeName || (s.length &&
        __indexOf.call(s, 'item') >= 0) || s === window) {
      elements = _select(s, r);
    } else {
      elements = isFinite(s.length) ? s : [s];
    }
    this.length = elements.length;
    for (i = _i = 0, _len = elements.length; _i < _len; i = ++_i) {
      value = elements[i];
      this[i] = elements[i];
    }
  }

  var _select = function(s, r) {
    return Qwery(s, r);
  };

  Utils.extend(Dom.prototype, {
    each: function(cb) {
      for (var i = 0; i < this.length; i++) {
        cb.call(this, this[i]);
      }
      return this;
    },
    hasClass: function(className) {
      return this[0].className.match(new RegExp(className)) ? true : false;
    },
    addClass: function(className) {
      return this.each(function(elm) {
        elm.className = elm.className.replace(className, '').trim() +
          ' ' + className;
      });
    },
    removeClass: function(className) {
      return this.each(function(elm) {
        elm.className = elm.className.replace(className, "").trim();
      });
    },
    append: function(elm) {
      return this.each(function (e) {
        if (Utils.isElement(e)) {
          if (elm instanceof Dom) {
            elm.each(function (_e) {
              e.appendChild(_e);
            });
          } else {
              e.appendChild(elm);
          }
        }
      });
    },
    html: function(html) {
      if (html == null)
        return this[0].innerHTML;
      return this.each(function (elm) {
        elm.innerHTML = html;
      });

    },
    find: function(selector) {
      var $elm, element, i, len;
      len = this.length;
      i = 0;
      while (len-- > 0) {
        element = this[0];
        $elm = new Dom(selector, element);
        if ($elm.length > 0 || len === 0) {
          return $elm;
        }
        i++;
      }
    },
    remove: function() {
      return this.each(function (elm) {
        elm.parentNode.removeChild(elm);
      });
    },
    empty: function() {
      return this.each(function (elm) {
        new Dom(elm).html('');
      });
    },
    on: function (event, func) {
      return this.each(function (elm) {
        elm.addEventListener(event, func);
      });
    },
    off: function (event, func) {
      return this.each(function (elm) {
        elm.removeEventListener(event, func);
      });
    },
    attr: function(a, v) {
      var key, value;
      if (!this.length) {
        return this;
      }
      if (Utils.isObject(a) && !Utils.isString(a)) {

        return this.each(function(element) {
          Utils.each(a, function (value, key) {
            element.setAttribute(key, value);
          });
        });
      }
      if (Utils.isString(a) && !v) {
        return this[0].getAttribute(a);
      }
      if (Utils.isString(a) && (v != null)) {
        return this.each(function (elm) {
          elm.setAttribute(a, v);
        });

      }
      return this;
    },
    val: function (val) {
      if (val) {
        return this.each(function (elm) {
          elm.value = val;
        });
      }
      return this[0].value;

    },
    css: function(obj) {
      var element, s, style, styleArray, styleList, styles, _i, _len;
      if (!(this.length > 0)) {
        return this;
      }
      if (obj != null) {
        return this.each((function(_this) {
          return function(element) {
            var css, key, styleList, value;
            css = Utils.extend({}, _this.css(), obj);
            styleList = (function() {
              var _results;
              _results = [];
              for (key in css) {
                value = css[key];
                _results.push("" + key + ":" + value);
              }
              return _results;
            })();
            return element.setAttribute('style', styleList.join(';'));
          };
        })(this));
      } else {
        element = this[0];
        styles = element.getAttribute('style');
        styleList = styles != null ? typeof styles.split === "function" ? styles.split(';') : void 0 : void 0;
        styleArray = {};
        if (styleList == null) {
          return {};
        }
        for (_i = 0, _len = styleList.length; _i < _len; _i++) {
          style = styleList[_i];
          s = style.split(':');
          styleArray[s[0].replace(' ', '')] = s[1];
        }
        return styleArray;
      }
    }

  });

  return Dom;

})();

Resource.$ = function(s, r) {
  return new Dom(s, r);
};
