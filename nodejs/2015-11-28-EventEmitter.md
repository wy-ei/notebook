---
title: 学习nodejs 之 nodejs 中 events模块
category: nodejs
---



## events 模块

```javascript
var EventEmitter = require('events').EventEmitter,
	util = require('util');
```

要使用 events 模块自然是要引入这个模块了，其实我们使用的是 events 模块中的 `EventEmitter`


events.EventEmitter 是一个构造函数，要想使用它可以构造出一个对象来

```javascript
var emitter = new EventEmitter();
```

然后就可以在这个对象上面使用 `on` 方法来绑定一些事件

```javascript
emitter.on('eat',function(food1,food2){
	console.log('eat '+food1+' '+food2);
});
```

或者使用 `addListener` 方法，这和 `on` 方法是一样的

```javascript
emitter.addListener('drink',function(o){
	console.log('drink '+o);
});
```

有些时候可能只希望某事件只被触发一次，然后就自动地移除了事件处理函数，这个时候可以使用 `once` 来代替 `on`

```javascript
emitter.once('getUp', function(){
	console.log('get up');
});

emitter.emit('getUp');
```

要触发这个事件，可以使用 `emit` 方法，这个方法的第一个参数是要触发的事件的名称，其余参数都将传递给回调函数，而且 `emit` 会返回一个布尔值，如果触发事件后有响应的事件处理函数被调用，那么将返回 true ，否则会返回 false

```
var ret = emitter.emit("eat",'A','B');
console.log(ret); // true
```

如果想要移除对某种事件的响应，那么可以使用 `removeAllListeners` 来移除事件，参数仅有一个，即为事件名称。

```javascript
emitter.removeAllListeners('drink');
```

对于一个事件，对其绑定的事件处理函数是有限制的，在 nodejs 中有这样一个全局的限制数量，你可以通过 `EventEmitter.defaultMaxListeners` 来查看这个数字。但是有的时候又希望能够突破这个限制。那么这个时候就需要使用对象的 `setMaxListeners` 来自定义这个最大监听函数个数的限制。

```javascript
console.log(EventEmitter.defaultMaxListeners); // 10
emitter.setMaxListeners(20);
ret = emitter.getMaxListeners();  
console.log(ret);  // 20
```

如果希望移除某一个事件监听函数，使用 `removeListener(event, listener)` 这和浏览器中的方法是类似地


更多地时候,我么并非简单地使用 EventEmitter 这个构造函数构造出来的对象，而是继承它，来给自己的项目中引入事件机制，下面是一个很简单的例子

```javascript
// 继承 EventEmitter
function MyEvent(){
	EventEmitter.call(this);
}
util.inherits(MyEvent,EventEmitter);

// 在 write 方法中触发 `data` 事件
MyEvent.prototype.write = function(data){
	this.emit('data',data);
	return this;
}

var myEvent = new MyEvent;
 
// 监听 `data` 事件
myEvent.addListener('data',function(data){
	console.log('write data:'+data);
});

// 这将触发 `data` 事件
myEvent.write('wangyanting');
```

// 还有一个需要注意的是，EventEmitter 对象或者继承自它的对象上添加新的事件，或者移除一个事件，这会导致在该对象上触发 `newListener` 和 `removeListener` 事件

```javascript
myEvent.on('newListener',function(){
	console.log('new event added');
});
```