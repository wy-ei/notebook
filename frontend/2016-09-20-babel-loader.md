---
layout: post
title: webpack 插件 —— babel-loader
category: 前端开发者笔记
tag:
  - 前端工具
  - webpack
---

* toc
{:toc}


> Babel 是一个为新一代 JavaScript 而生的编译器。

babel-loader 时 webpack 的一个插件，它使用 [Babel](https://github.com/babel/babel) 和 [webpack](https://github.com/webpack/webpack) 来转换 JavaScript 代码。

## 安装

``` bash
npm install babel-loader babel-core babel-preset-es2015 --save-dev
```

**注意:** 自 3.0版本起 [npm](https://npmjs.com) 移除了 [自动安装 peerDependencies](https://github.com/npm/npm/issues/6565) 的功能，因此 peer dependencies 比如 babel-core 和 webpack 需要提前安装好。

## 用法

[webpack 关于 loader 的文档](http://webpack.github.io/docs/using-loaders.html)

在你的 webpack 配置文件中，你需要将 babel-loader 添加至 modules 列表中，像下面这样：

``` javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 写为 'babel-loader' 也可以，他们都引用到同一个东西
      query: {
        presets: ['es2015']
      }
    }
  ]
}
```

### 选项

参见 `babel` [选项](http://babeljs.io/docs/usage/options/).

你可以通过把选项写成 [query string](https://github.com/webpack/loader-utils) 的形式给 loader 传入选项：

``` javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel?presets[]=es2015'
    }
  ]
}
```

或者使用一个 query 属性:

``` javascript
module: {
  loaders: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }
  ]
}
```

这个 loader 也支持下面一些特有的选项：

- `cacheDirectory`：默认为 `false`。当设置为 `true` 的时候，给定目录的转换结果会被缓存下来。后面 webpack 在构建的时候会尝试从 cache 中读取，这可以避免在每次构建的时候都运行昂贵的 Babel 重新编译过程。如果这个值是空白的 (`loader: 'babel-loader?cacheDirectory'`) loader 会使用默认的系统临时文件目录。
- `cacheIdentifier`：默认是 `babel-core` 的版本号和 `babel-loader` 的版本号，`.babelrc` 和环境变量 `BABEL_ENV`（如果不存在就使用 `NODE_ENV`）组合起来得到的一个字符串。你可以通过修改这个值，强制让之前的缓存失效。

**注意:**

- `sourceMap` 选项会被忽略，当 webpack 通过 `devtool` 配置后 sourceMaps 就自动支持了。

## 常见错误解析

### babel-loader 很慢!

确保你只转换了少量的文件。因为你很可能使用 `/\.js$/` 来进行匹配，你可能将 `node_modules` 中的文件或者其他不想被转换的文件也转换了。

为了排除 `node_modules`，在 loader 的配置中使用 `exclude`，可以参见上面示例。

你也可以通过使用  `cacheDirectory` 来将 babel-loader 的速度提升二倍以上。这会将转换结果缓存在文件系统里。

### babel 会在每个文件中注入帮助函数，这会使我的代码体积膨胀

babel 使用很小的帮组函数作为通用函数，比如 `_extend`。默认情况下，这会添加到每一个需要它们的文件中。

你也可以使用 babel runtime 作为一个单独的模块来避免重复。

下面的配置禁用了自动为每个文件注入 runtime 函数，而是使用 `babel-plugin-transform-runtime` 来让所有的帮助函数公用它。

参看 [文档](http://babeljs.io/docs/plugins/transform-runtime/) 了解更多。

**注意:** 你必须运行 `npm install babel-plugin-transform-runtime --save-dev` 来将 `babel-runtime` 包含在你的项目中，它同时还依赖 `npm install babel-runtime --save`.

``` javascript
loaders: [
  // 'transform-runtime' 插件告诉 babel 使用 runtime 而不是内联它们
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: ['es2015'],
      plugins: ['transform-runtime']
    }
  }
]
```

### 使用 `cacheDirectory` 遇到 ENOENT 错误

如果在使用 cacheDirectory 的时候遇到类似下面这样的错误：

```
ERROR in ./frontend/src/main.js
Module build failed: Error: ENOENT, open 'true/350c59cae6b7bce3bb58c8240147581bfdc9cccc.json.gzip'
 @ multi app
```

(注意文件路径中的 `true/`)

这意味着你的配置有误，你可能做了下面这样的配置：

``` javascript
loaders: [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel?cacheDirectory=true'
  }
]
```

这不是将它设置为布尔值的正确的方法，你应该这样做：

``` javascript
loaders: [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel?cacheDirectory'
  }
]
```

或者使用 [query](https://webpack.github.io/docs/using-loaders.html#query-parameters) 属性:

``` javascript
loaders: [
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      cacheDirectory: true
    }
  }
]
```

## 自定义 polyfills (比如： Promise 库)

因为 Babel 包含一个含有 [regenerator runtime](https://github.com/facebook/regenerator/blob/master/runtime.js) 和 [core.js](https://github.com/zloirock/core-js) 的 polyfill，下面使用 `webpack.ProvidePlugin` 的用法将不会工作：

``` javascript
// ...
new webpack.ProvidePlugin({
    'Promise': 'bluebird'
}),
// ...
```

下面的方法同样不能工作:

``` javascript
require('babel-runtime/core-js/promise').default = require('bluebird');

var promise = new Promise;
```

这会得到 (使用 `runtime`):

``` javascript
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

require('babel-runtime/core-js/promise')['default'] = require('bluebird');

var promise = new _Promise();
```

之前的 `Promise` 库在它被重写之前被引用了。

一个可行的方法是在你的应用中包含一个 “启动” 阶段，这会在你的应用代码执行之前重写你需要改写的变量。

``` javascript
// bootstrap.js

require('babel-runtime/core-js/promise').default = require('bluebird');

// ...

require('./app');
```
