
var ListItemView = (function (__super) {

  Inherits(ListItemView,__super);

  function ListItemView (options) {
    this.tagName = 'li';
    __super.prototype.constructor.call(this, options);

    this.template = listitemTemplate;
  }

  Utils.extend(ListItemView.prototype, {
    events: {
      'click' : function (e) {
        this.trigger('select', this);
      }
    },
    render: function () {
      var json = this.model.toJSON();
      if (json.path.length > 30)
        json.path = json.path.substring(0,30) + '...';
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
