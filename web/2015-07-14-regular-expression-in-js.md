---
layout: post
title: Javscript 中的正则表达式
category: JavaScript
---



## 创建正则表达式对象

使用字面量:

```javascript
var pattern = /h...o/g;
```

使用构造函数:

```javascript
var pattern = new RegExp('h...o','g');
```

正则表达式有三个选项:

1. i  --- ingnoreCase
2. g --- globel
3. m --- mutilline


## 正则表达式的方法

### exec

```javascript
var pattern = /(?:..)ll(.)/g;
var str = "hello world";
var match = pattern.exec(str);
// match[0],match[1]...分别表示匹配项和第一个捕获项
```

得到的结果是一个数组，第一个元素是整个匹配内容，之后是各个捕获项，另外还包含几个额外的属性：

- index: 表示匹配项开始于字符串中何处
- input: 表示输入字符串

```javascript
console.log(match.input); // hello world
console.log(match[0]); // hello
console.log(match[1]); // he
console.log(match[2]); // o
```

值得注意的是，有的时候我们实际上是要得到所有的匹配项，但是这里的 match 并不会返回所有的匹配项。正如你所见的，它返回的是一个匹配项的全部信息，
这包括匹配项以及括号中的捕获项目，如果希望获得所有匹配项目，那么就需要再次执行exec方法，当正则表达式的模式设置为 `g` 的时候，再次执行
exec会返回下一个匹配项的信息。但是如果没有设置 `g` 选项，那么它始终会返回第一项。

### test

test 方法常常用在判断一个字符串中是否有所期望的内容的时候，当正则表达式能够得到匹配时候会返回 `true`，否则返回 `false`

每当使用了 test 和 exec 方法后，都会影响正则表达式对象本身，这这有点像是 C++ 里面的类的静态成员。虽然 JavaScript 中没有类的说法。
RegExp.$1 , RegExp.$2 ... RegExp.$9 存储了第一到第九个捕获组。每次执行test和exec方法后，它们就会被改变。

## 正则表达式语法

### 字符集和特殊符号

+ `\w`: 等价于 [a-zA-Z0-9]
+ `\W`: 等价于 [^a-zA-Z0-9]
+ `\s`: 空白符
+ `\S`: 非空白符号
+ `\d`: [0-9]
+ `\D`: [^0-9]
+ `\b`: 匹配 `\w` 和 `\W` 之间的分界。
+ `\B`: 匹配两个 `\w` 或者 两个 `\W` 之间的分界
+ `\cX`: 这里的X是A-Z 匹配ctrl+A 至 ctrl+Z
+ `\0`: 匹配 NUL

关于 `\b` 和 `\B` 再补充说明如下：

```javascript
var str = 'la-la';
var r = /\b-\b/;
console.log(r.exec(str));
// 能匹配到中间的 `-`
// 因为 a 和 `-` 之间存在 `\w` 和 `\W` 之间的分界也就是 `\b`
```


```javascript
var str = 'stack overflow stackoverflow';
var r = /\Bover\B/;
var match = r.exec(str);
// 这里会匹配到单词 stackoverflow 中的 over，因为这个 over 前后存在 `\B`。
```

### 断言

+ `x(?=a)`: x 后面紧跟字母 a  
+ `x(?!abc )`: 负向先行断言，表示后面不跟abc
+ `(?:x)`: 用于分组但不捕获它，通常用在要将多个字符作为一个整体的时候使用圆括号包含，但是又不想它作为捕获项的时候。
