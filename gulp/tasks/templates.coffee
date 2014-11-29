
gulp = require 'gulp'
tap = require 'gulp-tap'
jsStringEscape = require('js-string-escape')
concat = require 'gulp-concat'
path = require 'path'
_ = require 'underscore'


template = (str, data) ->
    #// Figure out if we're getting a template, or if we need to
    #// load the template - and be sure to cache the result.
    fn = !/\W/.test(str)
    if fn
      fn = cache[str] = cache[str] or template document.getElementById(str).innerHTML
    else
      #// Generate a reusable function that will serve as a template
      #// generator (and which will be cached).
      fn = new Function("obj",
        "if (!obj) obj = {}; var p=[],print=function(){p.push.apply(p,arguments);};" +

        #// Introduce the data as local variables using with(){}
        "with(obj){p.push('" +

        #// Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'") + "');}return p.join('');")

    #// Provide some basic currying to the user
    return if data then fn( data ) else fn

gulp.task 'build:template', ->

  gulp.src './src/client/templates/*.html'
  .pipe tap (file, t) ->
    baseName = path.basename(file.path, '.html').replace(/-/,'')

    esString = jsStringEscape file.contents.toString()
    str = template(esString).toString()
    str = "var #{baseName}Template = #{str};\n"

    file.contents = new Buffer str

  .pipe concat('templates.js')
  .pipe gulp.dest('./src/client')
