---
layout: post
title: Web 安全
category: Web
---



- *
{:toc}


## XSS

XSS （Cross Site Script）为了区别于 CSS ，缩写为 XSS。XSS 是指黑客通过 HTML 注入修改页面内容，插入恶意脚本，在用户访问页面的时候，对用户发起攻击的行为。

对于下面这个例子，我直接将用户输入的内容添加在页面中，这就存在非常明显的 XSS 漏洞。

```html
<body>
    <input type='text' id='name'>
    <button type="button" id="submit">ok</button>
    <div id='info'></div>
    <script>
        var $name = $('#name');
        var $info = $('#info');
        $('#submit').on('click',function(){
            var name = $name.val();
            $info.html(name);
        });
    </script>
</body>
```

如果攻击者在文本框中输入如下内容，页面中就会弹出对话框来，攻击者还可以通过此漏洞插入外部脚本在该网页中。

```
<script>alert('xss')</script>
```

对于 XSS 按照其表现形式不同可以分为下面几种：

- 反射型 XSS
- 存储型 XSS

### 反射型 XSS

前面的例子就是一个反射型 XSS ，它只是简单地将输入内容反射给浏览器。很多活动现场，常常看到各种微博、微信留言墙，它允许用户通过微信输入内容，将内容展现在另外一个大屏幕上，如果在将传输过来的字符串插入到 Web 页面上之前，没有过滤 JavaScript 脚本，就出现了 XSS 漏洞。参与互动的人如果输入了恶意脚本改变了页面中的内容，这就会产生很不好的影响。

因此对于需要插入到 Web 页面上的内容，在插入之前一定要小心 XSS 攻击，比较简单的方法是将要插入的字符串进行转译。

### 存储型 XSS

在一些论坛中，允许使用者发布一些帖子，恶意用户可能输入一些破坏性的脚本，然后这些内容被保存到了服务器上，下一个访问该网页的用户会下载这些恶意内容，其中就包含恶意脚本。这样造成的结果是每个访问该页面的用户都遭到了攻击。


## XSS 的防御手段

### 给关键的 cookie 设置 httpOnly 标记

给关键的 cookie 设置了  httpOnly 标记后可以防止 javascript 读取这些 cookie ，这从一定程度上避免了 cookie 劫持的发生。

### 输入检查

对用户输入的内容，要进行敏感信息检查，过滤掉 javascript ，script 等字样，对 `" , ' , < , >`  等特殊的字符进行转义。

### 输出检查

当要把内容输出到 HTML 页面上的时候，可以通过字符编码或转义的方式防止 XSS 攻击。

一般要对下面一些字符进行转换：

```
& -> &amp;
< -> &lt;
> -> &gt;
" -> &quot;
' -> &#x27;
/ -> &#x2F;
```

## CSRF

CSRF (Cross Site Request Forgery)，跨站点请求伪造。

当用户访问了网站 A 之后，该网站在用户的浏览器中留下了 cookie ，当该用户在之后访问到恶意网站后，这个网站可能向先前网站发起请求，而这些请求中会携带网站 A 的 cookie。

为了防止 CSRF 可以采用以下措施：

- Referer Check：通过检查 HTTP 请求头部中的 referer 字段可以检查请求是否来自合法的“源”地址，但有的时候浏览器不会发送 referer 头信息。

## 点击劫持

X-Frame-Options 这个字段是为了防止 ClickJacking 而生的。有以下几个可选值：

- DENY
- SAMEORIGIN
- ALLOW-FROM origin

当值为 DENY 的时候会拒绝当前页面被加载在任何 frame 中。为 SAMEORIGIN 则要求加载该页面的 frame 需要和该 frame 同源。当值为 ALLOW-FROM 的时候，则可以指出允许加载该页面的源地址。

## HTML5 安全


### iframe

HTML5 中专门为 iframe 定义了一个新属性 - sandbox, 这个属性可以控制 iframe 中加载的资源可以执行的动作。

### a 标签

在 a 标签中指定了 noreferrer 之后，发起的请求中就不会携带 referer 这个头部信息，因为 referer 可能会泄漏一些信息。
