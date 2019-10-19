---
layout: post
title: CSS 垂直居中
category: CSS
---



- *
{:toc}

<style>
.ex-container{
  border: 1px solid #999;
}
#ex-center-single-text{
  height: 150px;  
}
#ex-center-single-text .content{
  line-height: 150px;
  text-align:center;
}
</style>


垂直居中，这是任何前端开发者都遇到的场景，也是大多数人都为之困惑的问题。记得当时来公司后，进行了一次笔试，其中一个便是用 CSS 实现垂直居中，我突然发现自己竟不能写出一种自信无误的实现方式。

下面来总结一下 CSS 垂直居中的方式，对于 hack 气息较重的方法（比如使用 table，button 等）这里不再讨论了，这里主要谈谈现代 CSS 中实现垂直居中的方式。


下面的示例中均采用下面这样的 HTML 结构：

```html
<div class="container">
    <div class="content"></div>
</div>
```



## 基于 line-height 的解决方案

如果 content 的内容是单行的文本，或者是一个图片，或者说内容的 display 属性是 `inline` 或者 `inline-block`，那么我们可以通过 `line-height` 属性来让其居中，最简单的方式是将 `.content` 的 `line-height` 和 `.container` 的 `height` 设为相同的值。


<div id="ex-center-single-text" class="ex-container">
    <div class="content">CSS 垂直居中</div>
</div>

CSS 代码：

```css
.container{
  height: 150px;  
}
.container .content{
  line-height: 150px;
  text-align: center;
}
```

## 基于 padding 的解决方案

给 `.container` 设置相同的上下内边距，内容自然就实现了垂直居中，这很好理解。

## 基于绝对定位的解决方案

使用绝对定位，并设置 `top: 50%; left: 50%;` 可以将 `.content` 的左上角定位至容器的中心点。目前还尚未实现居中，还需将将 `.content` 向上向左各移动一半的 `.content` 的高度和宽度。这个时候有两种实现方法：

### 1. 使用负外边距移动内容

如果 `.content` 的大小已知，比如是 `200px * 120px`，那么我们可以使用 `margin-top: -60px; margin-left: -100px` 来达成目标。最后的 CSS 代码为：

```css
.container{
    position: relative;
}
.container .content{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 120px;
    margin-left: -100px;
    margin-top: -60px;
}
```

### 2. 使用 translate 移动内容

很多时候 `.content` 的宽高可能并不固定，此时可以使用 `transform` 中的 `translate` 来移动内容，这是因为 `translate(-50%, -50%)` 中的百分比是基于自身尺寸计算的，而非 margin 中那样基于父元素尺寸计算。因此对于内容不固定的情况，以下代码能轻松实现垂直居中：

```css
.container{
    position: relative;
}
.container .content{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
```

该方案的缺点是，使用了 translate 可能影响到其他的变形，且为了兼容较旧的浏览器，需要添加浏览器厂商前缀。

## 基于视口单位的解决方案

在弹出对话框或者类似的场景下，我们希望某元素能够居中于视口中。这个时候可以使用 fixed 定位，外加上面提到的 “基于绝对定位的解决方案” 中类似的方法来实现。

此外你还有另外一种选择，那就是使用 `vh` 和 `vw` 这两个单位，`100vw` 就等于视口的宽度，也就是说 `1vw` 等于 1/100 的视口宽度，`vh` 也同理，`1vh` 等于 1/100 视口的高度。因此可以写出下列代码来将一个对话框在视口中居中：

```css
.dialog{
    position: fixed;
    margin-top: 50vh;
    margin-left: 50vw;
    transform: translate(-50%, -50%);
}
```

## 基于 flexbox 的解决方案

有了 flexbox 之后会发现实现垂直居中实在不能太容易，因为你只需要将容器的 `display` 指定为 `flex`，然后让内容在主轴和交叉轴上居中就可以了。甚至直接将容器指定为 `flex` 将内容的 `margin` 设置为 `auto` 就可以了。

```css
.container{
    display: flex;
}
.container .content{
    margin: auto;
}
```

或者只需给容器元素设置：

```css
.container{
    display: flex;
    justify-content: center;
    align-items: center;
}
```

有了这些方案，再也不怕垂直居中了。:sunglasses:
