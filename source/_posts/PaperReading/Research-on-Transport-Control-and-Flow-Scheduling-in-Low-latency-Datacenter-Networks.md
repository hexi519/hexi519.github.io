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
  * ==incast 难道是数据中心特有的问题?== 其实只要BDP足够小就可以把？RTT不够小，但是我bandwidth够小总可以吧？TCP incast不就是拥塞么?
    * 我感觉只要是低延迟链路，就会有这种情况 （一旦有超时发生， 网络中会出现长时间的链路闲置状态）
    * 如果要在数据中心做，得考虑放弃短流的调度，只调度长流？看看iroko怎么做的？
  * DCTCP是解决TCP incast的？？



* TCP incast

  * 以前的解决方案

    > 第一类的主要方法是修改TCP配置参数，将RTO设置为微秒级 别，从而减小超时重传所需的等待时间; 第二类为修改TCP的拥塞控制算法，提高 缓存利用率，进而避免丢包；第三类是通过修改QCN算法来提高协议公平性；第 四类摒弃 TCP 方案采用 UDP 方案彻底避免超时重传的问题。

* 多种流量共存

  * 长流(重视高吞吐) & 短流(重视低延迟) --》 目标不同

  * 相互作用：长流容易造成短流的饥饿

  * 还有部分应用存在截止时间需求 ，whose 主要性能指标是截止时间错过率

  * 应对措施

    > 非截止时间流调度机制和传输协议研究，截止时间流调度机制 和传输协议研究和混合流调度机制和传输协议研

* 任务调度

![image-20200809154826511](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202008/09/154827-641523.png)



# 第三章 支持选择性反馈的编码传输协议研究研究

* 关于发送速率，on friendliness ，需要做的是：找论文背书，基于别人的公式进行建模

  



# 第四章 数据中心网络的混合流调度机制SMF

> 这一部分讲的比较详细

## miscelleneous

* 如何判断截止时间流还有非截止时间流本身也是个很大的问题啊！
* 传统解决方案中，基于速率的控制协议（RCP）到底是什么呢？Karuna采用的MCP又是什么呢?



## 算法思路

* SMF
  * 对于非截止事件流，采用SJF
  * 对于截止事件流，采用MLFQ
  * 是满足多重目标的分布式拥塞控制协议，旨在调度混合流以改善流完成率和流完成时间
  * 也对初始窗口大小做了改进，where也很重要。裴丹的，实际上是根据具体的业务进行改进了的。看看SMF采取了哪些feature，怎么做的，或许也是一个点？

*  NP-hard问题证明
  * 截止时间流
  * 非截止时间流（ 感觉讲得也很粗糙
  * 所以使用启发式
* 对于不能在截止时间前完成的流，**“早丢弃”**方式提前丢弃以节省网络带宽
  * ==自己的机制里面如果太简单，也可以加一些“早丢弃”等手工的规则==

* 考察指标

<img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200809171054378.png" alt="image-20200809171054378" style="zoom: 80%;" />



# 第五章 任务级别的截止时间感知流调度机制研究TAPS

## 重要性

* 如果某任务没有在截止事件前完成，那么该任务已经成功传输完成的所有数据都是无用数据。非常不幸的是，数据中心网络中采用的大部分传输协议，都是基于竞争的传输协议，如 TCP，RCP[35]，ICTCP[10]，DCTCP[2]，采用平均分配带宽的原则为网络中互相竞争的每条流分配链路以及可用带宽。这些方案固然可以有效将数据流从源端传输到目的端，但是他们忽略了数据流或是任务的截止时间，同时也没有意识到不同流之间的区别，无法做到最小化网络流完成时间。

* 统计数据表明，对于 web 应用，每个任务至少包括 88 条流[2]，对于 MapReduce 搜索工作每个任务包含 30 到 50000 条流[6]，对于 Cosmos 每个任务约包含 30 到 70 条流[97]。这些统计数据表明在数据中心内，很多应用对于每个任务会产生相应的多条数据流来完成，因此任务才是处理的单位。



## 算法

使用SDN
