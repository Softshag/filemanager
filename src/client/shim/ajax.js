// Backbone.NativeAjax.js 0.3.0
// ---------------

//     (c) 2014 Adam Krebs, Paul Miller, Exoskeleton Project
//     Backbone.NativeAjax may be freely distributed under the MIT license.
//     For all details and documentation:
//     https://github.com/akre54/Backbone.NativeAjax
// Make an AJAX request to the server.
// Usage:
//   var req = Backbone.ajax({url: 'url', type: 'PATCH', data: 'data'});
//   req.then(..., ...) // if Promise is set
var Sync = (function() {
  var xmlRe = /^(?:application|text)\/xml/;
  var jsonRe = /^application\/json/;

  var getData = function(accepts, xhr) {
    if (accepts == null) accepts = xhr.getResponseHeader('content-type');
    if (xmlRe.test(accepts)) {
      return xhr.responseXML;
    } else if (jsonRe.test(accepts) && xhr.responseText !== '') {
      return JSON.parse(xhr.responseText);
    } else {
      return xhr.responseText;
    }
  };

  var isValid = function(xhr) {
    return (xhr.status >= 200 && xhr.status < 300) ||
    (xhr.status === 304) ||
    (xhr.status === 0 && window.location.protocol === 'file:')
  };

  var end = function(xhr, options, resolve, reject) {
    return function() {
      if (xhr.readyState !== 4) return;

      var status = xhr.status;
      var data = getData(options.headers && options.headers.Accept, xhr);

      // Check for validity.
      if (isValid(xhr)) {
        if (options.success) options.success(data);
        if (resolve) resolve(data);
      } else {
        var error = new Error('Server responded with a status of ' + status);
        if (options.error) options.error(xhr, status, error);
        if (reject) reject(xhr);
      }
    }
  };

  return function(options) {
    if (options == null) throw new Error('You must provide options');
    if (options.type == null) options.type = 'GET';

    var resolve, reject, xhr = Ajax();//new XMLHttpRequest();
    var PromiseFn = Sync.Promise || (typeof Promise !== null && Promise);
    var promise = PromiseFn && new PromiseFn(function(res, rej) {
      resolve = res;
      reject = rej;
    });

    if (options.contentType) {
      if (options.headers == null) options.headers = {};
      options.headers['Content-Type'] = options.contentType;
    }

    // Stringify GET query params.
    if (options.type === 'GET' && typeof options.data === 'object') {
      var query = '';
      var stringifyKeyValuePair = function(key, value) {
        return value == null ? '' :
        '&' + encodeURIComponent(key) +
        '=' + encodeURIComponent(value);
      };
      for (var key in options.data) {
        query += stringifyKeyValuePair(key, options.data[key]);
      }

      if (query) {
        var sep = (options.url.indexOf('?') === -1) ? '?' : '&';
        options.url += sep + query.substring(1);
      }
    }

    xhr.addEventListener('readystatechange', end(xhr, options, resolve, reject));
    xhr.open(options.type, options.url, true);

    var allTypes = "*/".concat("*");
    var xhrAccepts = {
      "*": allTypes,
      text: "text/plain",
      html: "text/html",
      xml: "application/xml, text/xml",
      json: "application/json, text/javascript"
    };
    xhr.setRequestHeader(
      "Accept",
      options.dataType && xhrAccepts[options.dataType] ?
      xhrAccepts[options.dataType] + (options.dataType !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
      xhrAccepts["*"]
    );

    if (options.headers) for (var key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }
    if (options.beforeSend) options.beforeSend(xhr);
    xhr.send(options.data);

    return promise;
  };
})();
