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

  

* udt相关详见[hesy:UDT](https://hexi519.github.io/2020/09/22/Codes/UDT/)

* 问题及解决

  * make之后，直接运行app文件夹下面的程序，报错

    ```bash
    ./app/pccserver: symbol lookup error: ./app/pccserver: undefined symbol: _ZN7Options5ParseEiPPc
    ```

    一看，这个函数别名其实就是Option::Parse(...)这个函数的，which

    * [udt安装](https://blog.csdn.net/qq_28648083/article/details/52818634) 按照这个其实可以解决我的问题

    * 但是我用的是另一个方法，详细原理可以见我关于[hesy:编译链接的笔记](https://hexi519.github.io/2020/09/18/Summary/LinkDebug/)

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

aurora是基于udt的一个app

见[hesy:udt](https://hexi519.github.io/2020/09/22/Codes/UDT/)

