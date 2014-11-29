
var EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    util = require('util'),
    Path = require('path'),
    fs = require('fs');


module.exports = (function (_super) {

  util.inherits(FileStore,EventEmitter);

  /**
   * Filestore
   * @param {Object} options Description
   * @constructor FileStore
   */
  function FileStore (options) {
    options = options || {};

    this.options = _.extend({}, FileStore.defaults, options);
  }


  _.extend(FileStore.prototype, {
    /**
     * Add a file to the Filestore
     * @param {Object}   file The file Object
     * @param {String}   path To which the path to save the FileStore
     * @param {Function} done Done callback
     * @memberOf FileStore
     */
    add: function (file, path, done) {

      var fullPath = Path.join(this.options.destPath, path);

      file.pipe(fs.createWriteStream(fullPath)).on('finish', function () {

        fs.stat(fullPath, function (err, stats) {
          if (err) {
            return done(err);
          }
          done(null, {
            size: stats.size,
            path: path
          });
        });


      });
    },
    /**
     * Remove a file at Path
     * @param  {String}   path The path to Remove
     * @param  {Function} done Done callback
     * @memberof FileStore
     */
    remove: function (path, done) {
      var fullPath = Path.join(this.options.destPath, path);
      fs.exists(fullPath, function (exists) {
        if (!exists)
          return done(new Error('path does not exists!'));

        fs.unlink(fullPath, done);

      });

    },
    /**
     * Get a file at Path
     * @param  {String}   path The path String
     * @param  {Function} done done
     * @memberof FileStore
     */
    get: function (path, done) {
      var fullPath = Path.join(this.options.destPath, path);

      fs.exists(fullPath, function (exists) {
        if (!exists)
          return done(new Error('path does\'t exists'));

        var stream = fs.createReadStream(fullPath);
        done(null, stream);

      });
    }
  });


  FileStore.defaults = {
    destPath: Path.join(process.cwd(),'uploads')
  };

  return FileStore;

})(EventEmitter);
