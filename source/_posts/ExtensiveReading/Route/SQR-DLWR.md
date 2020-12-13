---
title: SQR&DLWR|Evaluating and Boosting Reinforcement Learning for Intra-domain Routing
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-19 10:24:31
categories: ExtensiveReading
description: MASS'19 (ccf C会)  四个角度去评价域内的RL相关的工作
tags:
    - Network
    - Reinforcement Learning
    - Routing
---



# hesy summary

* **在所有路由方案中，一个解决方案都不可能成为“最佳”解决方案并胜过其他解决方案**

> 原来路由也是分场景的！

* 评价RL相关、域内路由的工作，且自己做了两套方案及逆行比较，which是集中式的



# abstract

​	机器学习在计算机视觉和计算机游戏等领域的成功引发了人们对在计算机网络中应用机器学习的兴趣激增。 本文试图回答一个广泛争论的问题：我们能否通过强化学习（RL）来提高域内路由的性能，域内路由是Internet上最基本的模块之一？ 由于复杂的网络流量条件和较大的路由选择空间，很难为现有的基于RL的路由解决方案给出确切的答案。 为了深入了解基于RL的路由的挑战，我们系统地对不同的基于RL的路由解决方案进行了分类，并从可扩展性，稳定性，鲁棒性和收敛性方面研究了几种代表性方法的性能。 结合评估各种基于RL的路由解决方案的经验教训，我们提出了两种方法，称为监督Q网络路由（supervised Q-network routing (SQR)）和基于离散链路权重的路由（discrete link weight-based routing，DLWR），它们可以提高基于RL的路由的性能，并提高性能。 形成事实上的最短路径域内路由。



# introduction

​	路由是一种网络功能，可将数据包从给定的源传递到给定的目的地。 可以说，它是Internet中最基本的构建块，在服务质量（QoS）保证中起着至关重要的作用。 传统的路由策略，例如开放式最短路径优先（OSPF）路由[1]，可能会导致网络拥塞和链路利用率低，并且与**最佳路由方法相比，性能可能会差5000倍[2]**。 在动态业务量变化的情况下，已经致力于优化路由路径。 例如，反压路由[3]最初是为无线网络提出的，也可以应用在有线网络中，它基于相邻节点之间的拥塞梯度来动态转发流量。 但是，它在路由路径中的收敛速度可能会很长，**并且不一定会导致良好的小队列性能，如[4]**中所证明的。 将机器学习应用于网络路由以获得更好的性能可以追溯到1994年，**当时提出了Q路由的概念[5]。** 由于机器学习在其他领域（例如计算机视觉，游戏和自然语言处理）的巨大成功，最近对Q路由的兴趣再**次兴起[6] [7]**。 另外，最近的一些研究通过在路由中应用深度（强化）学习，证明了令人鼓舞的结**果[8] – [10]**。 这些研究讨论了潜在的基于学习的路由方法，并使用一些典型的机器学习方法进行了评估，例如深度信念架构，深度神经网络（DNN）和信任区域策略优化（TRPO）。 **但是，Internet路由的性能在很大程度上取决于流量动态和各种网络状况**。**例如，现有的Q路由及其变体会在数据包级别更新路由表，即，他们了解环境并估算单个数据包的数据包交付时间**。显然，它们的性能在高速网络中会受到影响，在高速网络中，数据包需要以微秒为单位转发。 **在所有路由方案中，一个解决方案都不可能成为“最佳”解决方案并胜过其他解决方案**。 根据这一观察，我们因此有动机去研究Internet路由中不同机器学习算法的利弊，并清除一些（虽然不太可能是全部）在路由中实际采用机器学习的障碍。 我们的研究并非不切实际地针对设计最有效的路由解决方案。 相反，我们提供了lessons(这里我觉得翻译成经验比较好)，在此基础上，我们展示了如何进一步改进现有方法。 

