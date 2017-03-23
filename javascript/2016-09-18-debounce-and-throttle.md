---
layout: post
title: debounce & throttle
category: JavaScript
---


**Debounce** 和 **throttle** 是两个相似（但不相同）的用于控制函数在某段事件内的执行频率的技术。

## debounce

多次连续的调用，最后只调用一次

想象自己在电梯里面，门将要关上，这个时候另外一个人来了，取消了关门的操作，过了一会儿门又要关上，又来了一个人，再次取消了关门的操作。电梯会一直延迟关门的操作，直到某段时间里没人再来。

## throttle

将频繁调用的函数限定在一个给定的调用频率内。它保证某个函数频率再高，也只能在给定的事件内调用一次。比如在滚动的时候要检查当前滚动的位置，来显示或隐藏回到顶部按钮，这个时候可以使用 Throttle 来将滚动回调函数限定在每 300ms 执行一次。

需要注意的是这两个函数的使用方法，它们接受一个函数，然后返回一个节流/去抖后的函数，因此下面第二种用法才是正确的。

``` javascript
// WRONG
$(window).on('scroll', function() {
   _.throttle(doSomething, 300);
});

// RIGHT
$(window).on('scroll', _.throttle(doSomething, 300));
```
