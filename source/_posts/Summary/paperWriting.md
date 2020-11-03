---
top: false
cover: false
mathjax: true
title: paperWriting
date: 2020-10-26 19:02:43
categories: Summary
description: Paper Writing pattern
password: 789789
tags:
    - Writing
---

# writing patterns 

> for RL-based networking

 ==不管是罗列前人工作，还是讲别人的缺点，还是讲我们的tool的优点，都是**两个方面!!!** 一个方面实在是太单薄==

## Auto

###  1. Introduction

#### 第一段 [重要性及前人工作]

XXX **has a significant impact** on application performance. **Currently**, XXX is dependent on ... . When ..., XXX may suffer performance penalty. **For example**, in yyy[8],.... Under .... scenarios, performance degradation can be as much as ...[8]. zzz[4] shares the same problem when ...: for certain cases the ...(某指标) can be reduced by over ... even if ... . <u>Furthermore</u>, in coflow scheduling, fixed thresholds in Aalo [18] depend on the operator’s ability to choose good values upfront, since there is no run-time adaptation.

* 这里只说了一句，XX对application performance很重要，但并没有给出例子说明。直接用**Currently**总结了当前的工作的缺陷。**For example**进一步阐述了缺陷。

> Datacenter traffic optimizations (TO, e.g. flow/coflow scheduling [1, 4, 8, 14, 18, 19, 29, 61], congestion control [3, 10], load balancing &routing [2]) **have significant impact on** application performance. **Currently**, TO is dependent on hand-crafted heuristics for varying traffic load, flow size distribution, traffic concentration, etc. When parameter setting mismatches traffic, TO heuristics may suffer performance penalty. **For example**, in PIAS [8], thresholds are calculated based on a long term flow size distribution, and is prone to mismatch the current/true size distribution in run-time. Under mismatch scenarios, performance degradation can be as much as 38.46% [8]. pFabric [4] shares the same problem when implemented with limited switch queues: for certain cases the average FCT can be reduced by over 30% even if the thresholds are carefully optimized. <u>Furthermore</u>, in coflow scheduling, fixed thresholds in Aalo [18] depend on the operator’s ability to choose good values upfront, since there is no run-time adaptation.

#### 第二段 [继续批判前人工作的第二个缺点]

**Apart from** parameter-environment mismatches, the turn-around time of designing TO heuristics is long—at least weeks. **Because** ... . 

* **Apart from** 承接上文的缺陷，并提出一个新的缺陷，然后用**Because**去支撑自己的观点。

> **Apart from** parameter-environment mismatches, the turn-around time of designing TO heuristics is long—at least weeks. **Because** they require operator insight, application knowledge, and traffic statistics collected over a long period of time. A typical process includes: first, deploying a monitoring system to collect end-host and/or switch statistics; second, after collecting enough data, operators analyze the data, design heuristics, and test it using simulation tools and optimization tools to find suitable parameter settings; finally tested heuristics are enforced (with application modifica- tions [19, 61], OS kernel module [8, 14], switch configurations [10], or any combinations of the above).

#### 第三段 [我们的task & 我们为何使用RL]

XX is thus appealing, and we desire an XX that can ... , while achieving ... goals. 

* 提出我们想做的task是什么 以及 我们想要达到的一个大概的目标

> Automating the TO process is thus appealing, and we desire an automated TO agent that can adapt to voluminous, uncertain, and volatile datacenter traffic, while achieving operator-defined goals.

In this paper, ```we investigate reinforcement learning (RL) techniques [55], as RL is the subfield of machine learning concerned with decision making and action control. It studies how an agent can learn to achieve goals in a complex, uncertain environment. An RL agent observes previous environment states and rewards, then decides an action in order to maximize the reward. RL has achieved good results in many difficult environments in recent years with advances in deep neural networks (DNN): DeepMind’s Atari results [40] and AlphaGo [52] used deep RL (DRL) algorithms which make few assumptions about their environments, and thus can be generalized in other settings. ```

* 讲了RL是什么 以及 RL的promising之处(在别的领域获得了极好的成果)

Inspired by these results, we are motivated to enable DRL for automatic datacenter TO.

* 所以我们考虑用RL做强化学习

#### 第六段 [提出了我们的系统]

> 四五和具体内容太相关了，略过

**We present** XX , an ...(```更多high-level的描述作为同位语:基于xx的yy系统```). XX **is a** ... , ... . ```描述其中one part```. ```描述另一part.``` ```描述两part之间的关系.```

* 先概述一下我们的系统，然后描述各自的part，其中part之间的关系/数据流向可以放在中间说，也可以放在两个part之间说

> **We present** AuTO, an end-to-end DRL system for datacenter-scale TO that works with commodity hardware. AuTO **is a** two-level DRL system, mimicking the Peripheral & Central Nervous Systems in animals. Peripheral Systems (PS) run on all end-hosts, collect flow information, and make instant TO decisions locally for short flows. PS’s decisions are informed by the Central System (CS), where global traffic information are aggregated and processed. CS further makes individual TO decisions for long flows which can tolerate longer processing delays.

#### 第七段 [novelty/key design]

**The key of** ... is ... . **To achieve this**, we adopt ... . **In this way**, .... **Furthermore**, ... 

* highlight了创新点和核心技术

> **The key of** AuTO’s scalability is to detach time-consuming DRL processing from quick action-taking for short flows. **To achieve this**, we adopt Multi-Level Feedback Queueing (MLFQ) [8] for PS to schedule flows guided by a set of thresholds. Every new flow starts at the first queue with highest priority, and is gradually demoted to lower queues after its sent bytes pass certain thresholds. Using MLFQ, AuTO’s PS makes per-flow decisions instantly upon local information (bytes-sent and thresholds)4, while the thresholds are still optimized by a DRL algorithm in the CS over a relatively longer period of time. In this way, global TO decisions are delivered to PS in the form of MLFQ thresholds (which is more delay-tolerant), enabling AuTO to make globally informed TO decisions for the majority of flows with only local information. Furthermore, MLFQ naturally separates short and long flows: short flows complete in the first few queues, and long flows descend down to the last queue. For long flows, CS centrally processes them individually using a different DRL algorithm to determine routing, rate limiting, and priority 

#### 第八段 [系统基于的软硬件]

**We have implemented an XX prototype using** Python.XX is thus compatible with popular learning frameworks, such as Keras/TensorFlow. This allows both networking and machine learning community to easily develop and test new algorithms, because software components in AuTO are reusable in other RL projects in datacenter.

#### 第九段 [实验效果]

**We further build a testbed with** ...(硬件设施) to evaluate XXX. **Our experiments show that**, for...(```某种场景```), **XXX’s performance** improvement is up to ... compared to ... after xx hours of training. **XX is also shown to** ... (```另一个优点```) 

