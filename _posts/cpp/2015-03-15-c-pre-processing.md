---
layout: post
title: C/C++ 预处理指令详解
category: C/C++
---

- *
{:toc}

## 1.预定义符号

下面这些是 C 语言的预处理器定义的符号，他们都是常量十进制数，或者是常量字符串。他们用来指示调试输出来源以及为编译程序加入时间信息。其详细意义如下：

+ `__FILE__`：表示当前源文件的文件名
+ `__LINE__`：当前行在源文件中的行数
+ `__DATE__`：编译时候的日期
+ `__TIME__`：编译时候的时间
+ `__STDC__`：如果编译器遵循 ANSI C 那么这个值就是 1，否则未定义。


## 2. #define

### 2.1 使用 `#define` 定义字面上的替换

```c
#define uint  unsigned int
#define uchar unsigned char
```

这样可以免去敲冗长的类型名，在预处理阶段所有的 `uint` 和 `uchar` 都会被分别替换为 `unsigned int` 和 `unsigned char`。

**注意**：遇到上面这样的情况，最佳的选择是使用typedef来创建别名，而不是使用宏替换。

```c
typedef unsigned int uint;
typedef unsigned char uchar;
```

`##` 用来连接两个符号，举例如下:

```c
#define concat(m, n) m##n
#define ABCD 10

cout << concat(AB, CD); 
cout << ABCD
cout << 10
```

`concat(AB, CD)` 把 AB 和 CD 拼起来得到了，ABCD 而 ABCD 又是另外一个宏定义，进而被替换成了 10。我暂时想不到这个可以在哪里派上用场。

`#arg` 被用来指代宏参数对应的字符串，下面一个例子能让你明白：

```c++
#define PRINT(x)  cout<<"The value of " #x " is " << x

int width = 10;
PRINT(width*width);
// The value of width*width is 100
```

### 2.2 用宏来充当函数

对于简短的函数段，可以直接插入在程序中，而若使用函数的话会在调用函数时产生堆栈上的开销。其次有些时候，参数类型不明确所以用函数实现不够方便。

如：

```c
#define MAX(x,y)   ((x) > (y) ? (x) : (y))

int a = 1, b = 2;
int max = MAX(a, b);
```

对于任何可以用 > 比较的类型，都可以使用这个宏定义来求两者间的最大值。


### 2.3 副作用

**副作用 1**

观察上面的定义，每一个字符都用括号括起来了，这是因为，宏只做简单的替换，带参数的宏定义也如此。

如果写成下面这样:

```c
#define MAX(a, b)   a > b ? a : b
```

在程序中假如有这样的语句:

```c
int a = MAX(1+2, 2+3);
```
展开后得到:

```c
int a=1+2>2+3?1+2:2+3;
```

这可不是我们想要的结果。所以记住一点，它只是替换，并不求值。

**副作用 2 **

在考虑上面的 MAX 宏,我们用下面的方式调用：

```c
c = MAX(a++,b++);
```

我们希望他像函数一样，在比较完大小后，a和b的值都能加1.但是我们展开后得到:

```c
c=((a++)>(b++)?(a++):(b++));
```

显然，较大的那个变量将自加两次，这显然不是我们想要的。所以我们一定要注意自己调用的函数是不是真的是一个函数，因为我们无法成外观上区分他们到底本质上是不是一个宏。

**副作用 3 **

有时候，因为宏而产生的错误是很隐蔽的，让你难以发现，考虑：

```c
#define PRINT_TWICE(ch)   putchar(ch);putchar(ch)
```

我们希望这个定义能够帮我们打印一个字符两次，当我们用下面这样的方法调用时：

```c
PRINT_TWICE(fgetc(fp));
```

从文件中读取一个字符，然后打印两次。但宏展开后，它从文件中读取了两次，取得两个字符，然后输入到标准输出。

