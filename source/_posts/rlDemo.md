---


title: rlDemo
top: false
cover: false
toc: true
mathjax: true
date: 2020-10-22 01:54:51
categories: Summary
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

* ε-decay和ε-start还有ε-end是耦合的，第一个感觉比较难调整，就调后面两个好了<img   src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201022023149453.png" alt="image-20201022023149453" style="zoom: 50%;" />

  * 先用默认参数跑了下，发现其实100步已经妥妥收敛了（右边），所以**me果断设置100** ，确实还不错（见下）

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030751-545506.png" alt="image-20201022030700622" style="zoom: 67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031416-949404.png" alt="image-20201022030741939" style="zoom:67%;" />

  * 最短路径是15步，所以**gamma**我取了个1-1/15，**约等于0.95**

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/025053-715031.png" alt="image-20201022025051942" style="zoom: 67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031206-822872.png" alt="image-20201022024836105" style="zoom:50%;" />

    目前看效果还不错（如上），肯定是train好了，接着调

  * **ee 调到0.99**，希望一开始探索多一点

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031126-830561.png" alt="image-20201022025738159" style="zoom:67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/031206-89443.png" alt="image-20201022025802328" style="zoom:67%;" />
  
    > 可以看到一开始探索多了以后，学习得居然也快了,说明探索到了好的方法
  
  * 再分别试试**调大学习率**（0.15）和**调小学习率（0.05**）
  
    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030056-455700.png" alt="image-20201022030055460" style="zoom:67%;" /><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/22/030335-443486.png" alt="image-20201022030055460" style="zoom:67%;" />
  
    > 学习率大了以后果然学的就是快hhh 







