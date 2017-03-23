---
layout: post
title: 拖拽事件
category: JavaScript
---

## 拖拽事件

有关拖拽的事件有：`dragstart`,`drag`,`dragover`,`dragenter`,`dragleave`,`drop`,`dragend`。关于它们的作用，下面会一一讲解。

### 开始拖拽

要想让一个元素可以拖拽，需要将其 `draggable` 属性设置为 true

```html
<div id='source' draggable='true'>drag me</div>
```

另外单单拖放元素是没有什么用途的，往往要给拖放的元素附加一些数据，当开始拖动元素的时候会在拖动元素上触发 `dragstart` 事件，在此事件的处理函数中，可以通过给事件的 `dataTransfer` 属性中添加数据来给拖放关联一些数据。如下：


```javascript
var $source = $('#source');
$source.on('dragstart',function(event){
	event = event.originalEvent;

	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('text/plain',$(this).text());
});
```

通过调用 `event.dataTransfer` 的 `setData` 方法可以给拖放的元素添加数据。这个方法介绍两个参数，第一个参数是要添加的内容的 MIME 类型，第二个参数是与 MIME 类型对应的数据。可以多次调用这个方法添加不同类型的数据。

另外，对于链接、图片以及被选中的文字这些本来就可以拖动的元素，在拖动的时候会自动关联数据，对于链接关联的数据就是链接，对于图片就关联图片，对于选中的文字关联的就是文字了。

### 拖拽

在拖拽的过程中会不断触发 `drag` 事件。

### 自定义放置目标

当拖拽的目标移动到可以放置拖拽的元素上方的时候，以及在进入或离开，会在可放置拖拽的元素上面触发 `dragover` ,`dragenter`,`dragleave` 等事件。

在默认情况下元素都是不接受放置拖拽的，我们可以自定义放置目标。为了让一个元素能够放置拖拽，我们需要在它的上面绑定 `dragover` 和 `dragenter` 的事件处理程序，并取消这两个事件的默认行为。

```javascript
var $target = $('#target');
$target.on('dragenter',function(event){
	event.preventDefault();
});

$target.on('dragover',function(event){
	event.preventDefault();
	//...
});
```

这样这个元素就可以放置拖拽了。

### 释放拖拽

当释放了拖拽之后会在放置拖拽的这个元素上面触发 `drop` 事件，这里一定要弄清楚，事件并不是在拖拽的元素上面触发的，而是在放置目标上面触发的。

在放置目标上面绑定 `drop` 的事件处理程序，就可以从 `event.dataTransfer` 中拿出之前在 `dragstart` 事件中添加的数据，可以根据需要来处理这些数据。


```javascript
$target.on('drop',function(event){
	event = event.originalEvent;
	var text = event.dataTransfer.getData('text/plain');
	$target.text(text);
});
```

这里在 `event.dataTransfer` 上面调用的 `getData` 方法有一个参数，这个参数与 `setData` 的第一个参数一样，该方法可以获得之前添加的特定的 MIME 类型的数据。


### event.dataTransfer 对象

这个对象除了有 `getData` 和 `setData` 两个方法外，还有 `effectAllowed` 和 `dropEffect` 。

`effectAllowed` 这个属性用来描述拖放的元素能够接受什么样的操作。它的选项有下列几项：

+ copy
+ link
+ move
+ copyLink
+ copyMove
+ linkMove
+ all
+ none
+ uninitialized

这个属性只能在拖放元素的 `dragstart` 事件处理程序中设置。


```javascript
$source.on('dragstart',function(event){
	event = event.originalEvent;
	event.dataTransfer.effectAllowed = 'move';
	event.dataTransfer.setData('text/plain',$(this).text());
});
```

`dropEffect` 用来设置目标元素将执行的操作，如果其属性值属于 effectAllowed 范围内，那么鼠标就会呈现一个接受放置的样子，松开鼠标按键后就会触发 `drop` 事件，否则就不会触发 `drop` 事件。这个属性的取值有下面几种：


+ copy ：表示应该把拖动的元素复制到这里。
+ link ：表示放置的目标应该打开拖动的元素。
+ move ：应该把拖动的元素移动到这里。
+ none ：不能把拖动元素放置在这里。

该属性要在放置目标的 `dragover` 事件处理程序中设置才有效。

```javascript
$target.on('dragover',function(event){
	event.preventDefault();
	event = event.originalEvent;
	event.dataTransfer.dropEffect = 'move';
});
```

这里推荐 MDN 的文章，上面有更加详细的讲解 [Drag Operations](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#dragstart)。


这里有一个拖放的[例子](http://wy-ei.github.io/demo/page/drag/drag.html)
