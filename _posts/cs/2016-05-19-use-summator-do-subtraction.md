---
layout: post
title: 使用加法器完成减法
category: 理解计算机
published: false
---

在大学的数字电路课程中，学习过一种叫做加法器的东西，它可以用来完成加法运算。其本质上是采用了与非门来实现的。

加法器可以用来做加法，那么减法是如何实现的呢？

在减法运算中存在借位的问题，借位似乎不像进位那样容易实现，不过可以采用适当的方式让减法运算也不需要借位。看下面的推导：

```
213 - 168 = 213 + 999 - 168 - 999
```

以上式子可以转换为：

```
213 - 168 = 213 + 999 - 168 + 1 - 1000
```

进一步推导：

```
213 - 168
= 213 + 999 - 168 + 1 - 1000 
= 213 + 831 + 1 - 1000
= 1044 + 1 - 1000
= 45
```

给原式中加上 999 + 1 - 1000，这样 `999 - 168` 不存在借位，因为 `999` 中的各位都是最大的。最后 `-1000` 只有最高位上可能存在借位（差为负的时候）。

## 二进制减法

将上面的数转换为二进制：

对于二进制，8 位二进制最大的数为 1111 1111。

```
1101 0101 - 1010 1000 = 1101 0101 + 1111 1111 - 1010 1000 + 1 - 1 0000 0000
```

其实 `1111 1111 - 1010 1000` 的结果就是将减数的 0 和 1 调换一下，因此得到结果 `0101 0111`,之后的步骤，如十进制中一样：

将被减数与以上结果相加：

```
1101 0101 + 0101 0111 = 1 0010 1100
```

将结果加 1

```
1 0010 1100 + 1 = 1 0010 1101
```

将结果减去 `1 0000 0000`

```
1 0010 1101 - 1 0000 0000 = 10 1101
```
