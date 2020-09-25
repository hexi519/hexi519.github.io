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



# 基本配置

* PCC-RL 和 PCC-Uspace都是从gitee里面fork的，都是9.16才导入到gitee里面的，此时这两个仓库已经很久没有更新了

* 代码结构(PCC-Uspace)
  
  > The code in this repository is broken into 3 parts:
  >
  > 1. The application code (located in src/app)
  >
  > 2. The UDT library code (located in src/core)
  >
  > 3. The PCC implementation (located in src/pcc)
  >
  > 
  >
  > The PCC code is split into two main parts:
  >
  > 1. The rate control algorithm (located in the src/pcc/pcc_sender files)
  >
  > 2. The monitor interval and utility calculation algorithms (located in the src/pcc/pcc_monitor_interval_queue files)

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
      > 其实这里最好写绝对路径，否则每次都得在src的目录下运行才可以，不然还是找不到udt的库的




#  代码梳理



# 待整理

* [ ] 函数名的mangle过程[这儿](https://blog.csdn.net/Roland_Sun/article/details/43233565)讲得特别好 

```bash
ByteComparator.obj : error LNK2019: unresolved external symbol "int __cdecl does_not_exist(void)" (?does_not_exist@@YAHXZ) referenced in function "void __cdecl TextScan(struct FileTextStats &,char const *,char const *,bool,bool,__int64)" (?TextScan@@YAXAAUFileTextStats@@PBD1_N2_J@Z)
```

* BBR的研究
  * [ ] [dog大佬](https://blog.csdn.net/dog250/article/details/72042516)关于BBR的问题剖析，我觉得挺好的，等当前这个demo做完，就看看这个，然后基于BBR改进
  * [ ] [这个](http://www.jeepxie.net/article/513417.html)讲了BBR ProbeMore的两阶段探测，里面的idea我确实也没有很理解。

* [ ] [codespaces中文指南](https://docs.github.com/cn/github/developing-online-with-codespaces/about-codespaces)



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

