---
top: false
cover: false
mathjax: true
title: VLB
date: 2020-11-10 11:50:45
categories: ExtensiveReading
description: Algorthms for Next Generation Netwroks'2010
tags:
    - Network
    - Routing
---





* 全称 valiant load balance ( 这里的Valiant是个人名)



# 1 introduction

> 在许多网络中，流量矩阵要么难以度量和预测，要么随时间变化很大。 在这些情况下，使用Valiant负载平衡（VLB）支持所有可能的流量矩阵是一种有吸引力的选择。 例如，即使由于高水平的聚集而导致Internet主干网中的流量非常平滑，但仍然很难测量。 准确地测量流量矩阵（例如使用NetFlow）太昂贵了，无法一直进行下去，而使用链路测量的标准方法会产生20％或更多的误差。 
>
> 即使可以令人满意地获得当前的流量矩阵，但由于Internet流量增长的不可预测性，将其推断到未来仍充满不确定性。 最后，由于Internet流量是动态的，因此流量矩阵可以随时偏离其正常值，从而可能导致拥塞。 网络看到的流量需求可以由流量矩阵表示，该矩阵表示每个节点向每个其他节点发起流量的速率。 我们说如果网络中的每个链接的流量矩阵所引起的负载小于链接的容量，则网络可以支持流量矩阵。 当网络无法支持提供给它的流量矩阵时，网络中至少一个链路的负载大于其容量。 发生拥塞，缓冲区中的积压积淀在拥塞的链路上，从而导致数据包丢失，增加的延迟以及延迟的高度变化。 理想情况下，我们希望设计一种可以支持各种流量矩阵的网络，以使拥塞很少发生或根本不发生。 
>
> 在本文中，我们讨论了VLB在构建网络中的使用，该网络可以有效地支持不会超额预订任何节点的所有流量矩阵。 我们首先简要地调查了VLB在网络各个方面的广泛使用，并描述了在网络中使用VLB的基本情况。

* 文章结构

  第2.2节将VLB从同质设置扩展到具有任意容量的网络，第2.3节介绍了如何预防和快速恢复VLB网络中的故障，第2.4节建议使用VLB在两个网络之间路由流量。 最后，第2.5节讨论了未来可能的工作。



## 1.1 wide use of VLB

> 在1980年代初期，Valiant [19]首次提出了一种通过随机挑选的中间节点到数据包目的地的路由方法。 他表明，<u>在N节点的二元立方网络中，在任何排列流量矩阵的情况下，分布式两阶段随机路由可以在O（log N）时间内以压倒性的概率将每个数据包路由到其目的地。 这是在O（log N）时间内在稀疏网络中路由任意置换的第一个方案</u>。 **从那时起，这种随机路由已被广泛使用，通常称为（VLB），随机负载平衡或两阶段路由**。  VLB具有许多良好的特性。 **它是分散的，每个节点都在本地决策。 这也使该方案可扩展。**  VLB is agonistic to traffic matrix，because <u>**randomness erases the traffic pattern ( 我觉得这里的意思是随机性会抵消流量模式 )，and different traffic pattern can result in the same load on the links**</u>。 
>
> <u>在发明之后不久，它就被用于其他互连网络中以进行并行通信，以缩短传送时间[1]，并减轻不利的流量模式的影响[13]</u>。 ==还有这种作用...[13]里面提到的omega network又是什么?下面的torus network又是啥...== 近年来，它适用于环形网络（torus networks）中的路由[17，18]，以便在不牺牲平均情况性能的情况下提供最坏情况的性能保证。 关键是使用VLB adaptively，这是基于以下观察：在低负载下，仅进行少量负载平衡就可以避免拥塞。  VLB还用于楼宇网络交换机，具有极大的可扩展性和性能保证，而无需集中式调度程序。 它用于ATM交换机[7]，路由器[4、5]，光路由器[3、9]和软件路由器[2]。 特别是，该方案is rediscovered (我觉得这里可以理解为重新挖掘)，用于设计路由器交换结构[4]来缓解路由器的扩展挑战，因为集中式方案很难跟上不断增长的链路速度。 在这种情况下，已证明拆分流量 in a round-robin fashion对链路负载的影响与随机拆分[4]相同，就支持所有流量矩阵所需的总互连容量而言，这是最有效的[8]。 
>
> 几乎同时，几个groups将VLB的思想独立地应用于Internet的流量工程和网络设计，以便有效地支持所有可能的流量矩阵。  Kodialam等人的两阶段路由[11，12] 是个traffic engineering方法，其中在固定容量的链路上建立了完整的隧道网格，并在网络的两个阶段（即两跳）中发送数据包。 网络。  Winzer等人的选择性随机负载平衡[14、16、21]使用VLB及其变体来设计经济高效的光网络。 他们的模型假设链路的成本包括光纤和终端设备，因此有减少链路的动机。 在最佳设计中，流量仅负载均衡到几个中间节点。  Zhang-Shen和McKewon [23，25]提出在骨干网的逻辑全网状网络( logical full mesh )上使用VLB，以支持所有流量矩阵并快速从故障中恢复。 另外，VLB还用作以太网LAN [20]中的光路由策略，用于城域WDM环中的调度[10]，电路交换网络[22]，以及数据中心网络的规模化和commoditizing[6]。
>
> 对VLB网络的排队属性的研究[15]发现，VLB消除了网络中的拥塞，伪随机（例如，循环）负载平衡减少了排队延迟。 当用于在网络之间路由流量时，VLB还可以消除对等链路上(peering links)的拥塞[26]。

