## function declaration

```
function sum(a,b){
	return a+b;
}
```

## function expression

```
var sum = function(a,b){
	return a+b;
};
```

## the different between function declaration and function expression

no matter what place the function declarated , we can call this function.

```
alert(sum(1,2));  //3 no problem

function sum(a,b){
	return a+b;
};

```

but if use function expression,you must make sure the expression is before you call this function,because before the expression execute the variable is undefine.e.g:

```
alert(sum(1,2));  //error

var sum = function(a,b){
	return a+b;
};

```
