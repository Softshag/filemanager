

var MediaCollection = (function (__super) {

  Inherits(MediaCollection, __super);

  function MediaCollection (options) {
    options = options || {};
    this.model = Model;
    Utils.extend(this, Utils.pick(options, ['url']));
    __super.prototype.constructor.call(this);
  }

  return MediaCollection;

})(Collection);
