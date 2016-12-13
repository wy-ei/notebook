---
layout: post
title: 获得窗口滚动条位置
category: js
---


## 获得窗口滚动条位置

在现代浏览器中均可以从 `window` 对象的 `pageXOffset` 和 `pageYOffset` 属性中得到窗口滚动条的位置。

而对于旧版本的 IE (IE8 以及以前) 可以通过
`document` 上的 `documentElement` 或者 `body` 中的 `scrollLeft` 和 `scrollTop` 来获得。

而究竟是在 `documentElement` 上面还是 `body` 上面，者取决与文档的渲染模式，这可以从 `document.compatMode` 上获得。如果是在标准模式下则在 `documentElement` 上获得，否则在 `body` 上。

所以可以通过下面的函数获得滚动条位置。

```javascript
function getScrollOffsets(){
	if(window.pageXOffset!=null){
		return {
			x:window.pageXOffset,
			y:window.pageYOffset
		};
	}
	if(document.compatMode === 'CSS1Compat'){
		return {
			x:document.documentElement.scrollLeft,
			y:document.documentElement.scrollTop
		};
	}else{
		return {
			x:document.body.scrollLeft,
			y:document.body.scrollTop
		};
	}
}
```

**注意**： 在 webkit 内核的浏览器中，目前存在一个 bug 那就是无论在什么渲染模式下，`document.documentElement.scrollLeft` 与 `document.documentElement.scrollTop`
都为 0 ，而 `document.body.scrollLeft` 与 `document.body.scrollTop` 是正确的值。对于上面的函数，我们先从 `window.page[X|Y]Offset` 中获得了值,所以最终的结果依然是正确的。另外，这个 bug 在以后可能会被修复。
