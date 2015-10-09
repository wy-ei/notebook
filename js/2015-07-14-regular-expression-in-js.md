---
layout: post
title: js中的正则表达式
category: js
tag: RegExp
---


## 创建正则表达式对象

+ 使用字面量

```
var pattern = /h...o/g;
```
+ 还有一种是使用构造函数方式

```
var pattern = new RegExp('h...o','g');
```

正则表达式有三个选项

1. i  ---- ingnoreCase
2. g ---- globel 
3. m --- mutilline


## 正则表达式的方法

### exec

```
var pattern = /(?:..)ll(.)/g;
var str = "hello world";
var match = pattern.exec(str);
```
得到的结果是一个数组，包含了所有匹配项目但是还有几个额外的属性，
index 表示匹配项开始于字符串中何处
input 表示输入字符串
match[0],match[1]...分别表示匹配项和第一个捕获项

```javascript
console.log(match.input); // hello world
console.log(match[0]); // hello
console.log(match[1]); // he
console.log(match[2]); // o
```

值得注意的是，有的时候我们实际上是要得到所有的匹配项，但是这里的match并不会返回所有的匹配项。正如你所见的，它返回的是一个匹配项的全部信息，
这包括匹配项以及括号中的捕获项目，如果希望获得所有匹配项目，那么就需要再次执行exec方法，当正则表达式的模式设置为`g`的时候，再次执行
exec会返回下一个匹配项的信息。但是如果没有设置 `g` 选项，那么它始终会返回第一项。

### test

test 方法常常用在判断一个字符串中是否有所期望的内容的时候，当正则表达式能够得到匹配时候会返回true，否则返回false

每当使用了test和exec方法后，都会影响正则表达式对象本身，这这有点像是C++里面的类的静态成员。虽然JavaScript中没有类的说法。
RegExp.$1 , RegExp.$2 ... RegExp.$9 存储了第一到第九个捕获组。每次执行test和exec方法后，它们就会被改变。

## 补充

(?:x) 有时候我们把进行了分组但是并不想捕获它，那么可以在分组前加上 `?:`,这样他就不会出现在结果中，也不会出现在RegExp.$* 中了。

```javascript
var pattern = /(?:he)..(?:o)/g;
match = pattern.exec(str);
console.log(match.input); // hello world
console.log(match[0]); // hello
console.log(match[1]); // undefined
console.log(match[2]); // undefined
```

x(?=y) 当我们只想要匹配后面跟着一个y的x的时候，可以使用x(?=y)

var str = "hello boy,hello girl";
var pattern = /hello(?=\sgirl)/;
match = pattern.exec(str);
console.log(match[0]);  // hello
console.log(match.index);  // 10

这里我们只匹配了后面跟着girl的的hello

当然`x(?!y)` 这表示匹配后面不跟着y的x。


[\b] 匹配退格键
\0 匹配 NUL
\cX 这里的X是A-Z 匹配ctrl+A 至 ctrl+Z

```javascript
var str1 = 'yesterday is july 13';
var pattern1 = /ter\B/;
console.log(str1.match(pattern1));
```


`\b` :  匹配单词开始或者结尾的空字符串
`\B` : 匹配单词中间的空字符串

```javascript
var str2 = 'la-la';
var pattern2 = /\b-\b/;
console.log(pattern2.exec(str2)[0]);  // - 
```

这里会匹配 `-` 因为 `-` 的前后是单词的开始和结尾，与 `\b` 匹配

```javascript
var str3 = 'stackoverflow over';
var pattern3 = /\Bover\B/;
var match = pattern3.exec(str3);
console.log(match.index);   // 5
console.log(match[0]);  // over
```

这里会匹配单词中的 over 而不是最后结尾的over ，如果想要匹配后面的over 那么就需要使用 `\b`.



## 正则表达式的字符类

+ \w : 等价于 [a-zA-Z0-9]
+ \W : 等价于 [^a-zA-Z0-9]
+ \s : 空白符
+ \S : 非空白符号
+ \d : [0-9]
+ \D : [^0-9]


## 指定匹配位置

+ \b : 匹配单词边界
+ (?=a) : 后面紧跟字母 a  
+ (?!abc ): 负向先行断言，表示后面不跟abc 
+ \b :  匹配单词开始或者结尾的空字符串
+ \B : 匹配非单词边界