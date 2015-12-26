---
title: event
category: js
---

## event bubbling

event start at most specific node,and bubble to its parent node.

## event capturing

event received by most blurry node,after that it is specific node

## DOM event stream

DOM level 2 said event stream include there stage:event capturing,on target and event bubbling.

## DOM0

+ onclick
+ onload
+ ...

```javascript
//add event process function
btn.onclick = function(){
	console.log(this.id);  // this  <---- dom element
};

//delete it
btn.onclick = null;
```

## DOM2

+ addEventListener
+ removeEventListener

```
btn.addEventListener('click',function(event){
	console.log(this.id);  // this  <--- dom element	
},false);
// if the third parament is false the event process function will be call during event bubbling stage.
// if it is true it will be event capturing stage
```

In old IE there doesn't has method addEventListener,but has attachEvent and detachEvent,it is same as addEventListener,but it does't have phase capturing,so the event process function will be called during bubbling,another different is within the event process function the value `this` is not dom element but global object which is window.

## Event util

consider the different between all those browser,we can write a event util help us cross platform operate event

```javascript
var EventUtil = {
	addHandler:function(element,type,handler){
		if(element.addEventListener){
			element.addEventListener(type,handler,false);
		}else if(element.attachEvent){
			element.attachEvent('on'+type,handler);
		}else{
			element['on'+type] = handler;
		}
	},
	removeHandler:function(element,type,handler){
		if(element.removeEventListener){
			element.removeEventListener(type, handler);
		}else if(element.detachEvent){
			element.detachEvent('on'+type,handler);
		}else{
			element['on'+type] = null;
		}
	},
	getEvent:function(event){
		return event?event:window.event;
	},
	getTarget:function(event){
		return event.target||event.srcElement;
	},
	preventDefault:function(event){
		if(event.preventDefault){
			event.preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	stopPropagation:function(event){
		if(event.stopPropagation){
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	}
};
```