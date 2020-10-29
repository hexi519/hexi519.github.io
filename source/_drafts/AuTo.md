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



# introduction

* mater experience

<img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/15/202802-958772.png" alt="image-20201015202754285" style="zoom:50%;" />





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

* **RL的流程 (短版本) & RL的prevalance**（from auto

  In this paper, we investigate reinforcement learning (RL) techniques [55], as RL is the subfield of machine learning concerned with decision making and action control. It studies how an agent can learn to achieve goals in a complex, uncertain environment. An RL agent observes previous environment states and rewards, then decides an action in order to maximize the reward. RL has achieved good results in many difficult environments in recent years with advances in deep neural networks (DNN): DeepMind’s Atari results [40] and AlphaGo [52] used deep RL (DRL) algorithms which make few assumptions about their environments, and thus can be generalized in other settings. 




* **RL的流程 (长版本)**

  Deep RL is a combination of RL and deep neural network (DNN) and is more powerful to tackle complex tasks than RL. Different from supervised learning techniques with external knowledge guidance, a Deep RL agent learns its behavior through interactions with an environment iteratively for a specific objective. [这里我觉得应该补充下step的概念] At each iteration step, the agent observes the current state of the environment and makes a decision, i.e., an action. Then, the environment evolves transforms from the current state to a new state and returns a reward value to the agent. The reward is a feedback value indicating the quality of the agent’s action. The goal of the agent is to learn a policy which is a DNN mapping state to action so as to maximize the discounted cumulative reward [25]. To find a satisfactory policy, Deep RL takes an exploration-exploitation-based method. The agent can take a large-reward action learned so far, which is called action exploitation. The agent can also try a new action for a possibly higher reward, which is called action exploration. A good tradeoff between exploitation and exploration helps the agent “understand” the environment well and learn an optimized policy through enough iterations. 



* **我们采用DRL以及增量训练的方式**

  We adopt an advanced Deep Reinforcement Learning ( DRL ) algorithm and leverage incremental training to make agents able to accommodate highly heterogeneous traffic patterns and even link failures. 



* **DRL的优势**

	> from DATE(ICNP'20) introduction

	Deep RL, as one of the leading Machine Learning (ML) techniques, has the potential of solving complex and dynamic control problems. Deep RL algorithms can automatically exploit hidden patterns in training data and continue improving its TE strategy over time. Well-trained Deep RL models can do inference efficiently even for the inputs that never appeared before. **Besides**, Deep RL models can be trained by interacting with the network environment without requiring labeled data that are usually hard to obtain in real networks [15]. Several recent proposals [15]–[17] have capitalized on these advancements to tackle the crucial and timely challenge of TE. However, We hasten to emphasize that these RL-based approaches only focus on intra-region TE problems within a single, fully-controlled region (regarded as a single agent) and thus cannot be applied to the distributed TE problem in multi-region networks.

    1. DRL是很前沿的技术，which可以解决复杂问题，并且挖掘隐含的patten ( 这个是RL作为ML的一个子领域的优点，i.e. 只要是ML都有这个优点，which means **也可以套到ML的优势里面去说** )
    2. DRL 泛化性很好（ 同上
    3. 不需要标签，which在真实网络中是难获取的



# 论文排版心得

* cite , reference 的小细节
  * Fig.~\ref  xxx~\cite （前面要加一个波浪线空格
  * i.e. 和 e.g.后面都要加逗号
  * \label要加到适当的位置，才不会从 Fig.1 变成 Fig. Ⅱ-Ⅰ这样的 ❓不过什么是适当的？需要check下
* ❓
  * 哪些地方该cite，哪些地方不该啊
  * 行内公式还没有好好check
    * 前后都要加空格
  * Transactions on Network Science and Engineering (TNSE) 这个刊你见过没哇...CCF等级没见到过，但看起来应该还不错？
  * 可以引用别人的文章，whose文章里面批评了再前人的工作吗？
  * 也可以问问cy：ICC的投稿格式还要再看下
    * key-word的选择应该还比较随意 ? 
    * 关键字个数，以及要不要大写
  * 没有跟state-of-art比较（比如BBR）,有关系么....
  * 是所有图片都转成pdf么

---



* abstract + intro 1.5页
* formulation 2页
* performance 1.5页 （我这里就整两页把