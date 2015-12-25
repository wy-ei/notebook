### 获得元素的位置和元素的尺寸

对于现代浏览器，可以调用任何 DOM 元素的 `getBoundingClientRect` 方法来获得元素相对于文档的位置。该方法返回一个对象，该对象包含下面一些属性：

+ bottom
+ left
+ right
+ top

有的实现还包含下面两个属性：

+ height
+ width

以上这些属性，已经很详细地描述了元素的位置，和尺寸。

但是对于旧的浏览器就不能用这个方法了。

所有的元素都定义了 `offsetLeft` 和 `offsetTop` 属性，从这两个属性可以获得元素的位置。但是这个位置并不一定是相对于文档的，对于一个元素如果其父辈元素中有一个元素的 `position`  使用了除 `static` 之外的属性，那么这个元素的位置就是相对与该定位的父辈元素的。如果所有父辈元素的定位均为 `static` 那么就是相对于文档来定位的。

所有元素还有一个 `offsetParent` 属性，这个属性指向上面提到的元素的 第一个非 `static` 定位的父辈元素。如果没有的父辈元素，那么这个属性为 null。

另外所有元素还有 `offsetWidth` 和 `offsetHeight` 属性，这两个属性是元素的宽度和高度。

综上，为了得到元素的位置和大小可以使用下面的方法：

```
function getElementPositionAndSize(ele){
	var ret = null;
	if(ele.getBoundingClientRect){
		ret = ele.getBoundingClientRect();
		if( !('width' in ret) ){
			ret.width = ret.right - ret.left;
			ret.height = ret.bottom - ret.top;
		}
	}else{
		ret.width = ele.offsetWidth;
		ret.height = ele.offsetHeight;
		ret.left = 0;
		ret.top = 0;
		while(ret !== null){
			ret.left += ele.offsetLeft;
			ret.top += ele.offsetTop;
			ele = ele.offsetParent;
		}
		ret.right = ret.left + ret.width;
		ret.bottom = ret.top + ret.height;
	}
	return ret;
}
```