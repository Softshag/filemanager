
var BaseView = (function () {

  Utils.extend(BaseView.prototype, Resource.Events);

  function BaseView (options) {
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
      if (Utils.isString(value))
        value = self[value];
      events[key] = Utils.bind(value, self);
    });
    this.events = events;
    this.delegateEvents();
  }

  Utils.extend(BaseView.prototype, {
    setElement: function () {
      this.el = document.createElement(this.tagName);
      this.$el = Resource.$(this.el);

      if (this.className)
        this.$el.addClass(this.className);

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
          self.$el.off(split[0],value);
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
