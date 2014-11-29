
gulp = require 'gulp'
uglify = require 'gulp-uglify'
gzip = require 'gulp-gzip'
minifycss = require 'gulp-minify-css'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'

gulp.task 'compress:js', ['build'], ->
  gulp.src('./dist/!(*.min|*.css)')
  .pipe uglify()
  #.pipe gzip()
  .pipe rename (path) ->
    path.basename += '.min'
    return
  .pipe gulp.dest('dist')


gulp.task 'compress:css', ['build:styles'], ->
  gulp.src './dist/!(*.min|*.js)'
  .pipe minifycss()
  #.pipe gzip()
  .pipe rename (path) ->
    path.basename += '.min'
    return
  .pipe gulp.dest 'dist'


gulp.task 'compress', ['compress:js','compress:css']
