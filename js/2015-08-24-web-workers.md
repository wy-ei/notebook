## web workers

我们知道 JavaScript 是单线程的，当需要处理复杂计算的时候，比如大量数据的排序操作，这个时候就会阻塞，出现画面卡顿的现象，这个时候就需要使用web worker来在后台进行数据的计算然后将结果返还回来，这样主线程就不会因为大量计算而出现卡顿现象。


## 创建 web worker

创建web worker的方法很简单就是传入一个js脚本的url，比如：

```
var worker = new Worker('sort.js');
```

创建 web worker 来进行排序。然后将需要排序的数组发送给它，向其发数据使用的是postMessage方法

```
var arr = [2,65,2,764,2,62,63,234,73,63];
worker.postMessage(arr);
```

下面来看看在上面 sort.js 中是如何处理的

这个脚本运行的环境比较特殊，其中的self就指示 web worker 本身，当有给这个web worker 发生信息以后，就会触发它的 message 事件，这个事件对象的data属性中就包含发送来的数据，对数据处理完毕后可以同样使用postMessage方法将数据发送回去。

```
// sort.js 中的全部内容
self.onmessage = function(event){
	var arr = event.data;
	arr = arr.sort(function(n1,n2){
		return n1-n2;
	});
	self.postMessage(arr);
};
```

这个时候为了收到web worker 发回来的数据，就需要监听web worker 对象的  onmessage 事件，其次为了检查错误还需要监听 error事件。

```
worker.onmessage = function(event){
	var arr = event.data;
	console.log(arr); //打印出排序后的数组
};

worker.onerror = function(event){
	console.log("ERROR: " + event.filename + " (" + event.lineno + "): " +event.message);
};			
```


