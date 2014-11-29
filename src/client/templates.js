var detailsTemplate = function anonymous(obj) {
if (!obj) obj = {}; var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<div class=\"fm-resource-details-container\">\n  <div class=\"fm-resource-details-thumbnail-container\">\n    <img />\n  </div>\n  <div class=\"fm-resource-details-info-container\">\n    <h5>', path ,'</h5>\n    <span class=\"info\"><b>Size: </b>', size ,' kb</span>\n    <span class=\"info\"><b>Type: </b>', mime ,'</span>\n  </div>\n</div>\n');}return p.join('');
};

var listitemTemplate = function anonymous(obj) {
if (!obj) obj = {}; var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<div>\n  <div class=\"fm-resource-item-thumbnail\">\n    <!--<img class=\"fm-resource-thumbnail\"/>-->\n  </div>\n\n\n  <span>', path ,'</span>\n</div>\n');}return p.join('');
};

var listTemplate = function anonymous(obj) {
if (!obj) obj = {}; var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<div class=\"fm-resource-list-container\">\n  <div class=\"fm-resource-list-toolbar\">\n    <button type=\"button\" class=\"fm-toolbar-btn list-btn\" title=\"List view\">\n        <i class=\"icon list-icon\"></i>\n    </button>\n    <button type=\"button\" class=\"fm-toolbar-btn collection-btn\" title=\"Grid view\">\n      <i class=\"icon grid-icon\"></i>\n    </button>\n    <button type=\"button\" class=\"fm-toolbar-btn search-btn\" title=\"Grid view\">\n      <i class=\"icon search-icon\"></i>\n    </button>\n  </div>\n  <div class=\"progress-bar\">\n    <div class=\"progress\">\n\n    </div>\n  </div>\n  <input type=\"search\" class=\"search-input\"/>\n  <div class=\"fm-resource-list-container-inner\">\n    <ul class=\"fm-resource-list\">\n  </div>\n\n  </ul>\n</div>\n');}return p.join('');
};

var viewTemplate = function anonymous(obj) {
if (!obj) obj = {}; var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('<div class=\"fm-container\">\n  <div class=\"fm-container-inner\">\n    <div class=\"fm-list-container\">\n\n    </div>\n    <div class=\"fm-details-container\">\n    </div>\n  </div>\n</div>\n');}return p.join('');
};
