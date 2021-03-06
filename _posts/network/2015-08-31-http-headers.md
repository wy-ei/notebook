---
layout: post
title: HTTP 常见头部字段
category: 网络
---

* toc
{:toc}


## 持久连接

HTTP 协议需要采用 TCP 做数据传输，在 HTTP 的早期版本中，每次 HTTP 通信都要建立一次 TCP 连接。而 TCP 连接需要三次握手，这大大降低了 HTTP 传输的性能。

在 Web 发展的早期，网页中的资源比较少，常常只有一个 html 页面，所以这一矛盾体现的不明显。后来，一个网页中包含几十个图片那是常有的事情，每个资源都需要建立一次 TCP 连接，就相当浪费。

解决方法也能直观，多个 HTTP 请求可以用单个 TCP 连接进行传输。这要求服务器在传输完资源之后，不要断开，而是保持 TCP 连接，因为客户端会利用此 TCP 连接发送第二个 HTTP 请求。

在 `HTTP/1.0` 和 `HTTP/1.1` 中开始支持这种持久连接。其中 `HTTP/1.0` 中需要显式地指定头部：

```
Connection: Keep-Alive
```

才能开启持久连接，在 `HTTP/1.1` 中默认开启持久连接。持久连接需要服务器提供支持，客户端在请求中要求持久连接，即设置 `Keep-Alive`，如果服务器支持持久连接，服务器也就会设定持久连接。