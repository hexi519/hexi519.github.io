---
title: tf1.14Notes
tags:
---



# TensorFlow Google深度学习框架笔记

[整体书的框架图](https://raw.githubusercontent.com/seanyuner/tensorflow-tutorial/master/TensorFlow实战Google深度学习框架.svg)

[原书作者的github](https://github.com/caicloud/tensorflow-tutorial)

[后人笔记的github](https://github.com/seanyuner/tensorflow-tutorial)

## 第二章 Tensorflow环境搭建

* [ ] Protocol buffer & Bazel

  > 有用，但是还没来得及看



## 第三章 Tensorflow入门

### 计算模型

* a.graph 查看变量属于的计算图

* 集合(collection)用于资源管理

  ![常用的资源列表](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/04/093411-914993.png)

* with graph as de 作用==?==

* 计算结果不是一个具体数字，而是一个张量的结构

  * **名字**：node:src_output

    > node也有编号，表示是这个图里面的第几个这样的同名节点
    >
    > src_output 表示当前张量来自节点的第几个输出。

    ```python
    # coding=utf-8
    import tensorflow as tf
    
    a = tf.constant([1.0, 2.0, 3.0], shape=[3], name='a')
    b = tf.constant([1.0, 2.0, 3.0], shape=[3], name='b')
    c = a + b
    
    # 通过log_device_placement参数来记录运行每一个运算的设备。
    sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
    # sess = tf.Session(config=tf.ConfigProto(log_device_placement=False))
    print(sess.run(c))
    print(c)
    ```

    将上述代码运行三遍，得到的结果是：

    ```bash
    Device mapping:
    /job:localhost/replica:0/task:0/device:XLA_GPU:0 -> device: XLA_GPU device
    /job:localhost/replica:0/task:0/device:XLA_CPU:0 -> device: XLA_CPU device
    add: (Add): /job:localhost/replica:0/task:0/device:CPU:0
    add_1: (Add): /job:localhost/replica:0/task:0/device:CPU:0
    add_2: (Add): /job:localhost/replica:0/task:0/device:CPU:0
    a: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    b: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    a_1: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    b_1: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    a_2: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    b_2: (Const): /job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022733: I tensorflow/core/common_runtime/placer.cc:54] add: (Add)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022778: I tensorflow/core/common_runtime/placer.cc:54] add_1: (Add)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022799: I tensorflow/core/common_runtime/placer.cc:54] add_2: (Add)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022817: I tensorflow/core/common_runtime/placer.cc:54] a: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022833: I tensorflow/core/common_runtime/placer.cc:54] b: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022849: I tensorflow/core/common_runtime/placer.cc:54] a_1: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022865: I tensorflow/core/common_runtime/placer.cc:54] b_1: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022881: I tensorflow/core/common_runtime/placer.cc:54] a_2: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    2020-10-04 09:55:37.022896: I tensorflow/core/common_runtime/placer.cc:54] b_2: (Const)/job:localhost/replica:0/task:0/device:CPU:0
    [2. 4. 6.]
    Tensor("add_2:0", shape=(3,), dtype=float32)
    ```

    add、a、b、c节点都被创建了三次，在"node"字段里面用下划线表示。最后输出的```Tensor("add_2:0", shape=(3,), dtype=float32)```意思是最后一次创建的c是add操作编号第三个，而第三个c也是这个操作的第零个输出。

  * **变量类型**无法修改

  * **维度**可以修改，但要指定validate_shape=False 

    > 但一般很少见这种用法


### 数据模型

* 会自动生成默认的计算图，但不会有默认的会话

  * eval  指定默认的session后可以获取变量值

    ```python
    # 方法1
    sess = tf.Session() 
    with sess.as default(): 
        print (result. eval ())
        
    # 方法2
    sess = tf. Session()
    ＃以下两个命令有相同的功能。 pr工nt(sess .run(result))
    print(result.eval(session=sess)) 在交互式环境下（比如
    ```

* variable初始化

  * 随机：终于明白了truncated_normal是啥233

    ![image-20201004101529255](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/04/101559-730202.png)

    常用参数 ：mean , stddev , seed 

  * 常数：bias一般用常数

    ![image-20201004101612147](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202010/04/101630-821343.png)

  * 通过其他变量的初始值来初始化新的变量
  
    ```python
    w2 = tf. Variable (weights.initialized_value ()) 
    w3 = tf.Variable(weights.initialized_value()* 2 . 0)
    ```


### 运行模型
* 交互式环境中设置默认会话

  ```python
  sess = tf.InteractiveSession() # 这里也同样可以传入ConfigProto参数
  print(result.eval())	# 构建了默认会话之后，就可以这样使用eval函数了
  sess.close()
  ```

* 常用的优化器 tf.train.xxOptimizer





## 第四章 深层神经网络

### 损失函数

* tf.where &  tf.greater 也都是元素级别的

  ```python
  loss = tf.reduce_sum(tf.where(tf.greater(y, y_), (y - y_) * loss_more, (y_ - y) * loss_less))
  ```

* \* 与 - 都是逐元素的操作，矩阵相乘应该是tf.matmul( a,b )



### 优化函数

* tf.nn.softmax_cross_entropy_with_logits(labels = y, logits =y )
* tf. train.exponential_decay( staircase = )
* tf.contrib.layers.l2_regularizer(lambda)(w)
  * 常见做法（为了防止网络复杂后参数定义和损失分开）@ [](https://github.com/caicloud/tensorflow-tutorial/blob/master/Deep_Learning_with_TensorFlow/1.4.0/Chapter04/3.%20正则化.ipynb) 第三节



### ==TL;DR==滑动平均模型

* tf. train.ExponentialMovingAverage





## 第五章 MNIST数字识别问题

### 变量管理

* get_variable和variable_scope结合使用

	```python
	from tensorflow import variable_scope
	# 共享变量方式一 结合variable_scope使用get_variable
	with variable_scope("foo",reuse=True):
      with variable_scope("bar"):
	        v1 = tf.get_variable("v", [1],initializer=tf.constant_initializer(1.0) )  # initializer参数只是get_variable函数才有的，Variable就是直接传入tf.constant(1.0,[1])
	        print("1:foo/bar reuse:",tf.get_variable_scope().reuse) # ss
	
	with variable_scope("foo"):
	    print("2:foo reuse",tf.get_variable_scope().reuse) #  #
    with variable_scope("bar",reuse=tf.AUTO_REUSE):
	        v2 = tf.get_variable("v", [1])
	        print("3:foo/bar reuse",tf.get_variable_scope().reuse)  ####
	        print(f"v1==v2 is {v1==v2}")
	
	# 方式二 也可以直接通过带命名空间名称的变量名
	with tf.variable_scope("",reuse=True):
	    v3 = tf.get_variable("foo/bar/v", [1])
	    print(f"v1==v3 is {v1==v3}")
	```
	
	得到结果：
	
	``` bash
	1:foo/bar reuse: True
	2:foo reuse False
	3:foo/bar reuse _ReuseMode.AUTO_REUSE
	v1==v2 is True
	v1==v3 is True
	```
	
	* reuse的设置
	  * 不声明的时候默认False，每次声明**不影响下次打开**还是默认为False
	  * 为True，只能获取已存在变量，否则报错 ;  为False，只能创建未存在变量，否则报错
	  * 所以经常是第一次创建的时候不声明，之后都要显式声明为True
	    * 常见的解决方案是设置为tf.AUTO_REUSE，代码更具有泛化性
	* variable_scope会影响变量的前缀名--> 创建了命名空间
	
	* [ ] 目前的疑惑是：为何上述代码v3如果不在一个命名空间里面去调用tf.get_variable("foo/bar/v", [1])会报错，但是明明这个命名空间和target的也是不相关的啊...不是很懂why。回头再了解下variable_scope的原理好了



### 模型持久化

* tf.train.Saver()
  * 文件结构
    * model.ckpt.meta  计算图结构
    * model.ckpt  每个变量的取值
    * checkpoint  一个目录下所有的模型文件列表 ==？？？还是没懂这三个文件的区别==
  * save() , restore(dict)  , import_meta_graph
    * 使用dict方式加载部分参数，对于滑动平均类很好 ==tl;dr==
  * convert\_variables\_to\_constants
    * 可以设置一些变量为常数，这样就能保存在一个文件中了，迁移学习中常用==tl;dr== 

* 持久化原理及数据格式==tl;dr==   ...讲得还蛮多的...

  可以看下b站这个[教程](https://www.bilibili.com/video/BV11741137uq?from=search&seid=6929524925462338717),which 就是按照这本书来的



### 实战例子

* 回头把tf2看完以后可以再看看这个 要不要好好学习下设计原理 （觉得大概率不要
  * 其实里面一些细节设计感觉很巧妙，比如infer和我们想的eval不是一回事儿，是作为train的一个part服务的，还有在infer文件中提到，只在同一个文件中调用一次就不需要reuse=True其实还没有很理解



## ==有空再看== 第六章 图像识别与卷积神经网络



## ==有空再看== 第七章 图像数据处理

* [ ] TFRecord
* [ ] ......



## ==没有讲得很清楚== 队列和多线程

* 队列和op一样，也是graph上的节点

* 两种队列
* 两个协助类
  * tf.Coordinator 使多个线程同步结束
  * tf.train.QueueRunner启动多个线程来操作同一个队列
  * tf.train.add_queue_runner( queue , collections=tf.GraphKeys.QUEUE_RUNNERS ) 



### ==有用== 数据集的基本使用方法 Dataset

shuffle , batching ,repeat

#### ==有用== 数据集的高层操作





## 第八章 循环神经网络

* tf.nn.rnn_cell

  * BasicLSTMCell

  * MultiRNNCell 

  * DropoutWrapper

    * [ ] RNN的Drop有些讲究，which can refer [SO的这个问答](https://stackoverflow.com/questions/52373204/how-to-use-dropout-in-rnn-correctly)这个博客 : [解读tensorflow之rnn](https://blog.csdn.net/mydear_11000/article/details/52414342) ==两篇文章里面的友链质量都比较高啊==

      > SO的回答表示RNN的dropout应该放在cell内部，但是第二个博客是以下观点(并没有强调说是cell内部，which我觉得跟CNN的dropout有啥不同呢...)：
      >
      > Dropout只能是层与层之间（输入层与LSTM1层、LSTM1层与LSTM2层）的Dropout；同一个层里面，T时刻与T+1时刻是不会Dropout的。
      >
      > 一般放在输出层之前

      dropout的Bernell表示方法要搞清楚，可以看看这个[机器之心：dropout的前世今生](https://zhuanlan.zhihu.com/p/66337970)

* 用zero_state方法初始化

  * tf.nn.rnn_cell 的类都可以（BasicLSTMCell，MultiRNNCell 都行，后者的初始化参数还是前者的堆叠呢）

* train的时候optimize_loss函数的参数还有global_step= tf.train.get_global_step() , which优化器函数会自动帮我们把传入的参数在每个time_step自增

* [ ] p232 lstm的输入难道不应该是h_t-1和x_t结合的结果么，怎么连c_t-1也进来了



* [ ] [这篇博客讲得很好](https://blog.csdn.net/mydear_11000/article/details/52414342)，也给了很多友链，which



## 第九章 自然语言处理

## ==有用== 语言模型的背景知识

> 回头再看下

* 传统语言模型的缺点

* 语言模型的指标--复杂度 的计算

  

## 神经语言模型

### PTB数据集

* 基本神经模型

* seq2seq



### ==！！==注意力机制

* 使用attentionWrapper




## ==tl;dr== 第十章 Tensorflow高层封装

* TensorFlow-Slim 比较早，常用于图像识别，就是模型定义比较简洁，包含了不少已经开源的网络

Keras 、Estimator 、TFLearn，都是主要针对模型训练和模型定义进行了API封装，使得代码简洁

> Keras 和 Estimator 都己经加入了 TensorFlow 代码库，而且它们是使 用最为广泛的 TensorFlow 高层封装 ; TFLearn则需要单独安装



## keras使用

* 基本
* 高级



## Estimator使用

* 基本
* 高级



# ==! ! 相当有用== 第十一章 Tensorboard可视化





# 第十二章 Tensorflow计算加速




# API

* session

  * [关于ConfigProto的配置讲的很详细](https://zhuanlan.zhihu.com/p/28083241)

    * pre_process_gpu_memory_fraction
    * allow_growth
    * allow_soft_placement
    * log_device_placement

    > 上述的默认都是False

  * 





# 遇到的问题及解决
* [x] jupyter中无法输出正常运行python文件的INFO和WARNING，session设置了log_device_placement=True也没有输出

  > 安装[wurlitzer](https://github.com/minrk/wurlitzer)，将C的输出捕获重定向（ 仅需一行代码即可

* [ ] 惊讶地发现这段代码被调用多少次，如果没有释放，就会出现多少个node，而不会覆盖

  所以每次要记得sess.close()是么？

  ```python
  # coding=utf-8
  import tensorflow as tf
  
  a = tf.constant([1.0, 2.0, 3.0], shape=[3], name='a')
  b = tf.constant([1.0, 2.0, 3.0], shape=[3], name='b')
  c = a + b
  # 通过log_device_placement参数来记录运行每一个运算的设备。
  sess = tf.Session(config=tf.ConfigProto(log_device_placement=True))
  print(sess.run(c))
  ```

  可是为何这样也没有释放资源...

  ```python
  # coding=utf-8
  import tensorflow as tf
  
  a = tf.constant([1.0, 2.0, 3.0], shape=[3], name='a')
  b = tf.constant([1.0, 2.0, 3.0], shape=[3], name='b')
  c = a + b
  
  # 通过log_device_placement参数来记录运行每一个运算的设备。
  # sess = tf.Session(config=tf.ConfigProto(log_device_placement=False))
  with tf.Session(config=tf.ConfigProto(log_device_placement=True)) as sess:
      print(sess.run(c))
      print(c)
  ```

  



* [ ] QOS & DSCP









# 之前琐碎的学习

* [x] tf的session和graph关系

  > refer @ [this blog](https://www.jianshu.com/p/5092d994573e) ，没看完，但是==回头要深入看下==，这篇本身讲得也很好

  * graph只是一个画图者，session是执行者，每个session都会占用一定资源和上下文（比如CPU/GPU），一个graph可以在多个session中运行，且一个session不一定要运行整个graph
  * 一个session相当于一个线程，with Sess.session().as_default()实际上就是创建了一个新线程，然后指定这个线程的主session是当前session

* add assign ,inplace?  a=a+1和 a= a.add(1) 有什么区别

  * python中普通的数据结构的操作是inplace的，复杂一点的就不是。

    * [ ] 这里需要再好好查阅下python的工具书，重点看深浅拷贝那里

  * 如果是tf的操作，普遍都是inplace的 

  * [x] [这个博客](https://www.jianshu.com/p/8e45549db258)讲得最好

    * tf的操作都会返回图上的一个节点（tf中点是op,边是flow的tensor）

      > ​	请注意区分tf.Tensor和Tensor的概念
      >
      > ​	tf.Tensor并不存储值，它只是数据流图中的节点，它表示一个计算，这个计算会产生一个Tensor
      >
      > ```python
      > a = tf.constant(3.0, dtype=tf.float32)
      > b = tf.constant(4.0) # 也是tf.float32，通过4.0推测出来的类型。
      > total = a + b
      > print(a)
      > print(b)
      > print(total)
      > ```
      >
      > ​	它的运行结果为：
      >
      > ```python
      > Tensor("Const:0", shape=(), dtype=float32)
      > Tensor("Const_1:0", shape=(), dtype=float32)
      > Tensor("add:0", shape=(), dtype=float32)
      > ```
      >
      > ​	print a,b和c并不会得到3,4和7。这里的a,b和c只是Graph中的Operation，执行这些Operation才会得到对应的Tensor值。

    * a = a+1

    * [x] 搞懂后觉得很扯淡（本来返回的就是Op而不是数据），还是看[StackOverflow](https://stackoverflow.com/questions/45779307/difference-between-tf-assign-and-assignment-operator)的第2个答案吧 , which有个图比较好理解。突然觉得assign是个很危险的操作，毕竟是有副作用的

    * [ ] 需要整理下
      * tensorboard图的理解
        * refer
          * [ ] 这个[博客](https://blog.csdn.net/qq_33039859/article/details/80277379)很好，which还有一小部分关于开销的还没有看
          * [x] [Tensorboard的使用图graph](https://www.hotbak.net/key/Tensorboard的使用图graph.html)
        * 虚线和实线箭头的区别（依赖关系和数据流向）
        * 实线和虚线框的区别（普通计算节点和high-degree节点,which will被放在从属区）
        * 黄线和灰线的区别（黄线就表示有副作用）
        * 少用assign( ? )
        * 使用上面那个代码试试，每次w变化之后，在重新print(w) 看看操作符后面的数字会不会有变化，which我现在猜测的含义是当前节点存储的数值大小

* get_variable 与 Variable区别
  * movan有[说明](https://mofanpy.com/tutorials/machine-learning/tensorflow/scope/)
  * get_variable 方便用于共享变量，which 大家都不是很赞成的样子

