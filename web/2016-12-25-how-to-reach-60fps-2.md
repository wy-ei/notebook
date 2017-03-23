---
layout: post
title: How To Reach 60FPS（技巧篇）
category: Web
tag: 性能优化
---

* toc
{:toc}


## Reach 60fps

前面介绍了不少关于浏览器渲染过程的基础知识，旨在帮助对此不清楚的朋友从宏观上理清楚 Web 页面的渲染过程。

实现连贯的动画，流畅的滚动，了解以上基础知识对后续编码、优化有着巨大的好处。下面根据浏览器渲染原理，结合每一帧的浏览器需要做的各个步骤，给出了一些切实可行的优化方案，并提出一些注意事项。

后面的内容我想分 5 个点来介绍，分别是：

1. 避免没有必要的重排
2. 避免没有必要的重绘
3. 利用 GPU 加速渲染
4. 构建更为流畅的动画
5. 正确地处理滚动事件


## 1. 避免没有必要的重排

每个前端工程师在入门的时候，都被告知 DOM 很慢，使用脚本对 DOM 进行操作的代价很昂贵，要批量修改 DOM 等等，关于 DOM 操作的话题已经有不少著作进行过论述了。强烈推荐 [《高性能 JavaScript》](http://book.douban.com/subject/5362856/) 这本书，我觉得这本书应该是前端工程师必读。

虽说已经有很多关于 DOM 操作的内容了，这里我还是想提一个注意事项：**避免强制性同步布局**，因为我经常看到这个字眼，不妨提出来谈谈。

### 避免强制性同步布局

强制性同步布局（forced synchonous layout），发生在使用 JavaScript 改变了 DOM 元素的属性，而后又读取 DOM 元素的属性的时候，通常也说读取了脏 DOM 的时候。比如改变了 DOM 元素的宽度，而后又使用 `clientWidth` 读取 DOM 元素的宽度。这个时候为了获取到 DOM 元素真实的宽度，需要重新计算样式。也就是会重新进行计算样式（Recalculate Style）和计算布局（ Layout）操作。

设想以下案例，有一组 DOM 元素，需要将其其高度设为与宽度一致，新手很快就能写出以下代码：

**解决方案 1 - 简单粗暴：**

```js
for(var i = 0,len = divs.length; i<len; i++){
    var width = divs[i].clientWidth;
    divs[i].style.height = width + 'px';
}
```

执行这段代码的时候，每次迭代开始的时候，DOM 都是脏的（被改动过），为了获得真实的 DOM 尺寸，都会重新计算布局。该循环就会引发多次强制性同步布局，这是很低效的做法，千万要避免。

![text=引发了强制性同步布局](http://7xs1gu.com1.z0.glb.clouddn.com/2016-11-11/319890.jpg)

从 Chrome DevTools 中很容易地发现该低效操作，可以看到浏览器进行了很多次的重新计算样式（Recalculate Style）和布局（Layout），也叫做 reflow（重排）的操作，且这一帧用时很长。

**解决方案 2 - 分离读和写：**

可以很轻松地解决这个问题，使用两次循环，在第一次循环中读取 DOM 元素宽度并将结果保存起来，在第二个循环中修改 DOM 元素的高度。

```javascript
var widthArray = [];
for(var i = 0, len = divs.length; i<len; i++){
    var width = divs[i].clientWidth;
    widthArray.push(width);
}
for(var i = 0, len = divs.length; i<len; i++){
    divs[i].style.height = widthArray[i] + 'px';
}
```

![text=分离读写后](http://7xs1gu.com1.z0.glb.clouddn.com/2016-11-11/147743.jpg)

分离读写，一个时刻只读取，另一个时刻只改写，这样就能很有效地避免强制性同步布局。

在实际项目中往往没有上面提到的那样简单，有时尽管已经分离了读和写，但在写操作后面还是不可避免地存在读取操作，这个时候不妨将写操作放在 `requestAnimationFrame` 中，浏览器会在下一帧执行这个对 DOM 的改写操作。关于 `requestAnimationFrame` 后文有详细的讲解。


### 补充资料

- [《高性能 JavaScript》- Nicholas C.Zakas ](https://book.douban.com/subject/5362856/) 中讲解了更多关于 DOM 操作的内容，包括如何最小化重绘与重排，如何高效实用 CSS 选择器等。
- [What forces layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)，这个 Gist 中列出了那些操作会导致强制性同步布局。

## 2. 避免没有必要的重绘

在开始之前需要回顾一下什么时候需要重绘：

1. 当 DOM 节点的会触发重绘的属性（color，background 等）被修改后，会进行重绘
2. 当 DOM 节点所在的图层中其他元素的会触发重绘的属性被修改后，整个层会被重绘
3. 图片加载完成后会发生重绘，GIF 图片的每一帧都会发生重绘

在 Chrome DevTools 的 Rendering 选择卡中勾选 Painting Flashing 选项后，可以观察到页面上正在进行重绘的区域。

### 避免 fixed 定位元素在滚动时重绘

一个常见的场景是，网页有一个 fixed 定位的头部导航栏或者侧边栏。问题存在于每次滚动后，这些 fixed 定位的元素相对于整个内容区域的位置改变了。这就相当于一个图层中的某个元素的位置改变了，为了获得滚动后的图层，需要进行重绘，因此每次滚动都会进行重绘操作。


举个例子，在腾讯网首页上有如下 fixed 定位的元素：

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-22/60022094-file_1482378522505_106ef.png)

不幸的是这几个 fixed 定位的元素和整个网页位于同一个图层：

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-22/43431174-file_1482378837920_9983.png)

滚动后，因为定位元素相对于整个文档的位置发生了改变，因此整个文档都需要被重绘。解决此类问题的方法就是将 fixed 定位的元素提升至单独的图层。使用 `transform:translateZ(0);`  这样的写法，可以强制将元素提升至单独图层，关于此后文中还有详细说明。

**注**：Chrome 在高 dpi 的屏幕上会自动将 fixed 定位的元素提升至单独的图层，在低 dpi 的屏幕上不会提升，因此很多开发者在 MacBook Pro 上测试的时候，不会发现问题，但用户在低 dpi 的屏幕上访问的时候就出问题了。

### 将部分元素提升至单独图层，避免大面积重绘

使用  `transform:translateZ(0);` 这样的 CSS hark 写法会将元素提升至单独的图层。在这么做之前要考虑为什么要这样做，创建新的图层的目的应该是，避免某个元素的改变导致大面积重绘，比如某个小标签的颜色的改变，导致大面积重绘，因此将其提升至单独的图层中。

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-21/86844237-file_1482313382826_1300.png)

这是一个面板，其中内容区域的文字会不断地闪烁（文本的颜色会改变），如果将该文本使用 `transform:translateZ(0);` 提升至单独的图层，那么文本的颜色改变，就只会导致它所在的图层重绘，而不需要整个面板重绘。这是正确地利用 `transform:translateZ(0);` 的方式。因此，如果页面中存在小面积的 DOM 节点需要频繁地重绘，可以考虑将其提升至单独的图层中。你可以在这里看到 demo —— [避免大面积重绘](https://wy-ei.github.io/demo/60fps/paint/avoid-large-area-repaint.html)。

### 正确地处理动图

页面加载的时候为了更好的用户体验常常会使用一个 loading，但在页面加载完成后如何处理 loading 呢？一个错误的方法是将其 z-index 设置一个更小的值，将其隐藏起来，不幸的是就算 loading 不可见，浏览器依然会在每一帧对它进行重绘。因此对于像 loading 这样的动态图，在不需要显示的时候最好使用 `display:none` 或者 `visibility: hidden;` 来彻底隐藏，或者干脆移除 DOM。

## 3. 利用 GPU 加速网页渲染

前端工程师应该都听说过硬件加速，通常是指利用 GPU 来加速页面的渲染。早期浏览器完全依赖 CPU 来进行页面渲染。现在随着 GPU 的能力增强和普及，且目前绝大多数运行浏览器的设备上都集成了 GPU。浏览器可以利用 GPU 来加速网页渲染。

GPU 包含几百上千个核心，但每个核心的结构都相对简单， GPU 的结构也决定了它适合用来进行大规模并行计算。进行图层合并需要操作大量的像素，这方面 GPU 能比 CPU 更高效的完成。这里有个[视频](http://v.youku.com/v_show/id_XNjY3MTY4NjAw.html)，很清楚地说明 CPU 与 GPU 的差别。

常常看到有文章指出使用  `transform:translateZ(0);`  这样的 hark 可以强制开启硬件加速来提高性能，这是错误的说法。下面就来说说硬件加速的实质：

### 何为硬件加速

GPU 能够存储一定数量的纹理（texture），也就是一个矩形的像素点集合。通常这个集合会对应到 Web 页面上的某个图层，GPU 能够高效地对这些像素点进行多种变换（位移、旋转、拉伸）操作。在实现动画的时候，利用 GPU 的这一特性，如果只需要对原像素集合在 GPU 内进行一次变换，就能得到新一帧的图层，那么动画的所有操作都在 GPU 内高效地完成了，没有重绘操作。

得到了变换后的图层，只需要再进行一次图层的合并，将该变换后的图层和其他图层合并起来，最终得到在屏幕上显示的整幅图片。GPU 的这一特性就常常被称为硬件加速。

要利用硬件加速也是有条件的，盲目地使用 `transform:translateZ(0);` 而不知原理，只会让事情变得更糟糕。硬件加速的本质是说让下一帧的图层在 GPU 内经过变换得来，但是如果某些操作 GPU 无法完成，必须动画修改了 DOM 节点的宽度，颜色等，这依然是需要在 CPU 端进行软件的重绘的，这种情况就无法利用硬件加速的机制。

使用  `transform:translateZ(0);` 会强制浏览器创建一个新的层，每创建一个层都需要消耗额外的内存，有太多的层就会消耗大量内存，这会导致设备内存不够用，有可能导致应用奔溃。另外这些图层最后需要上传至 GPU 进行图层合并，太多的层，会导致 GPU 和 CPU 之间的带宽不够用，反而影响性能。

目前常见的 CSS 属性中只有 filter, transform, opacity 这几个属性的改变可以在 GPU 端进行处理，这在前面已经提到过了，因此应该尽可能使用这些属性来完成动画。

后面会有更多关于利用 GPU 的这一特性的例子，下面先看一个需要注意的点：

### 避免无谓地新建图层

一个真实案例：

![text=每个列表项都是一个图层](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-21/2526768-file_1482317204542_10f11.png)

这是一个城市选择页，这个页面中的每一项都使用了 `transform:translateZ(0);`  强制提升至了单独的图层，滚动列表，并录制了一段 Timeline。

![text=优化前](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-21/29285897-file_1482317682421_51ec.png)

从上图中可以看到，性能是相当糟糕的，大量时间都花费在了图层的合并上，每一帧都需要合并上千个列表子项，这不是一件很轻松的事情。

为了体现，错误使用 `transform:translateZ(0);` 的严重性，下面来看看去掉后的效果，去掉该属性后，一片绿，没有任何性能问题。

![text=优化后](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-21/6248079-file_1482317852508_1146d.png)

因此在谈起硬件加速的时候，一定知道，什么是硬件加速，硬件加速是如何工作的，它能做什么，不能做什么。合理的利用 GPU 才能利用它帮我们构建出 60fps 的体验。

## 4. 构建更加流畅的动画

上面讲了，使用 transform 和 opacity 来创建动画（filter 的支持度还不够好）最为高效。因此每当需要用到动画的时候，首先要考虑使用这两个属性来完成，

### 避免使用会触发 Layout 的属性来进行动画

有时候看起来不太可能使用这两个属性来完成，不过仔细想想往往能够想到解决方案。考虑下面动画：

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-22/29653560-file_1482384714959_15f64.gif)

demo 地址：[expand cord](https://wy-ei.github.io/demo/60fps/animation/expand-card.html)

一般的想法可能是修改每个卡片的 `top`, `left`, `width`, `height` 来实现这个功能，这样做当然可以实现效果，只是改变这些属性都会触发 Layout 进而触发 Paint 操作，在复杂应用上势必造成卡顿。下面介绍一种使用 transform 来完成此动画的方法。

```js
// 拿到初始尺寸
let first = card.getBoundingClientRect();
// 加上最终状态的类名
card.classList.add('card--expand');
// 拿到最终尺寸
let last = card.getBoundingClientRect();

// 设置形变参考点
card.style.transformOrigin = '0 0';

// 计算需要位移和伸缩的量
let transform = {
  x: first.left- last.left,
  y: first.top - last.top,
  sx: first.width / last.width,
  sy: first.height / last.height
};
// 加上 transform 将其从最终状态缩小到最初状态
card.style.transform = `translate(${transform.x}px, ${transform.y}px)
    scale(${transform.sx},${transform.sy})`;

// 在下一帧
requestAnimationFrame(function(){
  // 加上过渡时间
  card.style.transition = 'transform .4s cubic-bezier(0,0,0.3,1)';
  // 将 transform 取消，这样就会慢慢过渡到最终状态
  card.style.transform = 'none';
});
```

以上思路是使用 `getBoundingClientRect` 将动画的始态和终态的尺寸和位置计算出来，然后利用 transform 来进行过渡，思路在代码注释中已经进行了说明。

经过这样的处理，原本需要使用 `top`, `left`, `width`, `height` 来进行的动画使用 `transfrom` 就搞定了，这会大大地提示动画的性能。

### 使用 transform, filter 和 opacity 来完成动画

使用以上 3 个属性来完成动画，可以避免在动画的每一帧进行重绘。但如果在动画中改变了其他属性，那也不能避免重新绘制。要尽可能地利用这几个属性来完成动画。涉及位移的考虑使用 translate，涉及大小的考虑 scale，涉及颜色的考虑 opacity，为了实现流畅的动画要想尽一切办法。

这里给出一个案例，Instagram 的安卓 APP 在登录的时候，有一个颜色渐变的效果，这种效果常常见到。

![text=Instagram 登录页的背景色渐变效果](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-21/18081357-file_1482309109052_180e1.png)

通过地不断地改变背景颜色能很快地实现，测试后会发现在低端设备上会感到卡顿，CPU 使用率飙升，这是因为修改背景颜色会导致页面重绘。为了不重绘也能达到同样的效果，我们可以使用两个 div，给它们设置两个不同的背景色，在动画中改变两个 div 的透明度，这样两个不同透明度的 div 叠加在一起就能得到一个颜色演变的效果，而整个动画只使用了 opacity 来完成，完全避免了重绘操作。

关于示例，你可以在此处看到: [使用 background 完成渐变 vs 使用 opacity 完成渐变](https://wy-ei.github.io/demo/60fps/animation/background-vs-opacity.html)

不要混用 transform, filter, opacity  和其他可能触发重排或重绘的属性，虽然使用 transform, filter, opacity 来完成动画能够有很好的性能，但是如果在动画中混合使用了其他的会触发重排或重绘的属性，那么依然不能达到高性能。

### 使用 `requestAnimationFrame` 来驱动动画


前面提到的动画大多是使用 CSS 动画 和 CSS 过渡 CSS 动画通常是事先定义好的，无法很灵活地控制，某些时候可能需要使用 JavaScript 来驱动动画。新手常常使用 setTimeout 来完成动画，问题在于使用 setTimeout 设置的回调会在主线程空闲的时候才会调用，想象下面场景：

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-22/28220586-file_1482393564393_826e.png)

setTimeout 在一帧的中间位置被触发，随后导致重新计算样式进而导致一个长帧。setTimeout/setInterval 主要存在以下局限性：

1. 在页面不可见的时候依然会调用（耗电）
2. 执行频率并不固定（一帧内可能多次触发，造成不必要的重排/重绘）

setTimeout/setInterval 会周期性的调用，及时当前网页并没有在活动。另外因为调用时机不确定可能引发的在同一帧内多次调用同一个回调，如果回调中触发了多次重绘，那么会出现在一帧中重绘多次的情况，这是没有必要的，且会导致掉帧。

而 `requestAnimationFrame`，一个专门用来驱动动画的 API，它有以下好处：

1. 保证回调在下一帧调用
2. 根据机器的刷新频率调整执行频率
3. 当前网页不可见的时候不执行回调

虽然 `requestAnimationFrame` 是一个已经存在很多年的 API 了，但是还是存在诸多误读，其中最严重的是认为使用 `requestAnimationFrame` 能够避免重新布局和重绘，浏览器能够启动优化措施，让动画更流畅，这是错误的，浏览器能保证的仅仅是以上 3 条，在 `requestAnimationFrame` 的回调中进行强制同步布局依然会触发重排。

在编写使用 JavaScript 驱动的动画时，使用 `requestAnimationFrame` 可以将对 DOM 的写操作放在下一帧进行，这样该帧后面对 DOM 的读取操作就不会引发强制性同步布局，浏览器只需要在下一帧开始的时候进行一次重排。

## 5. 正确地处理滚动事件

现代浏览器都使用一个单独的线程来处理滚动和输入，这个线程叫做合成线程，它能够和 GPU 进行通信来告诉 GPU 如何移动图层，进行页面的滚动。如果页面上绑定了 touchmove，mousemove 这类事件，合成线程需要等待主线程执行相应的事件监听函数，因为这些函数里面可能会调用 `preventDefault` 来阻止滚动。

对于优化 scroll，touchmove，mousemove 等事件，其中一个最为重要的建议就是，要控制此类高频事件的回调的执行频率。说到控制频率，自然会想到 debounce 和 throttle 这两个函数。曾一度为止迷惑，不妨简要对这两个函数进行科普：

### 使用 debounce 或 throttle 控制高频事件触发频率

debounce 和 throttle 是两个相似（但不相同）的用于控制函数在某段事件内的执行频率的技术。

#### debounce

多次连续的调用，最后只调用一次

想象自己在电梯里面，门将要关上，这个时候另外一个人来了，取消了关门的操作，过了一会儿门又要关上，又来了一个人，再次取消了关门的操作。电梯会一直延迟关门的操作，直到某段时间里没人再来。

#### throttle

将频繁调用的函数限定在一个给定的调用频率内。它保证某个函数频率再高，也只能在给定的事件内调用一次。比如在滚动的时候要检查当前滚动的位置，来显示或隐藏回到顶部按钮，这个时候可以使用 throttle 来将滚动回调函数限定在每 300ms 执行一次。

需要注意的是这两个函数的使用方法，它们接受一个函数，然后返回一个节流/去抖后的函数，因此下面第二种用法才是正确的

```js
// 错误
$(window).on('scroll', function() {
   _.throttle(doSomething, 300);
});

// 正确
$(window).on('scroll', _.throttle(doSomething, 300));
```

### 使用 `requestAnimationFrame` 来触发滚动事件的回调

如果在事件监听函数中进行了 DOM 操作，这可能会消耗不少时间，事件监听函数执行的时间变长，与 GPU 进行通信的合成线程也就迟迟接收不到通知，浏览器也就迟迟不知道如何滚动页面，由此引发的就是卡顿。对于这类同步的事件（浏览器等待事件执行完成），可以在事件触发的时候先读取需要获取的 DOM 元素的尺寸位置等信息，然后将其他改写 DOM 的操作安排在 `requestAnimationFrame` 中完成，浏览器能够更快地执行完事件回调，还能避免后续的读取 DOM 的时候发生重排。

另外，有时候希望事件在每一帧执行一次，此时是使用 throttle 是无法满足需求的，使用 `requestAnimationFrame` 可以保证每一帧都会调用，需要注意的是有的事件触发的频率可能是一帧好几次。因此在使用 `requestAnimationFrame` 的时候要注意判断是否在一帧内多次触发了回调。

```js
let padding = false;
function onTouchmove (evt) {
    if (padding){
        return;        
    }
    padding = true;
    requestAnimationFrame(function(){
        // ...

        padding = false;
    });
}
document.body.addEventListener('touchmove', onTouchmove);
```

## 总结

这两篇文章对浏览器的渲染过程进行了简要描述，然后根据浏览器渲染原理，分析实现流畅的动画需要注意的方方面面，并给出多个实现流畅动画的实用技巧。

不过规则最是不停在改变的，浏览器也不断在更新，一年前是性能瓶颈的点，现在可能已经不是瓶颈了。在开发过程中应该结合调试工具，去分析每一次重排和重绘，分析各个阶段的耗时，找出真正的问题所在。而不是仅仅记住一些条条框框。
