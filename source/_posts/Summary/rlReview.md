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



# 回顾时 一下子没想出来的问题

* 强化学习相对于监督学习为什么训练会更加困难？（强化学习的特征）

  * 强化学习处理的多是序列数据，其很难像监督学习的样本一样满足IID（独立同分布）条件。( needs trivial handling )

  * 强化学习有奖励的延迟（Delay Reward），即在Agent的action作用在Environment中时，Environment对于Agent的State的奖励的延迟（Delayed Reward），使得反馈不及时。

  * 相比于监督学习有正确的label，可以通过其修正自己的预测，强化学习相当于一个“试错”的过程，其完全根据Environment的“反馈”更新对自己最有利的Action。

* 为什么在马尔可夫奖励过程（MRP）中需要有**discount factor**?

  * 有些马尔可夫过程是**带环**的，它并没有终结，然后我们想**避免这个无穷的奖励**；

  * 当前步对遥远未来的reward的**贡献**比较小，所以用discount factor弱化未来的奖励在当前步骤的累加值；

  * 考虑奖励的**不确定性**：假设在从当前步采取同样的action开始，采样不同的trace，可能有的会会有最终奖励、有的不会（这里以打游戏为例，通关得到的最终奖励远大于平时每个步骤得到的微小奖励 ( 有的设置里面平时的奖励实际上都没有，就只设置最终步骤的奖励 ) ）。综上，未来的奖励是受后续trace影响的，也就是不确定的，有一定概率的，所以从这个角度来看，我们也要给这个未来奖励打一个折扣。

    > 从另一个角度思考，考虑不打折扣的情况--》γ都是1的情况下，就很糟糕。

