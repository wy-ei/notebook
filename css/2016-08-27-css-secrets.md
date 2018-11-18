---
layout: post
title: CSS 揭秘 - 读书笔记
category: CSS
tag: CSS
---

* toc
{:toc}

# CSS 揭秘 - 读书笔记（其一）

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


# CSS 揭秘 - 读书笔记（其二）

## 自适应的椭圆

提到圆或者椭圆，很自然地会想到 `border-radius` 属性。但很多人对于 `border-radius` 的了解都是不够的。border-radius 的完整写法如下：

```css
border-radius: x x x x / x x x x;
```

其中 x 都表示长度，可以是具体数值也可以是百分比。但是这个长度究竟描述的是什么呢？看下图，就明白了：


<div class="radius-in-deep"></div>
<style>
.radius-in-deep {
    width: 300px;
    height: 200px;
    border-radius: 80px / 40px;
    border: 1px solid #333;
    background: #ccc;
    background-image: radial-gradient(ellipse 160px 80px at 80px 40px, transparent 78px,#000 0, #000 80px,transparent 0);
    background-size: 160px 80px;
    background-repeat: no-repeat;
}
</style>

这里我使用了如下代码给容器设置了圆角：

```css
border-radius: 80px / 40px;
```

图中有一个椭圆完全贴合圆角，这个椭圆正是用来说明代码中斜杠前后的值得意义的，斜杠前的值表示椭圆的横轴半径，斜线后的值表示椭圆的纵轴半径。

想到这个椭圆，border-radius 的属性值也就很清楚了。对于 `border-radius: x x x x / x x x x;` 斜线前后四个值分别表示从左上角顺时针的四个角落椭圆的横纵轴半径。

这个前后的 4 个值可以适当简写，简写的方法和 margin 一样：

- 如果只提供三个值：第四个值和第二个相同
- 如果只提供两个值：第三个和第一个相同，第四个和第二个相同
- 如果只提供一个：四个值都相同

另外，如果只写了斜杠前的一个值，斜杠后的值会和斜杠前的值保持一致。也就是说前后的共八个值都相同。

### 半椭圆

绘制半椭圆，比如这样的：


<div class="ellipse-1-2"></div>
<style>
.ellipse-1-2 {
    width: 300px;
    height: 200px;
    background: #ccc;
    border-radius: 100% 0 0 100% / 50% 0 0 50%;
    border: 1px solid #333;
}
</style>

想象那个椭圆，左上角和左下角的两个椭圆共同作用得到了上面这幅图，而且他们的横轴半径为容器的宽度，而纵轴半径为容器高度的一半。这样就很容易写出以下代码了：

```css
width: 300px;
height: 200px;
border-radius: 100% 0 0 100% / 50% 0 0 50%;
border: 1px solid #333;
```

当值写为百分比的时候，参照的是容器的宽度和高度。

### 四分之一椭圆

到这里，画椭圆已经是小菜一碟了，四分之一椭圆，椭圆的横纵半径为容器的宽度和高度，写法如下：

```css
border-radius: 100% 0 0 0;
```

## 平行四边形

使用 transform 中的 skew 可以很容易地得到平行四边形。但是如果希望得到下面这样的样式该怎么做呢？注意其内容并没有倾斜。

<div class="skew">HELLO</div>
<style>
.skew{
  position: relative;
  display: inline-block;
  font-size: 20px;
  margin: 0 20px;
  color: #fff;
  line-height: 1.5em;
  padding: 10px 20px;
}
.skew::after{
  content:"";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #a64abb;
  z-index: -1;
  transform: skew(-30deg)
}
</style>

是的，使用一个元素搞定，这个时候可以使用到伪元素，对伪元素进行形变，然后将伪元素作为背景，这样内容就不会受到影响了。同样的，可以利用此方案得到菱形背景。

## 菱形图片

哈哈，想想如何实现下面这样的效果：

<div class="diamond">
    <img src="http://7xs1gu.com1.z0.glb.clouddn.com/16-8-28/59834519.jpg">
</div>
<style>
.diamond{
    margin: 50px;
    width: 150px;
    height: 150px;
    transform: rotate(45deg);
    overflow: hidden;
}
.diamond>img{
    display: block;
    width: 100%;
    height: 100%;
    transform: rotate(-45deg) scale(1.42);
}
</style>

这里使用了首先将容器进行了旋转，然后将内容再进行了反向的旋转，这个时候容器的高度和宽度已经变成了对角线的长度了。对于正方形来说，对角线的长度为边长的 1.414 （根号 2 ）倍，因此需要将旋转后的图片放大 1.42 倍（宁可大一点也不能小一点，铺不满整个容器）。

另外使用 CSS4 中的新属性可以简单实现：

```css
-webkit-clip-path: polygon(50% 0,100% 50%,50% 100%,0 50%);
```

## 切角效果

常常看到这样的设计，在容器的某个角上存在一个三角形的切角。这个可以使用线性渐变来高度，渐变从被切去的角落开始，到切角的边保持为透明，之后是背景色。

<div class="bevel-corner"></div>
<style>
.bevel-corner{
    width: 300px;
    height: 200px;
    background-image: linear-gradient(-45deg, transparent 20px, #6893da 0);
}
</style>

实现代码：

```css
width: 300px;
height: 200px;
background-image: linear-gradient(-45deg, transparent 20px, #6893da 0);
```

但是如果有多个切角呢？使用多个渐变可以搞定，这个时候会出现一个问题，渐变会覆盖掉对方的切角，为了不至于此，可以指定一下各自的 `background-size` ，然后设置一下 `background-position`。

<div class="bevel-corner-2"></div>
<style>
.bevel-corner-2{
    width: 300px;
    height: 200px;
    background: linear-gradient(-45deg, transparent 20px, #6893da 0) no-repeat 100% 0 / 50% 100%,
        linear-gradient(45deg, transparent 20px, #1a1456 0) no-repeat 0/50% 100%;
}
</style>

为了进行说明，这里使用了两种颜色。但是如果有四个切角呢，代码将会更加复杂，好在在未来（CSS4）将推出一个叫做 `corner` 的属性，实现类似效果只需要两行代码：

```css
border-radius: 0 0 15px;
corner-shape: bevel;
```

## 梯形标签页

在网站的便签页上，或者某些浏览器的标签页上都能看到梯形。在 CSS 中画梯形虽然不易，但却也是可行的。

使用 3D 形变就可以很实现梯形，效果如下：


<div class="trapezoid trapezoid-bottom">HELLO</div>
<style>
.trapezoid{
  color: #fff;
  line-height: 40px;
  text-align: center;
  width: 100px;
  height: 40px;
  position: relative;
}
.trapezoid::after{
  content: '';
  position: absolute;
  z-index: -1;
  top:0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #333;
  transform: scaleY(2) perspective(50px) rotateX(45deg);
}
.trapezoid-bottom::after{
    transform-origin:bottom;
}
.trapezoid-center::after{
    transform-origin:center;
}
</style>


这里用到了 perspective 这个 3D 变换的属性，另外为了不让容器中得内容发生 3D 变换，使用了同上面的平行四边形的方案，对作为背景的伪元素进行了变换。

需要着重说明的代码是下面两行：

```css
transform-origin:bottom;
transform: scaleY(2) perspective(50px) rotateX(45deg);
```

`transform-origin` 用于将形变的中心设置为底边的中点，这样确保使用 rotateX 进行旋转，以及设置了视距属性 perspective 的时候，形变后的图形不会超出容器。否则将会是这样的效果（这里我给容器加了一个边框）：

<div class="trapezoid trapezoid-center" style="border: 1px dotted #ccc;">HELLO</div>

另外 transform 中 scaleY 和 perspective 和 rotate 的顺序很重要，这里表示先进行缩放，然后在在 50px 的视距上进行旋转。transform 属性中值的顺序是很关键的，就像高中或初中学的先平移后伸缩，或者先伸缩后平移，最后的效果是完全不同的。

由于要进行 `rotateX(45deg)` 操作，这会导致元素看起来变矮了，为了让它看起来还是那么高，这里使用 `scaleY(2)` 将元素在旋转之前变高了一些。

## 简单饼图

书中介绍了基于 transform 和 SVG 的解决方案，由于我不懂 SVG 这里只记录了 transform 的方案。

简单饼图，就像下面这样：

<div class="pie" style="animation-delay: -20s;"></div>
<style>
.pie{
  width: 150px;
  height: 150px;
  background: yellowgreen;
  border-radius: 50%;
  background-image: linear-gradient(90deg, transparent 50%, #655 0);
}
.pie::after{
  content: '';
  display: block;
  height: 100%;
  width: 50%;
  background-color: inherit;
  margin-left: 50%;
  border-radius: 0 100% 100% 0% / 0 50% 50% 0;
  transform-origin: left;
  animation: spin 50s linear infinite,
    bg 100s step-end infinite;
  animation-play-state: paused;
  animation-delay: inherit;

}

@keyframes spin{
  to {
    transform: rotate(.5turn);
  }
}
@keyframes bg{
  50%{
    background: #655;
  }
}
</style>

我需要使用一块绿色或者灰色的半圆来围绕圆心旋转，以遮挡住部分区域，实现不同比率的饼图。半圆很好得到，这里可以使用伪元素来作为遮罩，使用下面的 CSS 代码便可实现效果：

```css
.pie{
  width: 150px;
  height: 150px;
  background: yellowgreen;
  border-radius: 50%;
  background-image: linear-gradient(90deg, transparent 50%, #665 0);
}
.pie::after{
  content: '';
  display: block;
  height: 100%;
  width: 50%;
  margin-left: 50%;
  background-color: inherit;
  border-radius: 0 100% 100% 0% / 0 50% 50% 0;
  transform-origin: left;
}
```

将伪元素的右上角和右下角设为圆角，得到了一个半圆，然后将其覆盖在圆盘的右半边，并将 transform-origin 设置为 left，将形变中心设为圆心位置，这样就可以使用 rotate 来旋转半圆，以遮挡不同角度的扇形了。

这里是使用绿色来遮挡灰色，但是当灰色的区域超出 50% 的时候，就有问题了，超出 50% 以后我们需要将遮罩变为灰色。并立刻将遮罩回归到 0 度，然后继续旋转。因此在一个周期内，遮罩的颜色在 50% 的时候切换了一次，遮罩进行了两次从 0 至 180度的旋转。

这样就可以写出两个动画了：

```css
@keyframes spin{
  to {
    transform: rotate(.5turn);
  }
}
@keyframes bg{
  50%{
    background: #655;
  }
}
/* 将其运用在遮罩上 */
.pie::after{
    /* ... */
    animation: spin 50s linear infinite,
        bg 100s step-end infinite;
}
```

这里颜色使用了 step-end 作为 `timing-function` 的效果就是时间进行到 50s 的时候遮罩的颜色立刻变为了灰色。关于 step-end 和 step-start 以及 steps 这三个时间函数更多的细节，可以参考[这篇博客](http://www.cnblogs.com/aaronjs/p/4642015.html)。


为了让它能够灵活地表示不同比率的静态图而不是动画，需要借助于 `animation-play-state:paused` 来停止动画。再利用 animation-delay 设置为负值的一个特性：

> animation-delay 设置为负数的时候，动画会立刻开始播放，且从 animation-delay 的绝对值处开始播放，就好像动画在过去已经播放了指定时间一样。

因此，可以将动画暂停，并给其设置不同的 animation-delay 值，这样就能得到不同角度的比率图了。

```css
.pie::after{
    /* ... */
    animation: spin 5s linear forwards,
        bg 20s step-end;
    animation-delay: inherit;
}
```

因为没有办法给伪元素添加类和内联样式，这里对 animation-delay 使用了继承，这样就可以直接在元素上设置 animation-delay 了。


设置 `animation-delay` 为 `-40s`

<div class="pie" style="animation-delay: -40s;"></div>

设置 `animation-delay` 为 `-60s`

<div class="pie" style="animation-delay: -60s;"></div>


# CSS 揭秘 - 读书笔记（其三）

<style>
.rect{
    width: 300px;
    height: 180px;
    background-color: #eee;
}
.filter{
    background: url(http://7xs1gu.com1.z0.glb.clouddn.com/16-8-29/3537077.jpg) 0 0 / 100% 100%;
    transition: .5s;
    -webkit-filter: sepia(1) saturate(4) hue-rotate(295deg);
    filter: sepia(1) saturate(4) hue-rotate(295deg);
}
.mix-blend-mode{
    background-color: hsl(335, 100%, 50%);
    display: inline-block;
}
.mix-blend-mode>img{
    mix-blend-mode: luminosity;
    width: 100%;
    height: 100%;
}
.background-blend-mode{
    background: hsl(335, 100%, 50%) url(http://7xs1gu.com1.z0.glb.clouddn.com/16-8-29/3537077.jpg) 0 0 / 100% 100%;
    background-blend-mode: luminosity;
}
.blur-background{
    position: relative;
    width: 100%;
    overflow: hidden;
    -webkit-user-select: none;
    user-select: none;
}
.blur-background>img{
    z-index: -1;
    background: url(http://7xs1gu.com1.z0.glb.clouddn.com/maxresdefault.jpg) 0 / cover;
    -webkit-filter: blur(5px);
    filter: blur(5px);
}
.blur-background>p{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    line-height: 100%;
    text-align: center;
    font-size: 30px;
    margin: 0!important;
    color: #fff;
}
.blur-background>img{
    width: 100%;
}

</style>


## 投影

`box-shadow` 属性可以用来给元素添加阴影。它完整的语法是这样的：

```css
box-shadow: <inset>? <x-offset> <y-offset> <blur-radius>? <spread-radius>? <color>;
```
解释一下，inset 表示阴影出现在元素的内部，如果不写表示阴影出现在外边。然后可以提供 2~4 个长度值，加上一个颜色值。这 4 个长度值分别表示水平偏移量、竖直偏移量、模糊半径、扩张半径。

### 单侧投影

为了得到单侧投医，首先将横纵偏移量设置为 0 ，然后将模糊半径设置为 8px，这个时候会得到这个效果：

<div class="rect" style="box-shadow: 0 0 8px #000;"></div>

这个时候就需要用到第四个长度值，扩张距离表示阴影会从默认位置向外或向内扩张相应的长度。这里取一个负值，让阴影向内扩张（也就是向内收缩），为了将其他边的阴影完全收缩到看不见，需要将扩张半径设置为模糊半径的长度。

这个时候发现四个边都没有了阴影，那是因为阴影被容器盖住了，使用前两个长度值（偏移量）将阴影向需要添加阴影的边移动一定的长度，就可以得到我们要的效果——单侧阴影了。

**这里说被容器覆盖，只是为了便于理解。实际上并没有覆盖一说，这可以将背景颜色设置为透明色来进行验证**

<div class="rect" style="box-shadow: 0 8px 8px -8px #000;"></div>

最终的代码如下：

```css
box-shadow: 0 8px 8px -8px #000;
```

可以通过修改偏移量，让藏在容器下方的阴影漏出来，就可以给任意边设置阴影了。

### 邻边投影

如果要让两条邻边有阴影，同时修改水平和竖直偏移量就好了，这很容易：

<div class="rect" style="box-shadow: 8px 8px 8px -8px #000;"></div>

### 对边阴影

如果要给相对的边设置阴影呢？这个时候就需要用到 box-shadow 可以设置多组值得特性了：

<div class="rect" style="box-shadow: 0 8px 8px -8px #000, 0 -8px 8px -8px #000;"></div>

```css
box-shadow: 0 8px 8px -8px #000, 0 -8px 8px -8px #000;
```

## 不规则投影

box-shadow 可以很好地作用于那些规则的元素，但是某些情况下则会出现问题，这是因为 `box-shadow` 会老老实实地在元素的周围添加上阴影。但是考虑下面这个案例：

<div class="rect" style="background:transparent linear-gradient(-45deg, transparent 20px, #5988d4 0);"></div>

在这个元素的右下角通过渐变得到了一个透明的三角形，如果对它运用 box-shadow ，得到的效果就不是我们想要的：

<div class="rect" style="background:transparent linear-gradient(-45deg, transparent 20px, #5988d4 0);box-shadow: 0 0 5px #333;"></div>

我们其实只想给蓝色区域加上投影，解决办法是使用 filter 属性来到达期待的效果（只有新版本的浏览器才能看到效果）：

<div class="rect" style="background:transparent linear-gradient(-45deg, transparent 20px, #5988d4 0);-webkit-filter: drop-shadow(0 0 5px #333);filter: drop-shadow(0 0 5px #333);"></div>

```css
filter: drop-shadow(0 0 5px #333);
```

filter 属性目前只有新版本的浏览器支持，且需要添加浏览器私有前缀，但是未来你就可以使用它来完成类似的效果了。可以参考[这里](https://www.w3.org/TR/filter-effects/)了解更多关于 filter 的信息。


## 染色效果

有的时候需要对图片的色彩进行一些变换，比如增加饱和度、变为灰度图等等。在以前这可能需要动用像 Photoshop 这样的图像处理软件，但这会带来极大的维护成本，当图片的风格需要改变的时候，就不得不重新制作图片。现在好了，可以使用某些 CSS 属性来对元素的色彩进行变换。

### 基于滤镜的方案

使用 CSS 中的 filter 属性，可以给元素添加数十种滤镜效果，我之前写了一篇专门介绍 filter 的文章，可以参考 [CSS filter - 滤镜效果]({{site.url}}/css-filter) 来了解 filter 的功能和使用方法。

比如这里，使用这段 CSS 给周董应用了这样的效果：

```css
filter: sepia(1) saturate(4) hue-rotate(295deg);
```

<div class="filter rect"></div>

### 基于混合模式的方案

滤镜，能够对元素的颜色进行一些变换，这里还可以使用 **混合模式** 来对元素进行更多的颜色方面的变换。当元素发生重叠时混合模式控制了上层元素与下层元素颜色的混合方式。要对一个元素应用混合模式，有以下两个属性可以使用：

- `mix-blend-mode`：可以为整个元素设置混合模式
- `background-blend-mode`：可以为每层背景单独指定混合模式

假如现在需要将一幅图片和一个纯色进行混合，对于 `mix-blend-mode`，需要将图片放入一个容器内，并给容器设置需要混合的颜色。而对于 `background-blend-mode`，可以把图片设置为第一层背景，然后将颜色设置为第二层背景。

使用 `mix-blend-mode` 的效果：

<div class="mix-blend-mode rect"><img src="http://7xs1gu.com1.z0.glb.clouddn.com/16-8-29/3537077.jpg"></div>

使用 `background-blend-mode` 的效果：

<div class="background-blend-mode rect"></div>

如果你当前使用的是 PC，可以通过审查元素来调整图片的底色和混合方式来看看效果。


## 毛玻璃效果

我们常常看到毛玻璃效果，比如在 macOS 中就非常常见，启动 launchpad 就能看到这种效果。在网易云音乐中显示歌词的哪儿也使用了这种效果。说这么多不如一个例子，就下面这样的。那么在 web 上该如何实现这样的效果呢。

<div class="blur-background"><img src="http://7xs1gu.com1.z0.glb.clouddn.com/maxresdefault.jpg" alt=""><p>即刻出发</p></div>

这里 dom 结构是这样的：

```html
<div class="main">
    <p class="content">即刻出发</p>
</div>
```

这里需要用到 `filter` 属性中的 `blur` 滤镜来进行模糊处理。但是不能直接在 div.main 上面使用 filter 属性，这样会导致内容也一起被模糊掉了，需要对其子元素进行模糊处理，可以借助伪类，将其伪类绝对定位，铺满整个容器，然后进行模糊处理。在进行了模糊处理的元素上面展示内容。

主要的代码如下：

```css
.main{
    position: relative;
    overflow: hidden;
}
.main::after{
    content: '';
    position: absolute;
    top: 0;right: 0;bottom: 0;left: 0;
    z-index: -1;
    background: url(http://7xs1gu.com1.z0.glb.clouddn.com/maxresdefault.jpg) 0 / cover;
    -webkit-filter: blur(5px);
    filter: blur(5px);
}
```

进行模糊处理后模糊的区域会超出容器，因此设置 overflow 为 hidden 将超出的部分隐去。另外为了让伪元素在内容之下，可以调整 z-index 来改变其层叠次序。



# CSS 揭秘 - 读书笔记（其四）

<style>
.ex-br{
    white-space: pre;
}
.ex-br span::after{
    content:"\A";
}
#ex-stripe{
    line-height: 1.5em;
    background: linear-gradient(rgba(210, 210, 210, 0.2) 50%, transparent 0);
    background-size: auto 3em;
    background-origin: content-box;
    background-clip: content-box;
}
.ex-underline{
    background: linear-gradient(#333,#333) no-repeat;
    background-size: 100% 1px;
    background-position: left 0 bottom 10px;
    font-size: 20px;
    display: inline-block;
}
.ex-text-shadow{
    background: hsl(210,13%,60%);
    font-size: 50px;
    color: hsl(210,13%,30%);
    text-align: center;
}
.ex-u,.ex-d{
    padding: 0 30px;
}
.ex-u{
    text-shadow: 0 -1px  1px hsla(0,0%,100%,.8);
}
.ex-d{
    text-shadow: 0 1px  1px #fff,0 -1px  1px #333;
}
.ex-empty{
    font-weight: bold;
    text-shadow: 0px 2px #fff,0px -2px #fff,-2px 0px #fff,2px 0px #fff;
}
.ex-light{
    color: #ffeb3b;
    text-shadow: 0px 0px .1em, 0px 0px .3em;
}
.ex-text-u{
    color: #fff;
    text-shadow: 0 1px hsl(0,0%,85%),
        0 2px hsl(0,0%,80%),
        0 3px hsl(0,0%,75%),
        0 4px hsl(0,0%,70%),
        0 5px hsl(0,0%,65%),
        0 5px 10px #000;
}
</style>


## 连字符断行

在英文排版中，行末的单词如果太长或者不能折行，行末的单词就会被放到第二行显示，这样在该行的末尾就会留下大块的空白，这个时候我们希望将单词使用连字符（-）进行连接，然后将单词分开在两行显示，这样每行文子的末尾都显得很整齐。

在以前这很不容易做到，不过现在好了，CSS3文本引入了一个属性 hypens 来解决这个问题。该属性可以帮助开发者在单词合适的地方插入连字符来折断单词。它可以取 none，manual 和 auto 这三个值。不过该属性目前的支持程度还比较低。

## 插入换行

在网页排版的时候，常需要在某些标签后面断行，比如下面 HTML 代码中，需要在每个 `span` 标签后面插入换行（这里用作例子，但实际中可以有其他解决方法）。

```html
<p class="ex-br"><span>举杯邀明月，</span><span>对影成三人。</span></p>
```

可以在 span 元素后面添加 `<br />` 来完成换行，但是破坏了 DOM 结构，另外一种可行的方法是在 `span` 标签的后面添加换行符，换行符的编码是 `0x000A` ，这里可以使用 `span` 的 `after` 伪元素来添加这个换行符。

```css
span::after{
    content:"\A";
}
p{
    white-space: pre;
}
```

效果如下：

<p class="ex-br"><span>举杯邀明月，</span><span>对影成三人。</span></p>

## 文本行的斑马条纹

在列表中可以使用 `:nth-child(even)` 很方便地添加斑马线，但是如果想给 `pre` 中的代码块添加上斑马线，该怎么弄呢？

这里需要用到渐变背景，使用线性渐变可以给元素添加上条纹背景，这里可以给 pre 标签设置条纹背景，如此以来，代码块就有了条纹背景，这不正是我们苦苦追求的效果吗？

<pre id="ex-stripe">
花间一壶酒，独酌无相亲。
举杯邀明月，对影成三人。
月既不解饮，影徒随我身。
暂伴月将影，行乐须及春。
我歌月徘徊，我舞影零乱。
醒时相交欢，醉后各分散。
永结无情游，相期邈云汉。
</pre>

实现代码如下：

```css
line-height: 1.5em;
background: linear-gradient(rgba(0,0,0,.2) 50%, transparent 0);
background-size: auto 3em;
background-origin: content-box;
background-clip: content-box;
```

这里使用将 `background-size` 中高度设置为行高的二倍，确保条纹与内容不会错开。另外，如果元素有内边距，那么渐变是不是从内容区域开始的，这个时候需要使用 `background-origin` 来将渐变背景的参考点移动至内容区域。另外条纹背景的区域还会延伸至内边距区域，这里需要设置 `background-clip: content-box` 来将条纹背景限制在内容区域。

## 调整 tab 的宽度

在网页上常常会包含代码，而代码中往往使用了 tab 来控制缩进，在网页上一个 tab 来显示多宽呢？4 个或是 2 个？在不同的浏览器上可能不同，在不同的编辑器上一个tab 显示多宽也是不同的，所以人们推荐使用空格来代替 tab 进行缩进。

但是现在好了，有了一个叫做 `tab-size` 的属性来控制 tab 的宽度。


这是 `tab-size` 为 4 的情况：

<pre style="tab-size: 4">
void strcpy(char *s, char *d){
&#x0009;while(*d++ = *s++);
}
</pre>

这是 `tab-size` 为 8 的情况：

<pre style="tab-size: 8">
void strcpy(char *s, char *d){
&#x0009;while(*d++ = *s++);
}
</pre>

## 自定义下划线

好像浏览器默认的东西都是人们嫌弃的一样，我们总是不满 `text-decoration` 给添加的下划线的效果。于是人们开始使用 `border-bottom` 来个元素添加下划线效果。但是使用 `border-bottom` 添加的下划线往往距离元素较远，这是因为我们是在使用下边框来模拟下划线，为了调整距离，不得不调整 padding-bottom 的值，而这又会影响到布局。

解决方案是使用 `background-image` 相关属性，使用渐变得到一条细线，将其放置在文本的下方：

```css
background: linear-gradient(#333,#333) no-repeat;
background-size: 100% 1px;
background-position: 0 1.11em;
```

这里通过调整渐变的颜色可以改变下划线的颜色，调整 `background-size` 中第二个值（高度）可以改变下划线的宽度，调整 `background-position` 的第二个值可以改变下划线的位置。改变渐变得到的那条线的样式就可以改变下划线的样式。

需要注意的是要保证使用背景添加的那条线在背景区域范围内，如果下划线太偏下，可能偏移出了该元素所在的盒子，这样这条线就看不见了。


<p class="ex-underline">this is a simple example.</p>

但是使用这个方法还是略显 hack，以后的 CSS 可能会扩展 `text-decoration` 得到以下属性以方便开发者灵活地改变下划线的距离、宽度、线形和颜色等。

- text-decoration-color
- text-decoration-style
- text-decoration-skip
- text-underline-position

目前 firefox 已经实现了部分属性，chrome 还不支持。

## 现实中的文字效果

### 凸版印刷效果

因为在现实生活中，人们已经习惯了光源在头顶的环境，所以在图形界面中，底部有暗阴影或者顶部有亮阴影会让人觉得它是凸起的，如果底部有亮阴影而底部有暗阴影会让人觉得它是凹下去的。

<p class="ex-text-shadow"><span class="ex-u">凸起</span><span class="ex-d">凹下</span></p>

### 空心字效果

给文字进行描边，就可以得到下面这样的字体，使用 text-shadow 可以较容易地实现，只需要在四个方向上给文字添加阴影就好了。

<p class="ex-text-shadow"><span class="ex-empty">CSS 空心字效果</span></p>

实现代码：

```css
text-shadow: 0px 2px #fff,0px -2px #fff,-2px 0px #fff,2px 0px #fff;
```

这个方法还是略显麻烦，且当文字比较复杂的时候，为了能让所有边缘都描上边，我们需要在更多方向上添加文字阴影，比如上面汉字的例子，4个方向的描边效果就不好。但在未来，我们可以向 `box-shadow` 那样指定一个扩张半径，文字描边就更加容易实现了。


### 文字发光效果

给文字添加不带偏移，只有模糊，连颜色都不用指定的 `text-shadow` 就可以实现文字发光效果，为了让发光更加明显，可以叠加多个 `text-shadow`。

```css
text-shadow: 0px 0px .1em, 0px 0px .3em;
```

<p class="ex-text-shadow"><span class="ex-light">文字发光效果</span></p>

### 文字凸起效果

只需要给文字下方添加一系列渐渐加深的阴影就可以实现凸起的文字的效果。

<p class="ex-text-shadow"><span class="ex-text-u">文字凸起效果</span></p>


```css
color: #fff;
text-shadow: 0 1px hsl(0,0%,85%),
    0 2px hsl(0,0%,80%),
    0 3px hsl(0,0%,75%),
    0 4px hsl(0,0%,70%),
    0 5px hsl(0,0%,65%),
    0 5px 10px #000;
```

最后加一个纯黑色的模糊投影，可以让效果更加真实。



# CSS 揭秘 - 读书笔记（其五）

<style>
#ex-checkbox[type=checkbox]{
    display: none;
}
#ex-checkbox[type=checkbox]+label{
    display: inline-block;
    position: relative;
    width:80px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid #aaa;
    background: #aaa;
}
#ex-checkbox[type=checkbox]+label::after{
    content: '';
    position: absolute;
    left: 0;
    display: inline-block;
    width:50%;
    height: 100%;
    border-radius: 2px;
    background: #fff;
}
#ex-checkbox[type=checkbox]:checked+label{
    background: #39ca39;
    border: 1px solid #39ca39;
}
#ex-checkbox[type=checkbox]:checked+label::after{
    left: 50%;
}
#ex-item-count div,
#ex-item-count-range div,
#ex-items-count-even-or-odd div{
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    margin: 10px;
}
#ex-item-count div:only-child{
    background: red;
}
#ex-item-count div:first-child:nth-last-child(2),
#ex-item-count div:first-child:nth-last-child(2) ~ div{
    background: yellow;
}
#ex-item-count div:first-child:nth-last-child(3),
#ex-item-count div:first-child:nth-last-child(3) ~ div{
    background: green;
}
#ex-item-count-range div:first-child:nth-last-child(-n+4),
#ex-item-count-range div:first-child:nth-last-child(-n+4) ~ div{
    background: yellow;
}
#ex-item-count-range div:first-child:nth-last-child(n+4),
#ex-item-count-range div:first-child:nth-last-child(n+4) ~ div{
    background: black;
}
#ex-items-count-even-or-odd div:first-child:nth-last-child(2n+1),
#ex-items-count-even-or-odd div:first-child:nth-last-child(2n+1) ~ div{
    background: black;
}
#ex-items-count-even-or-odd div:first-child:nth-last-child(2n),
#ex-items-count-even-or-odd div:first-child:nth-last-child(2n) ~ div{
    background: yellow;
}
</style>


