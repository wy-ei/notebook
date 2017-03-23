---
layout: post
title: 查询元素的几何尺寸
category: JavaScript
---


### getBoundingClientRect

这个方法直接在元素上面调用，返回一个有left,right,top,bottom 四个属性的对象，(left,top) 为左上角坐标，(right,bottom) 为右下角坐标。这里得到的是相对于视口的坐标，如果希望得到相对于文档的坐标那么就需要加上 offsetLeft，和offsetTop ,这里得到的值是不包含外边距的，也就是说包含内容，内边距，和边框。


### getClientRects

针对行内元素，它们有可能会被折行，也就成了两个矩形块了，这个时候使用getBoundingClientRect就会得到一个包含这两个矩形块的大矩形的信息，这个时候需要借助于 getClientRects ，它返回一个数组，每个元素都类似于getBoundingClientRect 得到的矩形。

## 判定元素在某点

有的时候我们希望知道一个坐标处有什么元素，这个时候希望能用坐标来得到元素，那就可以使用下面这两个方法。

+ document.elementFromPoint(x,y):得到这个位置的顶层元素
+ document.elementsFromPoint(x,y):得到这个位置的所有元素

## 滚动

window 的 scroll 和 scrollTo 都接收一个坐标，然后让这个坐标尽可能的位于视口的左上角

如果有的时候只是建党地让某个元素出现在视口中，这个时候可以在元素上面调用 `scrollIntoView` 这个时候该元素会尽可能地与视口上边沿一平，如果传入参数 false 那就会与下边沿一齐。


## 关于元素尺寸


### offset

+ offsetHeight:the height of element,which include content padding and border
+ offsetWidth:same as offsetHeight
+ offsetLeft:the left distance between offsetParent left edge and left dege of element itself.
+ offsetTop:see offsetLeft
+ offsetParent:offsetParent is not parentNode,it is the first father node which position is seted.(absolute or relative)

## client

+ clientHeight: 和offset不同的是，这个不包含边框的宽度，如有滚动条那么也不包含滚动条的宽度
+ clientWidth: 见clientHeight
+ clientTop:内边框外边沿距离外边沿的垂直距离，也就是边框的宽度
### document.body.clientWidth vs window.innerWidth
+ clientLeft:见clientTop

## scroll


+ scrollWidth:可见内容加上内边框加上溢出部分。
+ scrollHeight:
+ scrollLeft: 滚动条的位置，这个属性是可以写的，改变这个值导致滚动条滚动。
+ scrollTop:
