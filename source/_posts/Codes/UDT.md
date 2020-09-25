---
title: UDT
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-22 22:35:59
categories: Codes
description: UDT架构
tags:
    - Network
    - Congestion Control
---



# reference

* [sourceforge官网](https://udt.sourceforge.io/) 【05年出的，更新到09年】

  > ppt 、poster、documention、discussion/help 版块(including Chinese)

* [x] [udt初步介绍](https://blog.csdn.net/asdfghjkl1993/article/details/57417074) 里面有UDT的架构图，可惜没有再出后续了...

  > <img src="https://img-blog.csdn.net/20170226170700588?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYXNkZmdoamtsMTk5Mw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center" alt="img" style="zoom: 33%;" />
  >
  > <img src="https://img-blog.csdn.net/20170226170750116?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYXNkZmdoamtsMTk5Mw==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center" alt="img" style="zoom:33%;" />

* [x] 大佬系列博客：[udt源码分析](https://www.wolfcstech.com/categories/%E7%BD%91%E7%BB%9C%E5%8D%8F%E8%AE%AE/page/5/) 后续想要读源码的话可以==再仔细看一下==（目前只是大概浏览了下）,which我觉得讲得真的不错

  > * UDT::startup()的调用过程为：UDT::startup()-> CUDT::startup() -> CUDTUnited::startup()。
  >
  >   从这里也可以看出UDT、CUDT、CUDTUnited之间的关系
  >
  > * UDT的命名规则有些讲究，前缀代表着数据类型
  >
  > * **设计架构**
  >
  >   * socket创建那一章说的：UDT的使用者在调用UDT API时，UDT API会直接调用CUDT类对应的static API函数，在CUDT类的这些static API函数中会将做实际事情的工作委托给s_UDTUnited的相应函数，但这个委托调用会被包在一个try-catch block中。s_UDTUnited的函数在遇到异常情况时抛出异常，CUDT类的static API函数捕获异常，根据捕获到的异常的具体类型，创建不同的CUDTException对象设置给s_UDTUnited的线程局部存储变量m_TLSError中并向UDT API调用者返回错误码，UDT API的调用者检测到错误码后，通过UDT::getlasterror()获取存储在m_TLSError中的异常。
  >
  >   * bind( )函数[那一章](https://www.wolfcstech.com/2015/09/09/UDT%E5%8D%8F%E8%AE%AE%E5%AE%9E%E7%8E%B0%E5%88%86%E6%9E%90%E2%80%94%E2%80%94bind%E3%80%81listen%E4%B8%8Eaccept/)说的: 和socket创建时一样是==分为3层==：UDT命名空间中提供了给应用程序调用的接口，可称为**UDT API或User API**；User API调用CUDT API，这一层主要用来做错误处理，也就是捕获动作实际执行过程中抛出的异常并保存起来，然后给应用程序使用；CUDT API调用CUDTUnited中API的实现。
  >
  >     > "此处可以看到，CUDT提供的这一层API，一个比较重要的作用大概就是做异常处理了。"
  >     >
  >     > 其实这里没有很懂UDT的==设计艺术==，为什么要分三个层次的类，中间那个特别像个中间件，为什么异常处理要单独拎出来。
  >
  >   * bind( )函数[那一章](https://www.wolfcstech.com/2015/09/09/UDT%E5%8D%8F%E8%AE%AE%E5%AE%9E%E7%8E%B0%E5%88%86%E6%9E%90%E2%80%94%E2%80%94bind%E3%80%81listen%E4%B8%8Eaccept/)还介绍了UDT的多路复用器CMultiplexer、通道CChannel、发送队列CSndQueue和接收队列CRcvQueue的含义
  >
  >     * **CChannel**
  >
  >       > 系统UDP socket的一个封装，它主要封装了系统UDP socket handle，IP版本号，socket地址的长度，发送缓冲区的大小及接收缓冲区的大小等信息，并提供了用于操作 系统UDP socket进行数据收发或属性设置等动作的函数。
  >
  >     * [ ] 其实没有很懂多路复用器(Multiplexer)和socket之间的关系 ( 监听端口到底是什么操作？我理解的目前是socketchannel可以实现在一个线程里面监听多个某个端口的状况 ( 是否接收了数据等等 ) 并将更新的情况跟selector ( 也就是多路复用器 ) 交流 ,which会选择让哪个socket去处理这件事情) 、
  >
  >     * CRcvQueue
  >
  >       > 在接收队列CRcvQueue的worker线程中，接收到一条消息之后，它会根据消息的目标SocketID，及发送端的地址等信息，将消息以不同的方式进行dispatch

* [ ] [这个博客](http://www.wisestudy.cn/opentech/udt-congestionControlAlgorithm.html)相当于翻译了udt的论文

* [ ] ==CS 224==的那个project是怎么整的 还得看下

* udt思路及代码分析

  * [ ] [这个](http://www.wisestudy.cn/opentech/udt-congestionControlAlgorithm.html)里面有代码架构分析
  * [ ] [这个](https://network.51cto.com/art/201409/451139.htm)里面有伪代码

* [ ] [官方提供的reference](https://udt.sourceforge.io/udt4/)里面就有api手册  [代码的doc文件里面也可以离线查看]

  



# 代码架构

```bash
./src:     UDT source code 
./app:     Example programs 
./doc:     UDT documentation (HTML)
./win:     Visual C++ project files for the Windows version of UDT 
```



## UDT socket structures

![image-20200923200351000](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200923200351000.png)

* socket文件描述符 +  错误码 + UDT socket集合 + TraceInfo ()
  * TraceInfo , performance的一些数据
    * aggregate values
      * pktSndLossTotal 和 pktRcvLossTotal的区别？？这个RcvLoss怎么测试呢==？？==
    * local values since last recorded time
    * instant values at the time they are observed
    * 