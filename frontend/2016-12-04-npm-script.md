---
layout: post
title: npm script 用法详解
category: 前端开发者笔记
tag:
  - 前端工具
  - NPM
---

* toc
{:toc}


## 什么是 npm script

npm script 是记录在 `package.json` 中的 `scripts` 字段中的一些自定义脚本，使用自定义脚本，用户可以将一些项目中常用的命令行记录在 `package.json` 不需要每次都要敲一遍。

必须开发者常常需要使用以下命令来统计项目中的代码行数：

```sh
find src -name "*.js" | xargs cat | wc -l
```

开发者可以将其写入 `package.json` 中：

```json
"scripts":{
    "lines": "find src -name \"*.js\" | xargs cat | wc -l",
}
```

以后开发者只需要执行 `npm run lines` 就可以了，而不需要再去写那么长的命令行，这可以大幅提高效率。需要注意的是，因为命令是写在 json 文件中的，有些特字符需要进行转译，比如上面的双引号。

## 环境变量 `PATH`

npm scripts 不是简简单单地执行 shell 语句而已，在执行之前它会将 `node_modules/.bin/` 加入到环境变量 `PATH` 中，所以在 npm scripts 中可以直接使用那些存在于 `node_modules/.bin/` 中的可执行文件。

很多使用 mocha 作为测试框架的项目中都有这么一个 npm script

```js
"scripts":{
    "test": "mocha"
}
```

mocha 并没有全局安装，它的命令行工具存在于 `node_modules/.bin/` 中，之所以能够访问到它，正是因为 npm 背后的这一操作才使得这样的命令能够正常执行，在 npm script 执行完成后，会从 `PATH` 中移除。

在执行 `npm run test` (后面会看到这可以简写为 `npm test`) 的时候就等同于：

```sh
./node_modules/.bin/mocha
```


## 传入参数

对于上面的脚本 `"test": "mocha"` 如果希望给 mocha 传入一些选项，比如希望执行：

```sh
mocha --reporter spec
```

需要这样执行 npm test：

```sh
npm test -- --reporter spec
```

需要使用两个短线将选项隔开，或者将选项直接写在 `package.json` 中：

```js
"scripts":{
    "test": "mocha --reporter spec"
}
```

在 shell 中传入的参数都要使用 `--` 隔开，这个 `--` 被视作 npm run 命令参数的结束，`--` 后面的内容都会原封不动地传给运行的命令。

## 钩子脚本

在 npm script 中存在两个钩子，`pre` 和 `post`，就拿上面的 lines 脚本来说，它的钩子脚本就是 `prelines` 和 `postlines`

```
"scripts":{
    "prelines": "node prelines.js"
    "lines": "find src -name \"*.js\" | xargs cat | wc -l",
    "postlines": "node postlines"
}
```

执行 `npm run lines`，会先执行 `prelines` 再执行 `lines` 之后再执行 `postlines`。

## 生命周期事件

还有一些 script 会在模块安装，发布，卸载等不同的生命周期被执行。

- prepublish, publish, postpublish：发布模块
- preinstall, install, postinstall：安装模块
- preuninstall, uninstall, postuninstall：卸载模块
- preversion, version, postversion：在使用 npm version 修改版本号的时候执行
- pretest, test, posttest：执行 `npm test` 的时候
- prestop, stop, poststop：执行 `npm stop` 的时候
- prestart, start, poststart：执行 `npm start` 的时候
- prerestart, restart, postrestart：执行 `npm restart` 的时候

这些 script 会在不同的时刻自动被执行，这也是为什么 `npm run test` 可以简写为 `npm test` 的原因了，在执行 `npm test` 的时候会以次执行 `pretest`、`test` 和 `posttest`，当然了，如果没有指定 `pretest` 和 `posttest`，会默默地跳过。


还有 `npm restart` 这个命令比较叼，它不单单执行 `prerestart`, `restart`, `postrestart` 这三个，而是按下面的顺序来执行：

