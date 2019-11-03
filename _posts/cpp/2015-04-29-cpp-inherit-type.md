---
layout: post
title: C++ 继承方式
category: C/C++
---



## C++类成员权限

C++ 中 `class` 和 `struct` 关键词都可以用来定义类，两者唯一的不同是，`class` 定义的类中，类成员访问权限默认是 `private` 的，而 `struct` 是 `public` 的。

设置为 `private` 的成员仅能被当前类访问，设置为 `protected` 的成员，可以被子类访问，但是不能被用户访问。设置为 `public` 的成员可以被子类和用户访问。关于 C++ 的类成员的权限控制，就这么多内容。

## C++类继承方式

C++ 在继承的时候，可以采用三种继承方式，`public`、`protected`、 `private`，这会对类成员的访问权限造成影响。

首先需要明白，无论派生方式是什么样子的，派生类永远能够访问到基类的公有部分和受保护部分，而永远不能访问基类的私有部分。

派生方式影响的是基类的 `public` 和 `protected` 在子类中的表现出来的权限。

=> public 继承（class A: public B）

基类中的 `public` 和 `protected` 部分分别成为子类的 `public` 和 `protected` 部分。

=> private 继承（class A: private B）

使用 `private` 继承，基类中的 `public` 和 `protected` 部分成为子类中的 `private` 部分。

=> protected 继承（class A: protected B）

基类中的 `public` 和 `protected` 部分成为派生类中的 `protected` 部分。

=> 默认的继承保护级别

当继承一个类或者结构体时，如果没有注明继承方式，那么默认是什么样的呢？

对于 `struct` 和 `class` 我们知道，在定义的时其中的成员如果没有注明访问权限，那么在 `class` 默认是 `private` 的，`struct` 是 `public` 的。在继承的时候如出一辙。没有注明继承方式，如果子类是 `class`，那继承方式就是 `private`，子类是 `struct` 的话，默认方式是 `public`。

### 总结

继承方式的作用体现在子类的使用者（包括子类的用户（即，使用子类对象的函数）和子类的子类）身上。而对于直接继承自基类的子类而言，派生方式对其没有影响。

### 改变个别成员的可访问性

但我们使用私有继承的时候，所有继承而来的成员成为子类的私有成员，有时候我们希望其中的某个或者某几个成员能够被子类的用户访问到，此时可以使用 `using` 关键字来改变个别成员的权限。

```cpp
class Base{
public：
	int n;
protected：
	int size;
}；

class Derived: private Base{
public:
	using Base::n;
protected:
	using Base::size;
}
```

`private` 继承让 `Base` 中的所有成员成为了 `Derived` 的私有成员，但在 `Derived` 中可以明确地修改他们的访问权限。