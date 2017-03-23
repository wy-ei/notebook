---
layout: post
title: 前端测试框架 Mocha 用法
category: 前端开发者笔记
tag:
  - 前端工具
  - 测试工具
---


* toc
{:toc}

mocha 是一个具有丰富特性的 JavaScript 测试框架，它可以运行在 Node.js 和浏览器中。

## 安装

全局安装：

```sh
$ npm install --global mocha
```

也可以安装在项目中：

```sh
$ npm install --save-dev mocha
```

## 开始

在项目 test 文件夹下新建文件，编写测试用例：

```javascript
var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
```

运行 mocha：

```sh
$ ./node_modules/mocha/bin/mocha
```

## 断言库

mocha 并不限制断言库，可以使用 node 模块 assert，也可以使用 [should.js](https://github.com/shouldjs/should.js)、[chai](http://chaijs.com/) 等断言库。

## 测试异步代码

只需要在异步执行完成后调用传入的回调 `done` 即可通知 mocha 异步代码执行完毕。

```javascript
describe('User', function() {
  describe('#save()', function() {
    it('should save without error', function(done) {
      var user = new User('Luna');
      user.save(function(err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
```

## 测试同步代码

测试同步代码的时候就不要传入回调 `done`。

```javascript
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    });
  });
});
```

## 钩子

mocha 提供了一些钩子函数，`before()`、`after()`、`beforeEach()`、`afterEach()`，这些函数可以用来设置预备条件，或者在测试后进行一些清理操作。

```javascript
describe('hooks', function() {

  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
```

### 异步钩子

这些钩子函数中的代码也可以是异步的，如果是异步的，需要使用 `done` 回调，像下面这样：

```javascript
beforeEach(function(done) {
  db.clear(function(err) {
    if (err) return done(err);
    db.save([tobi, loki, jane], done);
  });
});
```

### 根钩子

可以在 `describe()` 外面写钩子函数，比如写一个 `beforeEach()` 钩子函数在 `describe()` 外 ，mocha 会在运行所有的测试用例之前运行这些钩子。

### 延迟测试

使用 `--delay` 选项来运行 mocha，在全局环境中会多一个 run 方法，可以用来启动测试。

```javascript
setTimeout(function() {
  // do some setup

  describe('my suite', function() {
    // ...
  });

  run();
}, 5000);
```


## 只运行特定测试用例

在进行开发的时候，很可能针对某个测试用例多次运行测试，而不是全部的测试用例，这个时候可以使用 `only` 方法：

```javascript
describe('Array', function() {
  describe.only('#indexOf()', function() {
    it.only('should return -1 unless present', function() {
      // this test will be run
    });

    it('should return the index when present', function() {
      // this test will not be run
    });
  });
});
```

`describe` 和 `it` 都可以使用 `only` 方法。使用了 `only` 方法后同级的其他测试用例或分组就不会运行了。


## 跳过某些测试用例

像使用 `only` 一样使用 `skip` 可以跳过部分测试用例。另外还可以在运行时，使用 `this.skip` 条件性地跳过测试用例。

```javascript
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    this.skip();
  }
});
```

使用 `this.skip` 跳过后会导致测试终止，被认为不通过。


## 重试测试

可以调用 `this.retries` 来设置重试次数。

```javascript
describe('retries', function() {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});
```

## 超时

可以给测试用例指定一个最长完成时间。

下面例子中，分组中的测试用例需要在 500ms 内完成。

```javascript
describe('a suite of tests', function() {
  this.timeout(500);

  it('should take less than 500ms', function(done){
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done){
    setTimeout(done, 250);
  });
});
```

超时也可以针对单个测试用例来设置：

```javascript
it('should take less than 500ms', function(done){
  this.timeout(500);
  setTimeout(done, 300);
});
```

## 用法


```
Usage: mocha [debug] [options] [files]


Commands:

  init <path>  initialize a client-side mocha setup at <path>

Options:

  -h, --help                              output usage information
  -V, --version                           output the version number
  -A, --async-only                        force all tests to take a callback (async) or return a promise
  -c, --colors                            force enabling of colors
  -C, --no-colors                         force disabling of colors
  -G, --growl                             enable growl notification support
  -O, --reporter-options <k=v,k2=v2,...>  reporter-specific options
  -R, --reporter <name>                   specify the reporter to use
  -S, --sort                              sort test files
  -b, --bail                              bail after first test failure
  -d, --debug                             enable node's debugger, synonym for node --debug
  -g, --grep <pattern>                    only run tests matching <pattern>
  -f, --fgrep <string>                    only run tests containing <string>
  -gc, --expose-gc                        expose gc extension
  -i, --invert                            inverts --grep and --fgrep matches
  -r, --require <name>                    require the given module
  -s, --slow <ms>                         "slow" test threshold in milliseconds [75]
  -t, --timeout <ms>                      set test-case timeout in milliseconds [2000]
  -u, --ui <name>                         specify user-interface (bdd|tdd|qunit|exports)
  -w, --watch                             watch files for changes
  --check-leaks                           check for global variable leaks
  --full-trace                            display the full stack trace
  --compilers <ext>:<module>,...          use the given module(s) to compile files
  --debug-brk                             enable node's debugger breaking on the first line
  --globals <names>                       allow the given comma-delimited global [names]
  --es_staging                            enable all staged features
  --harmony<_classes,_generators,...>     all node --harmony* flags are available
  --preserve-symlinks                     Instructs the module loader to preserve symbolic links when resolving and caching modules
  --icu-data-dir                          include ICU data
  --inline-diffs                          display actual/expected differences inline within each string
  --inspect                               activate devtools in chrome
  --interfaces                            display available interfaces
  --no-deprecation                        silence deprecation warnings
  --no-exit                               require a clean shutdown of the event loop: mocha will not call process.exit
  --no-timeouts                           disables timeouts, given implicitly with --debug
  --opts <path>                           specify opts path
  --perf-basic-prof                       enable perf linux profiler (basic support)
  --prof                                  log statistical profiling information
  --log-timer-events                      Time events including external callbacks
  --recursive                             include sub directories
  --reporters                             display available reporters
  --retries <times>                       set numbers of time to retry a failed test case
  --throw-deprecation                     throw an exception anytime a deprecated function is used
  --trace                                 trace function calls
  --trace-deprecation                     show stack traces on deprecations
  --use_strict                            enforce strict mode
  --watch-extensions <ext>,...            additional extensions to monitor with --watch
  --delay                                 wait for async suite definition
```


对个别选项进行说明：

- `--compilers <ext>:<module>,...`：用于指定针对特定文件的预处理器，比如 `mocha --compilers js:babel/register` 意思是使用 babel 来处理 js 文件。
