---
title: rlReview
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-20 01:28:19
categories:
description: Summary
tags:
    - Reinforcement Learning
---

强化学习相对于监督学习为什么训练会更加困难？（强化学习的特征）

答：

强化学习处理的多是序列数据，其很难像监督学习的样本一样满足IID（独立同分布）条件。

强化学习有奖励的延迟（Delay Reward），即在Agent的action作用在Environment中时，Environment对于Agent的State的奖励的延迟（Delayed Reward），使得反馈不及时。

相比于监督学习有正确的label，可以通过其修正自己的预测，强化学习相当于一个“试错”的过程，其完全根据Environment的“反馈”更新对自己最有利的Action。