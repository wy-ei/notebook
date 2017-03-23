---
layout: post
title: ESLint 基本用法
category: 前端开发者笔记
tag: 前端工具
---

* toc
{:toc}

## ESLint 基本用法

JavaScript 是一门弱类型的语言，且很多开发者使用简单的编辑器来进行开发，这导致在开发过程中很容易出现错误，且不易被察觉。比如单词拼错，少了括号等，在普通的文本编辑器中这些错误是不会被提示的，这不同于在 IDE 中，因此为了避免这类问题，可以使用 ESLint 来对代码进行静态分析，实时地提示开发者代码中存在的问题。ESLint 不仅可以检验代码中潜在的错误，通过配置规则，还可以用 ESLint 来检查代码风格。

## 配置

ESLint 具有高可配置性，这意味着你可以根据需求添加需要的代码检验规则，让它符合你的需求。ESLint 的配置方式可以有以下两种形式：

- 在注释中配置：使用 JavaScript 文件中使用注释包裹配置内容
- 在配置文件中配置：使用单独的文件来进行配置，这个文件可以是 JavaScript, JSON, YAML，文件名为 `.eslintrc.*` （添加文件类型的后缀），或者在 `package.json` 的 `eslintConfig` 字段进行配置，ESLint 会自动地去寻找这些配置文件，你也可以在命令行中指定配置文件。

### 解析器选项

ESLint 默认按照 ES5 的语法来解析，你可以在这里指定期望的 JavaScript 语法版本，在配置文件中可以使用 `parserOptions` 字段来配置：

```js
{
    "parserOptions": {
        "ecmaVersion": 6, // JavaScript 版本，3, 5 (default), 6 (2015), 7 (2016)
        "sourceType": "module", // "script" (default) 或者 "module"，说明你的代码是否是 ECMAScript 模块。
        "ecmaFeatures": { // 其他的一些语法特性的配置
            "jsx": true
        }
    }
}
```

### 解析器

