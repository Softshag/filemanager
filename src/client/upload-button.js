
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
  function UploadButton (elm,options) {
    this.options = options || {};
    this._executing = false;
    this.files = [];
    this.el = elm;
    this.options = options;

    this._upload = new FileUpload(options);

    this._upload.on('complete',_.bind(onComplete,this));
    this._upload.on('progress',_.bind(onProgress,this));
    this._upload.on('error',_.bind(onError,this));

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
      self._upload.upload(file,{},next);
    }, function () {

    });

  };

  UploadButton.prototype.dispose = function () {
    this._upload.off();
    this.el.removeEventListener('change');
    self._upload = null;
  };


  function onError (file, error) {

    this.trigger('error',file, error);
  }

  function onComplete (file,response) {
    this.trigger('complete',file,response);
  }

  function onProgress (file, progress) {
    this.trigger('progress',file, progress);
  }

  var eachAsync = function(items, next, callback) {
    if (!Array.isArray(items)) throw new TypeError('each() expects array as first argument');
    if (typeof next !== 'function') throw new TypeError('each() expects function as second argument');
    if (typeof callback !== 'function') callback = Function.prototype; // no-op

      if (items.length === 0) return callback(undefined, items);

      var transformed = new Array(items.length);
      var count = 0;
      var returned = false;

      items.forEach(function(item, index) {
        next(item, function(error, transformedItem) {
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
