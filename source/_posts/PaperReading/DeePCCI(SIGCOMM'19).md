---
title: DeePCCI(SIGCOMM'19)
date:       2020-02-05 12:00:00
author:     "hesy"
catalog: True
category: PaperReading
toc: True
tags: 
    - Network
    - Reinforcement Learning
    - Congestion Control
description: RL+CC
---
# introduction
>拥塞控制（CC）[12]是当今传输协议的基本组成部分，并强烈影响数据传输的性能。 CC最初建于1980年代以应对早期Internet的拥塞崩溃[17]，但CC仍在发展，并且出现了新的变体，例如BBR [1]或Vivace [3]。

>CC引入了一个拥塞窗口（cwnd），该窗口限制了飞行中未确认字节的数量。==每种CC算法都定义了在特定算法定义的拥塞信号下，cwnd的变化情况==。给定CC方法的数量及其对性能的影响[9]，因此研究CC的使用方法很重要。例如，如果知道新的CC通常会与哪些其他算法竞争，则为公平起见，更容易对其进行调整。

## 传统的缺点

>* 但是，用于识别CC变体的现有工作（例如[2、18、24]）不适用于最新的CC和传输协议。==扩展和维护这些方法很复杂，因为它需要详细的领域知识才能知道CC参数化和配置如何影响其行为。== 当CC离开内核并引入用户空间协议（例如QUIC [11]）时，这一点变得尤为重要，这些协议相当容易更改，并且已经可以大规模部署[21]。

>* ==此外，许多识别方法都基于fragile assumptions。== 例如，当使用TCP pacing （例如，与RENO [12]或CUBIC [5]结合使用）时，它们将失败。
>**令人担忧的是，我们已知的所有被动方法都基于头部信息is parsable的的假设**。完全加密的传输（例如QUIC实施方案）使这些设计无效，并且如果可能的话，将需要进行重大更改。

**因此，目前就推理部署CC提出挑战。**

## 难点与贡献
作为应对这些挑战的第一步，本文介绍了DeePCCI，这是一种基于监督的基于深度学习的被动拥塞控制识别方法。
==它仅根据流数据包到达时间信息识别CC变体，因此甚至可以在加密的传输头上使用。== 
此外，它使用深度学习来学习功能-从而避免了手动的，特定于领域的功能设计。
因此，与相关方法不同，==DeePCCI除了流分组定时的可用性之外，不做任何假设，== **除了能够收集CC变体的训练流量之外，不需要任何领域知识。** 
我们认为，这种假设和免手动调整方法允许在Internet流量中进行通用且可扩展的CC标识。具体来说，我们介绍DeePCCI的设计，评估及其局限性，并做出以下贡献：

•我们描述了流量的预处理和用于识别拥塞控制变量的深度学习模型。
•我们介绍了如何在测试平台上生成带有标记数据的多种拥塞控制变量模型。

我们评估了CUBIC，RENO和BBR作为主要拥塞控制变量的测试平台的性能。我们展示了该方法能够在各种情况下识别流量拥塞控制变量，但同时也介绍并讨论了无法识别拥塞控制变量的情况。结构体。第2节讨论了CC识别的最新技术及其缺点。第3节介绍DeePCCI的设计，而第4节介绍我们如何生成训练数据和评估我们的方法。最后，第5节总结了论文并讨论了未来的工作。


# related work
> 各种工作涉及识别CC变体。这些方法主要分为两类：使用被动[2、6、13、18、20]或主动[19、24]测量的识别方法。

> 主动方法可通过主动打开并操纵CC来激发CC反应进行检测。 Padhye和Floyd提出了TBIT [19]，该协议将精心制作的TCP段发送到Web服务器以主动触发拥塞控制。它记录响应丢失的数据包发送了哪些段，因为这种反应在TBIT中所区分的CC变体之间有很大差异。
<br>
杨等。目前的CAAI [24]扩展了TBIT的方法。为了估计发送方的cwnd，CAAI人为地延迟了观察所有飞行段的ACK。然后，CAAI导致数据包丢失，并从变化的cwnd中提取特征。这些功能随后用于使用随机森林进行分类。虽然这两种方法都可以实现较高的识别精度，但是由于错误选择的主机，因此依靠主动测量很容易引入测量偏差。
<br>
被动方法（与我们一样）不与主机交互，而是依靠流量跟踪来推断使用的流量CC变体，因此，它们允许收集有关实际流量的信息，该信息取决于有利位置而不是主动选择的主机。
<br>
Paxson等。和Jaiswal等。使用tcpanaly [20]和tcpflows [13]重建TCP状态机，以比较接收到的数据包和预期数据包。两种方法都需要非常详细的CC甚至实施知识来重建状态机。我们的方法的不同之处在于它不需要详细的CC知识。卡萨格兰德等。 [2]将cwnd中的特征更改用作其方法TCPMoon中的特征。针对这些功能检查了不同的手工规则，以区分CC。对于cwnd估计，作者使用基于TCP时间戳的RTT估计。因此，使用TCPMoon无法识别没有TCP时间戳选项或加密了传输头的流。由于我们的方法仅观察数据包到达的行为，因此不需要任何明文传输协议字段。
<br>
Oshio等。 [18]提出了一种基于聚类的方法。他们根据RTT估计值提取cwnd的特征并将其聚类以区分两个竞争的CC变体。我们的方法的不同之处在于，它不仅限于两个相互竞争的变体。哈戈斯等。
<br>
[6]使用发送方和接收方之间的未完成字节作为粗略且嘈杂的cwnd估计。使用递归神经网络对该估计值进行细化。精简后的Cwnd的突然减少用作CUBIC，BIC和RENO之间不同的乘法减少因子的估计。尽管此方法使用深度学习是相似的，但它仍然需要手动设计的乘数递减因子，因此只能识别基于损失的CC。我们的方法使用端到端深度学习模型，还识别基于延迟的CC并避免使用手动功能。

## active measurements
 * 制造丢包现象（ 通过延迟ack的发送或者是发送crafted packets to senders ）获得终端的变化情况
 	* 获取了特征数据以后使用随机森林的方法


## passive measurements
* gather information on real traffic on vantage points ，而不是像active measurements那样观测主动选好的hosts
* rebuild TCP  state machine --》 需要detailed CC domain knowledge and implementation knowledge
* 建模去估计Cwnd changes --》 like 使用TCP的时间戳来估计RTT （ 加密了以后就不适用了

<br><br><br>

# DeePCCI design
## CC Manifestaion in Traffic
* only use **arrival time** of a flow as input
	* unlike Netflow 是什么意思 ？ Netflow没有packet timing嘛
	* 目的 :associate packets to flow


## Architecture
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190924094304705.png)
### CNN
* 用于特征提取
* 改进了VGG net  结合了 residual network


### LSTM
* 如果packet的size是固定的，就用VGGNet就够了 ，但是由于我们想看的是length-variant的packet，所以使用LSTM--》有记忆
	* 用的是unidirectional network	 

<br><br><br>

# Experimental setup
## Mininet-based Network Testbed
* 不同的网络环境
	*  TCP sender number
	* link latency
	* bottleneck link's BDP
* 选择了三个variant进行对比 ( RENO, CUBIC ,BBR ) 
	* 每个发送60s 的fully-loaded TCP stream 
	* 观测者比发送者早2s开启	 


## Single-Host Network
* **baseline condition**
* 哑铃状拓扑
* 没有背景流量

## Multi-Host Network
* reside on each side of the network

## Cross-Traffic Network
* side flow
* main flow

## performance
### identifacation by Delay and Bandwidth
#### 结论
* 带宽越大、延迟越大、host越多越容易识别成功

#### 分析
* 带宽越大越成功是因为
	* 归因于拥塞窗口的整数离散化，而最大cwnd取决于瓶颈带宽。 ( 我的理解就是：允许的cc窗口的区别度高 ）
	* 以较大的带宽采样了诸如CUBIC的cubic行为的更多步骤。 较低的带宽意味着较少的采样步骤，并且三次行为很难与例如RENO的线性行为相区别。
* 认为延迟越大越成功
	* 与histogram的bin-size  有关
> 我个人在这里的理解就是： bin-size 就有点像分辨率 如果延迟太小，会导致整个图被横向压扁；如果延迟大一点，整个图就会舒展开，一些特征啥的会更加清晰，容易被CNN识别、提取到
> 有点意思 :)

* 认为多主机效果更好是因为
	* 对于相同的延迟，多主机情况也能获得更好的结果。我们将此影响归因于流量竞争。当link饱和时，单主机流的速率不会随着cwnd的增加而迅速增加，**但是在多主机方案中增加流的cwnd可以增加其在队列中的数据包的份额，从而增加其速率。** **因此，对不同拥塞控制变量的cwnd的单独更改会对速率产生更大的影响，从而更强烈地影响数据包到达**，并在更长的时间内影响较小的延迟和带宽问题。
	
**【感觉这一点实际上是利用了这三种方案面对竞争时候的特性有所区别的特点，并不是说：Competing的时候会有种让CC增加cwnd的动力(只有发的多才能收的快 收的快才能滑动)  ，而应该说：面对 competing的时候有不同的特性，有的人会趋于让cwnd增大，所以对应的包发得多，到达的间隔就短了】**


> 如我们所见，**带宽和延迟会影响我们的方法**，延迟/带宽过小会导致识别性能降低。**为了进一步评估，我们将以50Mbps作为带宽**继续进行实验，以更好地了解该方法在何处面临挑战。 