1. prerestart
1. prestop
1. stop
1. poststop
1. restart
1. prestart
1. start
1. poststart
1. postrestart


## 环境变量

在执行 npm script 的时候还可以访问到一些特殊的环境变量，通过 `process.env.npm_package_xxx` 可以获得到 `package.json` 中的内容。比如 `process.env.npm_package_name` 可以获得到 `package.json` 中 `name` 的值 `"sv"`。

```
{
  "name": "sv",
  "version": "1.3.0",
  "description": "",
  "main": "index.js",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@gitlab.com/wy-ei/sv.git"
  }
}
```
通过 `process.env.npm_package_repository_type` 可以拿到值 `"git"`。

另外可以通过 `process.env.npm_config_xxx` 来拿到 npm config 中的值。比如通过 `process.env.npm_config_user_email` 可以拿到 `user.email` 的值。


还有一个比较特殊的环境变量 `process.env.npm_lifecycle_event` 在执行不同的 npm script 的时候这个值是不同的，比如执行 `npm run build` 的时候，这个值为 `build`，通过判断这个变量，将一个脚本使用在不同的 npm script 中。

使用任何脚本语言编写的 npm script 都可以拿到环境变量，比如在 shell 中要想拿到只需要使用 `$npm_config_user_email` 就好了。不同的脚本需要使用其自身获取环境变量的方法来读取环境变。

另外，这些环境变量只能在执行 npm script 的时候拿到，正常执行的 node 脚本是获取不到的。

## 编写 node 命令行工具

在 npm script 常常用到一些模块中的可执行程序，比如 eslint，webpack 等，那么要如何来自己编写一个命令行工具能，让它可以在 npm script 中被调用。

### 1. 编写命令行脚本

新建文件 `cli.js`，写入需要的逻辑。

```js
console.log("This article is Awesome, isn't it?");
```

### 2. 在 `package.json` 的 bin 字段中指定命令行文件名称和路径

```js
{
    "bin": {
        "cli": "./cli.js"
    }
}
```

### 3. 指定解释器

当用户安装以后，通过 `./node_modules/.bin/cli` 执行，会报错，原因是目前 shell 不知道使用什么解释器来执行这些代码，为此需要在脚本上方指定解释器。

```js
!usr/bin/env node
console.log("This article is Awesome, isn't it?");
```

上面这一行在所有脚本文件中都可以看到，它叫做 SheBang 或者 HashBang，详见 [Shebang_(Unix)](https://en.wikipedia.org/wiki/Shebang_(Unix))，这行代码是告诉 shell 使用何种解释器来执行代码。`usr/bin/env` 是一个程序，`usr/bin/env node` 会找到当前 PATH 中的 node 来解释后面的代码。

有了这三步，就开发出了一个 node 的命令行工具。当用户安装这个模块的时候，npm 会在 `node_modules/.bin/` 中创建文件，名为 `package.json` 中的 bin 指定的命令名，并链接至对应的脚本。此后就可以在 npm script 中使用它了。


多说两句，将上面的 `#!usr/bin/env node` 写入 JavaScript 文件第一行，不会报错。因为这是一个 UNIX 世界都认识的东西。通过 `chmod +x cli.js`，你可以使用 `./cli.js` 直接执行它，因为这一行已经告诉 shell 使用 node 来执行它了。


# 总结

早在今年 3 月，在网上看到很多帖子，涌现出一个观点，要使用 npm script 来代替 gulp 这样的构建工具，如今看到 npm script 的功能确实强大，利用 node 和 shell 我们能够写出一些很实用的脚本，来解决手头的问题，并不一定需要利用 gulp，grunt 这样的东西。据统计，在 2015 年 gulp 以绝对的优势占据着 task runner 使用率第一的位置，而在 2016 年 npm script 的使用率提升的非常快。

无论如何，npm script 总是会出现在你每天的工作中，愿本文能助你搞懂 npm script，让 npm script 帮助你加快开发效率。
