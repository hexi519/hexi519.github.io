---
title: Fuzzy Kanerva-based TCP Q-learning
top: false
cover: false
date: 2020-10-25 16:13:55
password: 96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e
categories: PaperReading
tags:
    - Network
    - Reinforcement Learning
    - Congestion Control
---

# Hesy summary 

DCOSS'16 

主要用于梳理下行文思路，用于写作学习。abstraction,design,performance都很出彩

* [abstract](#abstract)的三段论值得学习
* introduction的逻辑应该是 ```我们提出了XXXX，能克服前人工作的xx缺点``` 而不是```前人工作有xx缺点，为此我们提出了XXXX```
* related work里面的抨击值得摘抄！
* design的逻辑很好！
  * 整体的运行架构是什么 （ 如何将Q-learning算法结合我们的场景进行运行
  * RL的几个要素分别是什么 （ 如何结合Q-learning算法和我们的问题进行芥末
  * 实现上遇到的challenge 以及我们的解决方案 , which is another 华彩
* [performance](#Performance)的逻辑和布局也学习到了！
  * 实验设置
  * 整体在xx 和 yy 方面的提升 &  为何会出现这样情况的分析
  * 在xx方面的结果 翔实的展示； 在yy方面的结果 翔实的展示

* 小细节
  * 自己拼接造出的单词 ，dash别忘了
    * sub-component
    * pre-configured
    * re-think

<!-- more -->

# abstract

* 【**Background: important things and urgent need**】 

  Advances in YY technology have resulted in **pervasive deployment** of devices of ... . **The need** for **XX** that ....( 描述下对XX的性能期待, e.g. 高吞吐,低延迟 )  **necessitate re-thinking** of conventional design of （你要研究的领域/东西）.

  > 无线技术的进步已导致在尺寸，存储和计算能力方面具有高度可变性的设备的普遍部署(pervasive deployment)。 为了保持以高可靠性传送数据的连续连接，需要重新考虑传统的传输层协议设计。



* 【**What we propose and what's its features**】

  **This paper investigates** the use of  **ZZ ** （你使用的算法/技巧/工具） in **YY**（你研究的领域）... , **wherein** ...（描述下你做了什么）. **Furthermore**, it demonstrates how ...(具体描述下研究工作中华彩的细节，套路大概就是"我发现了xx(性能瓶颈)在实现的时候很关键，我们是这样解决的")

  > 本文研究了在拥塞避免状态期间Q学习在TCP cwnd adaptation中的使用，其中窗口的经典alternation已被replaced，从而允许协议立即响应先前看到的网络条件。此外，它展现了内存如何在构建探索空间中发挥关键作用，并提出了通过函数逼近来减少此开销的方法。[ 后面这句话实际上不是一个addtional point，还是在讲这个scheme本身，只不过是scheme的细节，which 是自己的巧思体现之处。] 



* 【**Performance description**】

  **The superior performance** of <u>our</u> approach over *Baseline XX* is **demonstrated through a comprehensive simulation study**, **revealing** xx% and xx% improvement in *metric1* and *metric2* respectively,on real-world(classic) traces/topologies. **We also show** **how** **ZZ **（你使用的算法/技巧/工具） **can be used to** (处理上一段所说的性能瓶颈，while 保持了一个好的performance( 高吞吐/低延迟,这个还是要细点说的) ) .

  * 这里our换成别个描述characteristic的形容词更好，e.g. learning-based/data-driven

  > 通过全面的仿真研究证明了基于学习的方法优于TCP New Reno的性能，对于评估的拓扑，吞吐量和延迟分别提高了33.8％和12.1％。 我们还展示了如何使用函数逼近来显着降低基于学习的协议的内存需求，同时保持相同的吞吐量和延迟。

  

# 1 introduction

快到1页

==这里的表达不应该是“以往的工作有xx缺点，为改进此缺点我们提出...”，而应该是“以往的工作有xx缺点。我们提出了基于xx技术的XX。它的表现...and... ”==



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



# 5  FUZZY KANERVA-BASED TCP Q-LEARNING

> 先讲总体的思路，再讲细节的设计

> ==对应于我就是先讲总体的流程，然后再讲 1. lstm的设计  2. attention的设计（不仅能提高观察，还能提高性能 !  理由，在平缓的时候关注点能平坦,,, 在剧烈变化的时候关注点能聚焦... --> 需要做个对比试验，此外，关于理由还是要再想清楚点.. ）==

* function approximator的重要性

  * 现有的一些方法，以及他们存在的一些问题

  * 我们使用的Kanerva编码的原理和formulation，以及如何融入我们这个框架里面的 【创新和修改部分】

    > 请注意，这里阐述细节并不是为了讲算法原理，而是要讲清楚如何讲算法应用到我们这里面来的
  
  * 给出伪代码
  * 描述伪代码的流程 ( lines xx-xx ) ，这里还分析了下代码的时空复杂度



# 6 Performance Evaluation <h2 id="Performance"></h2>

* 实验设置
  * 评估了三个方法，baseline是New Reno
  * 单源拓扑上测试了性能，哑铃状拓扑测试了公平性，每个算跑8次
  * 链路设置：RTT为100ms；每800s在7.5Mbps和2.5Mbps之间切换；缓冲区大小为BDP，which is 50个数据包
  * 每个算法跑了8次

> 我们使用基于ns-3的数据包级仿真，通过与TCP New Reno进行比较，来评估在不同带宽条件下TCPLearning，CMAC和Fuzzy TCPLearning的性能。 我们从图1（a）所示的单瓶颈网络开始，然后将评估范围扩展到图1（b）所示的更复杂的多流网络，以进行与公平相关的研究。 我们使用这些拓扑来演示受控环境中学习的特征，并显示对吞吐量和延迟的影响。 瓶颈带宽（在路由器-接收器链路上）每800s交替在7.5Mbps和2.5Mbps之间切换。 网络RTT设置为100ms，缓冲区大小设置为BDP，在我们的仿真中为50个数据包。 我们使用每种算法进行8个实验，并报告平均吞吐量和延迟。 值的标准偏差使用误差线显示。
>    一种。

> We use ns-3 based packet level simulations to evaluate the performance of TCPLearning, CMAC and Fuzzy TCPLearning in varying bandwidth conditions by comparing with TCP New Reno. We begin with a single-bottleneck network shown in Fig. 1(a) and later extend the evaluation to a more complex multi-flow network shown in Fig. 1(b) for fairness-related studies. We use these topologies to demonstrate the characteristic features of learning in controlled environments and show the impact on throughput and delay. The bottleneck bandwidth (on the router-receiver link) switches alternately between 7.5Mbps and 2.5Mbps every 800s. The network RTT is set to 100ms and the buffer size is set to BDP, which is 50 packets in our simulation. We conduct 8 experiments using each algorithm and report the average throughput and delay. The standard deviation of values is shown using error bars.



## A. TCP-Learning without Function Approximation

在这种情况下，我们禁用函数逼近并设置探索率？ 对于TCPLearning到0.1。 初始学习率α设置为0.3，并且每隔10s降低0.995倍。 总仿真时间设置为<u>6400s</u>。

---

* 平均吞吐量和延迟： 【是一个总体的视图】

  * **陈述了**不同带宽情况下，算法和baseline之间的吞吐量情况差距

  	> ​	**图2（a）**比较了TCP New Reno和TCPLearning在瓶颈带宽每800s介于7.5Mbps和2.5Mbps之间切换时获得的**平均吞吐量**。 结果表明，随着瓶颈带宽的波动，TCPLearning的性能明显优于TCP New Reno。 我们观察到，在7.5Mbps的瓶颈带宽下，TCPLearning的平均吞吐量为6.72Mbps，而TCP New Reno的平均吞吐量为4.46Mbps。 在瓶颈带宽为2.5Mbps的情况下，TCPLearning的平均吞吐量为2.27Mbps，而TCP New Reno的平均吞吐量为2.26Mbps。 我们注意到，由于默认缓冲区大小在100ms的网络RTT和2.5Mbps的瓶颈带宽下是最佳的，因此TCP New Reno充分利用了该缓冲区，并且TCPLearning获得了同样好的性能。
  	>
  	> ​	**图2（b）**比较了在相同网络设置下TCP New Reno和TCPLearning实现的**平均RTT**。 结果表明，在瓶颈带宽为7.5Mbps时，TCPLearning的平均RTT为111ms，而TCP New Reno的平均RTT为109ms。 在瓶颈带宽为2.5Mbps时，TCPLearning的平均RTT为114ms，而TCP New Reno的平均RTT为154ms。 在任何瓶颈带宽下，TCPLearning在平均吞吐量方面都优于TCP New Reno。 图2（a）表明，在这种高带宽波动的网络中，TCPLearning将平均吞吐量提高了33.8％。 当考虑图2（b）所示的延迟时，尽管TCPLearning的性能稍差一些，但在这种情况下，在2.5Mbps的瓶颈带宽下性能下降了1.8％，在7.5Mbps的瓶颈带宽下，其性能优于TCP New Reno 26％。 平均而言，TCPLearning可将延迟减少12.1％。

  * 开始**分析解释**为啥人家会差【我觉得这一段批评classic的，我可以学习下】，我们会好

    请注意，**要用图片来佐证你的分析**

  	> ​    我们观察到，TCP New Reno的平均吞吐量为4.46Mbps，远小于瓶颈带宽7.5Mbps。 这是因为TCP New Reno的预定义的拥塞避免算法使cwnd超出了连接所能支持的范围，最终使网络拥塞，最终导致cwnd和吞吐量显着下降。 <u>更糟糕的是，由于TCP New Reno算法无法存储过去的操作以及这些操作对性能的影响，因此它会重复相同的行为。 图3显示了在模拟TCP New Reno期间cwnd的大小与时间的关系。 该图表明，该算法反复做出相同的错误决策，从而降低了性能。</u>
  	>    另外，TCP new Reno在cwnd每次<u>显着下降之后需要花费大量时间来恢复</u>，因为它必须在避免拥塞阶段线性增加cwnd。 但是，TCPLearning通过学习经验来克服了这一缺陷。 图3还显示了在TCPLearning仿真期间，cwnd的大小与时间的关系。 该图显示，随着学习过程的进行，TCPLearning进行了各种实验，这些实验会修改cwnd直到110s。  110s之后，学习到的动作值函数Q（s，a）收敛到最佳动作值函数Q ∗（s，a）。这时，TCPLearning找到一个最佳动作，该动作充分利用了缓冲区并且不会触发任何动作 数据包丢失。 这种习得的动作使cwnd足够大，可以达到良好的性能，但是比发生包丢失的上限稍小。 通过这种最佳操作获得的高吞吐量将保持稳定，直到800s之后，瓶颈带宽才会切换。

---

> 讲完整体视图/情况  以及 为什么会这样 之后，开始讲实时的指标 ( 细化 )


* 实时吞吐量 【还是踩了别人一脚，分析也比较少了

	> ​	图4显示了TCP New Reno和TCPLearning的实时吞吐量，其中每800s的高带宽在7.5Mbps和2.5Mbps之间切换。 该图显示，当瓶颈带宽为7.5Mbps（在最初的800秒钟内）时，TCP New Reno会经历重复的数据包丢失，从而导致平均吞吐量较低且不稳定。 当瓶颈带宽切换到一个较小的值（800s后为2.5Mbps）时，TCP New Reno会充分利用缓冲区并获得高而稳定的吞吐量。 我们观察到，在使用TCP New Reno时，那些具有高瓶颈带宽的方案会有效并严重降低吞吐量。 但是，波动的瓶颈带宽对TCPLearning实现的吞吐量影响很小。 如图4所示，TCPLearning用110s来学习7.5Mbps瓶颈带宽时的最佳策略，并保持高而稳定的吞吐量，直到800s。 当瓶颈带宽在800s之后切换到2.5Mbps时，TCPLearning会非常迅速地收敛，并且仍然可以实现稳定的吞吐量，直到瓶颈带宽再次切换为止。

* 实时RTT 【

  > 图5显示了在上述相同带宽切换情况下TCP New Reno和TCPLeaning的实时RTT。 我们发现，在瓶颈带宽波动的情况下，TCPLearning比TCP New Reno实现了更稳定和更低的RTT。



## B. TCPLearning with Function Approximation We

> 我们通过将CMAC算法和Fuzzy TCPLearning算法应用于图1（a）所示的相同网络拓扑来评估其性能。  CMAC算法将状态动作空间划分为一组不同的图块，并创建多个图块以在学习中提供粗粒度和细粒度的概括。 在我们的实验中，我们使用5个切片，每个切片有3,125个切片，因为我们有5个可能的操作和4个状态变量，每个变量均等地划分为5个间隔。 要学习动作值，我们需要存储15625个θ值，这些值等于每个平铺3125个图块乘以5个平铺。 由于每个平铺都有大的平铺，因此需要较少的内存来存储所有θ值。  Fuzzy TCPLearning算法将函数逼近与连续的隶属度等级结合使用，以控制并显着减少存储学习值（对于TCPLearning而言是Q表）所需的内存量，同时保持性能。
>    为了进行实验，我们首先随机生成一组100个原型，然后初始化相应的θ值。 然后，使用等式2通过Q学习过程更新每个原型的θi值。

* **平均吞吐量和延迟**

  > 图2还比较了CMAC和Fuzzy TCPLearning在两个交替的瓶颈带宽下获得的平均吞吐量和延迟。我们观察到，在两个不同的瓶颈带宽上，CMAC和Fuzzy TCPLearning在吞吐量和延迟方面都优于TCP New Reno。我们注意到，当瓶颈带宽为7.5Mbps时，与TCPLearning相比，CMAC和Fuzzy TCPLearning的吞吐量都有轻微下降。 当瓶颈带宽为2.5Mbps时，可以观察到几乎相同的吞吐量。 此外，就两个瓶颈带宽的延迟而言，CMAC和Fuzzy TCPLearning的性能均比New Reno更好，而性能比TCPLearning差。 我们得出结论，就吞吐量和延迟而言，平均而言，TCPLearning表现最佳。 但是，利用功能逼近技术，CMAC和模糊TCPLearning可以显着减少内存使用，同时实现可比的性能。
  > 

* **减少内存使用的影响**

  > TCPLearning算法分配内存以存储可能遇到的50,000个状态操作对中的每对。 由于4个字节用于存储与一个状态操作对相对应的Q值，因此TCPLearning使用200KB的内存存储。 相反，CMAC算法仅需要存储θ值，该值可能远小于状态动作对的数量。 我们的实验中使用的θ值总数为15,625，最终的内存使用量为62.5KB，不到TCPLearning使用的内存的1/3。 模糊TCPLearning算法为100个状态-动作对分配存储。 由于需要20个字节来存储一个状态-动作对，另外400个字节用于存储100个原型的θ值，因此它仅使用2.4KB内存，因此非常适合物联网应用。




## C. Fairness Observations

​	我们通过评估图1（b）所示的哑铃网络拓扑中的性能来评估TCPLearning算法的公平性。 该拓扑包括<u>2个发送器和2个接收器，它们在100ms RTT时共享2.5Mbps的瓶颈带宽。 瓶颈路由器缓冲区大小设置为100个数据包</u>。 两个流中的数据传输同时开始。 表III显示了TCP New Reno和TCPLearning的两个竞争流的平均吞吐量。 我们观察到，使用TCP New Reno和TCPLearning两种流的平均吞吐量几乎相同，因此在the那教的公平性指数中得分均相等。



