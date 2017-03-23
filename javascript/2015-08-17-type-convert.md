---
layout: post
title: JavaScript 中的类型转换
category: JavaScript
---

* toc
{:toc}

JavaScript 中的各种不同类型之间可以相互转换，转换规则如下表：

![convert-rule](http://ok43olqzw.bkt.clouddn.com/type.convert.png)

## 显式转换

+ Number('3')  --> 3
+ String(false)  --> 'false'
+ Boolean([])  --> false
+ Object(3)  --> new Number(3)

### `+` 号运算符

一元的`+`号运算符会将其操作数转换为数字

二元的`+`号运算符，如果其中一个操作数是字符串的话，它会将另外一个也转换为字符串


### 字符串与数字间的转换

有时候希望将数字转换成字符串，除了使用简单的`14+‘’`这样的方法外，还可以使用功能更为强大的方法，使用 Number对象的 toString 方法可以将数字按照不同的基数转换为字符串

```
var n = 255;
var s = n.toString(16);  // 按照16进制进行转换，结果为 ff
```

### 数字间的转换

```
var num = 10;
num.toString(2);   //return 1010
num.toFixed(3);    //return 10.000
num.toExponential(1); //1.0e+1
num.toPrecision(6);   //10.0000
```

### 字符串转换为数字

+ parseInt：转换整数，可以接受一个转换基数作为第二个参数（2～36）

```
var s = '0xff';
var n = parseInt(s); // 255
var s1 = 'ff';
var n1 = parseInt(s1);  // NaN
n1 = parseInt(s1,16); //255
```

+ parseFloat ：转换浮点数


### 对象转换为布尔值

任何对象转换为布尔值都为 true 这一点要注意

```
if ( new Boolean(false) ){  //   true
}
```

## 转换相等性

在比较两个不同的类型的数值的时候，会根据比较符对比较的值作出一些转换，下面是转换规则

### 严格相等运算符的相等规则

严格相等运输符不进行类型转换

+ 如果两个值类型不同，则他们不相等
+ 如果两个值都是 null 或者 都是 undefined ,则他们相等
+ 如果都是 true 或者 false ，则他们相等
+ 如果有一个值是 Nan 则不想等，实际上 NaN 不与任何数相等，包括它自己
+ 如果两个字符串包含完全一样的字符，则相等
+ 如果两个变量引用同一个对象则相等

### 相等运算符的相等规则

+ 如果两个值是同样的类型，那么检验方法和严格相等是一样的
+ 如果不是同样的类型，那么也可能相等，规则如下：
  + 如果一个是 null 另一个是 undefined ，则相等
  + 如果一个是字符串一个是数值，那么将字符串转换为数值之后哦进行比较
  + 如果有一个布尔类型，那么将 true 转换为数字 1,将false 转换为 0，之后在比较
  + 如果有一个值是对象，那么就将它转换为原始值，使用valueOf 或者 toString，JavaScript 首先会尝试 valueOf 如果转换后比较不相当，那么就尝试 toString ,当然Date类是一个例外，它使用 toString 转换，因为使用 valueOf 返回的是自从 1970.1.1 起毫秒数。


### 比较运算符的规则  (<,>,<=,>=)

+ 如果有一个操作数是对象，那就将其使用valueOf 与 toString 来进行转换。
+ 如果两个都是字符串，比较字符串
+ 如果有一个是数字，那就全部转换为数字
+ 有一个 布尔值，也会转换为数字

**以上比较可能会经历多次转换，最终都能找到恰当的方式进行比较**


## in 关键字

```
var point = { x:1, y:1 };
"x" in point    // => true: object has property named "x"
"z" in point    // => false: object has no "z" property.
"toString" in point  // => true: object inherits toString method

var data = [7,8,9];
"0" in data  // true
3 in data  // false
```

in 关键字就是检验一个对象里面是否有某个属性，至于数组对象，他们的下标也就相当于他们的属性了，或者可以这么理解 可以使用方括号访问到的 使用 in 就会返回 true
