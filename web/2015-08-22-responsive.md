---
layout: post
title: CSS 响应式布局
category: CSS
---


媒体查询常常用在响应式布局上，响应式布局中，常常需要对不同尺寸的页面运用不同的样式，这个时候就需要借助于媒体查询了。说到媒体查询又不得不引入媒体类型。

## 媒体类型

早在 CSS2.0 的时候就有了媒体类型这个东西，使用它可以对不同的显示设备加载不同的样式表，常用的媒体类型有下面几种：

+ screen：代表一般的屏幕显示设备
+ print：表示打印机或者打印预览页面
+ all：代表所有类型

媒体类型的使用方法如下：

### 通过 link 标签使用

```html
<link rel='stylesheet' type='text/css' src='screen.css' media='screen' />
<link rel='stylesheet' type='text/css' src='print.css' media='print' />
```

以上 html 代码中，通过 link 标签的 `media` 属性取值为 `screen` 或 `print` 来在不同的显示环境下加载不同的样式表。


### 通过 `@import` 指令使用

除了使用 link 标签外，还可以使用在 css 的 `@import` 中使用媒体类型

```html
<style type='text/css'>
    @import url(print.css) print;
</style>
```

以上代码是说当前显示模式是打印机那么就加载 print.css 这个样式表，否则不加载。




## 媒体查询

使用媒体类型能够对不同的显示环境运用不同的样式表，但是还不能做到当页面呈现不同宽度时运用不同的样式这样的需求。但这确实是响应式设计的不可或缺的，于是媒体查询应运而生。

必须现在希望当页面的尺寸小于 320px 的时候将 body 的字体设置为 12px，那么使用媒体查询可以这么做：

```css
@media screen and (max-width:320px){
	body{
        font-size: 12px;
    }
}
```

媒体查询使用到 `@media` 这样的一个指令，它的具体语法为：

```css
@media 媒体类型 and (媒体特性) {
    样式
}
```

`and` 的意思是，不单单要满足媒体类型 ，还要满足括号里的媒体特性，两者都满足的时候才运用花括号里面的样式。

还可以使用多个 and 来连接多中媒体特性，比如当页面尺寸介于 320px 和 460px 之间时运用样式，可以这么写：

```css
@media all and (min-width: 320px) and (max-width: 460px){
    /*样式*/
}
```

### 媒体特性

其中可以作为媒体特性的属性有：

+ width：浏览器可视宽度，接受前缀（min/max），就是说可以使用 min-width 和 max-width。
+ height：浏览器可视高度，接受前缀（min/max）。
+ device-width：设备屏幕的宽度，接受前缀（min/max）。
+ device-height：设备屏幕的高度，接受前缀（min/max）。
+ orientation：检测设备目前处于横向还是纵向状态，可取值为：portrait 和 landscape。
+ aspect-ratio：检测可视区域宽高比，接受前缀（min/max）。
+ device-aspect-ratio：检测设备的宽高比，接受前缀（min/max）。
+ color：检测设备显示一个颜色需要用到的 bit 数，接受前缀（min/max）。
+ color-index：检查设备颜色索引表中的颜色数量，他的值不能是负数，接受前缀（min/max）。
+ monochrome：检测单色楨缓冲区域中的每个像素的位数，接受前缀（min/max）。
+ resolution：检测屏幕或打印机的分辨率，接受前缀（min/max）。(例如：min-resolution:300dpi 或 min-resolution:118dpcm)。
+ grid：检测输出的设备是网格的还是位图设备，取值可以为 0 或 1，如果是基于网格的其值为 1 ，否则为 0。
+ scan：仅仅作用用 meida-type  为 tv 的时候。

关于媒体的性的更详细的说明，可以参看：[Media Queries](https://www.w3.org/TR/css3-mediaqueries/#media1)。


### not 和 only

其实在 `@media` 指令后面还可以跟另外两个关键字，not 和 only。

#### not

not 用来多条件进行取反，也就是选择所有不满足 not 后面设置的条件的情况。

```css
@media not print and (max-width:1200px){

}
```

#### only

only 大多时候可以省略，它的意思是仅仅当满足后面条件时候才运用样式。但不加 only 也是这个效果。

```css
@media only print and (max-width:1200px){

}
```

only 的存在更多时候可能是为了处理旧版本的浏览器，因为以上使用 `@media` 指令写的条件，也是可以使用 link 标签的 media 属性来设置的，比如：

```html
<link rel="stylesheet" href="screen.css" media="screen and (max-width: 1000px)">
```

以上 link 标签会在满足媒体查询条件的时候才加载样式表 `screen.css`。但是早期还不支持媒体查询只支持媒体类型的浏览器，会忽略掉 screen 后面的条件，当媒体类型是 `screen` 的时候就加载了样式表，这显然不是期望的效果。如今向下面这样写：


```html
<link rel="stylesheet" href="screen.css" media="only screen and (max-width: 1000px)">
```

对于那些支持媒体类型不支持媒体查询的设备，会认为媒体类型为 only ，当然了这不满足任何一种设备，该条件也就被忽略了。

## meat 标签

当在移动设备上面使用响应式布局的时候，常常发现媒体查询没有其作用，只是呈现了一个全局缩小的页面。这是因为这些移动设备有一个虚拟的可视空间，这个空间实际上要比屏幕大很多。为了能让媒体查询在这些设备正常工作，就需要添加一个特殊的 meta 标签。

```
<meta name='viewport' content='' />
```

其中 content 字段可以取如下值：

+ width：视口的宽度，取值为一个数值或字符串"width-device"
+ height：视口的高度
+ initial-scale：初始的缩放比例
+ minimun-scale：最小允许的缩放比例
+ maximun-scale：最大允许的缩放比例
+ user-scalable：是否允许用户对视口进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许


```html
<meat name='viewport' content='width=device-width,initial-scale=1.0' />
```

以上代码表示宽度为设备的宽度，初始缩放比例为 1 （也就是不缩放），且不允许用户缩放视口大小。
