---
layout: page
title: 构造函数语义学
category: C/C++
hide: T
---



## 默认构造函数

如果代码中需要用到一个对象的默认构造函数，但是用户并没有定义，此时编译器会自动生成构造函数。

```c++
class Bar{
public:
    int a;
};

class Foo{
public:
    Bar bar;
    Foo* next; 
}

int main(){
    Foo foo;
}
```

上面代码中需要使用 `Foo` 的无参构造函数（默认构造函数），但是用户并未提供。为了成功创建 `foo` 对象，编译器为 `Foo` 合成默认构造函数。为了构造类成员 `bar`，编译器需要为 `Bar` 合成默认构造函数。

合成的默认构造函数，调用类成员的默认构造函数，除此之外不做任何事情。初学者常常觉得默认的构造函数会初始化类中的成员，这是错误的想法。

运行下面的代码，输出的将是未初始化的内存中强行解释出的数字。

```cpp
int main(){
    Foo foo;
    cout << foo.bar.a << endl;
    cout << foo.next << endl;
}
```

在 C++ 11 中，提出了花括号初始化的语法 `Foo foo{};` 这样写可以确保成员被初始化为 `0`。

## 默认拷贝构造函数

在以下场景下，对象需要进行拷贝。

```c++
// 1. 赋值
Foo foo1;
Foo foo2 = foo1;

// 2. 参数
void func1(Foo foo){
    //...
}

// 3. 返回值
Foo func2(){
    Foo foo;
    //...
    return foo;
}
```

如果此时，用户没有提供默认拷贝构造函数，编译器会自动生成。

```cpp
class Foo{
public:
    Foo(const Foo& foo);
}
```

默认的拷贝构造函数对类成员按字节进行拷贝。

```cpp
Foo foo2 = foo1;
// 相当于：
Foo foo2;
memcpy(&foo2, &foo1, sizeof(foo));
```

以下情况下不能使用按位拷贝的策略：

1. 类成员含用户定义的拷贝构造函数：调用拷贝构造函数
2. 继承自一个含拷贝构造函数的类：调用基类的拷贝构造函数，其他成员按位拷贝
3. 类中存在虚函数：
4. 继承自虚基类

后两种情况只有涉及到继承时候才会显得特别：

```cpp
class A{
public:
    virtual void func();
};

class B: public A{
public:
    virtual void func();
};

int main(){
    A a;
    B b;
    a = b;
}
```

上面的例子中的赋值，需要在 a 中设置正确的虚函数表。因此，按位拷贝是不行的。

## Function 语义学

C++ 支持三种类型的成员函数：

```c++
class Point2D{
public:
    // 非静态成员函数
    void print();
    // 虚成员函数
    virtual int dim();
    // 静态成员函数
    static int point_count();
};
```

### 非静态成员函数

```c++
Point2D point{1, 2};
Point2D* ptr = &point;

point.print();
ptr->print();
```

对成员函数的调用，在 C++ 编译阶段进行了改写。定义成员函数时，成员函数内部隐含了一个 `this` 指针。


```cpp
void Point2D::print() {
    cout << '(' << x_ << ',' << y_ << ')';
}
```

改写后，这个 `this` 作为了函数的参数：

```c++
void print(Point2D* this_){
    cout << '(' << this_->x_ << ',' << this_->y_ << ')';
}
```

在 Python 中，这个 `this` 就是每个成员函数的第一个参数。在 `C++` 和其他多种语言中这个 `this` 并没有明确写为第一个参数。

```python
class Point2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        
    def print(self):
        print('({},{})'.format(self.x, self.y))
```


只不过 C++ 编译器对其改写后，函数名字不叫 `print` 了，而是类似 `_ZN5Point2D5printEv` 这样的名字，把类名和成员函数名，以及参数类型和参数数量，按照一定规则编程成一个函数名。这样可以保证，改写后的函数名称不会冲突。

### 虚拟成员函数

虚拟成员函数，需要依靠虚函数表来找到被调用的函数。

```cpp
ptr->dim();
```

会被转换为:

```cpp
(*ptr->vptr[1])(ptr);
```

这里 1 是函数 `dim` 在虚函数表中的索引。

### 静态成员函数

静态成员函数和普通函数无异，编译器对其做函数名称改写即可。
