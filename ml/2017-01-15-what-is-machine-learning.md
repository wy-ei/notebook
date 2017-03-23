---
layout: post
title: 什么是机器学习
category: 机器学习
---

机器学习是计算机科学的一个分支学科，主要研究给计算机学习的能力。传统的编程是给机器下指令告诉机器在什么时候做什么事情，以及如何做。而机器学习则是通过大量数据和一些智能算法，让机器从数据中学习。

Tom M. Mitchell 给出了下面这样的定义：

> "A computer program is said to learn from experience E with respect to some class of tasks T and performance measure P if its performance at tasks in T, as measured by P, improves with experience E."


机器学习中问题可以分为三大类：

1. 监督学习（supervised learning）
2. 非监督学习（unsupervised learning）
3. 强化学习（reinforce learning）


### 监督学习

提供大量训练样本，每个样本有其输入和对应的输出，算法通过这些样本学习到一个由输入到输出的映射关系。如果输出是连续的值，那么这就是一个回归问题。如果是离散的，那就是分类问题。

### 非监督学习

算法被提供大量样本，算法需要分析整个样本集，将样本分为多个类别。

### 强化学习

机器在学习的过程中，会接受到外界的反馈，这些反馈会作为惩罚或者奖励。算法通过反馈不断修正自己的学习。


Wikipedia 上关于机器学习的算法列表：[List of machine learning concepts](https://en.wikipedia.org/wiki/List_of_machine_learning_concepts)
