

exports.standalone = [
  'utils'
  'shim/ajax'
  'shim/underscore'
  'shim/dom'
  'shim/event-emitter'
  'templates'
  'file-upload'
  'upload-button'
  'shim/model'
  'shim/collection'
  'models/resource-collection'
  'views/view'
  'views/list-item-view'
  'views/list-view'
  'views/details-view'
  'views/manager-view'
  'file-manager-view'
]

exports.backbone = [
  'utils'
  'templates'
  'file-upload'
  'upload-button'
  'models/resource-collection'
  'views/list-item-view'
  'views/list-view'
  'views/details-view'
  'views/manager-view'
  'file-manager-view'
]

exports.jquery = [
  'utils'
  'shim/ajax'
  'shim/underscore'
  'shim/event-emitter'
  'templates'
  'file-upload'
  'upload-button'
  'shim/model'
  'shim/collection'
  'models/resource-collection'
  'views/view'
  'views/list-item-view'
  'views/list-view'
  'views/details-view'
  'views/manager-view'
  'file-manager-view'
]

exports.pkgjson = json = require(process.cwd() + '/package.json')

exports.fileName = json.name.toLowerCase() + "-#{json.version}"
