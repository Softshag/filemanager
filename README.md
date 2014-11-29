### jQuery Form


### Example

```html

<form>
  <input type="text" name="text" required="required" />
  <input type="text" name="email" />
  <select name="select">
    <option value="1">Option 1</option>
  </select>
  <textarea name="textarea" data-form-validate="isLength" data-form-validate-args="10,50"></textarea>
</form>

```


```javascript

$('form').form({
  attr: '[name]'
  editors: {
    email: {
      validators: [
        {
          validator: 'isEmail'
        }
      ]
    }
  }
});

$('form').on('form:change', function (e, form, editor) {

  console.log('Editor: ' + editor.name + ' changed: ' + editor.val());

}).on ('form:invalid', function (e, form, editor, errors) {

  console.log('Editor: ' + editor.name + ' is invalid!')
  errors.forEach(function (error) {
    console.log(error.message);
  });

});


console.log('Current value: ' + $('form').form('val'));


```
