---
layout: post
title: 避免强制性同步布局
category: Web
---



- *
{:toc}

强制性同步布局，发生在使用 JavaScript 改变了 DOM 元素的属性，而后又读取 DOM 元素的属性。比如改变了 DOM 元素的宽度，而后又使用 `clientWidth` 读取 DOM 元素的宽度。这个时候由于为了获取到 DOM 元素真实的宽度，需要重新计算样式。

## 案例

想象一下，如果有一组 DOM 元素，我们需要读取它们的宽度，并设置其高度与宽度一致。

## 解决方案

### 1. 新手解决方法

```js
for(var i = 0,len = divs.length; i<len; i++){
    var width = divs[i].clientWidth;
    divs[i].style.height = width + 'px';
}
```

执行这段代码就引起了强制性同步布局（forced synchonous layout），在每次迭代开始的时候都会进行重新计算布局，这是很昂贵的操作，千万要避免。

### 2. 分离读和写

以上场景下，我们可以使用两次循环，在第一次循环中只进行读取 DOM 元素宽度的操作，并将结果保存起来，在第二个循环中修改 DOM 元素的高度。

```javascript
var widthArray = [];
for(var i = 0,len = divs.length; i<len; i++){
    var width = divs[i].clientWidth;
    widthArray.push(width);
}
for(var i = 0,len = divs.length; i<len; i++){
    divs[i].style.height = widthArray[i] + 'px';
}
```

### 3. 使用 `requestAnimationFrame`

在实际项目中往往没有上面提到的那样简单，有时尽管已经分离了读和写，但在写操作后面还是不可避免地存在读取操作，这个时候不妨使用 `requestAnimationFrame`，将写操作放在 `requestAnimationFrame` 中，浏览器会在新的一帧开始的时候立刻调用它们。

```javascript
for(let i = 0,len = divs.length; i<len; i++){
    let width = divs[i].clientWidth;
    requestAnimationFrame(()=>{
        divs[i].style.height = width + 'px';
    })
}
```

## 优化效果

可以查看[这个例子](https://wy-ei.github.io/60fps/layout/layout-thrashing.html)来对比一下这几种方案的性能差异。打开 Chrome DevTools 在 Timeline 中录制重新布局的过程，可以看到下面三种情形：

**强制性同步布局：**

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/2016-11-11/319890.jpg)

这个时候会看到浏览器进行了很多次的重新计算样式（Recalculate Style） 和 布局（Layout），也叫做 reflow 的操作，且这一帧用时很长。

**分离读写：**

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/2016-11-11/147743.jpg)

这个时候，浏览器只进行了一次 reflow，用时很短。

**使用 requestAnimationFrame:**

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/2016-11-11/625120.jpg)

这个方案也很快，只是因为调用了 `requestAnimationFrame` 很多次添加了很多回调，这个时候会有很多函数调用。建议对于将该方法用在回调较少的场景下。其实另外一个可行的方案是在 `requestAnimationFrame` 中批量来写 DOM
元素。

## 总结

在需要操作 DOM 的时候，一定要注意避免强制性同步布局，遇到交替读写 DOM 的操作的时候，可以通过分离读写，使用 `requestAnimationFrame` 来避免强制性同步布局的出现。
