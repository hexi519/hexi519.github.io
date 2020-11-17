> 考虑一个由一组容量的单向链路组成的网络，该网络由一组源共享，其中源的特征在于效用函数的传输速率呈凹形增加，目标是计算使总和最大化的源速率 的公用事业超过了容量限制。 集中解决该问题不仅需要了解所有实用程序功能，而且更糟糕的是，由于通过共享链接进行的源耦合，可能导致所有源之间的复杂协调。 取而代之的是，我们提出了一种分散式方案，该方案消除了这一要求，并自然地适应了不断变化的网络状况。 关键是要考虑对偶问题，其结构建议将网络链接和源视为分布式计算系统的处理器，以使用梯度投影法解决对偶问题。 每个处理器执行局部算法，将其计算结果传达给其他处理器，然后重复该循环。 该算法采用熟悉的反应流控制形式。 每个链路基于本地总的源速率，计算出链路上带宽单位的“价格”。源被反馈到标量价格，在标量价格中，使用的所有链路的总和将被收取，并且它选择传输速率以最大化自身的利益。 公用事业减去带宽成本。 这些单独的最优价格对于一般的价格向量可能不是社会最优的，即，它们可能不会使总效用最大化。 该算法迭代地接近使个人和社会最优性保持一致的价格向量，从而确实使总效用最大化。
>    该算法是部分异步的[5，Ch。  [图6]中，源和链路可以基于过时的信息进行计算，它们可以在不同的时间以不同的频率进行通信，并且通信延迟可能很大，不同并且随时间变化。 我们证明只要更新之间的间隔是有界的，该算法就会收敛以产生最佳速率。 在平衡状态下，共享相同链接的源不一定平等地共享可用带宽。 相反，它们的份额反映了它们如何根据效用函数来表示对资源的重视程度，以及它们对资源的使用如何暗含了他人的成本。 这可能是根据不同的费率分配提供差异化服务的基础。 推导了基本算法，并在静态环境中证明了其收敛性，该环境中的链路容量和活动源集保持不变。 该算法直接推广到时变环境的情况。 我们从原型中给出了一些测量结果，这些测量结果说明了网络条件变化时算法的收敛性。 本文的结构如下。 在第二节中，我们提出了优化问题及其激励我们方法的对偶。 在第三部分中，我们导出了同步算法并描述了其收敛性。 该算法及其收敛证明在第四节中扩展为异步设置。 在第五节中，我们谈到公平和定价。 在第六节中，我们介绍了从原型获得的收敛性实验结果。 收敛性证明在两个附录中。
>    B．read for 2 h  



TON'98@墨尔本大学



# abstract

​	We propose an optimization approach to flow control where the objective is to maximize the aggregate source utility over their transmission rates。 我们将网络链接和源视为分布式计算系统的处理器，使用gradient project algorithm去解决dual problem。 在此系统中，源选择传输速率以最大化their own benefits, utility minus bandwidth cost，and network links adjust bandwidth prices to coordinate the sources’ decisions.  We provide asynchronous distributed algorithms and prove their convergence in a static environment. We present measurements obtained from a preliminary prototype to illustrate the convergence of the algorithm in a slowly time- varying environment. We discuss its fairness property.。 我们允许 feedback delays to be different, substantial（很大的意思），and time varing，并且链接和源可以在不同的时间以不同的频率进行更新。 我们提供了异步分布式算法，并证明了它们在static environment中的收敛性。我们介绍了从初步原型获得的测结果，以说明算法在slowly time-varying的环境中的收敛性。 我们讨论其公平性(We discuss its fairness property)。



# 1 introduction

It seems better to 使用可变比特率（ABR）而不是恒定比特率（CBR）服务为可变带宽的弹性流量[31]提供服务[31]。的确，这种folklore可以在以下抽象模型中得到正式证明：假设网络为一组弹性资源提供固定和可变带宽，并根据过量需求对其定价，并且资源自由购买以最大程度地发挥自己的利益。 解释是，在模型中仅需要固定带宽的源实际上将订阅CBR，而同时需要固定带宽和可变带宽的源将subscribe to ABR with a minimum cell-rate guarantee。 我们在[23]，[24]中表明，在均衡状态下，所有信号源都处于最佳状态，需求等于供给，每个信号源都希望有严格正数的可变带宽。 这种观察可能为端到端流量控制提供了另一个动机，因为无功流量控制是提供可变带宽的一种实用方法，在无功流量控制中，源响应网络条件的变化来调整其传输速率。 本文的目的是提出一种流量控制的优化方法，其中将控制机制作为优化网络性能全局度量的一种手段。 我们将介绍同步和异步算法，并证明它们在静态网络环境中的收敛性。 然后，我们将描述一个原型，并提供实验测量值以说明算法的收敛性。

> 这里把reactive flow control都叫做无功流量控制...

## A summary

* 背景/元素介绍

  * a set L of 无向链路 of capacities $c_l, l\in L$
  * the network is shared by a set of $S$ of sources , and $s$ is characterized by a utility function  $U_s(x_s)$, **<u>which is concave</u>** increasing in its transmission rate $x_s$  ==居然是凹的..能理解为啥一定要是凹的么==
  * The goal is to calculate source rates that maximize the sum of the utilities $\sum_{s\in S} U_s(x_s)$ over $x_s$ subject to capacity constraints

   集中解决该问题不仅需要了解所有实用程序功能，而且更糟糕的是，由于通过共享链接进行的源耦合，可能导致所有源之间的复杂协调。 取而代之的是，我们提出了一种分散式方案，**<u>该方案消除了这一要求</u>**【==居然可以去耦合，惊了==】，并自然地适应了不断变化的网络状况。 关键是要考虑对偶问题，其结构建议将网络链接和源视为分布式计算系统的处理器，以使用梯度投影法解决对偶问题。 每个处理器执行局部算法，将其计算结果传达给其他处理器，然后重复该循环。

  

* 该算法采用熟悉的**<u>reactive flow control</u>**。

  * 流程
  * 每个链路$l$基于local aggregate source rate==这个指的是收包的速率?==，计算出链路上带宽单位的“价格”$p_l$。A source $s$ is fed back the scalar price  $p^s=\sum p_l$，where the sum is taken over all links that  $s$ uses, and it chooses a transmission rate  $x_s$  that maximizes it own benefit $U_s(x_s)-p^sx_s$ , utility minus the bandwidth cost。

  * 这些单独的最优价格对于a general price vector( $p_l,l\in L$ )可能不是social optimal，i.e.，它们可能不会使总效用最大化。该算法iteratively approaches a price vector ( $p_l^*,l\in L$ ) that aligns 个人和社会最优性保持一致的价格向量，从而( $x(p_l^{*s}),s\in S$ )确实使总效用最大化。

    > 我觉得这里a general price vector翻译成总体的价格向量
    >
    > ==所以这里的意思是调整价格向量？==

  * 该算法是<u>部分异步</u>的[5,Ch. 6]中，源和链路可以基于过时的信息进行计算，它们可以在不同的时间以不同的频率进行通信，并且通信延迟可能很大，不同并且随时间变化。 

    * 我们证明只要更新之间的间隔是有界的，该算法就会收敛以产生最佳速率。 

    * 在平衡状态下，共享相同链接的源不一定平等地共享可用带宽。 相反，它们的份额反映了how they value their use of the resources，以及它们对资源的使用如何暗含了a cost on others。 这可能是根据不同的费率分配提供差异化服务的基础。 

    * 基本算法 is derived and its convergence proved in a <u>static environment</u>，where 链路容量和活动源集保持不变。 该算法直接推广到时变环境的情况。 我们从原型中给出了一些测量结果，这些测量结果说明了<u>网络条件变化时</u>算法的收敛性。 

      > 定义了什么是static environment

* 本文的结构如下。

  * 在第二节中，我们提出了优化问题及其激励我们方法的对偶。 
  * 在第三部分中，我们导出了同步算法并描述了其收敛性。
  * 该算法及其收敛证明在第四节中扩展为异步设置。
  * 在第五节中，我们谈到公平和定价。 
  * 在第六节中，我们介绍了从原型获得的收敛性实验结果。 收敛性证明在两个附录中。

  

## B extensions

* 现在，我们评论过去的作品和扩展。 **<u>基本算法已在[20]中提出，初步原型在[19]中进行了简要讨论</u>**。 在本文中，我们通过分析和实施来分析其收敛性和公平性。 基本算法要求将链接价格传递给源，将源速率传递给链接，<u>因此无法在Internet上实现</u>。 

* <u>**如下[25]，[21]大大简化了此通信要求**</u>。

  在[25]中，我们描述了一种使用本地信息进行链接以估算源速率的方法，并证明了仍然保持了最优性。 这消除了从源到链接的显式通信的需要。 

  相反，我们在[21]中提出了一种方法，该方法仅使用二进制反馈即可完成从链接到源的通信。 这可以通过使用IP头[9]，[27]中建议的显式拥塞通知（ECN）位来实现。 这两个简化组合成一个流控制方案，我们称之为随机早期标记（REM），它是随机早期检测（RED）的一种形式[10]，它不仅可以稳定网络队列，而且可以跟踪全局最优值。 面对较大的反馈延迟，使链接的价格取过去价格的加权平均值，REM变得更强大[1]。  REM及其增强功能将在本文的第二部分中详细介绍。

  

* **<u>本文提出的优化模型具有双重价值</u>**。 首先，although it may not be possible, or critical, that optimality is exactly attained in a real network，但优化框架提供了一种将整个网络明确引导至desirable operating point的方法。下面我们将看到流控制可以看作是网络上的分布式计算，因此，整个网络的行为很容易理解。 其次，将实用的流控制方案简单地视为某种优化算法的实现是有用的。 然后，优化模型使系统的方法可以设计和完善这些方案，其中对流控制机制的修改以对优化算法的修改为指导。

  例如，众所周知，牛顿算法的收敛速度比梯度投影算法快得多。 通过用牛顿算法代替本文提出的梯度投影算法，我们在[2]中推导了一种实用的牛顿式流量控制方案，该方案可以证明保持最佳状态，并且与此处的基本方案具有相同的通信要求，但享有更好的收敛性。 我们还将线性控制中的pole-placement technique应用于此模型，以在面对较大的反馈延迟时稳定其瞬态。 这导致了更健壮的REM，见[1]。 



## C related work

​	关于流量控制的文献很多，包括原始的TCP流量控制[15]和最近[10]的enhancement，例如[28]，[6]的二进制反馈方案，[22]的两位反馈方案。例如[3]，[29]，[7]等的控制理论方法。另请参阅[14]中的recent review。 

​	基于优化的流量控制的关键前提[8]，[11]-[13]，[16]，[17]，[19]-[21]，[25]是带宽评估不同的源应做出不同的反应去应对网络拥塞。所有这些工作都通过优化问题来激发流控制，并导出其控制机制作为优化问题的解决方案。 它们在目标功能或解决方案的选择上有所不同，并导致在源和网络链路上实施的流控制机制大不相同。

我们的模型最接近[16]，[17]。 确实，他们和我们的工作都具有最大化总source utility的相同目标。 在[16]，[17]中，该目标被分解为网络和资源的优化子问题，并且他们为解决方案提出了一种不同的机制，其中每个资源选择支付意愿，网络将价格分配给这些资源, in a way that is proportionally fair。 他们的方法的一个有趣特征是，它允许用户决定他们的payments并接收what the network allocates，而在我们的方法中，users decide their rates and pay what the network charges。 

参见第3节中算法A1之后的Remark 3中的更详细比较。



# 2 Optimization Problem

In this section, we state the optimization problem that leads to our congestion control framework, and suggest a solution approach. Algorithms to solve the problem will be given in the following sections.



## A Primal Problem

* 无向链路集合![image-20201112093628276](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201112093628276.png)with capacity $c_L$ , and node set $S$

* source $s$ is characterized by 4 parameters $(L(s),U_s,m_s,M_s )$
  * ![image-20201112093823706](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/093928-566242.png)是s使用的链路
  * ![image-20201112093839793](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/093928-477615.png)是效用函数 ==这里给映射到负的去了。。可以。不过效用函数本来是正的 ？？why一定positive== 是严格凹的 in its argument 【==in its argument就不是很懂什么意思了...==】
  * ![image-20201112093928373](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/093931-317765.png)是最小和最大的传输速率，required by source $s$. ![image-20201112094016129](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201112094016129.png)
    * 这里画蛇添足定义了个区间![image-20201112094200258](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/094201-949888.png) and vector ![image-20201112094214541](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/094251-895066.png)，也许是为了后面方便描述吧
    * 以及![image-20201112094302977](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/094319-535488.png) 还有他们之间的关系 : ![image-20201112094353039](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/094409-28038.png)![image-20201112094417287](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/094418-230495.png)

* 目标是

  ![image-20201112094447875](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/100622-139567.png)

  ​	约束（2）说，任何链路上的总源速率不超过容量。 由于目标函数严格是凹的，因此是连续的，并且可行解集很紧凑，因此存在一个称为初始最优解的唯一最大化器。

  ​	尽管目标函数是分散在$x_s$中的，但源速率是由约束条件（2）耦合的。 解决原始问题（1）–（2）直接需要可能所有来源之间的协调，这在实际网络中是不切实际的。 分布式和分散式解决方案的关键是看它的dual。



## B dual problem

![image-20201112100641332](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201112100641332.png)

![image-20201112101120788](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201112101120788.png)

==这里的转换后面要再品品==

![image-20201112101128691](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/12/101552-854681.png)

至于$p_l$和$c_l$为什么能提出来，是因为其与$s$无关。这里$p$一定是正的，因为这里是拉格朗日的罚函数

* 假如把$p_l$当作是link l 每单位带宽的价格，那么$p^s$就是节点s所有links的总的带宽均价，所以$x_sp^s$代表 s 以一定速率传输时源的带宽成本 , and $B_s(p^s)$ 代表在给定价格$p^s$下可以实现的最大收益我们将在下面看到，该标量$p^s$ summarizes了所有源需要知道的拥塞信息。
* A source $s$ can be induced to solve maximization (3) by bandwidth charging. 【我这里的理解就是，可以通过调节s的charging，也就是调节p，来达到最大化全局奖励】对于每一个$p$，都有一个唯一的最大化器，用表示，因为它是严格凹的。
* 通过对偶理论... 因此，我们将专注于解决对偶问题（5）。 一旦我们获得了$p^*$, 原始的最佳源速率就可以通过（3）求解by简单的最大化（见下面的（6））。**要注意的重要一点是，给定单个来源可以独立求解（3），而无需与其他来源进行协调。 从某种意义上说，它是将（3）的个人最优与（1）的社会最优对齐的协调信号**。

> 对偶问题，最小化对偶问题，就是最大化原始问题的上界

## C Notations and Assumptions

routing matrix $R_{ls}$

* 第一段的==induced norm?==
* Kuhn-Tucker theorem 就是KKT条件

# question

* abstract都没怎么看懂...

* 对偶问题，拉格朗日要满组KKT才是强对偶（check

* [这个网站](https://www.cs.helsinki.fi/u/ldaniel/mm_cn/)很好，我需要学习下，讲拥塞相关的数学知识
* [这个link](https://slideplayer.com/slide/8113412/)是这篇文章的slide link
* [这个老师的博客](https://www.ece.rutgers.edu/~marsic/)