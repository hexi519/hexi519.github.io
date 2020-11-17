---
title: rlDemo
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-22 01:54:51
categories: Codes
description: toy play of rl
tags:
    - Reinforcement Learning
---



# Q-learning

[base代码](https://github.com/datawhalechina/leedeeprl-notes/blob/master/codes/Q-learning/main.py)

```bash
# 老是说我没有权限就很烦...
sudo /home/hesy/.conda/envs/py36/bin/python main.py # use default config  0.9,0.9,0.1,200,0.1,500
sudo /home/hesy/.conda/envs/py36/bin/python main.py --gamma 0.95 --me 100
sudo /home/hesy/.conda/envs/py36/bin/python main.py --gamma 0.95 --es 0.99 --me 100
```

* ε-decay和ε-start还有ε-end是耦合的，第一个感觉比较难调整，就调后面两个好了

	<img   src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031909-640019.png" alt="image-20201022023149453" style="zoom: 50%;" />

  * 先用默认参数跑了下，发现其实100步已经妥妥收敛了（右边），所以**me果断设置100** ，确实还不错（见下）
  
    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030751-545506.png" alt="image-202010220307622" style="zoom: 67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031416-949404.png" alt="image-20201022041939" style="zoom:67%;" />

  * 最短路径是15步，所以**gamma**我取了个1-1/15，**约等于0.95**
  
    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/025053-715031.png" alt="image-20201022025051942" style="zoom: 67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031206-822872.png" alt="image-20201022024836105" style="zoom:50%;" />

    目前看效果还不错（如上），肯定是train好了，接着调

  * **ee 调到0.99**，希望一开始探索多一点

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031126-830561.png" alt="image-20201022025738159" style="zoom:67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031206-89443.png" alt="image-20201022025802328" style="zoom:67%;" />
  
    > 可以看到一开始探索多了以后，学习得居然也快了,说明探索到了好的方法
  
  * 再分别试试**调大学习率**（0.15）和**调小学习率（0.05**）
  
    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030056-455700.png" alt="image-20201022030055460" style="zoom:67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030335-443486.png" alt="image-20201022030055460" style="zoom:67%;" />
  
    > 学习率大了以后果然学的就是快hhh 



# DQN

## 环境配置

游戏：CartPole-v0，action是两维度(左和右，分别用0和1表示)， state是四维的（$x,\overset{·}x,\theta,\overset{·}\theta$）（位置，速度，杆子与竖直方向的夹角，角度变化率）；左移或者右移小车的*action*之后，*env*会返回一个+1的*reward*。其中*CartPole-v0*中到达200个*reward*之后，游戏也会结束，而*CartPole-v1*中则为*500*。最大奖励（*reward*）阈值可通过前面介绍的注册表进行修改。



## 错误记录 & 修正

```bash
Traceback (most recent call last):
  File "main.py", line 158, in <module>
    eval(cfg)
  File "main.py", line 130, in eval
    action = agent.choose_action(state,train=False)  # 根据当前环境state选择action
  File "/home/hesy/rlreview/leedeeprl-notes/codes/dqn/agent.py", line 76, in choose_action
    q_value = self.target_net(state)
  File "/home/hesy/.conda/envs/py36/lib/python3.6/site-packages/torch/nn/modules/module.py", line 541, in __call__
    result = self.forward(*input, **kwargs)
  File "/home/hesy/rlreview/leedeeprl-notes/codes/dqn/model.py", line 29, in forward
    x = F.relu(self.fc1(x))
  File "/home/hesy/.conda/envs/py36/lib/python3.6/site-packages/torch/nn/modules/module.py", line 541, in __call__
    result = self.forward(*input, **kwargs)
  File "/home/hesy/.conda/envs/py36/lib/python3.6/site-packages/torch/nn/modules/linear.py", line 87, in forward
    return F.linear(input, self.weight, self.bias)
  File "/home/hesy/.conda/envs/py36/lib/python3.6/site-packages/torch/nn/functional.py", line 1370, in linear
    ret = torch.addmm(bias, input, weight.t())
RuntimeError: Expected object of device type cuda but got device type cpu for argument #2 'mat1' in call to _th_addmm
```







