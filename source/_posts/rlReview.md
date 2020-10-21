---
title: rlReview
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-20 01:28:19
categories:
description: Summary
tags:
    - Reinforcement Learning
---



# 回顾的时候 一下子没想出来的问题

* 强化学习相对于监督学习为什么训练会更加困难？（强化学习的特征）

  * 强化学习处理的多是序列数据，其很难像监督学习的样本一样满足IID（独立同分布）条件。( needs trivial handling )

  * 强化学习有奖励的延迟（Delay Reward），即在Agent的action作用在Environment中时，Environment对于Agent的State的奖励的延迟（Delayed Reward），使得反馈不及时。

  * 相比于监督学习有正确的label，可以通过其修正自己的预测，强化学习相当于一个“试错”的过程，其完全根据Environment的“反馈”更新对自己最有利的Action。

* 为什么在马尔可夫奖励过程（MRP）中需要有**discount factor**?

  * 有些马尔可夫过程是**带环**的，它并没有终结，然后我们想**避免这个无穷的奖励**；

  * 当前步对遥远未来的reward的**贡献**比较小，所以用discount factor弱化未来的奖励在当前步骤的累加值；

  * 考虑奖励的**不确定性**：假设在从当前步采取同样的action开始，采样不同的trace，可能有的会会有最终奖励、有的不会（这里以打游戏为例，通关得到的最终奖励远大于平时每个步骤得到的微小奖励 ( 有的设置里面平时的奖励实际上都没有，就只设置最终步骤的奖励 ) ）。综上，未来的奖励是受后续trace影响的，也就是不确定的，有一定概率的，所以从这个角度来看，我们也要给这个未来奖励打一个折扣。

    > 考虑不打折扣的情况--》γ都是1的情况下，就很糟糕。

* 为什么说Sarsa ( on-policy ) 更加保守，而Q-learning ( off-policy ) 更加大胆（鼓励探索）呢？

  ![img](https://datawhalechina.github.io/leedeeprl-notes/chapter3/img/3.18.png)

  可以看到，虽然都是使用ε-greedy算法选择动作，但是对于同一个动作( especially探索出来的动作 )，Q-learning给分会比较高（毕竟是给了一个argmax的action对应的值哇）。那么一旦给分高了以后，偏向选择这个动作的概率就会大，就会探索出更多以这个action开头的trace，其中说不定能找到一个比之前更好的trace。而如果是Sarsa的话，这一次探索之后该动作对应的Q值一跃成为最大值可能性就小很多了。与之相比，Q-learning其实就是鼓励探索的。

  > ```"那么一旦给分高了以后，偏向选择这个动作的概率就会大"```
  >
  >  这里要区分一个概念：对于ε-greedy来说，除了使得值函数的值最大的那个action以外，其他所有的action的选取概率实际上都是一样的。如果想要按照值函数大小为概率来选择动作的话，可以考虑玻尔兹曼策略或者UCB策略。
  >
  > 所以，这句话的隐含意思是，**很大可能**这次更新后( 因为加上的是最大值啊喂 )，这个动作对应的Q-value就一跃成为最大值（之一）了，此时其被选取、探索的概率就会变大。

  > **个人认为**，Q-learning这方法会跟UCB做赌博机的那个实验效果一样，倾向于**把所有的动作空间都try一遍**（因为一旦概率落到新动作上，如果学习率比较大，那么这个新动作的Q值一下子就会变得很大，一跃成为Q值最大的，所以下次会优先(大概率)选择它，然后就相当于展开了以它为根结点的探索空间）......
  >
  > 支撑论据：
  >
  > > refer@[知乎](https://www.zhihu.com/question/268461866)，which第一个高票回复我觉得不对，直接在评论里面怼回去了。
  > >
  > > <img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201021175117502.png" alt="image-20201021175117502" style="zoom: 80%;" />
  > >
  > > * 可以看到同样的情况下，Q-learning收敛比较慢（因为探索的概率更大哇），但是一旦收敛，就比较稳定了。但是Sarsa就不一样，收敛了以后，由于探索性探索到的动作之前没有好好学习到，所以经常会出现锯齿（which Q-learning已经在前期探索到比较好的策略了）[所以[有人](https://datawhalechina.github.io/leedeeprl-notes/#/chapter3/chapter3)说的“sarsa因为要兼顾探索所以策略不稳定“是这个意思( 并不是说q-learning就没有兼顾探索了hh) ]
  > >
  > > * 另一方面，Sarsa由于缺乏探索性（偏向保守），所以没有收敛到一个最优解，也许需要更长的时间才能收敛到Q-learning的程度 ( 可以看到收敛曲线其实还是在缓慢下降的 )
  >
  > 所以动作空间别太大哈，不然不就凉凉了2333 【个人觉得off-policy 学习率大的时候适合动作空间比较小的】
  >
  > > which事实证明并不是的2333....我着实没想通
  
  > **异策略可以保证充分的探索性**。例如⽤来评估和改善的策略是贪婪策略，⽤于产⽣数据的探索性策略为探索性策略，如ε-soft策略。  -- 郭宪 《深入浅出强化学习：原理入门》



* ε-greedy策略是是ε-soft策略中的一种

  如果“严格”的说，ε-greedy策略是$\frac{ϵ}{A(s)}-soft$的策略。

  解释请参考[这个博客](http://fancyerii.github.io/books/rl3/)

* 值迭代和策略迭代

  其实MC和TD都是基于值迭代的范式（见《编程实践》书P64），所以SARSA和Q-learning也都是值迭代引出来的，只不过一个是同策略，另一个是异策略（Levine说过PG反而有点像策略爹地啊






# question
* [ ] 【强化学习】中Q-learning,DQN等off-policy算法不需要重要性采样的原因

  * [CSDN](https://blog.csdn.net/weixin_37895339/article/details/84881169)

  * 同策略 采样大，收敛慢； Q-learning 是异策略，还不需要importance sampling 

    > 但是我看Q-learning也是一步一更新哇...感觉采样大这个劣势并没有利用好？

* [ ] 编程实战书P21 要结合历史观测 是因为部分可观测性？而不是因为非马尔可夫性？

  似乎说得通... 我是因为没有认清当前的状态是什么所以才需要多个state拼在一起的窗口