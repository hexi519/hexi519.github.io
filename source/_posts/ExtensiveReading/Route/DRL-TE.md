---
title: DRL-TE | Experience-driven Networking, A Deep Reinforcement Learning based Approach
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-19 10:25:51
categories: ExtensiveReading
description: Infocom'18 【一句话概括这个工作】
tags:
    - Network
    - Reinforcement Learning
    - Routing
---



# hesy summary 

* 感觉这篇文章文笔不行啊...一看就是中国人写的...[果然，作者全都是中国名...]
* evaluation还是很不错==哪里不错??==

---

* 排队论不适合多跳排队问题的建模
  * 强假设不能满足
  * 多跳排队还是个open problem
  
  ==那排队论研究的是什么问题??==



## 便于后期整理的信息

* 创新点/主要思想
  * 首次用DRL
  * 提出了DRL-TE的框架
  * 改进了算法==？？==
* 算法使用
  * RL 
* 实验设置
  * ns3
  * 代表性和随机性的网络拓扑
* 效果
  * 提升了吞吐，降低了延迟	==所以为什么能降低延迟??==
  * 对网络变化更有鲁棒性  (==如何得出这个结论？==)



# abstract

​		现代通信网络已经变得非常复杂且高度动态，这使其难以建模，预测和控制。 在本文中，我们开发了一种新颖的体验驱动方法，可以像人类学习新技能（例如驾驶，游泳等）一样，根据自身的经验而不是准确的数学模型来学习很好地控制通信网络。 具体来说，我们首次建议利用新兴的深度强化学习（DRL）在通信网络中实现无模型控制； 并针对基础网络问题：流量工程（TE），提出了一种新颖且高效的基于DRL的控制框架DRL-TE。通过共同学习网络环境及其动态性，并在强大的深度神经网络（DNN）的指导下进行决策，**所提出的框架最大程度地提高了广泛使用的效用函数**。**我们提出了两种新技术**，即TE感知探索和基于行为者批评的优先体验重播，以优化通用DRL框架，尤其是针对TE的框架。 为了验证和评估所提出的框架，我们在**ns-3**中实施了该框架，**并使用代表性和随机生成的网络拓扑进行了全面测试**。 

> 这里的代表性和随机性

​	广泛的数据包级仿真结果表明：1）与几种广泛使用的基准方法相比，DRL-TE显着<u>降低了端到端延迟</u>，并不断提高了网络实用性，<u>同时提供了更好或相当的吞吐量</u>；  2）DRL-TE对网络的变化更具有鲁棒性； 和3）DRL-TE始终优于最新的DRL方法（用于连续控制），即深度确定性策略梯度（DDPG），which不能提供令人满意的性能。

> 创新：
>
> * 首次用DRL
> * 对结合network使用RL做出了巨大的贡献：1. 提出了DRL-TE的框架； 2. 在AC上进行改进，实验证明比ddpg效果要好不少



# 1 Introduction

> Our general goal(e.g. 拯救世界)  &  SDN is promising

​	因此，我们的目标是开发一种新颖的，无需经验的无模型方法，该方法可以像人类学习技能（例如驾驶，游泳等）一样，从经验中学习很好地控制通信网络，而不是精确的数学模型。我们认为，某些新兴的联网技术，例如软件定义网络（SDN）[18]，可以很好地支持这种体验/数据驱动的方法。 例如，SDN中的**Openflow**控制器可以用作中央控制单元，用于收集数据，制定决策和部署解决方案。

> 开始喷前人的工作

