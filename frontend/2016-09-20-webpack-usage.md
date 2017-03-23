---
layout: post
title: webpack 相关知识
category: 前端开发者笔记
tag:
  - 前端工具
  - webpack
---

* toc
{:toc}

## webpack 简介

早期的 web 开发方式是将脚本使用 `script` 标签引入到 html 文档中，代码中常常会假设已经存在一个全局变量，比如使用 `underscore` 的时候就会假设全局变量 `_` 是存在的，这不利于维护资源的依赖关系，且这还涉及到资源引入的先后顺序，`script` 标签先后顺序也很重要。随着 web 应用复杂度的提升，项目依赖的很多第三方库、组件会很多，管理依赖变成一件很复杂的事情。

webpack 是一个前端打包工具，它能够收集项目的依赖，并将各个分立的资源打包在一起。这里的资源不仅限于 JavaScript 脚本，还可以是 css、图片 等。

## 安装

通常建议将 webpack 安装在本地（也就是安装在项目中）：

```bash
$ npm install webpack --save-dev
```

安装完成后你可以通过 `node_modules/.bin/webpack` 使用 webpack，也可以使用 `npm script` 来运行 webpack，`npm script` 会在 `node_modules` 的 `.bin` 目录下去寻找可执行文件，因此，可以在 `package.json` 中配置以下 `script`：

```js
"scripts": {
    "build": "webpack --config webpack.config.js"
}
```

### 配置文件

```javascript
module.exports = {
  // 指定入口
    entry: './main.js',
    // 指定打包结果
    output: {
        filename: 'bundle.js'
    }
};
```



### 调用 webpack
- webpack 开发环境下编译
- webpack -p 产品编译及压缩
- webpack --watch 开发环境下持续的监听文件变动来进行编译(非常快!)
- webpack -d 引入 source maps