指定语法解析器，ESLint 默认使用 Espree，你也可以指定其他的语法解析器，比如 [babel-eslint](https://npmjs.com/package/babel-eslint)

```js
{
    "parser": "babel-eslint"
}
```

### 环境

不同的环境可能有不同的全局变量，比如使用 amd 环境，就会有 require 和 define 两个函数。这里有详细的可选环境 [Specifying Environments](http://eslint.org/docs/user-guide/configuring#specifying-environments)，常见的环境有：

- `browser`
- `node`
- `es6`
- `commonjs`

```js
{
    "env": {
        "browser": true,
        "node": true
    }
}
```

一个工程中可能有不同的文件会运行在不同的环境下，这个时候可以在文件内使用注释来指定环境 `/* eslint-env node, mocha */`

### 全局变量

如果在代码中使用了了未定义了变量，这通常会出错，但如果明确知道这是一个全局变量，可以在配置文件中指定存在这样一个全局变量。

```js
{
    "globals": {
        "var1": true,
        "var2": false
    }
}
```

也可以在文件注释中配置：`/* global var1:false, var2:false */` ，这里的全局变量后有一个布尔值，如果设置为 `true` 表示该全局变量可以被写，否则该全局变量则是只读的。

### 插件

ESLint 支持使用第三方的插件，这些插件应该是使用 npm 安装的，插件的名字通常形如 `eslint-plugin-xxx`，在配置插件的时候可以忽略 `eslint-plugin-`

```js
{
    "plugins": [
        "plugin1",
        "eslint-plugin-plugin2"
    ]
}
```

### 规则

ESLint 包含大量的规则，你可以选择自己需要的规则进行配置，配置的方式如下：

```js
{
    "rules": {
        "eqeqeq": "off",
        "curly": "error",
        "quotes": ["error", "double"]
    }
}
```

每个规则可以取以下三类值：

- "off" or 0 - 关闭该规则
- "warn" or 1 - 违反该规则的时候给出警告
- "error" or 2 - 违反该规则的时候报错

有时候某个规则可能包含选项，比如代码缩进，你需要指定缩进的空格数，这个参数可以以这种方式传入：`"intend":["error", 4]`，即，使用括号将参数传进去，三个或四个参数依然使用这种方式传入，把参数都放在括号里就好了。

要想重新设置某个插件定义的 rule ，需要按如下方式设置：

```js
{
    "rules": {
        "react/self-closing-comp": 1,
        "react/wrap-multilines": 0
    }
}
```

### 使用注释关闭规则

在代码中可能有某些场景不得不违反某个规则，这个时候可以使用注释来针对性地关闭规则。

**关闭某块代码的检验:**

```js
/* eslint-disable */

alert('foo');

/* eslint-enable */
```

**关闭代码块某些规则的检验**

```js
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```

**彻底关闭对某个文件的检验**

```js
/* eslint-disable */

alert('foo');
```

**关闭对某行代码的检验**

```js
alert('foo'); // eslint-disable-line

// 或者

// eslint-disable-next-line
alert('foo');
```

**定义全局变量**

```js
/* global var2:false, var2:false */

// 这里的 false 表示该变量是只读的
```

### 配置文件的寻找和运用规则

子级的配置文件中的规则最优先，如果父级目录也就 eslint 的配置文件，其规则会追加进来。如果根目录下同时存在 eslintrc 以及 package.json 中的 eslintConfig 字段，会忽略 package.json 中的配置。

如果在 home 目录下存在一个 eslint 的配置文件，那么它只会在项目中没有找到任何配置文件的时候才会被应用。eslint 默认会不断向上寻找 eslintrc 知道根目录，你可以阻止它这么做通过在某个配置文件中写入 `"root": true`。

使用不同方式配置的配置信息有不同的优先级，具体表现为：

行内注释中的配置的优先级 > 通过命令行传入 > 配置文件

### 扩展配置文件

使用 `estends` 字段可以来扩展一些现有的配置文件，比如可以使用开源社区发布的一些可共享的配置文件包。

#### 使用 `"eslint:recommended"`

将 `extends` 字段设置为 `"eslint:recommended"` 就可以使用 ESLint 内置的一些规则，可以在此基础上修改增加自己想要的规则。

```js
module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        // enable additional rules
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // override default options for rules from base configurations
        "comma-dangle": ["error", "always"],
        "no-cond-assign": ["error", "always"],

        // disable rules from base configurations
        "no-console": "off",
    }
}
```

#### 使用可共享的配置

一个可共享的配置就是一个发布在 npm 上的模块，这些模块定义了一系列的 ESLint 的规则，可以根据不同的开发场景选择使用不同的配置包，这些配置包通常命名为 `eslint-config-xxx`，在使用它们的时候可以忽略前缀 `eslint-config-`，比如 `eslint-config-standard` 可以这么用 `"extends": "standard"`。

#### 使用插件中的配置文件

一个 ESLint 插件最终暴露出来的是一个对象，这对象中包含 `configs` 字段，其中包含了一个或多个 eslint 的配置，其内容同 eslintrc 中的内容，详见 [eslint plugins 的文档](http://eslint.org/docs/developer-guide/working-with-plugins#configs-in-plugins)。因此在  extends 字段中也可以使用一个人插件中的配置项，配置方法如下：

```js
{
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"  // "plugin:" + 插件名 + / + 插件中定义的配置名。
    ]
}
```

#### 使用配置文件

`extends` 字段中的内容也可以是一个文件的绝对或者相对路径，这个文件中描述了 eslint 的配置。

### 忽略文件或目录

通过在项目的根目录下添加一个 `.eslintignore` 文件来忽略掉那些不想被 eslint 检查的文件或目录。其忽略方法和 .gitignore 相似。使用了的 [node-ignore](https://github.com/kaelzhang/node-ignore) 的规则，某些特殊的用法可以参考 node-ignore 。

除了 `.eslintignore` 中忽略的文件和目录外，eslint 还默认忽略 `node_modules` 和 `bower_components`

## 命令行

配置好了配置文件后，只需要指定 eslint 检验的文件或者目录就可以了。比如：

```
$ eslint ./src/*.js
```

更加详细的命令行用法可以参见：[command-line-interface](http://eslint.org/docs/user-guide/command-line-interface)

## rules

详细的规则可参见：[rules](http://eslint.org/docs/rules/)
