---
title: Fuzzy Kanerva-based TCP Q-learning
date: 2020-10-25 16:13:55
categories: PaperReading
description: DCOSS'16 主要梳理下行文思路，用于写作学习
tags:
    - Network
    - Reinforcement Learning
    - Congestion Control
---





# abstract

* 【**Background: important things and urgent need**】 

  Advances in YY technology have resulted in **pervasive deployment** of devices of ... . **The need** for **XX** that ....( 描述下对XX的性能期待, e.g. 高吞吐,低延迟 )  **necessitate re-thinking** of conventional design of （你要研究的领域/东西）.

  > 无线技术的进步已导致在尺寸，存储和计算能力方面具有高度可变性的设备的普遍部署(pervasive deployment)。 为了保持以高可靠性传送数据的连续连接，需要重新考虑传统的传输层协议设计。



* 【**What we propose and what's its features**】

  **This paper investigates** the use of **ZZ **（你使用的算法/技巧/工具） in **YY**（你研究的领域）... , **wherein** ...（描述下你做了什么）. **Furthermore**, it demonstrates how ...(具体描述下研究工作中华彩的细节，套路大概就是"我发现了xx(性能瓶颈)在实现的时候很关键，我们是这样解决的")

  > 本文研究了在拥塞避免状态期间Q学习在TCP cwnd adaptation中的使用，其中窗口的经典alternation已被replaced，从而允许协议立即响应先前看到的网络条件。此外，它展现了内存如何在构建探索空间中发挥关键作用，并提出了通过函数逼近来减少此开销的方法。[ 后面这句话实际上不是一个addtional point，还是在讲这个scheme本身，只不过是scheme的细节，which 是自己的巧思体现之处。] 



* 【**Performance description**】

  **The superior performance** of <u>our</u> approach over *Baseline XX* is **demonstrated through a comprehensive simulation study**, **revealing** xx% and xx% improvement in *metric1* and *metric2* respectively,on real-world(classic) traces/topologies. **We also show** **how** **ZZ **（你使用的算法/技巧/工具） **can be used to** (处理上一段所说的性能瓶颈，while 保持了一个好的performance( 高吞吐/低延迟,这个还是要细点说的) ) .

  * 这里our换成别个描述characteristic的形容词更好，e.g. learning-based/data-driven

  > 通过全面的仿真研究证明了基于学习的方法优于TCP New Reno的性能，对于评估的拓扑，吞吐量和延迟分别提高了33.8％和12.1％。 我们还展示了如何使用函数逼近来显着降低基于学习的协议的内存需求，同时保持相同的吞吐量和延迟。

  

# 1 introduction

快到1页

# 2 motivation and practical relevance

快到1页

# 3 ==related work==

> 这一段写的贼好，要好好学习！

一栏

* 传统CC的问题

* 现在CC的问题

* 其他CC相关的工作

  > 应用机器学习来帮助提高TCP性能的其他工作很少。 例如，[13]使用机器学习来构建损耗分类器，以区分链路损耗和拥塞损耗，[14]和[15]使用机器学习来更好地估计RTT和吞吐量。 这些技术都不能直接调整cwnd。



# 4 Q-learning-based TCP

> 整体

​	我们提出的算法TCPLearning是基于强化学习的协议。 在强化学习中，学习主体在没有先验知识的情况下与环境交互，根据所学习的策略选择动作，获得正面或负面的奖励，然后观察环境的下一个状态。学习代理的目标是制定一种策略，即状态空间到动作空间的映射，以最大化长期打折的奖励。 此后，TCPLearning不再想PCC那样使用probe来检测不同动作对性能的影响，而是使用增强算法Q-Learning来学习最佳策略，以根据经验直接在每个状态下做出动作选择。
   TCPLearning发送方使用New Reno协议的正常慢启动阶段。 如果慢启动在cwnd超过阈值时结束，则拥塞控制过程将进入拥塞避免阶段，我们的学习算法将接管控制cwnd。 如果由于观察到拥塞而导致慢速启动结束，则New Reno协议继续，并且不使用学习算法。 如果在拥塞避免阶段检测到数据包丢失，则学习算法将停止，并且将应用New Reno协议来实现快速重传和快速恢复。
   **与在New Reno中一样，TCPLearning的最重要任务是调整cwnd的大小。 在每个时间段（通常是一个RTT）中，我们的算法通过处理ACK信息来收集吞吐量和RTT值，然后将它们组合成单个效用函数U。效用函数随着吞吐量的增加和延迟的减少而增加。 该算法的目标是了解cwnd大小的变化如何增加效用函数的值。
   学习算法使用Q学习来学习策略以选择动作并实现其目标。Q学习使用简单的值迭代更新过程。 在时间t处，对于每个状态st和at处的每个动作，算法按如下方式计算对其预期折现奖励或动作值函数Q（st，at）的更新：**



​	其中rt + 1是时间t +1的即时奖励，αt（st，at）是折现因子，使得0≤γ<1。Q学习是学习率，使得0≤αt（st，at）≤  1和γ将Q（st，at）值存储在称为Q表的表中。 更新Q（st，at）值的时间复杂度为O（| A |），其中| A | 是动作数。

---

> 状态

​	系统的状态由四个状态变量表示，<u>状态变量的值通过离散化划分</u>：

   •新接收到的ACK之间的间隔时间的移动平均值，离散为10个间隔。
   •发送方发送的数据包之间的间隔时间的移动平均值，离散为10个间隔。
   •当前的RTT与到目前为止找到的最佳RTT之比，离散为10个间隔。
   •缓慢启动阈值，离散为10个间隔。

---

> 动作

![image-20201025210336629](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/25/210337-366485.png)

​	表II总结了更改cwnd的可用操作。 

​	奖励函数基于效用值的变化：

​				U = loge（吞吐量）-δ×loge（延迟）吞吐量

​	其中δ表示延迟相对于效用函数的相对重要性。 在我们的实验中，δ设置为1。

​	奖励函数等于：

	* +2，如果效用在时间段t之后增加
	* -2，如果效用在时间段t之后减少。  

​	其中t设置为0.1s（在我们的实验中为一个RTT）



# 5 .FUZZY KANERVA-BASED TCP Q-LEARNING

> 先讲总体的思路，再讲细节的设计

> ==对应于我就是先讲总体的流程，然后再讲 1. lstm的设计  2. attention的设计==

* function approximator的重要性

  * 现有的一些方法，以及他们存在的一些问题

  * 我们使用的Kanerva编码的原理和formulation，以及如何融入我们这个框架里面的

    > 请注意，这里阐述细节并不是为了讲算法原理，而是要讲清楚如何讲算法应用到我们这里面来的

