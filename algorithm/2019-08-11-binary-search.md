---
layout: post
title: 二分查找
category: 算法
tags: ['算法']
---

二分查找的思想相当简单，但是实现起来却有很多的坑，本文来剖析一下各个坑点，并给出无 bug 的实现，便于复制粘贴。

### 二分查找要点

下面是二分查找算法的大体样子，自己动手实现时，需要注意的点，就是标 `???` 的地方。

```cpp
int binary_search(int[] a, int len, int x) {
    int lo = 0, hi = ???;

    while(???) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == x) {
            return mid
        } else if (a[mid] < x) {
            lo = ???
        } else {
            hi = ???
        }
    }
    return -1;
}
```

**`hi` 该如何初始化**

`lo` 和 `hi` 用于确定搜索区间，这个区间可以是 `[lo, hi]` 也可以是 `[lo, hi)`。如果采用闭区间，`hi` 就是最后一个元素的下标，`hi=len-1`。要是采用开区间，`hi=len`。

**终止条件怎么写**

`while` 循环的条件可能有两种 `lo < hi` 或者 `lo <= hi`。到底要不要等号，这决定于前一步开闭区间的选择。二分搜索停止的条件就是待搜索的区间长度为 0。把握住这个想法，这个条件就很好决定了。

如果采用闭区间，`lo==hi` 时，表示区间长度为 1。因此，如果采用闭区间，就需要有等号。否则，你想想如果列表中只有一个元素，那么 `lo` 和 `hi` 是相等的，你要不加等号，就进不去主循环。

如果采用开区间，当区间为空时，`lo==hi`。只要满足 `lo<hi` ，就说明区间不为空。所以此时是不加等号的。

**`lo` 和 `hi` 该如何调整**

当 `a[mid] < x` 时，说明中点的值是小于目标值，因此，`mid` 及其左边的范围可以抛掉了，因此可以放心大胆地写 `lo = mid + 1`。

当 `a[mid] > x` 时，说明中点的值是大于目标值，中点及其右边的范围可以抛掉了。这个时候，采用开区间还是闭区间，写法自然是不一样的。闭区间，当然就是 `hi = mid - 1`，开区间就是 `hi = mid`。

### 二分查找实现

根据前面的分析，我们可以写出两种二分查找的实现：

```cpp
// 实现一
int binary_search(int[] a, int len, int x) {
    int lo = 0, hi = len-1;

    while(lo<=hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == x) {
            return mid
        } else if (a[mid] < x) {
            lo = mid+1;
        } else {
            hi = mid-1;
        }
    }
    return -1;
}
```

```cpp
//实现二
int binary_search(int[] a, int len, int x) {
    int lo = 0, hi = len;

    while(lo<hi) {
        int mid = lo + (hi - lo) / 2;
        if (a[mid] == x) {
            return mid
        } else if (a[mid] < x) {
            lo = mid+1;
        } else {
            hi = mid;
        }
    }
    return -1;
}
```

### 关于开闭区间

涉及到边界的时候，常常要纠结到底右端用开区间还是闭区间。在快速排序，归并排序中也要纠结这个问题。如果你经常使用 Python，那么使用开区间就很自然。因为 Python 中，切片就是用的开区间。不过大多数语言中，我们都在使用开区间，比如下面的循环语句。因此，我建议以后不要纠结了，都采用开区间好了。大佬 E. W. Dijkstra [论证过](https://www.cs.utexas.edu/users/EWD/transcriptions/EWD08xx/EWD831.html)使用开区间的好处。

```c
for(int i=0;i<n;i++){
    //...
}
```

### 二分查找衍生算法

**搜索结束后 `lo` 和 `hi` 分别指向哪里**

分析完上面几点，二分查找就说完了。但是常常我们使用二分查找来寻找某个位置，然后插入元素，而不是直接用来寻找元素。因此，有必要了解一下如果没有查到某个元素，循环退出时 `lo` 和 `hi` 指向哪里。

如果采用的是闭区间，那么退出循环后，有 `lo>hi` 且 `lo=hi+1`。在退出前的一次迭代中，有 `lo=hi=mid`，此时，如果 `a[mid]>x` 会执行 `hi=mid-1`，如果 `a[mid]<x` 会执行 `lo=mid+1`。这带来的结果是退出循环后，有 `a[lo]>x`。而且 `lo` 指向的是第一个大于 `x` 的元素。而 `hi` 指向最后一个小于 `x` 的元素。

如果采用开区间，循环退出后，有 `hi==lo`，都指向第一个大于 `x` 的元素。

有了以上分析，我们可以很轻松地实现其他从二分查找中衍生出的算法。比如，寻找第一个大于等于 `x` 的元素的下标，寻找最后一个小于 `x` 的元素的下标等。

**寻找第一个大于等于 x 的元素的下标**

根据前面的分析，在二分查找没有找到时，不要返回 -1 而返回 `lo`，就可以实现这个算法了。不过可以实现的更加简洁。

我在考虑这个算法时，想法是不断减小区间范围。如果 `a[mid]` 小于 `x`，那么 `mid` 及其之前的范围不符合要求。否则，`mid` 后面的范围不符合要求，而 `mid` 有可能符合要求。但是在退出循环是 `lo = hi`，因此可以设 `hi = mid`。最终返回 `lo` 即得到结果。


```python
def lower_bound(a, x):
    lo, hi = 0, len(a)
    
    while lo < hi:
        mid = (lo+hi)//2
        if a[mid] < x:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

**寻找第一个大于 x 的元素的下标**

同理，可以写出如下代码：

```python
def upper_bound(a, x, lo=0, hi=None):
    lo, hi = 0, len(a)
    while lo < hi:
        mid = (lo + hi) // 2
        if a[mid] <= x:
            lo = mid + 1
        else:
            hi = mid
    return lo
```

这里借用了 C++ STL 中的两个函数名，`lower_bound` 和 `upper_bound`。在列表中，如果存在重复元素，比如 `a = [1 2 3 3 3 5 6]`。对于元素 3 而言，`lower_bound(a, 3)` 和 `upper_bound(a, 3)` 分别返回 3 在序列中的下边界和上边界，下边界是闭区间，上边界是开区间。如果不存在 3，那么 `lower_bound` 会返回第一个大于 3 的元素的下标。

**寻找最后一个小于 x 的元素的下标**

返回 `lower_bound(a, x) - 1` 即可。



### 总结

二分查找之所以容易出错，我想是因为人们常看到采用开闭区间的不同写法，另外没有仔细考虑这两种情况的边界情况。如果考虑清楚了，就很难出错了。