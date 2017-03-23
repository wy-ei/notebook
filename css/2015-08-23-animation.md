---
layout: post
title: CSS animation
category: CSS
---

## CSS animation

transition 仅仅是让元素在初始状态和结束状态之间进行过渡，虽然也是动画，但功能还是很局限，animation 引入关键帧来描述动画，并提供了更多的属性来控制动画，来看看如何使用 animation 吧。

### keyframes

前面提到 animation 是利用关键帧来描述动画的，所以首先需要定义关键帧，定义关键帧需要使用到 keyframes ，它的用法很简单，形如下面这样：

```css
@keyframes rotating {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
```

其中 from 和 to 可以替换为 0% 和 100%， 它们表示初始状态和结束状态。还可以添加更多帧信息，像这样：

```css
@keyframes bounce {
  0% {
    transform: scale3d(.3, .3, .3);
  }
  20% {
    transform: scale3d(1.1, 1.1, 1.1);
  }
  40% {
    transform: scale3d(.9, .9, .9);
  }
  60% {
    opacity: 1;
    transform: scale3d(1.03, 1.03, 1.03);
  }
  80% {
    transform: scale3d(.97, .97, .97);
  }
  to {
    transform: scale3d(1, 1, 1);
  }
}
```

### animation

定义个 keyframes 之后就可以将其运用在元素上了，这就用到了 animation 属性。

```css
div {
    animation: bounce 2s linear infinite;
}
```

该属性的语法如下：

```
animation: <name> | <duration> | <timing-function> | <delay> |
   <iteration-count> | <direction> | <fill-mode> | <play-state>;
```
该属性可以分为 8 个部分，其中每一部分都有单独的属性，就像 transition 一样，有 transition-duration 等等。animation 属性中至少有 <name>, <duration>, <timing-function> 这三个的值明确，动画才会执行。


#### animation-name

指定要运用的 keyframes， 该属性要对应一个 keyframes 的名字。

#### animation-duration

表示该动画持续的时间，该值不可或缺。

#### animation-timing-function

一个描述过渡过程的函数，同 transition-timing-function。

#### animation-delay

表示动画开始执行前要延时的时间。

#### animation-direction

指定动画执行的方向，有如下几个可选值：

+ normal：动画向前播放，这是默认属性。
+ reverse：动画反向播放。
+ alternate：动画正向运行。到了终点后会再返回来。带时间功能的函数也反向，比如 ease-in 在反向时成为 ease-out，在动画执行偶数次时正向运行，奇数次时反向运行。
+ alternate-reverse：动画反向播放。同 alternate，到了终点后会返回来。

#### animation-iteration-count

指定动画的播放次数，可以取任意正数，不一定是正整数，比如取值为　1.5 会完成一个整周期和一个半周期的动画。另外也可以取 infinite 这个特殊值让动画无限次执行。

#### animation-play-state

该属性用于控制动画的播放与停止播放，可以 `running` 和 `paused` 两个值，可以修改这个属性来让动画停止或开始播放。

#### animation-fill-mode

这个属性用来决定动画开始执行前和执行结束这两个时刻的一些动作。可以取得值有下面几个：

+ none：这是默认值，动画按常规执行。
+ forwards：动画执行完成后，运用动画的元素保持动画最后一帧的样式。
+ bakcwards：动画在 delay 开始阶段就应用第一帧画面。在动画没有设置 delay 的时候该值可能看不出什么效果，但假如动画的第一帧是让元素背景色变为黑色，且动画有 1 秒的延时，那么元素会在运用了动画后立刻运用第一帧动画，改变背景色为黑色。假如没有设 bakcwards 这个值，那么元素会在 1 秒后才运用第一帧动画的样式。
+ both：同时执行 forwards 和 backwards 的动作。

_写到这里动画的使用是彻底清楚了_
