
var _ = require('underscore'),
    Path = require('path'),
    Busboy = require('busboy');

var tmp = require('temporary');
var fs = require('fs');

module.exports = function (fileManager) {
  return function (req, res, next) {
    var self = this;

    if (req.method !== 'POST') {
      if (next != null)
        return next();
      res.writeHead(404);
      return res.end();
      }

      var busboy = new Busboy({headers: req.headers});

      output = {
        type: 'file'
      };

      var tmpFile = new tmp.File();

      busboy.on('file', function (fieldName, file, fileName, encoding, mimeType) {
        output.mime = mimeType;
        output.path = fileName;
        file.pipe(fs.createWriteStream(tmpFile.path));
      });

      busboy.on('field', function (fieldName, value, fieldNameTrunc, valueTruc) {
        output[fieldName] = value;
      });

      busboy.on('finish', function () {
        output.tmpFile = tmpFile.path;
        fs.stat(tmpFile.path, function (error, stats) {
          if (error) {
            res.writeHead(500);
            res.end(error.message);
            tmpFile.unlink();
          }
          output.size = stats.size;
          fileManager.create(output, function (error, item) {
            res.writeHead(201, {Connection: 'close'});
            res.end(JSON.stringify(item));
            tmpFile.unlink();
          });
        });

      });

      req.pipe(busboy);

    };

};
