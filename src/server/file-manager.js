var EventEmitter = require('events').EventEmitter,
    _ = require('underscore'),
    fs = require('fs'),
    util = require('util');

FileMetaStore = require('./meta/file-json');

module.exports = (function () {

  util.inherits(FileManager, EventEmitter);

  function FileManager (fileStore, options) {
    this.setFileStore(fileStore);
  }


  FileManager.prototype.setFileStore = function (fileStore) {
    if (this._fileStore != null) {
      this._fileStore.off();
    }
    this._fileStore = fileStore;

    //fileStore.on('add', _.bind(this.create, this));
    //fileStore.on('remove', _.bind(this.remove, this));

    this._metaStore = new FileMetaStore();

  };

  _.extend(FileManager.prototype, {
    list: function (done) {
      this._metaStore.all(done);
    },

    get: function (id, done) {
      this._metaStore.get(id, done);
    },
    getFile: function (id, done) {
      var self = this;
      this.get(id, function (err, item) {
        if (err)
          return done(err);
        self._fileStore.get(item.path, done);
      });
    },
    remove: function (id, done) {
      var self = this;
      this._metaStore.get(id, function (err, item) {
        if (item.type !== 'file') {
          self._metaStore.del(item.id, done);
        } else {
          self._fileStore.remove(item.path, function (err, response) {

            if (err) {
              return done(err);
            }

            self._metaStore.del(id, done);
          });
        }
      });
    },

    update: function (id, attributes, done) {
      attributes.updated = new Date();
      this.emit('before:update', attributes);

      var self = this;

      this._metaStore.update(id, attributes, function (err, attributes) {
        self.emit('update',attributes);
        done(err, attributes);
      });
    },

    create: function (attributes, done) {

      attributes.created = attributes.created || new Date();
      attributes.updated = attributes.updated || new Date();

      this.emit('before:create',attributes);

      if (attributes.type === 'file') {
        var stream = fs.createReadStream(attributes.tmpFile);
        var self = this;

        this._fileStore.add(stream, attributes.path, function (err) {
          if (err) {
            return done(err);
          }
          delete attributes.tmpFile;

          self._metaStore.set(attributes, done);

          self.emit('create',attributes);

        });
      } else {
        this._metaStore.set(attributes, done);
        this.emit('create', attributes);
      }

    }

  });


  return FileManager;

})();