​	为此，我们研究了基于不同强化学习（RL）的路由策略对域内Internet路由性能的影响。 由于以下三个原因，我们缩小了关注点到RL和域内路由的: (1)**基于RL的路由[8]不需要标记的数据**，由于操作数据的规模大和网络的规模大，这是禁止的并且难以获得 状态;（2）在路由器处于同一自治系统（AS）域内的域内路由中，可以获得所有路由信息；（3）软件定义网络（SDN）的发展使通过全局网络视图通过中央控制平面实现智能路由算法变得容易了[11]。

​	**我们在以下方面评估基于RL的路由：**

> (1) **可扩展性**：在高速，大规模网络中是否可以保持良好的性能？(2) **稳定性**：路由方法是否对各种流量模式和网络条件具有弹性？(3) **健壮性**：路由方法是否可以有效避免“不良”路由状态?（例如，congested,long-delay links）？(4) **Convergence**：是否可以快速达到新的路由策略以适应动态网络变化？ 我们对强化学习的研究基于两种主要方法，即基于价值的优化方法和基于策略的优化方法。 图1总结了每种方法的架构及其相应的算法。在我们的研究中，对图1中标有*的算法（它们是强化学习的代表算法）进行了评估。 

​	**本文的贡献可以总结如下：**

> • 我们根据不同的时间尺度将基于RL的路由解决方案系统地分为两类，以更新路由决策：packet-controlled智能路由和epoch-controlled智能路由。在每个类别中，我们将路由问题都视为RL问题。 总体而言，我们的分类为将来基于RL的路由研究提供了一个全面的视图。
> • 在第一类中，我们分析经典Q路由的适用性，并评估其在实际网络设备上的性能。
> • 在第二类中，我们介绍了用于确定路由路径的不同方法：基于显式路径的路由和基于隐式链路权重的路由。 然后，我们彻底评估典型RL算法的性能，并讨论其优缺点。
> • 利用从Q路由和将现有RL算法应用于时代控制路由中获得的见识，我们提出了两种方法，监督Q网络路由（SQR）和基于离散链路权重的路由（DLWR），可提高性能 基于RL的路由，性能优于事实上的最短路径路由。

​	

​	**本文的其余部分的结构如下。**

> 第二节介绍智能路由问题的背景，并通过强化学习来阐述路由问题。
>
> 第三节分析了分组控制的智能路由的适用性。
>
> 然后，我们分别在第IV节和第V节中分别分析和改进基于显式的基于路径的路由和基于隐式链路权重的路由。
>
> 第六节总结了从RL路由方法获得的见解。
>
> 第七节介绍相关工作。
>
> 最后，第八节总结了论文



# II. BACKGROUND:ROUTING AS REINFORCEMENT LEARNING

## A. Network and Traffic Models

​	假设网络是网络的有向图G =（V，E），并且E = {e（v1，v2），e（v2，v1），...}表示其中V = {v1，  v2，...，vn}表示路由器之间的节点（路由器）链接。 每个链接e（vi，vj）具有容量C（vi，vj），表示可以从节点vi传递到vj的流量。 将网络的流量需求表示为流量矩阵M = [m~ij~]~n×n~，其中mij是从源节点vi到目标vj的流量。 当源－目的地对之间没有流量时，相应的流量将设置为零。  RL适用于无法获取标签数据或难以获取标签数据的情况。 在这种情况下，假定未知环境中的agent2通过接收有关环境当前状态的信息，采取措施并接收奖励或惩罚信号来找到最佳的行为策略，这反映了该agent过去的行为是否适当 。 代理商的目标是找到可以最大化长期回报的政策。  RL的简要介绍和彻底处理可以分别在[12]和[13]中找到。 路由问题的制定者是路由决策者。 在RL框架中，代理的动作是更新路由路径。 当前，代理采取行动有两种不同的时间尺度：（1）对每个数据包采取行动，（2）假设时间划分为多个纪元，则每个纪元都采取行动。 前者称为分组控制的智能路由，后者称为历元控制的智能路由。

## B. Packet-Controlled Intelligent Routing