## 选用合适的鼠标光标

鼠标光标的作用不单单是用来指定鼠标在屏幕上的位置，根据鼠标光标的不同样式还能告诉用户当前能做什么操作，比如手指形状可以告诉用户当前可以进行点击操作。

合理地运用光标可以提升用户体验。比如在按钮不可按的时候，可以使用 `cursor:not-allowed` 来告诉用户当前不能操作。在全屏模式下看视频的时候可能需要将光标隐藏起来，这个时候可以使用 `cursor:none` 来隐藏光标，然后监听鼠标的 `move` 事件，以便于在适当的时候把光标显示出来。


## 扩大可点击区域

一个可交互的 UI 组件的尺寸如果太小，用户会花更多时间才能将光标对准到它上面。所以有必要扩大按钮等可交互的元素的可点击区域，让用户更快地进行交互。

给元素设置一个透明的边框，可以扩大元素的点击区域，但是往往我们需要将边框用作他用。幸运的是我们可以将元素的 `::after` 和 `::before` 伪元素设置为透明，且比宿主元素大，然后将其覆盖在宿主元素上，这样就达到了扩大点击区域的效果。


```css
.btn{
    position: relative;
}
.btn::after{
    content: '';
    position: absolute;
    top: -10px; bottom: -10px;
    left: -10px; right: -10px;
}
```