​	一个基本的网络问题是流量工程（TE）：给定一组具有源节点和目标节点的网络流，请找到一种解决方案，以最大化实用功能为目标转发数据流量。 简单且广泛使用的解决方案包括：始终通过最短路径路由流量（例如，开放式最短路径优先（OSPF）[24]）； 或通过多个可用路径平均分配流量（例如，有效负载平衡**（VLB）[38]**）。 显然，它们都不是最优的。 如果存在针对网络环境，用户需求及其动态的准确且数学可解的模型，则可以开发出更好的解决方案。 <u>排队论已被用于对通信网络进行建模并协助资源分配[15]，[25]，[26]，[37]</u>。 **但是，由于以下原因，它可能不适用于涉及多跳路由和端到端性能（例如延迟）的网络问题**：1）在排队论中，queueing network（而不是单个队列）中的许多问题仍然是开放问题，而具有网状拓扑结构的通信网络则表示相当复杂的多点到多点排队网络，其中来自一个队列可以被分布到多个下游队列，并且一个队列可以从多个不同的上游队列接收分组。  2）<u>排队理论只能在一些强假设下（例如，元组到达遵循泊松分布等）提供准确的排队延迟估计，但是在复杂的通信网络中可能不成立</u>。 请注意，即使到达每个源节点的数据包都遵循泊松分布，到达中间节点的数据包也可能不会。

​	另外，对**<u>网络效用最大化（NUM）[17]</u>**的研究也很深入，它通常通过制定和解决优化问题来提供资源分配解决方案。 但是，**这些方法可能会遇到以下问题**：1）它们通常假定一些关键因素（例如用户需求，链接使用等）作为输入给出，但是，这些因素很难估计或预测。  2）由于给定了资源分配的决策变量（例如TE），因此很难通过显式地将其包含在效用函数中来直接最小化端到端延迟，因此很难在 由于需要一个精确的数学模型来实现此目的，因此它们必须是封闭的形式（尽管如上所述，排队理论在这里可能不起作用）。  3）这些工作未能很好地解决网络动态性问题。 他们中的大多数声称提供了一种“良好”的资源分配解决方案，该解决方案是最佳的或接近最佳的，但仅适用于网络快照。 但是，大多数通信网络时变很大。 这些NUM方法尚未很好地解决如何调整或重新计算资源分配以适应这种动态情况。 

> 讲了下为何用DRL

* DRL is in succsess

 * DRL is promising
   	* model-free ,not relying on exact model (e.g. queueing model)
      	* handle complicated action space with DDPG
      	* can handle dynamic env， due to it is AI method

> contribution

* 我们是第一个为TE提供高效，实用的基于DRL的经验驱动控制框架DRL-TE。
* 我们讨论并表明，**<u>直接应用最先进的DRL解决方案进行连续控制，即深度确定性策略梯度（DDPG）[16]，对TE问题效果不佳。</u>** 【有意思了。意思来了】
* 我们提出了两种新技术，即TE-aware exploration 和 AC-based prioritized experience replay，以优化通用DRL框架，尤其是针对TE的框架。 我们通过使用具有代表性和随机网络拓扑的ns-3进行的广泛数据包级仿真，表明DRL-TE明显优于几种广泛使用的基线方法。



# 2 DRL



# 3 Problem Statement

<img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/210803-186164.png" alt="image-20201104210801863" style="zoom: 80%;" />

分割比$w_{k,j}$ , 备选路径集合$P_k$ , traffic load $f_{k,j}$

* $\alpha-faireness$ 的文献要好好读读这个指标的含义

  * 又提到了，$\alpha$ 可以被用来balance fairness和efficiency 。 当$\alpha=1$的时候，可以获得proportional fairness

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/211336-513625.png" alt="image-20201104211329992" style="zoom: 80%;" />

  * 仿照Remy提了个指标

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/211424-585348.png" alt="image-20201104211423959" style="zoom:80%;" />

    





# 4. Proposed DRL-Based Control Framework

在本节中，我们介绍了针对上述TE问题的建议的基于DRL的控制框架DRL-TE。

* state

  点对的集合

![image-20201104211802927](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/211803-272410.png)

* actors

  分割比的集合

  ![image-20201104211846544](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201104211846544.png)

* reward

![image-20201104211853832](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201104211853832.png)



* algorithm :

  * AC算法

  * 动作加随机噪声

    ![image-20201104212913054](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/212915-598687.png)

