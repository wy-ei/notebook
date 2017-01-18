---
title: 线性回归
category: ml
---

## 线性回归（linear regression）

假设目前有一组房子面积、卧室数量和价格的数据：

| Living area (feet2)| #bedrooms| Price (1000$s)|
|:---:|:--:|:--:|
| 2104 | 3 | 400|
| 1600 | 3 | 330|
| 2400 | 3 | 369|
| 1416 | 2 | 232|
| 3000 | 4 | 540|

现在要使用这组数据来得出一个模型，能够通过房子面积和卧室数量来预测出价钱。需要做的就是利用这样一组数据得到一个线性函数，将面积和卧室数目作为输入，得出价格。下面的线性函数中的 x 就是输入特征，而 h(x) 就是预测结果。目前需要求的就是 theta，theta 就叫做系数或者是权重。

![image](https://cloud.githubusercontent.com/assets/7794103/22066928/14e76806-ddca-11e6-969d-487b8914fb30.png)

写成矩阵形式就是：

![image](https://cloud.githubusercontent.com/assets/7794103/22067012/5cce0c1a-ddca-11e6-89b4-069702d9e0cf.png)

我们需要找到一组 theta 来让得到的 h(x) 尽可能准确地预测价格。

为了找到合适的 theta，这里引入了误差方程：

![image](https://cloud.githubusercontent.com/assets/7794103/22067184/21888e54-ddcb-11e6-80c9-e75ed031189a.png)

误差方程就是预测结果和实际结果差值的平方的平均值，这里多出来的 `1/2` 是为了在后续计算中方便，因为后面的平方在求导以后会得到一个 2 正好和这里的 `1/2` 消去。

这里的 J 是三维空间中的一个面：

![image](https://cloud.githubusercontent.com/assets/7794103/22067776/a1437238-ddcd-11e6-8e11-3605499067ef.png)

### 梯度下降

初始阶段，误差 j 存在于这个面上的一点，为了让 j 最小，需要不断地修改 θ 的取值。想象在下山的过程中，最快的方法就是从当前位置最陡峭的方向下山，在数学中这个方向就是梯度了。梯度在微积分里面表示偏导数向量。

在梯度方向，也就是函数变化最快的一个方向，在该位置上沿着这个方向下降一步，然后在新的位置上重新计算梯度，如此往复直到到达了局部最优解。

![image](https://cloud.githubusercontent.com/assets/7794103/22067738/82739e28-ddcd-11e6-8d51-c29b7445168f.png)

这里的 α 是 **learning rate**，它的大小决定了梯度下降的速度，这个值部门太大，太大会导致 overshoot，太小会导致下降的步伐太小，需要花费的步数太多。

![image](https://cloud.githubusercontent.com/assets/7794103/22067930/3d98306a-ddce-11e6-9b59-20b78c233824.png)

如果从上方看这个梯度下降的过程，就是下图这样，图中的椭圆是等高线：

![image](https://cloud.githubusercontent.com/assets/7794103/22068001/8912ee68-ddce-11e6-8128-31477dec9304.png)

得到了 θ 以后，就可以得到拟合的这条直线：

![image](https://cloud.githubusercontent.com/assets/7794103/22068053/b3e0fce8-ddce-11e6-9cda-e3f36d859cb1.png)

之后就可以使用这天直线来进行预测了。

### The normal equations

由于 X 和  θ  和 y 之间存在关系：

```
y = X * θ
```

因此可以直接利用矩阵计算来得到 θ：

![image](https://cloud.githubusercontent.com/assets/7794103/22068322/9daf0982-ddcf-11e6-8caa-b263c4af60e2.png)

这个方法需要的计算量很大，如果 X 的维度过高那么在计算的时候会很耗性能。