## 自定义复选框

一些表单元素的样式是不能被改变的，或者说不易被改变，但是这不能阻止我们去美化它们。一个思路是给需要美化的表单元素关联一个 label 标签（理应这样），由于点击 label 标签也能触发表单元素的各种状态（比如 checkbox 的选中或者取消选中），因此可以将表单元素隐藏起来，然后用美化过的 label 标签代替它。

对于 `input[type=checkbox]`，我们还需要给它被选中的时候设置样式，这个时候需要用到 `checked` 伪类。`:checked` 伪类只有在 checkbox 为选中的时候才会生效，且不管它是被脚本选中的还是用户手动选中的。

下面自定义一个 `input[type=checkbox]` 作为例子，这个大伙应该很熟悉了，微信中的开关：

<input id="ex-checkbox" type="checkbox">
<label for="ex-checkbox"></label>


css 代码如下：

```css
input[type=checkbox]{
    display: none;
}
input[type=checkbox]+label{
    display: inline-block;
    position: relative;
    width:80px;
    height: 20px;
    border-radius: 3px;
    border: 1px solid #aaa;
    background: #aaa;
}
input[type=checkbox]+label::after{
    content: '';
    position: absolute;
    left: 0;
    display: inline-block;
    width:50%;
    height: 100%;
    border-radius: 2px;
    background: #fff;
}
input[type=checkbox]:checked+label{
    background: #39ca39;
    border: 1px solid #39ca39;
}
input[type=checkbox]:checked+label::after{
    left: 50%;
}
```


