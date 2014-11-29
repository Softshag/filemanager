
var EventEmitter = require('events').EventEmitter,
  _ = require('underscore'),
  util = require('util'),
  Path = require('path'),
  fs = require('fs');

module.exports = (function (_super) {

  util.inherits(FileStore, _super);
  var idCounter = 0;

  function FileStore (options) {
    options = options || {};

    this.options = _.extend({}, FileStore.defaults, options);

    load.call(this);
    this._store = this._store || [];
  }

  _.extend(FileStore.prototype, {
    set: function (item, done) {
      item.id = item.id || ++idCounter;
      this._store.push(item);
      save.call(this);
      if (done)
        done(null, item);
    },
    get: function (id, done) {
      for (var i = 0; i < this._store.length; i++) {
        var item = this._store[i];
        if (item.id == id || item.path == id) {

          item.created = item.created instanceof Date ? item.created : new Date(item.created);
          item.updated = item.updated instanceof Date ? item.updated : new Date(item.updated);

          return done(null,item);
        }
      }
      done(null,null);
    },
    all: function (done) {
      done(null, this._store);
    },
    del: function (id, done) {
      for (var i = 0; i < this._store.length; i++) {
        var item = this._store[i];
        if (item.id == id || item.path == id) {
          this._store.splice(i,1);
          save.call(this);
          return done(null,item);
        }
      }
      done(null,null);
    },
    update: function (id, attributes, done) {
      var self = this;
      this.get(id, function (error, item) {
        if (error || !item) {
          return done(error, item);
        }

        _.extend(item, attributes);
        save.call(self);
        done(null, item);
      });
    }
  });

  var load = function () {
    if (!fs.existsSync(this.options.destPath)) {
      fs.writeFileSync(this.options.destPath,"[]");
    }
    this._store = require(this.options.destPath);


    _.each(this._store, function (item) {
        if (item.id > idCounter)
          idCounter = item.id;
    });

  };

  var save = function () {
    fs.writeFileSync(this.options.destPath,JSON.stringify(this._store,null,2));
  };

  FileStore.defaults = {
    destPath: Path.join(process.cwd(), 'uploads.json')
  };

  return FileStore;

})(EventEmitter);
