---
layout: post
title: 处理神经网络过拟合现象
category: 机器学习
---



神经网络通常有几万，几十万，甚至几百万的参数，如此多的参数，让神经网络具有强大的拟合能力，很容易出现过拟合。这里列举几种在训练神经网络的时候，对抗过拟合的几种方法。


### L1 和 L2 正则化

就像训练线性回归模型时那样，也可以给神经网络加入 L1 或 L2 正则化项。

```python
keras.layers.Dense(100, activation="elu",
                   kernel_initializer="he_normal",
                   kernel_regularizer=keras.regularizers.l2(0.01))
```

还有其他正则化方法：

```python
from keras import regularizers

# L1 regularization
regularizers.l1(0.001)

# L1 and L2 regularization at the same time
regularizers.l1_l2(l1=0.001, l2=0.001)
```

如果要使用正则化，常常需要在各个层都加入正则化项。为了避免拷贝相同的代码，可以使用 `partial` 函数。

```python
from functools import partial

RegularizedDense = partial(keras.layers.Dense,
                           activation="elu",
                           kernel_initializer="he_normal",
                           kernel_regularizer=keras.regularizers.l2(0.01))

model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    RegularizedDense(300),
    RegularizedDense(100),
    RegularizedDense(10, activation="softmax")
])
```

### Dropout


在训练过程中随机将输出中的一部分置 0，这让神经元间的彼此依赖减弱。一个类比是，在一个大公司里，每天都随机有一部分员工不来上班，因此每个员工就不得不和更多的同事建立合作，这样公司才能运转下去。


在测试阶段，因为没有 dropout 存在，输出的所有维度都有值，激活函数的输入看起来会大一倍，因此在测试阶段给输出再乘一个 dropout rate，将各个维度的值减小。

还有一种做法，在训练阶段，对输出作了 dropout 之后，将值全部扩大一倍。这样以来，在测试阶段，就不再对输出作任何操作了。

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2019/05/07/5cd141bc3a213b0417e8a4f7.jpg)

但是这一切在 keras 中都可以交给 `Dropout` 来处理。

```python
model = keras.models.Sequential([
    keras.layers.Flatten(input_shape=[28, 28]),
    keras.layers.Dropout(rate=0.2),
    keras.layers.Dense(300, activation="elu", kernel_initializer="he_normal"),
    keras.layers.Dropout(rate=0.2),
    keras.layers.Dense(100, activation="elu", kernel_initializer="he_normal"),
    keras.layers.Dropout(rate=0.2),
    keras.layers.Dense(10, activation="softmax")
])
```

### Monte-Carlo (MC) Dropout

如果把 Dropout 看做是神经网络的集成，那么在预测的时候，应该是多个模型进行投票。Monte-Carlo Dropout 策略就是在预测阶段，开启 Dropout，然后预测 n 次，n 次的结果进行投票，或者对概率求均值。

```python
with keras.backend.learning_phase_scope(1): # 强制开启 dropout
    y_probas = np.stack([model.predict(X_test_scaled)
                         for sample in range(100)])
y_proba = y_probas.mean(axis=0)
```

采用开启 Dropout 得出的多个结果综合得出预测结果，看起来比关闭 Dropout 后得到单次预测要靠谱。

对一个样本关闭 Dropout 后得出的预测概率如下，看起来对最后一类很确信。

```python
[[0. , 0. , 0. , 0. , 0. , 0. , 0. , 0.01, 0. , 0.99]]
```

而关闭 Dropout 后，进行多次预测，可以看出模型有时候对最后一类并非很确信。

```python
[[[0. , 0. , 0. , 0. , 0. , 0.14, 0. , 0.17, 0. , 0.68]],
 [[0. , 0. , 0. , 0. , 0. , 0.16, 0. , 0.2 , 0. , 0.64]],
 [[0. , 0. , 0. , 0. , 0. , 0.02, 0. , 0.01, 0. , 0.97]]]
```

最终求均值后得出的结果如下：

```python
[[0. , 0. , 0. , 0. , 0. , 0.22, 0. , 0.16, 0. , 0.62]]
```

### Max-Norm Regularization

一个神经元，其数学表示为 $\sigma(w x + b)$，max-norm regularization 并不在损失函数中增加正则化项。它限制 $w$ 的模长，如果 $w$ 中的某一维度的值过大，那么其模长会变大，限制模长能够从一定程度上限制参数的大小。通常在训练的每一步之后，如果 $w$ 大于阈值，就对其做调整，调整策略如下：

$$
w \leftarrow w \frac{r}{\lVert w \rVert _2}
$$

在 keras 中，可以采用如下代码实现。

```python
keras.layers.Dense(100, activation="elu", kernel_initializer="he_normal",
                   kernel_constraint=keras.constraints.max_norm(1.))
```