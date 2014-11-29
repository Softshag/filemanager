
gulp = require 'gulp'
sq = require 'streamqueue'
concat = require 'gulp-concat'
wrap = require 'gulp-wrap-umd'
beautify = require 'gulp-beautify'
jsdoc = require 'gulp-jsdoc'
jshint = require 'gulp-jshint'
stylish = require 'jshint-stylish'
jsStringEscape = require('js-string-escape')
es = require 'event-stream'
tap = require('gulp-tap')
path = require('path')
stylus = require('gulp-stylus')
axis = require 'axis'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'

clean = require 'gulp-clean'

gulp.task 'build', ['build:standalone',
  'build:backbone', 'build:jquery','build:styles']


gulp.task 'clean', ->
  gulp.src './dist/*', read: false
  .pipe clean()

gulp.task 'lint', ->
  gulp.src('./src/client/*.js')
  .pipe jshint()
  .pipe jshint.reporter(stylish)


gulp.task 'watch', ['build'], ->
  gulp.watch './src/client/**/*', ['build']

gulp.task 'default', ['lint', 'build', 'docs', 'compress']

requireDir = require('require-dir')
requireDir('./gulp/tasks', { recurse: true })
