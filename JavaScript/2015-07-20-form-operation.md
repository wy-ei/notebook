## submit form

```
<input type='submit' value='submit' />
<input type='image' src='graphic.gif' />
<button type='submit'>submit</button>
```

before broswer send data to server a submit event will be trigged.we can verify form at this time.

you can use `form.submit();` submit a form ,if you submit a form ny this way there will don't trigge submit event.

## reset form

```
<input type='reset' value='reset'>
<button type='reset'>reset</button>
```

when user click reset button a reset event will be trigged,you can cancel reset operation at right time , samply use `event.preventDefault();`

## form field

you can get form element at form.element,if you want get first element at in a form you can write code like this :

```
var form = document.getElementById('form1');
var filed1 = form.elements[0];

// or get item by name
var field2 = form.elements['textbox'];
```

if there a more than one element in a form use has same name,you will get a nodeList when you do operation as above.

## form attribution

+ disabled: is this field enable
+ form: a pointer point to form which belonged.
+ name: field's name
+ readOnly
+ tabIndex: you can press table switch between many field,this attribution decide the order.
+ type: field type, `checkbox`,`radio` etc.


## event

+ blur
+ change
+ focus
+ select


## select text

when text box get focus you can use `target.select();` select all the text at the same time.


## operate clipboard

when you paste some text into a text box,will cause paste event.at this time you can get clipboard data.

```
input1.addEventListenr('paste',function(event){
	var clipboardData = event.clipboardData || window.clipboardData;  // in IE clipboardData is a attribution of window
	return clipboardData.getData('text');
});

// other API
// setData
// clearData
```

## HTML5


required

```
<input type="text" name="username" required>
```
type='email' , type='url'

```
<input type="email" name ="email">
```

min,max,step

```
<input type="number" min="0" max="100" step="5" name="count">
```

pattern

```
<input type="text" pattern="\d+" name="count">
```

check valid

you can use `document.forms['formname'].checkValidity()` check is this form is valid.
