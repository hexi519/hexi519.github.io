---
top: false
cover: false
mathjax: true
title: deeprm
date: 2020-12-17 19:11:59
categories:
description:
tags:
---

方案1：

一共有j个执行器， 输出的是j维的向量，每个的值就是

一般是25个node的spark

状态空间实在是太大了 --》指数级



方案2：

每一个执行器执行完之后，就输出一个（从空余的task中选择的）可执行的task



方案3：
输出二维向量 <v ,l>  ( v是node ， l是资源限制 )

> ==会有很多等价决策 ？？== ，比如说 l分配的比当前的

？ 如果 l 比较大，怎么砍



v~1~,v~2~,v~3~,v~i~ 下一个要执行的task 