* testbed 是什么
* 优点还是从两方面说,还是得用数字具化

> **We further build a testbed with** 32 servers connected by 2 switches to evaluate AuTO. **Our experiments show that**, for traffic with stable load and flow size distribution, **AuTO’s performance improvement is up to** 48.14% compared to standard heuristics (shortest-job-first and least-attained-service- first) after 8 hours of training. AuTO **is also shown to** learn steadily and adapt across temporally and spatially heterogeneous traffic: after only 8 hours of training, AuTO achieves 8.71% (9.18%) reduction in average (tail) FCT compared to heuristics.



###  2 Background and motivation

在本节中，我们首先概述RL背景。 

然后，我们描述并应用基本的RL算法（策略梯度4For）以启用TO中的流调度。 

最后，我们通过测试平台实验展示了运行PG的RL系统的问题，从而激发了AuTO。

####  2.1 DRL【抄这个以及Wei Li的】

![image-20201026133617922](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/133619-827023.png)

​	如图1所示，环境是代理的周围环境，代理可以通过观察，操作和对操作的反馈（奖励）与之交互[55]。 具体来说，在每个时间步长t中，代理观察状态st，并在处选择动作。 然后，环境状态转换为st + 1，并且代理收到奖励rt。 状态转换和奖励是随机的和马尔可夫式的[36]。 学习的目的是使期望的累计折现奖励E [P∞t =0γtrt]最大化，其中γt∈（0,1]是折现因子RL主体基于策略采取行动，即概率分布 在状态s上采取动作a的过程：π（s，a）。

​	对于大多数实际问题，学习状态-动作对的所有可能组合都是不可行的，因此通常使用函数逼近[31]技术来学习该策略。 函数逼近器πθ（s，a）由θ进行参数化，其大小比所有可能的状态作用对的数目小（因此在数学上易于处理）函数逼近器可以具有多种形式，并且最近具有深层神经网络。（DNN）被证明可以解决类似于流量调度的实际的大规模动态控制问题，因此，我们也将DNN用作AuTO中的函数逼近器的表示，通过函数逼近，Agent通过更新功能参数来学习 具有状态st，acti的θ 在开启，并在每个时间段/步骤t中获得相应的回报rt。

​	我们专注于一类更新算法，该算法通过对策略参数执行梯度下降来学习。 学习涉及更新DNN的参数（链接权重），以使上述目标最大化。

![image-20201026133750664](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/133751-838519.png)

​	代理DNN的训练采用了众所周知的REINFORCE算法的一种变体[56]。 该变量使用等式（1）的修改版本，从而减轻了算法的缺点：收敛速度和方差。 为了减轻这种弊端，蒙特卡罗方法[28]用于计算经验奖励vt，而基线值（每台服务器的经验奖励的累积平均值）用于减小方差[51]。 结果更新规则（等式（2））被应用于策略DNN，这是由于其方差管理和保证的收敛至少是局部最小值[56]：

![image-20201026133758119](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/133758-514716.png)



####  2.2 Example:DRL for Flow Scheduling

**Furthermore, we formulate the problem of**  ...  **as a** DRL **problem**, **and describe a solution using** the xx algorithm based on Equation (2).

​	例如，我们将数据中心中的流调度问题表述为DRL问题，并使用基于等式（2）的PG算法描述解决方案。

> As an example, we formulate the problem of flow scheduling in datacenters as a DRL problem, and describe a solution using the PG algorithm based on Equation (2).
>
> > 注意，这里一定要搞清楚论文投稿的格式要求，比如有些会议，“Equation (2)” 就不让写出Equation，直接写(2)



##### Flow scheduling problem

> 我们考虑一个连接多个服务器的数据中心网络。 为简单起见，我们在流量调度[4，14]中采用了先前工作中的大交换机假设，其中网络是无阻塞的，具有全二分频带宽和适当的负载平衡。 按照该假设，将流调度问题简化为确定流的发送顺序的问题。 我们考虑一种实现，它可以使用严格的优先级队列来对流进行抢先调度。 我们为每个服务器中的流创建K个优先级队列[23]，并在其中强制执行严格的优先级排队。 交换机中还配置了K个优先级队列，类似于[8]。 每个流的优先级可以动态更改以启用抢占。 每个流的数据包都用其当前优先级编号标记，并将被放置在整个数据中心结构的同一队列中。



##### DRL formulation

> Action space：代理提供的动作是从活动流到优先级的映射：对于每个活动流f，在时间步t处，其优先级为pt（f）∈[1，K]。 
>
> State space：大开关假设可简化状态空间。 由于路由和负载平衡已不在我们的考虑范围之内，因此状态空间仅包含流状态。 在我们的模型中，状态表示为所有活动流的集合Ft a和所有完成的流的集合Ft网络（当前时间步长t）。 每个流在整个5元组[8，38]中用d标识：源/目标IP，源/目标端口号和传输协议。 活动流有一个附加属性，即优先级。 而完成的流还有两个附加属性：FCT和流大小5。
>
> Rewards：奖赏是向座席反馈有关其行为良好的反馈。 奖励可以在流程完成后获得，因此仅针对时间步长t的一组最终流程Ft d计算奖励。 每个完成流f的平均吞吐量为Tputf = Sizef FCTf。 我们将奖励建模为两个连续时间步的平均吞吐量之间的比率。



##### DRL algorithm

​	我们使用公式（2）指定的更新规则。 驻留在代理上的DNN为每个新状态计算概率向量，并通过评估导致当前状态的动作来更新其参数。 评估步骤将先前的平均吞吐量与当前步骤的相应值进行比较。 根据比较结果，会产生一个适当的奖励（负数或正数），并添加到基线值中。 因此，我们可以确保函数逼近器随时间改进，并且可以通过在梯度方向上更新DNN权重来收敛到局部最小值。（2）之后的更新确保了将来不鼓励针对类似状态的不良流调度决策，而对于未来类似的状态，好的调度变得更可能。 当系统收敛时，该策略为服务器集群实现了足够的流量调度机制。



####  2.3 Problem Identified

​	以流调度的DRL问题为例，我们使用流行的机器学习框架Keras / TensorFlow，PyTorch和Ray来实现PG。 我们将DRL代理简化为只有1个隐藏层。 我们使用两台服务器：DRL代理驻留在其中一台中，另一台使用RPC接口将模拟流量信息（状态）发送到该代理。 我们将模拟服务器的发送速率设置为每秒1000个流（fps）。 我们在模拟服务器上测量不同实现的处理延迟：完成发送流信息和接收操作之间的时间。 这些服务器是运行64位Debian 8.7的华为Tecal RH1288 V2服务器，具有4核Intel E5-1410 2.8GHz CPU，NVIDIA K40 GPU和Broadcom 1Gbps NIC。

