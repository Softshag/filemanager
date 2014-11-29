
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
  function FileUpload (options) {
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

    var ret = validateFile.call(this,file);

    if (ret) {
      this.trigger('error',file, ret);
      return;
    }

    formData.append(this.options.param,file);

    attributes = attributes || {};

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
        self.trigger('error',file, error);
    };

    xhr.onreadystatechange = function () {

      if (xhr.readyState == 4) {
        var response = formatResponse(xhr.responseText);

        if (xhr.status == 200 || xhr.status == 201) {
          if (done) done(null,response);
          self.trigger('complete', file, response);
        } else {
          if (done) done(response,null);
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


  function formatResponse (response) {
    var ret = null;
    try {
      ret = JSON.parse(response);
    } catch (e) {
      ret = response;
    }
    return ret;

  }

  function validateFile (file) {
    if (typeof this.options.maxSize === 'function') {
      if (!this.options.maxSize(file))
        return new Error('file too big');
    } else if (file.size > this.options.maxSize) {
      return new Error('File too big');
    }

    var type = file.type;

    var mimeTypes = this.options.mimeType;
    if (!mimeTypes) return;

    if (typeof mimeTypes === 'function')
      return mimeTypes(file);

    if (!Array.isArray(mimeTypes))
      mimeTypes = [mimeTypes];

    var error = null;
    for (var i = 0; i < mimeTypes.length; i++ ) {
      mime = new RegExp(mimeTypes[i].replace('*','.*'));
      if (mime.test(type))
        return null;
      else
        error = new Error('Wrong mime type');
    }
    return error;

  }

  /**
   * FileUpload defaults
   * type {Object}
   * @memberOf FileUpload
   */
  FileUpload.defaults = {
    /**
     * Max size of uploaded file
     * @property {Number|Function}
     */
    maxSize: 1024, // size in kb or function
    /**
     * Allowed mime mimeTypes
     * @property {String|Array<String>|Function}
     */
    mimeType: null, // string, array or function
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