* 为什么说Sarsa ( on-policy ) 更加保守，而Q-learning ( off-policy ) 更加大胆且鼓励探索呢？

  ![img](https://datawhalechina.github.io/leedeeprl-notes/chapter3/img/3.18.png)

  * **鼓励探索**

  可以看到，虽然都是使用ε-greedy算法选择动作，但是对于同一个动作( especially探索出来的动作 )，Q-learning给分会比较高（毕竟是给了一个argmax的action对应的值哇）。那么一旦给分高了以后，偏向选择这个动作的概率就会大，就会探索出更多以这个action开头的trace，其中说不定能找到一个比之前更好的trace。而如果是Sarsa的话，这一次探索之后该动作对应的Q值一跃成为最大值可能性就小很多了。与之相比，Q-learning其实就是鼓励探索的。

  * **更加大胆**

  一个很经典的例子就是cliffWalking里面，Q-learning的最终解可以贴着悬崖边上走，但是SARSA是不可以的，这是因为SARSA会考虑到这个贴着悬崖的状态有ε/4的概率会选择向下的动作，然后掉下去( 非最优动作的探索率是 ε/|A|,这里一共有四个动作:上\下\左\右 )，所以这ε/4的低分(死亡)会把这个状态的分数拉下去(而远离悬崖的状态都安全多了，不会有掉下去的概率)；但是Q-learning是只看这个状态会导致的最好结果，which means只看到最后成功的结果，忽视会掉下去的情况，倾向于”铤而走险“。所以个人认为，单纯从找到一个解决方案来看，还是Q-learning比较占优势。

  >  [但是实际中SARSA会比Q-learning表现得更好](https://www.cnblogs.com/devilmaycry812839668/p/10312685.html) 其实我觉得这个还得看我们用强化学习来解决什么问题了。我们是要用它来找到一个最优解，还是要让他从头到尾”完备、安全“地做完某事。博客中显然是选择了前一种的概念。

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
  > > <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/011454-204261.png" alt="image-20201021175117502" style="zoom: 70%;" />
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

  如果“严格”的说，ε-greedy策略是 $\frac{\epsilon}{A(s)}-soft$ 的策略。

  解释请参考[这个博客](http://fancyerii.github.io/books/rl3/)

  进行符号测试： $\frac{\epsilon}{A(s)}-soft$  成果

  进行符号测试： $ \frac{\epsilon}{A(s)}-soft $  成果

  符号 $$ \frac{\epsilon}{A(s)}-soft$$  测试2

* 值迭代和策略迭代

  * 参考[这个笔记](http://wulc.me/2018/05/05/强化学习笔记(1)-概述/)
  
    > policy iteration 最后收敛的 value V 是当前 policy 下的 value 值（也做对policy进行评估），目的是为了后面的policy improvement得到新的policy；所以是在**显式地不停迭代 policy**。
    >
    > 而value iteration 最后收敛得到的 value 是当前state状态下的最优的value值。当 value 最后收敛，那么最优的policy也就得到的。虽然这个过程中 policy 在也在隐式地更新，但是**一直在显式更新的是 value** 的，所以叫value iteration。
    >
    > > 那从这个角度来看，PG似乎应该属于policy gradient 2333,毕竟是直接对策略进行更改 ( PG中是直接输出策略而非值函数了，也就是update参数实际上就是update策略 。DQN的话update 参数其实是在更新值函数，因为其模型输出是值函数233 ） 
  
  * SARSA和Q-learning也都是值迭代引出来的，只不过一个是同策略（on-policy），另一个是异策略（off-policy）。至于是TD还是MC，只不过采样方式和训练效率上的差别而已。

* PG和AC的划分标准可以参考[这个知乎](https://zhuanlan.zhihu.com/p/51645768)

  * A2C实际上是Advantage Actor-Critic的缩写

  * ```在PG策略中，如果我们用Q函数来代替R，那么我们就得到了Actor-Critic方法。```

    > 所以这里我的理解是：引入了值函数去估计期望累计回报，which作为critic，就是Actor-Critic，有没有baseline并不是最重要的（AC里面，baseline也不一定要用$V(S_t)$ ，不过是因为一般来说，都有了$Q(s,a)$去估计累计期望回报，没道理不用$V(S_t)$作为baseline ,Vanilla PG里面的baseline也是用的$V(S_t)$,但还是PG系列 ）



* 环境non-deterministic 和 deterministic的区别

  * 取决于state是不是只受action影响，env自己是不是也在演化。

  * 比如下棋，俄罗斯方块，你做了你的决定，你的下一个状态不是确定的 ( P(s,a)转移阵不是非0即1的 )

    俄罗斯方块游戏里面的状态是

  * 马里奥游戏就是deterministic的

  > 网络中，输入的流量矩阵也是一个会引起state变化的，有一定概率的东西，所以也是non-deterministic

  * non-stationary和non-deterministic异同：env肯定都是在演化的，但是前者env演化的模式并不固定( 以泊松分布为例，env的演化可以符合参数为$\lambda$的泊松分布( non-derterministic ) (这是一个概率分布)，但是$\lambda$参数本身不能随时间变化，否则相当于演化的概率分布发生了变动，也就是演化的模式是不固定的(non-deterministic)  )

  


# reference

* data-whale强化学习教程

* 刘建平的系列博客确实不错,有空回顾下

  * 已完成

    * 8([价值函数的近似表示与Deep Q-Learning](https://www.cnblogs.com/pinard/p/9714655.html)) [NIPS'13] + 9([Deep Q-Learning进阶之Nature DQN](https://www.cnblogs.com/pinard/p/9756075.html)) [NIPS'15]

      * 三种神经网络的输入输出方式

      * NIPS'13 , 改进主要是经验池回放 ,Q-learning-->DQN

      * NIPS'15 , 改进主要是双网络,  DQN -->Nature DQN

        > 注意,<u>双网络并不是DDQN才提出来的</u>

      * 介绍了下CartPole-v0的基本情况

      * 8里面说PG用的是交叉熵，我就不是很懂了

        ![image-20201114104101708](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/14/104102-559352.png)

        * [ ] 【建模思想】奖励设置要均匀，进一步还可以尝试下下归一化 ==其实我是有点疑惑，后面看看能不能找到理论依据==

          ![image-20201114110105580](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202011/14/111303-795092.png)

      * 8的评论里面还提到了为何现在用的都是TD(0)：实现方便，如果是多步TD，需要改变buffer的构造，改成( s,a,r,s',a',r',s''... ) ，比较麻烦。虽然经验表明了TD(λ)在λ>1的时候效果比较好（注意，TD(λ)是给多步TD加了权重，更复杂），但是实际上单步TD就够用了。

    * 10([Double DQN (DDQN)](https://www.cnblogs.com/pinard/p/9778063.html))

      * DQN存在过度估计的问题,which我没有细究(原文有),有一些文章(e.g.[JQWang的知乎专栏](https://zhuanlan.zhihu.com/p/97853300))在对论文的详解中有说,但是刘建平这里缺失了

        > * [ ] JQWang的论文解读专栏还是挺详细的
        > * [ ] 评论里面提到了过度估计的事情，which感觉还不错。==优先学习一下==
        >
        > * [DataWhale的教程](https://datawhalechina.github.io/leedeeprl-notes/#/chapter7/chapter7)给的解释还是不错的，但其实我觉得没有说清楚:过高估计本身是没影响的，最重要的还是策略的问题，有了双网络，就能有个理性的target，朝正确的方向更新，本身选动作不是很重要，没选到$\underset{a}argmax Q'(s,a)$的话我就当作探索的一个experience也可以哇，重要的是更新价值函数！！

      * 改进就是 表现网络/当前网络中找action ( via argmax ),在target网络中找Q值

      * [ ] 提到了ICML'16的[rl tutorial](https://icml.cc/2016/tutorials/deep_rl_tutorial.pdf) ,也可以翻翻后面几年的

      * [ ] 由S和A得到R, S'和is_end时，R和is_end是根据环境反馈回来的，which对应的是：**S**是否is_end以及S情况下采取A得到的R

        > 确定么？我总感觉是S'是否是end ， V(end_state)=0

    * 11([Prioritized Replay DQN](https://www.cnblogs.com/pinard/p/9797695.html))

      * 

    * 19[AlphaZero](https://www.cnblogs.com/pinard/p/10609228.html)建模设计中有奖励回溯的部分

* [ ] 抓到一个大佬的[gitbook](https://hujian.gitbook.io/deep-reinforcement-learning/) (hujian.gitbook.io)



# question
* [ ] 【强化学习】中Q-learning,DQN等off-policy算法不需要重要性采样的原因

  * [CSDN](https://blog.csdn.net/weixin_37895339/article/details/84881169)

  * 同策略 采样大，收敛慢； Q-learning 是异策略，还不需要importance sampling 

    > 但是我看Q-learning也是一步一更新哇...感觉采样大这个劣势并没有利用好？

* [x] 编程实战书P21 要结合历史观测 是因为部分可观测性？而不是因为非马尔可夫性？

  似乎说得通... 我是因为没有认清当前的状态是什么所以才需要多个state拼在一起的窗口

* [ ] 交叉熵与one-hot之间的联系
  * [百度飞桨部分给出了一些解释](https://datawhalechina.github.io/leedeeprl-notes/#/chapter4/chapter4)给出了点解释，which我觉得还是没有讲清楚
  * check下[强化学习纲要](https://github.com/zhoubolei/introRL)对应部分的讲解
  
* [ ] epsilon的减小方式有没有什么特别的讲究\

* [ ] [正月灯笼](https://www.bilibili.com/video/BV1wa4y177Q1)函数式编程让我感到疑惑:

  up说函数式编程可以避免在debug的时候陷入循环中，那么我很好奇函数式编程如何debug
  list.append为何拖累了速度呢？up有没有相关资料可以分享一下~
  想问下第二种方式和第三种方式是不是除了形式上并没太大的区别，主要还是第一种方式里面的append是性能瓶颈?

