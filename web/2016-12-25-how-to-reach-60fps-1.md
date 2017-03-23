---
layout: post
title: How To Reach 60FPS（基础篇）
category: Web
tag: 性能优化
---

* toc
{:toc}

这篇文章是我为了完成一次关于前端性能的分享而写下的，你可以在[这里](https://docs.google.com/presentation/d/1l-bIpgUgwCmHC2CKieayXY5EnbgwEoMxQdcmnKJ2Lhw/edit?usp=sharing)看到我分享时的 PPT。

## 什么是 fps，60fps 意味着什么？

fps（frames per second），指一秒内屏幕刷新的次数或者动画在一秒内更新的帧数。现代浏览器大多每秒刷新 60 次，为了和设备的刷新频率保持一致，动画也要保证每秒 60 更新帧。如果低于 60 fps，称动画发生了掉帧，如果掉帧严重，用户则能够明显地感觉到卡顿。高的帧率，意味着更连贯的动画，更流畅的滚动，这些总是能带来极好的用户体验。

<div class="react-component" data-type="FPS"></div>

## 构建 DOM 树、CSSOM 树、渲染树

要想高效地操作 DOM, 完成流畅的动画,需要了解浏览器是如何将 HTML/CSS/JavaScript 等资源渲染为 Web 页面的。下面就此过程进行描述:

浏览器接收到 HTML 文档后就会开始解析文档，并建立 DOM 树 (Document Object Model Tree)，DOM 树中记录了当前文档的所有节点。同时浏览器使用内联的 style 标签或者外部加载的 CSS 文档来构建 CSSOM 树（CSS Object Model Tree），CSSOM 树中记录了各个节点的样式规则。随后联合 DOM 树和 CSSOM 树构建出渲染树(Render Tree)，渲染树中记录了当前页面中所有可见节点的实际样式。之所以说实际样式，是因为 CSS 中可能出现 `width: 50%` 或 `color: inherit` 这样的写法，浏览器需要自顶向下地去根据父节点来计算出某个节点的实际样式。

整个步骤，如下图所示：

![text=渲染树的构建过程（图片来自 Chrome developer）](http://7xs1gu.com1.z0.glb.clouddn.com/16-9-24/93321516.jpg)

- DOM 树：记录了文档的结构与内容
- CSSOM 树：记录了 DOM 节点的样式规则
- Render 树：表示 DOM 中每个节点真实的样式

得到了渲染树，浏览器还不能开始进行绘制，因为页面上存在太多元素，如果页面中有一个元素被改变，这个时候如果重绘整个页面就显得很浪费，毕竟很多时候只是很小的一部分被改变了。浏览器为了高效地绘制，提出了图层(layer)的概念，按照某些规则将 DOM 节点划分在不同的图层中，这样一个节点的改变，浏览器会智能地去重绘那些受到影响的图层，而非所有图层，浏览器绘制的时候是以图层为单位的。

细分后的过程，大致是这样：

![text=Web 页面渲染流程](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-24/40084229-file_1482587915128_12523.png)

绘制过程就是浏览器调用绘图 API 来完成图层的绘制，绘制过程就是填充像素的过程，浏览器会调用一些类似于 `moveTo`, `lineTo` 这样的绘图 API，将 各图层绘制出来，得到一些像素点的集合，类似于一张位图（bitmap），这些位图随后被上传至 GPU，GPU 帮助浏览器将这些位图合并起来，得到最终显示在屏幕上的图片。


综上，浏览器渲染出 Web 页面的过程，大体可分为以下几个步骤：

1. 解析 HTML/CSS 生成 DOM 树 CSSOM 树
2. 联合 DOM 树和 CSSOM 树得到渲染树
3. 将 Render 树划分为多个图层，并绘制图层
4. 将各图层的数据上传至 GPU
5. GPU 合并图层得到最终展示在屏幕上的图片


可以想象浏览器内部实现原本以上论述复杂千万倍，以上也只是从非常宏观的角度去描述了浏览器渲染页面的过程。其中还没牵扯到 JavaScript，不过知道以上这些内容，起码对浏览器的渲染流程有了一个大体的认识。

## 浏览器在每一帧中要做的工作

JavaScript 通过 API 来修改 DOM 树和 CSSOM 树，CSS 中的 animation 或 transition 都会改变渲染树，每当渲染树被改变后，浏览器都需要重新计算样式，样式计算会涉及多个 DOM 节点，因为有些样式存在继承关系，还有则是相对父节点的。

每一帧中浏览器都 **可能** 要进行下列部分或全部步骤：

![text=每一帧浏览器可能要进行的工作](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-20/54507285-file_1482230407662_af99.png)

对上图中的各个步骤进行一个简要的解释说明：

- **JavaScript**：运行 JavaScript 代码，期间可能会添加 DOM 节点，修改节点的样式等，这会影响 DOM 树和 CSSOM 树，最终影响渲染树。另外 CSS 动画和 CSS 过渡都会修改渲染树。
- **Recalculate Style** ：这个节点会根据 CSS 选择器来计算节点的最终样式。
- **Layout**：一旦知道了各个节点关联的样式，这儿时候就能计算节点的实际尺寸以及其在屏幕上的位置，因为可能牵扯继承和相对单位，因此一个节点的改变可能会影响多个节点，比如修改了 `<body>` 的宽度，下面很多元素都会受到影响。
- **Update Layer Tree**：Layer Tree 中记录了各个图层之间的层叠关系，这会影响最终谁那些元素在上那些元素在下。
- **Paint**：填充像素，将图层上的文字、边框、阴影等绘制出来，绘制是基于图层的，绘制需要绘制的图层，最终得到一张位图，其中记录了当前图层的视觉表现。
- **Composite Layer**：得到图层以后需要将其按照正确的层叠关系合并起来，最终得到一整块需要显示在屏幕上图片。

在 Chrome DevTools 可以清楚地看到这几个步骤：

![](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-20/1671394-file_1482238561972_7546.png)

### 部分步骤可以被跳过

如果修改了一个会影响元素的尺寸或位置的属性，比如 width 和 height 或者 top 等，需要重新进行 Layout 操作，随后会进行重绘，随后将图层合并得到新一帧。这就会执行以上的所有步骤。

但如果只是修改了 color 这样的不涉及节点尺寸或定位的属性，则不需要执行 Layout 这一步骤。因为 color 的修改，并不会影响元素的尺寸和位置，只需要进行一次重绘就好了，此时以上步骤中的 Layout 就被跳过了。

![text=不需要重排](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-24/2354143-file_1482582976272_412e.png)


同样的，如果修改了一个都不需要进行重绘的属性，那么可以跳过 Layout 和 Paint 这两个步骤，此时只需要要进行图层的合并操作就能得到新一帧的图片。

![text=不需要重排和重绘](http://7xs1gu.com1.z0.glb.clouddn.com/16-12-24/94818326-file_1482583111284_433.png)

不需要进行重排（Layout）和重绘（Paint）操作，自然会耗时更短，每一帧中浏览器需要进行的工作也就越少，一定程度上也就能够提升性能。由此看来对 DOM 树的修改、对 DOM 节点属性或样式的修改，需要付出的代价是不同的，某些操作可能会触发重排和重绘操作，而有些操作则可以完全跳过以上步骤。

### 规律

不过也可以得出如下的一个规律:

- **Layout:** 涉及到 DOM 操作，DOM 节点的尺寸、位置的属性的修改会触发 layout 进而会导致 repaint（重绘）和图层合并。比如修改 width，margin，border 等样式，或者修改 clientWidth 等属性。
- **Paint:** 涉及 DOM 节点的颜色的属性会导致重绘，比如 color，background，box-shadow 等
- **Composite:** 目前常用的 CSS 属性中，对 `opacity`, `transform`, `filter` 这三个属性的修改只需要进行 Composite 操作。这几个属性的改变，GPU 只需要在合并图层之前对图层进行一些变换，比如 opacity 属性的改变，GPU 只需要在合并之前改变图层的 alpha 通道。其他两个属性的修改，GPU 也可以直接进行一些矩阵运算得到变换后的图层。

### 参考资料

paul irish 罗列了那些操作会触发重排，你可以在这里看到: [What forces layout / reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

另外在 [https://csstriggers.com/](https://csstriggers.com/) 这个网站上，Chrome 团队的一伙人列出了对 CSS 各属性的修改会引发以上那些操作。

在实践中可以时刻参考这两个列表，并结合调试工具，来避免没有不要的重排和重绘。
