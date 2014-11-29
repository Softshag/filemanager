
gulp = require 'gulp'
jsdoc = require 'gulp-jsdoc'


gulp.task 'docs', ->
  gulp.src('./src/client/*.js')
  .pipe jsdoc('docs')
