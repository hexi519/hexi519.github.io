---
title:  python总结
top:  false
cover: false
toc: true
mathjax: true
date: 2020-08-08 17:35:17
categories: Summary
description: python代码和细节的总结
tags:
   - Language
---


# 深浅拷贝

* 说千道万，不如[画图实在](https://www.bilibili.com/video/BV1cc411h7hd?from=search&seid=1791841689049102336)
* [函数传参，传的是引用](https://www.cnblogs.com/loleina/p/5276918.html)
	
	> Python参数传递采用的肯定是“传对象引用”的方式。这种方式相当于传值和传引用的一种综合。如果函数收到的是一个**可变对象（比如字典或者列表）**的引用，就能修改对象的原始值－－相当于通过“传引用”来传递对象。如果函数收到的是一个**不可变对象（比如int、str或者tuple**）的引用，就不能直接修改原始对象－－相当于通过“传值'来传递对象。 
	>
	> >  注意，tuple本身不可变，但是tuple里面的元素可变

* [ ] 一些常用的基本操作哪些是深/浅拷贝？tf里面呢？



# 闭包 & nonlocal

* [nonlocal](nonlocal)
* [闭包](https://segmentfault.com/a/1190000004461404)
	* 其中几个作用：节省开销，将函数与某个参数绑定
	* 装饰器就是一种闭包
	



# python,numpy,pandas 切片&索引

* python ( list ) 支持的索引 和 np数组支持索引的区别

  ```bash
  >>a[1][1]	# 索引
  5
  >>a[1]
  [4,5,6]
  >>a[1][:]	# 也支持切片
  [4,5,6]
  >>a[1,1]"""相当于a[1,1]被认为是a[(1,1)],不支持元组索引"""
  Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
  TypeError: list indices must be integers, not tuple
  >>a[:,1]
  Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
  TypeError: list indices must be integers, not tuple
  ```

  **<u>只支持 listData\[ Idx_in_x ]\[ Idx_in_y ][ Idx_in_z ]的索引操作</u>** --》 先取出第一个维度的元素，然后再取出内部一个元素，再再再取出其中一个元素，像拆包一样。

  numpy不仅支持上述操作，更支持多维度上更便捷的索引方式

  我的理解是，索引就是select出到单个元素，切片是给出一个数组的子集

  ```python
  listData=[ [1,2,3],[1,2,3],[1,2,3] ]
  npData = np.array( listData )
  
  listData[1][2]  # 索引操作，select出单独的元素
  listData[1][:]  # 索引+切片
  listData[1,2]	# list不支持这种索引方式
  
  npData[1][2]	# list能支持的我也能！
  npData[1][:]	# list能支持的我也能！
  npData[1,2]	# 我还能！在多维的索引上，np更方便!
  npData[1,:]	# 我还能！在多维的索引上，np更方便!
  
  # 当维度一旦多起来，少打几个中括号还是很可观的
  # 而且，还有这种情况：我想要1、3列的第2个元素
  listData[0,2][1]	# 当然错误，listData[1,3]都无法支持更别说listData[1,3][2]了
  	# 但是np可以这样"稀疏检索"(我自己发明的词汇)
  npData[0,2][1]	# 但是这样是错误的，因为npData[1,3]是一个具体的元素
  npData[ [0,2],1 ] # 这样才是对的
  ```

  * 另外要注意的是：**<u>np数组返回的都是视图</u>**，除非具体到某个元素，否则修改视图的内容，原内容都会变。但是list<u>切片索引</u>返回的就是一份复制的。

    > * [ ] 这里其实有点迷糊了，尤其是下面的例子，为何listData\[1][:]就是浅拷贝，npDatap\[1][:]就是深拷贝...==要查下 "numpy视图和副本"相关的理解下...==

  ```bash
  >>> listData=[ [1,2,3],[1,2,3],[1,2,3] ]
  >>> npData = np.array( listData )
  >>> a = listData[1]	# 这样是会改变的，返回的是数组对象的引用
  >>> a[2]=8
  >>> listData		
  [[1, 2, 3], [1, 2, 8], [1, 2, 3]]
  >>> b = listData[1][:]	# 这样是不会改变的
  >>> b[2]=9
  >>> listData		
  [[1, 2, 3], [1, 2, 8], [1, 2, 3]]
  
  >>> c = npData[1][:]	# numpy无论如何都会改变原数据的
  >>> c[2]=11
  >>> npData		
  [[1, 2, 3], [1, 2, 11], [1, 2, 3]]
  ```

* [ ] ==np索引和pandas索引的区别==

  > 看到一个似乎不错的reference：[ndarray对象和pandas中DataFrame对象的索引方法及对比](https://blog.csdn.net/S_o_l_o_n/article/details/80875804)
  >
  > 目前能得到的结论就是 pandas的DataFrame尽量用iloc的方式去索引

* [切片索引、布尔索引、花式索引](https://blog.csdn.net/dake13/article/details/81302450)

  * 切片是快照，会改变原本元素，但是布尔和花式就不会

  ```python
  a = np.arange(15).reshape(5,3)
  print(a)
  # 切片	
  b1 = a[:2,2]
  # 布尔索引
  mask = a2<5
  b2 = a2[mask]
  # 花式索引
  b3 = a3[[0,1],[1,3]]
  ```

  * [多维度的花式索引](https://blog.csdn.net/lanxiuting1993/article/details/103255293)的写法和含义

    > * 一维的切片和索引差不多
    >
    > * 二维的： array[ [ Idx_in_x ],[ Idx_in_y ],[ Idx_in_z ] ]	# 当Idx不是一个集合，是单个元素的时候，就可以省略中括号  
    >
    >   > array[ [ 1 ] ,[ 2 ] ,[ 3 ] ]  -->  array[ 1 ,2  ,3  ] 
    >
    >    * 请区分array\[ \[ 0,1] ]  和 array\[ 0, 1]   **# 两个方括号是代表选取行数 要跟前面的[0,1] 区分开**
    >    * array[[1, 3,0], [1, 2,0]] 	**# 获取索引为(1,1)和(3,2)和(0,0)的元素**
    >
    > * 三维的：array[[0,0],[1,1],[2,2]]

  * 




# subprocess
可以参考[这个](https://blog.csdn.net/a464057216/article/details/47355219)



# joyful pandas

> pandas的一些少见的注意事项，具体代码和例子来源于datawhale的[Joyful-Pandas系列](https://nbviewer.jupyter.org/github/GYHHAHA/Joyful-Pandas/tree/master/)

### 1.基础操作
* df.value_count()
* df.unique()
* df.nunique()
* df.describe()的一些用法
    * 可以自行选择分位数 df.describe(percentiles=[.05, .25, .75, .95])
    * 非数值型也可以用describe函数

![image-20200826112844748](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202008/26/112845-885917.png)

* 还有一些练习题，也可以做下


### 2. 索引
* 函数式索引 & 布尔索引
* **loc**可以接收整数或整数列表或布尔列表以及Series，而**iloc**中接收的参数只能为整数或整数列表或布尔列表，不能使用布尔Series，如果要用就必须使用.values()把dataframe里面的列表拿出来
* 索引不要用浮点数，否则在切片索引的时候，[2: ]就表示的不是索引的下标从第二个开始了，而是用比大小的方式去看哪些行的索引值比2大，都拿出来
* [ ]的索引方式中，比较灵活。有几种方式：
    
    * 索引index：
        1. data[3:5] 数字的话，就是索引行的绝对位置，就算index也是数字，也不要混淆啊！
            * 这个和data.iloc[3:5]效果是一样的(Series和DataFrame都适用)
            > tip: loc和iloc其实都是二维的，如果只写了一个维度，就是指的index
            
            * 对于Series来说，这个和data[data.index[3:5]]效果是一样的（但是DataFrame就会报错的）
        2. 如果index也是数字，想要索引对应于某个数值的index怎么办？(比如索引index为33的那一行)
            data[data.index.get_loc(33)]
    * 索引column：
        如果index是str类型，data["label"]默认也是索引column（最标准的写法还是loc[:,"label"]）
    
        > 注意，我个人测试的时候loc对于Series也是不会报错的，但是我还是不建议。因为容易混肴，Series没必要用loc，具体的含义我也搞不清楚
    
* [快速标量索引]:当只需要取一个元素时，at和iat方法能够提供更快的实现
> 看到区间索引，其实目前觉得差不多了。没必要再学更多了



# 画图

## 代码展示（主要使用axex操作）

[my codes on github](https://nbviewer.jupyter.org/github/hexi519/CodesSnippets/blob/master/pythonDemo/matplotlibConfig.ipynb)

## 概念介绍

> 所有高级的api，包括seaborns在内，都是基于最基本的matplotlib开始的，那么一定都得先搞清matplotlib的基本概念（ax和fig等）

<img src="https://img-blog.csdnimg.cn/20200311202147484.png" alt="在这里插入图片描述" style="zoom:67%;" />



* 每一次subplot动作都是独立的

> ```python
> import matplotlib.pyplot as plt
> fig = plt.figure(num='panel', figsize=(8,4),facecolor='gray')
> # 绘制两个不同大小的区域
> plt.subplot(1,3,1) # 划分1行3列，第1个子区域
> plt.subplot(1,2,2) # 划分1行2列，第2个子区域
> plt.show()
> ```
>
> 其实把每一次 `subplot` 动作看作是独立的就行了，第一次将整个画板划分为1行3列完全不影响第二次划分为1行2列，它们仅影响当前划分后子图的大小。
>
> <img src="https://img-blog.csdnimg.cn/20190930150818814.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMzQ3ODY5,size_16,color_FFFFFF,t_70"  />



* 添加子图

  ```python
  ######## 使用figure + addsubplot ########
  fig = plt.figure()
  ax1 = fig.add_subplot(221)
  ax2 = fig.add_subplot(222)
  ax3 = fig.add_subplot(212)
  
  ######## 使用figure + subplot ########
  fig = plt.figure(num='panel', figsize=(8,4),facecolor='gray')
  # 划分三个小区域，绘制出第一个和第三个区域
  plt.subplot(1,3,1)  # 划分1行3列，第1个子区域  
  plt.subplot(1,3,3)  # 划分1行3列，第3个子区域
  plt.show()
  	# 注意，这里是plt.subplot而不是fig.add_subplot，which让我感到奇怪，但是先记住吧
      
  ######## 使用subplots,which是最常用的 ########
  fig, axes = plt.subplots(1, 2, figsize=(6,3))  # 不仅会出现一个新的axes对象，还会创建一个新的fig对象，which the axes belongs to
  
  # plot data
  axes[0].plot(A,B)
  axes[1].scatter(A,C)
  
  ```

  > 用 `subplots` 创建一个画板，同时也创建了一个绘图子区域 `axes`。画板赋值给了 `fig`，绘画子区域赋值给了 `ax`。这样一来，所有 `fig.***` 都是对整个画板进行操作，所有 `ax.***` 都是对这个 Aexs 子区域进行操作。

* **fig.xx 如果用于处理ax内部的属性，比如轴的刻度范围之类的，其实都是对ax.xx的api的封装**，所以掌握ax.xx才是王道 和 最正确的方式

