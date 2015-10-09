# jquery 自定义选择符

$('div:eq(1)') : 选择集合中的第二项

$('tr:even') : 选择 0 ， 2 ， 4  ... 项，也就是第1，3，5列

$('tr:nth-child(odd)') : 选择奇数行

$(td:contains(Henry)) : 选择内容包含 Henry 的项

基于表单的选择符

+ :input
+ :buttom
+ :enabled
+ :disabled
+ :checed
+ :selected

# DOM 遍历方法

### filter

```
$('a').filter(function() {
  return this.hostname && this.hostname != location.hostname;
}).addClass('external');
```

### next

下一个元素

```
$(document).ready(function() {
  $('td:contains(Henry)').next().addClass('highlight');
});
```

### nextAll

后面的所有元素

### pre

前一个元素

### preAll

前面所有元素

### siblings

同辈所有元素

### 访问DOM元素

get

```
var myTag = $('#my-element').get(0).tagName;
var myTag = $('#my-element')[0].tagName;
```


# 事件

## 在页面加载后执行任务

```
$(document).ready(function(){
  ...
})
```

## $(document).ready() 与 window.onload 的关系

window.onload 在文档所需的所有资源下载完毕后触发，而$(document).ready() 在DOM树加载完毕后触发，这个时候图片声音等资源可能还没有下载完毕。当然这个时候访问图片的宽度高度等信息可能会出错。


##  .ready 的简写形式

```
$(function(){

});
```

## 防止命名冲突

```
jQuery(document).ready(function($){
  // 在函数内部，又取得了对 $ 的使用权
})
```

## 停止事件传播

event.stopPropagation();

## 阻止默认操作

使用 event.preventDefault();  虽然在IE中使用的是将returnValue 设置为 false
的方法来取消默认事件，但是这个时候 jQuery 已经帮我们考虑了。

## hover

```
$(document).ready(function() {
$('#switcher h3').hover(function() {
$(this).addClass('hover');
}, function() {
$(this).removeClass('hover');
});
});
```


## 事件捕获，事件冒泡

事件捕获表示事件最先被外面的元素接收，然后传递给内层。而事件冒泡指的是事件最先被内层元素接收到。

考虑到跨浏览器的一致性 jQuery 始终在事件冒泡阶段注册事件处理函数，所以可以确定 jQuery 中事件总是最具体的元素先获得响应事件的机会

事件冒泡可能导致副作用，这就体现在 mouseout 上，当在子元素上触发了mouseout 事件后这个事件会冒泡到父级元素这个时候的表现就是鼠标，没有离开父级元素但是依旧触发了 mouseout 事件。这种情况下可以考虑不冒泡的mouseenter 和 mouseleave 事件。

## 事件委托

有的时候需要在很多元素上面监听某个事件，这个时候如果将事件处理函数绑定到这些元素上的话将会导致存在过多的事件处理程序，整个页面的性能将会受到影响，这个时候我们可以利用事件冒泡的机制，将事件处理程序绑定到父元素上面，然后根据 event 对象里面的信息来对事件作出响应。

## is 方法

```
if ($(event.target).is('button')) {
  //...
}
```

is 方法接收一个选择器，判断 jQuery 对象中是否存在这个选择器所选择的元素。

要测试一个元素是否含有某个类，可以使用hasClass

## on 方法

$('#switcher').on('click', 'button', function() {
  //...
});

on 方法的第二个参数如果是一个选择符的话，在时间发生的会比较event.target 是否和这个选择符匹配，如果是的话，将会把 this 映射到这个对象上，按我的理解这就是实现了在父级元素上面捕获某种子类元素上的事件的一种方法。


## 事件名词空间

有的时候我们希望移除某个事件的事件处理程序，这个时候我用 off 方法就会移除所有的事件处理程序，在绑定事件的时候可以采用一种特殊的方式如下：

```
$('#switcher').on('click.collapse', function(event) {
if (!$(event.target).is('button')) {
$('#switcher button').toggleClass('hidden');
}
});
$('#switcher-narrow, #switcher-large').click(function() {
$('#switcher').off('click.collapse');
});
```

这个时候就能明确是哪一个点击事件了。


# 样式与动画

## 修改内联css

### css 方法

这个方法集 getter 和 setter 于一身，当传入单个样式属性的时候，就会返回对应的值

```
.css(['property1', 'property-2'])
//返回{"property1": "value1", "property-2": "value2"}
```

在设置参数的时候，有两种形式