* ==??== 如何做到的，本地决策，随机路由？还是没说啊...

* 可以在application flow level 处理 packet-by-packet或者flow-by-flow

* 分割按照random和deterministic都是一样的效果（已经证明出来



## 1.2 Simple VLB Network

> 这里的capacity指的是可以发起(initiate)和接收(receive)多少流量，缓冲区采用absorb这个词

在full-mesh且每个节点的接收容量都是r的前提下，我们可以得到结论 : 相比于没有LB的（routing through direct path），VLB可以达到N/2倍的效率

<img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201111145531666.png" alt="image-20201111145531666" style="zoom:80%;" />



# 2 VLB in Heterogeneous Networks

牵扯到分配比了，异构里面最简单的就是按r~i~的大小为权重进行分配，which is a direct generalization from uniform multicommodity flow in the homogeneous case to product multicommodity flow.



# question

* 里面有问题还是要ask下...
  * smooth traffic
  * NetFlow to measure traffic matrix accurately
    * using link measurement ，难道还有别的方法么？
    * 配置在哪里，需要路由器配置一些特殊服务么？
  * N-node binary cube network这个架构要了解下，可以问问王帅
* 应该找个综述看看...(比如说18年那个)
* 路由分割如何保证包不乱序
* 流量工程和路由什么关系...



* 整理下好词好句



# inspiration

* 感觉思路是 证明是NP难问题，然后用强化学习去解？



# [基于Internet的路由策略综述研究](http://www.jsjkx.com/CN/article/openArticlePDF.jsp?id=15181) 另外开一个中文综述的文件

> 这篇文章不错啊，文绉绉的。

* QoS路由问题的核心就是对网络多约束条件下路由选择中的额NP完全性问题求解。

* 这是为啥

  <img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201111154656841.png" alt="image-20201111154656841" style="zoom:67%;" />

* 路由策略设计原则

  * 等强设计原则
  * 降低成本原则
    * 需要信息越多，消耗的成本越高
  * 面向应用中的服务质量要求的原则
    * 网络应用大致分为四类
      * 非实时数据
      * 实时图像
      * 实时声音
      * 视频会议

  * 03年的时候，不确定模型、动态模型、自适应模型是研究热点

    * 不确定性模型

      针对网络状态信息不精确提出的。途径有：

      * 采用模糊理论进行不精确描述和概率分析 ；

      * 鉴 于神经网络不需要精确的系统描述（？这个着实没懂😓），只需要训练学习，能够实现联 想推理，容错性强，且 具有并行结构，实时性强 ，因此可以采用神经络对不精确模型进行 建模 ；
      * 在网络系统的路由 、调度 、接纳控制等算法中引入随机 性方 法 与策 略 ；
      * 将预先计算和在线计算相结合

    * 动态模型

      动态特性，即系统必须在运行过程中实时处理出现的异常、随机事件和局部故障，实现动态重构。【有点像快速重路由干的事情】

    * 自适应模型

      感觉就是我们现在做的事情

    

# 基于深度强化学习的物联网智能路由策略

