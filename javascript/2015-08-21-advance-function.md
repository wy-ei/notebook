---
title: 函数高级用法
layout: post
category: JavaScript
---


## 作用域安全的构造函数

构造函数是一类形如下面这样的函数，使用 new 操作符号来构造对象实例。

```
function Person(name, age, job){
	this.name = name;
	this.age = age;
	this.job = job;
}
```
通过下面这样使用构造函数来创建对象：

```
var person = new Person("Nicholas", 29, "Software Engineer");
```

但是存在一个问题当没有使用 new 操作符号来调用构造函数的时候，构造函数中的 this 值是全局环境，在浏览器中就是window，这个时候就会导致无意间给 window 添加了几个变量。

为了防止这样的事情发生，采用一种叫做**作用域安全的构造函数**

```
function Person(name, age, job){
	if (this instanceof Person){
		this.name = name;
		this.age = age;
		this.job = job;
	} else {
		return new Person(name, age, job);
	}
}
```

先来看看 instanceof 的作用吧，下面这段摘自《JavaScript权威指南》

> To evaluate the expression `o instanceof f` , JavaScript evaluates f.prototype ,and then looks for that value in the prototype chain of o . If it finds it, then o  is an instance of f (or of a superclass of f) and the operator returns true . If f.prototype is not one of the values in the prototype chain of o , then o is not an instance of f and instanceof returns false .

也就是说 instanceof 会检查这个对象的原型链，当发现原型链中存在该构造函数的原型时，返回true


```javascript
var james = new Person('james',31,'athlete');
console.log(james instanceof Person);   // true;
var o = {};
console.log(o instanceof Person);  // false
```



为了计算 `o instanceof f`的值，首先找到  f.prototype  ，然后在 o 的原型链中寻找这个 原型，如果找到了 o 就是 f 的实例，返回ture，否则 o 就不是 f 的实例，返回false


回到上面的**作用域安全的构造函数**当没有使用 new 关键字的时候 this 值为window 所以会执行 else 子句中的操作，使用了 new 的话，在 new 的过程的第一个步骤就将 this 的 __proto__  设置为 构造函数的原型了，而构造函数的原型中有一个属性就是 constructor 它指向构造函数。


使用这种作用域安全的构造函数会带来另外一个问题，当使用构造函数窃取模式的继承的时候，就不能正常工作，比如：

```
function Student(name,age,shcool){
	Person.call(this,name,age,'student');
	this.school = school;
}
```

执行 call 的时候在 Person 的构造函数中，并不会为这个this添加什么东西,因为在构造函数 Person 内部 this 并不是 Person 的实例。

解决这中问题的方法是将 Student 的原型修改为 Person 的实例。

```
Student.prototype = new Person();
//这样子，Student 的实例就也是 Person 的实例了。
```

## 惰性载入函数

在编写客户端代码的时候因为要考虑到浏览器实现的不同，所以常常需要在函数中进行多次检验，然后使用合适的API，但是代码一旦执行了一次，运行环境也就明确了，也就没有必要每次执行都再次进行检验了，这个时候可以使用下面这样的技巧：

function foo(){
	if(ie){
		foo = function(){
			//...
		}
	}else if(firefox){
		foo = function(){
			//...
		}
	}else{
		foo = function(){
			//...
		}
	}

	return foo();
}

以上代码的思路就是在第一次执行的时候就把函数根据环境改写了，这样下次再执行的时候就直接执行适合的那个函数了。



## bind

返回一个在在指定环境中运行的函数，其次 bind 还可以实现函数的柯里化


## 防篡改对象

### 不可扩展对象

```
var person = { name: "Nicholas" };
Object.preventExtensions(person);
```

这样任何给该对象添加属性的行为都将无效，在严格模式下还会出错

### 密封的对象

```
var person = { name: "Nicholas" };
Object.seal(person);
```

将一个对象密封以后，任何删除该对象中属性或者添加属性的行为都将无效，在严格模式下还会出错


### 冻结的对象

```
var person = { name: "Nicholas" };
Object.freeze(person);
```

冻结的对象既不能扩展，也不能删除，也不能修改。
