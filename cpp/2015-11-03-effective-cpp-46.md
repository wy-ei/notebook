---
layout: post
title: 《Effective C++》条款 46 补充
category: C/C++
---


## 问题

《Effective C++》条款 46 的标题是：需要类型转换时请为模板定义非成员函数。本节作者定义了一个有理数类，希望他能做如下运算：

```cpp
Rational<int> a(1, 3);
Rational<int> b = a * a;
Rational<int> c = a * 3;
Rational<int> d = 3 * a;
```

类的定义如下：

```cpp
template <typename T>
class Rational{
public:
    Rational(T numerator, T denominator=1): numerator_(numerator), denominator_(denominator){}
    T numerator() const{ return numerator_; }
    T denominator() const{ return denominator_; }

private:
    T numerator_;
    T denominator_;
};
```

## 解法

为了实现 `b = a * a` 可以重载类的 `operator*` 方法：

```cpp
Rational operator*(const Rational &rhs) const{
    Rational ret(numerator_ * rhs.numerator_, denominator_ * rhs.denominator_);
    return ret;
}
```

而要想让 `Retional` 类可以和 `int` 或者 `double` 等直接进行运算，如 `a * 3`，需要这里的 `3` 可以隐式转换为 `Retional`，因此 `Retional` 需要有一个可以接受单参数，且不能是 `explicit` 的构造函数。目前的类定义满足此要求。

但是为了实现 `d = 3 * a`，以上的工作都失去了意义，为此需要定义如下运算符：

```cpp
template <typename T>
Rational<T> operator*(const Rational<T> &lhs, const Rational<T> &rhs){
    return Rational<T>(lhs.numerator() * rhs.numerator(),
            lhs.denominator() * rhs.denominator());
}
```

这个时候，`b = a * a` 可以正常工作，但是 `c = a * 3` 和 `d = 3 * a` 会出错。原因很简单，模板在实例化的时候是不会做由 `int` 到 `Rational<int>` 的转换的。 为了支持这两种运算，可以定义如下模板函数：

```cpp
template <typename T>
Rational<T> operator*(const T &lhs, const Rational<T> &rhs){
    return Rational<T>(lhs) * rhs;
}

template <typename T>
Rational<T> operator*(const Rational<T> &lhs, const T &rhs){
    return lhs * Rational<T>(rhs);
}
```

在这两个模板函数内部，显示地进行了 `T` 到 `Rational<T>` 的转换。

## 更精简的解法

如果 `T` 可以隐式转换为 `Rational<T>`，那么就只需要一个函数。为了能够隐式转换，这个函数不能是模板函数。但是此函数又必须支持多种类型，一种方法是把他定义在类里面。为了在类里面定义一个普通函数，它就只能是友元的。

```cpp
template <typename T>
class Rational{
    friend Rational<T> operator*(const Rational<T> &lhs, const Rational<T> &rhs);
public:
    Rational(T numerator, T denominator=1): numerator_(numerator), denominator_(denominator){}
    //...
}
```

这里只在类里面做了声明，还缺少定义。于是在类外部写下如此定义：

```cpp
template <typename T>
Rational<T> operator*(const Rational<T> &lhs, const Rational<T> &rhs) {
    // ...
}
```

这就再度把自己引入了错误的深渊。因为 `friend` 声明的函数不是一个模板函数，而上面却定义了一个模板函数。结果是友元函数，没有定义。

```cpp
friend Rational<T> operator*(const Rational<T> &lhs, const Rational<T> &rhs);
```

解决的办法就是在类里面完成对友元函数的定义：

```cpp
template <typename T>
class Rational{
    friend Rational<T> operator*(const Rational<T> &lhs, const Rational<T> &rhs){
        return Rational<T>(lhs.numerator() * rhs.numerator(),
                           lhs.denominator() * rhs.denominator());
    }
    // ...
}
```

这样以来，在对类模板实例化的时候，就对这个函数进行实例化。

## 总结

在编写模板类的时候，如果需要支持隐式类型转换，那就不能依赖于模板函数，因为模板函数不会做隐式类型转换。此时需要定义一个非模板函数，并把它作为 `friend` 函数，并在类里面完成函数的定义。因为定义在类中的函数会是内联的，因此可以把具体的操作交给类的某个方法来完成。