​	所提出的控制框架不限于针对abase的任何特定的基础TE解决方案，可以通过许多不同方式来获得该解决方案。 例如，一种简单的解决方案是使用最短路径为每个通信会话传递所有数据包，这在大多数情况下不是最佳的，但足以切断作为探索的基准。 另一种解决方案是将每个通信会话的流量负载平均分配到所有候选路径。 基于NUM的方法也可以用于查找基本解决方案。 例如，我们可以通过解决以下数学编程来获得TE解决方案：

<img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/04/213935-479446.png" alt="image-20201104213933393"  />

​	In this formulation，目的是使产量方面的总效用最大化。 请注意，很难在效用函数中包含端到端延迟项，因为不存在可以准确地在端到端延迟与其他决策变量<xk，fk,j>

​	Note that it is hard to include the end- to-end delay term in the utility function since there does not exists a mathematical model that can accurately establish a connection between end-to-end delay and the other decision variables < xk, fk,j >. 这就是为什么NUM上大多数现有作品都没有很好地解决端到端延迟的原因。

​	约束（6b）确保每条链路上的总流量负载不超过其容量Ce，其中pj是Pk中的第j条路径。 约束（6c）确保每个会话k的总吞吐量不超过其需求Bk（可以估算）。 约束（6d）在两组决策变量<xk>和<fk，j>之间建立联系。 如果α= 1，Uα（xk）= log xk，则该问题变为凸编程问题，which可以通过我们的实现中使用的Gurobi Optimizer [10]有效解决。

> 前面也说$\alpha=1$的时候经常用来被用作资源分配，不知道是出于其凸函数方便计算的性质还是出于真实的性质。



* ==？？==

  * [ ] 我觉得第四节中 一定概率选择$a_{base}$而不是$a_{random}$就很扯...

  * [ ] NUM到底是什么模型？？这里指的应该是 以网络链路利用率最大化 （Network utility maxmization）

    * attention！ 这里的U不是utilization，而是utility！e.g. utility function = - utilization

  * [ ] Note that it is hard to include the end- to-end delay term in the utility function since there does not exists a mathematical model that can accurately establish a connection between end-to-end delay and the other decision variables < xk, fk,j >.  【这是个什么锤子...】

  * [ ] 所以6b方程式的意思是可以比给定的流量发得少，但是不允许发的多??

    > 哦哦、这个是给定总量的情况下，测效用函数。而飞哥文章的思路是，给定，总量可以变

    ~~总感觉这个式子怪怪的~~ 那是不是飞哥的建模出了问题了...



---

> 建模完成后就开始说如何解了

**AC算法**

* 加上了优先级经验回放，which author claim 是他们的扩展，不是AC本身自带的

* 网络架构

  * Actor

    * 2 FC ( 64,32 ) Leaky Rectifier激活函数，输出层softmax作为激活函数来确保输出值的总和等于1。

  * Critic

    * 2 FC ( 64,32 ) Leaky Rectifier激活函数

    > A和C最后一层网络架构的不一样的原因是，前者输出动作概率，所以需要softmax，后者只要输出一个数值，所以不需要用softmax归一化。

  * 本算法对于优先级采样的一些设计/改进

    * 为了以等式（9）给出的概率对N个转换进行采样，将范围[0，p~total~]划分为N个子范围，并从每个子范围中均匀采样一个转换，其中p~total~是重播缓冲区中的所有transition的他优先级之和。 正如[30]所建议的，我们使用求和树来实现优先级概率，这类似于二进制堆。

    * 区别在于1）叶节点存储转换的优先级；  2）内部节点存储其子节点的总和。 这样，root的值为p~total~，更新和采样的时间复杂度为O（logN~tree~），其中N~tree~是求和树中节点的数量。

    * 超参数设置

      ξ：= 0.01，β~0~：= 0.6，β~1~：= 0.4，γ：= 0.99，ϕ：= 0.6，η~π~：= 0.001，η~Q~：  = 0.01，τ：= 0.01，N = 64。

