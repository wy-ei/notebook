## 单体模式

单体模式是说一个类的对象只有一个，多次调用同一个构造函数应该返回同一个对象。

第一种方法是在第一次调用构造函数的时候将构造出来的对象的引用保存起来，下次再次调用构造函数的时候判断是否已经存在该构造函数的对象，如果有的话就返回该对象。

下面这个的思路是将类对象的实例的引用保存为类的一个属性。

```javascript
function Singleton () {
    // 首次调用的时候 Singleton.instance 为 undefined
    if(typeof Singleton.instance === 'object'){
        return Singleton.instance;
    }
    // other code goes here

    // 保存实例对象
    Singleton.instance = this;
}
```

但是以上方法存在一个弊端，instance可以被全局访问。

考虑使用私有变量来保存类的实例对象，实现如下：

```javascript
function Singleton () {
    var instance;

    // 首次调用构造后，改写构造函数
    Singleton = function(){
        return instance;
    };

    // 改写后，重新设置原型
    Singleton.prototype = this;
    Singleton.prototype.constructor = Singleton;
    // 构造实例对象
    instance = new Singleton();
    return instance;
}
```

## 迭代器模式

迭代器模式一般含有一个 next 方法，用来返回下一个元素，还有一个 hasNext 方法来判断是否存在下一个元素。

```javascript
var agg = (function(){
    var 
        index = 0,
        data = [1,2,3,4,5],
        length = data.length;
    return{
        next:function(){
            var element;
            if(!this.hasNext()){
                return null;
            }
            element = data[index];
            index += 2;
            return element;
        },
        hasNext:function(){
            return index < length;
        }
    };
})();
```

