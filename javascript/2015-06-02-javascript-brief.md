---
layout: post
title: JavaScript 简介
category: JavaScript
---

## JavaScript 极简史

JavaScript 诞生于1995 年，当时JavaScript 作为一种客户端语言，主要用来进行表单验证等工作，因为当时的网速较慢，当用户向服务器提交信息的时候如果能在浏览器中对将要提交的数据进行一个初步的检验，这就不至于用户等待几十秒之后收到服务器发来的**邮件格式错误**这样的情况了。

当时 NetScape 要为自家 NetScape Navigator开发一中语言，起初命名为LiveScript但是在发布前夕，因为当时 Sun 公司的 Java 语言很火，所以NetScape临时将LiveScript改名为JavaScript。但其实它和Java没什么关系。

后来微软在自家的IE浏览器中也引入了脚本，涉及版权问题取名为JScript，后来两个主流浏览器不断的根据自己的想法添加新特性，这导致两种浏览器不能够相互兼容，开发人员不得不针对两种浏览器编写不同的代码。后来ECMA (指欧洲计算机制造商协会) 组织来自Sun、微软、NetScape等公司的开发人员对JavaScript语言进行了规范。

## JavaScript的组成

人们常说的 JavaScript 一般是指下面三个部分组成

+ 语言核心(ECMAScript)
+ 文档对象模型(DOM)
+ 浏览器对象模型(BOM)

### 语言核心(ECMAScript)

ECMA定义的ECMAScript与现在JavaScript的宿主没有关系，它只定义了语言的基础，在这个基础上可定义更加完善的功能，所以Web浏览器只是 ECMAScript 的一个可能的宿主之一。

ECMAScript定义了下面内容：

+ 语法
+ 类型
+ 语句
+ 关键字
+ 保留字
+ 操作符
+ 对象

ECMAScript 也经历了下面这些版本的变迁：

+ ECMAScript 第 1 版基本上等同于1997年NetScape提交给ECMA 的JavaScript，只是做了较小的更改。
+ ECMAScript 第 2 版就是对上一版整理加工的结果，没有做什么变化
+ ECMAScript 第 3 版对语言增加了正则表达式、字符串处理、异常处理等特性
+ ECMAScript 第 4 版对语言做了全面的改变，但是由于变化太大没有被接纳。ECMA中另外一个小组，提出了3.1版，只是进行了小幅度的改变，最终3.1版成为第五版

### 文档对象模型(DOM)

DOM 是一个应用程序接口，它把整个页面映射成为一个多层节点树。提供了一些API来操作树中的节点。

+ DOM 1级 在1998年成为标准，核心功能是节点映射。
+ DOM 2级 引入了DOM视图、DOM事件、DOM样式、DOM遍历和范围这些功能。
+ DOM 3级 引入了统一的加载和保存文档的方法。

### 浏览器对象模型(BOM)

浏览器对象中则存在着浏览器的一些属性，还有一些针对浏览器的 JavaScript 的扩展，提供了弹出浏览器窗口，移动缩放关闭浏览器窗口等功能，以及提供当前的页面地址、屏幕等信息。
