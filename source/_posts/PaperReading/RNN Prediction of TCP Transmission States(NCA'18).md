---
layout:     post
title: RNN Prediction of TCP Transmission States(NCA'18)
subtitle:   NCA'18
date:       2020-02-05 13:00:00
author:     "hesy"
categories: PaperReading
toc: True
catalog: True
tags:
    - Network
    - Reinforcement Learning
---
NCA'18  @ IEEE (network computing and application)

## abstract
> 关于序列学习和时间序列预测模型，长短期记忆（LSTM）神经网络是最先进的技术。在本文中，我们已使用基于LSTM的递归神经网络（RNN）为被动测量建立传输控制协议（TCP）连接特性的通用预测模型。据我们所知，这是尝试将LSTM应用于展示网络运营商如何识别可确定网络状况的TCP客户端最重要的系统范围TCP每连接状态（例如cwnd）的第一项工作。从网络中间节点测得的无源流量中获取，而无需访问发送方。我们发现LSTM学习者的表现优于最新的经典机器学习预测模型。通过在多种情况下进行的广泛实验评估，我们证明了该方法的可扩展性和鲁棒性，以及其从被动测量中监视与网络拥塞相关的TCP传输状态的潜力。我们基于仿真和现实环境的结果表明，深度学习是一种用于从被动测量监视系统范围TCP状态的有前途的工具，并且我们相信本文中介绍的方法可以加强计算机网络社区的未来研究工作。

看起来是根据中间节点的信息去预测终端的拥塞窗口等属性 ?

## 1 introduction

在本文中，我们对基于仿真和现实网络的RNN模型估计TCP cwnd的能力以及流中的基础TCP变体感兴趣。
> 因此，我们探索了一种基于RNN的预测方法的LSTM架构，以通过与网络拥塞相关的被动测量来监视最重要的TCP每个连接状态。在我们的论文中，我们证明了LSTM可以使用其内存块和一系列门来有效地从被动测量中捕获TCP cwnd的模式。拥塞控制是计算机网络中的一个基本问题。当今广泛部署的TCP拥塞控制算法执行了与拥塞控制相关的最重要功能，例如从发送方处理cwnd。

在本文中，我们定量地研究和探索了问题，因为这些问题适用于网络拥塞问题，其中包括：
* 我们如何能够根据从网络的中间节点收集到的passive traffic中，很好地推断出最重要的TCP每连接传输状态，？ 【怎么建模】  
> ?? 不知道如何翻译 infer the most important TCP per-connection transmission states that determine a network condition
>
> * 如何从被动测量中唯一地跟踪TCP客户端使用的underlying TCP variant？    【如何判别TCP variant】
* 为什么需要知道TCP发送者使用哪种算法是什么？ 
* 在了解发送方的基础TCP变体的信息之后，我们是否会采取某些措施？
* 哪个用户负责网络中的大部分繁忙流量？等等。？
> (i) How well can we infer the most important TCP per-connection transmission states that determine a network condition from a passive traffic collected at an intermediate node of the network? 
(ii) How can we uniquely track the underlying TCP variant that the TCP client is using from passive measurements? 
(iii) What is the motivation why we need to know which algorithm the TCP sender is using? (iv) Is there some action that we would take based on knowing the information of the underlying TCP variant of the sender?
(v) Which user is responsible for the majority of heavy flow traffic in the network? etc.?

### 前人工作
> * 先喷了04年的一篇文章  用状态机建模的  讲了两个缺陷  一个是可扩展性-》每个TCP variant都会需要建立一个状态机模型；另一个就是...（看文章叭）
然后就说没啥前人工作了。。。

```"在我们广泛地调查了现有的从被动测量监测TCP传输状态的工作之后，我们相信，对于使用基于RNN的技术的大多数广泛使用的TCP变体，在不知道发送方cwnd的情况下，对于预测cwnd和从被动通信量中唯一识别底层TCP控制算法类型的可伸缩方法，目前还没有太多的工作" ```
> 据我们所知，这是第一项尝试使用LSTM [14]来推断最重要的TCP每连接状态的工作，该状态根据网络中间节点收集的被动流量确定了网络状况，而没有sender的访问权限。正如我们在实验结果中所展示的，我们的预测模型比其他方法有很多好处。

### 本文贡献
* 使用中间节点的被动测量信息和LSTM模型进行建模
* 方法是健壮、可扩展的
* 在模拟器上train，迁移到实际环境中效果不错
* 我们通过几个受控实验(controlled exp 不知道咋翻译..)广泛验证了我们的预测模型的鲁棒性和可扩展性方法，并在模拟，现实和组合场景设置中进行了实验验证。

> • 我们演示了中间节点（例如，网络运营商）如何识别与TCP流相关的TCP客户端的传输状态，并使用LSTM递归模型根据被动测量预测发送方的拥塞窗口（cwnd）大小。
•我们通过提供一个健壮和可扩展的方法来唯一标识TCP客户端正在使用的广泛部署的基础TCP变量，从而探索基于LSTM的预测模型的适用性。
•我们证明，通过在实际场景设置中应用和转移模拟网络中的训练有素的知识，学习的预测模型可以很好地发挥作用。因此，我们的预测模型与机器学习社区中的转移学习概念大致相似[26]。
•我们通过几个受控实验广泛验证了我们的预测模型的鲁棒性和可扩展性方法，并在模拟，现实和组合场景设置中进行了实验验证。


## 2 motivation
我们的工作主要是由第一节中提出的问题引起的。拥塞控制算法在提高Internet上TCP的性能方面起着至关重要的作用[6]。但是，==当TCP算法的不同变体共存于网络中时，它们可能相互影响==。
==解决此问题的一种方法是通过预测cwnd并唯一标识基础TCP变量来单独控制TCP流。==

### Benefits
讲了两个实际中该问题的应用背景 :
* 可以唯一识别(identify)每个TCP连接，可以看看内容提供商有没有超额使用(TCP不公平现象检测)
* 从中间节点推测出更多信息，用于诊断拥塞原因

> 从运营的角度来看，此信息对于网络运营商(network operators)很有用，以监控主要内容提供商(content providers)（例如Google，Facebook，Netflix，Akamai等）是否正在操纵其服务器中的拥塞窗口，以实现超出其公平份额的目标带宽。运营商可能会发现此信息有用的另一种情况是，他们是否拥有一条由于客户投诉而导致其拥堵的路径，但是使用该路径的链接并没有被特别地订阅。在这种情况下，有关该路径上所有用户的拥塞窗口行为的详细信息可能有助于尝试诊断原因。从ISP的角度来看，我们认为有关端点中使用的TCP堆栈的知识对于进行大量流量工程和异常检测的大型ISP网络的运营商很有用[12]。

### Methodological Challenges
实践中；但是，从被动测量中预测TCP每个连接状态有许多困难。挑战之一是，例如，TCP数据包可能在发送方和中间监视器之间或监视器与接收方之间丢失。如果TCP数据包在到达中间节点之前丢失，并以某种方式重新传输，则无法确定是否发生了数据包丢失。因此，==中间监视器所看到的可能与发送方或接收方所看到的不完全相同。== 在[10]中更详细地介绍了我们确定的方法挑战，这些挑战涉及从被动测量中进行与网络拥塞相关的TCP每个连接状态的推断。在本文中，我们主张通过解决上述实际挑战，基于LSTM的方法可以从在中间节点收集的被动测量结果中提供更好的TCP发送方连接状态预测精度。

### Roadmap
> 本文的其余部分安排如下：在第三节中，我们回顾并详细概述了被视为最新技术的TCP被动测量的紧密相关研究工作。在第四节中，我们描述了用于评估的实验装置。第五部分概述了我们的方法，重点介绍了本文中使用的机器学习技术和性能测量指标。第六节介绍了详细的实验结果以及用于验证我们的预测模型的多种方案设置。最后，第七节总结了论文并概述了未来扩展的研究方向。

## 3 related work
本节简要讨论了有关通过被动测量来推断与网络拥塞相关的TCP每连接状态的紧密相关的研究工作。监视TCP每连接特征的技术分为两类：主动和被动测量。
    
主动测量
> 已经提出的许多现有研究工作都依靠主动方法来测量TCP的特征。通过向至少两个端点之间的网络中注入人工流量，该技术可以主动测量Internet流的TCP行为[22，25]。它主要侧重于主动网络监视，并依赖于注入特定流量的能力，然后对其进行监视，以衡量从网络获得的服务。

被动测量
> 在被动测量中，检查被动收集的数据包迹线以测量Internet流的TCP行为[16]。
> 
> 与我们的工作最密切相关的一项有趣的工作是[16]，它提供了一种被动的测量方法来推断和保持跟踪发件人变量：end-to-endRTT和cwnd的值。他们的想法是通过在发送方检测重传超时（RTO）事件并观察导致发送方更改cwnd值的ACK来模拟状态转换。这项工作[16]仅考虑了TCP的主要实现，其基本思想是为在中间节点观察到的每个TCP连接构造一个TCP发送者状态的副本。副本采用有限状态机的形式。但是，考虑到许多现有的TCP变体，无法对每个变体使用单独的状态机。我们还认为，考虑到大量数据，构造的副本[16]无法设法使转换反向或回溯。另一个限制是副本可能无法观察到与发送方相同的数据包序列，并且在中间节点处观察到的ACK也可能不会到达发送方。
> 
> ==该研究的作者[27]开发了一种名为tcpflows的工具，该工具试图通过分析ACK流来检测TCP拥塞事件的发生，从而被动地估计cwnd的值并识别TCP拥塞控制算法。== 但是，使用tcpflowsis实现的状态机仅限于旧的TCP变体，因此无法唯一标识新的TCP拥塞控制算法。

> 我们的工作与以前的工作主要不同，我们的主要目标是从根本上开发一种==可扩展的基于LSTM的预测模型==，以便为使用最广泛的==基于损耗的拥塞算法==推断TCPper-connection状态。如果仅查看一个或两个TCP变体，则不同的TCP堆栈具有多种功能，这些功能将违反我们可能做出的假设。因此，在我们的工作中，为了覆盖问题的整个范围，我们考虑了使用最广泛的基于损耗的TCP算法变体，它们是==BIC [32]，CUBIC [9]和Reno [15]。==


==这里提到了[27]A Passive State-Machine Based Approach for Reliable Estimation of TCP Losses. 2006 也是用于检测拥塞的 只不过还有局限性==

## EXPERIMENTAL SETUP AND DISCUSSION

### A. Experimental Testbed

图2显示了本文中用于所有实验的实验设置。
* 仿真网络+一条通信隧道以引入拥塞
* iperf生成TCP流量  
* 单个TCP流中的参数带宽和延迟是恒定的，并且分布均匀；抖动作为平均值给出，因此其分布是正态的
* 我们在客户端节点上创建了相同的regular tcpdump of TCP packets，其中包括有关每个连接状态的信息，以便我们可以将tcpdump与TCP状态进行匹配。
> We created an identical regular tcpdump of the TCP packets on the client node including information about the per-connection states so that we can match the tcpdump with the TCP states. 
* 将测得的TCP数据当作输入，以预测TCP每个连接状态。使用Linux内核直接记录的实际TCP内核状态（仅用于培训）验证了预测的TCP状态，并为学习模型生成了新数据以进行预测。
> 为了引入拥塞，我们首先创建了一个仿真网络，并在网络上放置了一条通信隧道，同时使用iperf流量生成器将TCP跨流量推送到网络[7]。我们通过捕获客户端和服务器发送TCP数据包时网络上的所有会话来进行实验。在我们实验的单个TCP流中，参数带宽和延迟是恒定的，并且分布均匀。但是，由于我们将抖动作为平均值给出，因此其分布是正态的。我们在客户端节点上创建了相同的常规TCP数据包tcpdump，其中包括有关每个连接状态的信息，以便我们可以将tcpdump与TCP状态进行匹配。如图2所示，我们将测得的TCP数据用作我们的方法输入，以预测TCP每个连接状态。最后，我们使用直接从Linux内核直接记录的实际TCP内核状态（仅用于培训）验证了预测的TCP状态，并为学习模型生成了新数据以进行预测。完成验证后，我们将运行学习模型并获得预测.

### B.Testbed Hardware
> 我们已经使用了一组基于GNU / Linux操作系统的HPC计算机集群进行了实验，该操作系统运行4.4.0-75-通用内核发行版的修改版。该预测模型是在具有以下特征的NVIDIA Tesla K80 GPU加速器计算上执行的：Intel（R）Xeon（R）CPU E5-2670 v3 @ 2.30GHz，64个CPU处理器，128GB RAM，在Linux 64-一点。群集中的所有节点都连接到低延迟56 Gbit / s Infiniband，千兆以太网，并可以访问600 TiB的BeeGFS并行文件系统存储。

### C. Network Emulation and Verification of the emulator  
==对于网络仿真，我们在单独的节点上使用了基于Linux的流行网络仿真器（NetEm）[13]，该仿真器支持带宽，延X迟，抖动，丢包和其他参数的等对cwnd赢下给比较大的参数。==
* 另一个问题是软件仿真器不够精确  ——》 作者在此提出了一个验证方法(具体没有怎么看懂，也许并不重要??)

> 鉴于软件仿真器不够精确，我们是否可以信任网络仿真器来评估我们为评估而更改的所有带宽，延迟，抖动和丢包参数的变化，而不考虑我们从TCP流获得的测量结果？
为了在极为完善的环境中谨慎使用网络仿真器来处理所有参数的变化，我们创建了一个过滤器来设置每个数据包的参数变化。由于无法从TCP流中测量仿真器的精度，因此我们使用UDP进行了另一项实验，以评估和测量仿真器和流量生成器均会产生偏差的精度。
我们通过测量由接收方的流量生成器和网络仿真器创建的带宽，延迟，抖动和数据包丢失变化来验证原始性能。
> 
> Given that the software emulator is not precise, can we trust the network emulator for all the variations of bandwidth, delay, jitter and packet loss parameters that we change for our evaluation irrespective of the measurement we get from TCP stream? 
> 
> In order to use the network emulator with great care in an extremely well-contained environment for all the variations of the parameters, we created a filter that sets the parameter variation of each packet. As the precision of the emulator cannot be measured from TCP streams, we set up a different experiment using UDP to evaluate and measure the precision where both the emulator and traffic generator create variations. 
> 
> We verified the raw performance by measuring the bandwidth, delay, jitter and packet loss variations created by the traffic generator and network emulator at the receiver side.

### D. Impact of Cross-traffic Variability
结论：
* 仿真器运行的每个变化都不会影响我们的结果--》交叉流量的可变性不会影响我们的分析
* cwnd可变性取决于所使用的特定TCP拥塞控制
* 仿真器可能会受到其范围之外的网络元素的影响，例如CPU负载，网卡缓冲区，硬件架构因素等
> 我们运行NetEm [13]时，客户端和服务器之间的数据速率和仿真参数有所不同。我们通过模拟其他UDP流量，仔细研究并验证了来自同一TCP拥塞协议的跨业务量变化对结果的影响，我们发现，仿真器运行的每个变化都不会影响我们的结果。我们认为，在当前设置中交叉流量的可变性不会影响我们的分析。通常，当涉及到cwnd可变性时，它将取决于所使用的特定TCP拥塞控制。我们还认为，仿真器可能会受到其范围之外的网络元素的影响，例如CPU负载，网卡缓冲区，硬件架构因素等。  

### E. Network Traces

### F. Network Emulation Parameters
为了在仿真和实际网络条件下评估我们的预测模型，我们使用tcptrace [24]生成了自己的数据集。我们所有实验的数据轨迹都是使用iperf [7]流量生成器在模拟的LAN链路上生成的，在该LAN链路上，我们运行每个TCP变量，并改变了参数带宽，延迟，抖动和数据包丢失，如表I所示，其中cwnd极其受影响。==但是，内核可能会将数据包的TCP每次连接状态保留在缓冲区中，并等待足够数量的数据包，然后再将TCP状态发送到用户空间。由于用户空间进程的TCP进程缓慢，TCP的每个连接状态也可能会丢失。== 

？？
因此，作为合理性检查(sanity check)，我们要做的第一件事就是在发送方和接收方都捕获数据包，因为它有助于我们知道数据包是丢失还是从未发送过，因为从接收方到发送方的ACK与数据包以推断数据包丢失。这样，可以验证流量捕获是否相同，并且每个连接的TCP状态都没有丢失。

为了避免丢失数据包并在发送方上和monitor上捕获完全相同数量的数据包，我们执行的第二件事是==调整缓冲区大小并将缓冲区刷新到用户空间==。通过禁用TCP分段卸载，我们在巨型帧清洁的路径上进行了实验，从而可以避免数据包大小超过常规合法大小。
> Therefore, the first thing we did as a sanity check is to capture the packets at both the sender and the receiver for it helps us to know whether a packet was lost or just never sent as the ACKs from receiver to sender are just as important as the data packets for inferring packet loss. This way, it is possible to verify if the traffic captures are identical and there are no missing per-connection TCP states. 
>
> The second thing we carried out in order to avoid missing of packets and capture exactly the same number of packets on the sender and the monitor is tuning the buffer size and flush the buffer to the userspace. We carried out our experiment over a path that is jumbo-frame clean by disabling TCP segmentation offloading so that we can avoid packet sizes way over the regular legitimate size.

TCP拥塞控制设置为根据带宽，不同的交叉流量，RTT等的可变性进行操作。因此，为了创建现实的场景，我们在设置中模拟了网络，如图2所示，通过在一条流中向表I中列出的重要网络仿真参数添加可变性。

### G. Assumptions 
在TCP中，cwnd是决定随时可以处理的字节数的主要因素之一。 因此，我们假设在存在带宽变化，延迟， 损失和RTT情况下，使用（大概理解为bytes in flight)==the observed outstanding sequence of unacknowledged bytes on the network seen at any point in time in the lifetime of the connection as an estimate of the sending TCP's cwnd from tcptrace==是一种更好的方法来估算cwnd以及恢复速度的方法。 
首先，由于我们是根据飞行中的字节估算cwnd的，因此我们还考虑了cwnd肯定是是发送方的限制因素的事实，以及cwnd必须小于接收方的窗口的事实。 
其次，我们假设我们不知道网络中正在运行什么TCP变体以及该变体中的每个连接状态。 
最后，我们在本文中给出的结果是基于如下假设的:端点具有与操作系统无关的、由底层操作系统独立设置的相同接收器窗口(receiver window)。

## 5 METHODOLOGY
本节说明了我们用于通过基于RNN的技术从被动测量中通过实验推断cwnd和唯一标识基础TCP变体的通用方法。

### A. Passive Monitoring of bytes in flight
TCP拥塞控制算法通过使用cwnd来控制TCP发送方的发送速率，该cwnd限制了在任何给定时间允许的累积未确认字节的数量。 如图2所示，在中间节点处收集的测得的被动TCP数据用于我们模型的训练实验。 在监视点看不到TCP实现的详细信息和TCP选项的使用。 TCP发送器还通过内核中的两个变量来跟踪未完成的字节：snd nxt（要发送的下一个数据包的序列号）和snd una（最小的未确认序列号）。

### B. Prediction of TCP cwnd from Passive Traffic

cwnd是TCP每次连接状态内部变量，表示发送者可以根据发送者的网络容量和条件在任何给定时间点潜在传输的最大数据量。 TCP [15]使用cwnd来确定在任何给定时间没有被发送方独立维护以进行拥塞避免的情况下，未确认的最大字节数。图3显示了在运行神经模型和应用LSTM技术之前，来自中间节点的未完成字节数与从发送方内核跟踪的实际cwnd之间在时间方面的比较。
> 考虑到TCP的本质，通过检查中间节点被动收集的端点的TCP流的每个交叉流量来准确推断发送者的cwnd是一项具有挑战性的任务，因为它不做广告。我们尝试估计cwnd的一种初始方法是处理tcpdump中流的数据包头，并根据跟踪集计算汇总的TCP交叉流量，并将其添加为asa功能。然而，我们在实验中发现对于准确的预测而言，细节不足。在本文中，我们认为利用基于RNN的算法训练分类器和预测模型来从被动测量中预测cwnd非常重要。

**Learning Context**
> 我们使用带有TensorFlow后端的Keras深度学习框架，构建了高度健壮且可扩展的基于RNN的预测模型，
* cwnd批量大小为32。
* 在t的每个时间步长处，LSTM模型都将飞行中的未完成字节的整个数组作为输入特征向量（x），该向量由从内核获得的时间戳索引。
* 多层LSTM单元 + 15维隐藏状态的dense layer + ReLU激活函数(==?最后一层居然也ReLU==) --> 输出 a sequence dimensional vector of predicted cwnd (y) of the same size indexed by time stamp.
* 经过时间截断的反向传播（TBPTT）训练算法进行训练 | Adam 默认学习速率为0.001 | RMSE 和 MAPE(Mean Absolute Percentage
Error) 同时作为损失函数的评价指标 (？具体怎么综合起来的待后面考查)

### C. Prediction of TCP Variants
对于基本的TCP变体预测任务，仅考虑了基于丢包的TCP拥塞控制算法(loss-based)(e.g., CUBIC [9] BIC [32], and Reno [15]) 用预测出来的cwnd去判断β值(back-off parameter) <-- 对于AIMD的拥塞控制算法来说，β值是一个很典型的特征。

## 6 EXPERIMENTS AND RESULTS
> 本节总结了几个实验结果。针对每个TCP做了36种配置，如表I所示，总共216种在实验(?咋算的..)实验评估中，给出其中一个测试方案配置并给出CUBIC [9]，BIC [32]和Reno [15]三个baseline的测试效果。

==TCP cwnd模式预测模型是在训练和测试样本大小比率的不同配置下评估的。==

* 如上图所示，==我们发现了用于预测cwnd的基于RNN的模型可以非常准确地捕获cwnd下降的比率。== 
> 图6（a）和（b）没有共享相同的带宽，延迟，损耗和抖动配置，这会导致在连接过程中最大段数有所不同。例如，如果我们在图6（b）上看到，它的带宽延迟乘积（BDP）[17]为700mb * 0.01s = 875,000字节（logic here:这个和1500都是configuration）。在1500个字节段中，即583个段，而我们的仿真显示cwnd的最大段数为500-600。在下面显示的所有图中，==我们可以看到，一旦发生超时，响应3个重复的ACK，所有数据包丢失都会得到快速恢复。这是因为cwnd不会低于其先前峰值的一半。== 结果是，存在一个线性增加阶段，随后是一个丢包事件，其中cwnd随着新到达的ACK而增加。这也演示了TCP拥塞控制算法如何响应拥塞事件。

* 我们还可以看到，预测的cwnd的模式通常与实际的cwnd非常匹配，并且预测误差很小。我们使用从内核获得的精确时间戳来匹配锯齿模式的增加部分和减少部分。
> We can see that the pattern of the predicted cwnd generally matches the actual cwnd quite well with a small prediction error. We matched both the increasing and decreasing parts of the sawtooth pattern using the precise timestamp obtained from the kernel.

##  hesy summary
* 对于基本的TCP变体预测任务，仅考虑了基于丢包的TCP拥塞控制算法(loss-based)
* 首创性(被动测量 中间节点 LSTM) 、 可扩展性 (scalable)
* 使用iperf制造数据包  使用tcptrace构建数据集

## question 
* Network Emulation Parameters中“但是，内核可能会将数据包的TCP每次连接状态保留在缓冲区中，并等待足够数量的数据包，然后再将TCP状态发送到用户空间。由于用户空间进程的TCP进程缓慢，TCP的每个连接状态也可能会丢失”不是很明白
    * 对应的==调整缓冲区大小并将缓冲区刷新到用户空间==  不是很明白这是在干什么
    这两天找yanshu问下【！！！！】
* G. Assumptions 中的一些假设不是很懂在干什么 .... 目的何在？
* 使用tcptrace构建数据集指的应该是将检测到的信息里面的数据特征抽取出来？
* 仅考虑了基于丢包的TCP拥塞控制算法(loss-based)(e.g., CUBIC [9] BIC [32], and Reno [15])  --> BIC是基于loss的么？？？
* 针对每个TCP做了36种配置，如表I所示，总共216种在实验(?咋算的..)
* FIG6为什么跌破的时候没有跌到一半 反而比一半多一点
    这个逻辑是什么
    > 我们可以看到，一旦发生超时，响应3个重复的ACK，所有数据包丢失都会得到快速恢复。这是因为cwnd不会低于其先前峰值的一半。  
    是后面是前面的现象的意思么  所以快恢复难道不是设置成一半么。。。
* 这啥意思
> 我们还可以看到，预测的cwnd的模式通常与实际的cwnd非常匹配，并且预测误差很小。我们使用从内核获得的精确时间戳来匹配锯齿模式的增加部分和减少部分。
