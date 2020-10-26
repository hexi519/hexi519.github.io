---
title: AuTo
tags:
---



# 好的搭配短语

joint effort and coordination

tackle crucial and timely[这个词觉得不是很合适] challenges



# 常用连接词

## 要进一步阐述

* 解释/(稍微)展开

  for reference	给一些背景的直观概念

  for simplicity / in general 	简单概括

  to be more specific / specifically / in practice  稍微讲细一点

---

* for 补充另一方面

  Besides/Apart from/On top of ... 

  In addition / Furthermore



# Design

Our insight is to...  先给出design的rationale

We proceed to do sth.   我们接着...

> 这里proceed to do 有点continue to do 的意思
>
> We proceed to translate Problem (7) into a DRL problem



# problem formulation

* 阐述建模思路

  tailor the design carefully

  ---

  consider ... as ...

  translate .. problem into a .. problem

  model .. as ..

  cast .. as ..

  ---

  We assume/argue that





# Evaluation

We seek to understand:(1).. (2)  	用于评价段开头，引出我们做这些实验的目的

> We seek to understand: 1) With stable traffic (flow size distribution and traffic load are fixed), how does AuTO compare to standard heuristics? 2) For varying traffic characteristics, can AuTO adapt? 3) how fast can AuTO respond to traffic dynamics? 4) what are the performance overheads and overall scalability?

suffer hefty performance loss of .. （在某个指标方面） /under the situation of .. （在某种场景）

For certain cases ...(指标，e.g. the average FCT ) can be ...  ( increased/reduced by ... (over 30%) )

strike a good balance



# RL相关

## 常用搭配

leading reinforcement learning techniques

*environment* is the surroundings of the *agent* with which  the *agent* can interact through ob- servations, actions, and feedback (rewards) on actions

It signals ...



## Intro里面常用

* RL的流程 & RL的成功性

  In this paper, we investigate reinforcement learning (RL) techniques [55], as RL is the subfield of machine learning concerned with decision making and action control. It studies how an agent can learn to achieve goals in a complex, uncertain environment. An RL agent observes previous environment states and rewards, then decides an action in order to maximize the reward. RL has achieved good results in many difficult environments in recent years with advances in deep neural networks (DNN): DeepMind’s Atari results [40] and AlphaGo [52] used deep RL (DRL) algorithms which make few assumptions about their environments, and thus can be generalized in other settings. 

  

* 我们采用DRL以及增量训练的方式

  We adopt an advanced Deep Reinforcement Learning ( DRL ) algorithm and leverage incremental training to make agents able to accommodate highly heterogeneous traffic patterns and even link failures. 





# 论文排版心得

图片应该尽量放在colomn的top/bottom，不要放在中间位置，且应该在引用出现之后出现

标点符号后面要空一格

* cite , reference 的小细节
  * Fig.~\ref  xxx~\cite （前面要加一个波浪线空格
  * i.e. 和 e.g.后面都要加逗号
* 作者排版
  * [基础模板](https://www.cnblogs.com/qq952693358/p/8715697.html)
  * [同一作者属于不同单位如何排版](http://blog.sina.com.cn/s/blog_5d2054d90101gtms.html)
  * [IEEE排版的中文翻译](https://wenda.latexstudio.net/data/ueditor/php/upload/file/20190814/1565743586995462.pdf)

* ❓
  * networking CC是什么意思...
  * 哪些地方该cite，哪些地方不该啊
  * 哪些地方要加空格哪些地方不要啊。。。看起来页太丑了把..
    * Table~\ref{tab:xx} ?
    * 数字~单位 ？
    * \S~\ref{sec"xx} ?
  * re-thinking , sub-component是不是这种自己拼起来的词都是要加连字符哇？那ultra-low为啥你没有加连字符，是因为这个词已经很常用了么
  * key-word的选择应该还比较随意 ? 
  * 行内公式还没有好好check
    * 前后都要加空格
  * Transactions on Network Science and Engineering (TNSE) 这个刊你见过没哇...CCF等级没见到过，但看起来应该还不错？



