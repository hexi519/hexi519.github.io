---
title: MORL
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-20 01:28:19
categories: PaperReading
description: A Generalized Algorithm for Multi-Objective Reinforcement Learning and Policy Adaptation, NIPS'19  普林斯顿
tags:
    - Reinforcement Learning
---



A Generalized Algorithm for Multi-Objective Reinforcement Learning and Policy Adaptation
NIPS'19  普林斯顿

# abstract 

我们引入了一种具有==线性偏好==的多目标强化学习（MORL）的新算法(with linear preferences)，其目标是能够对新任务进行少量调整。 在MORL中，目的是学习有关多个竞争目标的策略，这些目标的相对重要性（偏好）对于代理人是未知的。 虽然这减轻了对标量奖励设计的依赖，但是策略的预期收益会随着偏好的变化而发生显着变化，这使得学习单一模型以在不同的偏好条件下产生最优策略具有挑战性。 我们提出Bellman方程的广义形式，以学习在所有可能的偏好范围内获得最优政策的单个参数表示。 **在初始学习阶段之后，我们的代理可以在任何给定的首选项下执行最佳策略**，或者自动通过很少的样本来推断潜在的首选项。 在四个不同领域的实验证明了我们方法的有效性。



# 1 Introduction

> 我们解决了MORL中的两个具体挑战：
>
> 1. 提供具有线性偏好的MORL多目标版本Q学习的理论收敛性结果，以及
> 2. 证明有效利用深度神经网络将MORL扩展到更大的领域。 
>
> 我们的算法基于两个关键的见解
>
> 1. 带有偏好的Bellman方程[10]的广义版本的最优算子是有效收缩，以及
> 2. 多目标Q值的凸包络的优化确保了 偏好与相应的最优政策之间的有效协调。 我们使用HER对有采样优先级的经验回放[11]和homotopy optimization[12]的学习过渡，以确保易于学习。 此外，我们还演示了如何通过策略梯度和对偏好参数的随机搜索的组合，使用训练有素的模型自动推断新任务的隐性偏好（仅提供标量奖励）。
>
> 此外，我们还演示了如何使用我们训练有素的模型，通过结合政策梯度，在仅提供标量奖励的情况下自动推断新任务的隐藏偏好。



# 2 Background

## MOMDP

* Parrto Frontier
* CCS



## related work

* MORL 
  * single-policy 在给定preference的情况下学习一个策略 & multiple-policy 在不同preference情况下学习多组相应最优的策略
  * scalarized Q-learning  使用ourler loop去搜索最佳策略(OLS)
    * [里面引用了2016年开源的那篇文章]



# 3 算法

* T $\mathcal{T}$ 单目标和多目标中Q函数的贝尔曼优化算子
* H $\mathcal{H}$  单目标和多目标中Q函数的optimal filter
* d( Q,Q' )
* $L^A(\theta)$ 与$L^B(\theta)$ 
* learning algorithm 以及 policy adaption两个part

![image-20201025140615145](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/25/140616-919388.png)



# 4 Experiments

* 

* 实验设置
  * 指标 CR （Coverage Ratio）、AE（Adaptation Error）、UT（Average Utility）
  * 四个场景
    * DST FTN Dialog  SuperMario
  * 三个baseline
    * ==check下哪个可以输出连续动作哇...==

* 结果
  * 几个指标上的胜利，但是提升的点并不是很多哇
  * scalability
  * sample efficiency
  * policy adaptation
  * revealing underlyging preferences
    * 这部分的结果分析的意思应该是，policy adaptaion不是一个必要环节，one of its 作用就是去uncover underlying preferences.



# questions

* optimality filter 指的是argmax 或者 sup ?
* o.w.什么意思...

* truncated multivariable Gaussian distribution 是什么意思




prediction based

---

# abstract 

许多现实世界中的控制问题都涉及目标冲突，我们需要一套密集而高质量的控制策略，这些策略对于不同的目标偏好是最优的（称为帕累托最优）。 尽管为解决此类问题已进行了多目标强化学习（MORL）的广泛研究，但对于复杂连续机器人控制的多目标优化仍处于探索中。 在这项工作中，我们提出了一种有效的进化学习算法，通过扩展最先进的RL算法并提出一种新颖的预测模型来指导学习过程，从而找到连续机器人控制问题的帕累托集近似值 。 除了有效地发现Pareto前沿的单个策略外，我们还通过Pareto分析和内插法构造了一组连续的Pareto最优解。 此外，我们设计了七个具有连续动作空间的多目标RL环境，这是第一个评估MORL算法解决各种机器人控制问题的基准平台。 我们对提出的基准问题测试了先前的方法，并且实验表明，与现有算法相比，我们的方法能够找到更密集，质量更高的帕累托策略集。



# Introduction
> ​	多目标问题已经引起了广泛的关注，因为大多数现实情况都涉及对不同性能指标的权衡。 在机器人控制中尤其如此，其中性能概念通常涉及不同的冲突目标。例如，当为运行中的四足机器人设计控制策略时，我们需要考虑两个相互矛盾的目标：运行速度和能效。与单目标环境相比，单目标环境使用单个标量值来衡量性能，并且在存在单个最佳解决方案的情况下，对于多目标问题，性能是使用多个目标进行衡量的，并且存在多个最佳解决方案。 一种最优策略可能会以降低能源效率为代价来偏爱高速度，而另一种最优策略可能会以降低速度为代价偏向于高能量效率。 通常，根据这两个度量之间的选择权衡，存在许多最佳策略。 最后，由人负责在不同指标之间选择偏好，这决定了相应的最佳策略。
>
> ​	解决多目标控制问题的一种流行方法是计算meta policy（Chen等，2018）。 元策略是一种通用策略，它不一定是最佳策略，但可以相对快速地适应性能目标之间的不同折衷。 不幸的是，这种adaptive的控制策略不一定是最优的。例如，为四足机器人适应通用元控制策略以使其尽可能快地运行，通常会导致该指标的策略欠佳。 例如，为四足机器人适应通用元控制策略以使其尽可能快地运行，通常会导致该指标的策略欠佳。
> 
>​	在这项工作中，我们表明，获得多目标机器人控制的最佳性能折衷的有效代表是一组帕累托控制策略。 我们的经验表明，不能使用单个连续的策略族来有效地表示帕累托集。 相反，帕累托集由一组不相交的策略族组成，每个策略族在参数空间中占据一个连续的流形，并负责性能空间中帕累托前沿的一个部分（图1）。
> 
>为了找到这种帕累托表示，我们提出了一种有效的算法来计算帕累托策略集。 我们的算法分两个步骤进行。 第一步，我们使用基于a novel prediction-guided evolutionary learning algorithm，在帕累托前沿找到密集且高质量的策略集。 在每一generation中，每种策略都适合使用分析模型，以预测沿每个优化方向的预期改进。 然后解决优化问题，以选择可以最好地改善Pareto质量的策略和相关的优化方向。 在第二步中，我们对计算出的Pareto最优策略进行Pareto分析，以识别不同的策略系列，并为每个策略系列计算连续的表示形式。
>    
>​	==上面这一段的翻译不是很好==
> 
>​	为了对我们提出的算法进行基准测试，我们设计了一组具有连续动作空间的多目标机器人控制问题。 可以使用基于物理的模拟系统来评估每个策略的性能（Todorov等，2012）。 我们的实验表明，与现有方法相比，该算法可以有效地找到一组质量更高的帕累托最优策略。 此外，基于这些策略，它可以重建跨越整个帕累托前沿的连续策略系列。



