---
layout: post
title: CSS 过渡
category: CSS
---


## CSS transition

transition 用于将元素从一种状态平滑地过渡到另外一种状态。基本语法如下：

```css
transition: [<property>] || [<duration>] || [<timing-function>] || [<delay>];
```

比如鼠标移动到某个元素上 1 秒后将元素在 500 毫秒内将其 width 线性地变为 200px，可以这样写：

```css
div{
  width: 100px;
  height: 100px;
  background-color: #333;
  transition: width 500ms linear 1s;
}

div:hover{
  width: 200px;
}
```

如果指定了过渡属性，那么就只会对指定的属性进行过渡。如果希望所有可过渡的属性都能在变化后平滑地过渡，那么可以不指定 property 或者指定为 all 。

对于 time-function， 浏览器内预设了一些，如 ease, linear, ease-in, ease-out, ease-in-out ，可以使用这些预设的过渡函数，也可以使用三次贝塞尔函数或者 steps 函数来自定义过渡函数。

三次贝塞尔函数就不再说了，steps 函数是将过渡过程划分为几个均匀的阶段，其具体语法为 `steps(n, [start|end])`, 其中 n 决定了整个渐变被分为几个阶段，第二个参数可以是 start 或 end，start 表示阶跃发生在开始阶段，而 end 表示阶跃发生在结束阶段。

```css
div{
  width: 100px;
  height: 100px;
  background-color: #333;
  transition: width 1s steps(1, end);
}

div:hover{
  width: 200px;
}
```

这里 `steps(1, end)` 表示整个过渡就一次跳跃，使用了 end ，具体的效果就是鼠标移动到元素上 1 秒的时候，元素的宽度变为了 200px, 动画结束，整个过渡用时 1 秒。如果使用 `steps(1, start)` ，实际效果就是鼠标移动到元素上后元素的宽度立刻变为 200px ,这个时候过渡过程还没有结束，在 1 秒后过渡才算结束，整个过程也用时 1 秒。

另外还有 `step-start` 和 `step-end` 两个过渡函数，它们实际上就是第二个参数固定的 steps 函数而已。

多个过渡效果可以使用逗号隔开，如: `transition: width 1s steps(1, end), height 500ms linear;`
