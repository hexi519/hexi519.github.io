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



# hesy summary

* 这篇由于篇幅够长，所以逻辑上的展开比DCOSS'16的那一篇要好不少，尤其是还有不少[好词好句好图](#good sentense & good pics)值得学习(introduction的论述也可以摘抄)



# 1. introduction

* 这段抨击rule-based CC特别值得学习

  * 指出classical CC的特征rule-based 并解释 rule-based的具体体现是什么

    This limitation stems from the fact that these protocols are built on the common concept of relying on <u>pre-configured</u> rules to guide the behavior of end hosts (e.g., how to change the congestion window size) given specific observations of the surrounding environment (e.g., mea- sured throughput, RTT). For example, the NewReno protocol uses the well-known additive increase, multiplicative decrease (AIMD) strategy, and Cubic adopts a well-crafted function to adjust the congestion window size (cwnd) given feedback from the receiver.

  * 说明rule-based带来了两方面的影响【我觉得缺少引用】

    This rule-based design can cause two problems: First, it causes congestion control protocols to be unable to adapt to new scenarios when a network environment changes. Since different kinds of networks differ in significant ways with respect to bandwidth, delay and network topology, a given TCP flavor that works well for a specific network might not work in another. Second, the rules of operation are usually built upon standard assumptions or the network model. When either changes, the fixed mapping between observation and actions means that TCP does not intelligently adjust its behavior by learning from experience. As a result, the protocol repetitively adopts the same cwnd changing rules that bring sub-optimal performance, without the flexibility to adjust behaviors for better performance (Sec. 2).

* proposed approach:

  *  先描述这是个什么

    * 功能、使用的工具简介 ( 主要要针对你要抨击的点 )

      > 在这项工作中，我们使用强化学习（RL）设计一种称为QTCP（基于Q学习的TCP）的拥塞控制协议，该协议可以自动识别最佳的拥塞窗口（cwnd）变化策略，并对此进行了观察。 在线方式连接周围的网络环境。 它不需要手工制定的规则集或耗时的离线培训过程。  RL使代理能够根据实时反馈调整其行为，并通过阻止无效行为来避免重复相同的错误。 

    * 主打的特点 ( 还是要针对你要抨击的点 )

      > 我们在QTCP中利用此功能，使发件人可以动态地学习不同的策略以更好地适应各种网络情况，而不必机械地遵循固定的规则。 具体来说，QTCP基于从网络环境收集的性能指标的测量值，连续更新协议的可能状态-动作对的值，并使用Q学习算法搜索最佳动作，即如何调整Cwnd。 在特定状态下，以使发送者的长期回报最大化。

* Challenges and Innovations: 

  > 尽管已证明RL在许多困难的问题（例如Go，自动驾驶）上表现良好，但由于问题的连续高维状态空间，将其应用于TCP拥塞控制尤其具有挑战性。 状态空间的大小可以随状态空间的大小呈指数增长，从而导致存储状态操作值所需的表的大小显着增加。 在如此大的表中更新条目通常非常耗时，这会导致培训时间过长。 为了加快学习过程2327-4697并使QTCP易于处理，我们应用了函数逼近[6]，这是一种有效的方法，可以减少使用抽象状态表示进行搜索和探索所需的状态空间大小。 尽管有许多函数逼近算法可用，但我们选择Kanerva编码[7]，也被称为稀疏分布式内存（SDM），因为它的复杂度低，收敛速度快，并且在解决大，高维和连续状态的问题上的有效性 空格。  Kanerva编码的思想考虑了这样一种设置：整个状态空间由精心选择的状态空间子集表示，基于该子集存储训练值并评估派生的策略，从而显着降低了内存消耗和价值训练的计算复杂性 。 但是，我们发现，由于状态空间子集的选择不当，原始Kanerva编码的性能在实践中并不令人满意。 为了解决这个问题，我们提出了一种新的方法，即基于泛化的Kanerva编码，该方法可以调整状态空间子集的每个条目的抽象级别，从而在探索该子集时动态重新分配该子集以找到其接近最佳的结构。 状态空间。 我们的方法允许根据访问状态来更改状态抽象的粒度，其中将检查具有不正确泛化级别的子集的不太重要的条目，并将其替换为提供更好泛化的条目。 这克服了传统的Kanerva编码算法及其变体的局限性，使QTCP具有更快的收敛速度和更好的整体学习性能。

* Contribution

  • 我们描述了QTCP，这是一种基于Q学习的拥塞控制协议，它可以自动学习有效的策略来调整cwnd以在线方式实现高吞吐量和低延迟。 这从根本上改变了以前类似NewReno的TCP变体的设计，这些变体需要固定的手动选择的规则。
    • 我们提出了一种新型的Kanerva编码算法，该算法在应用于大型复杂状态空间时可以很好地缩放，并且可以大大加快收敛速度并提供稳定的性能。 我们的算法允许学习值不再以表格形式存储，因此消除了在应用于大规模问题域时RL技术的重要限制，例如无法处理巨大状态。



# 2. Background and motivation



# 3. QTCP: APPLY Q-LEARNING TO TCP CONGES- TION CONTROL

* good sentenses
  *  逻辑

* 开场白如上

* overveiw of Q-TCP

  * 交互框架

  * 强化学习问题的五元素 简介（具体的再后面有更加翔实的接好

    > 这里给出了一个很好的提醒，应该是“马尔可夫**过程**”和“强化学习**问题**”，以前一直说的是“马尔可夫**问题**”，which不正确哇，MDP是用于RL问题建模中的一部分而已。

  * 实现中的challenge以及我们的解决方案（华彩



......



# good sentense & good pics

* preliminary statements of Section 3

  ​	在本节中，我们探索使用RL来自动设计拥塞控制策略。RL具有克服上述基于规则的TCP问题的潜力，因为它可以使代理从过去的经验中学习，而无需手动制定规则或网络场景的先验知识。
  ​	Specifically，**<u>我们讨论如何将经典的RL算法Q学习应用于拥塞控制问题和提出QTCP领域</u>**：一种新的拥塞控制协议，该协议使发送者可以通过与 网络方案。

  

---

* good pics

![image-20201026111944751](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/111948-47405.png)