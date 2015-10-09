---
layout: post
title: nth-of-type 与 nth-of-child 的区别 
tag: 选择器
category: css
---

先看一个例子：

```html
<div>
	<p>Beijing</p>
	<p>Shanghai</p>   <!--whan select this one -->
</div>
```

希望选择第二个段落，可以这样写：

```
p:nth-child(2){
	color:red;
}
//或者
p:nth-of-type(2){
	color: red;
}
```

上面两种写法都能实现我们的想法，正确地选择第二个段落。但是考虑下面这样的情况：

```html
<div>
	<h1>City</h1>
	<p>Beijing</p>
	<p>Shanghai</p>   <!--whan select this one -->
</div>
```

这个时候，两种选择器的区别就显示出来了，nth-child会选择第一个`<p>Beijing</p>`，而nth-of-type会正确地选择`<p>Shanghai</p>`。

下面分析一下这两个选择器语义：

**p:nth-child(2)**选择一个元素的条件是:

1. 这个元素是`p`元素
2. 这个元素是父元素的第二个子元素

**p:nth-of-type(2)**意思是：

1. 选择父元素中的第二个`p`元素。
