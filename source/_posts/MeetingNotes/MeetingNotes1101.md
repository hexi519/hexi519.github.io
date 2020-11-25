---
top: false
cover: false
mathjax: true
title: MeetingNotes1101
date: 2020-11-25 20:35:09
categories: MeetingNotes
description: Notes of the meeting 
tags:
    - Network
---



[视频地址](https://wx.vzan.com/live/tvchat-1565352153?shareuid=337541654&vprid=0&sharetstamp=1603587560819#/)

# 陈凯 net 4 AI

<img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/18/163439-988187.png" style="zoom:50%;" />

* compress 传输量 并不能降低尾部传输时间

  当然，平均的时延是会降低

  说明瓶颈不在于传输量

* 丢一定量的数据包并不会影响模型的convergence

  <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/18/163348-450748.png" alt="image-20201118161135895" style="zoom:50%;" />

  * 那么应该丢哪些包？ 后层的gradient和larger gradient更重要

* DNN流的特性：跟以前的信息包不一样，前者是一个message包含多个包（包之间存在依赖性），现在是一个包包含多个message（包与包之间关联性不大），所以不用太多去考虑包乱序等事情。

  <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/18/163350-390697.png" alt="image-20201118163215817" style="zoom:50%;" />

  > 至于现在 一个包 包含多个message这个特性是怎么来的，我就没有细究了。

  之前的ECMP等负载均衡，就会考虑 perflow的粒度性能就差了，perpacket的粒度还得考虑乱序问题。



# 李丹 Net 4 AI

使用==贝叶斯优化==