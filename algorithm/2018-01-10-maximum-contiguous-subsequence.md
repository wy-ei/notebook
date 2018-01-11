---
layout: post
title: 最大子序列
category: 算法
---

在数据结构与算法分析一书中讲到了找最大子序列的几种算法，记录如下：

## 方法一

此方法最直观，当然也比较慢，复杂度 N^2

```c++
int max_sub_sum(const vector<int> &a) {
	int max_sum = 0;
	for (int i = 0; i < a.size(); i++) {
		int this_sum = 0;
		for	(int j = i; j < a.size(); j++) {
			this_sum += a[j];
			if (this_sum > max_sum) {
				max_sum = this_sum;
			}
		}
	}
	return max_sum;
}
```


## 方法二

采用分治方法，将整个序列不断切分成原来的一半，找到前半部分和后半部分的最大子序列之和，再从中间向两端找最大子序列之和，三者取最大值。复杂度 NlogN

```
[........................]
<--前半部分--><--后半部分-->
      <--中间部分-->
```


```c++

int max_sum_rec(const vector<int> &a, int left, int right) {
	if (left == right) {
		if (left < 0) {
			return 0;
		}else {
			return a[left];
		}
	}

	int center = (left + right) / 2;
	int max_left_sum = max_sum_rec(a, left, center);
	int max_right_sum = max_sum_rec(a, center +1, right);

	int max_left_border_sum = 0, left_border_sum = 0;
	for (int i = center; i >= left; i--) {
		left_border_sum += a[i];
		if (left_border_sum > max_left_border_sum) {
			max_left_border_sum = left_border_sum;
		}
	}

	int max_right_border_sum = 0, right_border_sum = 0;
	for (int i = center + 1; i <= right; i++) {
		right_border_sum += a[i];
		if (right_border_sum > max_right_border_sum) {
			max_right_border_sum = right_border_sum;
		}
	}

	int max_sum = max(max_left_sum, max_right_sum);
	max_sum = max(max_sum, max_left_border_sum + max_right_border_sum);
	return max_sum;
}


int max_sub_sum(const vector<int> &a) {
	return max_sum_rec(a, 0, a.size() - 1);

}
```

注意：没有处理向量长度为奇数的情况。

## 方法三

此方法异常简洁，而且很好理解。从开头开始累加，一个为负的元素不可能是最大子序列的第一个元素，另外和为负的子序列不可能是最大子序列的前缀，所以当 `this_sum` 小于 0 时，将其置为 0。复杂度 O(N)。


```c++
int max_sub_sum(const vector<int> &a) {
	int max_sum = 0;
	int this_sum = 0;

	for (int i = 0; i < a.size(); i++) {
		this_sum += a[i];
		if (this_sum > max_sum) {
			max_sum = this_sum;
		} else if(this_sum < 0) {
			this_sum = 0;
		}
	}
	return max_sum;
}
```

