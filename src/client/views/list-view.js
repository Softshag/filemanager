
var ListView = (function (__super) {

  Inherits(ListView, __super);

  var MimeTypes = {
    'application/pdf' : 'pdf-mime-icon',
    'image/png' : function (model) {
      var img = CreateElement('img')
      .attr('src',model.get('url'));
      return img;
    }
  };

  function ListView (options) {
    options = options || {};

    __super.prototype.constructor.call(this, options);

    this.options = Utils.extend({}, options,ListView.defaults);

    this.onStyleButton = Utils.bind(this.onStyleButton, this);

    this.template = this.options.template || listTemplate;

    var self = this;

    this._items = [];

    this.bindEvents();
  }

  ListView.prototype.render = function () {
    this.undelegateEvents();

    this.$el.html(this.template());
    this._listView = this.$('.fm-resource-list');
    this._search = this.$('.search-input');

    this.progressBar = this.$('.progress-bar');
    this.progressBar.find('.progress').css({width: '0%'});

    this.delegateEvents();

    this._listView.addClass(this.options.style + '-style');

    return this;
  };

  ListView.prototype.onStyleButton = function (e) {
    var $el = Resource.$(e.target);
    if ($el.hasClass('collection-btn')) {
      this._listView.removeClass('list-style').addClass('collection-style');
    } else  {
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
        image = c(model)
        .addClass('fm-resource-thumbnail');
      } else {
        image = CreateElement('i')
        .addClass('fm-resource-thumbnail icon ' + c);
      }


      i.append(image);
    }

    self._items.push(item);

    return item;
  };


  ListView.prototype.events = {
    'click .collection-btn' : 'onStyleButton',
    'click .list-btn' : 'onStyleButton',
    'keyup .search-input' : function () {
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

        if (item.model == model)
          break;
        item = null;
      }

      if (item) {
        item.$el.addClass('deleting');
        setTimeout(function () {
          item.remove();
        },400);
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
