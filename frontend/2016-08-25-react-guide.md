---
layout: post
title: React 参考手册
category: 前端开发者笔记
tag:
  - 前端框架
  - React
---

* toc
{:toc}

## React 顶级 API

`React` 是整个 React 的入口。如果你使用的是预编译版本，可以从全局范围内获取到 `React`。如果你使用的是 `CommonJS` 模块，你可以使用 `require` 得到 `React`。

### React.Component

```javascript
class Component
```

当你在使用 ES6 定义组件的时候，可以使用 `React.Component` 作为基类。可以参考 [可重用的组件](https://github.com/facebook/react/blob/master/react/docs/reusable-components.html#es6-classes) 了解如何使用 ES6 来写 React。关于此基类提供了那些基本方法，可以参看 [Component API](#issuecomment-266635983)

### React.createClass

```javascript
ReactClass createClass(object specification)
```

通过给定的一个对象创建一个组件类。这个组件需要实现一个 `render` 方法并返回一个单一的可渲染元素。该元素可以包含任意深度的子元素。这里的组件类与标准的原型类不同的是，你不需要在组件类上进行 `new` 操作。`new` 的过程，其实都已经在背后替你做了。

关于传入的对象需要有哪些属性，可以参见这里[组件规格和生命周期](#issuecomment-266635944)

### React.createElement

```javascript
ReactElement createElement(
  string/ReactClass type,
  [object props],
  [children ...]
)
```

通过给定的类型创建并返回一个新的 `ReactElement` 。这个类型参数可以是一个 html 标签名（例如：'div', 'span' 等），或者是一个 `ReactClass`（通过 `React.createClass` 创建）。

### React.cloneElement

```
ReactElement cloneElement(
  ReactElement element,
  [object props],
  [children ...]
)
```

使用 `element` 作为克隆的起点克隆并返回一个新的 `ReactElement` 。生成的元素会拥有原元素和新元素的 props 的前合并。新的子元素会替换掉旧的子元素。不同于 `React.addons.cloneWithProps`，这里原始元素的 `key` 和 `ref` 会被保留。另外对于 props 不会进行特别的合并操作（不同于 `cloneWithProps`）。查看 [v0.13 RC2 blog post](https://github.com/facebook/react/blob/master/react/blog/2015/03/03/react-v0.13-rc2.html) 了解更多。

### React.createFactory

```javascript
factoryFunction createFactory(
  string/ReactClass type
)
```

返回一个工厂方法来生成给定类型的 React 元素。和 `React.createElement` 一样，type 参数可以是一个 html 标签名（例如：'div', 'span' 等），或者是一个 `ReactClass`。

### React.isValidElement

```javascript
boolean isValidElement(* object)
```

验证一个对象是否为 React 元素。

### React.DOM

`React.DOM` 通过包装 `React.createElement` 为得到 DOM 组件提供了方便。这些方法应该仅仅用在没有使用 JSX 的时候。比如 `React.DOM.div(null, 'Hello World!')`

### React.PropTypes

`React.PropTypes` 包含了可以赋值给组件的 `propTypes` 对象的类型。`propTypes` 对象可以用来验证父组件传入的 `props` 是否符合预期。关于 `propTypes` 更详细的信息请参考 [可重用的组件](https://facebook.github.io/react/docs/reusable-components.html)。

### React.Children

`React.Children` 提供了一些工具方法来处理 `this.props.children` 这个不透明的数据结构。

#### React.Children.map

```javascript
array React.Children.map(object children, function fn [, object thisArg])
```

在 `children` 中包含的每个元素上调用 `fn` 并以 `thisArg` 作为 `fn` 的上下文（this）。如果 `children` 是一个 [keyed fragment](http://reactjs.cn/react/docs/create-fragment.html) 或者是一个数组，它将被遍历。fn 不会被传入容器元素。如果 `children` 是 `null` 或者 `undefined` 将会返回 `null` 或者 `undefined` 而不是一个数组。

#### React.Children.forEach

```javascript
React.Children.forEach(object children, function fn [, object thisArg])
```

同 `React.Children.map()` 但是没有返回值。

#### React.Children.count

```javascript
number React.Children.count(object children)
```

返回 `children` 中包含的组件的总数，等于传入 map 或者 forEach 的回调的执行次数。

#### React.Children.only

```javascript
object React.Children.only(object children)
```

返回 `children` 中仅有的子集。如果有多个子级将会抛出异常。

#### React.Children.toArray

```javascript
array React.Children.toArray(object children)
```

将 `children` 中的不透明的数据类型作为一个平坦的数组返回，并给每个子元素赋予一个 key 值。如果你想在 render 方法中手动地对子元素进行操作，那该方法就很有用。尤其是当你希望在将其向下传递之前对子元素的顺序进行调整，或者想对其进行截断的的时候。

## ReactDOM

`react-dom` 这个包中提供了一些专门针对 DOM 的方法，你可以在你的应用的顶层使用到这些方法。你的大多数组件是不需要使用到这个模块的。

### ReactDOM.render

```javascript
render(
  ReactElement element,
  DOMElement container,
  [function callback]
)
```

将 ReactElement 渲染进 DOM 树中。`container` 是 DOM 中用来承载该 ReactElement 的元素。该方法返回对组件的[引用](https://github.com/facebook/react/blob/master/react/docs/more-about-refs.html)，对于[无状态组件](https://github.com/facebook/react/blob/master/react/docs/reusable-components-zh-CN.html#%E6%97%A0%E7%8A%B6%E6%80%81%E5%87%BD%E6%95%B0) 会返回 null。

如果 ReactElement 之前已经渲染进 DOM 树了，这会更新 DOM 树，来反应 ReactElement 的状态。

如果提供了可选的回调参数，回调会在组件完成渲染或者更新之后被执行。

> 注意:

> `ReactDOM.render()` 会完全控制你提供的容器元素中的内容。在首次渲染的时候容器中得任何元素都会被替换掉。之后会使用 React 的 DOM diff 算法来高效地更新 DOM。

> `ReactDOM.render()` 不会修改容器元素（仅仅修改其中的子元素）。在未来，可能会做写修改允许在某个 DOM 节点中插入组件而不重新已经存在的子元素。

> `ReactDOM.render()` 目前返回一个 React 根组件的引用，但是使用该引用是不推荐的，应该避免这样做。因为在 React 的未来版本可能会在某些情况下异步地渲染组件。如果你需要一个根组件实例的引用，最好的方法是添加一个 [ref 回掉](http://reactjs.cn/react/docs/more-about-refs.html#the-ref-callback-attribute)在根组件上。

### ReactDOM.unmountComponentAtNode

```javascript
boolean unmountComponentAtNode(DOMElement container)
```

从 DOM 中移除一个已经挂载的 React 组件，并清除掉绑定的事件和维持的状态。如果没有组件挂载在该容器上，调用该方法没有任何效果。如果移除成功会返回 `true`，如果没有需要移除的组件会返回 `false`

### ReactDOM.findDOMNode

```javascript
DOMElement findDOMNode(ReactComponent component)
```

如果这个组件已经被挂载在 DOM 上，这会返回相应的浏览器的原生 DOM 节点。这个方法在需要从 DOM 上读取数据的时候很有用，比如从表单元素中拿到输入的数据，或者测量 DOM 元素的尺寸。**在某些情况下，你可以通过添加 `ref` 回调来完全避免使用 `findDOMNode`**。当 `render` 返回 `null` 或者 `false` 的时候 `findDOMNode` 会返回 `null`。

> 注意:

> `findDOMNode()` 是一个用来获取底层 DOM 的入口。在大多数时候，使用该方法是危险的，因为刺破了组件的抽象层。

> `findDOMNode()` 仅仅工作在已经挂载的组件上（也就是组价已经被渲染入 DOM 树中）。如果你试图在没有挂载的组件上调用该方法（比如在 一个还没有被创建的组件的 `render()` 方法中调用该方法），这会抛出异常。

> `findDOMNode()` 不能被用在无状态的组件上。

## ReactDOMServer

`react-dom/server` 包允许你在服务端渲染组件。

### ReactDOMServer.renderToString

```javascript
string renderToString(ReactElement element)
```

将一个 ReactElement 渲染为原始的 HTML 字符串。这个方法应该仅仅被用在服务端。你可以使用该方法来在服务端生成 HTML 再将其作为客户端第一次请求的响应发送出去，这可以加快客户端首页的呈现速度，还可以支持搜索引擎的爬虫以支持 SEO。

### ref

在组件上可以使用 ref 来获取到底层的 DOM，早期 ref 的值是一个字符串，现在更推荐使用一个函数。

```javascript
<div
  ref={(div => this.div = div)}
>
  <p>react</p>
</div>
```

这样就可以在代码中通过 `this.div` 引用到这个 div 元素了。

在 react v16 中，可以使用 `React.createRef()`:


```javascript
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.div = React.createRef();
  }
  render() {
    return <div ref={this.div} />;
  }
}
```

这样就可以在代码中通过 `this.div.current` 引用到这个 div 元素了。


### ReactDOMServer.renderToStaticMarkup

```javascript
string renderToStaticMarkup(ReactElement element)
```

和 `renderToString` 相同，只是生成的 HTML 字符串中不会包含诸如 `data-react-id` 这样的 DOM 属性（React 依赖该属性）。当你仅仅需要 React 渲染出一些静态的页面（不需要额外的 DOM 属性）的时候，该方法就很有用，因为相对 `renderToString` 它能减少不少字节数。

## 组件的创建和生命周期

当调用 `React.createClass()` 创建组件的时候，你应该提供一个特定格式的对象，该对象中包含一个 `render` 方法以及下面将会介绍的一些生命周期方法。

> 注意：

> 也可以使用 ES6 中的 `class` 来创建组件。使用 `class` 可以实现大多数同样功能的函数，不过存在一些差异。关于 `createClass` 和 ES6 class 之间的差异，可以参见这篇文档 ---- [ES6 classes](https://facebook.github.io/react/docs/react-without-es6.html)。

### render

```javascript
ReactElement render()
```

`render()` 方法是必须的。

当该方法被调用时，会检验 `this.props` 和 `this.state` 并返回一个元素。这个元素可以是一个原生元素虚拟的表现（比如 `<div />`）或者是另外一个自定义的包含多个子组件的组件。

也可以返回 `null` 或者 `false` 来表示你不希望有任何东西被渲染出来。实际上，React 渲染出一个注释 `<!-- xxx --->` 标签使得目前使用的 diff 算法能够正常工作。当返回 `null` 或者 `false` 的时候，`ReactDOM.findDOMNode(this)`会返回 `null`。

`render()` 函数应该是"纯"的，也就是说它不会修改组件的状态，使用同样的数据它每次返回的结果都是相同的，而且它不应该读取或更改 DOM 树，或者进行与浏览器交互的操作，比如调用 `setTimeout`。如果你需要和浏览器进行交互，把操作放在 `componentDidMount()` 中或者其他生命周期方法中进行。保持 `render()` 的纯净使得服务端渲染更加容易，而且可以让组件更加容易理解。

`render` 方法会在 `componentDidMount` 和 `componentDidUpdate` 之前被调用。

### getInitialState

```javascript
object getInitialState()
```

在组件挂载前调用一次，返回值将作为 `this.state` 的初始值。如果没有返回任何值，则 `this.state` 为 `null` ，后续调用 `setState` 的时候会报错。

### getDefaultProps

```javascript
object getDefaultProps()
```

调用一次并缓存下返回值，作为后续该组件实例的默认属性。如果父组件没有传给该组件某个值，将会使用该对象中的值作为默认值。

这个方法将在所有实例被创建之前调用，因此该方法不能依赖 `this.props`。除此之外，需要注意的是 `getDefaultProps()` 返回的对象会在该组件的多个实例之间共享，而不是复制多个副本。使用 ES6 语法的时候在组件上添加 `defaultProps` 实现和 `getDefaultProps()` 同样的效果，此时要避免修改 `defaultProps` 的值。

### propTypes

```javascript
object propTypes
```

`propTypes` 对象允许你验证父组件传入的 `props`。关于 `propTypes` 更详细的信息请参考 [可重用的组件](https://facebook.github.io/react/docs/reusable-components.html)。

### mixins

```javascript
array mixins
```

`mixins` 是一个数组，它允许你使用混入的方法来在多个组件之间共享方法。关于 `mixins` 的更多信息，可以参见 [可重用的组件](https://facebook.github.io/react/docs/reusable-components.html)。

### statics

```javascript
object statics
```

`statics` 对象允许你定义静态方法，定义的静态方法可以从组件类上调用。比如：

```javascript
var MyComponent = React.createClass({
  statics: {
    customMethod: function(foo) {
      return foo === 'bar';
    }
  },
  render: function() {
  }
});

MyComponent.customMethod('bar');  // true
```

定义在 `statics` 这个对象中的方法是静态的，意味着你可以调用它们在任何组件被创建之前，这个方法不应该访问组件的 `props` 和 `state`。如果你想要在静态方法中获取 props 中的值，将 props 作为参数传给该静态方法。

### displayName

```javascript
string displayName
```

`displayName` 是一个字符串，用来在调试时候让调试信息更加清晰易读。使用 `JSX` 语法 该属性会被自动设置。

## 生命周期方法

一些在组件的特定生命周期上调用的方法。

### componentWillMount

```javascript
void componentWillMount()
```

仅仅调用一次，在客户端和服务端均会调用。在初次渲染之后立刻调用。如果你在此方法内调用 `setState` 方法，`render()` 会察觉到 `state` 的更新，使用更新后的值来进行渲染。

### componentDidMount

```javascript
void componentDidMount()
```

仅调用一次，且仅在客户端调用。会在初次渲染完成后立刻调用。在该方法中，你可以从 refs 中访问所有所有子组件，并通过 ReactDOM.findDOMNode 来访问到底层 DOM 树，进行一些 `DOM` 操作。子组件的 `componentDidMount()` 方法优先于父组件调用。

如果想要集成其他 JavaScript 框架、使用 `setTimeout` 和 `setInterval`，或者发送 Ajax 请求，可以在此方法中执行这些操作。

### componentWillReceiveProps

```javascript
void componentWillReceiveProps(
  object nextProps
)
```

当组件接收到新的 `props` 的时候被调用。父组件调用 `setState` 引发这个组件更新后，子组件会触发这个方法。这个方法不会再初次渲染时被调用。

该方法被调用时会被传入新的 `props`，在此函数中你可以根据新旧 `props` 对组件状态进行一些改变，在该方法中可以使用 `this.props` 来获取到旧的 `props`，且在该方法中调用 `this.setState()` 不会触发重新渲染。

```javascript
componentWillReceiveProps: function(nextProps) {
  this.setState({
    likesIncreasing: nextProps.likeCount > this.props.likeCount
  });
}
```

> 注意:

> 一个常见的错误想法是在该生命周期函数中，认为组件的 props 被更改了。接收到新的 `props` 并不意味值 props 就与就得 `props`。但是如果你要在该方法中根据不同的 `props` 进行网络请求等操作时，需要检查一下新旧 `props` 是否不同。可以参见这篇 blog 了解更多。 [A implies B does not imply B implies A](https://facebook.github.io/react/blog/2016/01/08/A-implies-B-does-not-imply-B-implies-A.html)

> 并不存在一个叫做 `componentWillReceiveState` 的类似方法。传入的 `props` 的变化可能会引起 `state` 的变化，但是反过来却不会。如果你需要在 `state` 改变的时候进行一些操作，请使用 `componentWillUpdate`。

### shouldComponentUpdate

```javascript
boolean shouldComponentUpdate(
  object nextProps, object nextState
)
```

当接收到新的 `props` 和 `state` 后，在重新渲染前调用。该方法不会在初次渲染，或者因为 `forceUpdate` 而引起的重新渲染前被调用。

使用该方法作为一次取消重新渲染的机会，在该方法中可以检查新的 `props` 和 `state`，若觉得变化不应该引起组件更新，可以通过返回 `false` 来告诉 React 不需要更新该组件。

```javascript
shouldComponentUpdate: function(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

如果 `shouldComponentUpdate` 返回 `false`，`render()` 会被完全跳过执行。另外，`componentWillUpdate` 和 `componentDidUpdate` 也不会被执行。

默认情况下，`shouldComponentUpdate` 始终返回 `true` 来阻止当直接修改 `state` 时出现的一些微妙的 bug。但是如果你始终将 `state` 作为不可修改的对象来看待，且在 `render` 中只使用 `state` 和 `props` 作为数据源，那么你可以改写 `shouldComponentUpdate` ，并在其中检查新旧 `state` 或者 `props` 是否发生了了改变，并决定是否需要更新组件。

如果遇到性能瓶颈，尤其是在包含大量组件的时候，可以合理地使用 `shouldComponentUpdate` 来加速你的应用。

### componentWillUpdate

```javascript
void componentWillUpdate(
  object nextProps, object nextState
)
```

在接收到新的 `state` 和 `props` 后，在重新 render 之前调用。这个方法不会再首次渲染时被调用。

以此作为更新之前进行一些准备工作的契机。

> 注意:

> 你 **不能** 在该方法中使用 `this.setState()`。如果你需要更新 `state` 来响应一个 `prop` 的改变，使用 `componentWillReceiveProps`。

### componentDidUpdate

```javascript
void componentDidUpdate(
  object prevProps, object prevState
)
```

在组件更新完成后，立刻被调用。这个方法不会再初次渲染时被调用。在这里时候你同样可以获取到底层的 DOM。

使用该方法作为在组件更新完成后修改 DOM 的机会。

### componentWillUnmount

```javascript
void componentWillUnmount()
```

在组件将被卸载的时候被调用。

在这里做一些清理工作，比如清除掉周期性时间回调，或者清除掉在 `componentDidMount` 或 `componentDidUpdate` 阶段创建的 DOM 元素，添加的回调等等。

在卸载组件的时候是由内而外的，所以子组件的 `componentWillUnmount` 会先于自身 `componentWillUnmount` 调用。

### 生命周期方法的调用顺序

不同阶段会调用不同的生命周期方法。

**首次挂载的时候：**

`componentWillMount` -> `render` -> `componentDidMount`

**组件更新的时候：**

`componentWillReceiveProps` -> `shouldComponentUpdate` -> `componentWillUpdate` -> `render` -> `componentDidUpdate`

**组件卸载的时候：**

`componentWillUnmount`

## Component API

React 组件的实例在渲染的时候会在内部创建。该实例会在后续的渲染中被复用，在组件方法中可以通过 `this` 来获得到该组件的实例。在组件外部获得组件实例的唯一方法是保存 `ReactDOM.render` 的返回值。在组件内部，也可以使用 [refs](/react/docs/more-about-refs.html) 来获得到某个组件的引用。

### setState

```javascript
void setState(
  function|object nextState,
  [function callback]
)
```

该方法执行一个浅合并，将 nextState 合并入当前的 state。 这是在事件触发或者服务器响应后更新 UI 的最基本的方法。

第一个参数可以是一个对象（包含零个或者多个需要更新的键值），或者是一个方法（以 state 和 props 作为参数），该方法返回包含需要更新的键值的对象。

这是一个使用对象作为参数的简单例子：

```javascript
setState({mykey: 'my new value'});
```

也可以传入一个函数作为参数，该函数的调用形式形如：`function(state, props)`。在需要根据之前的 `state` 和 `props` 得到新的 `state` 的时候该方法很有用。比如，假如我们希望增加 `state` 中的某个值：

```javascript
setState(function(previousState, currentProps) {
  return {myInteger: previousState.myInteger + 1};
});
```

第二个可选的参数是一个回调函数，它会在 `setState` 调用后组件完成重新渲染之后执行。

> 注意:

> **不要** 直接修改 `this.state` , 因为调用 `setState` 之后可能会替换掉你所做的修改。要把 `this.state` 当做不可修改的对象来对待。

> `setState` 调用后不会立刻修改 `this.state` 中的值，而是在稍后的一个之间。所以在调用了 `setState` 之后，从 `this.state` 上任会拿到之前的值。

> 不保证同步执行 `setState`，为了提高性能，可能会成批地调用。

> `setState` 会触发一次重新渲染，除非在 `shouldComponentUpdate()` 中阻止了更新。如果使用了易变的数据，且在 `shouldComponentUpdate()` 中无法实现判断是否需要更新的逻辑，那么请仅在新的 `state` 有别于之前的 `state` 的时候调用 `setState`，这样可以避免不必要的重新渲染。

### replaceState

```javascript
void replaceState(
  object nextState,
  [function callback]
)
```

`replaceState` 的行为与 `setState()` 相似，只是它会删除所有之前存在于 `state` 中，但不存在于 `nextState` 中的键值。

> 注意：

> 这个方法不能用在 ES6 中通过扩展 `React.Component` 得到的 `class` 组件中。在未来它可能从 React 中完全移除。

### forceUpdate

```javascript
void forceUpdate(
  [function callback]
)
```

默认情况下，当组件的状态或者属性变化时，组件将会重新渲染。但是，如果此次修改是隐式的（比如：对象深层的某个值被修改了，而对象自身没有改变）或者 `render` 方法使用了其他的一些数据（比如一个全局的变量），当你知道 `render` 依赖的数据已经改变了时，你可以通过 `forceUpdate()` 来告诉 React 该组件需要重新渲染。

调用 `forceUpdate()` 会让 `render` 方法被调用，且跳过 `shouldComponentUpdate()` 方法。组件的子组件的生命周期函数会正常地触发，包括 `shouldComponentUpdate()` 。React 同样会仅更新那些有变动的 DOM 节点。

通常，你应该避免使用 `forceUpdate()` ，在 `render` 方法中仅仅从 `this.props` 和 `this.state` 中读取数据。这可以让你的组件变得更加 "纯净"，让你的应用更加简单和高效。

### isMounted

```javascript
boolean isMounted()
```

调用 `isMounted()` 可以得到组件当前是否被挂载，组件已经被渲染进入 DOM 树中时返回 `true`，否则会返回 `false`。你可以在异步操作中使用该方法知晓组件是否已经挂载，以保证正确地调用 `setState` 和 `forceUpdate` 等函数。

> 注意：

> 这个方法不能用在 ES6 中通过扩展 `React.Component` 得到的 `class` 组件中。在未来它可能从 React 中完全移除，所以你应该[避免使用它](https://facebook.github.io/react/blog/2015/12/16/ismounted-antipattern.html)。


## Context

通过 React 的 Context 将数据直接传递给深层的子组件。context 是上层组件传给下层的，使用方法如下：

下层组件：

```js
const PropTypes = require('prop-types');

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};
```

上层组件：

```js
const PropTypes = require('prop-types');

class Message extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }
  render() {
    return (
      {this.props.text} <Button>Delete</Button>
    );
  }
}

Message.childContextTypes = {
  color: PropTypes.string
};
```

上层组件需要提供 `getChildContext` 方法，返回一个对象（context），并且需要定义 `childContextTypes`。这个组件的下层组件，要使用这个 `context` 必须提供 `contextTypes` 这个静态属性。所有提供了 `contextTypes` 静态的子组件能够得到其中指定的 `context` 中的字段，如果没有提供 `contextTypes` 那么 `this.context` 会是一个空对象。