​	如图2所示，即使对于1000fps的较小流到达速率和仅1个隐藏层，所有实现的处理延迟都超过60ms，在此期间，7.5MB内的任何流都将在1Gbps链路上完成。 作为参考，使用Microsoft数据中心[3、8、26]中收集的Web搜索应用程序和数据挖掘应用程序的知名流量跟踪，分别有7.5MB的流量大于所有流量的99.99％和95.13％。 这意味着，大多数DRL动作都是无用的，因为当动作到达时，相应的流已经消失了

##### Summary

当前的DRL系统的性能不足以对数据中心规模的流量做出在线决策。 即使对于简单的算法和较低的流量负载，它们也会遭受较长的处理延迟。



###   3. Auto Design

####   3.1 overview

---

这一部分实际上暗示了 design rationale ( 设计的insight )

> 当前的DRL系统的关键问题是流信息的收集与动作的产生之间的长等待时间。 在链路速度≥10Gbps的现代数据中心中，要实现流级TO操作，动作的往返延迟至少应为毫秒。 如果不引入专用硬件，这是无法实现的（第2.2节）。 使用商用硬件，DRL算法的处理延迟是一个硬限制。 在这种限制下，如何为数据中心TO缩放DRL？ 
>
> 最近的研究[3、11、33]显示，大多数数据中心流是短流，而大多数流量字节来自长流。 在这种长尾分布的通知下，我们的见解是将大多数短流程操作委托给最终主机，并制定DRL算法以生成长流程（亚秒级）TO决策。

---

各个part之间的作用 以及 他们之间的联系

> 我们将AuTO设计为两级系统，模仿动物的周围和中枢神经系统。 如图3所示，外围系统（PS）在所有终端主机上运行，收集流信息，并在本地做出TO决策，对短流的延迟最小。 中央系统（CS）针对长流量做出单独的TO决策，可以容忍更长的处理延迟。 此外，CS会根据PS的决定来汇总和处理全球路况信息。

![image-20201026141813675](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/141814-653119.png)

####  3.2 Peripheral System

​	AuTO的可扩展性的关键是使PS能够仅通过本地信息就短流程做出全球知情的TO决策。  PS具有两个模块：强制模块和监视模块。

> design rationale : 可扩展性

##### Enforcement module

> ​	为了实现上述目标，我们采用了多级反馈排队（MLFQ，在PIAS [8]中引入）来调度流，而无需进行集中的逐流控制。 具体来说，PS在每个终端主机的IP数据包的DSCP字段中执行数据包标记，如图4所示。有K个优先级Pi，1≤i≤K，以及（K-1）降级阈值αj，  1≤j≤K-1。 我们将所有交换机配置为基于DSCP字段执行严格的优先级排队。 在终端主机上，当新流初始化时，其数据包将标记为P1，从而为它们提供网络中的最高优先级。 随着发送更多字节，此流的数据包将以优先级降低的标记Pj（2≤j≤K）进行标记，因此在网络中以降低的优先级对其进行调度。 将优先级从Pj-1降级为Pj的阈值为αj-1

>  		使用MLFQ，PS具有以下属性：
>
>  	​	•它只能基于本地信息（发送的字节数和阈值）做出即时的每流决策。
>
>  	​	•它可以适应全球流量变化。 为了具有可伸缩性，CS不能直接控制小流量。 相反，CS会在更长的时间内使用全局信息优化并设置MLFQ阈值。 因此，可以更新PS中的阈值以适应流量变化。 相反，PIAS [8]需要数周的流量跟踪才能更新阈值。
>  	​	•它自然地将短流和长流分开。 如图5所示，短流在前几个队列中完成，长流下降到最后一个队列。 因此，CS可以单独集中处理长流量，以决定路由，速率限制和优先级。

##### Monitoring module

​	为了让CS生成阈值，监视模块会收集所有已完成流的流量大小和完成时间，以便CS可以更新流量大小分布。 监控模块还报告持续的长流量，这些流量已降到其端主机的最低优先级，以便CS可以做出单独的决定。

####   3.3 Central System

​	CS由两个DRL代理（RLA）组成：短流RLA（sRLA）用于优化MLFQ的阈值，长流RLA（lRLA）用于确定长流的速率，路由和优先级。  sRLA试图解决FCT最小化问题，为此我们开发了深度确定性策略梯度算法。 对于lRLA，我们使用PG算法（第2.2节）为长流程生成操作。 在下一节中，我们将介绍两个DRL问题和解决方案。



###  4 DRL FORMULATIONS AND SOLUTIONS

 In this section, we describe the two DRL algorithms in CS.

####   4.1 Optimizing MLFQ thresholds

---

> 其实这里还是在说背景 : 我们为什么要选DDPG以及DDPG是什么

​	我们考虑一个连接多个服务器的数据中心网络。 通过在每个IP标头中设置DCSP字段，在主机和网络交换机（图4）上使用K个严格优先级队列来对流进行调度。 流越长，则通过主机优先级队列将其分配给优先级时，优先级分配的优先级就越低，以便近似最短作业优先（SJF）。 数据包的优先级会保留在整个数据中心结构中，直到到达目的地为止。  

​	MLFQ的挑战之一是计算主机上K个优先级队列的最佳降级阈值。 先前的工作[8、9、14]提供了用于优化降级阈值的数学分析和模型：{α1，α2，...，αK-1}。  Bai等。[9]还建议每周/每月重新计算阈值，并收集流量水平轨迹。  AuTO进一步采取了措施，并提出了DRL方法来优化α值。 与先前的研究将机器学习用于数据中心问题[5、36、60]不同，AuTO的独特之处在于其目标-优化连续动作空间中的实际值。 <u>我们将阈值优化问题表述为DRL问题，并尝试探索DNN建模复杂数据中心网络以计算MLFQ阈值的功能。</u>

​	如第2.2节所示，PG是一种基本的DRL算法。 该代理遵循通过向量θ参数化的策略πθ（a | s），并根据经验进行改进。 但是，REINFORCE和其他常规PG算法仅考虑随机策略πθ（a | s）= P [a | s;θ]，该随机策略根据状态集s上的动作集A的概率分布选择状态s中的动作a。  θ。  PG不能用于价值优化问题，因为价值优化问题会计算实际价值。 因此，我们使用确定性策略梯度（DPG）[53]的一种变体来近似给定状态s的最优值{a0，a1，...，an}，使得i = 0时ai = µθ（s）。  。，n。 图6总结了随机策略和确定性策略之间的主要差异。  DPG是用于确定性策略的actor-critic [12]算法，该算法维护代表当前策略的参数化actor函数µθ，以及使用Bellman方程更新的评论者神经网络Q（s，a）（如Q学习[  41]）。 <u>我们用等式（4,5,6）描述该算法，如下所示</u>：参与者对环境进行采样，并根据等式（4）更新其参数θ。 等式（4）的结果来自以下事实：该策略的目标是使预期的累积折扣奖励等式（5）最大化，并且其梯度可以用以下等式（5）表示。 有关更多详细信息，请参阅[53]。
   θk+ 1

