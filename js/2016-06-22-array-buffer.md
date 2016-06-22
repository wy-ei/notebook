## 二进制数组

为了增强 javascript 操作二进制数据的能力，ES6 提供二进制数值来操作二进制数据，二进制数组由三类对象组成：

+ ArrayBuffer：代表内存中的一段二进制数据，可以通过视图来进行操作
+ TypedArray：一组对象，包括 `Unit8Array`，`Int8Array` 等等 9 个对象
+ DataView：可以自定义复合格式的视图

```javascript
var buf = new ArrayBuffer(2);

var int8 = new Int8Array(buf);

int8[0] = 0x01;
int8[1] = 0x02;

var int16 = new Int16Array(buf);

console.log(int16[0] === 0x0201); // true
```


大端：`[0x11][0x22][0x33][0x44]` -> `0x11223344`
小端：`[0x11][0x22][0x33][0x44]` -> `0x44332211`
