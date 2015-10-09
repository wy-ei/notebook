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
+ background-position:背景图片的位置
  + left top
  + 0 0
  + 200px 100px
  + center center
  + ...

连起来使用：

```
bakcground:color image repeat attachment position
```

## CSS3 新增

需要加浏览器厂商前缀

+ background-origin:指定绘制背景图片的起点。（联想盒子模型）
  + padding-box：背景图片起始于padding区域的左上角
  + border-box：起始于border区域左上角
  + content-box：起始于内容区域左上角
+ background-clip:指定背景图片的裁剪范围。
  + padding-box
  + border-box
  + content-box:背景图片和背景颜色只能存在于 content 区域。
+ background-size:指定背景图片的大小
  + auto:图片的原始大小
  + 100px:指定宽高都为100px
  + 50%:指定宽高为容器宽高的50%,这个容器是border,padding 还是 content 区域就要更具 background-origin 来决定了。
  + cover：铺满整个容器
  + contain:保持图片的宽高比例，将图片缩放到合适比例使得容器能完全容纳下图片。

有时候需要添加多个背景图片，这个时候可以使用`,`将多组属性分开，举例如下：

```
background-image: url(https://avatars3.githubusercontent.com/u/7794103?v=3&s=460),url(https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3415372198,2864505025&fm=58);
background-size: 50%,50%;
background-position: left top,top right;
background-repeat: no-repeat;
```

也可以一句话搞定：

```
background: url(pic2.jpg) top left / 50% no-repeat,url(pic1.jpg) top right /50% no-repeat;
```

至于格式嘛，就是下面这样：

```
background:image position /size repeat attachment clip origin
```
