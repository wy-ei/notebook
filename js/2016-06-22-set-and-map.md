## Set

Set 也就是集合，它可以容纳一些数据，但是这个集合中不能存在重复的数据。

### 例子

```javascript
var s = new Set([1,2,3,3,3,3]);

s.add(5);

console.log([...s]); // [1,2,3,5]

s.delete(2);

console.log([...s]); // [1,3,5]

console.log(s.has(1)); // true

s.clear();

console.log([...s]); // []
```

Set 的构造函数可以是一个数组，数组中如果有重复的数据会被去重，集合采用类似于严格相等的方法来判断集合中是否有某个值，其不同于 `===` 之处在于两个 `NAN` 被视为相等的。

### Set 实例的属性和方法

+ size：返回集合种元素个数
+ add(value)：添加某个值，返回Set结构本身。
+ delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
+ has(value)：返回一个布尔值，表示该值是否为Set的成员。
+ clear()：清除所有成员，没有返回值。

遍历操作

+ keys
+ values
+ entries
+ forEach

```javascript
var s = new Set([1,2,3,3,3,3]);


console.log([...s.keys()]); // [ 1, 2, 3 ]
console.log([...s.values()]); // [ 1, 2, 3 ]
console.log([...s.entries()]); // [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]
```

由于集合只有值，没有建，所以这里 keys 和 values 返回的结果是一样的

## WeakSet

WeakSet 和 Set 的区别在于 WeakSet 中只能存放对象，且对对象的引用都是弱引用，也就是说垃圾回收器不会因为一个 WeakSet 中存在一个对某对象的引用而不回收一个对象。

另外 WeakSet 不存在遍历操作的 API

## Map

Map 提供存储键值对的数据类型，在此之前，我们把对象当做 map 来使用，但是对象存在一个问题，其键值只能是字符串，而 Map 的键值可以是任何类型，这样就得到一个更加纯粹的 Map 了。


```javascript
var m = new Map([['name', 'James'], ['title', 'Author']]);

m.set('age',22);
var age = m.get('age'); //-> 22

var size = m.size; //-> 3

m.clear();

var name = m.get('name'); //-> undefined
```

### Map 实例的属性和方法

+ size
+ set
+ get
+ has
+ delete
+ clear

+ keys
+ values
+ entries
+ forEach

Map 的遍历顺序和插入顺序相同

forEach 的第二个参数可以传入 `this` 值，其实 map 和 filter 等数组方法也是如此

```javascript
var log = {
  error:function(msg){
    console.error(msg);
  }
}

m.forEach(function(key,value){
  log.error(value);
},log);
```


## WeakMap

WeakMap 的键只能是对象，且只有下面几个实例方法

+ get
+ set
+ has
+ delete

同样的 WeakMap 的键也是弱引用，如果一个对象被回收掉了，那么这个键值对会被自动移除。
