_ = require 'underscore'
express = require 'express'

middleware = require('./src/server/upload-middleware')
FileStore = require('./src/server/file-store')
FileManager = require('./src/server/file-manager')

app = express();

fileStore = new FileStore();
fm = new FileManager(fileStore, {});

app.get '/', (req, res, next) ->
  res.sendFile(process.cwd() + '/example/index.html');

app.post '/file-upload', middleware(fm)

app.get '/files/download', (req, res, next) ->
  fileName = req.query.file

  fm.getFile fileName, (err, stream) ->
    console.log(err)
    stream.pipe(res)

app.get '/files/:filename', (req, res, next) ->
  fileName = req.param('filename');
  fm.get fileName, (error, file) ->
    if file?
      file.url = '/files/download?file=' + item.id
    res.send(file);
  #fileUpload.getFile fileName, (error, stream) ->
  #  stream.pipe(res)

app.del '/files/:filename', (req, res, next) ->
  fileName = req.param('filename')
  fm.remove fileName, (error, file) ->
    if error?
      return res.status(500).send(error)
    res.send(file);

app.get '/files', (req, res, next) ->
  fm.list (err, response) ->

    response = _.map response, (item) ->
      item.url = '/files/download?file=' + item.id
      item

    res.send(response)


app.use express.static('bower_components')
app.use express.static('node_modules')
app.use express.static('dist')
app.listen(3000)
