---
layout: post
title: CSS 背景
category: CSS
---

* toc
{:toc}

## CSS 背景

CSS 背景主要包括下面几个属性：

+ background-color
+ background-image
+ background-repeat:背景图片的重复方式
  + repeat
  + repeat-x
  + repeat-y
  + no-repeat
+ background-attachment：背景图片是固定还是滚动
  + scroll
  + fixed
+ background-position：背景图片的位置
  + left top
  + 0 0
  + 200px 100px
  + center center
  + 0% 0%

当 `background-position` 的取值是百分数的时候，这里的百分数的参考量并不是容器的大小，而是容器大小减去背景图片的大小。

另外 background-position 还可以向下面这样，设置相对某个参考点的偏移。这里 `left|right`  和 `bottom|top` 都需要存在，否则不起作用。

```css
background-position: left 10px top 15px;   /* 10px, 15px */
background-position: left      top     ;   /*  0px,  0px */
background-position:      10px     15px;   /* 10px, 15px */
background-position: left          15px;   /*  0px, 15px */
background-position:      10px top     ;   /* 10px,  0px */
background-position: left      top 15px;   /*  0px, 15px */
background-position: left 10px top     ;   /* 10px,  0px */
```

连起来使用：

```css
bakcground:color image repeat attachment position
```

## CSS3 新增

需要加浏览器厂商前缀

+ background-origin：指定绘制背景图片的起点。（联想盒子模型）
  + padding-box：背景图片起始于padding区域的左上角
  + border-box：起始于border区域左上角
  + content-box：起始于内容区域左上角

`background-origin` 属性用来设置 `background-position` 属性的参考点，默认情况下参考点是 padding 区域的左上角，而 `background-origin` 的出现可以允许修改这个参考点。


+ background-clip：指定背景图片的裁剪范围。
  + padding-box：位于 padding-box 外的背景都被裁掉
  + border-box：位于 border-box 外的背景都被裁掉
  + content-box：背景图片和背景颜色只能存在于 content 区域。



+ background-size：指定背景图片的大小
  + auto：图片的原始大小
  + 100px：指定宽高都为100px
  + 50%：指定宽高为容器宽高的50%，这个容器是 border，padding 还是 content 区域就要根据 background-origin 来决定了。
  + cover：不按比例伸缩图片，使得图片铺满整个容器
  + contain：保持图片的宽高比例，将图片缩放到合适比例使得容器能完全容纳下图片。

有时候需要添加多个背景图片，这个时候可以使用`,`将多组属性分开，举例如下：

```css
background-image: url(https://avatars3.githubusercontent.com/u/7794103?v=3&s=460),url(https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3415372198,2864505025&fm=58);
background-size: 50%,50%;
background-position: left top,top right;
background-repeat: no-repeat;
```

也可以一句话搞定：

```css
background: url(pic2.jpg) top left / 50% no-repeat,url(pic1.jpg) top right /50% no-repeat;
```

至于格式嘛，就是下面这样：

```css
background:image position /size repeat attachment clip origin
```
