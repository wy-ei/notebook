---
layout: post
title: 伪元素
category: css
---

## 伪元素

+ ::first-line --> 匹配元素的第一行文本
+ ::first-letter --> 匹配元素的第一个字符
+ ::after
+ ::before
+ ::selection --> 选中的文本

**selection 伪元素只接受 color 和 background 属性**



## 属性选择器

关于下面的内容约定如下：**E 代表任意html元素，attr代表元素的属性，val代表属性的值**

+ E[attr]:选择具有该属性的元素，如img[alt] 选择设置了 alt 的 img 元素，也可以写成 `[type]` 选择所有具有 type 属性的元素。
+ E[attr=val]:选择属性值等于val的元素，如`input[type=text]` 选择所以输入类型为 text 的 input 元素
+ E[attr|=val]:选择属性开头单词等于 val 的元素
+ E[attr*=val]:选择属性中含有 val 的元素,如`a[href*=github]` 选择所有url中含有 github 的 a 元素
+ E[attr~=val]:选择属性列表中含有 val 的元素，比如class属性，其中可能含有好几个类名，`div[class~=content]` 会匹配 `<div class='content side'>...</div>`
+ E[attr^=val]:选择属性开头是 val 的元素
+ E[attr$=val]:选择属性以 val 结尾的元素

注意：乍一看好像E[attr^=val] 和 E[attr|=val] 是一样的，其实不然，后者需要属性值开头的单词与 val 匹配，而前者只需要前面的字符串与 val 一致即可 ,比如

```
<img alt='csspseudo' src='pseudo.jpg' />

// img[alt|=css]
// img[alt^=css]

// 这里只有后者匹配，前者不会匹配。

// 但是,如果把 alt 改为 alt='css-pseudo' 那么后者就也可以匹配了，注意前面提到的 E[attr|=val] 要求开头单词匹配。
```

除了IE7及以下浏览器不支持，其他主流浏览器都支持属性选择器。
