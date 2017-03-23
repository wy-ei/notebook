---
layout: post
title: 矩阵乘法和逆矩阵
category: 数学
tag: 线性代数
---

## 线性组合

考虑如下方程组，这个方程组中的3个等式，分别表示3维空间中的三个平面。

$$
\begin{cases}
x + 2y + 3z = 6 \\
2x + 5y + 2z = 4 \\
6x - 3y + z = 2
\end{cases}
$$

这三个平面的交点也就是这个方程组的解。

![width=500px](https://cloud.githubusercontent.com/assets/7794103/22210778/dad98ca2-e1c5-11e6-9dc1-a0f2e2a6db2f.png)

在线性代数中可以使用另外一种方式来表示这个方程组，也就是写成矩阵形式：

$$
\begin{bmatrix}
1 & 2 & 3 \\
2 & 5 & 2 \\
6 & -3 & 1
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix} =
\begin{bmatrix}
6 \\
4 \\
2
\end{bmatrix}
$$

但是这样看不出什么特别之处，为此可以换一种写法：

$$
\begin{bmatrix}
1 & 2 & 3 \\
2 & 5 & 2 \\
6 & -3 & 1
\end{bmatrix}
\begin{bmatrix}
x \\
y \\
z
\end{bmatrix} = x
\begin{bmatrix}
1 \\
2 \\
6
\end{bmatrix}
+
y
\begin{bmatrix}
2 \\
5 \\
-3
\end{bmatrix}
+
z
\begin{bmatrix}
3 \\
2 \\
1
\end{bmatrix} =
\begin{bmatrix}
6 \\
4 \\
2
\end{bmatrix}
$$

这样以来，问题就变成了三维空间中三个向量的线性组合了。

## 矩阵乘法

### 矩阵乘以列向量

$$
\begin{bmatrix}
\vdots & \vdots & \vdots \\
col1 & col2 & col3 \\
\vdots & \vdots & \vdots
\end{bmatrix}
\begin{bmatrix}
3 \\
4 \\
5
\end{bmatrix} =
\begin{bmatrix}
\vdots \\
3*col1+4*col2+5*col3 \\
\vdots
\end{bmatrix}
$$

一个矩阵乘以一个列向量，实际上就是该矩阵的各列的线性组合。

### 行向量乘以矩阵

$$
\begin{bmatrix}
3 & 4 & 5
\end{bmatrix}
\begin{bmatrix}
\cdots & row1 & \cdots\\
\cdots & row2 & \cdots\\
\cdots & row3 & \cdots
\end{bmatrix} =
\begin{bmatrix}
\cdots & 3*row1+4*row2+5*row3 & \cdots
\end{bmatrix}
$$

使用一个行向量来乘以一个矩阵，就是该矩阵的各行的线性组合。

### 矩阵乘以矩阵

矩阵和矩阵相乘，可以结合前种情况。因为矩阵无非就是多个行向量或者列向量的组合。

$$
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix}\cdot
\begin{bmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{bmatrix} = 
\begin{bmatrix}
30 & 36 & 42 \\
66 & 81 & 96 \\
102 & 126 & 150
\end{bmatrix}
$$

比如以上矩阵相乘，你可以看做是第一个矩阵中的各行和第二个矩阵相乘，得到的多个行构成了结果。

也可以想象为第一个矩阵与第二个矩阵中的各列相乘，得到的多列构成了结果。

## 逆矩阵

矩阵 $A$ 的逆矩阵记做 $A^{-1}$，逆矩阵就相当于数字的倒数，逆矩阵的基本性质如下：

$$
\begin{split}
A A^{-1} = I \\
A^{-1}A = I
\end{split}
$$

一个矩阵与其逆矩阵相乘，得到单位矩阵。


一个矩阵要想可逆，需要有 n 个主元。如果 $Ax=0$ 对于一个非零的 $x$ 成立，那么 $A$ 不可逆。

如果 $A$ 和 $B$ 可逆，那么 $AB$ 的逆矩阵是：

$${(AB)}^{-1} = B^{-1}A^{-1}$$

证明如下：

$${(AB)}^{-1} B^{-1}A^{-1} = AIA^{-1} = AA^{-1} = I$$

### Gauss-Jordan 方法求逆矩阵

Gauss-Jordan 方法的理论依据是：

$$\begin{bmatrix}A & I\end{bmatrix}\begin{bmatrix}A^{-1}\end{bmatrix}=\begin{bmatrix}I & A^{-1}\end{bmatrix}$$


因此只需要将矩阵 $A$ 写成增广矩阵 $\begin{bmatrix}A & I\end{bmatrix}$ ，然后通过行变换、消元转换为 $\begin{bmatrix}I & A^{-1}\end{bmatrix}$ 的形式，这样就得到了 $A$ 的逆矩阵。