利用 `checkbox` 的这种能够维持状态的特性，可以做出很多有两种状态的东西。

## 通过阴影来弱化背景

常常看到一些弹出层，使用一个黑色的半透明遮罩层覆盖住整个窗口，再把需要和用户进行交互的内容放在遮罩层上面。为了实现这种效果，常常需要一个额外的 HTML 元素来作为遮罩，但在某些情况下，我们可以使用需要突出显示的元素的伪元素来作为遮罩层，从而不需要添加额外的 HTML 元素。但需要注意的是伪元素上不能绑定事件，因此在需要点击遮罩层后关闭弹出层的场景下，这可能并不适用。

另外还可以使用 `box-shadow` 给突出显示的元素添加一个非常大的半透明阴影来模拟遮罩层，这个时候要注意 `box-shadow` 不能阻止用户点击遮罩层后面的元素。

## 通过模糊来弱化背景

你可能还见过这样的场景，弹出层使用的是一个模糊的页面作为遮罩层。这种效果并不容易实现，因为我们需要对整个页面进行模糊，但是需要突出显示的内容也存在于 `body` 中，因此如果给 `body` 进行模糊那需要突出显示的内容也会被模糊掉。

因此为了实现这种效果，需要保证突出显示的元素不能包含在页面主题内容中。解决办法是，使用一个 `div` 包裹住主题内容，然后将突出显示的内容和该 `div` 并列放置。

