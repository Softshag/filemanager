# FileManager


```javascript

var fileManager = new Resource.ManagerView({
  url: 'files',
  mimeType: ['image/*'],
  maxSize: 1024*1024*20
});

$('.fm').append(fileManager.render().el);

```
