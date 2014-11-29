
var instantiatePlugin = function () {

}

$.fn.fileManager = function (fn, options) {
  return this.each(function (elm) {
    var plugin = elm.data('fm-plugin');
    if (!plugin) {
      plugin = instantiatePlugin(elm,arguments);
      elm.data('fm-plugin', plugin);

    } else {

    }

  });
};