## 根据兄弟元素的数量来设置样式

这一节内容相当有意思，想象这样一种需求，一个列表中有一个或多个子项，现在要根据子项的数量来给子项设置不同的颜色。比如只有一个的时候将子项设置为红色，有两个时设为黄色，三个时设为绿色。

CSS 中没有能够计算子元素数量的方法，难道一定要借助于 JavaScript 吗，不用，CSS 是能够搞定这样的需求的。

一个元素的时候：

<div id="ex-item-count">
    <div></div>
</div>

两个元素的时候：

<div id="ex-item-count">
    <div></div>
    <div></div>
</div>

三个元素的时候：

<div id="ex-item-count">
    <div></div>
    <div></div>
    <div></div>
</div>


这里用到了伪类选择器 `first-child` 和 `nth-last-child`，实现的原理还是很好理解的。考虑下面代码：

```css
ul li:first-child:nth-last-child(1){

}
```

对一个子元素同时运用这两个伪类选择器，意味着该元素既是第一个元素也是最后一个元素，也就是说目前只有一个子元素，那么再考虑下面这段代码：

```css
ul li:first-child:nth-last-child(2){

}
```

该元素既是第一个元素也是倒数第二个元素，也就是说存在两个子元素，Ok，这个时候，我们再用上兄弟选择器 `~`：

