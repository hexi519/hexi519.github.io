title: gcc链接梳理
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-18 22:34:22
categories: Summary
description: 动态链接和静态链接
tags:

    - Compilation and Link

# 基础知识
## reference
* [这个博客](https://blog.csdn.net/u010935076/article/details/51374388)写的很全
  
* 程序员的自我修养
  
    > 相关内容，自己的博客上有总结其中几章
    >
    > * [chapeter 6 可执行文件(.o)及动态链接(.a)的装载与进程](https://blog.csdn.net/Hesy_H/article/details/101105573)
    >
    > * [chapeter 8 Linux共享库(.so)的组织](https://blog.csdn.net/Hesy_H/article/details/101119696)
    >
    >   > 主要讲了一些补充的、正交的 加载相关的环境变量，方便debug编译和链接过程

## nm命令  --  查看二进制和符号表的利器

> 其实还有很多常用的用来读库文件的命令，比如objdump ， readelf ,  这里不过是因为nm比较通用，所以重点介绍一下（其实觉得objdump可以出更多的信息的） 

* nm -g --defined-only libxxx.a # -g 查看外部符号表 ，也是--extern-only
	
	><img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/18/224322-528256.png" alt="image-20200918224319703" style="zoom: 67%;" />
	
	会把.a文件是从**哪些.o文件**中打包过来以及**对应吸收了哪些符号**都标清楚。



## .a(libxxxx.a)[archive]和 .so(libxxxx.so.major.minor) [shared object]的区别

### **生成**

1. 生成**静态库**使用ar工具，其实ar是archive的意思
```bash
ar cqs libhello.a hello.o
```
​	静态库与汇编生成的目标文件一起链接为可执行文件，那么静态库必定跟.o文件格式相似。其实一个静态库可以简单看成是**一组目标文件**（.o/.obj文件）的集合，即很多目标文件经过压缩打包后形成的一个文件。（这里cqs是静态库的名称，别搞混了）

2. 生成**动态库**用gcc来完成，由于可能存在多个版本，因此通常指定版本号：
```bash
# 第一步
g++ -fPIC -o DynamicMath.o DynamicMath.cpp

# 第二步
g++ -shared -o libhello.so.1.0 DynamicMath.o

# 合起来就是
g++ -fPIC -shared -o libhello.so.1.0 DynamicMath.o.cpp
```
* -shared: 表示生成的是动态链接库

  -fPIC: 生成位置独立的代码，用于编译共享库。在任意内存空间都可以被加载

  -Wall: 生成所有警告信息

  前两个是必加的参数，最后一个有时候会加



### **查看**

* **查看静态库包含了哪些.o文件也很简单**：

    * nm -g 命令 （上文） 还会列出符号表 
    * ar -t llibxx.a  ( display a <u>table</u> listing contents of the archive )

   > <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/18/230631-588422.png" alt="image-20200918230630480" style="zoom:67%;" />

* 查看**动态库**包含了哪些文件

  * 目前没有找到办法查看，只能使用**nm -D xx.so**的方式去查看动态库的动态符号表

    * 注意，nm的-D参数只对动态库有效

      

### **调用** --》被载入的时刻不同 [**最主要的区别**在于此]

* 静态库的代码在编译过程中已经被载入可执行程序，因此体积较大

* 共享库(动态库)的代码是在可执行程序运行时才载入内存的，在编译过程中仅简单的引用，因此代码体积较小。
* 共享库(动态库)的好处是，不同的应用程序如果调用相同的库，那么在内存里只需要有一份该共享库的实例。【这就是共享库诞生的原因之一，另一点就是静态库需要全量更新，但是动态库只需要增量更新】



* **调用命令** 都是一致的

  gcc -L紧跟目录名字 -l紧跟库名字, e.g. 

  ```bash
gcc -o hello main.c -L. -lmyhello
  ```
  
  > -L表示搜寻库的目录，-I表示依赖库的名称（这里是L的小写，表示lib）。这个应该都知道把...
>
  > -I（这里是i的大写）（inlcude的意思） 这里用不到，但是也经常用，就直接补充下把，是头文件(.h)所在的路径  

  * 请注意，==-lxx一定要写在最后面==，因为gcc的命令是从左到右执行的，被依赖项得放在右边，因为是先解析main.c然后看到里面有一些外部的符号，which是在myhello这个库里面的，然后就往右边解析去寻找这个符号

    * 为什么这么做就很明了， 按需取你需要的符号，which means 没必要把整个myhello库都加载进内存或者集成到最终的hello可执行文件中

    * 如果有循环依赖( libA.a<-->libB.so )，那么也要反复写依赖库， which means要写成gcc -IA -IB -IA
  
  * > gcc -lmath -c test.cc -o test.o  **[ x ]**
      > gcc -c test.cc -o test.o -lmath  **[ √ ]**
  
  * 动态静态库都存在的时候，优先使用.so文件（毕竟动态库开销小、跨平台）
  
    > 如果想链接的就是动态库的话，就用如下参数：-WI,-Bstatic
    >
    > 关于WI参数和Bstatic的用法，可以参考[这个回答](https://www.zhihu.com/question/22940048)
    >
    > 进一步，使用WI指定链接的soname可以参考[这个](https://blog.csdn.net/wang_hufeng/article/details/53899120)
  
  * 动态库链接和运行时加载的过程是分开的，所以有时候链接的时候成功了，但是运行起来还是会报找不到符号表的错误
  
    ```bash
    -LsoLibPath  # 链接时的路径
    -WI,rpath=soLibPath  # 链接时指定的参数，用于运行时加载的路径
    ```
  
    

### 链接时的默认搜索顺序、搜索路径

#### 静态库 

搜索顺序：

1. GCC命令中的参数 -L

 	2. gcc的环境变量LIBRARY_PATH
 	3. 内定目录 /lib /usr/lib /usr/local/lib 这是当初compile gcc时写在程序内的



#### 动态库

1. GCC命令中的参数 -L

2. 环境变量LD_LIBRARY_PATH指定的动态库搜索路径

3. 配置文件/etc/ld.so.conf中指定的动态库搜索路径

4. 默认的动态库搜索路径 /lib 和 /usr/lib

   > /lib 或 /usr/lib（64位系统下为/lib64 /usr/lib64）路径下的共享库比较特殊。 
   >
   > a) 它是默认的共享库的搜索路径。 
   >
   > b) 它没有放到/etc/ld.so.conf 文件中。但是在/etc/ld.so.cache 的缓存中有它。 
   >
   > c) 其路径下的共享库的变动**即时生效**，不用执行ldconfig。就算缓存ldconfig -p 中没有，新加入的动态库也可以执行。



### 小总结

* 其实会发现，路径的配置都是遵循着一个从小到大，从内到外的顺序（就跟局部变量和全局变量一样）



## ldconfig  

==注意，这是针对**动态库**的**加载时路径**的配置，**和编译的路径无关**==

* /etc/ld.so.conf 是指定动态库搜索路径的一个配置文件

  > 一般cat出来，里面的内容就是：```include /etc/ld.so.conf.d/*.conf```
  >
  > 这意味着，具体的动态库搜索路径还是由/etc/ld.so.conf.d里面的conf文件决定，简单看下这个文件夹里面有些什么：
  >
  > ![image-20200924172715424](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/24/172716-465653.png)

* /etc/ld.so.conf.d

  简单看下这个文件夹里面有些什么：

  ![image-20200924172715424](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/24/172716-465653.png)

  实际上这是各个安装文件在安装时会自带的config文件，所有的配置集合最终会在ldconfig.so.cache里面存放

  所以**一般安装完一个文件**，都会在ldconfig.so.conf.d文件夹里面更新相应的xx.config文件，这时候**要使用ldconfig命令进行对ldconfig.so.cache文件的更新**，which work according to ldconfig.so.conf , which will traverse ldconfig.so.d recursively to get the \*.so/\*.a files and record into teh cache file.

* 程序运行时加载库的时候，最终就是从**ldconfig.so.cache**这个文件里面去找

  > 这是一个二进制文件，没法直接查看，但是可以通过ldconfig -p去查看

* **ldconfig**

  * 当把库安装在/lib或者/usr/lib等默认的搜索路径以后，需要手动修改ld.so.conf文件添加对应路径，然后再调用ldconfig去更新cache文件

    * 注意，有root权限才可以修改ld.so.conf以及调用ldconfig进行对/etc/ldconfig.so.cache的更新

  * 没有root权限的时候就是采用修改环境变量LD_LIBRARY_PATH的方式 或者 编译时候添加参数( -WI,rpath=xxx )  

    > ```
    > rpath -- running path
    > Wl 的l 代表的是把后面的数传递给链接器(ld) 
    > ```

    * 注意，添加-L编译参数的方法属于链接路径，ldconfig管的是加载时路径，这两个不要混肴了
    * -WI参数和-Xlinker参数的区别可以看[这个博客](https://www.cnblogs.com/rickyk/p/4186902.html)

  * 其他参数

    ```bash
    ldconfig -p 查看共享库的缓存内容 ( print ld.config.cache )
    ldconfig -n 在当前文件夹下创建软链接，后面编译链接的时候还得加个-L路径参数指向这个文件夹
    ldconfig主要的作用是根据/etc/ld.so.conf 的内容，查找内容中所包含目录下实际的动态库文件，生成搜索共享库的缓存文件/etc/ld.so.cache
    ```



### 小心得

* 安装完新的库之后，不管三七二十一，ldconfig一下

* 一开始我很好奇为什么要引入一个/etc/ld.so.cache，搞得那么麻烦。看到有资料是这么说的：

  > linux下的共享库机制采用了类似于高速缓存的机制，将库信息保存在/etc/ld.so.cache里边



## ldd (ld dependency)

* [x]  [ldd原理介绍](https://www.cnblogs.com/sddai/p/10397510.html) （最下方） 

例子：

ldd /usr/bin/passwd  得到返回：

```bash
NTP-slave:/usr/local/openssl/lib 
linux-vdso.so.1 =>  (0x00007fff15dff000)
libpam.so.0 => /lib64/libpam.so.0 (0x00007fce5eb4b000)
libldap-2.4.so.2 => /usr/lib64/libldap-2.4.so.2 (0x00007fce5e901000)
        ...省略...
libcrypto.so.0.9.8 => /usr/lib64/libcrypto.so.0.9.8 (0x00007fce5cefc000)
/lib64/ld-linux-x86-64.so.2 (0x00007fce5f1a3000)
libz.so.1 => /lib64/libz.so.1 (0x00007fce5cce5000)
```

第一列：程序需要依赖什么库
第二列: 系统提供的与程序需要的库所对应的库
第三列：库加载的开始地址

通过上面的信息，我们可以得到以下几个信息：
1.通过对比第一列和第二列，我们可以分析程序需要依赖的库和系统实际提供的，是否相匹配
2.通过观察第三列，我们可以知道在当前的库中的符号在对应的进程的地址空间中的开始位置
如果依赖的某个库找不到，通过这个命令可以迅速定位问题所在

* 是一个脚本而不是程序



# 待整理

* [符号表的含义](http://www.jeepxie.net/article/884560.html)  & [还有这个](https://www.cnblogs.com/liuyanygz/p/5536607.html)
  
  * mangle
  
    > 恢复mangle后的函数名称使用**c++filt**命令即可,e.g.
  >
    > <img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200925114818204.png" alt="image-20200925114818204" style="zoom: 80%;" />
  
  * U是未定义，which means 是调用外界的函数（在其它库中定义的），T(位于text section)表示函数是当前库中定义的，W(weak)类是当前库中定义，被其它库中的函数覆盖），B(位于bss section)
  
  * nm -n 按照地址排列符号 （--numeric sort )
  
  * nm -u 打印未定义符号 （ldd -r xx.so 也可以）
  
* [x] 终于明白了为什么makefile里面有的地方不需要.h，有的地方需要了

  <img src="https://gitee.com/HesyH/Image-Hosting/raw/14ac540fae3bfde3bbaa6b7025ac4d365650fa7f/image4typora/202010/05/000501-970705.png"/>

  ​	写在依赖里面是为了及时的更新，是makefile的特性，跟gcc和g++的命令无关。本身cc -E 里面就会处理头文件的事情，which means 头文件不需要我们手动去指定依赖，其实代码里面写的很清楚了，编译器是知道的，而且结果很明显，确实是知道的（详见阮一峰的博客：[编译器的工作过程](http://www.ruanyifeng.com/blog/2014/11/compiler.html)中的“第五步 预处理”的剖析）



# question 

* [ ] 静态链接和动态链接都是ld么

  > 目前我的理解是：
  >
  > ld是静态链接器，动态链接器实际上是ld-linux.so（ 具体看机子