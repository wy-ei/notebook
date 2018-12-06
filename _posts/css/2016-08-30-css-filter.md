---
layout: post
title: CSS filter - 滤镜效果
category: CSS
tag: CSS
description: CSS3 中的 filter 属性，可以给任何元素添加滤镜效果。
---

* toc
{:toc}

<style>
.filter-rect {
    box-sizing: border-box;
    width: 100%;
    max-width: 500px;
    padding: 10px 20px;
    box-shadow: 0 0 1px #333;
}
input[type=range]{
    margin: 15px 0;
    width: 100%;
    max-width: 500px;
    position: relative;
    margin-bottom: 30px;
}
input[type=range]::after{
    content: attr(alt);
    display: block;
    color: #000;
    font-size: 16px;
    position: absolute;
    top: 20px;
    left: 0;
}
</style>

* 目录
{:toc}

最近在读 [《CSS 揭秘》](https://book.douban.com/subject/26745943/)这本书，书中提到了 CSS3 中的 filter 属性，看了看 w3.org 上 [Filter Effects Module Level 1](https://www.w3.org/TR/filter-effects/#FilterProperty) 后，来谈谈这个属性，下面结合例子来说说该如何使用该属性。

## 基本语法

filter 属性可以用在任何元素上，并非只能用在图片上。该属性的基本语法如下：

```css
filter: none | [ <filter-function> | <url> ]+ ;
```

这里的 none 表示不添加滤镜效果，而 `filter-function` 则是指某种滤镜效果，比如模糊（blur）、反色（invert），目前可选的滤镜效果有下面这些：

- blur()：添加高斯模糊效果
- brightness()：调节亮度
- contrast()：调节对比度
- drop-shadow()：添加阴影效果
- grayscale()：转为灰度图效果
- hue-rotate()：调节色调
- invert()：反色处理
- opacity()：调节透明度
- sepia()：复古处理
- saturate()：调节饱和度

另外还可以使用 url 来加载一个 SVG，使用 SVG 中的 `<filter>` 来作为滤镜，但这个不在今天的讨论范围中。

## 滤镜的使用方法和实例展示

下面对各个滤镜的使用方法进行说明，每个滤镜都配合了一个示例，可以拖动滑块来观察效果。


### blur

接受一个长度值作为参数，用来指定模糊半径，不接受百分比，不接受负值，默认值为 0。

```css
filter: blur(10px);
```

<div class="filter-rect" data-func="blur(%dpx)" data-min="0" data-max="50" data-step="1" data-value="10"></div>


### brightness

调节亮度，接受一个百分数作为参数，用来指定亮度。0% 让其表现为完全黑色，100% 让其保持原样，超过 100% 让其变亮。

```css
filter: brightness(50%);
```

<div class="filter-rect" data-func="brightness(%d%)" data-min="0" data-max="200" data-step="1" data-value="50"></div>


### contrast

调节对比度，接受一个百分数作为参数，用来指定对比度。0% 让其表现为完全灰色，100% 让其保持原样，超出 100% 让其对比度增强。

```css
filter: contrast(50%);
```

<div class="filter-rect" data-func="contrast(%d%)" data-min="0" data-max="200" data-step="1" data-value="50"></div>


### drop-shadow

该函数和 box-shadow 有些相近都能给元素添加投影，不同的是不包含扩张距离，也不支持 inset 关键字，且只能应用一组值。

使用方法如下：

```css
filter: drop-shadow(4px 4px 3px #333);
```

三个长度值和 box-shadow 的前三个长度值相同，分别表示横向偏移量、纵向偏移量、模糊距离。颜色值当然是指模糊的颜色了。**注意：这里滤镜效果虽然像是函数，但是其参数值是不能用逗号隔开的**。

<div class="filter-rect" data-func="drop-shadow(4px 4px %dpx #333)" data-min="0" data-max="30" data-step="1" data-value="3"></div>

### grayscale

转为灰度图效果，接受一个百分比作为参数，0% 表示没有灰度效果，100% 完全变为灰度图。

```css
filter: grayscale(50%);
```

<div class="filter-rect" data-func="grayscale(%d%)" data-min="0" data-max="100" data-step="1" data-value="50"></div>

### hue-rotate

知道 HSL 色系的同学应该明白这里的 H 就表示 hue（色度），这个值的有效范围为 0deg~360deg，超出 360deg 的会使用 360 取余。默认值为 0deg。

```css
filter: hue-rotate(50deg);
```

<div class="filter-rect" data-func="hue-rotate(%ddeg)" data-min="0" data-max="360" data-step="1" data-value="50"></div>

### invert

反色处理，接受一个介于 0% 至 100% 的百分比作为参数，表示反色的程度，0 表示不反色，100% 表示完全反色。

```css
filter: invert(50%);
```

<div class="filter-rect" data-func="invert(%d%)" data-min="0" data-max="100" data-step="1" data-value="50"></div>

### opacity

调节透明度，接受一个介于 0% 至 100% 的百分比作为参数，0% 表示完全透明，100% 表示没有透明效果（维持原样）。opacity 这个单词的意思是 **不透明** ，不要搞错了。

```css
filter: opacity(50%);
```

<div class="filter-rect" data-func="opacity(%d%)" data-min="0" data-max="100" data-step="1" data-value="50"></div>

### saturate

saturate（vt. 使饱和; adj. 饱和的），调节饱和度。接受一个百分比作为参数，0% 表示完全不饱和，100% 表示保持原样，超出 100% 表示过饱和。不允许负值。

```css
filter: saturate(50%);
```

<div class="filter-rect" data-func="saturate(%d%)" data-min="0" data-max="300" data-step="1" data-value="50"></div>

### sepia

将输入内容变为黄褐色，效果就像是泛黄的老照片，我称其为复古。接受一个介于 0% 至 100% 的百分比作为参数，0% 表示不变，100% 表示完全变为黄褐色。

```css
filter: sepia(50%);
```

<div class="filter-rect" data-func="sepia(%d%)" data-min="0" data-max="100" data-step="1" data-value="50"></div>


## 多滤镜组合使用

filter 属性可以接受多组滤镜效果，比如复古之后再模糊，可以这样写：

```css
filter: sepia(50%) blur(5px);
```

<div class="filter-rect" data-func="sepia(%d%) blur(5px)" data-min="0" data-max="100" data-step="1" data-value="50"></div>

<script>
window.addEventListener('load', function(){
    var rects = [].slice.call(document.querySelectorAll('.filter-rect'), 0);
    rects.forEach(function(rect) {
        var func = rect.dataset.func,
            min = rect.dataset.min,
            max = rect.dataset.max,
            step = rect.dataset.step;
        var img = document.createElement('img');
        img.src = '{{site.images}}/16-9-3/75491219.jpg';
        rect.appendChild(img);
        var input = document.createElement('input');
        input.type = 'range';
        input.min = min;
        input.max = max;
        input.step = step;
        var value = func.replace('%d', input.value);
        input.alt = 'filter: ' + value;
        img.onload = function(){
            img.style.filter = img.style.webkitFilter = value;
        }
        input.onchange = function(event) {
            var value = func.replace('%d', input.value);
            input.alt = 'filter: ' + value + ';';
            img.style.filter = img.style.webkitFilter = value;
        };
        rect.appendChild(input);
    });
});
</script>
