---
layout: post
title: 前端测试工具 Karma
category: 前端开发者笔记
tag:
  - 前端工具
  - 测试工具
---

* toc
{:toc}

Karma 是一个 test runner 可以和很多测试框架结合使用，Karma 可以打开配置的浏览器，在浏览器中运行测试用例，并将结果展现在控制台中。

很长一段时间，前端缺乏测试环境，人们写完代码后要打开浏览器，等待页面加载完成，有时候还要打开控制台，审查特定的元素来检验代码是否写的正确。这是一个很耗时的过程，而且在一个浏览器中工作正常不代表能够在其他浏览器中正常工作。

虽然可以使用 Node.js 这样的环境来运行 JavaScript 代码，但是缺少浏览器 DOM 和 Web API 的支持，在 Node.js 中只能测试 JavaScript 的逻辑是否正确。有的代码必须要在浏览器中运行才能分辨是否正确，且不同浏览器可能会有不同的表现。

Karma 的出现旨在帮助开发者走出困境，让开发者能够快速地在真实的环境中进行测试。开发者可以通过命令行来启动 Karma，Karma 运行测试，而后将结果打印到控制台中，开发者不需要进行编辑器到浏览器的切换，能够极大地提升开发速度。

## 整体架构

karma 的整体架构如下：

