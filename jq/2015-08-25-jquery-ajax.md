# Ajax

## load

```
$('#container').load('a.html');
```

有的时候你或许并不是希望将整个文档插入到某个地方，而是这个文档的一部分，那么你可以在修改写法如下：

```
$('#container').load('a.html #content');
```

这样你就可以将 a.html id 为 content 的那么节点和它的字节点插入到 `#container` 了。

## getJSON


```
$.getJSON('/path/to/file', {param1: 'value1'}, function(json, textStatus) {
		/*optional stuff to do after success */
});
```


## getScript

```
$.getScript('c.js');
```

## get


```
$.get('d.xml', function(data) {
	/*optional stuff to do after success */
});
```
