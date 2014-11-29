(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["underscore", "backbone"], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('underscore'), require('backbone'));
    } else {
        root.Resource = factory(root._, root.Backbone);
    }
}(this, function (_, Backbone) {


    var Resource = {};

    Resource.$ = Backbone.$;
    Resource.Events = Backbone.Events;

    var BaseView = Backbone.View,
        Collection = Backbone.Collection,
        Model = Backbone.Model,
        Utils = _,
        Sync = Backbone.Sync;

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