![image-20201026144237709](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/144238-170340.png)

​	深度确定性策略梯度（DDPG）[35]是DPG算法的扩展，它利用了深度学习技术[41]。 我们将DDPG用作优化问题的模型，并在下面解释其工作方式。 与DPG一样，DDPG也是一种参与者评判算法[12]，它维护四个DNN。 两个DNN，分别是评论家QθQ（s，a）和权重µQµ（s），权重为θQ和θµ，在大小为N的样本迷你批次上进行训练，其中一个项目表示一个有经验的过渡元组（si，ai，ri  si + 1），而代理与环境互动。 对DNN进行随机样本训练，这些样本存储在缓冲区中，以避免相关状态导致DNN偏离[41]。 其他两个DNN，目标演员µ0θ和目标评论家Q 0 0分别用于演员和评论家网络θQ（s，a）的平滑更新（**算法（1）[35]**）。 更新步骤稳定了对行为者批评网络的训练，并在连续的空间动作上取得了最新的成果[35]。  AuTO应用DDPG来优化阈值，以实现更好的流量调度决策。

##### DRL formulation

​	**接下来，我们表明阈值的优化可以表述为DDPG可解决的行动者批评的DRL问题。我们首先提出了一个优化问题，即选择最佳阈值集{αi}以最小化流量的平均FCT。 然后我们将此问题转化为DRL问题，可以使用DDPG算法解决。** 将流量分布的累积密度函数表示为F（x），因此F（x）是流量不大于x的概率。 令Li表示给定流为i = 1，...，K引入队列Qi的数据包数量。 因此，E [Li]≤（αi-αi-1）（1-F（αi-1））。 将流到达率表示为λ，则到达队列Qi的数据包到达率是λi=λE[Li]。 队列的服务速率取决于优先级较高的队列是否全部为空。 因此，P1（最高优先级）的容量为µ1 = µ，其中µ是链路的服务速率。  Q1的空闲率为（1-ρ1），其中ρi=λi/ µi是Qi的利用率。 因此，Q2的服务速率为µ2 =（1-ρ1）µ，因为假定P1为空，其服务速率为µ（全链路容量）。 我们有μi=Πi-1j = 0（1-ρj）μ，其中ρ0= 0。 因此，Ti ＝ 1 /（μi-λi），其是假设M / M / 1个队列的队列i的平均延迟。 对于大小为[αi-1，αi）的流，它将经历不同优先级队列直至第i个队列的延迟。 将Ti表示为在第i个队列中花费的平均时间。 令imax（x）为最小降级阈值大于x的索引。 因此，大小为x的流体的平均FCT（T（x））的上限为：Pimax（x）i = 1 Ti。 令дi= F（αi）-F（αi-1）表示大小为[αi-1，αi）的流量百分比。 因此，дi是两个连续阈值之间的差距。 使用дi等价表示αi，我们可以将FCT最小化问题表示为：

![image-20201026144504717](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/144505-298842.png)

我们继续将问题（7）转换为DRL问题。
   *Action Space*：在我们的模型中，状态表示为当前时间步中整个网络中所有完成的流量Fd的集合。 每个流都由其5元组[8，38]标识：源/目标IP，源/目标端口号和传输协议。 因为我们仅报告完成的流，所以我们还将FCT和流大小记录为流属性。 总的来说，每个流程都有7个功能。

​	*Reward*：奖励是向座席延迟的反馈，该反馈是关于座席在上一个时间步中的表现如何。 我们将奖励建模为两个连续时间步的目标函数之间的比率：rt = Tt-1 Tt。 它指示先前的操作是否导致较低的平均FCT，或者是否降低了整体性能。



##### DRL algorithm

> 结合具体场景来描述数据流向

​	我们使用公式（4）（算法1）指定的更新规则。  DNN为主机从每个新接收到的状态计算“ i”，并将元组（（st，at，rt，st + 1））存储在缓冲区中以供以后学习。 仅当下一次更新来自同一主机时，奖励rt和下一个状态st + 1才知道，因此代理将st和at缓存在直到收到所有需要的信息为止。 参数的更新是随机进行的，以稳定学习并减少发散的可能性[35，41]。 在步骤t在主机处计算回报rt，并将其与先前的平均FCT进行比较。 根据比较结果，会产生适当的奖励（负数或正数），并作为评估行动的信号发送给代理。 通过遵循算法1，系统可以改善潜在的参与者批评型DNN，并收敛为问题（7）的解决方案。



###  5. Implementation

​	在本节中，我们描述实现。 我们使用Python 2.7开发AuTO。 语言选择促进了与现代深度学习框架[17、45、57]的集成，该框架提供了出色的Python接口[45]。 当前的原型使用Keras [17]深度学习库（以TensorFlow作为后端）



#### 5.1 Peripheral System

​	PS是在每个服务器上运行的守护进程。 它具有监视模块（MM）和执行模块（EM）。  MM线程收集有关流的信息，包括最近完成的流和当前活动的长流（在MLFQ的最后一个队列中）。 在每个周期结束时，MM会汇总收集的信息，然后发送给CS。  PS的EM线程根据当前活动流的MLFQ阈值以及长流的路由，速率限制和优先级标记执行标记。 我们为PS和CS之间的通信实现了一个远程过程调用（RPC）接口。  CS使用RPC设置MLFQ阈值并对活动的长流执行操作。
   5.1.1监控模块（MM）： 为了获得最大的效率，可以将MM作为PIAS [8]中的Linux内核模块来实现。 但是，对于当前的原型，由于我们使用流生成器（如[8、10、20]中所示）来产生工作负载，因此我们选择直接在流生成器内部实现MM。 这种选择使我们可以获得基本事实，并摆脱可能干扰结果的其他网络流。 对于长流（MLFQ的最后一个队列中的流），每T秒，MM将nl个活动长流（每个具有6个属性）合并，并将ml个完成的长流（每个具有7个属性）合并到一个列表中。 对于同一时期中的短流（在MLFQ的前几个队列中），MM将ms个完成的流（每个具有7个属性）收集到一个列表中。 最后，MM将两个列表连接起来，并将它们发送给CS，以观察环境。

​	AuTO的参数{nl，ml，ms}由流量负载和T决定：对于每台服务器，nl（ml）应该是T中活动（完成）长流数的上限，而ms也应该是上限 有限的空头流。 如果实际活动（完成）流量的实际数量小于{nl，ml，ms}，则将观察矢量零填充到与相应代理的DNN相同的大小。 我们之所以选择这种设计，是因为CS中DNN的输入神经元数量是固定的，因此只能采用固定大小的输入。 我们将动态DNN和递归神经网络结构留作未来的工作。 对于当前的原型和该原型上的实验，由于我们控制流发生器，因此很容易遵守此约束。我们在实验中选择{nl = 11，ml = 10，ms = 100}。

​	5.1.2执行模块（EM）：。  EM定期从CS接收操作。 这些行动包括新的MLFQ阈值以及关于本地长流量的TO决策。 对于MLFQ阈值，EM基于PIAS [8]内核模块构建，并添加降级阈值的动态配置。 对于短流量，我们利用ECMP [30]进行路由和负载平衡，而这不需要集中的每流控制，而DCTCP [3]则用于拥塞控制。 对于长流程，TO操作包括优先级，速率限制和路由。  EM利用相同的内核模块进行优先级标记。 速率限制是使用Linux流量控制（tc）中的分层令牌桶（HTB）排队规则来完成的。  EM在HTB中配置了具有出站速率限制的父类，以表示该节点上CS所管理的总出站带宽。 当流下降到MLFQ中的最后一个队列时，EM将创建一个与该流的精确5元组匹配的HTB过滤器。 当EM从CS接收到速率分配决策时，EM通过向Linux内核发送Netlink消息来更新特定流的子类：TC类的速率设置为集中式调度程序确定的速率，上限设置为 较小的原始上限和两倍于CS的费率



#### 5.2 Central System

​	CS运行RL代理（sRLA和lRLA）以做出优化的TO决策。 当处理传入更新并将操作发送到流生成服务器时，我们实现的CS遵循类似于SEDA的体系结构[58]。 该体系结构分为不同的阶段：http请求处理，深度网络学习/处理和响应发送。 每个阶段都有自己的进程，并通过队列进行通信，以将所需的信息传递到下一个阶段。 这种方法可确保CS服务器的多个核心参与处理来自主机的请求，并分散负载。 由于Python编程语言的CPython实现中的全局锁定问题[24]，已采用了多处理体系结构。 状态和动作在CS处被封装为“环境”（类似于[47]），RL代理可以与这些环境和动作直接进行编程交互。

* 5.2.1 sRLA

  ​	如第4.1节所述，我们使用Keras通过上述DNN（演员，评论家，目标演员和目标评论家）对运行DDPG算法的sRLA进行实施。  Actor：Actor具有两个完全连接的隐藏层，分别具有600和600个神经元，其输出层具有K-1个输出单位（每个阈值一个）。 输入层采用状态（每个服务器700个功能部件（ms = 100）），并输出主机服务器在步骤t的MLFQ阈值。 评论家：评论家具有三个隐藏层，因此与参与者网络相比，网络要复杂一些。 由于批评家应该“批评”演员的错误决定，而“赞美”则是好的决定，因此批评者神经网络也将演员的输出作为输入。 但是，正如[53]所暗示的那样，演员的输出不是直接的输入，而只是在隐藏层馈入评论者的网络。 因此，评论家具有与演员相同的两个隐藏层，还有一个额外的隐藏层，它将演员的输出与其自己的第二个隐藏层的输出连接起来，从而又增加了一个隐藏层。 该隐藏层最终被馈送到由一个输出单元组成的输出层-观察/接收状态的近似值。 通过从经验缓冲区{st，at，rt，st + 1}中进行采样，定期对一批观察值进行训练。 训练过程在算法（1）中进行了描述。

* 5.2.2 lRLA

  ​	对于lRLA，我们还使用Keras通过具有300个神经元的10个隐藏层的完全连接的NN来实现PG算法。  RL代理采取状态（每服务器136个功能（nl = 11，ml = 10））并输出所有活动流的操作概率。 总结基于一些经验训练课程，选择了超参数（DNN的结构，层数，高度和宽度）。 我们的观察结果是，具有更多隐藏层和更多参数的更复杂的DNN需要花费更长的训练时间，并且其性能没有比所选拓扑好得多。 总的来说，我们发现这样的RLA配置可带来良好的系统性能，考虑到计算延迟的重要性，这是相当合理的，正如我们在评估中所揭示的。



## ==MRTE ( ICNP'20 )==

> 前三段和最后一段绝壁不错，完全是个典范

###   1. Introduction

#### 第一段  [重要性及传统工作的弊病]

XXX, which aims to optimize ... for network performance and ...(resource utilization), **<u>is fundamental to</u>** networking research. **In practice**, large networks are often divided into multiple (logical or physical) regions, **e.g**.```, to facilitate decentralized scalable management [1], to satisfy domain/enterprise requirements [2], or in accordance with geographical locations [3] and heterogeneous routing technologies [4].``` In such multi-region networks, each region ... . **While** significantly improving ... , the use of ... <u>makes it intractable to achieve ... due to <u>the lack of</u> ....

* 先强调这是一个重要的东西 : 使用in practise枚举传统的工作，最好找到他们的共性概括起来 ( 这里举例的前后两句都是在概括他们的共性：将大网分为很多region，每个region只关注regional network observations ) e.g.

  > Traffic Engineering (TE), which aims to optimize traffic routing for network performance and resource utilization, <u>is fundamental</u> to networking research. **In practice**, large net- works are often divided into multiple (logical or physical) regions, e.g., to facilitate decentralized scalable management [1], to satisfy domain/enterprise requirements [2], or in accordance with geographical locations [3] and heterogeneous routing technologies [4]. In such multi-region networks, each region typically makes its own local TE decisions based on regional network observations.

* 再阐述他们存在的缺陷： 利用while句子，前半句肯定，后半句批评。同时，批评的后半句承接到下一段去

  > **While** significantly improving the scalability of network management, the use of multiple regions <u>makes it difficult</u> to achieve global TE objectives due to the lack of a joint effort and coordination.

#### 第二段 [current工作的弊病]

XX **<u>is a very challenging problem</u>**. **In contrast to classic XX **focusing on ... [5]–[10], **existing approaches** tend to rely on ... (e.g.```, 稍微展开阐述下第一种方案[11]```) or ```第二种方法 [1] [12] [13]```. **In particular**, iterative algorithms like [1] [12] [13] require ... , <u>incurring</u> ... and ... . **As a result**, these algorithms <u>lack</u> ... **<u>and thus suffer</u>** hefty performance loss under ... . **Another line of work** develops ... [3] [14], where ... . Apart from ```第一个缺陷```, it still ```说出第二个缺陷```.

* 第一句承接上一段，也引领本段。

  > Distributed TE in multi-region networks is a very challenging problem. 

* 指出现有方法的改进，一般都要分成两方面讲，并且分别指出问题所在。【一般也要分成两个方面去讲】

  > **In contrast to traditional** TE focusing on a fully-controlled and fully-observable network (also known as intra-region TE) [5]–[10], **existing approaches** often rely on simple routing heuristics (e.g., directing outgoing traffic to the closest border routers in hot potato routing [11]) **or** leveraging distributed optimization techniques to decouple a global TE problem [1] [12] [13]. **In particular**, iterative algorithms like [1] [12] [13] for distributed TE require adjacent regions to share necessary information (e.g., gradients) through real-time communication, <u>**incurring**</u> communication overhead and slow convergence. **As a result**, <u>these algorithms **lack**</u> the agility to adapt to changing traffic patterns and thus suffer hefty performance loss under highly dynamic traffic demands. **Another line of work** develops a hierarchical SDN architecture [3] [14], where a set of slave controllers are designated to different regions, and a super controller coordinates these slave controllers globally to compute routing decisions. **Besides communication cost, it still requires** a controller having full control over the entire network albeit in a hierarchical manner.


#### 第三段 [我们提出的方法是什么]

In this paper, **we propose** <u>a data-driven framework based on Deep Reinforcement Learning (DRL) for</u> ... . **The proposed framework provides a refreshing perspective to this problem by** ... . 

* 我们提出了基于...(方法)的...  , 大致的问题解决思路是...

  > In this paper, **we propose** a data-driven framework <u>based</u> on Deep Reinforcement Learning (Deep RL) for distributed TE in multi-region networks. The proposed framework <u>provides a refreshing perspective to this problem</u> **by modeling** each network region as an individual learning agent that has only local network information and interacts with other agents to make decisions on the fly for performance optimization. 

**Compared with traditional**... ,``` Deep RL, as one of the leading Machine Learning (ML) techniques, has the potential of solving complex and dynamic control problems. Deep RL algorithms can automatically exploit hidden patterns in training data and continue improving its TE strategy over time. Well-trained Deep RL models can do inference efficiently even for the inputs that never appeared before. ```**Besides**, ```Deep RL models can be trained by interacting with the network environment without requiring labeled data that are usually hard to obtain in real networks [15].``` 

---

[ 其实我觉得这一段后面这部分没必要233 ]

* 阐述了我们base的方法的优势（why we use ) 

Several recent proposals [15]–[17] have capitalized on these advancements to tackle the crucial and timely challenge of TE. **However**, We hasten to emphasize that these RL-based approaches only focus on intra-region TE problems within a single, fully-controlled region (regarded as a single agent) and thus cannot be applied to the distributed TE problem in multi-region networks.

* 虽然也有人用了这样的方法，但是我们的方法跟别人还是有本质上的区别的

#### 第四段 及 之后

* 第四段argue了multi-agent Deep RL在分布式TE里面的作用，which我觉得很扯淡
* 后面我觉得<u>借鉴意义更不大了</u>

#### 最后一段 [实验设置以及实验效果]

We **implement** our framework **using** TensorFlow [18] and **evaluate** its performance **using** both ... and ... . We use ... to ... . 

* 先概要讲一下实现及实验的基本设置（使用 xxx 在实验里面充当了...作用）

  > We **implement** our framework using TensorFlow [18] and **evaluate** its performance **using** both real-world network topologies (Telstra and Google Cloud) and large-scale synthetic network topologies (with hundreds of nodes). **We use** the Gravity model [19] **to** generate highly dynamic traffic including burst demands.

**Simulation results show that** our framework significantly **outperforms** ... and **achieves** 90-percentile ...(某指标) within ...  times the optimal **under/for** ...(场景). **Compared with** the single-agent approach [16], our framework achieves 20×-100× the learning speed of [16] **and** gets at most 72% of congestion reduction in random link failure scenarios.

* 然后概述实验结果

  * outperform others (一个虚而大的)
  * and引出具体的：大部分/全部场景下 在某指标上获得...
  * 更具体点，我们拿出其中一个最具有代表性的算法出来比 【请注意，这里比较，还是从两方面说事情】

  > **Simulation results show** that our framework significantly **outperforms** existing protocols and single-agent learning algorithms **and achieves** 90-percentile congestion within 1.2 times the optima  **under/for** all the simulated topologies. **Compared with** the single-agent approach [16], our framework achieves 20×-100× the learning speed of [16] **and** gets at most 72% of congestion reduction in random link failure scenarios.



#### 最后一段 [概述后文] ... 额 我完全用得上

In the following, we first **<u>overview</u>** DRL and **<u>reveal</u>** why current DRL systems fail to work at large scale in §2. **We <u>describe system design</u> in §3, <u>as well as the DRL formulations and solutions in §4</u>**. We **<u>implement</u>** AuTO in §5, and <u>**evaluate**</u> it with extensive experiments in §6 **using a** realistic **testbed**. Finally, we **review related works** in §7, and **conclude** in §8.



###   2. related work



###  3. Problem statement and solution overview

####  A. problem statement

**We consider XX** (场景). **Generally, XX can be modelled as**  ...（模型） , **where** ... (阐述模型的几个要素以及他们分别都代表什么。```可以考虑用"Each xx ..." 以及"Note that,..."的句式来detail这些东西```） . **We assume that** ... (可以给出一些公式阐述模型要素之间的关系) , and... . 

>  **We consider** a network consisting of multiple regions. Generally, the entire network can be modelled as a directed graph G(V, E), where V is the node (router/switch) set and E is the edge set. Each edge e(u, v) ∈ E has a capacity ce(u,v) denoting the maximum traffic amount that can pass the edge from node u to adjacent node v. Note that, edges e(u, v) and e(v, u) can have different capacities. Each region m can be considered as a directed sub-graph Gm(Vm, Em). We assume that (equation), and that $E_m = {e(u, v)|u \in V_m}$. There may be several peering edges connecting two adjacent regions, and the end nodes of these peering edges are border nodes of the regions.
>
> 

**The goal of XX is to optimize** ... , i.e., ... . (可以加一句阐述为什么要优化这个目标，e.g.这个目标反映出了什么)



#### B. Solution overview

**In our design, we take XX as **(采用的技术/工具/算法). **XX is** ...（解释下这个技术/工具/算法的原理、步骤、特点）.  **In our framework, we propose to use** ... ( 结合XX和自己的场景 ) . **Their definitions are given as follows:**

> **In our design, we take** Deep RL agents as the decision makers of routing. Deep RL is a combination of RL and deep neural network (DNN) and is more powerful to tackle complex tasks than RL. Different from supervised learning techniques with external knowledge guidance, a Deep RL agent learns its behavior through interactions with an environment iteratively for a specific objective. [这里我觉得应该补充下step的概念] At each iteration step, the agent observes the current state of the environment and makes a decision, i.e., an action. Then, the environment evolves transforms from the current state to a new state and returns a reward value to the agent. The reward is a feedback value indicating the quality of the agent’s action. The goal of the agent is to learn a policy which is a DNN mapping state to action so as to maximize the discounted cumulative reward [25]. To find a satisfactory policy, Deep RL takes an exploration-exploitation-based method. The agent can take a large-reward action learned so far, which is called action exploitation. The agent can also try a new action for a possibly higher reward, which is called action exploration. A good trade-off between exploitation and exploration helps the agent “understand” the environment well and learn an optimized policy through enough iterations. As mentioned previously, the routing of terminal traffic directly affects the status of the current region, while the routing of outgoing traffic affects the status of not only the current region but also the other regions, because traffic leaving the region from different border routers has different effects on the other regions. **In our framework, we propose to** use two separate Deep RL agents for traffic engineering in each individual region: T-agent and O-agent. **Their definitions are given as follows:**

Definition 3.1: T-agent is the Deep RL agent that controls the routing of terminal demands in each region. Definition 3.2: O-agent is the Deep RL agent that controls the routing of outgoing demands in each region. 

![image-20201026162330617](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/26/162331-878449.png)

> ==这个图不错，可以画个类似的==

* **先结合RL问题和一个solution的架构图，解释清楚RL的五要素分别对应现实中的哪些东西。**(具体的奖励函数、action/state space的设定细节，可以在下一节里面详细谈论。比如下面这个例子里面，只说了reward是跟优化xx的目标有关，但是具体的形式和元素都没有说呢还)

  **Fig. 2 illustrates our proposed solution**. For each region, a locally centralized server maintains a T-agent and an O-agent for the region. Each server **collects** local **<u>state information** (i.e., edge utilization</u>s) from the corresponding region periodically. **Then, the agents <u>take actions** (i.e., traffic splitting ratios over pre-computed paths)</u> independently based on the local state information for TE performance improvement. **<u>Reward values returned to** the T-agents **are** computed **with respect to a** local TE **objective** (i.e., minimizing the maximum edge cost of the local region).</u> While the O-agents get their reward values for a cooperative TE objective by combining the reward values of the T-agents in the local and neighboring regions. **<u>The details of link statistics-based state, reduced action space, and congestion-related reward functions will be presented in Section** IV-A and IV-B.</u> 

* 然后本篇文章简单提了他们的training，and"将在后面的Section XX 中更加详细具体地讨论这件事情".

  * 采用离线和在线策略的组合的原因
  * 离线如何train的(捕获脱机TM数据)，在线如何train(也是简单说了下)

  > To make our framework work well after deployment, we need to train the agents efficiently. Since Deep RL agents learn policies through the exploration-exploitation-based method, online learning from scratch has been widely known to result in poor performance at the beginning [26]. In this paper, we take a combined offline and online strategy. In the offline phase, the agents are trained in a simulated network which has the same topology and capacity settings as the real one. The simulated network will be initialized with offline TMs captured from the real network. We train these agents incrementally using various TMs. After training, the learned DNN parameters will be loaded to online agents for inference (i.e., decision making). During the online stage, the system can continue to improve with little communication among regions and make near-optimal routing decisions quickly. We demonstrate how to train agents in Section IV-C.



###   4. our proposed solutions

In this section, we describe the development of T-agent and O-agent separately, followed with the training method.

> 这一段就似乎讲了为何这么设计五要素的考量

#### A. T-agent Development

##### State space

good sentense : State space is the input of agents, which should capture the key status of the network environment.

> 状态空间是代理程序的输入，它应该捕获网络环境的关键状态。 现有的大多数基于深度RL的方法都将流量统计信息（例如TM）作为代理的状态输入[15]-[17]。 但是，在缺乏全局视野和控制力的多区域网络中获取实时TM统计信息并不容易。 在我们的设计中，我们使用边缘统计信息，即边缘利用率，可以轻松地对其进行测量。 边缘利用率由流量需求和路由决策共同决定。 因此，它隐含地反映了交通需求的变化以及当前行为的影响。 链接利用率值提供了哪些链接已阻塞的指示，因此学习代理可以相应地更新当前策略，以减少这些链接上的流量和拥塞。

> ​	Formally，在迭代步骤t，我们将sm，T t表示为区域m中T-agent的状态向量。 状态向量通常可以表示为
>
> > ... ( 某公式 )
>
> 其中fece是边e的当前利用率。 状态向量sm，T t的大小取决于区域m具有多少个边缘。
> 	具体地，边缘利用率为零表示发生边缘故障，即，边缘被破坏。 我们将sm，T t中的残破边缘利用率手动设置为一个相对较大的值（例如1.0），以便代理可以输出操作以减少残破边缘的流量（就像缓解瓶颈处的拥塞过程一样） 边缘）。

##### Action space

good sentence ：Action space is the output of agents and also routing decisions。

> 动作空间是代理的输出，也是路由决策的输出。 像[16]这样的方法决定了如何在每个路由器节点上分配流量。 但是，如果代理执行错误的操作，则这种逐跳方法可能会导致路由不一致，甚至导致环路。 因此，我们决定使用将流量需求分配到多个转发路径上的路由决策。 为了简化动作空间并减少路径维护的开销，我们预先计算并构造了连接每对入口和出口节点的K条转发路径，这与以前的工作[5] [9] [17]是一致的。 因此，路由决策是这些路径上的一组流量分配比。 在本文中，我们使用[5]中提出的流量忽略路径选择算法来计算转发路径，这似乎最适合我们的TE问题（考虑路径属性，开销等）。 已验证计算路径具有一些吸引人的属性，例如良好的负载平衡，高分集和低拉伸。 这使我们的方案即使预先计算和构造少量路径，也能够处理流量动态和拓扑变化。
>
> Formally，我们将Pm i，j表示为在区域m中连接入口节点i和出口节点j的一组预先计算的转发路径。 令am，T t为迭代步骤t区域m中T-agent的作用向量。  T-agent的作用向量可以表示为:
>
> > 公式
>
> 其中ai，j p∈[0，1]表示路径p上从入口节点i传递到出口节点j的业务量的分数。 在相同的入口节点i和相同的出口节点j之间的终端需求可以具有不同的源节点，但是将采用相同的划分比率集{ai，j p | p∈Pm i，j}。 显然，

##### Reward

> 奖励值是根据当前网络状态通过奖励功能计算得出的，可指导代理商策略的改进。 较大的奖励值表明，代理商采取的行动对TE目标有益。 我们将rm，T t表示为迭代步骤t区域m中T-agent的奖励值。 回顾我们的TE目标是最小化整个网络的最大边缘成本，奖励函数的直接设计是rm，T
>
> > 公式
>
> 其中h（e）计算边e的成本。  TE目标值越小，意味着奖励值越大。 **但是，基于全球目标值计算出的报酬无法正确评估T代理行动的质量。** 例如，如果某个地区的T-agent采取行动并导致极高的边际成本，则其他T-agent即使他们采取的行动实际上是好的，也将获得较小的奖励值。 错误的奖励会误导T代理的DNN参数更新。 在我们的设计中，我们使每个T代理了解其针对本地目标的政策，即最大程度地降低其所在区域的最大边缘成本。 然后奖励函数可以表示为
>
> > 公式 （3）
>
> 在等式中具有奖励功能。公式（3），每个T-agent只会根据其所在地区的状况来改进政策，这实际上也将有利于全球目标的优化。 这是因为T代理会调整终端需求的路由，以适应O代理和

#### B. O-agent Development

....

#### C. Training Algorithm

> ​	我们构建了一个数字网络环境来训练代理。 模拟网络具有与实际目标网络相同的拓扑和相同的边缘容量设置。 给定一个TM和所有代理的行为，可以轻松计算每个代理的状态向量和奖励。 我们采用先进的Deep RL算法，并利用增量训练使代理能够适应高度异构的流量模式甚至链路故障。 接下来，我们展示Deep RL算法和增量训练。 
>
> ​	回想一下，训练的目的是使每个代理学习从状态向量到动作向量的策略映射，以使折扣的累积奖励最大化，如第III-B节所述。 在本文中，我们采用最先进的Deep RL算法之一DDPG [25]来帮助代理学习策略。  DDPG支持高维状态空间以及确定性和连续动作，这符合我们系统的要求。 在DDPG中，有一个在线演员网络和一个在线评论家网络。 在线参与者网络是政策的DNN。 在线评论家网络用于估计称为Q值的预期折扣累积奖励。 简而言之，在线评论家网络评估参与者网络的行为并帮助参与者网络更新参数。 通过针对评估的Q值和目标Q值最小化损失函数来训练在线评论家网络。 为了提高更新的稳定性，DDPG维护两个独立的网络，即目标参与者网络和目标评论者网络，以帮助估计目标Q值。 两个目标网络具有与相应的在线网络相同的DNN结构，并从这两个在线网络缓慢更新。

> ​	我们在设计中制定并构建了DDPG的DNN。 由于座席以相同的方式更新DNN参数，因此为了简洁起见，我们接下来考虑使用通用座席，并从索引中删除区域的索引（即m）和座席类型（即T和O）。 在一般代理中，有一个由四个DNN组成的DDPG实例，即在线角色网络π（st |θπ），目标角色网络π？（st |θπ？）。
>    ），在线评论者网络Q（st，at |θQ）和目标评论者网络Q？（st，at |θQ？
>    ）设定为θπ，θπ？，θQ和θQ？ ，分别。 在我们的实现中，actor网络包含两个分别具有64和32个神经元的完全连接的隐藏层，并且激活函数是Leaky Rectifier函数[28]。 输入层（输出层）具有与状态向量（动作向量）的长度匹配的多个单位。 输出层将Softmax函数[28]作为激活函数，以便遵循等式中所示的动作约束。  （1）和等式 （4）。 批判网络包含三个分别具有64、32和64个神经元的隐藏层，其激活功能为泄漏整流器功能。 输入包括状态向量以及参与者网络输出的动作向量。 前两个隐藏层已完全连接，并以状态向量为输入。 第三隐藏层将动作向量和第二隐藏层的输出的串联作为输入，并馈入一个单元的输出层。

> ​	在每个迭代步骤t，在线参与者网络都会根据环境采取措施。 然后，可以收集一个由st，at，rt和st + 1组成的四元组样本。  st + 1是在状态st中采取行动后的新状态向量。 新样本将存储在固定大小的缓冲区中，如果缓冲区已满，则将覆盖缓冲区中最旧的样本。 然后，我们从缓冲区中随机选择一批样本（以k为索引）。 可以通过θQ：=θQ+ηQ∇θQL更新在线评论家网络，其中L = E [？  k（yk -Q（s（k），a（k）|θQ）]，2和yk = r（k）+γQ？（s（k + 1），π？（s（k + 1））））  yk是样本k的目标Q值，是在两个目标网络的帮助下计算的；γ∈[0，1]是一个折现因子；ηQ决定了在线批评家网络的学习率。 通过θπ：=θπ+ηπ∇θπJ更新，其中∇θπJ= E [∇aQ（s，a |θQ）| s = s（k），a =π（s（k））·∇θππ（  s |θπ）| s = s（k）]ηπ决定了在线演员网络的学习率，最后，基于在线网络分别缓慢更新目标演员网络和目标评论者网络。
>    =τθQ+（1 −τ）θQ？ 和θπ？  =τθπ+（1 −τ）θπ？  。  τ是用于调整网络学习率的小值。 为了学习令人满意的DNN参数，在线演员网络将在其输出中添加一个噪声值，以便在训练阶段进行动作探索，如前所述。 特别是，在每个迭代步骤中，通过
>
> ...



> 使用上述算法，对于具有给定TM的模拟网络，代理可以在足够的迭代步骤（即，足够大的T）之后学习良好的策略。 同时，希望能够在在线阶段很好地适应流量动态以及链路故障。 因此，我们利用增量训练的方法来增强代理的适应性。 特别是，我们使用一组TM（称为训练数据集）来训练代理。 在训练数据集中的每个TM设置的环境中，将针对T迭代步骤对代理进行训练，并且代理的参数将逐步更新。 通过创建动态环境，代理可以学习能够适应各种流量模式的策略。 由于代理以类似于前面所述的处理链路拥塞的方式处理链路故障，因此增量训练还可以促进链路故障场景中TE性能的改善。 实际上，可以离线从捕获的数据中提取用于离线训练的TM。 离线训练过程可以以集中方式或分散方式执行。 对于前者，将使用集中式服务器，在其中维护整个网络环境和所有代理。 也就是说，集中式服务器对于所有区域都是可靠的。 训练后，集中式服务器将把训练有素的代理（即DNN参数）分配到相应的区域。 对于后者，代理培训是在各个区域同时进行的。 特别是，每个区域都使用本地服务器维护局部环境，仅模拟其自己的区域以及该区域的两个代理（一个T代理和一个O代理）。 在每个迭代步骤中，相邻区域将交换一些信息，例如流量统计信息和奖励值。 因此，区域可以正常计算O型代理的状态和奖励。 第二种训练方式使区域避免共享一些敏感的内部信息，例如区域结构，边缘容量和边缘权重。 在在线阶段，代理可以以类似于第二种方式的方式，在区域之间几乎没有通信的情况下连续扩展其知识。