# 5. Performance Evaluation

* **Testbed**

  ns-3, Tensorflow, with topo of NSFNET[23] & ARPANET[1] & 网络拓扑生成器BRITE [19]随机生成了一个具有20个节点和80个链接的网络拓扑

* 实验设置

  对于每种网络拓扑，我们分配K = 20个通信会话，每个会话都有随机选择的源节点和目标节点。 对于每个通信会话，我们选择3条最短路径（就跳数而言）作为其候选路径。 每个链接的容量设置为100Mbps。 数据包到达每个通信会话的源节点（即流量需求）遵循泊松过程（请注意，数据包到达中间节点可能不遵循泊松过程），其平均值均匀地分布在一个20Mbps大小的窗口内。 在我们的实验中，我们最初将窗口设置为[0，20] Mbps，然后通过以每次运行5Mbps的步长滑动窗口来增加流量需求。 我们为效用函数设置α：= 1和σ：= 1以平衡吞吐量，延迟和公平性，即

  ![image-20201105005550050](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/05/005550-301559.png)

* **Baselines**

  * 最短路径（SP）：每个通信会话都使用最短路径来传递其所有数据包。
  * 负载平衡（LB）：每个通信会话均将其流量负载平均分配给所有候选路径。
  * 网络实用程序最大化（NUM）：它通过解决凸编程问题Ⅳ中给出的NUM-TE来获得TE解决方案。
  * DDPG：为公平起见，我们在保持其他设置（例如状态，动作，奖励和DNN）相同的情况下，用DDPG算法[16]替换为DRL-TE算法（算法1）。

* **Evaluation指标** & 图释说明

  * 我们将总的端到端吞吐量，端到端平均数据包延迟和网络（即总）效用值用作比较的性能指标。 
  * 我们在图5和6中显示了相应的仿真结果。图1-3每个对应于一个网络拓扑。 
    * 注意，x轴上的数字是相应交通需求窗口（如上所述）的中心值。 
  * 根据奖励显示了在在线学习过程中三种网络拓扑上两种DRL方法（DDPG和DRL-TE）的性能。 
    * 为了便于说明和比较，我们使用常用方法（r-rmin）/（rmax-rmin）归一化和平滑了奖励值（其中r是实际奖励，rmin和rmax是在线学习期间的最小和最大奖励）和著名的**<u>前后过滤算法[11]</u>**。 我们在**<u>图4</u>**中给出了相应的仿真结果。
    * 请注意，对于这些结果，使用窗口[10，30] Mbps生成了相应的流量需求。