![](http://7xs1gu.com1.z0.glb.clouddn.com/17-2-7/9640376-file_1486469033579_d3a4.png)

### Server

- Manager：Server 端的 Manager 负责完成和客户端的双向通信，告诉客户端启动测试或者接收从客户端传来的测试结果。
- Web Server：负责给客户端提供静态资源服务。这静态资源包括测试框架，测试代码，和需要被测试的代码。
- Reporter：负责将测试结果告知给开发者。通常是将结果打印到控制台上，或者存入文件中。
- File System Watcher：负责维护所有测试和被测试文件，观察文件变动，当文件改变后，需要重新加载这部分文件。

### Client

Client 是真正运行测试代码的地方，通常是一个浏览器，可以是本机的浏览器，也可以是其他手持设备，服务端和客户端通过 HTTP 进行通信。

- Manager：负责和服务端进行双向的通信。接受服务端指令，向服务端发送测试结果。
- Testing Framework：这个可以是任意的测试框架，Karma 并不限制使用哪个测试框架。
- Tests and Code under Test：所有测试代码和被测试代码。

## 使用方法

### 安装


在项目中安装：

```sh
$ npm install karma --save-dev
```

安装在项目中后，需要从 node_modules 中运行：`./node_modules/karma/bin/karma start`。

全局安装命令行工具后，你就可以在任何地方运行 karma，karma 会去寻找本地的 karma 并执行，安装方式如下：

```sh
$ npm install -g karma-cli
```

### 生成配置文件

karma 需要一个配置文件才能工作，可以执行以下命令，交互式地回答问题来自动生成配置文件。

```
$ karma init karma.conf.js

Which testing framework do you want to use ?
Press tab to list possible options. Enter to move to the next question.
> jasmine

Do you want to use Require.js ?
This will add Require.js plugin.
Press tab to list possible options. Enter to move to the next question.
> no

Do you want to capture any browsers automatically ?
Press tab to list possible options. Enter empty string to move to the next question.
> Chrome
>

What is the location of your source and test files ?
You can use glob patterns, eg. "js/*.js" or "test/**/*Spec.js".
Enter empty string to move to the next question.
> test/**/*.js
>

Should any of the files included by the previous patterns be excluded ?
You can use glob patterns, eg. "**/*.swp".
Enter empty string to move to the next question.
>

Do you want Karma to watch all the files and run the tests on change ?
Press tab to list possible options.
> yes
```

完成交互式问题后，会生成 karma 的配置文件：

```js
module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    // 决定 files 字段中的路径的基础路径
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    // 使用的测试框架
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    // 需要被包含至浏览器中的文件
    files: [
      'test/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // 需要自动启动的浏览器，需要按照 karma-chrome-launcher 包
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
```

关于配置项的意义可以参见[这里](http://karma-runner.github.io/1.0/config/configuration-file.html)。

### 配置文件中特殊字段说明：

#### files

files 字段中描述了那些文件要被 karma 包含至浏览器中，那些需要被监视变动。files 中的内容可以有多种形式，一个包含所有形式的例子如下：

```js
files: [

  // Detailed pattern to include a file. Similarly other options can be used
  { pattern: 'lib/angular.js', watched: false },
  // Prefer to have watched false for library files. No need to watch them for changes

  // simple pattern to load the needed testfiles
  // equal to {pattern: 'test/unit/*.spec.js', watched: true, served: true, included: true}
  'test/unit/*.spec.js',

  // this file gets served but will be ignored by the watcher
  // note if html2js preprocessor is active, reference as `window.__html__['compiled/index.html']`
  {pattern: 'compiled/index.html', watched: false},

  // this file only gets watched and is otherwise ignored
  {pattern: 'app/index.html', included: false, served: false},

  // this file will be served on demand from disk and will be ignored by the watcher
  {pattern: 'compiled/app.js.map', included: false, served: true, watched: false, nocache: true}
],
```

files 中项可以是包含下列属性的对象：

- pattern：一个 glob 字符串，用来匹配文件
- watched：是否监听文件变动，默认是 true
- included：是否使用 script 标签包含至浏览器中，默认为 true
- served：karma 的 WebServer 是否要 server 该文件，默认为 true
- nocache：是否每次都从磁盘中读取，默认是 false

也可以是字符串，如果是字符串，那么字符串回事 pattern 的值，其他属性都为默认值。

files 中匹配的文件会如果 `included` 为 true，它们会依照顺序被包含至浏览器中，对于某些测试环境，需要使用一些基础库才能运行，那么就需要在 files 中优先包含这些库：

```js
files: [
  // 首先包含 angular，否则后面的测试用例无法运行
  { pattern: 'lib/angular.js', watched: false },
  'test/unit/*.spec.js',
}
```

#### frameworks

frameworks 字段用来指定你需要使用什么测试框架，可以是 `['jasmine']`, `['mocha']` 等，使用某个测试框架后，还需要安装对于的插件，比如使用了 jasmine 作为测试框架：

```
$ npm i karma-jasmine -save-dev
```

#### Preprocessors

Preprocessors 用来指定文件预处理器，比如转换 es6 的代码至 es6，编译 TypeScript 至 JavaScript。配置方法如下：

```js
preprocessors: {
  '**/*.coffee': ['coffee'],
  '**/*.ts': ['typescript']
}
```

使用 preprocessor 同样需要安装插件，有的预处理器还需要额外的配置。比如使用 webpack 作为预处理器：

```js
preprocessors: {
 '**/*.js': ['webpack']
}
```

配置 webpack：

```js
webpack: require('./webpack.config.js')
```

还需要安装支持 webpack 的插件：

```
$ npm i karma-webpack --save-dev
```

### 编写测试用例

使用对应测试框架的语法来写测试用例就好了，比如这里使用 jasmine 作为测试框架：


```js
describe('RGBA strings', () => {
  it('should convert rgba(x, y, z, a)', () => {
    var colorFromString = processColor('rgba(10, 20, 30, 0.4)');
    var expectedInt = 0x660A141E;
    expect(colorFromString).toEqual(expectedInt);
  });
});
```

你可以搭配其他的断言库或其他辅助库来使用，这就是测试框架层面的事情了。

### 运行测试用例

当项目根目录运行 `karma start`，不出意外就能自动打开浏览器运行测试，并把测试结果显示到控制台上。karma 在启动的时候会寻找配置文件，寻找的路径依次是：

- `./karma.conf.js`
- `./karma.conf.coffee`
- `./karma.conf.ts`
- `./.config/karma.conf.js`
- `./.config/karma.conf.coffee`
- `./.config/karma.conf.ts`

如果你的配置文件不在以上列表中，可以手动指定：

```sh
karma start karma.config.js
```

如果没能打开浏览器，要检查一下是否安装了对应的 launcher。
