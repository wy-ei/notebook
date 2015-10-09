---
layout: post
title: CSS 定位
category: computer
---

## 定位方式


在CSS元素的position属性有4个可选项，分别是：

1. static
2. relative
3. absolute
4. fixed


其中absolute和relative相比最让人迷惑，下面对这4中定位方式予以说明：

### static

元素的默认定位方式是static的，也就是元素的在的位置由元素标签在文档中的位置决定，相信这个属性不会令人们感到迷惑。

### relative

当一个元素的position为relative时，这个时候要对元素的设置`left,right,top,bottom`这几个属性才能见到效果，举例如下：

HTML 文档如下：

```html
<div>
	<div></div>
	<div class="box2"></div>
	<div></div>
</div>
```

CSS 如下：

```css
div>div{
	width:200px;
	height:100px
}

div.box2{
	position:relative;
	left:30px;
	top:20px;
}
```

以上代码中对 p 使用了相对定位，它的参考点是它原本的位置,然后向右偏移了30px向下偏移了20;要注意的一点是设置为relative的元素并不会从文档流中消失，也就是说对于其他元素而言它似乎还在原地。其次移动它会覆盖掉其他的元素。效果如下图：

![relative定位方式](/images/wb/relative.jpg)

### absolute

当一个元素的position为absolute的时候，它与relative的一个区别是，它的参考点不在是它原本的位置了，而是相对于**最近的已定位祖先元素**。如果其祖先元素的position属性全都是默认属性的话，那么它会相对于浏览器窗口定位。

与relative的另外一个不同点是，使用absolute的元素，会从文档流中剔除，也就是说它的位置会被其后的元素占据。如下图所示：

![absolute定位方式](/images/wb/absolute.jpg)

绝对定位元素当然也会覆盖页面上的其他元素，这个时候可以设置 z-index 属性来决定他们的层叠关系。

### fixed 

fixed 和 absolute 的唯一不同点在于它是相对于浏览器窗口定位的，平时在网页中看到那些固定不动的元素就是通过设置定位方式为 fixed 来实现的。






