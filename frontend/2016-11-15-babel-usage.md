---
layout: post
title: babel 用法总结
category: 前端开发者笔记
tag: 前端工具
---

* toc
{:toc}

## 配置

最新的配置项可以参看 [https://babeljs.io/docs/usage/options/](https://babeljs.io/docs/usage/options/)，这个配置项可以在调用 `babel.transform(code, options)` 的时候传入，也可以在 `.babelrc` 中进行配置。

## `.babelrc` 的写法

所有的 babel 的配置项都可以在 `.babelrc` 中配置，`.babelrc` 中的数据格式同 JSON，它使用 JSON5 来解析。

### 在 `package.json` 中进行配置

你也可以选择将 `.babelrc` 中的内容写在 `package.json` 中：

```js
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    // babel config here
  }
}
```

### 环境变量

可以使用 `env` 选择针对不同的环境设置各自的配置：

```json
{
  "env": {
    "production": {
      "plugins": ["transform-react-constant-elements"]
    }
  }
}
```

针对环境的配置项，会覆盖掉普通的配置。`env` 的值会从 `process.env.BABEL_ENV`, 当这个值没有设置的时候会使用 `process.env.NODE_ENV`，如果依然没有定义，那么环境默认为 `"development"`

可以使用下列命令来这是环境变量

**Unix**

```bash
$ BABEL_ENV=production
$ YOUR_COMMAND_HERE
```

**Windows**

```
$ SET BABEL_ENV=production
$ YOUR_COMMAND_HERE
```

### 寻找 `.babelrc` 的方式

Babel 首先会在当前目录寻找 `.babelrc` ，如果不存在会在父级目录寻找，直到找到 `.babelrc`  或者在 `package.json` 中包含 `"babel": {/* babel config */}`，使用 `"babelrc": false` 可以阻止这个行为。

## 命令行工具

### 安装

命令行工具可以对指定文件进行编译，你可以全局安装，但安装在本地更好一些，因为这样可以在不同的项目中使用不同版本的 babel，且不容易出现依赖冲突。

可以使用下面命令安装，命令行工具：

```sh
$ npm install --save-dev babel-cli
```

具体使用方法参考 [http://babeljs.io/docs/usage/cli/](http://babeljs.io/docs/usage/cli/)


## Polyfill

为了能够使用 `Promise` 或 `Array.from` 这样的 ES2015 中的 API，需要包含 `babel-polyfill`，使用了它以后就会有一个完全的 ES2015 的环境，这也会修改原生的方法，比如扩展 `Array.prototype`，你也可以只引入那些你用到的方法的 polyfill，这个时候可能需要使用到这个 [https://github.com/zloirock/core-js](https://github.com/zloirock/core-js)。

`babel-polyfill` 的使用方法很简单，直接引入就好了：

```js
require("babel-polyfill");
```

在浏览器中使用的时候可以引入 `babel-polyfill` 中的 `dist/polyfill.js`。


## Require Hook

另外一个使用 babel 的方法是通过 require hook。它会改写 require ，在 require 的时候自动编译文件。

### 安装

```sh
$ npm install babel-register
```

### 用法

在代码最前面引入 `babel-register`:

```js
require("babel-register");
```

**注意：**

你需要手动地引入使用到的 `polyfill`，另外默认所有引用自 `node_modules` 中的代码都会被转换，你可以通过以下代码来改变这一特性：

```js
require("babel-register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: false
});
```

更加详细的配置可以参见：[Specifying options](http://babeljs.io/docs/usage/require/#specifying-options)

## API

要在 Node 中调用 babel 的 API，需要引用 `babel-core` 这个模块

```js
var babel = require("babel-core");
babel.transform(code, options) // => { code, map, ast }
```

在这个模块上有一下几个 API：

- `babel.transform(code: string, options?: Object)`
- `babel.transformFile(filename: string, options?: Object, callback: Function)`
- `babel.transformFileSync(filename: string, options?: Object)`
- `babel.transformFromAst(ast: Object, code?: string, options?: Object)`

具体用法参见：[API](http://babeljs.io/docs/usage/api/)


## Plugins

作为一个编译器，babel 转换代码的过程可以分为三个阶段：parsing -> transforming -> generation。默认 babel 不对代码最任何转变，你需要给它添加一些插件，这样他才能工作起来。这些插件则工作于 transforming 阶段，它们会对代码进行一些转变。

### Presets

一个插件通常只完成特定的功能，比如仅仅完成箭头函数的转换，但是为了完成特定工作，需要使用一组插件，这个时候可以使用 presets， presets 是一组插件的集合，比如 `babel-preset-react` 就包含下列插件：

- syntax-flow
- syntax-jsx
- transform-flow-strip-types
- transform-react-jsx
- transform-react-display-name

你可以组合一组插件来得到你需要的 preset，在这里 [https://babeljs.io/docs/plugins/#transform-plugins](https://babeljs.io/docs/plugins/#transform-plugins) 列举了一些有用的插件。

### Plugin/Preset 路径

如果插件是一个 npm 模块，可以直接像下面这样配置插件：

`"plugins": ["babel-plugin-myPlugin"]`

或者使用相对路径：

`"plugins": ["./node_modules/asdf/plugin"]`

如果插件或者 preset 是以 `babel-plugin-` 和 `babel-preset-` 开头的，那么在引用的时候可以省去这部分：

```
"presets": ["babel-preset-myPreset"]

// 可以简写为:
"presets": ["myPreset"]
```

### Plugin/Preset 顺序

对于 AST（抽象语法树）中的同一个节点，可能会有多个插件要访问，那么他们的顺序是如何安排的呢？有如下规则：

- plugins 在 presets 之前执行
- plugins 的顺序是顺序执行
- presets 是逆序执行

```js
"plugins": [
  "transform-decorators-legacy", // will run first
  "transform-class-properties" // will run second
]

"presets": [
  "es2015", // will run third
  "react", // will run second
  "stage-2" // will run first
]
```

### Plugin/Preset 选项

```js
{
  "plugins": [
    ["transform-async-to-module-method", {
      "module": "bluebird",
      "method": "coroutine"
    }]
  ]
}

// notice the wrapping array around the preset and option

{
  "presets": [
    ["es2015", { "loose": true, "modules": false }]
  ]
}
```

### 开发插件

可以参考 [babel-handbook](https://github.com/thejameskyle/babel-handbook/blob/master/translations/en/user-handbook.md#making-your-own-preset)
