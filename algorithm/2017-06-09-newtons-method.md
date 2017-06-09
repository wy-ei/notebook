---
layout: post
title: 牛顿迭代法求解平方根
category: 算法
tag: 算法
---




对于高阶的多项式，没有可以使用的求根公式，为了求取多项式的根，可以使用牛顿迭代法。

牛顿迭代法的思想是在曲线上任意取一个点，然后求这一点的切线，使用切线的解来逼近多项式的解。

![](http://ww1.sinaimg.cn/large/b5d7bcc1ly1fgf4s8coqqj208c06v0sq.jpg)

然后在 $$x_{n+1}$$ 继续做切线：

![](http://ww1.sinaimg.cn/large/b5d7bcc1ly1fgf55hjfswj208c06vdfx.jpg)

不断的逼近，可以看到上图中切斜的解 $$x_{n+1}$$ 已经接近真实的解 $$x_n$$ 了一些。

![](http://ww1.sinaimg.cn/large/b5d7bcc1ly1fgf50c0t0jg208c05ydge.gif)


这里 $$x_{n+1}$$ 与 $$x_n$$ 的关系如下：

$$x_{n+1} = x_{n} -  \frac{f(x_n)}{f^\prime(x_n)}$$

因为 $$f^\prime(x_n)$$ 表示 $$f(x)$$ 在 $$x_n$$ 处的斜率，而斜率为：

$$\frac{f(n)}{x_n - x_{n+1}}$$

求某个数(如 N)的平方根，可以理解为求如下函数的解：

$$
f(x) = x^2 - N
$$

导数为：

$$f^\prime(x) = 2 * x$$

牛顿迭代式为：

$$x_{n+1} = x_n - \frac{x_{n}^2 - N}{2 * x_n} = \frac{1}{2} * (x_n + \frac{N}{x_n})$$


利用以上原理可以写出下面代码：


```java
public static double sqrt(double c){
    if(c < 0){
        return Double.NaN;
    }
    // 因为牛顿迭代法只是逼近真实值，所以需要设置一个误差范围
    double err = 1e-15;
    double t = c;

    // c / t 与 t 之间相差小于误差允许范围后跳出
    while(Math.abs( t - c / t) > err * t){
        // 得到下一个近似解
        t = (c/t + t) / 2.0;
    }
    return t;
}
```
