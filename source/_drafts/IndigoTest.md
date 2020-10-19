---
title: IndigoTest
top: false
toc: true
cover: false
mathjax: true
categories: Codes
description: code experiences of Indigo Baseline algorithm
tags:
    - Network
    - Reinforcement Learning
    - Congestion Control
---

# 运行命令
## 测试

> 还是从pantheon的平台上学习到的

* 接收端（server

  ```bash
  ./dagger/run_receiver.py ip port
  ```

* 发送端（receiver

  ```bash
  ./dagger/run_sender.py
  ```




## 训练

> 还是从Aurora上看到的..

```bash
# pattern for indigo
python train.py --ps-hosts 127.0.0.1:9000 --worker-hosts 127.0.0.1:8000 --username hesy --rlcc-dir /home/hesy/pro/pan/indigo/RLCC

# pattern for a3c
python train.py --ps-hosts 127.0.0.1:9123 --worker-hosts 127.0.0.1:8234 --username hesy --rlcc-dir /home/hesy/pro/pan/a3c_indigo

# 设置并省略了些默认配置
python train.py --ps-hosts 127.0.0.1:9000 --worker-hosts 127.0.0.1:8000

# 单独来
## server
python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 127.0.0.1:9123 --worker-hosts 127.0.0.1:8234 --job-name ps --task-index 0

## worker
python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 127.0.0.1:9123 --worker-hosts 127.0.0.1:8234 --job-name worker --task-index 0

# ps on g15
python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 12.12.12.115:9123 --worker-hosts 12.12.12.114:8234 --job-name ps --task-index 0

# worker no g14
python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 12.12.12.115:9123 --worker-hosts 12.12.12.114:8234 --job-name worker --task-index 0

# on one host
python /home/hesy/pro/pan/a3c_indigo/a3c/train.py --ps-hosts 127.0.0.1:9123 --worker-hosts 127.0.0.1:8234 

--job-name worker --task-index 0

python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 12.12.12.114:9123 --worker-hosts 12.12.12.115:8234 --job-name ps --task-index 0

python /home/hesy/pro/pan/a3c_indigo/a3c/worker.py --ps-hosts 12.12.12.114:9123 --worker-hosts 12.12.12.115:8234 --job-name worker --task-index 0
```

* 疑问
  * 看代码ps-hosts可以有多个啊，用逗号分隔的HOSTNAME:PORT对



计时是从第15个step开始

> 修改了动作，给链路加了抖动--》 12ms变化一次

TF_CPP_MIN_LOG_LEVEL=1 

python train.py --ps-hosts "127.0.0.1:9000" --worker-hosts "127.0.0.1:8000,127.0.0.1:8001,127.0.0.1:8002,127.0.0.1:8003,127.0.0.1:8004,127.0.0.1:8005,127.0.0.1:8006,127.0.0.1:8007,127.0.0.1:8008,127.0.0.1:8009,127.0.0.1:8010,127.0.0.1:8011">> trainLog 2>&1



python train.py --ps-hosts "127.0.0.1:9000" --worker-hosts "127.0.0.1:8000,127.0.0.1:8001,127.0.0.1:8002,127.0.0.1:8003,127.0.0.1:8004,127.0.0.1:8005,127.0.0.1:8006,127.0.0.1:8007,127.0.0.1:8008,127.0.0.1:8009,127.0.0.1:8010,127.0.0.1:8011">> trainLog 2>&1



python train.py --ps-hosts "127.0.0.1:9000" --worker-hosts "127.0.0.1:8000,127.0.0.1:8001" >> trainLog 2>&1

python train.py --ps-hosts "127.0.0.1:9000" --worker-hosts "127.0.0.1:8002,127.0.0.1:8003,127.0.0.1:8004,127.0.0.1:8005" >> trainLog 2>&1





# 代码阅读

* 默认是时间单位是ms ( udt就是us )

* 包 数据结构

  * seq_num
  * send_ts  发送时间
  * sent_bytes     目前这个socket已发送的字节数
  * delivered_time  上一次收到ack包的时间
  * delivered    对方已经接收的字节数
  * payload    “x”*1400 用于构造一个MTU

* 一些计算逻辑

  * tput--> throughtput（bps)

    ```python
    收到的被确认的字节数量/(最近一次收到ack的时间-第一次收到ack的时间)
    ```

  * packet delivery rate [**PDR**]（bps）

    sds

    > throughput与delivery rate的区别: [refer](https://www.researchgate.net/post/What_is_the_relationship_between_packet_delivery_ratio_and_throughput)
    >
    > PDR means the number of successfully received packets to the total number of packets sent by sender (*including re-transmissions)*  while throughput is the capacity of link or network to through/pass data successfully.
    >
    > * 这里的including re-transmissions作何解释呢？
    >
    >   > 通常，较高的PDR会提供较高的吞吐量，反之亦然。但是，可能会有很多例外。例如，假设您将数据包从源发送到目的地，但它出错并重新传输。在一种情况下，第二次成功重传，而在第二种情况下，第十次尝试重传。在两种情况下，吞吐量（每单位时间在目标位置接收到的应用层数据）将相同，其中PDR为0.5或0.1。
    >
    > * Throughput always is higher than PDR due to noise, congestion, and other problems.

    > * [ ] 其实还不是很懂，下次还可以看看[这个](https://leanagileguru.com/2019/08/27/delivery-rate-versus-throughput/)，目前先按照程序的来吧
    >
    >   也不是很懂 感觉PDR也是一个很关键的指标啊



* agent建模

  * **state** [4维]

    * delay_ewma

      这里的delay是rtt-min_rtt的大小

    * delivery_rate_ewma [其实我觉得用PDR确实比throughput更合适]

    * send_rate_ewma

    * cwnd

  * **action** [5维]

    * *2
    * +10
    * 不变
    * -10
    * /2

  * **basic config**

    * step : 10ms
    * epoch : 1000 steps
    * train
      * default_batch_size 300



## a3c的修改

* models.py	毕竟从Dagger改成了A3C
* a3c.py和dagger.py差得也比较多
* run_sender.py也差得比较多  Learner全都改了
* train.py稍微改了下
* worker.py 也改了不少...这...相当于全改了



# questions

## ask master

* [ ] socket 网络编程那本书是不是不整网络编程就不用看？当作一本工具书？如果不是工具书，有啥需要重点看一下的么？或者了解下epoll的实现原理之类的？？

* [ ] 一般了解一个架构你都从什么开始看，比如说网络的，就是从整体的框架（协议栈的层次）？还是说从想要修改的关键字开始修改啊... 或者有啥推荐的架构的工具么？比如sourceCodes？虽然UI很丑...但是他的UML图真的很香...不过似乎只能一个文件一个文件里面生成？
  
* [ ] 也ask下曦光 架构代码如何阅读
  
* [ ] 啊这merge还是不太行

  基于vscode

  基于命令行



## ask 学长

* 用不用tf （先问下学神觉得还有没有必要把

