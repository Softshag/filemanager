

var ToolBar = (function () {

  Inherits(ToolBar, BaseView);

  function ToolBar (options) {

  }

  Utils.extend(ToolBar.prototype, {
    tagName: 'ul',
    addItem: function (options) {
      var $elm = CreateElement('li');
    },
    addCustomItem: function (elm) {
      
    }
  });

  return Toolbar;

});
