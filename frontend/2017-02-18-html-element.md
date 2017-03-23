---
layout: post
title: HTML 标签语义
category: 前端开发者笔记
tag:
  - html
---



### `dl`,`dt`,`dd`

这几个标签用来表示一些定义，`dl` 用于包裹多个 `dt` 和 `dl`，`dt` 表示定义的名字，`dd` 表示详细内容。

```html
<dl>
  <dt>Firefox</dt>
  <dd>A free, open source, cross-platform,
      graphical web browser developed by the
      Mozilla Corporation and hundreds of
      volunteers.</dd>

  <!-- other terms and descriptions -->
</dl>
```

### `abbr`(abbreviation)

```html
<abbr title="Internationalization">I18N</abbr>
```

### `b`, `strong`, `em`, `i`

`b` 标签默认会加粗文字，没有任何其他的意义，这不同于 `strong`, `em`, or `mark` 这些标签，仅仅是加粗文字，因此更好的方案是避免使用 `b` 标签，而是使用 `font-weight` 来设置加粗样式。

`strong` 用来表示一段文本很重要，用来突出重点，虽然默认样式下，它也被显示为加粗，但是强调并不意味着只能使用加粗效果，可以是加下划线，或者其他颜色。

`em` 也用来强调一段文本中的某一小段或个别单词。默认会显示成倾斜样式。

`i` 之于 `em` 同 `b` 之于 `strong`。仅仅是视觉上的表现，没有更多意义要表达。

### `cite`

用来表示一个创意作品，比如一本书、一部电影等等。

```html
More information can be found in <cite>[ISO-0000]</cite>.
```

### `q`,`blockquote`

表示引用，`q` 表示短的引用，长的引用使用 `blockquote` 表示，使用 `cite` 属性指明出处。

```html
<blockquote cite="http://developer.mozilla.org">
  <p>This is a quotation taken from
  the Mozilla Developer Center.</p>
</blockquote>
```

### `s`,`del`

加上删除线，不表示文档内容是被修改过的。如果要表示一段话在后期被删除了，使用 `del` 标签。

### `samp`

用来表示计算机程序的输出结果。

### `u`(underline)

下划线，无特殊含义。


更多标签的意义 [Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
