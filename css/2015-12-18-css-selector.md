## CSS 选择器

选择器可以分为 5 大类：

+ 基本选择器
+ 层次选择器
+ 伪类选择器
+ 伪元素
+ 属性选择器

### 基本选择器

**类选择器**

```html
<div class='info warning'></div>
```
上面这个元素有两个类，如果我们希望选择同时具有这两个类的元素，这个时候可以使用多类选择器，写法如下：

```css
.info.warning{
    color:red;
}
```
只需要将两个类名连起来即可

**属性选择器**

根据单个属性来选择：

选择所有具有 class 属性的 h1 标签

```css
h1[class]{
}
```

根据多个属性来进行选择：

选择同时具有 href 和 class 属性的 a 标签

```css
a[href][class]{   
}
```

根据属性的值来选择：

选择所有类型为 text 的 input 标签：

```css
input[type='text']{
}
```

根据部分属性值来选择：

关于下面的内容约定如下：**E 代表任意html元素，attr代表元素的属性，val代表属性的值**

+ E[attr]:选择具有该属性的元素，如img[alt] 选择设置了 alt 的 img 元素，也可以写成 `[type]` 选择所有具有 type 属性的元素。
+ E[attr=val]:选择属性值等于val的元素，如`input[type=text]` 选择所以输入类型为 text 的 input 元素
+ E[attr|=val]:选择属性开头单词等于 val 的元素
+ E[attr*=val]:选择属性中含有 val 的元素,如`a[href*=github]` 选择所有url中含有 github 的 a 元素
+ E[attr~=val]:选择属性列表中含有 val 的元素，比如class属性，其中可能含有好几个类名，`div[class~=content]` 会匹配 `<div class='content side'>...</div>`
+ E[attr^=val]:选择属性开头是 val 的元素
+ E[attr$=val]:选择属性以 val 结尾的元素

注意：乍一看好像E[attr^=val] 和 E[attr|=val] 是一样的，其实不然，后者需要属性值开头的单词与 val 匹配，而前者只需要前面的字符串与 val 一致即可 ,比如

```html
<img alt='csspseudo' src='pseudo.jpg' />
```

```css
img[alt|=css]{}
img[alt^=css]{}
```

这里只有后者匹配，前者不会匹配。但是,如果把 alt 改为 alt='css-pseudo' 那么后者就也可以匹配了，注意前面提到的 E[attr|=val] 要求开头单词匹配。

### 层次选择器

+ `p>a`  子元素选择器，选择所有为 p 元素的第一代后代的 a 元素
+ `p+a`  相邻兄弟选择器，选择紧跟在 p 元素的 a 元素
+ `p~span`  选择 p 元素之后的所有 span 元素
+ `div p`  后代选择器，选择器之间用空格分隔，选择 div 的所有后代 p 元素

### 伪类选择器

伪类选择器可以分为 6 类：

+ 动态伪类选择器
+ 目标伪类选择器
+ 语言伪类选择器
+ UI状态伪类选择器
+ 结构伪类选择器
+ 否定伪类选择器

#### 动态伪类选择器

+ `a:link`：匹配定义了 `href` 属性的 a 标签
+ `a:visited`：匹配点击过的 a 标签
+ `E:active`：匹配正被激活的元素，比如正在点击的连接或者按钮
+ `E:hover`
+ `E:focus`

关于以上属性有一个 LoVe/HAte 的规则，至于为什么，可以参看[这里](https://github.com/wy-ei/notebook/blob/master/css/2015-12-19-why-love-hate.md)

#### 目标伪类选择器

+ `:target`：匹配有着和 URL 中的 hash 相同的 id 的元素

```html
<a href="#part-1">see part 1</a>
<p id="part-1">part 1</p>
```

```css
p{
    display: none;
}
p:target{
    display: block;
}
```

当点击了标签之后，url 中的锚点就变成了 part-1 这就和 p 标签的 id 匹配了。此时该 p 标签被匹配。

#### 语言伪类选择器

语言伪类选择器是通过标签的 lang 属性来进行匹配的

```css
E:lang(language){}
```

可以使用该属性来匹配不同语言的元素

#### UI状态伪类选择器

+ `E:checked`
+ `E:enabled`
+ `E:disabled`

以上几个以及 `E:focus` 多用于表单

#### 结构伪类选择器

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

#### 否定伪类选择器

+ `:not()`

```css
a:not([href^=https]){
    color: red;
}
```

匹配所有地址不是 https 的 a 标签。

更多伪类可以参见这里：[Pseudo-classes | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

### 伪元素

CSS3 中对伪元素进行了调整，使用双冒号开头 `::` ，目的是为了和伪类区分开来。


+ `::after`
+ `::before`
+ `::first-letter`：用来选择文本块的第一个字母，对于行内元素该选择器不起作用，需要修改 `display` 使其成为块状结构才有效
+ `::first-line`：用来匹配文本块的第一行文本
+ `::selection`：用来匹配被选中的文本，该伪元素仅接受 `background` 和 `color` 两个属性
```

更多伪元素可以参见这里 [Pseudo-elements | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/pseudo-elements)
