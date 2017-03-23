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

### 配置

karma 需要一个配置文件才能工作，可以执行以下命令，交互式地回答问题来自动生成配置文件。

```sh
$ karma init karma.conf.js
```

有了配置文件后，可以运行以下命令启动 karma：

```sh
karma start karma.config.js
```

关于配置项的意义可以参见[这里](http://karma-runner.github.io/1.0/config/configuration-file.html)。

### 插件

karma 可以很轻松地使用插件进行扩展，实际上所有的预处理器、reporter、和浏览器启动器都是以插件的形式存在的。
