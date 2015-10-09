## 媒体类型

常用以下几种：

+ screen
+ print
+ all


## 引用方法

### link

```
<link rel='stylesheet' type='text/css' src='style.css' media='screen' />
<link rel='stylesheet' type='text/css' src='style.css' media='print' />
```

### @import

```
<style type='text/css'>
    @import url(style.css) all;
</style>
```

### @media

```css
@media screen{
	...
}
```

## 媒体查询

```
<link rel='stylesheet' media='screen and (max-width:600px)' href='small.css' />
```

或者

```
@media screen and (max-width:600px){
	...
}
```

### max-width

max-width:700px  指示屏幕小于或者等于 700px 的时候就应用样式。

### min-width

大于或等于的时候生效


### and 

多个条件可以使用 and 隔开

```
@media screen and (max-width:1200px) and (min-width:800px) {

}
```

对于屏幕宽度在 800px - 1200px 的设备样式生效

### not


```
@media not print and (max-width:1200px){
}
```

否定条件


## meat 标签

当在智能手机上面使用媒体查询的时候，结果往往不如我们的意愿。这是因为这些移动设备有一个虚拟的可视空间，这个空间要比屏幕大很多。为了能让媒体查询在这些设备正常工作，就需要添加一个特殊的 meta 标签。

```
<meta name='viewport' content='' />
```

其中 content 字段可以取如下值：

+ width
+ height
+ initial-scale：初始的缩放程度
+ minimun-scale
+ maximun-scale
+ user-scalable:指示是否允许用户对视口进行缩放


```
<meat name='viewport' content='width=device-width,initial-scale=1.0' />
```

以上代码表示宽度为设备的宽度，初始缩放程度为1 ，也就是不缩放。