> Q路由及其变体是典型的数据包控制的智能路由。  Q路由是由Boyan和Littman [5]基于Bellman-Ford最短路径算法[14]和Q学习框架[15]提出的。 使用Q路由，网络中的每个节点都可以充当代理，以决定转发当前数据包的下一跳。 之所以称为Q路由，是因为每个节点在转发数据包之前都使用Q值来估计从当前节点经过不同的邻居到目的地的延迟。 对于节点vi处的每个数据包，代理选择具有最小Qvi（vj，d）的相邻节点vj作为数据包的下一跳，其中，如果节点vi通过以下方式转发数据包，则Qvi（vj，d）表示Q值。 它的邻近节点vj到目的地d。 在将数据包发送到vj时，vi立即从vj接收行程中剩余时间的反馈，表示为Qvj（d），即Qvj（d）= min Qvj（vz，d）（1）vz∈n  vj用以下学习函数更新节点vi的Q值：？Qvi（vj，d）=η（r + minQvj（d）-Qvi（vj，d））（2）其中，η是学习率，  r是数据包从节点vi到节点vj花费的时间，包括排队时间和传输时间。 基于Bellman-Ford最短路径算法，公式（2）的公式为：使用最佳策略从节点vi到目的地d所需的时间等于节点vi到节点vj的最短时间以及从节点vj所需的时间 以最佳策略到达目的地。 证明该算法在n节点网络中最多经过n-1次迭代后收敛



## C. Epoch-controlled Intelligent Routing 

### 1) Objective of epoch-controlled routing

​	optimal routing有不同的目标。 在本文中，我们考虑以下最优路由的特殊形式。 将在时期t末尾的链接e（vi，vj）上等待传输的数据包数量表示为ut ij。 最佳路由的目标是最小化所有t上所有链路的队列长度，即最小

![image-20201125215423618](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/25/215424-353121.png)



### 2) Reinforcement Learning for Routing

> ​	在RL框架中投放上述路由问题，我们将做出路由决策的网络控制器称为代理，将与控制器交互的网络称为环境。 <u>环境状态由流量矩阵M捕获</u>。动作根据观察到的状态将动作空间作为A.组成路由选择决策。 将状态空间表示为S，并在每个时间点t，代理接收环境状态St∈S，然后确定一个动作At∈A，该动作根据观察到的状态构成路由决策。 在下一个时间段，环境Rt + 1和新状态St + 1的反馈将发送到代理。 为了符合路由目标，我们将环境Rt + 1的反馈设置为：

![image-20201125215548761](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/25/215604-43857.png)

> ​	在一系列时间t = 0、1、2，...的情况下，交互过程可以表示为S0，A0，R1，S1，A1，R2，S2，A2，...，可以用数学公式表示为 马尔可夫决策过程（MDP）[12]。 换句话说，奖励Rt + 1和下一状态St + 1仅取决于当前状态St和关联的动作At，概率为P（St + 1，Rt + 1 | St，At）。 因此，路由策略是从状态到选择每个动作的概率的映射，表示为S∈S和A∈A的π（A | S）。 如果代理在策略π下在状态S下采取动作A，则表示为Qπ（S，A）的动作值函数是来自环境的反馈值。 传统的强化学习问题通常是游戏问题，将在有限的范围内终止

动作值通常定义为折现的未来奖励的期望Qπ（S，A）= E [Rt + 1 +γRt+ 2 +γ2Rt+ 3 + ... +γTRT+ 1 | S，A]，其中γ为 奖励的折扣因子。 最佳Q值应遵循Bellman方程Q ∗，右侧是目标。i + 1（S，A）= E（r +γmaxA？Qi（S？，A？）| S，A）.

​	尽管如此，应根据路由问题量身定制传统的设置操作值的方法 。 由于未转发的数据包将在队列中进行缓冲，因此队列长度反映了一段时间内的累积结果。 因此，将本地时间段内所有链路上的最大队列大小最小化也是一个合理的目标^3^。

### 3) Learning Output

