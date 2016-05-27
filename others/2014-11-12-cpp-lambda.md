---
layout: post
title: C++中lambda表达式
category: C/C++
---

我们知道lambda表达式的行为很像是是一个匿名函数，我们常常在标准算法中使用lambda表达式。比如需要打印一个向量，可能会这样写：

```cpp
vector<int> v(10, 10);

std::for_each(v.begin(), v.end(), [](int n){
	cout << n << " ";
});
```
使用了for_each算法针对 v 中的每一个元素使用lambda表达式，并且成功的达到了目的。

但是看看下面这个方式也可以完成任务：

```cpp
std::for_each(v.begin(), v.end(), print_int);
```

这里的print_int 是什么呢？多数人都会知道它是一个形如`void print_int(int)`的函数，没错，但是他还可以是另外一类截然不同的类型，也就是说它并不是一个函数。

在学习类的运算符重载的时候，很多人可能会忽略掉`()`的重载，也就是括号的重载。我们知道对类的括号进行重载就能想函数一样使用类对象。举例如下：

```cpp
class Print{
	void operator()(int n){
		cout << n << " ";
	}
};

Print print_int;  //声明类对象
print_int(3);     //使用了()运算符
```

这样我们将3打印出来了。所以上面for_each语句中的print_int也可以是一个类对象。说这些的目的只是为了引出下面的话题，那就是lambda表达式的本质是什么？

其实在C++中，lambda表达式都被编译器翻译成了一个未命名的类的一个未命名对象。上面的lambda表达式，就被翻译成了形如Print类的一个未命名类，而在for_each中，声明了一个未命名的对象，然后使用其括号运输符来完成 v 中各个元素的处理。

我们知道，lambda表达式前面的 [] 是捕获列表，而捕获方式有通过引用捕获和通过值捕获。当通过值引用的时候，编译器在创建类的时候，会将这个值作为类成员变量，而在声明未命名对象的时候，将这个类成员初始化为所引用的变量当前的值。

当通过引用的方式捕获时，编译器不会将其存储为类成员。下面通过一个例子来说明以上内容。


```cpp
int value = 100;
auto it = find_if(v.begin(),v.end(),[value](const int n){
	return n<value;
});
cout<<*it;
```
上面这段代码是为了找到 v 中小于 100 的第一个数，这里我将长度最大长度按值传递给lambda表达式。编译器为之可能产生下面这个类：

```cpp
class XXX{
public:
	XXX(int x):value(x){}  //这里的x就是捕获列表中的变量 --- [value]
	bool operator()(const int n)const{  //这里与lambda的参数，返回值，函数体一致
		return n<value;
	}
private:
	int value;
};
```
之后，我们可以这样做：

```cpp
int value = 100;

XXX xx(value);
auto it = find_if(v.begin(), v.end(), xx);
cout<<*it;
```

毫无疑问，这里find_if对v中每一个元素调用了`xx.operator(int n)`,通过返回值得到了指向第一个小于value的值的迭代器。

其实你还可以这样使用XXX类：

```cpp
auto it = find_if(v.begin(), v.end(), XXX(100));
```

现在你或许对lambda表达式有有了一些认识，所以不妨自己定义一个这样的类来测试一下，是否真的如我这里所说。