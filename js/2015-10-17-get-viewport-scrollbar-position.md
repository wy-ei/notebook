## 获取浏览器滚动条的位置

我们时常需要获取浏览器的水平和竖直方向的滚动位置。

window 对象提供了 `pageXOffset` 和 `pageYOffset` 属性可以获得该信息，它能在IE9及以后以及其他现代浏览器中很好地工作。

其次，`document.documentElement` 和 `document.body` 中的 `scrollLeft` 和 `scrollTop` 属性也提供了对应的信息，从 `documentElement` 还是 `body` 中获取，这要根据文档的渲染模式来定了。

通过 `document.compatMode` 可以获得文档的渲染模式，这个属性有下列两种可能的取值：

1. `CSS1Compat`：标准模式
2. `BackCompat`：怪异模式

在标准模式下，要从`documentElement` 中获取滚动条的位置信息，怪异模式则在 `body` 中，这在 FF 和 IE 下工作良好，但是在 chrome 中无论处于什么渲染模式，`document.documentElement.scrollLeft` 和 `document.documentElement.scrollLeft` 的值都是 0,而 `document.body.scrollLeft` 和 `document.body.scrollLeft` 则返回正确的值。想必这个 bug 很多人都发现了。关于这个bug可以参见[这里](https://code.google.com/p/chromium/issues/detail?id=2891#c53)

这样看来无论处于什么渲染模式 `documentElement.scrollLeft` 或 `document.body.scrollLeft` 都有一个为零，一个为有效值。所以写出下面的方法来获得视口的滚动位置：

```javascript
function getScrollOffsets() {
    // IE 9+ 以及其他浏览器
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        };
    }

    // IE8 及更早版本
    return {
        x: document.documentElement.scrollLeft || document.body.scrollLeft ,
        y: document.documentElement.scrollTop || document.body.scrollTop
    };
}
```

