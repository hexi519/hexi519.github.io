---
title: paperWriting
tags:
---

# master experience

<img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201015202754285.png" alt="image-20201015202754285" style="zoom:50%;" />



# writing patterns 

> for RL-based networking

 ==不管是罗列前人工作，还是讲别人的缺点，还是讲我们的tool的优点，都是**两个方面!!!** 一个方面实在是太单薄==

## Auto

### introduction

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





## Date ( ICNP'20 )

> 前三段和最后一段绝壁不错，完全是个典范

### Introduction

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



## DRL相关

### DRL的优势

> from DATE(ICNP'20) introduction

Deep RL, as one of the leading Machine Learning (ML) techniques, has the potential of solving complex and dynamic control problems. Deep RL algorithms can automatically exploit hidden patterns in training data and continue improving its TE strategy over time. Well-trained Deep RL models can do inference efficiently even for the inputs that never appeared before. **Besides**, Deep RL models can be trained by interacting with the network environment without requiring labeled data that are usually hard to obtain in real networks [15]. Several recent proposals [15]–[17] have capitalized on these advancements to tackle the crucial and timely challenge of TE. However, We hasten to emphasize that these RL-based approaches only focus on intra-region TE problems within a single, fully-controlled region (regarded as a single agent) and thus cannot be applied to the distributed TE problem in multi-region networks.

1. DRL是很前沿的技术，which可以解决复杂问题，并且挖掘隐含的patten ( 这个是RL作为ML的一个子领域的优点，i.e. 只要是ML都有这个优点，which means **也可以套到ML的优势里面去说** )
2. DRL 泛化性很好（ 同上
3. 不需要标签，which在真实网络中是难获取的