综上，当在使用宏的时候，一定要警惕，它是否会产生上面提到的这类不易察觉的副作用。在 C++ 中，应该尽可能使用 `const` 定义常理，使用 `inline` 定义内联函数，以此来消除对宏的依赖。

### 2.4 `#undef`

当我们需要在重新定义一个宏，或者要移除一个宏的时候，可以使用下面这样的形式：

```c
#undef name
```

### 2.5 分号加不加？

当用宏定义了一条完整的语句的时候，可能希望给它后面加上一个分号，这可能不会产生大的问题。其实我们在使用了宏以后习惯性的会在其后面加上一个分号，像普通的语句一样。永远记住宏做的工作是替换，你在定义它的时候在其后加了分号，那么在调用的时候就可以不用加分号了。如过你加了那么一个分号将产生一条空语句。

虽然一条空语句可能不会影响到程序的执行，你也不会察觉，但是有时候它可能会导致发生错误，举例如下:

```c
#define PRINT(x)  putchar(x);

if(...)
	PRINT(x);
else
	...
```

这仅仅是由于 if 语句因为下面只有一条语句所以没有加花括号，但是这个宏实际上是两条语句。当然这个问题可以在 if 后加上花括号来解决。

## 3. 条件编译

有的时候，程序会根据编译环境来有逻辑的进行编译，举例如下:

```cpp
#define DEBUG 1

#if DEBUG
	cout << status << endl;
#endif
```

当我们在调试程序的时候，我们可以将 `DEBUG` 设置为 1，但调试完毕后将他改为 0，这样我们不必去删除分布于源文件中各个地方的打印状态的语句了。

条件编译提供了一些关键字: `#define, #ifdef, #ifndef, #if, #elif, #else` 等，用法如下：

```cpp
#define LOG_LEVEL 1

#if LOG_LEVEL == 0
	info();
#elif LOG_LEVEL == 1
	warning();
#endif

#define _MSC_VER 1723
#ifdef _MSC_VER
	...
#else
	...
#endif

#if !defined(_MSC_VER)
	...
#endif
```

其中意义大多很明确，`#ifdef name` 是说如果定义了 `name`, `#ifndef name` 是说如果没有定义`name`。

## 4. `#include`

当我们的程序需要依赖于起来的头文件的时候，我们使用 `#include <filename>` 这样的指令将源文件包含进来，就像用被包含的文件的内容替换掉 `#include <filename>` 这句话一样。

使用尖括号是说明被包含的文件是库文件，它的路径由编译器的配置决定。使用 `#include "filename"` 这样的用双引号包围的形式，是说该文件不是库文件，它的路径引号内路径决定。如 `#include "cv/cv.h"` 是说包含当前目录下 cv 文件夹中的 cv.h 文件。

当工程很大的时候，文件互相包含，这个时候会出现同一个文件被嵌套包含多次的情况，为了避免这种情况，我们在定义头文件时，常常像下面这样写:

```c
#ifndef __SPEACIAL_H_
#define __SPEACIAL_H_

//在这里写文件内容

#endif
```

每个头文件在被预处理的时候，都会定义一个特殊的宏。如果相同的头文件再次出现的时候，由于在 `#ifndef` 这里将为假，所以忽略里面的内容。这样一份头文件就只会被包含一次。

## 5. 其他指令

### 5.1 #error

```c
#error  error message
```

当预处理器遇到这条指令的时候，会出现错误信息。在某些条件编译的分支中使用这个，或许还有点用。

### 5.2 #line

```c
#line 12 "main.cpp"
```

这个指令后面可以跟两个常量，前面一个是数字是必须有的，后面的字符串可有可无。前面的 12 将会修改 `__LINE__`，它指明下一行的行号是 12，而后面的字符串会修改 `__FILE__`。

### 5.3 #progma

这个指令因编译器不同而不同，它用来支持因编译器而异的特性。

## 6. 结语

关于 C/C++ 中的预处理指令需要讲的就这么多，以后遇到新的知识点了，再进行补充。