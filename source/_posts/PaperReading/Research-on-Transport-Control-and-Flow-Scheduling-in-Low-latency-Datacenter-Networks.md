---
title: >-
  Research on Transport Control and Flow Scheduling in Low-latency Datacenter
  Networks
top: false
cover: false
toc: true
mathjax: true
date: 2020-08-08 21:39:43
categories: PaperReading
description: data center TCP congestion control ， 做了三方面的工作
tags:
	- Network
	- Congestion Control
---











# 第一章 引言

* 数据中心应用类型
* 数据中心流量特性
* 仍存在的问题

![image-20200808214442717](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202008/08/214444-685710.png)

说实话感觉这里讲的不是很清楚，回头再来仔细梳理下把。



# 第二章 背景和相关综述

* 传统TCP及研究进展
  * 调整AIMD参数 --》good idea ==但是还是那个问题，为什么要搞pacing，而放弃窗口==
  * ==incast 难道是数据中心特有的问题?== 其实只要BDP足够小就可以把？RTT不够小，但是我bandwidth够小总可以吧？
  * DCTCP是解决TCP incast的？？

