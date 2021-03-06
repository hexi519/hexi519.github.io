---
title: pantheonSummary
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-12 23:01:07
categories: Codes
description: code experiences of pantheon plane
tags:
    - Network
---



# 相关工具使用

## mahimahi使用

* --meter-all 是可以显示记录数据并且交互式地把图画出来的

* $MAHIMAHI_BASE 就是当前这个link ，接收端的ip地址（从link外部的角度看

* 基本命令

  * mm-loss

  * mm-delay

  * mm-onoff

  * mm-link

    > 其他的都比较好看出来作用，这个就不太行了。**主要是控制上下行发包的速率，which是可以变化的**。之前文章里面所有上下行链路发包速率的变化都是用这个控制的。
    >
    > mm-link [--uplink-log=filename] [--downlink-log=filename] [--meter-uplink] [--meter-
    >                uplink-delay] [--meter-downlink] [--meter-downlink-delay] [--once] **uplink-**
    >                **filename downlink-filename** [command...]
    >
    > > 官网上是这么写的 但是实际上在manPage里面是这么写的：mm-link [Option] [ -- command ]
    > >
    > > 注意，这里的command前面有两个dash ，且使用空格和command隔开来的
    > >
    > > 直接写command是可以的，但是一般都是sh -c "......"  的形式
    >
    > --uplink-log 和 ----downlink-log	指的是记录上/下路径发包情况的log文件的的名字
    >
    > --meter-uplink 和--meter-downlink 指的是交互式画出上/下路径的吞吐量变化情况
    >
    >  --meter-uplink -delay 和 --meter-downlink-delay 指的是交互式画出上/下路径的延迟变化情况
    >
    > uplink-filename 和 downlink-filename 指的是链路的带宽的变化情况
    >
    > --once 还没看到有人用
    
    * uplink-file和downlink-file的含义
    
      > ​	trace中的每一行代表一个数据包传递机会：在仿真中可以传递MTU大小的数据包的时间。 accounting是在字节级别完成的，每个delivery opportunity代表传递1500个字节的能力。
      > ​	因此，trace中的一行可以代表着传递了几个较小的数据包，其大小总计为1500字节。 如果在某一个发送瞬间没有字节可以发送，则会浪费delivery opportunities。 当mm-link到达输入跟踪文件的末尾时，它将环绕到跟踪文件的开头。【这就是为什么  <(echo 1) 可以代替的原因12Mbps的原因】、
      >
      > e.g.    35 # 1504  代表着 35ms的时刻链路是可以发送的(link的处理能力)，但是没有并没有字节发送出去
      >
      > log file 格式：
      >
      >        # mahimahi mm-link (name of link) [/path/to/trace] > /path/to/log
      >        # command line: [command used to run mm-link]
      >        # queue: [queue information]
      >        # init timestamp: [start time of mm-link]
      >        # base timestamp: [starting log timestamp]
      >        [# mahimahi config: [mahimahi shell prefix]]
      >        [log lines]
      >         
      >        Each log line is one of the following:
      >         
      >        [timestamp] # packet_size
      >         
      >               An unused delivery opportunity.
      >         
      >        [timestamp] + packet_size
      >         
      >               A packet arrival to the link, it may be dropped later
      >         
      >        [timestamp] - packet_size
      >         
      >               A successful packet delivery
      >         
      >        [timestamp] d packets_dropped bytes_dropped
      >         
      >               A dropped packet (or multiple packets)

* 分析工具

  * --meter-all  结合上述命令，	在emulate的时候进行交互式画图

* 绘图命令

  * mm-throughput-graph FileName

  * mm-delay-graph FileName

    > 这里的FileName是log文件



## pantheon-tunnel使用

* 测试方式

  ```bash
  mm-tunnelserver # 会起一个VPN server，并给出另一个终端要起的命令
  # 接收方的使用方式是：
  # mm-tunnelclient IP PORT LOCAL-PRIVATE-IP SERVER-PRIVATE-IP [OPTION]... [COMMAND] , 例如:
  mm-tunnelclient localhost 33802 100.64.0.2 100.64.0.1
  # Options=--ingress-log=FILENAME --egress-log=FILENAME --interface=INTERFACE --mtu=MTU
  # MTU is 1500 bytes by default, but will use the detected value on the interface if --interface is given. --mtu will override all
  ```



# pantheon平台本身的使用

* 整体的一个逻辑是： 

  > pantheon-tunnel相当于一个VPN ,会在每个包的外面套上一层，方便记录东西
  >
  > mahimahi是本地测试的时候才要使用的，嵌入到pantheon-tunnel里面的，which means 手动测试的时候应该是先起pantheon-tunnel，然后起mahimahi的link

  


## user group

* [ ] [quic和他的最新版quiche](https://groups.google.com/g/pantheon-stanford/c/3zuaeIuPkzY)

* **平台细节**

  * **命令**

    * <u>**./test.py -f**</u>  可以跑相同scheme的sender的多个流

      > For instance, " **./test.py local -f 2 --schemes cubic --data-dir dumbbell** "
      >
      > * [ ] 但是如果要跑不一样scheme的sender，就要用不同的方式了。参考[这个](https://groups.google.com/g/pantheon-stanford/c/p9eEixBek4U)
      >
      >   > 先起receiver ，然后起mahimahi的link，然后起sender

    >   另一个是[这个](https://groups.google.com/g/pantheon-stanford/c/Yzz9aPg6fvs) : Question about testing different cc schemes at the same time

  * **数据**

    > actually在人家官网上每张图里面都有存储[对应的](https://pantheon.stanford.edu/measurements/node/)数据
    >
    > 有个专门的仓库用于存储[数据](https://groups.google.com/g/pantheon-stanford/c/EMzpfOat91Q) 集合了所有的发送方式，详情可以参考[这个](https://groups.google.com/g/pantheon-stanford/c/EMzpfOat91Q)

  * **about Pantheon**

    * 万神殿是用于测量长流量（单个流的测试持续30秒，三个竞争流的测试持续10s）吞吐量和延迟的设计。[设计者认为](https://groups.google.com/g/pantheon-stanford/c/PATsfr1bYUo)10s和30s已经足够网络中的短暂突发情况恢复稳定了,因为mostly an unloaded RTT is 10ms ,10s相当于100个RTT了

      * 且万神殿由于是full-throttle的（<u>**关于full-throttle的解释请看[这个](https://groups.google.com/g/pantheon-stanford/c/ijS9izLAc54)**</u>），被批评不符合真实世界的流量，因为真实世界中不会全部尤其是Web traffic（which is a good example where the transient behavior really matters）。Pantheon需要进一步、细粒度的、根据bytes来实现管控的流量

    * 万神殿将拥塞控制视为与可靠性及其实现方式完全正交（例如，使用ACK / NACK /序列号和重传，FEC或某种组合）。

    * **[<cc>\_datalink\_run<ID>.log和<cc>\_mm_datalink\_run<ID>.log的区别](https://groups.google.com/g/pantheon-stanford/c/wT2FciWoilU)**

      > e.g. bbr_datalink_run1.log  和  bbr_mm_datalink_run1.log

      >  大部分情况下应该使用<cc>\_datalink\_run <ID> .log分析性能，您可以在[这里](https://pantheon.stanford.edu/faq/#raw-logs)找到其格式。除非您要执行自己的分析，否则可以只运行提供的脚本analyst.py。 <cc> \_mm\_datalink\_run <ID> .log主要用于可视化Mahimahi中的仿真带宽（以及经过测试的拥塞控制的吞吐量），因为只有mm-link知道input traces以及their bandwidth。
    
    * Pantheon仅正式支持Ubuntu
    
      
    
  * **重要的文件**
  
    * **<u>pantheon_perf.json  有所有流的多维数据指标</u>**
  
      <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/13/213247-575474.png" alt="image-20200913213241031" style="zoom:67%;" />	
  
  > 简单解释下：scheme正下面的一级里面的1，2，3代表着这是第几次run，其下面的1，2...，all代表着该次run的第几条流的stats & 平均的情况
  
  
  
* **代码细节**

  * [概念辨析](https://groups.google.com/g/pantheon-stanford/c/bMtttRHR4Os)：departure和arrival是从link的角度看的，departure表示离开链路，也就是多少包顺利到达接收方，arrival表示到达链路，相当于发送方发送了多少

  

* **实验上可能会遇到的情况：**

  * 带宽无法达到很大：[mahimahi的link limitation导致只能达到不到300Mbps](https://groups.google.com/g/pantheon-stanford/c/ejXkiz6P8EE) 
    * [solution] 使用remote mode模式，which gets rid of mahimahi
  * 一些使用iperf发包的(bbr和cubic)会无法停止，请看[这个](https://groups.google.com/g/pantheon-stanford/c/aRL3VXw7PYE)
    * 缺点是：不停占用memory，which means 使用脚本跑程序的时候，后面几次的带宽会比前面几次下降 (如果CPU的内存比较小的情况下)
    * [solution 1] 使用pkill -9 iperf ( which is a terrible way ) 【但这个问题就是不能并行了...】
    * [solution 2] 每次运行一个pantheon的实例，and kill it  
    * [solution 3] 运行./test.py的时候使用--pkill-cleanup扩展命令行
    * **问题是**虽然这样能杀死iperf ，但是不能杀死loaded BBR(or other)
    * [有个补充知识](https://groups.google.com/g/pantheon-stanford/c/8YowTmHf3tA):大部分Pantheon里面的方法都不用iperf或者TCP去发包

  * [流时间间隔很短且使用Python的sleep函数进行流间隔的把控的时候](https://groups.google.com/g/pantheon-stanford/c/xep8J6f_Fe0)会出现发送时间不准（due to Python特性）
  * [drop rate 很高的时候，receiver端有一段时间收不到数据](https://groups.google.com/g/pantheon-stanford/c/-Y579joGnyk) （0.1已经很高了）
  * Pantheon支持流量变化(改变trace)，但是不支持链路的情况变化(实际上是因为mahimahi不支持)。详情见[这个](https://groups.google.com/g/pantheon-stanford/c/zgoluIjoZok)



* **Tutorials**

  * [ ] [guidance:如何实现自己的包装器以及自己的拥塞控制方案](https://groups.google.com/g/pantheon-stanford/c/Jd8Tgp6uWfU)  [  wrappers/example.py 教如何实现一个包装器 + CS344g的课程学习如何实现一个自己的CC from scratch ]

  * [ ] train Indigo with Dagger [需要能够ssh到localhost](https://groups.google.com/g/pantheon-stanford/c/Rwpv1CH91eE) ，而且，请忽略A3C的文件 【hesy:我觉得可以check下上交的那个文件233】

  * [ ] [添加自己的CC到pantheon中去](https://github.com/StanfordSNR/pantheon/blob/master/README.md#how-to-add-your-own-congestion-control)

  * [x] 关于[如何阅读每次的report](https://groups.google.com/g/pantheon-stanford/c/uF90COh6XvY) 给了一点启发

    > 额...其实没有什么有效信息...

  * [x] [修改pantheon的代码，计算实时发送数量](https://groups.google.com/g/pantheon-stanford/c/4kIpgr6lL0A) 可能会对源码解释 有一定的帮助

    > 这个主要是修改pantheon-tunnel的

  * 调试pantheon

    * [x] [Errors during the test 解决全步骤](https://groups.google.com/g/pantheon-stanford/c/ewKh2lJM3oA) 感觉一步一步教他2333
    * [x] [如何调试pantheon的问题](https://groups.google.com/g/pantheon-stanford/c/j1W2A7Md9Lk) 以及readme中setup --install-deps的坑点：Pantheon-tunnel应该得手动安装

  * [x] [如何正确调试](https://groups.google.com/g/pantheon-stanford/c/xEMtL0RJ6rM) 以及 给了存放observertary的[github repository](https://github.com/StanfordSNR/observatory) which  is also traces的数据存储地点

  * [x] [#符号以及进出口的符号解释](https://groups.google.com/g/pantheon-stanford/c/ZF9p6TlpL7k)

    > \# 就是表示 按照uplink和downlink的trace来说了，这个时间点可以发这个，但是实际上没有发
    >
    > [more explanasion](https://groups.google.com/g/pantheon-stanford/c/JzyIP8R3Yag)
    >
    > > 一般来说#是不会出现在 mm_xx相关的文件里面的，只会出现在pantheon_tunnel的里面，但是如果是在本地运行的话，还是会有

  * [在云服务器上使用公有ip和本地的进行测试](https://groups.google.com/g/pantheon-stanford/c/z957ZO536fM)

  * [两台机子都是云服务器的时候应该怎么办](https://groups.google.com/g/pantheon-stanford/c/1TW5KFukOtE)

  * [x] [Reproducing the plots from the Pantheon paper](https://groups.google.com/g/pantheon-stanford/c/za2kpKMbwF8) 牵扯到一些数学原理 ， 关于画图的解释

    * [ ] ==后面得出一个这个图==
    
    > 主要是这个解释，[2D正态分布数据绘制误差椭圆（置信椭圆）](https://www.visiondummy.com/2014/04/draw-error-ellipse-representing-covariance-matrix/),并且给出了画椭圆的[tool](https://github.com/StanfordSNR/pantheon/blob/scripts-for-paper/analysis/plot_json.py)

  

* **To be read ( 程序报错 )**

* [ ] [添加自己的程序的时候出错](https://groups.google.com/g/pantheon-stanford/c/jASB_IOpiDg)，但是可以借鉴下人家添加的流程

* [ ] miqianmimim的提问：[iptables报错](https://groups.google.com/g/pantheon-stanford/c/5vtPihiHL6s)

* [ ] [another iptables的问题](https://groups.google.com/g/pantheon-stanford/c/SU_p2F0mRiI)

* [ ] [An error when I test locally "src/experiments/test.py local --all"](https://groups.google.com/g/pantheon-stanford/c/_4dwKj6YgTU)

* [ ] [[Errno 3] No such process](https://groups.google.com/g/pantheon-stanford/c/DuCN5nS0Bb4)

* [ ] [如何使用pantheon训练indigo](https://groups.google.com/g/pantheon-stanford/c/PL5a-UUy9jo)

* [x] [Merge tunnel log generate empty log](https://groups.google.com/g/pantheon-stanford/c/yCtI9aI1C_U) ：给出了==正确运行test.py的时候应有的结果== 【大力出奇迹，重装就完事儿了 : (  果然之前安装的mahimahi就是有问题... 】

* [x] [Failing to run Pantheon](https://groups.google.com/g/pantheon-stanford/c/ERdJK1zr-lo) 要手动安装Pantheon-tunnel

* [x] [Died on std::runtime_error: `packetshell': process exited with failure status 1](https://groups.google.com/g/pantheon-stanford/c/6cipzKELX70)

* [x] [Error while running testing example](https://groups.google.com/g/pantheon-stanford/c/xIMd0icDi-8) : 需要安装mahimahi

* [x] [Issues getting tests to run](https://groups.google.com/g/pantheon-stanford/c/qOiba6TMpSM) 感觉这人问问题和回答的质量都挺高的

* bbr代码相关

  * [x] [要修改qdisc](https://groups.google.com/g/pantheon-stanford/c/Jpc367oTQeo) 以及一些修改的注意点

    > sudo sysctl net.core.default_qdisc=fq

  * copa代码相关

    * [ ] [IndexError: list assignment index out of range](https://groups.google.com/g/pantheon-stanford/c/BZcydgF67bE) 给了一些代码调试上的建议
  
      > 1. 测试Cubic whose dependencies少一些
      > 2. 两个terminal中跑copa的sender和receiver
    > 3. 在mahimahi上跑copa
      > 4. 测试下Pantheon tunnel

  * indigo代码相关
  
    * [ ] [about indigo's sender](https://groups.google.com/g/pantheon-stanford/c/J2aQp9Gt9EY)
    * [x] [Indigo的报错](https://groups.google.com/g/pantheon-stanford/c/ASAZdjq5-vA) 缺文件
    * [ ] [BDP计算相关的代码理解](https://groups.google.com/g/pantheon-stanford/c/b2ANo_shWS0)
    * [ ] [训练的文件 以及 test.py -t 可以调整Pantheon的测试时间](https://groups.google.com/g/pantheon-stanford/c/PL5a-UUy9jo)
    * [ ] [如何使用pantheon训练indigo](https://groups.google.com/g/pantheon-stanford/c/PL5a-UUy9jo)
    
    自己遇到的问题：
    
    ```bash
    ImportError: cannot import name 'dense_features' from 'tensorflow.python.feature_column'
    ```
    
    [解决方案](https://github.com/tensorflow/tensorflow/issues/32111)就是重装tensorflow和tensorflow-estimator



* [x] log里面到底是什么

* [ ] [pantheon-tunnel的理解](https://groups.google.com/g/pantheon-stanford/c/Bz_8D3zitlg)

  * 一个VPN
  * FWIW, a <u>high-level description</u> about Pantheon-tunnel can be found  in this post
  * **会在真实链路上进行传输**

  

* ==要搞懂的顺序==

  * [x] mahimahi怎么用嘛 ， 也是一个VPN ? 

    > 大致用法已经在pantheon实验笔记里面总结了。不是一个VPN。

  * [x] pantheon 的tunnel到底是什么

  * [ ] python socket

  * [ ] 网格搜索的实验设置上还是要参考下裴丹老师的文章

  * [ ] 用户态协议栈 -- quic



## pantheon的实验进展

前面第三方库的下载之类的就不说了

* 安装依赖

```bash
# pattern
## 安装依赖
src/experiments/setup.py --install-deps (--all | --schemes "<cc1> <cc2> ...")
## 环境准备
src/experiments/setup.py [--setup] [--all | --schemes "<cc1> <cc2> ..."]

# mine
src/experiments/setup.py --install-deps --schemes "indigo"
src/experiments/setup.py --setup --schemes "indigo"   # 除非重启，不然跑过一次就可以
```

* 测试命令

```bash
# pattern
## 本地
src/experiments/test.py local (--all | --schemes "<cc1> <cc2> ...")
## 远程
src/experiments/test.py remote (--all | --schemes "<cc1> <cc2> ...") HOST:PANTHEON-DIR

# mine
src/experiments/test.py local -h
src/experiments/test.py local --schemes "indigo" --data-dir /data/indigoTime

# 测试MORL
sudo /home/hesy/.conda/envs/pan/bin/python src/experiments/test.py local --schemes MORL
```

* 分析

```bash
# pattern
src/analysis/analyze.py --data-dir DIR

# mine
src/analysis/analyze.py --data-dir /data/indigoTime
```

目前indigo、cubic、bbr、copa(remy) 、pantheon的都已经安装好了（依赖、setup都已经准备好且测试过可以运行了）



### 经验贴

* [ ] [pantheon跑dumbell的方法](https://groups.google.com/g/pantheon-stanford/c/aK616b_MH3o/m/w8rqd1jaFAAJ)，包含了[可以支持多种流的配置的版本的pantheon](https://github.com/StanfordSNR/pantheon/pull/39)不过这只是个大概的介绍，[这个](https://groups.google.com/g/pantheon-stanford/c/p9eEixBek4U)才是最强的经验贴

* 重装很重要，然后在服务器上，有时候你也不知道server有没有被重启过，要注意这点带来的影响（或者对bbr也很重要，因为这一步应该牵涉到切换内核



# ask in Google group

* [x] What's "full-throttle "mean？ Does it mean that it lasts for the whole timescale or it send as many bytes as possible to fullfill the tunnel ?

* [x] generic CC是TCP-RL的那个算法么

  > 感觉不是，是个集合体（including copa,remy等，我姑且认为是copa出品的

* [x] 抖动如何添加，看下trace库里面有没有

  > 自己造就行了（利用indigo文件里面有个generate_trace的函数



# 实验的设置

## pantheon认为的维度

<img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201006135023302.png" alt="image-20201006135023302" style="zoom:67%;" />

* 瓶颈带宽、延迟、dropTailQueue、随机丢包率、是符合泊松分布还是等时的



## 自己的

* 缓冲/排队（ 影响BDP ）

  --downlink-queue=droptail --downlink-queue-args=packets=1 --uplink-queue=droptail --uplink-queue-args=packets=1

* 延迟

  mm-delay 10

* 带宽

  mm-link 12mbps.trace 12mbps.trace 【默认的】

* 丢包

  mm-loss 0.01

* 汇总

  src/experiments/test.py local --schemes "bbr cubic" --run-times 2 --prepend-mm-cmds 'mm-delay 10 mm-loss uplink 0.01 downlink 0.01 --downlink-queue=droptail --downlink-queue-args=packets=1 --uplink-queue=droptail --uplink-queue-args=packets=1'

  > 这里还有--append-mm-cmds ' ... ' 的命令

---

queue [100,200,400]

src/experiments/test.py local  --data-dir bbrJitter --schemes "bbr"   --append-mm-cmds '--downlink-queue=droptail --downlink-queue-args=packets=100 --uplink-queue=droptail --uplink-queue-args=packets=100'  

src/experiments/test.py local  --data-dir bbrJitter --schemes "indigo"   --append-mm-cmds '--downlink-queue=droptail --downlink-queue-args=packets=100 --uplink-queue=droptail --uplink-queue-args=packets=100'

----

loss [0.0001,0.001,0.01]

src/experiments/test.py local  --data-dir bbrLoss --schemes "bbr indigo"   --prepend-mm-cmds 'mm-loss uplink 0.001'



## Peidan

The synthetic network conditions consist of all the combinations of —— ~~(1, 5, 10, 20, 50, 70, 100, 150 and 200 Mbps)~~ (1 5 10 50 100 200Mpbs) bandwidths, ~~(10, 20, 40, 60, 80, 100, 150 and 200ms)~~ (10 20 40 80 100 200ms) RTTs and ~~(0, 1%, 2% and 10%)~~ (0 0.01 0.02 0.05) loss rate 【6 x 6 x 4】

BDP ( queue ) 是1，2，5，10 【这里还要看下别人的文章】

抖动：burst和大象流 --》还要看看burst好不好实现呢

> 150ms去掉吧  10%的loss也太夸张了
>
> 带宽目前没测..搞成buffer了 (1 5 10 50)
>
> 抖动怎么做： 一种是自己抖动，一种是别人抖动，看看在pantheon中怎么实现呢 
>
> 而且还要check有没有性能下降 --》我觉得开完大组会再说吧 先走进一步的细节之处



## indigo的实验设置

* task 0

  * 小带宽，高延迟

  * mm-**delay** **28** mm-**loss** uplink **0.0477** mm-**link** **0.57mbps****-possion.trace 0.57mbps-possion.trace  --uplink-**queue**=droptail --uplink-queue-args=packets=**14**

    > 注意，queue这个参数应该是跟着mm-link的

    best_cwnd =5

  * mm-**delay** **88** mm-**link** **2.64**mbps-poisson.trace **2.64mbps**-poisson.trace  --uplink-**queue**=droptail --uplink-queue-args=packets=**130**

    best_cwnd =40

  * mm-**delay** **130** mm-**link** **3.04**mbps-poisson.trace **3.04mbps**-poisson.trace --uplink-**queue**=droptail --uplink-queue-args=packets=**426**

    best_cwnd =70

  * bandwidth = [5, 10, 20, 50]

    delay = [10, 20, 40, 80]

    ---

  * mm-**delay** **27** mm-**link** **100.42mbps**.trace **100.42mbps**.trace --uplink-**queue**=droptail --uplink-queue-args=packets=**173**

  * mm-**delay** **51** mm-**loss** uplink **0.0006** mm-**link** **77.72mbps**.trace 77.72mbps.trace--uplink-**queue**=droptail --uplink-queue-args=packets=**94**

  * mm-**delay** **45** mm-**link** **114.68mbps**.trace **114.68mbps**.trace --uplink-**queue**=droptail --uplink-**queue**-args=packets=**450**

  * bandwidth = [100, 200]

    delay = [10, 20, 40, 80]

  

  ---

  * 卧槽这都是小带宽啊.. 因为大带宽干不过BBR？

  

  

## 我的调参设置

* **大带宽**，高延迟 --> BDP不是很适应的那种

* **高抖动** 

  * [x] 造几个trace，在test里面看下（5ms对半 --》 训练时间和epoch 也加长哈  --> reward也变一下

  * [x] 确认带宽抖动无误后，再加上抖动、小概率丢包(是不是也得看下bbr)、dropqueue，跑通

    > drop queue对BBR影响不大，就算了吧
    >
    > * [ ] loss还没考虑不加的情况 ，我怕会影响智能体的决策，后续再测一次不加的

  * [ ] 训练（两个机子都训练，另一个修改下网络结构 --》 attention加上 ( 目前两台机子都多加了一维动作\

    * [ ] 还有一个要换一下reward

  * [ ] 抖动频率加大一点，让他过拟合，which makes BBR 来不及反应

* 小带宽，低延迟 --> 调快我的反应速率(5ms) meawhile调快整体链路的变化速度（看看人家是5ms变化一次还是5s变化一次.....233



# 实验疑惑

* 用户态和内核态都要做??



==其实还是升窗 和降窗的事情，升窗修补一点，降窗修补一点？== 除此之外，中途是不是还得考虑别的情况，比如波动啥的。--》突然觉得升窗不需要管后续的情况，但是降窗要考虑啊。