
var Collection = (function () {

  Utils.extend(Collection.prototype, Resource.Events);

  function Collection (options) {
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
        url:url,
        type:'GET',
        success: function (data) {
          self.models = Utils.map(data, function (m) {
            var model = new self.model(m);
            if (!silent)
              self.trigger('add', model, self);
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
      Sync({url:url,type:'DELETE'});
      this.trigger('remove',model, this);
    },
    add: function () {}
  });

  return Collection;

})();