```css
ul li:first-child:nth-last-child(2),
ul li:first-child:nth-last-child(2) ~ li{

}
```

选中所有子元素，前提是目前仅存在两个子元素。按这个思路，上面的需求就能轻松实现了。

### 根据兄弟元素的数量范围来匹配元素

现在又有了一个需求，当子元素超过 4 个的时候将它们设为黑色，否则设置为黄色。这个时候需要用到 `nth-last-child(an+b)` 这种模式，考虑：

```css
ul li:first-child:nth-last-child(n+4){}
```

因为 n 可以是 0 ~ 正无穷，因此只有当存在大于或等于四个子元素的时候才会匹配到第一个元素上，在考虑下面代码：

```css
ul li:first-child:nth-last-child(-n+4){}
```

这意味着括号里面的值是 负无穷 ~ 4 ，因此仅当存在小于 4 个子元素的时候才会匹配至第一个子元素上。

有了以上思路，再加上兄弟选择器就能实现前面提出的需求了：

三个子元素的时候：

<div id="ex-item-count-range">
    <div></div>
    <div></div>
    <div></div>
</div>

六个子元素的时候：

<div id="ex-item-count-range">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>


CSS 代码：

```css
ul li:first-child:nth-last-child(-n+4),
ul li:first-child:nth-last-child(-n+4) ~ div{
    background: yellow;
}
ul li:first-child:nth-last-child(n+4),
ul li:first-child:nth-last-child(n+4) ~ div{
    background: black;
}
```

### 根据兄弟元素的数量的奇偶来设置样式

有没有办法根据元素数量的奇偶来设置不同的样式呢？稍微改变一下，很容易就实现了：

奇数个子元素时：

<div id="ex-items-count-even-or-odd">
    <div></div>
    <div></div>
    <div></div>
</div>

偶数个子元素时：

<div id="ex-items-count-even-or-odd">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>

CSS 代码：

```css
ul li:first-child:nth-last-child(2n),
ul li:first-child:nth-last-child(2n) ~ div{
    background: black;
}
ul li:first-child:nth-last-child(2n+1),
ul li:first-child:nth-last-child(2n+1) ~ div{
    background: yellow;
}
```
