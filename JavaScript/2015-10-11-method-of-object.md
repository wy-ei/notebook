### hasOwnProperty

判断对象的是否有一个属性存在在它自身上，而不是存在在 原型上。

```
var o = {x:1};
o.hasOwnProperty("x");  // true
o.hasOwnProperty("y");  // false
o.hasOwnProperty("toString");  // false
```

### propertyIsEnumerable

判断对象的某个属性是否存在在其自身上，而且可以枚举。

```
function Person(name,age){
    this.age = age;
    this.name = name;
}

Person.prototype.sayName = function(){
    console.log(this.name);
};


var p = new  Person("jack",22);

console.log(p.propertyIsEnumerable("age")); // true
console.log(p.propertyIsEnumerable("sayName"));  // false
```

### isPrototypeOf

判断一个对象是不是另一个对象的原型

```javascript
function app(name,version){
    this.name = name;
    this.version = version;
}
app.prototype.platform = "Linux";

var test = new app("test","0.1");

console.log(app.prototype.isPrototypeOf(test));
```

### Object.keys

返回对象自身的可枚举的属性组成的一个数组。

### Object.getOwnPropertyNames

返回对象自身的所有属性（包括不可枚举的属性）

### Object.getOwnPropertyDescriptor

返回对象的自身某个属性（不包含原型链）的属性对象（writable,value,enumerable,configurable,get,set 等）

### Object.defineProperty

给对象定义一个属性，只有通过这个方式才能自定义对象属性的属性。

```javascript
var random = {};

Object.defineProperty(random, "int8", {
    get:function(){
        return Math.floor(Math.random()*256-128);
    },
    configurable:false,
    enumerable:true
});
```

### Object.defineProperties

如果希望一次性定义多个属性，可以使用这个方法

```javascript
var random = {};

Object.defineProperties(random,{
    int8:{
        get:function(){
            return Math.floor(Math.random()*256-128);
        },
        configurable:false,
        enumerable:true
    },
    uint8:{
        get:function(){
            return Math.floor(Math.random()*256);
        },
        configurable:false,
        enumerable:true
    }
});
```
以上这两个方法有一些规则如下:(摘抄于《JavaScript 权威指南 英文版》)

+ If an object is not extensible, you can edit its existing own properties, but you cannot add new properties to it.
+ If a property is not configurable, you cannot change its configurable or enumerable attributes.
+ If an accessor property is not configurable, you cannot change its getter or setter method, and you cannot change it to a data property.
+ If a data property is not configurable, you cannot change it to an accessor property.
+ If a data property is not configurable, you cannot change its writable attribute from false to true , but you can change it from true to false .
+ If a data property is not configurable and not writable, you cannot change its value. You can change the value of a property that is configurable but nonwritable, however (because that would be the same as making it writable, then changing the value, then converting it back to nonwritable).

### Object.getPrototypeOf

得到一个对象的原型

### Object.preventExtensions()

使一个对象不能再扩展。一旦对象被设置成不可扩展，就不能在修改为可以扩展了。另外，不可扩展仅仅是指对象本身不可扩展，如果其原型可以扩展，还是可以在原型上添加属性的。

```javascript
var test = {};
Object.preventExtensions(test);
test.id = 123;   // 在严格模式下，会抛出错误;在非严格模式下，会被忽略。
```

### Object.isExtensible()

判断一个对象是否能被扩展。


### Object.seal()

使得一个对象不可扩展，设置所有属性的 configurable 为 false。

### Object.isSealed()

可以判断一个对象是否处于 seal 的状态

### Object.freeze()

使对象不可扩展，而且所有属性为只读。对于有 set 方法的存取器属性，还是可以用 set 方法写数据。

### Object.isFrozen()

检验是否处于 frozen 状态。