### 编译 JavaScript

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js', // 入口文件
  output: {
    filename: 'bundle.js' // 打包输出的文件
  },
  module: {
    loaders: [
      {
        test: /\.coffee$/,  // test 去判断是否为.coffee的文件,是的话就是进行coffee编译
        loader: 'coffee-loader'
      },
      {
        test: /\.js$/, // test 去判断是否为.js,是的话就是进行es6和jsx的编译
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};
```

如果希望在使用 require 的时候省略后缀名，可以添加 `resolve.extensions` 配置项：

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader' },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },
  resolve: {
    // 现在你require文件的时候可以直接使用require('file')，不用使用require('file.coffee')
    extensions: ['', '.js', '.json', '.coffee']
  }
};
```

### 加载 CSS 和 图片

```javascript
// webpack.config.js
module.exports = {
  entry: './main.js',
  output: {
    path: './build', // 图片和js会放在这
    publicPath: 'http://mycdn.com/', // 这里用来生成图片的地址
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // 用!去链式调用loader
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'} // 内联的base64的图片地址，图片要小于8k，直接的url的地址则不解析
    ]
  }
};
```

### 功能标示

项目中有些代码只是为了在开发时候便于调试，因此我们可以使用一个标示来在不同的环境下执行不同的代码：

```javascript
if (__DEV__) {
    console.warn('Extra logging');
}
// ...
if (__PRERELEASE__) {
    showSecretFeature();
}
```

需要在 webpack 的配置文件中配置这些变量：

```javascript
// webpack.config.js

// definePlugin 会把定义的string 变量插入到Js代码中。
var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [definePlugin]
};
```

### 多文件入口

```javascript
// webpack.config.js
module.exports = {
  entry: {
    Profile: './profile.js',
    Feed: './feed.js'
  },
  output: {
    path: 'build',
    filename: '[name].js' // name是基于上边entry中定义的key
  }
};
```

### 优化通用代码

```javascript
// webpack.config.js

var webpack = require('webpack');

var commonsPlugin =
  new webpack.optimize.CommonsChunkPlugin('common.js'); // 引入插件

module.exports = {
  entry: {
    Profile: './profile.js',
    Feed: './feed.js'
  },
  output: {
    path: 'build',
    filename: '[name].js' // 为上面entry的key值
  },
  plugins: [commonsPlugin]
};
```


## loader order

文件被读入文件系统之后，各种 loader 会按下列顺序执行：
1. 配置文件中的 preloaders
2. 配置文件中的 loaders
3. 加载指令中的 loader (比如： require('raw!./file.js'))
4. 配置文件中的 postLoaders

你可以通过在加载指令中通过下列方式改变以上默认行为。

在指令前面加上 `!` 会禁用 preLoaders

```js
require("!raw!./script.coffee")
```

添加 `!!` 会禁用配置文件中的所有 loader

```js
require("!!raw!./script.coffee")
```

添加 `-!` 会禁用 preLoaders 和 loaders 但不会禁用 postLoaders

```js
require("-!raw!./script.coffee")
```

## webpack 的几个重要概念

理解了这几个 webpack 的几个重要概念，将有助于更快地掌握 webpack 的使用。


### 1. entry

webpack 构建了你整个项目的依赖树，entry 用来指定打包的起始节点，webpack 会从这个节点出发将所有依赖的模块打包进来。可以指定一个或多个 entry，具体配置方法如下：


#### 配置 entry

**单一入口**

```js
const config = {
  entry: './entry/file.js'
};
```

`entry` 为一个字符串，指定了单一的入口。

**多入口**

如果需要指定多个入口，可以按下面这样配置：

```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```

这里指定了两个入口，这里的 `app` 和 `vendors` 作为入口的名字，在配置 output 的时候可以用到。


#### 案例

**将框架代码和业务代码分开打包**

```js
const config = {
  entry: {
    app: './src/app.js',
    vendors: './lib/vendors.js'
  }
};
```

假设 `app` 中引用了 `vendors`，这个时候打包后，app 中依旧包含了 vendors 中的代码，为此，需要使用 [`CommonsChunkPlugin`](https://github.com/webpack/docs/wiki/list-of-plugins#commonschunkplugin) 这个插件。来去除掉 app 中存在于 `vendors` 中的代码。使用了这个插件之后，会得到一个 commom 模块，vendors 模块中只有一句话，就是引用这个 common 模块。这种情况，可以配置 CommonsChunkPlugin 插件，让它得到的 common 模块的命名和 vendors 一样，这样就把 vendors 覆盖了。

**多页应用**

假如有 3 个页面，他们都应用了其中一个库，由于是单页应用，每次跳转都会刷新页面，重新加载脚本，因此可以将三个页面公用的类库打包为单个文件，这样其他页面可以利用前一个页面缓存下来的类库。同样的这个时候，也需要使用到 [`CommonsChunkPlugin`](https://github.com/webpack/docs/wiki/list-of-plugins#commonschunkplugin) 这个插件。



### 2. output

将所有的模块和资源打包完成后，总需要一个地方来放置它，output 就是做这个事情的，它指定了打包后的文件放置的位置，以及命名等信息。

可以简单地配置输出文件的路径：

```js
const config = {
  output: 'bundle.js'
};
```

当通常都需要更多的配置，output 提供了很多可选的配置，其中涉及到文件命名，source map，jsonp，以及打包为 library 等诸多选项，可以在 [这里](https://webpack.js.org/concepts/output/) 看来 output 各项配置的含义。



### 3. loader

webpack 将所有的资源（css, js, image 等）都看做模块，但是 webpack 能处理的只是 JavaScript，因此，需要存在一个能将其他资源转换为模块，让 webpack 能将其加入依赖树中的东西，它就是 loader。在 webpack 的配置文件中，配置一个 loader 的代码如下（这里使用了 2.0 版本的 webpack 的配置方式）：

```js
rules: [
    {
        test: /\.(js|jsx)$/,
        use: 'babel-loader'
    }
]
```

`test` 说明了当前 loader 能处理那些类型的文件，`use` 则指定了 loader 的类型。


### 4. plugins

loader 只能针对某种特定类型的文件进行处理，而 plugin 的功能则更为强大。在 plugin 中能够介入到整个 webpack 编译的生命周期。配置 plugin 的方式如下：

```js
plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({template: './src/index.html'})
]
```

webpack 自身已经提供了一些很有用的 [plugin](https://webpack.js.org/plugins)。



### 5. module

webpack 将一切资源看做是一个个模块，然后将其加入依赖树中。那么那些东西会被当做模块呢？如下：

- ES2015 `import`
- commonjs `require()`
- AMD `define` 与 `require`
- css/scss/less 中的 `@import`
- 存在于样式表中的 `url()` 或 html 中的 `<img src=...>` 的图片
