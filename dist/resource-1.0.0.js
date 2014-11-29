(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require, exports, module);
    } else {
        root.Resource = factory();
    }
}(this, function (require, exports, module) {


    var Resource = {};

    Resource.$ = null;

    var Inherits = function (child, parent) {
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
        if (Utils.has(options, 'attr')) {
            $elm.attr(options.attr);
        }

        if (Utils.has(options, 'className')) {
            $elm.addClass(options.className);
        }
        return $elm;
    }

    // Backbone.NativeAjax.js 0.3.0
    // ---------------
    //     (c) 2014 Adam Krebs, Paul Miller, Exoskeleton Project
    //     Backbone.NativeAjax may be freely distributed under the MIT license.
    //     For all details and documentation:
    //     https://github.com/akre54/Backbone.NativeAjax
    // Make an AJAX request to the server.
    // Usage:
    //   var req = Backbone.ajax({url: 'url', type: 'PATCH', data: 'data'});
    //   req.then(..., ...) // if Promise is set
    var Sync = (function () {
        var xmlRe = /^(?:application|text)\/xml/;
        var jsonRe = /^application\/json/;

        var getData = function (accepts, xhr) {
            if (accepts == null) accepts = xhr.getResponseHeader('content-type');
            if (xmlRe.test(accepts)) {
                return xhr.responseXML;
            } else if (jsonRe.test(accepts) && xhr.responseText !== '') {
                return JSON.parse(xhr.responseText);
            } else {
                return xhr.responseText;
            }
        };

        var isValid = function (xhr) {
            return (xhr.status >= 200 && xhr.status < 300) || (xhr.status === 304) || (xhr.status === 0 && window.location.protocol === 'file:')
        };

        var end = function (xhr, options, resolve, reject) {
            return function () {
                if (xhr.readyState !== 4) return;

                var status = xhr.status;
                var data = getData(options.headers && options.headers.Accept, xhr);

                // Check for validity.
                if (isValid(xhr)) {
                    if (options.success) options.success(data);
                    if (resolve) resolve(data);
                } else {
                    var error = new Error('Server responded with a status of ' + status);
                    if (options.error) options.error(xhr, status, error);
                    if (reject) reject(xhr);
                }
            }
        };

        return function (options) {
            if (options == null) throw new Error('You must provide options');
            if (options.type == null) options.type = 'GET';

            var resolve, reject, xhr = Ajax(); //new XMLHttpRequest();
            var PromiseFn = Sync.Promise || (typeof Promise !== null && Promise);
            var promise = PromiseFn && new PromiseFn(function (res, rej) {
                resolve = res;
                reject = rej;
            });

            if (options.contentType) {
                if (options.headers == null) options.headers = {};
                options.headers['Content-Type'] = options.contentType;
            }

            // Stringify GET query params.
            if (options.type === 'GET' && typeof options.data === 'object') {
                var query = '';
                var stringifyKeyValuePair = function (key, value) {
                    return value == null ? '' : '&' + encodeURIComponent(key) + '=' + encodeURIComponent(value);
                };
                for (var key in options.data) {
                    query += stringifyKeyValuePair(key, options.data[key]);
                }

                if (query) {
                    var sep = (options.url.indexOf('?') === -1) ? '?' : '&';
                    options.url += sep + query.substring(1);
                }
            }

            xhr.addEventListener('readystatechange', end(xhr, options, resolve, reject));
            xhr.open(options.type, options.url, true);

            var allTypes = "*/".concat("*");
            var xhrAccepts = {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            };
            xhr.setRequestHeader("Accept", options.dataType && xhrAccepts[options.dataType] ? xhrAccepts[options.dataType] + (options.dataType !== "*" ? ", " + allTypes + "; q=0.01" : "") : xhrAccepts["*"]);

            if (options.headers) for (var key in options.headers) {
                xhr.setRequestHeader(key, options.headers[key]);
            }
            if (options.beforeSend) options.beforeSend(xhr);
            xhr.send(options.data);

            return promise;
        };
    })();


    var toString = Object.prototype.toString,
        hasOwnProperty = Object.prototype.hasOwnProperty,
        cache = {},
        __slice = Array.prototype.slice;

    var Utils = {
        extend: function () {
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
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isObject: function (obj) {
            return obj == Object(obj);
        },
        isString: function (obj) {
            return toString.call(obj) === '[object String]';
        },
        isArray: function (obj) {
            return toString.call(obj) === '[object Array]';
        },
        isElement: function (obj) {
            return !!obj && obj.nodeType === 1;
        },
        result: function (obj, p) {
            return Utils.isFunction(obj[p]) ? obj[p]() : obj[p];
        },
        pick: function (obj, props) {
            var o = {},
                k;
            for (var i = 0; i < props.length; i++) {
                k = props[i];
                if (Utils.has(obj, k)) o[k] = obj[k];
            }
            return o;
        },
        map: function (array, fn) {
            var o = [];
            this.each(array, function (v) {
                o.push(fn(v));
            });
            return o;
        },
        has: function (obj, k) {
            return obj != null && hasOwnProperty.call(obj, k);
        },
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
        bind: function () {
            var args, fBound, fNOP, fn, oThis;
            fn = arguments[0], oThis = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
            if (!this.isFunction(fn)) {
                throw new TypeError("Function.prototype.bind - what is tying to be bound is not callable");
            }
            fNOP = function () {};
            return fBound = function () {
                var newThis;
                newThis = this instanceof fNOP && oThis ? this : oThis;
                return fn.apply(newThis, args.concat(Array.prototype.slice.call(arguments)));
            };
        }
    };

    var Qwery = (function () {
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
        function (element, container) {
            return (container.compareDocumentPosition(element) & 16) == 16;
        } : function (element, container) {
            container = container == doc || container == window ? html : container;
            return container !== element && container.contains(element);
        };

        function toArray(ar) {
            return [].slice.call(ar, 0);
        }

        function isNode(el) {
            var t;
            return el && typeof el === 'object' && (t = el.nodeType) && (t == 1 || t == 9);
        }

        function arrayLike(o) {
            return (typeof o === 'object' && isFinite(o.length));
        }

        function flatten(ar) {
            for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r =
            r.concat(ar[i])) : (r[r.length] = ar[i]);
            return r;
        }

        function uniq(ar) {
            var a = [],
                i, j;
            label: for (i = 0; i < ar.length; i++) {
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
            if (selector && (selector.document || (selector.nodeType && selector.nodeType == 9))) {
                return !opt_root ? [selector] : [];
            }
            return toArray((root).querySelectorAll(selector));
        }

        qwery.uniq = uniq;

        return qwery;
    })();


    var Dom = (function () {

        function Dom(s, r) {
            var elements, i, value, _i, _len;
            this.selector = s;
            if (typeof s === 'undefined') {
                elements = [];
                this.selector = '';
            } else if (typeof s === 'string' || s.nodeName || (s.length && __indexOf.call(s, 'item') >= 0) || s === window) {
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

        var _select = function (s, r) {
            return Qwery(s, r);
        };

        Utils.extend(Dom.prototype, {
            each: function (cb) {
                for (var i = 0; i < this.length; i++) {
                    cb.call(this, this[i]);
                }
                return this;
            },
            hasClass: function (className) {
                return this[0].className.match(new RegExp(className)) ? true : false;
            },
            addClass: function (className) {
                return this.each(function (elm) {
                    elm.className = elm.className.replace(className, '').trim() + ' ' + className;
                });
            },
            removeClass: function (className) {
                return this.each(function (elm) {
                    elm.className = elm.className.replace(className, "").trim();
                });
            },
            append: function (elm) {
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
            html: function (html) {
                if (html == null) return this[0].innerHTML;
                return this.each(function (elm) {
                    elm.innerHTML = html;
                });

            },
            find: function (selector) {
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
            remove: function () {
                return this.each(function (elm) {
                    elm.parentNode.removeChild(elm);
                });
            },
            empty: function () {
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
            attr: function (a, v) {
                var key, value;
                if (!this.length) {
                    return this;
                }
                if (Utils.isObject(a) && !Utils.isString(a)) {

                    return this.each(function (element) {
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
            css: function (obj) {
                var element, s, style, styleArray, styleList, styles, _i, _len;
                if (!(this.length > 0)) {
                    return this;
                }
                if (obj != null) {
                    return this.each((function (_this) {
                        return function (element) {
                            var css, key, styleList, value;
                            css = Utils.extend({}, _this.css(), obj);
                            styleList = (function () {
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

    Resource.$ = function (s, r) {
        return new Dom(s, r);
    };


    /**
     * EventEmitter
     * @mixin
     */
    Resource.Events = {

        /**
         * Listen for an event
         * @param  {String}   event   The name of the events
         * @param  {Function} fn      A callback function
         * @param  {Object}   context The context of which to call the function
         * @return {Object}           This
         */
        on: function (event, fn, context) {
            return this.addEventListener(event, fn, context, false);
        },


        /**
         * Listen for an event once
         * @param  {String}   event   The name of the events
         * @param  {Function} fn      A Callback Function
         * @param  {Object}   context The context in which to call the Function
         * @return {Object}           this
         */
        once: function (event, fn, context) {
            return this.addEventListener(event, fn, context, true);
        },

        /**
         * Listen for an event
         * @param {String}   event   The name of the events
         * @param {Function} fn      The function to call when the event occurs
         * @param {Object}   context The context in which to call the Function
         * @param {Object}   once    This
         */
        addEventListener: function (event, fn, context, once) {
            once = once || false;

            if (this._events == null) {
                this._events = {};
            }

            if (this._events[event] == null) this._events[event] = [];

            this._events[event].push({
                fn: fn,
                once: once,
                context: context || this
            });

            return this;

        },

        /**
         * Remove listener
         * @param  {String}   event The name of the event to remove a listener for
         * @param  {Function} fn    The function to remove
         * @return {Object}         this
         */
        off: function (event, fn) {
            if (this._events == null) return this;

            if (!event) {
                this._events = {};
            } else if (event && !fn) {
                this._events[event] = [];
            } else if (event && fn) {
                if (this._events[event] != null) {
                    var events = this._events[event];
                    for (var i = 0; i < events.length; i++) {
                        var ev = events[i];
                        if (ev.fn == fn) this._events[event].splice(i, 1);
                    }
                }
            }


        },

        /**
         * Triger an event whith supplied parametres
         * @param  {String} event The event to trigger
         * @param  {...Mixed} args Arguments
         * @return {Object} this
         */
        trigger: function () {
            var args, event;
            event = arguments[0], args = 2 <= arguments.length ? Array.prototype.slice.call(arguments, 1) : [];

            if (this._events == null) {
                this._events = {};
                this._events[event] = [];
                return this;
            }

            var listeners = this._events[event] || [];

            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                listener.fn.apply(listener.context, args);

                if (listener.once) this._events[event].splice(i, 1);
            }

            return this;


        }


    };

    var detailsTemplate = function anonymous(obj) {
        if (!obj) obj = {};
        var p = [],
            print = function () {
                p.push.apply(p, arguments);
            };
        with(obj) {
            p.push('<div class=\"fm-resource-details-container\">\n  <div class=\"fm-resource-details-thumbnail-container\">\n    <img />\n  </div>\n  <div class=\"fm-resource-details-info-container\">\n    <h5>', path, '</h5>\n    <span class=\"info\"><b>Size: </b>', size, ' kb</span>\n    <span class=\"info\"><b>Type: </b>', mime, '</span>\n  </div>\n</div>\n');
        }
        return p.join('');
    };

    var listitemTemplate = function anonymous(obj) {
        if (!obj) obj = {};
        var p = [],
            print = function () {
                p.push.apply(p, arguments);
            };
        with(obj) {
            p.push('<div>\n  <div class=\"fm-resource-item-thumbnail\">\n    <!--<img class=\"fm-resource-thumbnail\"/>-->\n  </div>\n\n\n  <span>', path, '</span>\n</div>\n');
        }
        return p.join('');
    };

    var listTemplate = function anonymous(obj) {
        if (!obj) obj = {};
        var p = [],
            print = function () {
                p.push.apply(p, arguments);
            };
        with(obj) {
            p.push('<div class=\"fm-resource-list-container\">\n  <div class=\"fm-resource-list-toolbar\">\n    <button type=\"button\" class=\"fm-toolbar-btn list-btn\" title=\"List view\">\n        <i class=\"icon list-icon\"></i>\n    </button>\n    <button type=\"button\" class=\"fm-toolbar-btn collection-btn\" title=\"Grid view\">\n      <i class=\"icon grid-icon\"></i>\n    </button>\n    <button type=\"button\" class=\"fm-toolbar-btn search-btn\" title=\"Grid view\">\n      <i class=\"icon search-icon\"></i>\n    </button>\n  </div>\n  <div class=\"progress-bar\">\n    <div class=\"progress\">\n\n    </div>\n  </div>\n  <input type=\"search\" class=\"search-input\"/>\n  <div class=\"fm-resource-list-container-inner\">\n    <ul class=\"fm-resource-list\">\n  </div>\n\n  </ul>\n</div>\n');
        }
        return p.join('');
    };

    var viewTemplate = function anonymous(obj) {
        if (!obj) obj = {};
        var p = [],
            print = function () {
                p.push.apply(p, arguments);
            };
        with(obj) {
            p.push('<div class=\"fm-container\">\n  <div class=\"fm-container-inner\">\n    <div class=\"fm-list-container\">\n\n    </div>\n    <div class=\"fm-details-container\">\n    </div>\n  </div>\n</div>\n');
        }
        return p.join('');
    };


    /**
     * @callback uploadCallback
     * @param {Error} error
     * @param {Object} response
     */


    var FileUpload = (function () {

        Utils.extend(FileUpload.prototype, Resource.Events);

        /**
         * [FileUpload description]
         * @namespace Client
         * @param {Object} options options
         * @param {Number|Function} [options.maxSize=1024]
         * @param {String|Array|Function} [options.mimeTypes=*]
         * @param {String} [options.param=file]
         * @mixes BaseClass
         * @constructor FileUpload
         * @example
         * var fileUpload = new FileUpload();
         * fileUpload.upload(file, {
         * 	additional_attribute: "Some value"
         * }, function (err, response) {
         *
         * }).on('progress', function (file, progress) {
         *
         * });
         */

        function FileUpload(options) {
            this.options = options || {};
        }

        /**
         * Upload files
         * @param  {File}   file            The file to Upload
         * @param  {Object}  [attributes]   Additional attributes to send
         * @param  {uploadCallback} [done]        Callback function when done
         * @fires  FileUpload#progress
         * @fires  FileUpload#complete
         * @fires  FileUpload#error
         * @memberOf FileUpload
         */
        FileUpload.prototype.upload = function (file, attributes, done) {

            var self = this,
                formData = new FormData();

            var ret = validateFile.call(this, file);

            if (ret) {
                this.trigger('error', file, ret);
                return;
            }

            formData.append(this.options.param, file);

            attributes = attributes ||   {};

            Object.keys(attributes).forEach(function (key) {
                var value = attributes[key];
                formData.append(key, value);
            });

            var xhr = Ajax();

            xhr.open(this.options.method, this.options.url);

            xhr.onerror = function (e) {
                // TODO: Handle event!
                var error = {
                    code: xhr.status,
                    message: formatResponse(xhr.responseText)
                };
                self.trigger('error', file, error);
            };

            xhr.onreadystatechange = function () {

                if (xhr.readyState == 4) {
                    var response = formatResponse(xhr.responseText);

                    if (xhr.status == 200 || xhr.status == 201) {
                        if (done) done(null, response);
                        self.trigger('complete', file, response);
                    } else {
                        if (done) done(response, null);
                        self.trigger('error', file, response);
                    }
                }

            };

            xhr.upload.onprogress = function (event) {
                if (event.lengthComputable) {
                    var progress = (event.loaded / event.total * 100 || 0);
                    self.trigger('progress', file, progress);
                }
            };

            xhr.send(formData);

            return this;

        };


        function formatResponse(response) {
            var ret = null;
            try {
                ret = JSON.parse(response);
            } catch (e) {
                ret = response;
            }
            return ret;

        }

        function validateFile(file) {
            if (typeof this.options.maxSize === 'function') {
                if (!this.options.maxSize(file)) return new Error('file too big');
            } else if (file.size > this.options.maxSize) {
                return new Error('File too big');
            }

            var type = file.type;

            var mimeTypes = this.options.mimeType;
            if (!mimeTypes) return;

            if (typeof mimeTypes === 'function') return mimeTypes(file);

            if (!Array.isArray(mimeTypes)) mimeTypes = [mimeTypes];

            var error = null;
            for (var i = 0; i < mimeTypes.length; i++) {
                mime = new RegExp(mimeTypes[i].replace('*', '.*'));
                if (mime.test(type)) return null;
                else error = new Error('Wrong mime type');
            }
            return error;

        }

        /**
         * FileUpload defaults
         * @type {Object}
         * @memberOf FileUpload
         */
        FileUpload.defaults = {
            /**
             * Max size of uploaded file
             * @property {Number|Function}
             */
            maxSize: 1024,
            // size in kb or function
            /**
             * Allowed mime mimeTypes
             * @property {String|Array<String>|Function}
             */
            mimeType: null,
            // string, array or function
            param: 'file'
        };


        /**
         * @event FileUpload#progress
         * @type {object}
         */

        /**
         * @event FileUpload#complete
         * @param {File} file
         * @param {Object} response
         */

        /**
         * @event FileUpload#error
         * @param {File} file
         * @param {Object} response
         */

        return FileUpload;



    })();


    var UploadButton = (function () {

        Utils.extend(UploadButton.prototype, Resource.Events);

        /**
         * UploadButton
         * @param {Element} elm     Html element
         * @param {Object} options  Options
         * @param {String} options.url
         * @param {Number|Function} options.maxSize
         * @param {String|Array|Function} options.mimeType
         *
         * @mixes BaseClass
         * @constructor UploadButton
         */

        function UploadButton(elm, options) {
            this.options = options || {};
            this._executing = false;
            this.files = [];
            this.el = elm;
            this.options = options;

            this._upload = new FileUpload(options);

            this._upload.on('complete', _.bind(onComplete, this));
            this._upload.on('progress', _.bind(onProgress, this));
            this._upload.on('error', _.bind(onError, this));

            var self = this;

            elm.addEventListener('change', function (e) {
                self.files = [];

                for (var i = 0; i < elm.files.length; i++) {
                    self.files.push(elm.files[i]);
                }


                self.upload();

            });
        }


        UploadButton.prototype.upload = function () {
            var errors = {},
                self = this;
            this._executing = true;
            this.trigger('start');
            eachAsync(this.files, function (file, next) {
                self._upload.upload(file, {}, next);
            }, function () {

            });

        };

        UploadButton.prototype.dispose = function () {
            this._upload.off();
            this.el.removeEventListener('change');
            self._upload = null;
        };


        function onError(file, error) {

            this.trigger('error', file, error);
        }

        function onComplete(file, response) {
            this.trigger('complete', file, response);
        }

        function onProgress(file, progress) {
            this.trigger('progress', file, progress);
        }

        var eachAsync = function (items, next, callback) {
            if (!Array.isArray(items)) throw new TypeError('each() expects array as first argument');
            if (typeof next !== 'function') throw new TypeError('each() expects function as second argument');
            if (typeof callback !== 'function') callback = Function.prototype; // no-op
            if (items.length === 0) return callback(undefined, items);

            var transformed = new Array(items.length);
            var count = 0;
            var returned = false;

            items.forEach(function (item, index) {
                next(item, function (error, transformedItem) {
                    if (returned) return;
                    if (error) {
                        returned = true;
                        return callback(error);
                    }
                    transformed[index] = transformedItem;
                    count += 1;
                    if (count === items.length) return callback(undefined, transformed);
                });
            });
        };


        return UploadButton;


    })();



    var Model = (function () {
        Utils.extend(Model.prototype, Resource.Events);

        function Model(options) {
            this.attributes = options;
        }

        Utils.extend(Model.prototype, {
            toJSON: function () {
                return Utils.extend({}, this.attributes);
            },
            get: function (key) {
                return this.attributes[key];
            },
            set: function (k, v) {
                this.attributes[k] = v;
            }
        });

        return Model;
    })();


    var Collection = (function () {

        Utils.extend(Collection.prototype, Resource.Events);

        function Collection(options) {
            this.options = options || {};
            this.models = [];
        }

        Utils.extend(Collection.prototype, {
            fetch: function (options) {
                options = options || {};
                var self = this,
                    url = Utils.result(this, 'url'),
                    silent = options.silent || false,
                    success = options.success,
                    error = options.error;

                Sync({
                    url: url,
                    type: 'GET',
                    success: function (data) {
                        self.models = Utils.map(data, function (m) {
                            var model = new self.model(m);
                            if (!silent) self.trigger('add', model, self);
                            return model;
                        });
                        if (success) success(self, data, options);
                        self.trigger('sync', self, data, options);

                    },
                    error: function (xhr, status, error) {
                        if (error) error(xhr, status, error);
                    }
                });
            },
            remove: function (model, options) {
                var url = Utils.result(this, 'url');
                url += '/' + model.get('id');
                Sync({
                    url: url,
                    type: 'DELETE'
                });
                this.trigger('remove', model, this);
            },
            add: function () {}
        });

        return Collection;

    })();



    var MediaCollection = (function (__super) {

        Inherits(MediaCollection, __super);

        function MediaCollection(options) {
            options = options || {};
            this.model = Model;
            Utils.extend(this, Utils.pick(options, ['url']));
            __super.prototype.constructor.call(this);
        }

        return MediaCollection;

    })(Collection);


    var BaseView = (function () {

        Utils.extend(BaseView.prototype, Resource.Events);

        function BaseView(options) {
            options = options || {};

            this.tagName = options.tagName || this.tagName || 'div';
            this.className = options.className || this.className;
            this.setElement();

            this.model = options.model || null;
            this.collection = options.collection || null;
            this.events = this.events || {};

            var self = this;
            var events = {};

            // Normalize events;
            Utils.each(this.events, function (value, key) {
                if (Utils.isString(value)) value = self[value];
                events[key] = Utils.bind(value, self);
            });
            this.events = events;
            this.delegateEvents();
        }

        Utils.extend(BaseView.prototype, {
            setElement: function () {
                this.el = document.createElement(this.tagName);
                this.$el = Resource.$(this.el);

                if (this.className) this.$el.addClass(this.className);

            },
            render: function () {
                this.delegateEvents();
                return this;
            },
            remove: function () {
                this.undelegateEvents();
                this.el.parentNode.removeChild(this.el);
                if (this.collection) {
                    this.collection.off();
                }
                if (this.model) {

                    //this.model.off();
                }
            },
            undelegateEvents: function () {
                var self = this;
                Utils.each(this.events, function (value, key) {
                    split = key.split(' ');

                    if (split.length === 1) {
                        self.$el.off(split[0], value);
                    } else {
                        var event = split[0];
                        var selector = split[1];

                        self.$(selector).off(event, value);
                    }
                });
            },
            delegateEvents: function () {
                var self = this;
                this.undelegateEvents();

                Utils.each(this.events, function (value, key) {

                    split = key.split(' ');
                    var event = split[0];

                    if (split.length === 1) {
                        self.$el.on(event, value);
                    } else {
                        var selector = split[1];
                        self.$(selector).on(event, value);

                    }
                });
            },
            $: function (selector) {
                return this.$el.find(selector);
            }
        });


        return BaseView;

    })();


    var ListItemView = (function (__super) {

        Inherits(ListItemView, __super);

        function ListItemView(options) {
            this.tagName = 'li';
            __super.prototype.constructor.call(this, options);

            this.template = listitemTemplate;
        }

        Utils.extend(ListItemView.prototype, {
            events: {
                'click': function (e) {
                    this.trigger('select', this);
                }
            },
            render: function () {
                var json = this.model.toJSON();
                if (json.path.length > 30) json.path = json.path.substring(0, 30) + '...';
                this.$el.html(this.template(json));
                this.delegateEvents();
                return this;
            },
            remove: function () {
                __super.prototype.remove.call(this);
            }
        });

        return ListItemView;

    })(BaseView);


    var ListView = (function (__super) {

        Inherits(ListView, __super);

        var MimeTypes = {
            'application/pdf': 'pdf-mime-icon',
            'image/png': function (model) {
                var img = CreateElement('img').attr('src', model.get('url'));
                return img;
            }
        };

        function ListView(options) {
            options = options || {};

            __super.prototype.constructor.call(this, options);

            this.options = Utils.extend({}, options, ListView.defaults);

            this.onStyleButton = Utils.bind(this.onStyleButton, this);

            this.template = this.options.template || listTemplate;

            var self = this;

            this._items = [];

            this.bindEvents();
        }

        ListView.prototype.render = function () {

            this.$el.html(this.template());
            this._listView = this.$('.fm-resource-list');
            this._search = this.$('.search-input');

            this.progressBar = this.$('.progress-bar');
            this.progressBar.find('.progress').css({
                width: '0%'
            });

            this.delegateEvents();

            this._listView.addClass(this.options.style + '-style');
            return this;
        };

        ListView.prototype.onStyleButton = function (e) {
            var $el = Resource.$(e.target);
            if ($el.hasClass('collection-btn')) {
                this._listView.removeClass('list-style').addClass('collection-style');
            } else {
                this._listView.removeClass('collection-style').addClass('list-style');
            }
        };

        ListView.prototype.renderItems = function () {

            Utils.each(this._items, function (item) {
                item.remove();
            });

            this._items = [];

            var self = this;
            var fragment = document.createDocumentFragment();

            Utils.each(this.collection.models, function (model) {
                var item = self.renderItem(model);
                fragment.appendChild(item.el);
                if (!self.filterFunc(item, model)) {
                    item.$el.addClass('hidden');
                }

            });

            this._listView.append(fragment);
        };

        ListView.prototype.filter = function () {
            var self = this;
            Utils.each(this._items, function (item) {
                if (self.filterFunc(item, item.model)) {
                    item.$el.removeClass('hidden');
                } else {
                    item.$el.addClass('hidden');
                }
            })
        };

        ListView.prototype.filterFunc = function (item, model) {
            var value = this._search.val();
            if (value && value !== '') {
                var reg = new RegExp(value, 'i');
                if (reg.test(model.toJSON().path)) {
                    return true;
                }
                return false;
            }

            return true;
        };

        ListView.prototype.renderItem = function (model) {
            var item = new ListItemView({
                model: model,
                className: 'fm-resource-item id-' + model.id
            });
            var self = this;

            item.on('select', function (_item) {

                Utils.each(self._items, function (i) {
                    i.$el.removeClass('selected');
                });

                _item.$el.addClass('selected');

                self.trigger('select', _item.model);
                self.selected = _item;

            });

            item.render();

            if (model.get('type') === 'file') {

                var c = MimeTypes[model.get('mime')];

                var i = item.$('.fm-resource-item-thumbnail');
                var image;
                if (Utils.isFunction(c)) {
                    image = c(model).addClass('fm-resource-thumbnail');
                } else {
                    image = CreateElement('i').addClass('fm-resource-thumbnail icon ' + c);
                }


                i.append(image);
            }

            self._items.push(item);

            return item;
        };


        ListView.prototype.events = {
            'click .collection-btn': 'onStyleButton',
            'click .list-btn': 'onStyleButton',
            'keyup .search-input': function () {
                this.filter();
            }
        };

        ListView.prototype.bindEvents = function () {
            this.collection.off();
            var self = this;
            this.collection.on('change', function () {
                self.renderItems.call(self);
            });

            this.collection.on('add', function (model, collection) {
                var item = self.renderItem(model);
                self._listView.append(item.el);
            });

            this.collection.on('remove', function (model, collection) {
                var item = null;
                for (var i = 0; i < self._items.length; i++) {
                    item = self._items[i];

                    if (item.model == model) break;
                    item = null;
                }

                if (item) {
                    item.$el.addClass('deleting');
                    setTimeout(function () {
                        item.remove();
                    }, 400);
                }
            });
        };

        ListView.prototype.remove = function () {
            __super.prototype.remove.call(this);

            Utils.each(this.items, function (item) {
                item.remove();
            });
        };

        ListView.defaults = {
            style: 'list'
        };

        return ListView;

    })(BaseView);


    var DetailsView = (function (__super) {

        Inherits(DetailsView, __super);

        function DetailsView(options) {
            options = options || {};
            __super.prototype.constructor.call(this, options);

            this.options = options;

            this.template = this.options.template || detailsTemplate;
        }

        Utils.extend(DetailsView.prototype, {
            render: function () {
                var json = this.model ? this.model.toJSON() : {
                    path: null,
                    size: null,
                    mime: null
                };

                this.$el.html(this.template(json));
                return this;
            }
        });

        return DetailsView;

    })(BaseView);


    var ManagerView = (function (__super) {
        Inherits(ManagerView, __super);

        function ManagerView(options) {
            options = options || {};
            __super.prototype.constructor.call(this, options);

            this.options = options;

            this.collection = new MediaCollection({
                url: 'files'
            });

            this.template = this.options.template || viewTemplate;

            this.listView = new ListView({
                collection: this.collection
            });

            var self = this;
            this.detailsView = new DetailsView({});

            this.listView.on('select', function (model) {
                self.detailsView.model = model;
                self.detailsView.render();
            });
        }

        Utils.extend(ManagerView.prototype, {
            events: {
                'click .remove-btn': 'onItemRemove',
                'click .add-btn': 'onItemAdd',
            },
            render: function () {
                this.undelegateEvents();

                if (this.upload) {
                    this.upload.off();
                }

                this.$el.html(this.template({}));

                var list = this.$('.fm-list-container');
                list.append(this.listView.render().el);

                var toolbar = this.$('.fm-resource-list-toolbar');


                /* Remove Button */
                var button = CreateElement('button').attr({
                    'type': 'button',
                    'title': 'Remove item'
                }).addClass('fm-toolbar-btn remove-btn');

                var icon = CreateElement('i').addClass('icon remove-icon');
                button.append(icon);

                toolbar.append(button);


                /* Upload button */
                var div = CreateElement('div').addClass('file-btn add-btn');
                button = CreateElement('button').attr({
                    type: 'button',
                    title: 'Upload file'
                }).addClass('fm-toolbar-btn');
                div.append(button);

                var input = CreateElement('input').attr({
                    type: 'file'
                }).addClass('file-input');
                div.append(input);

                icon = CreateElement('i').addClass('icon add-icon');
                button.append(icon);

                toolbar.append(div);

                this.upload = new UploadButton(input[0], {
                    url: 'file-upload',
                    method: 'POST',
                    maxSize: 1024 * 1024 * 200,
                    mimeType: ['image/*', 'application/pdf']
                });

                var self = this;
                this.upload.on('progress', function (file, progress) {
                    self.listView.progressBar.find('.progress').css({
                        width: progress + '%'
                    });
                }).on('start', function () {
                    button.addClass('disabled');
                    input[0].disabled = true;
                }).on('error', function (file, error) {
                    button.removeClass('disabled');
                    input[0].disabled = false;
                    alert(error);
                }).on('complete', function (file, response) {
                    setTimeout(function () {
                        self.listView.progressBar.find('.progress').css({
                            width: '0%'
                        });
                        self.collection.fetch();
                        button.removeClass('disabled');
                        input[0].disabled = false;
                    }, 1000);

                });


                var details = this.$('.fm-details-container');
                details.append(this.detailsView.render().el);

                this.delegateEvents();

                return this;
            },
            onItemRemove: function (e) {
                this.collection.remove(this.listView.selected.model);
            },

            onItemAdd: function (e) {

            },
            remove: function () {
                __super.prototype.remove.call(this);
                this.listView.remove();
                if (this.upload) this.upload.off();
            }
        });

        return ManagerView;

    })(BaseView);

    Resource.UploadButton = UploadButton;
    Resource.ListView = ListView;
    Resource.ManagerView = ManagerView;

    return Resource;

}));