1. .css('property', 'value'); // 传入单个属性和值
2. .css({property1: 'value1', 'property-2': 'value2'}); // 传入属性-值构成的对象

在设置 css 样式的时候常常遇到一些带有浏览器厂商前缀的样式，这些样式通常是尚处于实验阶段的样式，在原生 js 中我们可能需要挨个检查，但是在 jQuery 中我们直接用标准属性名称就可以了，jQuery 已经帮我们考虑了。

## 隐藏与显示元素

### hide 和 show

在调用hide后会减小元素的width和height最后将元素的display属性设置为none，从而隐藏元素。但是它会记住隐藏之前的状态，这样在调用show方法后就会恢复原来的显示样式。

### 时长和效果

+ slow：600ms
+ fast：200ms
+ 其他字符串：400ms
+ 数值：对应时长，单位为毫秒

## 淡入淡出

### fadeIn 和 fadeOut

修改元素的 透明度(opacity)。

## 滑上滑下

### slideUp

减小高度直到隐藏

### slideDown

向下增大高度，直到完全出现

## 切换可见性

### toggle 

交替调用 hide 和 show

### slideToggle

交替调用 slideUp 和 slideDown 


## 创建自定义动画

### animate

这个方法可以用来创建精细控制的动画，调用方法有两种

其一：

参数：属性对象，持续时间，缓动类型，回调函数

```
.animate({property1: 'value1', property2: 'value2'},
	duration, easing, function() {
	alert('The animation is finished.');
	}
);
```


其二：

参数：属性对象，选项

```
.animate({
	property1: 'value1',
	property2: 'value2'
	}, {
	duration: 'value',
	easing: 'value',
	specialEasing: {
	property1: 'easing1',
	property2: 'easing2'
	},
	complete: function() {
	alert('The animation is finished.');
	},
	queue: true,
	step: callback
});
```

### 并发与排队效果

有时候在对元素的多个属性运用动画的时候，我们希望他们一个一个的进行变化，这个时候就需要动画进行排队一个一个的执行，这个时候只需要将动画连缀起来就可以了，

```
.css({position: 'relative'})
.animate({left: paraWidth - switcherWidth}, 'slow')
.animate({height: '+=20px'}, 'slow')
.animate({borderWidth: '5px'}, 'slow');
```


这里的 '+=' 表示在原来的基础上加 20px ，而不是变化到 20px ，所以使用 '+=' 来处理相对变化。

fadeIn,sildeUp 等动画效果也是可以和animate连缀起来实现动画效果的。


但是有时候在连缀的中间一个环节又希望他能不等待前面动画完成就开始执行，这个时候就需要使用动画选项中的 `queue` 了，将queue 设置为false 就可以然当前动画不必等前一个动画完成就开始执行，queue = false 也就是说明，不排队，可以这样理解。


有的时候我们需要在动画之间修改某个css样式，这个时候就算把 `.css()` 插入到了合适的位置，也是无济于事的，因为那些效果都是添加在队列里面是异步执行的，不会阻塞js的执行，所以用 `css()` 方法添加的样式在一开始就会执行。 但是这个时候又非要让他在某个动画之后的话就可以使用queue方法。

```
$switcher
	.css({position: 'relative'})
	.fadeTo('fast', 0.5)
	.animate({
	left: paraWidth - switcherWidth
	}, {
	duration: 'slow',
	queue: false
	})
	.fadeTo('slow', 1.0)
	.slideUp('slow')
	.queue(function(next) {
	$switcher.css({backgroundColor: '#f00'});
	next();
	})
	.slideDown('slow');
```

这个queue的作用就是在队列中插入一个函数。至于为什么要调用next或者dequeue就是为了返回前面的动画作用的那个元素，这样后面的动画才能连接上继续执行（链式调用）。

# 操作DOM


## attr

### 值回调

```
$('div.chapter a').attr({
	rel: 'external',
	title: 'Learn more at Wikipedia',
	id: function(index, oldValue) {
		return $(this).text() + index;
	}
});
```
这里面的 this 就是每次迭代对应的 DOM 元素。

## 表单控件的值

```
//取得文本输入框的当前值
var inputValue = $('#my-input').val();
```


## DOM 树的操作

### 插入元素

+ .insertBefore()在现有元素外部、之前添加内容；
+ .prependTo()在现有元素内部、之前添加内容；
+ .appendTo()在现有元素内部、之后添加内容；
+ .insertAfter()在现有元素外部、之后添加内容。

例如：

```
$('<a href="#top">back to top</a>').insertAfter('div.chapter p');
$('<a id="top"></a>').prependTo('body');
```

