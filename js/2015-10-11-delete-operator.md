### delete 操作符讲解

delete 操作符用来删除对象的属性

delete 操作符返回 true 当它成功地删除了对象的某个属性，或者删除操作没有起任何作用。

delete 操作不能删除那些 `configurable` 属性为 false 的属性。但是它能删除不可扩展对象中的可配置属性。


在严格模式下，尝试删除不可配置的属性会导致错误，而在非严格模式下只是简单地返回一个 `false`

在非严格模式下，可以直接像下面这样删除全局变量,

```
this.x = 10;
delete x;
x // undefined
``` 

而在严格模式下，删除操作会导致错误。必须像下面这样写：

```
this.x = 10;
delete this.x;
x // undefined
```

delete 是不能删除用 `var` 声明的变量的。