## CSS 选择器

### 多类选择器

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

### 属性选择器

#### 根据单个属性来选择

选择所有具有 class 属性的 h1 标签

```css
h1[class]{
}
```

#### 根据多个属性来进行选择：

选择同时具有 href 和 class 属性的 a 标签

```css
a[href][class]{   
}
```

#### 根据属性的值来选择

选择所有类型为 text 的 input 标签：

```css
input[type='text']{
}
```

#### 根据部分属性值来选择

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

### 根据在文档中的位置进行选择

+ `>`  子元素选择器：选择第一代后代
+ `p+a`  选择 紧跟在 p 元素的 a 元素
+ `p~span`  选择 p 元素之后的所有span元素
+ `div  p`  一个空格分隔，选择 div 的所有后代 p 元素

### 伪类选择器

+ `:first-child`
+ `:last-child`


### 伪元素

```
::after
::before
::first-letter
::first-line
::selection
::backdrop
```

### 伪类选择器

参考 [MDN Pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)
