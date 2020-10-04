---

title:  python总结

top:  false

cover: false

toc: true

mathjax: true

date: 2020-08-08 17:35:17

categories: Summary

description: 关于python的总结

tags:

   - Language
---


# 深浅拷贝

* 说千道万，不如[画图实在](https://www.bilibili.com/video/BV1cc411h7hd?from=search&seid=1791841689049102336)
* [函数传参，传的是引用](https://www.cnblogs.com/loleina/p/5276918.html)
	> Python参数传递采用的肯定是“传对象引用”的方式。这种方式相当于传值和传引用的一种综合。如果函数收到的是一个**可变对象（比如字典或者列表）**的引用，就能修改对象的原始值－－相当于通过“传引用”来传递对象。如果函数收到的是一个**不可变对象（比如int、str或者tuple**）的引用，就不能直接修改原始对象－－相当于通过“传值'来传递对象。 
	>
	> >  注意，tuple本身不可变，但是tuple里面的元素可变


# 闭包 & nonlocal

* [nonlocal](nonlocal)
* [闭包](https://segmentfault.com/a/1190000004461404)
	* 其中几个作用：节省开销，将函数与某个参数绑定
	* 装饰器就是一种闭包
	
	


# subprocess
可以参考[这个](https://blog.csdn.net/a464057216/article/details/47355219)



# joyful pandas

> pandas的一些少见的注意事项，具体代码和例子来源于datawhale的[Joyful-Pandas系列](https://nbviewer.jupyter.org/github/GYHHAHA/Joyful-Pandas/tree/master/)

### 1.基础
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
* []的索引方式中，比较灵活。有几种方式：
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
> <img src="https://img-blog.csdnimg.cn/20190930150818814.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMzQ3ODY5,size_16,color_FFFFFF,t_70" alt="在这里插入图片描述" style="zoom:67%;" />



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
  fig, axes = plt.subplots(1, 2, figsize=(6,3))
  
  # plot data
  axes[0].plot(A,B)
  axes[1].scatter(A,C)
  
  ```

  > 用 `subplots` 创建一个画板，同时也创建了一个绘图子区域 `axes`。画板赋值给了 `fig`，绘画子区域赋值给了 `ax`。这样一来，所有 `fig.***` 都是对整个画板进行操作，所有 `ax.***` 都是对这个 Aexs 子区域进行操作。

* **fig.xx 如果用于处理ax内部的属性，比如轴的刻度范围之类的，其实都是对ax.xx的api的封装**，所以掌握ax.xx才是王道 和 最正确的方式

