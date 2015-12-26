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

