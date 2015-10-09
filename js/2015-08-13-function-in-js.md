## callee

arguments.callee is the reference of the function

## caller

functionName.caller is the reference of the function which calling this function

## function property and method

we know in ECMAScript the function is Object , so function has its property and method.

+ length:the number of function's argument wish received 
+ prototype:this Object keeps methods,such as `toString` and `valueOf`

+ apply: set this of the function,accept two arguments, the first is `this` the second one is a array Object or arguments Object.
+ call:same as apply but the second argument is not a array,you can give any number of parament one by one.

### the power of call and apply

example:

```
window.color = 'red';
var o = {color:'green'};
function sayColor(){
	console.log(this.color);
}

sayColor(); // red  this == window
sayColor.call(window); // red this == window
sayColor.call(o); //green this == o
```

*if no parament gived,the default this will be global*

+ bind : return a function which is same as original but the value of this is changed to parament.e.g:

```
window.color = 'red';
function sayColor(){
	alert(this.color);
}

var o = {color:'green'};
var sayObjectColor = sayColor.bind(o);
sayObjectColor();   //green
```
