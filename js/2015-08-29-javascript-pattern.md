---
layout: post
title:  设计模式
category: js
---


### 揭示模式（Revealing Module Pattern）

揭示模式的主要思想是将所有属性，方法在前面定义好，最后返回一个匿名对象，其中引用上面定义的共有接口。

```
var myRevealingModule = (function(){
	var name = 'John';
	var age = 40;
	function getPerson(){
		return name;
	}
	function setPerson(){
		name = 'John Smith';
	}

	return {
		set:setPerson,
		get:getPerson
	};
})();
```

这个模式的缺点在于有些属性是靠值来传递的。

### 观察者模式

订阅/发布模式


```
// Publish

//dojo
dojo.publish('/login'[{username:'test',userData:'test'}]);
//jQuery
$(el).trigger('/login'[{username:'test',userData:'test'}]);


// Subscribe

//dojo
dojo.subscribe('/login',function(data){
	//...
});

//jQuery
$(el).on('/login',function(event){
	//...
});

// Unsubscribe

//dojo
dojo.unsubscribe('/login',function(data){
	//...
});
//jQuery
$(el).off('/login',function(event){
	//...
});

```


一个简单实现：

```
var pubsub = {};
(function(q){
	var topics = {},
		subUid = -1;
	q.publish = function(topic,args){
		if(!topics[topic]){
			return false;
		}
		var subscribers = topics[topic];
		len = subscribers?subscribers.length:0;
		while(len--){
			subscribers[len].func(topic,args);
		}
		return this;
	};

	q.subscriber = function(topic,func){
		if(!topics[topic]){
			topics[topic] = [];
		}
		var token = (++subUid).toString();
		topics[topic].push({
			token : token,
			func : func
		});
		return token;
	}

	q.unsubcribe = function(topics,token){
		for(var m in  topics){
			for(var i=0,j=topics[m].length;i<j;i++){
				if(topics[m].token = token){
					topics[m].splice(i,1);
					return token;
				}
			}
		}
		return this;
	}
})(pubsub);


var handler = function(topics,data){
	console.log(topics+'  : '+data);
}

var testSubscripion = pubsub.subscriber('example',handler);

pubsub.publish('example','test');

pubsub.unsubcribe('example',testSubscripion);

pubsub.publish('example','test');
```


运用的例子：

假如有一个事实显示股价的页面，这个时候后台的数据变动之后，页面需要自动更新，这个时候页面就可以作为观察者，来订阅数据变动这个事件，当数据被修改后发布这个消息，页面就会自动更新。


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
