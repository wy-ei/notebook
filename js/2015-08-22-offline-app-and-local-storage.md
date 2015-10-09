## 离线检测

可以使用`navigator.onLine` 属性检测设备是否处于在线状态

其次当网络状态发生改变的时候还会触发`online` 和 `offline`的事件，如下：

```
window.addEventListener('online',function(){
	alert('online');
});
window.addEventListener('offline',function(){
	alert('offline');
});
```

## 离线缓存

### manifest file [这里](http://html5doctor.com/go-offline-with-application-cache/)有一篇介绍离线缓存的文章

基本格式如下：

```
CACHE MANIFEST
      
# This is a comment

CACHE:
/css/screen.css
/css/offline.css
/js/screen.js
/img/logo.png

FALLBACK:
/online.html /offline.html

NETWORK:
main.php
```
+ CACHE:表示需要缓存的文件
+ FALLBACK:一系列地址对，当需要访问前面的文件时候，用后面的代替
+ NETWORK：一定需要在在线访问的文件


使用

```
<!DOCTYPE html>
<html lang="en" manifest="/offline.appcache">
  // your html document
</html>
```
## 数据存储

### localStorage

要访问同一个 localStorage 对象,页面必须来自同一个域名(子域名无效)
协议,在同一个端口上。

+ getItem
+ setItem
+ removeItem
+ key
+ ...