---
top: true
cover: true
mathjax: true
title: dpSummary
date: 2020-12-05 13:21:13
categories: Algorithm
description: leetcode上dp问题的汇总和小总结
tags:
	- DP
---

# 题目总结

*  打家劫舍系列


* 403Frog Jump 青蛙过河

  > [官方讲解](https://leetcode-cn.com/problems/frog-jump/solution/qing-wa-guo-he-by-leetcode/)还是很靠谱的！思路从易到难
  >
  > * 动态规划+哈希表优化
  > * 可行性问题，而不是求最优解问题
  >

  ​	最简单的能想到的就是 dp\[stone][action]，其中stone和action都是 [1:max(stones)] , 因为我们在某个stone处，其实我们也不知道前面一步具体是多少。这个的问题是，直接out of memory。把dp矩阵打印出来也可以发现大部分都是False，which means是稀疏矩阵。也就是说我们的阶段和状态定义的不好。

  > 太可怕了，这个一开始的想法也太愚蠢了吧...

  ​	我们的阶段实际上就只有stones数组里面的几个数值，并不是连续值，所以阶段就是[stone in stones]。紧接着就是action的设计考量：

  * [想法1](https://blog.csdn.net/da_kao_la/article/details/105176065)

    ​	action实际上不会超过1100（每步只会增加1，一共最多输入1100个数，还包括0）。但这个想法就是有点浪费空间，因为还是很多action是取不到的。。 但这里的更新方式就比较值得玩味了，是

    ```for i in range(len(stones)): for j in range(len(i)+1)```

    , 而不是常规的

    ```for i in range(len(stones)): for j in range(action_lens)```,

    所以就比较难想。但是如果按照常规的for循环更新，就会设计到查找的优化。下文会体现。

    

  * 想法2

    ​	一个地方只能从前面的某个石子跳过来，which means也不是连续整数值可选，所以其实也只有O(num(stones))的可选项。所以又回到打家劫舍的问题的里面去了： 前i个stone，所以设计为dp\[stone][stone]表示的就是从stone_idx2跳到stone_idx1是否可行。如下，但是每次状态转移，需要搜索stones的list( O(n) )，最后就是**<u>O(n^3)</u>**的复杂度了--> O(10\^9)直接超时。（可以用一些小trick优化到O(n^2）（[version2](https://github.com/hexi519/leetcode_prac/blob/666e94e8c76107980729f0b23a9e621f77671dfb/403FrogJump.py#L39)）,但可以看到由于常数项比较大，还是跟下面常用方法2，也就是version3差了不少。)

  

  **<u>改进思路： 降低查找的复杂度</u>**

  * [ ] [常用方法1](https://leetcode.com/problems/frog-jump/discuss/223586/Python-solution)：二分搜索，**<u>O(n^3) --> O(n^2*logn)</u>**

  * [常用方法2](https://github.com/hexi519/leetcode_prac/blob/666e94e8c76107980729f0b23a9e621f77671dfb/403FrogJump.py#L65)：使用额外的、低查找开销的数据结构存储经常要查找的东西。这里使用hashMap存储可用的action, 所以每次就不是搜数组，而是搜一个集合，且由于只存前一步可达的，也就是有效的action，所以相当于剪了很多枝。O(n\^3)-->O(n^2)，且前面的常熟会比较低


