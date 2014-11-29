

var Model = (function () {
  Utils.extend(Model.prototype, Resource.Events);

  function Model (options) {
    this.attributes = options;
  }

  Utils.extend(Model.prototype, {
    toJSON: function () { return Utils.extend({},this.attributes); },
    get: function (key) { return this.attributes[key]; },
    set: function (k, v) { this.attributes[k] = v; }
  });

  return Model;
})();