* **结论**	

  * 端到端时延

    * 从图1a，2a和3a中可以看出，与所有四种基线方法相比，DRL-TE显着降低了所有三种拓扑的端到端延迟。 例如，在NSF拓扑上，当流量负载为中等时（即流量需求窗口为[10，30] Mbps），DRL-TE可以将端到端延迟显着降低51.6％，28.6％，74.6％ 与SP，LB，NUM和DDPG相比分别为50.0％和50.0％。 总体而言，DRL-TE分别平均降低了55.4％，47.1％，70.5％和44.2％。 

    * 与吞吐量相比，端到端延迟更难处理，因为如上所述，它缺乏能够很好地捕捉其特性和运行时动态的精确数学模型。 看到NUM导致性能相当差是不足为奇的，因为NUM无法明确解决端到端延迟，并且其设计基于网络状态相当稳定或变化缓慢的假设，这可能不是事实。 尽管诸如SP和LB之类的简单解决方案凭直觉可以提供预期的性能，但最短的路径和负载平衡（可以避免拥塞）可以帮助减少延迟。  DRL-TE毫无疑问在端到端延迟方面提供了卓越的性能，因为它不断学习运行时动态，并在DNN的帮助下做出明智的决策以使其达到最佳状态。

      > ==??== 这一段要好好看下

  * 吞吐量

    即使DRLTE的目的（奖励功能）不是简单地最大化端到端吞吐量，它仍然提供令人满意的性能，如图1和2所示。  1b，2b和3b。 与所有其他方法相比，DRL-TE可以持续提高NSFNST拓扑的吞吐量。 在ARPANET和随机拓扑上，DRL-TE给出的吞吐量值可与LB给出的吞吐量值相媲美（负载均衡在整个过程中应产生很高的收益），但仍高于SP和NUM提供的吞吐量值。  

  * 效用函数

    如预期的那样，我们可以从图2和3中看到。 从图1c，2c和3c可以看出，DRL-TE在总效用方面胜过所有其他方法，因为其奖励功能已设置为最大化。 平均而言，DRL-TE分别胜过SP，LB，NUM和DDPG 7.7％，9.1％，26.4％和12.6％。 

  * 使用并且无论选择哪种网络拓扑，吞吐量和延迟都基本上与流量需求有关（无论什么方法，什么拓扑，throughpout和delay就是会随着流量需求增大而上升，the total utility 通常会下降）。 这很容易理解，因为流量负载越高，通常吞吐量就越高，但是由于等待时间更长甚至拥塞而导致的延迟也就越大，从而降低了总实用性。 此外，吞吐量不会单调增加，当网络变得饱和时，由于拥塞和数据包丢失，更高的流量需求甚至可能导致吞吐量变差。 我们还注意到DRL-TE在流量负载和网络拓扑的变化方面具有鲁棒性，因为在所有流量需求设置和所有拓扑中，DRL-TE的性能始终优于所有其他方法。

  * 另外，我们还可以从图1和图2中观察到。  1-3指出DDPG在这些拓扑上效果不佳。 例如，与SP和LB相比，就总效用而言，它通常表现较差，即使它提供了稍微更好的端到端延迟。 为了进一步说明DRL-TE为什么比DDPG更好的原因，我们还显示了图4中三种网络拓扑在在线学习过程中奖励价值的变化。显然，在所有这些网络拓扑中，DRL-TE很快（仅在几个范围内） 数以千计的决策时代）达到了很好的解决方案（给予了很高的回报）； 而DDPG似乎停留在具有较低奖励价值的局部最优解决方案上。 特别是，在随机拓扑上，我们只能看到前几百个世代的微小改进，然后它无法找到更好的解决方案（动作）来提高奖励。 这些结果清楚地证明了所提出的新技术的有效性，包括TE感知探索和基于行为者批评的优先体验重播。

    > ==??==问题就来了，DDPG不能加优先级体验重播么...



# 5. Related Work

==关于网络的这一部分要好好看下==



# 疑问

### intro

* VLB和ECMP的区别
* 标红的句子根本是看不懂。。问下飞哥



* 我们一定要做分布式的么？不做的话会怎么样--》无法达到全局最优 ?  Auto怎么被评论的？

* Caida数据集
* ospf最短路径的权重问题？
* 看看人家代码里面的split ratio
* $\alpha-faireness$指标和另一个CC里面常用的指标的调研
  
  * check下IOT以及Remy里面对于$\alpha$的选取
* 还是那个问题。。这里reward的设立是不是有问题....看下Pensive，人家比较有建模经验
* 路由常关注哪些指标? 有没有流完成时间？？？
* 我觉得第四节中 一定概率选择$a_{base}$而不是$a_{random}$就很扯...
  * 有机会训练下模型，看看随机选择会不会比$a_{base}$更好
  * 这里不随机选择的一个原因会不会是因为 随机选择的动作 没有意义
* evaluation 
  * 前后过滤算法
  * 结论部分讲端到端时延的其实我没有很懂



* 经常看到的empirical research/study 是什么意思
* 怎么没看到Groubi的用法
* 确认下是集中式控制的？就在开头说了下SDN是个好东西
* 一句话概括这个工作
* 分割比的话  把流拆开来传输，不会导致乱序么




# 组会ask砚舒

* 现实中OSPF的权重是用什么设置的