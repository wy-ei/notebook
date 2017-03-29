---
layout: post
title: async / await
category: JavaScript
tag: ES6
---

`async` / `await` 的出现进一步简化了异步编程。基本使用方法如下：

```js
async function get_star_count(owner, repo) {
    let res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    let data = await res.json();
    return data.stargazers_count;
}

get_star_count('facebook', 'react').then(stargazers_count => {
    console.log(stargazers_count);
});
```

`async` 关键字表示这个函数中有异步逻辑，该函数应该返回一个 `Promise`，就算返回的不是 `Promise` 也会被转换为 `Promise`。 函数体中的 `await` 语句后面会跟一个 `Promise`，await 会等到 `Promise` 被 `resolve` 后将结果返回，而后执行后面的语句。

`await` 语句后面的内容就算不返回 `Promise` 也会被转换为 `Promise`。而且 `await` 关键字只能用于 `async` 函数内。且很多时候应该使用 `try ...catch` 包裹，来捕获在 `Promise` 中可能出现的错误。也可以在最后使用 `catch` 来捕获错误：

```js
get_star_count('facebook', 'react').then(...).catch(error => {
    // handle the error
});
```

如果有多个异步操作需要同时执行，但是 `await` 只能等待前一个执行完成后在执行后一个，此时可以使用 `Promise.all` 将多个异步操作组合起来。

```js
async function get_star_count(owner, repo) {
    let res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    let data = await res.json();
    return data.stargazers_count;
}

async function get_stars(){
    let [react, rn] = await Promise.all([
        get_star_count('facebook', 'react'),
        get_star_count('facebook', 'react-native')
    ]);
    console.log(`react has ${react} stars`);
    console.log(`react-native has ${rn} stars`);
    console.log(new Date())
}
get_stars();
// react has  63095 stars
// react-native has 46276 stars
// Wed Mar 29 2017 17:16:04 GMT+0800 (CST)
```
