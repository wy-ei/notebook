---
layout: post
title: CSS 选择器
category: Web
pid: css 
---


* toc
{:toc}


## 基本选择器

```html
<ul id="list">
    <li class="item active">CSS</li>
    <li class="item">JavaScript</li>
    <li class="item">HTML</li>
</ul>
```

```css
/* 选择所有 li */
li 

/* 选择包含类 item 的元素 */
.item

/* 选择 id 为 list 的元素 */
#list

/* 选择同时有 item 和 active 类的 标签*/
.item.active
```

**根据属性来选择**

```css
/* 选择所有具有 class 属性的 h1 标签 */
h1[class]

/* 选择同时具有 href 和 class 属性的 a 标签 */
a[href][class]

/* 选择所有类型为 text 的 input 标签 */
input[type='text']
```

**属性的匹配方式有多种，举例说明如下：**


```css
/* 选择所有设置了 href 的 a 标签 */
a[href]


/* 选择所有 type 属性为 'text' 的 input 标签 */
input[type=text]


/*
选择 alt 属性以单词 css 开头的 img 标签

<img src="..." alt="css selector">
<img src="..." alt="css-selector">
*/
img[alt|=css]


/*
选择 src 属性中包含字符串 selector 的 img 标签

<img src="/css/selector.jpg" alt="css selector">
*/
img[src*=selector]


/*
选择 class 属性中包含字符串单词 selector 的 img 标签，与前一个不同的是，这里要求是单词，前一个匹配的是子字符串

<img src="..." clsss="css-selector">
*/
img[clsss~=selector]


/*
选择 src 属性以 'http' 为前缀的 img 标签

<img src="http://...">
*/
img[src^=http]


/*
选择 src 属性以 'jpg' 为后缀的 img 标签

<img src="x.jpg">
*/
img[src$=jpg]
```


注意：乍一看好像 `img[src^=http]` 和 `img[src|=http]` 是一样的，其实不然。前者匹配前缀字符串，后缀匹配第一个单词。举个不恰当的例子：

```html
<img src="https://" >
<img src="http://" >
```

第一个 img 标签不会被 `img[src|=http]` 匹配，因为 src 属性开头的第一个单词为 `https`。

## 层次选择器

+ `div a` 后代选择器，选择所有在 div 里面的 a
+ `p>a` 直接后端选择器，选择所有为 p 元素的直接后代的 a 元素
+ `p+a`  相邻兄弟选择器，选择紧跟在 p 元素的 a 元素
+ `p~span`  选择 p 元素之后的所有 span 元素

## 伪类选择器

伪类选择器可以分为 6 类：

+ 动态伪类选择器
+ 目标伪类选择器
+ 语言伪类选择器
+ UI状态伪类选择器
+ 结构伪类选择器
+ 否定伪类选择器

### 动态伪类选择器

+ `a:link`：匹配定义了 `href` 属性的 a 标签
+ `a:visited`：匹配点击过的 a 标签
+ `E:active`：匹配正被激活的元素，比如正在点击的连接或者按钮
+ `E:hover`：匹配鼠标落在其上的 E
+ `E:focus`：匹配获得焦点的 E

关于以上属性有一个 LoVe/HAte 的规则，至于为什么，可以参看[这里](https://github.com/wy-ei/notebook/blob/master/css/2015-12-19-why-love-hate.md)

### 目标伪类选择器

+ `:target`：匹配有着和 URL 中的 hash 相同的 id 的元素

```html
<a href="#part-1">see part 1</a>
<p id="part-1">part 1</p>
```

当点击了标签之后，url 中的锚点就变成了 part-1 这就和 p 标签的 id 匹配了。此时该 p 标签被匹配。

### 语言伪类选择器

语言伪类选择器是通过标签的 lang 属性来进行匹配的

```css
E:lang(language){}
```

可以使用该属性来匹配不同语言的元素

### UI状态伪类选择器

+ `E:checked`
+ `E:enabled`
+ `E:disabled`
+ `E:focus`

这几个属性通常用在 `<input>` 和 `<button>` 标签上

### 结构伪类选择器

+ `:first-child`
+ `:last-child`
+ `:root`
+ `:nth-child(n)`
+ `:nth-last-child(n)`
+ `:nth-of-type(n)`
+ `:nth-last-of-type(n)`
+ `:first-of-type`
+ `:last-of-type`
+ `:only-child`
+ `:only-of-type`
+ `:empty`：选择没有子元素的元素

### 否定伪类选择器

+ `:not()`

```css
a:not([href^=https]){
    color: red;
}
```

匹配所有地址不是 https 的 a 标签。

更多伪类可以参见这里：[Pseudo-classes MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

## 伪元素

CSS3 中对伪元素进行了调整，使用双冒号开头 `::` ，目的是为了和伪类区分开来。


+ `::after`
+ `::before`
+ `::first-letter`：用来选择文本块的第一个字母，对于行内元素该选择器不起作用，需要修改 `display` 使其成为块状结构才有效
+ `::first-line`：用来匹配文本块的第一行文本
+ `::selection`：用来匹配被选中的文本，该伪元素仅接受 `background` 和 `color` 两个属性


更多伪元素可以参见这里 [Pseudo-elements MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/pseudo-elements)
