---
title: auroraTest
top: false
toc: true
cover: false
mathjax: true
categories: Codes
description: code experiences of Aurora Baseline plane
tags:
    - Network
    - Reinforcement Learning
    - Congestion Control
---



# pantheon测试运行

* 切换PCC-Uspace到deep-learning的分支，进入到src的目录

* 启动server

  ```bash
  ./app/pccserver recv 9000
  ```

* 启动client

  在g14上

  ```bash
  ./app/pccclient send 127.0.0.1 9000 --pcc-rate-control=python -pyhelper=loaded_client -pypath=/home/hesy/pro/pan/pantheon/third_party/PCC-RL/src/udt-plugins/testing/ --history-len=10 --pcc-utility-calc=linear --model-path=/home/hesy/pro/pan/pantheon/third_party/PCC-Uspace/icml_paper_model
  ```

  在g8上就是  ==要制定训练好的模型的地点鸭==

  ```
  ./app/pccclient send 127.0.0.1 9000 --pcc-rate-control=python -pyhelper=loaded_client -pypath=/home/hesy/projects/PCC-RL/src/udt-plugins/testing/ --history-len=10 --pcc-utility-calc=linear --model-path=/home/hesy/pro/pan/pantheon/third_party/PCC-Uspace/icml_paper_model
  ```



# 基本配置

* PCC-RL 和 PCC-Uspace都是从gitee里面fork的，都是9.16才导入到gitee里面的，此时这两个仓库已经很久没有更新了

* 代码结构(PCC-Uspace)

  * The code in this repository is broken into 3 parts:

    1. The application code (located in src/app)
    2. The UDT library code (located in src/core)
    3. The PCC implementation (located in src/pcc)

    > util文件主要是用于将代码export到quic以及emulab里面去的

  * The PCC code is split into two main parts:

    1. The rate control algorithm (located in the src/pcc/pcc_sender files)
    2. The monitor interval and utility calculation algorithms (located in the src/pcc/pcc_monitor_interval_queue files)

  

* udt相关详见==[UDT]()==

