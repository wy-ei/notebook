## props

可以通过 `this.props` 来访问传入组件的数据,可以通过 `this.props.children` 来访问组件内嵌的任何元素.

### 延展属性

```js
var props = {};
props.foo = x;
props.bar = y;
var component = <Component {...props} />;
```

### 自定义属性

如果要添加 HTML 规范中不存在的属性,那就要使用 `data-` 前缀.

```
<div data-custom-attribute="foo" />
```


## 插入 html

```
<p dangerouslySetInnerHTML={ { __html: "<span>html</span>" } }></p>
```

## Refs

使用 ref 给子组件命名,然后通过 this.refs 来引用 dom 节点

如下,通过 `this.refs.text.value` 拿到 textarea 中的文字.

```
<textarea ref="text"></textarea>

var text = this.refs.text.value;
```

## 组件

React 组件只能渲染单个节点。如果想要返回多个节点,则需要包裹在同一个节点中。
