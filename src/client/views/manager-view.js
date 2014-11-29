
var ManagerView = (function (__super) {
  Inherits(ManagerView, __super);

  function ManagerView (options) {
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
    this.detailsView = new DetailsView({
    });

    this.listView.on('select', function (model) {
      self.detailsView.model = model;
      self.detailsView.render();
    });
  }

  Utils.extend(ManagerView.prototype, {
    events: {
      'click .remove-btn' : 'onItemRemove',
      'click .add-btn' : 'onItemAdd',
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
      var button = CreateElement('button').attr({'type':'button','title':'Remove item'})
      .addClass('fm-toolbar-btn remove-btn');

      var icon = CreateElement('i').addClass('icon remove-icon');
      button.append(icon);

      toolbar.append(button);


      /* Upload button */
      var div = CreateElement('div').addClass('file-btn add-btn');
      button = CreateElement('button').attr({type:'button',title:'Upload file'})
      .addClass('fm-toolbar-btn');
      div.append(button);

      var input = CreateElement('input').attr({type:'file'})
      .addClass('file-input');
      div.append(input);

      icon = CreateElement('i').addClass('icon add-icon');
      button.append(icon);

      toolbar.append(div);

      this.upload = new UploadButton(input[0], {
        url: 'file-upload',
        method: 'POST',
        maxSize: 1024* 1024 * 200,
        mimeType: ['image/*','application/pdf']
      });

      var self = this;
      this.upload.on('progress', function (file, progress) {
        self.listView.progressBar.find('.progress').css({width:progress + '%'});
      }).on('start', function () {
        button.addClass('disabled');
        input[0].disabled = true;
      }).on('error', function (file, error) {
        button.removeClass('disabled');
        input[0].disabled = false;
        alert(error);
      }).on('complete', function (file, response) {
        setTimeout(function () {
          self.listView.progressBar.find('.progress').css({width:'0%'});
          self.collection.fetch();
          button.removeClass('disabled');
          input[0].disabled = false;
        },1000);

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
      if (this.upload)
        this.upload.off();
    }
  });

  return ManagerView;

})(BaseView);
