---
title: 继承
layout: post
category: js
---


JavaScript 中的继承不像其他语言那样，只需要一个关键字就能搞定，在JavaScript中，往往需要更复杂的操作。

## 为什么需要继承

使用继承可以减少重复性的代码，可以基于现在已经存在的类来进行开发。

## 类式继承

### 原型链

```javascript
function Person(name){
    this.name = name;
}
Person.prototype.getName = function(){
    return this.name;
};

// 基于原型的继承

function Author(name,book){
    Person.call(this,name);
    this.book = book;
}
Author.prototype = new Person();
Author.prototype.constructor = Author;
Author.prototype.getBooks = function(){
    return this.book;
};
```

### extend

基于原型链的继承，需要好几步操作，为了简化操作，可以将整个过程包装在一个函数中。

```javascript
function extend(subClass,superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
}
```

使用了 extend 函数后，之前的继承操作就变成了下面这样：

```javascript
function Person(name){
    this.name = name;
}
Person.prototype.getName = function(){
    return this.name;
};

function Author(name,book){
    Person.call(this,name);
    this.book = book;
}
extend(Author,Person);
Author.prototype.getBooks = function(){
    return this.book;
};
```


以上的代码的一个缺点是将超类固化在了子类的构造函数中，为了完成解耦，可以按如下思路来改写 extend 这个函数：

```javascript
function extend(subClass,superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F;
    
    subClass.superclass = superClass.prototype;    
}
```

然后可以这样写：

```javascript
function Author(name,book){
    Author.superclass.constructor.call(this,name);
    this.book = book;
}
extend(Author,Person);
Author.prototype.getBooks = function(){
    return this.book;
};
```


这样的一个好处是可以访问到超类中同名的方法：

```javascript
Author.prototype.getName = function(){
    var name = Author.superclass.getName.call(this);
    return 'Author:' + name;
}
```

### 原型式继承

```javascript
function clone(obj){
	function F(){};
	F.prototype = obj;
	return new F;
}

var list = {
	items:[1,2,3]
};



var list1 = clone(list);
var list2 = clone(list);

console.log(list1.items); // 1,2,3
list1.items.push(4);
console.log(list2.items); // 1,2,3,4
```

基于原型的继承的一个特点是，类的多个实例会共享同一个原型对象。