### 移动元素

```
$('span.footnote').insertBefore('#footer');
```

### 包装元素

```
$('span.footnote')
.insertBefore('#footer')
.wrapAll('<ol id="notes"></ol>')
.wrap('<li></li>');
```

移动了元素以后，把所有的元素包围在 `ol` 中，然后再把每个元素包围在 `li` 中。


### 使用反向插入方法

+ append
+ before
+ after
+ prepend


### 复制元素

使用 clone 就可以完成复制，然后将元素插入到DOM树种就可以页面的内容了。如果希望事件一起复制的话就需要给出参数 true 。

### 获得内容

+ html("Some text and markup")
+ text('some text')

这两个方法都可以得到元素的内容，区别在于text返回的是纯文本，而 html 会将标签也一并返回。


## 总结

要在每个匹配的元素中插入新元素，使用：

+ .append()
+ .appendTo()
+ .prepend()
+ .prependTo()

要在每个匹配的元素相邻的位置上插入新元素，使用：

+ .after()
+ .insertAfter()
+ .before()
+ .insertBefore()

要在每个匹配的元素外部插入新元素，使用：

+ .wrap()
+ .wrapAll()
+ .wrapInner()

要用新元素或文本替换每个匹配的元素，使用：

+ .html()
+ .text()
+ .replaceAll()
+ .replaceWith()

要移除每个匹配的元素中的元素，使用：
+ .empty()

要从文档中移除每个匹配的元素及其后代元素，但不实际删除它们，使用：


+ .remove()
+ .detach()



# 高级选择符与遍历

## 选择符

### :has

这个选择符从当前被选中的元素中挑选出那些包含指定元素
的元素，举例如下：

```
$('div:has(h1:has(p))').css('backgroundColor','red');
```
 以上这个例子先选择 div 标签，然后看其中是否含有 h1 标签，然后再看这个 h1 标签中是否含有一个 a 标签，如果条件都满足了，那么就会选择这个 div。

### :not

:not 这个选择符的作用就是取反，也就是说取得不满足:not中条件的元素。举例子如下：

```
$('div:not(:has(h1))').css('backgroundColor','red');
```
这选择选择了那些不包含 h1 标签的 div。

### :contains

:container 这个选择符选择包含特定文本的元素，举例如下：

```
$('.content:contains(JavaScript)').css('backgroundColor','red');
```

选择内容中包含 `JavaScript` 的 content 类所在的元素。

### :visible

选择可见的元素

选择符太多了，可以查看[官方文档](http://api.jquery.com/category/selectors/)

##选择方法

有时候这些选择符，还是不能完成需求，那可以使用其对应的函数方法版本

### find

这个find方法的用法如下：

```
$('.content').find('p').not(function(){
	return $(this).text().match(/java|javascript/i) == null;
}).css('backgroundColor','red');
```

从`.content`  中找到 `p` , 但是我们为什么不直接使用 `$('.content p')` 呢 ？ 其实这里他就是相当于`.content p` 之间的这个空格。

### not

not 可以接受一个回调函数,这个函数将在检测每个元素的时候调用，如果这个函数返回的是 true ，那么这个元素就被排除在结果集合之外。

### filter

这个函数接收一个回调函数，然后对每一项运用此回调函数，返回回调函数返回值为 true 的项。



## DOM 元素栈

每个jQuery 对象的 .prevObject 属性指向其前一个对象，这样就会形成一个栈的结构，而 .end 和 .addBack 这两个方法就是用来操作这个栈的。

### end

这个方法就是简单地从栈上面弹出一个元素，这个时候栈的顶部也就保存着和弹出元素的 .prevObject 一样的引用了。

### addBack

把上一个集合添加到当前集合里面，举例说明如下：

```
$(document).ready(function() {
	$('#release').nextAll().addBack().addClass('highlight');
});
```

调用完成 nextAll 之后栈的情况是这样的。

```
+--------------+
 |     nextAll     |
+ ------------- +
 | $('#release') |
+---------------+
```

在调用了addBack 之后栈的情况是这样的：

```
+ --------------------------+
 | $('#release')    nextAll   |
+---------------------------+
```

### 编写DOM遍历方法插件


```
$.fn.containsExactly = function(text) {
	var $items = $();
	this.each(function(index, el) {
		var $el = $(el);
		console.log($el.text());
		if($el.text() == text ){
		 	$items = $items.add($el);
		}
	});
	return this.pushStack($items);
};
```
