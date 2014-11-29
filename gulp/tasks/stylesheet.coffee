
gulp = require 'gulp'
stylus = require 'gulp-stylus'
axis = require 'axis'
config = require '../config'
rename = require 'gulp-rename'
sprite = require('css-sprite').stream

gulp.task 'build:styles', ['sprite'], ->
  gulp.src './src/client/styles/style.styl'
  .pipe stylus(use: axis())
  .pipe rename(config.fileName + '.css')
  .pipe gulp.dest 'dist'

gulp.task 'sprite', ->
  gulp.src './src/images/*.png'
  .pipe sprite
    base64: yes
    style: 'images.styl'
    processor: 'stylus'
  .pipe gulp.dest './src/client/styles'
