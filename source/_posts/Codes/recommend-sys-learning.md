---
top: false
cover: false
mathjax: true
title: recommand-sys-learning
date: 2020-11-25 11:02:06
categories: Codes
description: recommendation system learning from datawhale
tags:
	- Recommendation
---



> [赛题](https://tianchi.aliyun.com/competition/entrance/531842/information)
>
> [myCodes](https://nbviewer.jupyter.org/github/hexi519/team-learning-rs/blob/master/RecommandNews/Recommand-sys.ipynb) & [Baseline after comments](https://github.com/hexi519/team-learning-rs/blob/master/RecommandNews/Baseline.ipynb)

# 背景

* 数据

  `sample_submit.csv`：提交样例文件，对应50000个用户对5个文件的点击数预测

  `train_click_log.csv`：训练集用户点击日志

  `testA_click_log.csv`：测试集用户点击日志

  `articles.csv`：新闻文章信息数据表

  `articles_emb.csv`：新闻文章embedding<u>向量表示</u>

* 指标

  MRR(Mean Reciprocal Rank)，关注top5的预测结果。其中越前面的匹配上了就得分越高（具体可以看下baseline代码里面的讲解



# trick

reduce_mem节省内存，就是尽量降低数据精度



# questions

* 如果是为了获取线上提交结果应该讲测试集中的点击数据合并到总的数据中

> 没懂这是什么意思