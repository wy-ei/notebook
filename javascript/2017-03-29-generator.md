---
layout: post
title: ES6 Generator
category: JavaScript
tag: ES6
---

## Generator 函数基本用法

Generator 是一种新的函数类型，Generator 函数执行后返回一个 Generator 对象。这个对象可以被迭代，也就是说返回的对象实现了迭代器接口。

Generator 函数的定义方法如下：

```js
function* generator () {
  yield 'w';
  console.log('---');
  yield 'y';
}
```

需要注意的是 `function` 后面的 `*` 号，以及函数内部的 `yield` 关键字。`*` 号表示这是一个 Generator 函数，这个 `*` 的位置并不重要，只要位于 `function` 和 函数名之间就好了。

Generator 函数执行后返回一个 Generator 对象，该对象可以进行迭代，在每次迭代它都会执行到下一个 `yield` 关键字所在的位置，然后将 `yield` 后面的内容抛出。

```js
let g = generator();

console.log(g.next());
// -> { value: 'w', done: false }

console.log(g.next());
// -> ---
// -> { value: 'y', done: false }

console.log(g.next());
// -> { value: undefined, done: true }
```

`yield` 后面也可以加一个 `*`，将迭代转入到另一个对象中：

```js
function* generator () {
  yield 'start';
  yield * [1,2,3];
  yield 'end';
}

let g = generator();
console.log(Array.from(g));
// -> [ 'start', 1, 2, 3, 'end' ]
```

Generator 还有两个方法可以来控制异步流程，分别是 `g.return` 和 `g.throw`。

## `throw` 方法


`g.throw` 可以将错误信息传入 Generator 函数，可以使用 try ...catch 语句包含 `yield` 来捕获外部使用 `g.throw` 抛出的错误。

```js
function* generator () {
    try{
        yield 'start';
    }catch(e){
        yield 'start_fail';
    }
  yield 'end';
}

let g = generator();

console.log(g.next());
// -> { value: 'start', done: false }

console.log(g.throw('return'));
// -> { value: 'start_fail', done: false }

console.log(g.next());
// -> { value: 'end', done: false }

console.log(g.next());
// -> { value: undefined, done: true }
```

如果在 Generator 函数内部没有捕获错误，就需要在外部捕获：

```js
try{
    console.log(g.throw('return'));
}catch(e){
    console.log(e)
}
```


## `return` 方法

`g.return` 可以用来提前结束迭代：

```js
function* generator () {
  yield 'start';
  yield 'end';
}
let g = generator();
console.log(g.next());
// -> { value: 'start', done: false }

console.log(g.return('return'));
// -> { value: 'return', done: true }

console.log(g.next());
// -> { value: undefined, done: true }
```

`return` 方法可以带参数也可以不带，如果带有参数，参数会作为 value 的值，否则 value 为 `undefined`。

`g.return` 还有一点需要注意，就是如果当前的 `yield` 语句在 try ... catch ... finally 语句块中的时候，执行 `g.return` 需要执行完 `finally` 语句块中的代码，才会结束：

```js
function* generator () {
    try{
        yield 'start';
    }finally{
        yield 'finally';
    }
    yield 'end';
}

let g = generator();

console.log(g.next());
// -> { value: 'start', done: false }

console.log(g.return('return'));
// -> { value: 'finally', done: false }
// -> { value: 'return', done: true }
```

Generator 函数内部的 `return` 语句可以提前结束迭代：

```js
function* generator () {
    yield 'start';
    return 'return';
    yield 'end';
}

let g = generator();
console.log([...g])
// -> [ 'start' ]
```

## next 方法的参数

`next` 方法自然是可以传入参数的，传入的参数会作为前一个 `yield` 语句的返回值（因此第一个 `next` 传入参数是没有用的），后面的语句可以更据返回值做一些调整：

```js
function* generator () {
    let increase = yield 1;
    if(increase){
        yield 2;
    }else{
        yield 0;        
    }
}

let g = generator();

console.log(g.next());
// -> { value: 1, done: false }

console.log(g.next(true));
// -> { value: 2, done: false }

console.log(g.next());
// -> { value: undefined, done: true }
```


当然这仅限于手动调用 `next` 的时候，可以手动传参数，使用 `for of` 等进行迭代的时候，不会被传入参数。