* 问题及解决

  * make之后，直接运行app文件夹下面的程序，报错

    ```bash
    ./app/pccserver: symbol lookup error: ./app/pccserver: undefined symbol: _ZN7Options5ParseEiPPc
    ```

    一看，这个函数别名其实就是Option::Parse(...)这个函数的，which

    * [udt安装](https://blog.csdn.net/qq_28648083/article/details/52818634) 按照这个其实可以解决我的问题

    * 但是我用的是另一个方法，详细原理可以见我关于==[编译链接的笔记]()==

      > 运行的时候export LD_LIBRARY_PATH=core  或者 编译的时候加上 -WI,rpath=core  ( 此时目录都是src哈 )
      >
      > 其实这里最好写绝对路径，否则每次都得在src的目录下运行才可以，不然还是找不到udt的库
    
  * 测试发送端和用户端的时候报错
  
    ```bash
     No module named '_sysconfigdata_m_linux_x86_64-linux-gnu'
    ```
  
    1. [原以为的解决方案](https://github.com/ContinuumIO/anaconda-issues/issues/8861) : ln -fs /usr/lib/python3.5/plat-x86_64-linux-gnu/_sysconfigdata_m.py /home/hesy/.conda/envs/py35/lib/python3.5/
  
       发现python3.5没有\_sysconfigdata_m_linux_x86_64.py，只有\_sysconfigdata_m.py，看了下文件内容差不多，但是用后者去生成软链接也解决不了
  
    2. 干脆换成py36了。但是系统自带的是Py35 ，文件里面写的也是py35，我只好安装py36并设置成系统默认的了，refer@[here](https://tding.top/archives/3868725a.html)
  
    3. py36也遇到不少问题，直接换了台机子继续就可以了...哭...真是浪费时间了...
  
       ==g8目前可以跑通Aurora，但是pantheon还没试过==
       
       > g8环境： python3.5（系统自带的）、tensorflow-gpu 1.14 、gcc 5.4



#  代码梳理

## UDT部分

* 跟UDTv4相比，src/core内改动比较大的是

  * [ ] api.cpp
  * [ ] buffer.cpp 
  * [ ] core.cpp  改动相当大 ，不仅添加了一些属性，还添加了不少功能

  >  ccc.cpp虽然改动大， 但是本身就是要被继承的，which means没关系



## PCC
### pcc_sender

主要是PccSender类，which

* **functions**

  * 触发型
    * void OnCongestionEvent (  )
    * void OnPacketSent (  )
  * 调整型
    * QuicBandwidth PacingRate (  )
    * QuicTime ComputeMonitorDuration (  )
    * QuicTime GetCurrentRttEstimate (  )
    * -void UpdateCurrentRttEstimate( )
    * -bool ShouldCreateNewMonitorInterval(  )
    * -QuicBandwidth UpdateSendingRate

  * 总结

    * 在事件（发包和ack (==目前不确定==这个CongestionEvent是不是ack获得的) ）发生的时候采取一些操作（比如信息统计( RTT估计值 )、调整结构信息）
    * 调整结构信息
      * sending rate (pacing) 的计算和调整
      * MI大小调整 以及 ==创建(??)==新的MI
      * RTT

    

* **member** 
  * 观测值
    * avg_rtt_
    * sending_rate_
  * 工具
    * utility_calculator_  （PccUtilityCalculator
    * rate_controller_  ( PccRateController
      * rate_control_lock_  (mutex
    * interval_queue_   （PccMonitorIntervalQueue
    * interval_analysis_group_    （PccMonitorIntervalAnalysisGroup



### rate-control

* 在这里面发现了好几个Options的参数
  * pypath 
  * pyhelper ( default : pcc_rate_controller )

* 利用了Python3.5进行了混编
  * [x] 先尝试下能不能换成3.6（坑太多，试到一半放弃了，不然其实是可以的
  * [x] 不然就开始配环境（对...换了台g8就可以




# questions

* [ ] sourceCodes 如何处理这么多宏定义的事情.... 一下子理清代码结构还是很重要的（lxg

* C++特性

  * [ ] chrome的Base库对于[]的使用方法  --》 跨平台开发

    zyh给的[link](https://chromium.googlesource.com/chromium/src/+/refs/heads/master/base/export_template.h#40),针对QUIC_EXPORT_PRIVATE，有空学一手

  * [ ] 哪些需要mutex的lock，哪些不需要，比如说为啥RTT更新就不需要

    pcc_sender.cpp里面
    
  * [ ] 类的explicit到底有什么作用来着...还有=delete之类，还有GCC扩展之类
  
  * [ ] 这种单独的匿名的namespace意义何在？在pcc_lin_ucalc.cpp
  
    ```c
    namespace {
    // Coefficeint of the loss rate term in utility function.
    const float kLossCoefficient = 5.0f;
    // Coefficient of RTT term in utility function.
    const float kRttCoefficient = 1.0/30000.0f;
    }  // namespace
    ```
  
    后面的都不在这个namespace里面，所以是文件里面的可以看到，文件外面的看不到 ?





# 待整理

* [ ] 函数名的mangle过程[这儿](https://blog.csdn.net/Roland_Sun/article/details/43233565)讲得特别好 

```bash
ByteComparator.obj : error LNK2019: unresolved external symbol "int __cdecl does_not_exist(void)" (?does_not_exist@@YAHXZ) referenced in function "void __cdecl TextScan(struct FileTextStats &,char const *,char const *,bool,bool,__int64)" (?TextScan@@YAXAAUFileTextStats@@PBD1_N2_J@Z)
```

* [ ] 利用了Python.h进行了混编
* BBR的研究
  * [ ] [dog大佬](https://blog.csdn.net/dog250/article/details/72042516)关于BBR的问题剖析，我觉得挺好的，等当前这个demo做完，就看看这个，然后基于BBR改进
  * [ ] [这个](http://www.jeepxie.net/article/513417.html)讲了BBR ProbeMore的两阶段探测，里面的idea我确实也没有很理解。





---





> socket通信基础知识

## 网络编程基础概念

* AF_INET ， PF_INET  ， AF_UNIX

  > AF: address family 
  >
  > PF: protocol family
  >
  > INET指的就是internet ，在网上传输的
  >
  > AF_INET（又称 PF_INET）是 IPv4 网络协议的套接字类型，AF_INET6 则是 IPv6 的；而 AF_UNIX 则是 Unix 系统本地通信。
  >
  > AF_INET 相比 AF_UNIX 更具通用性，因为 Windows 上有 AF_INET 而没有 AF_UNIX。

* 网络编程中的[基本数据结构](https://www.jianshu.com/p/f811bff15de9)

  都是结构体

  * sockaddr （旧版本为ipv4设置的

  * sockaddr_storage   // 为了兼容ipv6的 升级版本
  
    > 用到sockaddr的地方都可以用sockaddr_storage来替代。
  
  * addrinfo //存储地址信息的
  
  * sockaddr_in & sockaddr_in6
  
  * sockaddr_in和sockaddr使用上的区别
  
    > sockaddr和sockaddr_in包含的数据都是一样的，但他们在使用上有区别：
    >
    > 1. 程序员不应操作sockaddr，sockaddr是给操作系统用的
    >
    >    程序员应使用sockaddr_in来表示地址，sockaddr_in区分了地址和端口，使用更方便。
    >
    > 2. 一般用法是：程序员把类型、ip地址、端口填充sockaddr_in结构体，然后强制转换成sockaddr，作为参数传递给系统调用函数

z