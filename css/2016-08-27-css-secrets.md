---
layout: post
title: CSS 揭秘 - 读书笔记（其一）
category: CSS
tag: CSS
---

* toc
{:toc}

<style>
.opacity-border{
    width: 260px;
    height: 160px;
    background: #3b4494;
    border: 20px solid hsla(0, 0%, 70%, 0.2);
    background-clip: padding-box;
}
.opacity-border-no-clip{
    width: 260px;
    height: 160px;
    background: #3b4494;
    border: 20px solid hsla(0, 0%, 70%, 0.2);
}
.outline-border{
    width: 240px;
    height: 130px;
    margin: 20px 10px;
    background: #ccc;
    border: 20px solid #333;
    outline: 10px solid #777;
}
.outline-border-offset{
    box-sizing: border-box;
    max-width: 300px;
    height: 200px;
    color: #000;
    line-height: 200px;
    text-align: center;
    background: #ccc;
    border: 20px solid #333;
    outline: 10px solid #777;
    outline-offset: -50px;
}
.box-shadow-border{
    width: 240px;
    height: 130px;
    margin: 30px;
    background: #ccc;
    border: 10px solid #333;
    box-shadow: 0 0 0 10px #777,
        0 0 0 20px #999,
        0 0 0 30px #ccc;
}
.bg-position{
    width: 300px;
    height: 200px;
    background: #ccc url(https://avatars1.githubusercontent.com/u/175836?v=3&s=60) no-repeat;
    background-position: bottom 30px right 20px;
}
.inner-radius{
    width: 280px;
    height: 150px;
    background: #ccc;
    color: #000;
    margin: 0 10px;
    line-height: 150px;
    text-align: center;
    border-radius: 20px;
    outline: 10px red solid;
    box-shadow: 0 0 0 10px red;
}
.inner-radius-2{
    width: 280px;
    height: 150px;
    background: #ccc;
    color: #000;
    margin: 0 10px;
    line-height: 150px;
    text-align: center;
    border-radius: 20px;
    outline: 10px red solid;
}
.stripe-1{
    width: 300px;
    height: 200px;
    background: linear-gradient(45deg, #fb3 25%, #58a 0, #58a 50%,#fb3 0,
        #fb3 75%, #58a 0);
    background-size: 60px 60px;
}
.stripe-2{
    width: 300px;
    height: 200px;
    border: 1px dotted #333;
    background: linear-gradient(45deg, #fb3 25%, #58a 0, #58a 50%,#fb3 0,
        #fb3 75%, #58a 0) no-repeat;
    background-size: 60px 60px;
}
.stripe-3{
    width: 300px;
    height: 200px;
    background: repeating-linear-gradient(50deg, #fb3, #fb3 20px,
        #58a 0, #58a 40px);
    animation: rotate-stripe 4s linear infinite;
}
@keyframes rotate-stripe {
    20%{
        background: repeating-linear-gradient(50deg, #fb3, #fb3 20px,
            #58a 0, #58a 40px);
    }
    50%{
        background: repeating-linear-gradient(80deg, #fb3, #fb3 20px,
            #58a 0, #58a 40px);
    }
    80%{
        background: repeating-linear-gradient(80deg, #fb3, #fb3 30px,
            #58a 0, #58a 40px);
    }
}
.stripe-4{
    width: 300px;
    height: 200px;
    background: #58a;
    background-image: repeating-linear-gradient(45deg, hsla(0, 0%, 100%, .1), hsla(0, 0%, 100%, .1) 15px, transparent 0, transparent 30px);
}
.grid{
  width: 300px;
  height: 200px;
  background-image: linear-gradient(rgba(200, 0, 0, .5) 25px, transparent 0),
    linear-gradient(90deg, rgba(200, 0, 0, .5) 25px,transparent 0);
  background-size: 50px 50px;
}
.grid-2{
  width: 302px;
  height: 202px;
  background-image: linear-gradient(rgba(200, 0, 0, .5) 2px, transparent 0),
    linear-gradient(90deg, rgba(200, 0, 0, .5) 2px,transparent 0),
    linear-gradient(rgba(200, 0, 0, .5) 1px, transparent 0),
    linear-gradient(90deg, rgba(200, 0, 0, .5) 1px,transparent 0);
  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
}
.board{
    width: 300px;
    height: 200px;
    background: #f6f7f8;
    background-image: linear-gradient(45deg,#d5d5d5 25%, transparent 0,transparent 75%, #d5d5d5 0),
        linear-gradient(45deg,#d5d5d5 25%, transparent 0,transparent 75%, #d5d5d5 0);
    background-size: 50px 50px;
    background-position: 0px 0px, 25px 25px;
}
.board-base{
  width: 200px;
  height: 200px;
  border: 1px dotted #333;
  background: #f6f7f8;
  background-image: linear-gradient(45deg,#d5d5d5 25%, transparent 0, transparent 75%, #d5d5d5 0);
  background-position: 0px 0px, -100px -100px;
}
.tr-to-rect{
  width: 200px;
  height: 200px;
  background: #f6f7f8;
  background-image: linear-gradient(45deg,rgba(200,200,200,0.7) 25%, transparent 0, transparent 75%, rgba(200,200,200,0.7) 0),
    linear-gradient(45deg,red 25%, transparent 0, transparent 75%, red 0);
  background-size: 100px 100px;
  animation: tr-move 4s linear infinite;
}

@keyframes tr-move{
  25% {
    background-position: 0 0, 0 0;
  }
  50%{
    background-position: 0 0, 50px 50px;
  }
  100%{
    background-position: 0 0, 50px 50px;
  }
}
.random-stripe{
  width: 100%;
  height: 100px;
  background: #ccc;
  background-image: linear-gradient(90deg, red 10px, transparent 0),
     linear-gradient(90deg, green 20px, transparent 0),
    linear-gradient(90deg, blue 40px, transparent 0);
  background-size: 41px 100%, 61px 100%,83px 100%;
}
.random-stripe-246{
    width: 100%;
    height: 100px;
    background: #ccc;
    background-image: linear-gradient(90deg, #fff 1px,transparent 0),
        linear-gradient(90deg, red 10px, transparent 0),
        linear-gradient(90deg, green 20px, transparent 0),
        linear-gradient(90deg, blue 20px, transparent 0);
    background-size: 120px 100%, 60px 100%, 40px 100%,20px 100%;
}
.image-border{
  position: relative;
  width:240px;
  height: 150px;
  white-space:pre;
  color: #000;
  line-height: 150px;
  text-align: center;
  border: 30px solid hsla(0, 0%, 100%, 0.4);
  background: linear-gradient(hsla(0, 0%, 100%, 0.8),hsla(0, 0%, 100%, 0.8)) padding-box,
      url(http://7xs1gu.com1.z0.glb.clouddn.com/16-8-28/59834519.jpg) border-box 0 / cover;
}
.ant{
  padding: 1px;
  width: 300px;
  height: 200px;
  background: linear-gradient(white,white) content-box,
    repeating-linear-gradient(45deg,black 0,black 25%,transparent 0, transparent 50%) 0 / 10px 10px;
  animation: ants 12s linear infinite;
  background-position: 0px;
}
@keyframes ants{
  to {
    background-position : 100%;
  }
}
.ant-no-cover{
  width: 300px;
  height: 200px;
  background: repeating-linear-gradient(45deg,black 0,black 25%,transparent 0, transparent 50%) 0 / 10px 10px;
}
</style>


终于得到了这本期待已久的书，号称 CSS 一姐的 Lea Verou 所著，国内人称魔法哥的张鹏所译。书没翻几页，但已经感受到作者深厚的内力，这本书写的非常好。推荐给所有和我一样从事前端开发工作的朋友们。

下面是我在看书时候记录的一些笔记，我更推荐你去阅读这本书，当然了下面的内容你也可以简单浏览一下，首先很惭愧地说千万不要因为我笔记的质量而怀疑这本书，这本书很牛，强烈推荐。

![css secrets](http://7xs1gu.com1.z0.glb.clouddn.com/16-8-28/70809652.jpg)

## 半透明边框

如果希望实现半透明边框，让父元素的背景色能够透过来。比如这个效果，白色背景透过透明边框显示出来：

<div class="opacity-border"></div>

这里需要使用到 `rgba` 或者 `hsla` 色系来设置半透明色。不过很多时候，可能写出这样的代码：

```css
width: 260px;
height: 160px;
background: #3b4494;
border: 20px solid hsla(0, 0%, 70%, 0.2);
```

发现效果是这样的：

<div class="opacity-border-no-clip"></div>

这个时候边框下面的颜色是容器自身的背景色，而不是父容器的背景色，这不符合最初的要求。这是因为背景颜色默认情况下会扩展到 border 区域。只需要使用背景的 `background-clip` 属性来改变这一默认效果就可以了。

`background-clip` 属性可以取值为 `border-box`、`padding-box`、`content-box`，分别意味着背景延伸到边框区域、内边距区域、内容区域。这里我们取值为 `padding-box` 就好。

```css
background-clip: padding-box;
```


## 多重边框

设置边框需要用到 border 属性，但 border 只能设置一个边框。有些时候可能需要设置多重边框。这时候可以使用 `outline` 或者 `box-shadow` 属性来帮助实现效果。

### 通过 outline 来实现多重边框

<div class="outline-border"></div>

这里外层的边框是通过 outline 实现的。outline 属性用于在边框外（或内）再添加一道边框。使用方法和 border 非常类似。而且 outline 还多了一个 outline-offset 属性，该属性可以用来设置外边框距离 border 外侧的距离，可以取正值也可以取负值。取正值得时候向外偏移，取负值的时候会向内偏移。

<div class="outline-border-offset">取 outline-offset 为 -10px</div>

上图中，通过设置 `outline-offset` 为 -50px 将浅灰色的外边框移动到了 border 的内部，可以看出来 outline 和 border 之间好像又无意间得到了一个和背景色相同的边框。

### 通过 box-shadow 来实现多重边框

`box-shadow` 属性用来在给元素添加一个阴影效果，可以设置一个扩展半径，将阴影向外扩张。用该属性可以设置多层边框。

<div class="box-shadow-border"></div>

使用 box-shadow 可以给边框加上任意多层边框。一个需要注意的问题是，box-shadow 和 outline 实现的边框都不会计入盒子模型，也就是说这个边框是不会影响页面的元素的布局的。为了让元素看起来位置正确，不让其外边框进入其他元素内部，可以给元素添加合适的外边距以给添加的边框留一些空间。

```css
box-shadow: 0 0 0 10px #777,
    0 0 0 20px #999,
    0 0 0 30px #ccc;
```

从代码里可以看到 box-shadow 实现多边框，添加的多个边框的延伸半径是越来越大，这就好像是金字塔一样，越靠下的也大，这样其俯视图看起来才是不同颜色的边框。

## 灵活的背景定位

### background-position

`background-position` 在 CSS3 中不再是简单地接受两个参数（表示背景图片的偏移距离），如今可以根据元素的某个角，相对地设置偏移量，这在容器尺寸未知的情况下非常好用。比如希望将图片定位在距离右下角水平和垂直分别为 20px 和 30px 的位置：

<div class="bg-position"></div>

可以这样写：

```css
width: 300px;
height: 200px;
background: #ccc url(https://avatars1.githubusercontent.com/u/175836?v=3&s=60) no-repeat;
background-position: bottom 30px right 20px;
```

### background-origin

另外 `background-origin` 属性可以用来设置 `background-position` 的参考点，可以取得值同 `background-clip` 有 `border-box`、`padding-box`、`content-box` ，分别表示以边框左上角为参考的、以内边距左上角为参考点、以内容区域左上角为参考点。

如果你希望背景图片以盒子模型的某个边角定位，那么就可以使用该属性来改变默默人的定位参考点，这样盒子模型中其他部分变化了，也不会影响背景图片的定位。比如你希望将背景图定位在 content-box 的左上角，在之前需要设置 background-position 为border 加 padding 的宽度和，如今可以将 background-origin 设置为 content-box 然后，将 background-position 设置为 0 0 就好了。而且边框或者内边距改变了，也不需要去修改 background-position。

### calc() 方案

同样以上面的案例为例子，需要定位到右下角水平和垂直分别为 20px 和 30px 的位置，其实就是水平和垂直方向偏移分别为 100% - 20px 和 100% - 30px，可以使用 calc 来设置 background-position 的值：

```css
background-position: calc(100% - 20px) calc(100% - 30px);
```

## 边框内圆角

希望实现这样的效果：

<div class="inner-radius">something-meaningful</div>

由于 outline 会生成矩形边框，外层的边框可以通过 outline 来实现，得到：

<div class="inner-radius-2">something-meaningful</div>

outline 作为边框的时候，它不会贴合圆角，所以会在四个角形成空隙，但是 box-shadow 可以贴合圆角，因此可以使用 bbox-shadow 来填充空隙。只需要加一行代码：

```css
box-shadow: 0 0 0 5px #333;
```

但是需要注意的是，空隙的最大距离，如果大于了外边框的厚度，就不能使用该方案了，因为为了填充这个空隙，box-shadow 的扩展半径会大于 outline 的宽度，一次 box-shadow 会超出 outline。

## 条纹背景

### 实现斜向条纹

<div class="stripe-1"></div>

为了实现上面的 45度 斜向条纹，可以先得到下面这个基本图形，然后利用 `background-repeat:repeat` 得到上面的斜向条纹。

<div class="stripe-2"></div>

实现代码如下（background-repeat 的值默认就是 repeat）：

```css
width: 300px;
height: 200px;
background: linear-gradient(45deg, #fb3 25%, #58a 0, #58a 50%,
    #fb3 0, #fb3 75%, #58a 0);
background-size: 30px 30px;
```

通过改变 `background-size` 的值，可以修改条纹的宽度。这个方法的局限性太大，首先只能得到 45 度的条纹，另外是两种颜色的条纹是等宽的。

### 更加方便的方法

<div class="stripe-3"></div>

```css
width: 300px;
height: 200px;
background: repeating-linear-gradient(50deg, #fb3, #fb3 20px,
    #58a 0, #58a 40px);
```

其实完全不需要上面那样复杂的方法，使用重复线性渐变，就可以很容易实现同样效果。可以通过调整线性渐变的方向来调整条纹的角度，还可以通过调整色标的位置来调整不同颜色条纹的宽度。

### 同色系条纹

<div class="stripe-4"></div>

通过在背景图片上叠加半透明的黑色或白色，可以得到暗或明的条纹，这里浅色是使用线性渐变绘制的半透明白色条纹覆盖在背景色上得到的，深色透出来的背景色。

实现代码呢，就是下面这样：

```css
background: #58a;
background-image: repeating-linear-gradient(45deg, hsla(0, 0%, 100%, .1),
    hsla(0, 0%, 100%, .1) 15px, transparent 0, transparent 30px);
```

## 复杂的背景图案

### 网格

通过叠加横纵条纹可以很容易地获得网格效果：

<div class="grid"></div>

```css
background-image: linear-gradient(rgba(200, 0, 0, .5) 25px, transparent 0),
  linear-gradient(90deg, rgba(200, 0, 0, .5) 25px,transparent 0);
background-size: 50px 50px;
```

通过设置 background-size 的大小可以获得不同宽高的网格。通过设置线性渐变条纹的宽度可以获得不同宽度的网格。

还可以将两幅不同线宽的网格叠加在一起，得到类似曾经在大学里使用过的坐标纸的效果：

<div class="grid-2"></div>

代码也很简单：

```css
width: 302px;
height: 202px;
background-image: linear-gradient(rgba(200, 0, 0, .5) 2px, transparent 0),
  linear-gradient(90deg, rgba(200, 0, 0, .5) 2px,transparent 0),
  linear-gradient(rgba(200, 0, 0, .5) 1px, transparent 0),
  linear-gradient(90deg, rgba(200, 0, 0, .5) 1px,transparent 0);
background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
```

前两个渐变得到了横纵深色的粗线，下面两个得到了横纵浅色细线。通过将粗线的背景大小设置为 50px 的正方形，将细线的背景设置为 10px 的正方形，再利用背景图重复的特性，就得到了网格效果。

### 棋盘

通过线性渐变可以很容易地实现棋盘的图案，如下：

<div class="board"></div>

棋盘可以看做是由两种不同颜色的方块组成的，其中一种方块可以使用背景色，另外一种颜色的方块可以通过渐变来绘制出来。这个棋盘的图案最终可以看做是下面这个图案经过某种方法的组合得到：

<div class="board-base"></div>

该图形可以使用 45deg 的线性渐变实现。具体的方法就是将色标分别放在 25%，75% 的位置上，这样 0~25% 和 75%~100% 的区域就形成了三角形。

然后移动该叠加在一起的两个基本图形中的一个就可以获得正方形，不信可以看看下面的动画，在移动之前，两种颜色的图形是叠加在一起的，移动之后两种颜色的图形就组成了一个个完整的正方形，这里为了区分使用了两种颜色，只需要将两种颜色换成同种颜色，需要的棋盘效果就实现了。

<div class="tr-to-rect"></div>

实现的 css 代码也很简单，思路就是画出两个同样的上面描述的基本图形，然后移动其中一个：


```css
background: #f6f7f8;
background-image: linear-gradient(45deg,hsla(0,0%,70%,0.7) 25%, transparent 0, transparent 75%, hsla(0,0%,70%,0.7) 0),
  linear-gradient(45deg,red 25%, transparent 0, transparent 75%, red 0);
background-size: 100px 100px;
background-position: 0 0, 50px 50px;
```

## 伪随机背景

自然界的事物都不是以无限平铺的方式存在的。而上面画出来的一些图案则都是利用重复实现的，这些图案显得有些呆板，我们希望能够实现随机的图案。

但事实上，在 CSS 中没有随机数，为了让人感觉到随机，可以考虑将重复的周期延长，以至于让人只能看到一个周期内的东西，这样自然也就察觉不到重复了。

如果要实现随机的条纹排布，像下面这样：

<div class="random-stripe"></div>

上图中使用了三种间距不同的条纹进行重复平铺。三种间距不同的条纹，就像是三种周期不同的信号一样，最终合成的信号的周期就是三个信号的周期的最小公倍数。这样讲思路就有了，扩大这个最小公倍数，周期就能够加大。

为了让最小公倍数最大化，可以使用质数最为条纹的间距，原因是一组质数的最小公倍数是其乘积。上面图形的实现代码如下：

```css
width: 100%;
height: 100px;
background: #ccc;
background-image: linear-gradient(90deg, red 10px, transparent 0),
   linear-gradient(90deg, green 20px, transparent 0),
  linear-gradient(90deg, blue 40px, transparent 0);
background-size: 41px 100%, 61px 100%,83px 100%;
```

可以看到条纹的间距为 41px、61px、83px，这是三个质数，最终得到的图案的周期是 `41 * 61 * 83 = 207 583`，这远远超出了任何屏幕的宽度。

作为比较，我们使用 20px、40px、60px 作为条纹的间距，得到了下面的图案：

<div class="random-stripe-246"></div>

很明显，可以看到它们的周期为 120px，这里使用白线标划分出了他们的周期。

使用质数来实现随机效果，不单单可以用在渐变，还可以用在涉及到重复的地方，比如要实现一个看起来没有规律的动画，可以将多幅动画的时间设置为质数，这样多个动画叠加在一起，要过很久才会到一个完整的周期，看起来动画就是毫无规律的。

## 连续的图像边框

有的时候我们希望背景图片能延伸到边框下面。比如下面这个效果：

<div class="image-border">窗外的麻雀在电线杆上多嘴</div>

需要指出的是，背景颜色永远是存在于背景图片下方的。所以这里文字下方的白色是不能使用背景颜色完成的。一种方法是使用两层 `div` 元素实现，但这会导致结构不够简洁。

其实白色的背景可以使用半透明白色至半透明白色的线性渐变完成：

```css
background-image: linear-gradient(hsla(0, 0%, 100%, 0.8);
```

而背景图片自然是再运用一个 background-image 了，需要注意的是，background-image 具有多个值得时候，第一幅图片会处于最上层。因此上面图案的 background-iamge 就可以这样写：

```css
background-image: linear-gradient(hsla(0, 0%, 100%, 0.8),hsla(0, 0%, 100%, 0.8)),
    url(http://7xs1gu.com1.z0.glb.clouddn.com/16-8-28/59834519.jpg);
```

这个时候白色半透明背景会完全覆盖在图片上，使用 background-clip 改变两个背景图片的覆盖区域就 OK 了，如下：

```css
background-clip: padding-box, border-box;
```

以上关于背景的属性可以简写为：

```css
background: linear-gradient(hsla(0, 0%, 100%, 0.8),hsla(0, 0%, 100%, 0.8)) padding-box,
    url(http://7xs1gu.com1.z0.glb.clouddn.com/16-8-28/59834519.jpg) border-box 0 / cover;
```

### 蚂蚁线

利用以上思路，加上线性渐变，我们可以得到在 Photoshop 等图像编辑软件中表示选区的蚂蚁线。

<div class="ant"></div>

这里的思路是先使用线性渐变得到下图，抱歉这个图，可能让人感到眩晕。
<div class="ant-no-cover"></div>


然后再在上面覆盖一层白色的渐变，利用 background-clip 属性，让白色区域为 content-box ，然后设置 1px 的边框，利用动画无限次移动条纹。实现代码如下：


```css
.ant{
  padding: 1px;
  background: linear-gradient(white,white) content-box,
    repeating-linear-gradient(45deg,black 0,black 25%,transparent 0, transparent 50%) 0 / 10px 10px;
  animation: ants 12s linear infinite;
  background-position: 0px;
}
@keyframes ants{
  to {
    background-position : 100%;
  }
}
```


上面讲到的一些知识需要用到 CSS3 中的渐变，如果对此不太清楚，可以参考 MDN 上面的内容，也可以找到一本关于 CSS3 的书籍来学习学习。
