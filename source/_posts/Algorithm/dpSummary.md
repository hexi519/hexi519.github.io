---
top: false
cover: false
mathjax: true
title: dp总结
date: 2020-12-04 16:08:37
categories: Algorithm
description: dp问题的套路归纳
tags:
	- DP
---
# dp总结

* 初始化是很重要的

  * 如果是求...  ，  就初始化为0
  * 如果是求... ， 就初始化为maxInf或者

* **<u>阶段和状态</u>**的划分开很重要，都是一个维度。（ 其实这里的stage就是 MDP里面的S~1~，S~2~，... , S~n~ , state就是每个stage具体可以取的值 s ）。一般阶段都是有**<u>顺序性</u>**隐含在内，是事件发生到末端所要经历的必然阶段，状态是这个阶段可以取到的值。再注意，不要把状态 和 我们要求解的值 混肴了。

  很多时候可能大家以为阶段是状态，但其实不是。阶段和状态共同组成我们dp数组的维度，which will be affected by action and transformed to others。举例：

  * [周植：序列型动态规划](https://leetcode-cn.com/circle/article/kQfS5s/)中，阶段是房子的位置，状态是这家房子有没有被打劫。(要打劫整条街，我总得一个一个屋子走过去吧，这就是我要完成打劫这件事所必经的阶段)

  * 01背包中阶段是当前要选择放进去的第i个物品，状态是当前这个阶段，包里容量的可能的大小。

  * [只有两个键的键盘](https://leetcode-cn.com/problems/2-keys-keyboard/solution/dong-tai-gui-hua-xiang-xi-fen-xi-jie-shi-wei-shi-y/)中，阶段是当前有几个A。如果你采用主动转移的思路，那么当前的状态就是当前粘贴板上的A有多少位。

    > dp\[i][j] = dp\[i - j][j] + 1。注意，这里的解法只是比较naive的，进一步是可以状态压缩的。
    >
    > * [ ] ==什么时候可以状态压缩==  应该从式子的转移本身就能看出来

  * 很多时候我们会发现，一个问题也有很多个刻画方式。比如 [打家劫舍：labuladong解法](https://leetcode-cn.com/problems/house-robber-ii/solution/tong-yong-si-lu-tuan-mie-da-jia-jie-she-wen-ti-by-/)中，dp[i]表示的是，不是[周植](https://leetcode-cn.com/circle/article/kQfS5s/)大佬讲解中的任意一种：表示到目前为止打劫到的钱的累积金额( 需要第二个维度进行辅助 ) 或者 到目前位置为止，且打劫当前位置，打劫到的钱的累积金额。不过从前往后累积和从后往前累积实际上是差不多的，我只能说，以我的感觉来说”<u>**从第i个位置开始，且包括第i个位置**</u>“的思路会比较容易理解。(应该会有些场景有区别，目前还没做到相关题目)

    总之，正如[周植](https://leetcode-cn.com/circle/article/kQfS5s/)所说：

    > 状态设计的时候，<u>也会将序列中的位置作为状态表示的一维</u>。例如 dp[i]，而这一维一般来说可以表示这几种信息：
    > * 第 / 前 i 个位置的答案
    > * 前 i 个位置里，第 i 个位置一定选择的答案



> * [ ] **<u>卧槽  ，这里两者存在矛盾哇... 一个说“前xx”的思路的复杂度是O(N^2)</u>**，但labuladong写出来的又没有那么复杂...



## dfs和dp的关系

* [ ] [403 frog jump](https://leetcode.com/problems/frog-jump/submissions/)



# dp分类

* [序列型](https://leetcode-cn.com/circle/article/kQfS5s/) 和 [常见普通题型及状态表示](https://leetcode-cn.com/circle/article/VFZEXA/)  【内含题目和习题】  [周植大佬的博客也不错啊！](https://wnjxyk.tech/117.html)（还有个DP的intro还没来得及看）
  * [ ] 主动转移和被动转移 目前还没有看明白，在后一个blog里面

* [ ] [搜索：犹豫就会败北](https://www.bilibili.com/video/BV1Y7411N7Bn)  万物皆可搜索！

* 线性动规，区域动规，树形动规【打家劫舍Ⅲ】，背包动规【股票交易Ⅳ】四类



# reference

* [周植的博客]()

  > 序列型和升级型的DP的总结，还列举除了不少题目

* [Andrewzdm 的博客](https://www.luogu.com.cn/blog/0408Dodgemin/dp-conceptions)

  > * 阶段和状态的设定必须保证全局唯一（MDP），否则就可以合并。
  > * 将决策写入状态中以消除后效性影响。
  > * 提到了主动状态转移和被动状态转移的区别（大部分题目是没有区别的），并用例子进行了时间复杂度分析。

* zzx的分类列表

  > * [ ] https://www.luogu.org/problemnew/show/P1048 采药（01背包）
  >
  > * [ ] https://www.luogu.org/problemnew/show/P1734 最大约数和（01背包） 【明天把两种筛法都做一下】
  > * [ ] https://www.luogu.org/problemnew/show/P1049 装箱问题（01背包）
  > * 有约束的01背包
  > * [ ] https://www.luogu.org/problemnew/show/P2663 越越的组队（01背包）
  > * [ ] https://www.luogu.org/problemnew/show/P2430 严酷的训练（01背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1926 小书童（01背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1802 5倍经验日（01背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1616 疯狂的采药（完全背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1679 神奇的四次方数（完全背包）
  > * [ ] https://www.luogu.org/problemnew/show/P2918 买干草（完全背包）
  > * [ ] https://www.luogu.org/problemnew/show/P2347 砝码称重（多重背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1910 L国的战斗之间谍（二维背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1507 NASA的食物计划（二维背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1509 找啊找啊找GF（二维背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1855 榨取kkksc03（二维背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1757 通天之分组背包（分组背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1336 最佳课题选择（分组背包）
  > * [ ] https://www.luogu.org/problemnew/show/P1216 数字三角形
  > * [ ] https://www.luogu.org/problemnew/show/P1508 likecloud-吃吃吃
  > * [ ] https://www.luogu.org/problemnew/show/P1115 最大子段和
  > * [ ] https://www.luogu.org/problemnew/show/P1719 最大加权矩形
  > * [ ] https://www.luogu.org/problemnew/show/P3902 递增（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P2782 友好城市（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P1091 合唱队形（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P1020 导弹拦截（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P1233 木棍加工（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P2008 大朋友的数字（LIS）
  > * [ ] https://www.luogu.org/problemnew/show/P1569 属牛的抗议
  > * [ ] https://www.luogu.org/problemnew/show/P1063 能量项链（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1880 石子合并（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P2308 添加括号（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1622 释放囚犯（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P2734 游戏（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1220 关路灯（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1799 数列（区间dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1474 货币系统（计数类dp）
  > * [ ] https://www.luogu.org/problemnew/show/P1192 台阶问题
  > * [ ] https://www.luogu.org/problemnew/show/P2800 又上锁妖塔
  > * [ ] https://www.luogu.org/problemnew/show/P2697 宝石串
  > * [ ] https://www.luogu.org/problemnew/show/P1164 小A点菜
  > * [ ] https://www.luogu.org/problemnew/show/P1057 传球游戏
  > * [ ] https://www.luogu.org/problemnew/show/P1006 传纸条
  > * [ ] https://www.luogu.org/problemnew/show/P2196 挖地雷
  >