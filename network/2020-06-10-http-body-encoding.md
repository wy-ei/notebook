---
layout: post
title: HTTP 报文编码格式
category: 网络
---

* -
{:toc}

因为最近在尝试写一个 HTTP 服务器，用来练练手。处理 HTTP 请求首先需要解析 HTTP 请求，其中 HTTP 的 body 部分格式相对较多，在此期间我对常见格式做了了解，先记录于此。

## chunk 编码

首先谈谈 HTTP 报文的 body 部分在传输过程中的编码。而下一节，讨论内容的解析，即给定一个字符串，要从中解析出有用信息来。这两者都需要依靠某种规定好的格式。

在 HTTP 中有 `Content-Length` 这个头部，它指明 body 部分有多少字节。如果知道待发送的数据的总长度，`Content-Length` 的值自然可以获得。此时数据可以直接放在 body 部分传输，并设置好 `Content-Length` 即可。为什么 `Content-Length` 很重要，因为现在的 HTTP 请求通常都是流水线式的，即在一个 TCP 连接中一次性发送多个请求。接收方需要从多个请求中找到请求之间的间隔吧，这就需要知道每个请求的 body 部分有多长。


有时候，在没得到全部待发送数据之前，就需要先发送部分数据了，此时自然不知道 `Content-Length` 是多少。那么多个请求如何区分开呢？这种情况下可以使用 chunk 编码。chunk 即分块的意思。

这种方式把 body 分成了多个分块来发送，每个分块的长度都是已知的。每个分块前都以十六进制指明分块的长度，而后跟随分块的内容。这样每个分块有多长就知道了。最后一个分块的长度为 0，它作为最后一个 chunk 的标志。

下面借用 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Transfer-Encoding)上的一个例子，如下：

```http
HTTP/1.1 200 OK 
Content-Type: text/plain 
Transfer-Encoding: chunked

7\r\n
Mozilla\r\n 
9\r\n
Developer\r\n
7\r\n
Network\r\n
0\r\n 
\r\n
```

头部 `Transfer-Encoding: chunked` 说明 body 采用 chunk 编码。body 中的第一行为 7，说明第一个分块的长度为 7。下一行起 7 个字符就是本 chunk 的内容。解析 chunk 编码很容易，读取第一行得到第一个 chunk 的长度，然后从接下来的一行起读取指定长度的内容。而后再读取下一个 chunk。

有了 chunk 编码方式，可以把数据分成多个部分发送，不必等到所有数据都收集完了之后才一次性发送。最后一个 chunk 的长度为 0，用于标志 body 结束了。

在接收端，如果发现请求中包含 body ，比如 POST 请求，此时如果有 `Content-Length` 头部，那就读取固定长度作为 body 即可。如果没有，那就必须要使用 `chunk` 编码了，否则服务器端是无法解析的。

## body 常见格式

HTTP 协议中并没有规定 body 部分采用什么格式，比如 JSON 格式、XML 格式，你可以发送任何数据。但是发过去的内容总得被解析。尤其是发送结构化数据，使用一个双方都支持的格式，这对收发双方都很重要。

下面是几种常见的格式：

1. `application/x-www-form-urlencoded`
2. `multipart/form-data`
3. `application/json`
4. 其他

### `application/x-www-form-urlencoded`

这种格式传输的是键值对，就像 GET 请求的 query 部分一样，使用 `a=b` 来表示一个键值对，使用 `&` 连接多个键值对。比如：

```
foo=123&bar=234
```

在浏览器中可以这样发起请求：

```js
let params = new URLSearchParams;
params.append("foo", "123");
params.append("bar", "234");

fetch("http://127.0.0.1:8001", {
    method: "POST",
    body: params
});
```

发送的内容是一个 `URLSearchParams` 对象，此时浏览器会自动在请求头部加入 `Content-Type: application/x-www-form-urlencoded`。

如果不是在浏览器环境中，也可以手动完成 body 的编码，并指定正确的 `Content-Type`：

```js
// 或者手动编码
fetch("http://127.0.0.1:8001", {
    method: "POST",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: "foo=123&bar=234"
})
```

### `multipart/form-data`

在网页中使用 form 提交表单是就是采用这种格式。如今已经是 2020 年了，通常很少使用 form 来发起 POST 请求了，通常都是由 JavaScript 来发起 HTTP 请求。

使用 `FormData` 对象作为发送内容，就会这种格式，下面是个例子：

```js
var form = new FormData;
form.append("foo", "123");
form.append("bar", "234");

fetch("http://127.0.0.1:8001", {
    method: "POST",
    body: form
}).then(res => res.text()).then(data => {
    console.log(data);
});
```

浏览器会自动添加头部：

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary0YIe7rP7SPMwpOvO
```

请求的 body 部分的内容如下：


```
------WebKitFormBoundary0YIe7rP7SPMwpOvO
Content-Disposition: form-data; name="foo"

123
------WebKitFormBoundary0YIe7rP7SPMwpOvO
Content-Disposition: form-data; name="bar"

234
------WebKitFormBoundary0YIe7rP7SPMwpOvO--
```

可见整个内容由 `boundary` 分为多个部分，这个 `boundary` 需要在 `Content-Type` 中指出。它可以是任意字符串，但为了防止与用户发送的内容冲突，通常随机生成一个较长的字符串。

`multipart/form-data` 格式如下：

```
--{boundary}\r\n
Content-Disposition: form-data; name="key"\r\n
\r\n
value\r\n
--{boundary}\r\n
Content-Disposition: form-data; name="key"\r\n
\r\n
value\r\n
--{boundary}--\r\n
```

两个 boundary 之间的是一个条目。它分为头部和 body，两者之间空行分隔。

其中 `Content-Disposition` 是一个 HTTP 头部，但是此处在 `multipart/form-data` 中复用了此头部，它的格式如下：

```
Content-Disposition: form-data; name="fieldName"
Content-Disposition: form-data; name="fieldName"; filename="filename.jpg"
```

`name` 指明 form-data 中 key-value 对的 key，而 value 就是其后的内容了。如果发送的是文件，那么还会有 `filename` 这个字段，用来说明用户上传的文件的名称。比如我发送了一个文件，那么这部分的内容就大致为：

```
------WebKitFormBoundaryZMPZDvIKME9OoGKU
Content-Disposition: form-data; name="file"; filename="nlu.py"
Content-Type: text/plain

import pandas as pd
import re
...
```

用 `Content-Type: text/plain` 指明了文件的类型。每次浏览器都会随机生成一个 `boundary`，所以这里的 `boundary` 不和上面的一样。

最后一个 boundary 后面紧跟 `--`，这是结束的标志。


### `application/json`

这种格式想必是目前最为流行的格式了，后端系统的请求和响应大多采用此格式。它没什么特别的，body 部分就是序列化后的 JSON 字符串，在 `Content-Type` 中指明 `application/json`，对端反序列化 JSON 字符串即可。

### 其他格式

无论什么格式，内容都是在 body 中放着，只不过解析方法不同罢了。用户完全可以自己定义一种格式，然后前后端采用匹配的格式化和解析方法即可。前面三种用的比较普遍，因此单拉出来说了说，其他的格式就不再说了。
