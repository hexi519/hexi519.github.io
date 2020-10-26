---
title: QTCP: Adaptive Congestion Control with Reinforcement Learning
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-25 15:57:22
categories: PaperReading
description: TNSE'19 主要梳理下行文思路，用于写作学习
tags:
    - Network
    - Reinforcement Learning
    - Congestion Control
---




# abstract

​	下一代网络访问技术和Internet应用程序增加了向具有传统拥塞控制协议的用户提供令人满意的体验质量的挑战。 在广泛的网络场景下，通过根据特定的网络体系结构或应用程序修改核心拥塞控制方法来优化TCP性能的努力并未得到很好的推广。 这种限制源于基于规则的设计原理，其中，性能与网络的观察状态到相应操作之间的预定映射有关。 因此，这些协议无法适应其在新环境中的行为，也无法从经验中学习以获得更好的性能。 我们通过在我们称为QTCP的方法中将基于增强的Q学习框架与TCP设计集成在一起来解决此问题。  QTCP使发送者能够以在线方式逐渐了解最佳拥塞控制策略。  QTCP不需要硬编码的规则，因此可以推广到各种不同的联网方案。 此外，我们开发了一种广义的Kanerva编码函数逼近算法，该算法降低了值函数的计算复杂度和状态空间的可搜索大小。 我们展示了QTCP在保持低传输延迟的同时，提供了59.5％的更高吞吐量，从而胜过了传统的基于规则的TCP。





# introduction

* 这段抨击rule-based CC特别值得学习

  * sd

    This limitation stems from the fact that these protocols are built on the common concept of relying on <u>pre-configured</u> rules to guide the behavior of end hosts (e.g., how to change the congestion window size) given specific observations of the surrounding environment (e.g., mea- sured throughput, RTT). For example, the NewReno protocol uses the well-known additive increase, multiplicative decrease (AIMD) strategy, and Cubic adopts a well-crafted function to adjust the congestion window size (cwnd) given feedback from the receiver.This rule-based design can cause two problems: First, it causes congestion control protocols to be unable to adapt to new scenarios when a network environment changes. Since different kinds of networks differ in significant ways with respect to bandwidth, delay and network topology, a given TCP flavor that works well for a specific network might not work in another. Second, the rules of operation are usually built upon standard assumptions or the network model. When either changes, the fixed mapping between observation and actions means that TCP does not intelligently adjust its behavior by learning from experience. As a result, the protocol repetitively adopts the same cwnd changing rules that bring sub-optimal performance, without the flexibility to adjust behaviors for better performance (Sec. 2).