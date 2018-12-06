---
layout: post
title: CSS transform
category: CSS
---

* toc
{:toc}

## transform-origin

`transform-origin` 属性用来改变元素的变形中心点，默认情况下元素旋转或者缩放等等形变都是以元素的中心为参照点的，该属性可以允许修改这一特性。具体的使用方法如下：

```css
/*指定形变中心为元素的左上角*/
transform-origin: top left;

/*指定形变中心为元素的中心点（横轴 50% 和 纵轴 50% 处）*/
transform-origin: center;
transform-origin: center center;
transform-origin: 50% 50%;
```

同样是顺时针旋转 90 度，看下面图你就明白 `transform-origin` 了。

![transform-origin](https://cloud.githubusercontent.com/assets/7794103/17830394/a4c79314-66fc-11e6-8949-817316812e64.png)

## transform-style

该属性指定元素是在 3D 空间展现或是在 2D 空间展示。一共有两个可选值。

- preserve-3d：指定元素在 3D 空间展示
- flat：元素会在 2D 空间展示，本该在 3D 空间展示的内容会投影到 2D 平面上

![transform-style](https://cloud.githubusercontent.com/assets/7794103/17830570/db9e5fb2-6701-11e6-9b15-6446889a4dac.png)

## perspective

该属性用于设置观察者距离元素的位置。下图中分别设置 perspective 为 8000px 和 1000px ，两幅图就像是观察者站在 8000px 和 1000px 远处看到的场景一样。

![image](https://cloud.githubusercontent.com/assets/7794103/17830612/fa38fe68-6702-11e6-8590-ac2a12a60f2c.png)

该属性设置在 3D 形变元素的父容器上，该父容器就像是一个一个舞台，而其中的子元素是舞台上的演员，这个 perspective 就决定了观看者距离舞台的距离。如果很近会看不到整体，如果很远，则看不到元素之间的位置关系了。

该属性还可以设置在子元素上面，当你想突出某个子元素的时候，可以在它上面设置该属性，用来改写默认值（父元素上的 perspective）。

## perspective-origin

该属性用于决定观看着在舞台前方的位置。该属性的默认值为 `center center`，分别表示横轴和纵轴的位置。

```css
/*在正前方观察，等同于 center center 或者 50% 50%*/
perspective-origin: center;

/*在左上角观察，等同于 0 0*/
perspective-origin: left top;

/*在右下角观察，等同于 100% 100%*/
perspective-origin: left top;
```

## backface-visibility

当元素经过旋转，其背面呈现在视图中的时候，该属性用来决定元素的背面是否可见。该属性有两个可选值：`visible` 和 `hidden`。

![backface-visibility](https://cloud.githubusercontent.com/assets/7794103/17830710/6927f524-6706-11e6-868f-f61125a330f3.png)

## transform-function

3D 变换的 X,Y,Z 轴如同所示：

![]({{site.images}}/17-4-21/58142497-file_1492770011210_12ce8.png)

`transform` 可取值很多，参数如下：

```css
/* Keyword values */
transform: none;

/* Function values */
transform: matrix(1.0, 2.0, 3.0, 4.0, 5.0, 6.0);
transform: translate(12px, 50%);
transform: translateX(2em);
transform: translateY(3in);
transform: scale(2, 0.5);
transform: scaleX(2);
transform: scaleY(0.5);
transform: rotate(0.5turn);
transform: skew(30deg, 20deg);
transform: skewX(30deg);
transform: skewY(1.07rad);
transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
transform: translate3d(12px, 50%, 3em);
transform: translateZ(2px);
transform: scale3d(2.5, 1.2, 0.3);
transform: scaleZ(0.3);
transform: rotate3d(1, 2.0, 3.0, 10deg);
transform: rotateX(10deg);
transform: rotateY(10deg);
transform: rotateZ(10deg);
transform: perspective(17px);

/* Multiple function values */
transform: translateX(10px) rotate(10deg) translateY(5px);

/* Global values */
transform: inherit;
transform: initial;
transform: unset;
```

### translate, translateX, translateY, translate3d

这几个属性用来移动元素，translate 接受两个参数，分别是 dx 和 dy。translate3d 接受三个参数，分别是 dx, dy 和 dz。translateX, translateY 则仅仅分别接受 dx, dy 作为参数。

### rotate, rotateX, rotateY, rotate3d

这几个属性用来旋转元素，参数形式同 translate，单位为 deg （角度）。

### scale, scaleX, scaleY, scale3d

这几个属性用来缩放元素，参数形式同 translate，取值是数值，没有单位。当取值为正，且小于 1 的时候元素在其纬度上缩小，当却只大于 1 的时候元素在其纬度上放大。当取值为负的时候，元素先进行翻转然后再进行缩放。

### skew, skewX, skewY

以上三个属性用来倾斜元素。

### matrix

transform 属性还可以是一个 matrix，具体的语法是 `transform: matrix(a, b, c, d, e, f);`

这里的 a, b, c, d, e, f 分别代表是什么呢？

```
| x'| = |a, c, e|   |x| = [ax + cy + e]
| y'| = |b ,d, f| * |y| = [bx + dy + f]
| 1 | = |0 ,0, 1|   |1| = [     1     ]
```

其中 `x'` 和 `y'` 是 x 和 y 变形过后的结果，而 a, b, c, d, e, f 就正是决定了 x 和 y 如何 变化为 `x'` 和 `y'`
