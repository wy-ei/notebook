---
layout: post
title:  把一个对象转换成为字符串的过程
category: js
---

### 把一个对象转换成为字符串的过程：

1. 调用对象的 `toString` 方法，如果返回基本数据类型，则将基本数据类型转换成为字符串
2. 如果没有 `toString` 方法，或者 `toString` 的返回结果不是基本数据类型，那么调用 `valueOf` 方法，如果存在 `valueOf` 方法，而且其返回结果是基本数据类型，那么就将基本数据类型转换成为字符串
3. 如果没有 `valueOf` 方法，或者返回结果不是基本数据类型，那么将会抛出一个异常。  

```
var o = {
    toString:function(){
        return {};
    },
    valueOf:function(){
        return {};
    }
};

var s = "string:"+o;  // error
```
上面代码中，对象 o 的 `toString` 和 `valueOf` 方法均没有返回一个基本的数据类型，而是返回了一个对象，所以上面最后一句试图将 对象 o 转换为字符串的操作将会出错。

注意：对象字面量创建的对象会继承 Object 的方法，默认的 `toString` 方法是返回 `[object Object]`,而 `valueOf` 方法返回对象自身的一个引用。


### 把对象转换为数值的过程：

转化为数值的过程与转换为字符串的方法稍有不同

1. 调用对象的 `valueOf` 方法，如果 valueOf返回基本数据类型，则把该基本数据类型转换为数值
2. 如果没有 `valueOf` 方法，或者转换的结果不是基本数据类型，那么就调用 toString 方法
3. 如果没有 `toString` 方法，或者返回结果不是基本数据类型，那么将会抛出一个异常。
