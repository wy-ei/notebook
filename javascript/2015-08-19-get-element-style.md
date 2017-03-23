---
layout: post
title: 查询元素的样式
category: JavaScript
---


## how to get a certain style of a element?

if you want get width attribution of a elem,you can't get it by `var width = elem.style.width` ,because style object only containe the attribution which seted by `elem.style.someAttr = value`.

at this time ,you can use  the API which is `getComputedStyle`.

```js
var div = document.getElementById('wrap');
var computedStyle = getComputedStyle(div,null);
var width = computedStyle.width;
```

but IE don't support this method, but not too bad, every element in IE has a property named currentStyle,we can get all the style attribute by elem.currentStyle.

now we can write a function help us get style easily.

```js
function getStyle(elem,styleName){
	var style;
	if(window.getComputedStyle){
		style = getComputedStyle(elem,null);
	}else{
		style = elem.currentStyle;
	}
	return style[styleName];
}
```
