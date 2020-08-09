---
title: CC常识记录
top: false
cover: false
toc: true
mathjax: true
date: 2020-08-07 22:35:17
categories: Summary
description: 关于拥塞控制的常识/resources
tags:
    - Network
---







* [Sprint.net中统计的网络性能参数](https://www.sprint.net/sla_performance.php?network=sl) 
* rtt普通情况下也就0.1s【CUBIC论文中写的】
  * BBR论文中表示，由于buffer是BDP的几个数量级，所以rtt从毫秒级别变成了秒级



# pacing

* TCP的流控机制，基本上是有两种的，专业一点的说法分别叫做pure rate control和windows-based这两种
	- pure rate control 
		+ 告诉你sender一个发送速率(bottleneck bandwidth)，sender的发送速率不超过这个确定值。
	- window-based control
		+ 这个就是常见的TCP 滑动窗口的协议，就是有一个ack确认后我才能发送下面的。
	- pacing结合了这两种
		+ uses the tcp window to determine how much to send but uses rates instead of acknowledgments to determine when to send.
		+ 为什么要这样，因为标准TCP的发包是back-to-back的,TCP的这种clumped方式会引发高延迟以及burst traffic下的丢包大大增加，同时还有ACK Compression，Multiplexing等各种问题都会导致性能受损，所以有人突出了一个机制，我们能不能不让包堆在一起发，在一个窗口里流出间隔，那我们的排队队长就会下降的。
		+ pacing可以看作TCP的一个变体，是结合了上面的两个流控方式，他使用tcp window决定发多少,用bottleneck bandwidth决定什么时候发，它定义了一个发包的间隔
	- paing需要优化嘛？需要。 更多的可以看这个[专栏](https://zhuanlan.zhihu.com/p/30741073)搜集的paper  





# How can we be aware of congestion

* the internet is a **```decentralized```** system, and as a result of that, doesn’t have any central coordinator telling senders to slow down if link queues downstream of some sender are filling up.
* There are two main indicators: **```packet loss```** and increased  **```round trip times```**  for packets. 
	* If a sender notices packet loss, it’s a pretty good indicator that congestion is occuring. 
	* Another consequence of queues filling up though is that if packets are spending more time in a queue before making it onto the link, the round trip time, which measures the time from when the sender sends a segment out to the time that it receives an acknowledgement, will increase.
	
	> summary：可以通过 **packet loss** 和 **RTT** 这两个现象来观察是否有congestion



# sending rate & delivery rate
* sending rate就是发送速率
* delivery rate强调接收方收到的包的速率（你发出去但是人家不一定能收到不是



# ACK compression
* 由于中间链路的缓存以及和其他TCP连接一起共享缓存等原因，可能会导致ACK报文成堆到达发送端。这种场景我们就称呼为ACK压缩。
* i.e. 一个TCP发送者的 自计时取决于到来的，由接收机按照相同时间间隔生成的ACK。如果这些的ACK通过网络过境期间存在一些开销在队列中，但是，它们的间隔可能会改变。当ACK的到达间距小于它们发送的间距，发送者可能会被误导，发送比网络可以接受的更多的数据，这可能导致堵塞和效率损失。
* 于ACK compression场景，reno拥塞控制就是逐个处理每个ACK报文，这样就会导致拥塞窗口突然增大，发送端突然发出大量的TCP报文，这种突然发出大量数据的行为我们称呼为burst，影响网络平稳。另外一方面ACK compression还会影响RTT估计，之前我们介绍过有些拥塞控制算法基于时延来来估计网络拥塞情况，因此 ACK compresion还会影响这类基于时延的拥塞控制算法的性能。





# 做CC实验要注意的点

* 不仅要测拥塞程度是否改进了
* 还要测量收敛速度和fairness to existing congestion control protocols



# 数据中心的CC

## learn from Lili Liu's paper
* 一般**低延迟应用**的流**的 SLA** (Service Level Agreement)要求是 300ms 内完成

* **研究TCP**（而不是一些基于UDP协议）**的重要性** （ 请注意，quic只是实现的一个途径--》用户态 ）

  * 数据中心要求可靠性，目前实现数据中心间的可靠传输的唯一途径是TCP

    > 数据中心间的链路是由 ISP 提供带宽和时延保障的专用链路，但由于路由切换及一 些突发事件，这种专用链路上偶尔也会发生丢包 

    根据 ISP 与服务商的SLA，**丢包率一般在 0.5% 到 5% 之间，时延一般不超过 20ms**。

  * 研究结果表明数据中心网络中99%的流量都是TCP流量[2]

    > 参考文献[2]是一个2010年的文章

  * 然而，数据中心网络的传输协议大多数都采用TCP，**并使用平均分配带宽为原则**，将网络资源平均分配。如此做的方案主要有**<u>TCP、RCP[35]、DCTCP和HULL[18]等</u>**

* 诸多研究表明**TCP RTO是导致TCP Incast** 的主要原因

  * 在 TCP 中，默认超时重传计时器 $RTO_min$ 为 200ms，数据中心网络正常 RTT 通常为 200µs

* 数据中心网络传输协议近年来**主要面临的问题**有：
  * TCP Incast 问题
  * 低延迟、高吞吐性能需求
  * 多任务模式等（对于FCT有要求）

* 最近发表的一个研究([3])表明，网络中由于低效的链路带宽利用率，平均**有 7.25% 的数据流未能在截止时间前完成**。

* TCP的设计采用平**均分配带宽原则**

* **截止时间流和非截止时间流**
  * 尽管数据中心网络中**有截止时间流**所占比率很低，大概是所有流量的 5%。
  * **非截止时间流**的应用彼此不同。有些应用像 VM 迁移或者数据备份等，在传输开始前就可以得知该流的大小，然而对于一些像数据库存取和 HTTP 分块传输的应用，这些应用在他们传输开始之前不知道流大小或者截止时间相关信息。
    * 因此，对于非截止时间流，较短的流完成时间和较高的吞吐率是他们的**主要性能指标**。



# HULL
* high-performance ultra-low latency
* 他从三个层次来进行了设计：
	- Phantom queues: Detecting and signaling congestion
		+ 这个机制是一种为了创建剩余buffer提出的一种机制，也就是我们常说的bandwidth headroom，通过减少长流带宽来获取更高的短流效率，在端口使用仿真的虚拟队列基于链路利用率而不是利用队列的占有率来设计ECN标记。
	- DCTCP: Adaptive reaction to ECN
	- Packet pacing
		- 这个在前面的文章里面也讲了Pacing的实现原理，但是我们也分析过Pacing其实不一定会带来特别好的效果，是有一定条件的，所以这篇文章用了一个硬件pacer，感觉很厉害。但是本质还是按照固定间隔发送封包。




# some resources（博客资源 and so on）

[squidarth:intro congestion-control](https://squidarth.com/rc/programming/networking/2018/07/18/intro-congestion.html)