> ​	在以上基于RL的路由框架上，我们可能有不同的方式来呈现学习输出。 在本文中，我们研究了两种类型的学习输出：（1）基于显式路径的路由，以及（2）基于隐式链路权重的路由。 在基于显式路径的路由中，学习的输出包括一组路径，每个路径对应于应用于将数据包从给定源传递到给定目的地的路径。 在基于隐式链接权重的路由中，学习的输出包括所有链接上的权重值，我们根据这些值通过Dijkstra的最短路径算法找到路由路径



### 4) System Architecture for RL-based Routing:

> ​	由于我们只关注域内路由，因此我们可以通过具有全局网络视图的中央控制平面实现基于RL的智能路由[11]。 该代理在中央控制器中实现。 在每个时期，可编程路由器将环境信息（即流信息和队列大小）发送给代理； 代理学习环境并使用RL算法制定路由决策，然后将其发送到路由器以指导其数据包转发。



# III. EVALUATING PACKET-CONTROLLED INTELLIGENT ROUTING

​	智能路由的代表性方法是Q路由及其变体。 在本节中，我们测试可编程交换机上Q路由的可扩展性。 <u>特别是，我们检查高速交换机是否能够负担一个包的处理时间内检查其缓冲区并更新路由表的开销</u>。 

​	在Q路由中，交换机需要（1）检查每个以太网端口上缓冲区的队列大小，（2）如II-B节所述更新Q表，并且（3）将收到的数据包转发到 具有每个数据包时间的最小估计延迟的下一跳。 实际上，Q路由需要下一跳开关才能将有关最小估计延迟的反馈返回给目的地。<u>尽管如此，我们真正关心的是交换机能够以多快的速度更新其路由表并转发数据包。</u>从本地交换机的观点来看，导致更新的原因（即，来自下一跳交换机的反馈信息）对于交换机的分组转发性能实际上并不重要。 基于此观察，我们可以模拟Q路由的行为并评估其数据包转发速度，而无需实际接收和使用下一跳的反馈信息。 **<u>换句话说，Q路由的实际性能甚至会比我们在此处公开的还要差。</u>**==？== 我们在一个简单的测试平台上实施和测试Q路由。 该测试平台内置有两台通过可编程交换机连接的台式计算机。 两台计算机被分配到不同的以太网段。 一台计算机用于流量生成器，以通过交换机将目的地为另一台计算机的数据包发送到另一台计算机。 交换机收到报文后，检查路由表，将报文转发到目的地址。 目标计算机还用于监视性能，即延迟和吞吐量。 **可编程交换机具有2个3.1 GHz的Intel Core i5-3450 CPU，6 MB高速缓存和16 GB内存。 它还配备了7个以太网Intel i350千兆接口**，而我们在实验中仅使用2个接口。 台式计算机是配备相同以太网接口的Dell poweredge T620。

​	**<u>Q路由算法是在可编程交换机中实现的，无需使用来自目的地的任何反馈信息</u>**，但是，交换机需要按照Q路由的要求，在传输每个数据包后使用相同的路由条目来“更新”其路由表。 相比之下，基准测试方法使用固定路由，该路由简单地使用固定转发表将接收到的数据包转发到目标，而没有任何“更新”。 这等效于具有稳定网络拓扑的网络中的最短路径路由。 我们分别测量了Q路由和最短路径路由的吞吐量和延迟。 为了评估吞吐量，我们让流量生成器以全速（1.5 Gbps）将大小为1024字节的数据包注入到交换机中。 我们评估监视器收到的数据包数量。 为了进行延迟评估，我们分别以450 Mbps，700 Mbps和965 Mbps的速率发送数据包。 表I显示了Q路由和最短路径路由的比较。从结果可以看出，转发速度越高，Q路由的等待时间就越长。 这是因为更高的转发速度意味着每秒发送更多的数据包，从而每秒发送更多的路由表更新。  Q路由中的此类更新减慢了交换机转发速度的近一半，并可能导致高速网络严重拥塞。



# 疑问

* introduction中说到Q路由的事情

  * 在数据包级别更新路由表 ，能保证收敛么...

  * 需要调研这些文章

  * **在所有路由方案中，一个解决方案都不可能成为“最佳”解决方案并胜过其他解决方案**

    > 原来路由也是分场景的！