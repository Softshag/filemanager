
var DetailsView = (function (__super) {

  Inherits(DetailsView, __super);

  function DetailsView (options) {
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
