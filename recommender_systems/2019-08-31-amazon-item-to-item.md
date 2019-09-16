---
layout: post
title: 论文阅读 - Item-to-Item Collaborative Filtering
category: 推荐系统
tag: 推荐系统
---

- *
{:toc}

本文是我在阅读 Amazon 工程师 2003 年发表的论文 Item-to-Item Collaborative Filtering 时记录的笔记。

## 介绍

Amazon.com 的推荐系统所面对的挑战：

- 海量商品+海量用户
- 实时推荐，半秒内做出响应，且生成可靠的推荐结果
- 新用户的信息很少，老用户有大量的信息
- 用户的信息是易变的，用户在短时间内产生的交互信息，就能改变用户的特征，推荐系统需要快速地对用户特征的改变做出反应。

传统的 CF 算法，不能满足实时性要求，这里提出 item-to-item collaborative filtering 算法，它的计算量独立于用户数量和商品数量，可以在海量数据的场景下，实时地产生高质量的推荐。

## 推荐算法

### 传统的协同过滤

传统的协同过滤算法将用户表示为一个长度为 $n$ 的向量 $v$，N 是系统中物品的个数，$v_i$ 代表用户有没有购买过商品 $i$ 或者对商品 $i$ 的评分。

根据用户向量，可以为每个用户找到一组相似的用户，相似用户购买过或评价高的物品，就可以推荐给该用户。用户的相似度可以通过用户向量间夹角的余弦值来度量：

$$
\operatorname{similarity}(\vec{A}, \vec{B})=\cos (\vec{A}, \vec{B})=\frac{\vec{A} \bullet \vec{B}}{\|\vec{A}\| *\|\vec{B}\|}
$$

设系统中有 M 个用户，N 件物品，给目标用户寻找相似用户需要 $O(MN)$，遍历所有用户，计算用户向量的相似度。但是因为用户向量往往是非常稀疏的，所以实际复杂度为 $O(M)$。即便如此，在上亿用户的场景下，这个时间复杂度也是无法接受的。

一种权衡的策略是，随机抽一部分用户以减小 M，抛弃掉冷门物品以减小 N。还可以使用聚类，降维等策略来减小计算量。但以上这些策略会引起推荐质量的降低。

### Cluster Models

聚类模式的策略是将用户先进行聚类，聚类操作可以离线进行。聚类后所有用户被分到了一些小的分组中，且彼此较为相似。对于目标用户，在组内寻找最相似用户，并生成推荐。

### Search-Based Methods

基于搜索（或基于内容）的策略通过 item 的属性，比如文本、类别等，来寻找相似的 item。用用户购买过的商品，构造一个 query 然后检索出匹配的 item。当用户只有少量的购买记录时，这种方法还勉强奏效。当用户购买记录很多的时候，就很难确定要搜什么东西了，得到的结果是很热门的那些 item，或者范围很窄，比如老是推荐某个作者的书或某一类物品。推荐系统应该帮助用户找到那些新鲜的、相关的、用户感兴趣的物品。

## Item-to-Item Collaborative Filtering

item-to-item CF 寻找与用户购买过的物品相似的其他物品，组合这些相似物品，得到最终的推荐结果。

> Rather than matching the user to similar customers, item-to-item collaborative filtering matches each of the user’s purchased and rated items to similar items, then combines those similar items into a recommendation list.

### 算法细节

这里提出的算法依然需要计算 item 间的相似度，只不过 Amazon 的这篇论文提出了一种计算 item 间相似度的策略。

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2019/08/31/5d6a503b451253d178065409.jpg)

从某个用户同时购买过的多个 item 间开启计算，而不是拿某个 item 和其他所有 item 进行计算。因为很多 item 之间并没有某个人都购买过，这两个 item 间的相似度是没法算的。通过上面给出的算法，可以减少计算量。 

计算完成之后，每个 item 都被关联了 k 个相似的物品。

### 可扩展性

item-to-item collaborative filtering 能够应对大量数据场景，因为 item 之间的相似度具有持久性，可以预先离线进行计算。

## 总结

通过阅读论文，我感觉 collaborative filtering 在早期（2000年左右），专指 user-based CF，即通过找相似用户，用相似用户喜欢的物品作为推荐结果的方法。后来慢慢引入了 item-based（如本文所描述），然后才将 CF 算法分为 user-based 和 item-based。

本文就讲了 item-based 的具体做法，关于相似度计算等方法，就和 user-based CF 一样，所以没有再提。另外 item 之间计算相似度的策略（即前面伪代码所描述）也值得学习。