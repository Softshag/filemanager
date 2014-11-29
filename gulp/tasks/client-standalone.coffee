
gulp = require('gulp')
sq = require 'streamqueue'
concat = require 'gulp-concat'
umdwrap = require 'gulp-wrap-umd'
wrap = require 'gulp-wrapper'
config = require '../config'
beautify = require 'gulp-beautify'
fs = require 'fs'

gulp.task 'build:standalone', ['build:template'], ->

  queue = for file in config.standalone
    gulp.src "./src/client/#{file}.js"

  sq {objectMode: yes}, queue...
  .pipe concat config.fileName + '.js'
  .pipe wrap
    header: fs.readFileSync './wraps/header-standalone.js', 'utf-8'
    footer: fs.readFileSync './wraps/footer-standalone.js', 'utf-8'
  .pipe umdwrap
    exports: 'Resource'
    namespace: 'Resource'

  .pipe beautify()
  .pipe gulp.dest('./dist')

gulp.task 'build:backbone', ['build:template'], ->
  queue = for file in config.backbone
    gulp.src "./src/client/#{file}.js"

  sq {objectMode: yes}, queue...
  .pipe concat config.fileName + '.backbone.js'
  .pipe wrap
    header: fs.readFileSync './wraps/header-backbone.js', 'utf-8'
    footer: fs.readFileSync './wraps/footer-standalone.js', 'utf-8'
  .pipe umdwrap
    deps: [
      name: 'underscore'
      globalName: '_'
      paramName: '_'
    ,
      name: 'backbone'
      globalName: 'Backbone',
      paramName: 'Backbone'
    ]
    exports: 'Resource'
    namespace: 'Resource'

  .pipe beautify()
  .pipe gulp.dest('./dist')


gulp.task 'build:jquery', ['build:template'], ->
  queue = for file in config.jquery
    gulp.src "./src/client/#{file}.js"


  sq {objectMode: yes}, queue...
  .pipe concat config.fileName + '.jquery.js'
  .pipe wrap
    header: fs.readFileSync './wraps/header-jquery.js', 'utf-8'
    footer: fs.readFileSync './wraps/footer-jquery.js', 'utf-8'
  .pipe umdwrap
    deps: [
      name: 'jquery'
      globalName: '$'
      paramName: '$'
    ]
    exports: 'Resource'
    namespace: 'Resource'

  .pipe beautify()
  .pipe gulp.dest('./dist')
