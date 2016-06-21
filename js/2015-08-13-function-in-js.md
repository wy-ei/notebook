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

*if no parament was gived,the default this will be global*

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

### 默认值

#### 基本用法

```javascript
function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}
```

#### 结合结构赋值

```javascript
let foo = ({a = 1,c}) => {
    return [a,c];
}
let ret = foo({c:3}); // [1,3];
```

**函数的length属性**

当函数设置了默认值以后,length 属性就不再是函数的参数的个数了,而是没有设置默认值的参数的个数

```javascript
function f(a, b ,c = 3 ,d = 4) {
}
f.length -> 2
```

#### REST 参数

```javascript
var sum = function(...value){
    return value.reduce((pre,curr)=>{
        return pre + curr
    },0);
}

// rest参数的逆运算:
sum(...[1,2,3,4]) // -> 10
```


## 扩展运算符的应用

### 合并数组

```javascript

var arr1 = [1,2,3];
var arr2 = [...arr1,4,5,6]; // [1,2,3,4,5,6]
```

### 与解构赋值结合

```javascript
var [title,...lists] = ['w',1,2,3,4,5,6];
lists // -> [1,2,3,4,5,6]


const [...list, last] = [1, 2, 3, 4, 5];
// 报错
```

如果扩展运算符用于数组解构,只能放在最后,否则会报错
