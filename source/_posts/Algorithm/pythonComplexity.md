---
top: false
cover: false
mathjax: true
title: pythonComplexity
date: 2020-12-05 15:17:45
categories: Algorithm
description: 有时候用python刷题不小心就out of time limit , 记录整理一些常用的python操作的时间复杂度。
tags:
    - Analysis
---



* refer

  [python常用操作复杂度](https://www.jianshu.com/p/a8fa3d31aa40)



---

很多时候我以为python会优化的...结果居然没有优化...

* list

  list.index()	O(n)

  in  O(n)

* set

  in  最差O(n)，平均情况下是O(1)
  
* dict

  > 其实python中的dict就是一个哈希表的实现。
  >
  > 哈希表最差情况下查找是O(n) ,但是满足一定的假设，可以认为其平均性能是O(1)

  * 插入、访问、清空、删除  都是O(1)



* OJ tips
  * 一般来说时间复杂度是O(1e9) , 空间复杂度不要超过O(1e7)

