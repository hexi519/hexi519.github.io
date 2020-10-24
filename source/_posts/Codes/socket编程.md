---


title: socket编程
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-22 22:35:59
categories: Codes
description:  socket编程中API整理
tags:
    - Network
---


# reference

* 《Linux系统编程、网络编程》第10章 网络编程视频课程 ,which is in my Baidu Cloud

  > 目前看到12了，其他的组会上听吧

* [ ] [这个b站视频](https://www.bilibili.com/video/BV1RJ411B761/?spm_id_from=333.788.videocard.1)似乎是专门讲Unix网络编程这本书的

* [ ] 百度云里面存了一个系列视频，我觉得也不错



# API

* socket就是一个文件描述符，但是没有文件名（Linux有七种文件描述符）

## bind( ) 

* bind ( int sockfd ,  const struct sockaddr *addr , socklen_t addrlen  )

```c
struct sockaddr {
    unsigned  short  sa_family;     /* address family, AF_xxx */
    char  sa_data[14];                 /* 14 bytes of protocol address */
};

struct  sockaddr_in {
    short int sin_family;              /* Address family */
    unsigned short int sin_port;       /* Port number */
    struct in_addr sin_addr;           /* Internet address */
    unsigned char sin_zero[8];	/*padding to be the same size as struct sockaddr*/
};


```

* 因为sockaddr中直接在char[] 里面写端口和ip比较麻烦，所以用了sockaddr_in, which是分开来记录的

  > 这里sin的意思就是：s代表sockaddr ， in就是sockaddr_in后缀的in的意思
  >
  > sin_addr存储的是ipv4的地址 ，acutually就只有32位的 unsigned int ，s_addr 【这个起名真是绕人啊...】
  >
  > 姑且认为，这里sockaddr_in里面的in代表着是包含在sockaddr内部的

  将sockaddr_in强制转换成sockaddr，看到有人这么写：(struct sockaddr*) &sockaddr_in , ==感觉很神奇？不知道理由是什么==



## epoll( )

* **epoll的过程**

  * 创建红黑树	**epoll_create**( int size)

    > 现在内核已经优化到size写一个大于0的数即可

  * 向树上增加要监听的文件描述符（已经上树了的就不用再上树了）

    **epoll_ctl** ( int epfd,  int op, int fd, struct epoll_event* event )

    > **epfd**  红黑树的根节点
    >
    > **op** 对红黑树的修改操作
    >
    > 	* EPOLL_CTL_ADD  上树 
    > 	* EPOLL_CTL_MOD  修改
    > 	* EPOLL_CTL_DEL 下树 
    >
    > **fd** 要上树的文件描述符
    >
    > **event**  要监听该文件描述符的什么操作
    >
    > ```c
    > typedef union epoll_data {
    >    void    *ptr;
    >    int      fd;
    >    uint32_t u32;
    >    uint64_t u64;
    > } epoll_data_t;  // 一般就用上面两个
    > 
    > struct epoll_event {
    >    uint32_t events; /*Epoll events,e.g.EPOLLIN,EPOLLOUT(也主要是这两个事件)*/
    >    epoll_data_t data;      /* User data variable */
    > };
    > ```
    >
    > **细节**：在上树的时候，每个节点既包含了文件描述符fd的信息，又包含了event的信息

  * 监听节点  **epoll_wait**( int epfd, struct epoll_event *events,int maxevents, int timeout )

    * events提供了一个用于存放返回值的数组
    * maxevents提供了数组的大小
    * 返回值是 返回的事件的个数

  

* [ ] epoll反应堆



## setsockopt( )

* 在创建socket之后，bind之前设定（比如说SO_REUSEADDR）
  * SO_REUSEADDR 端口复用，为何可以端口复用？可以参考下[这篇博客](https://juejin.im/entry/6844903509624651790)提出的理由





## tl;dr

* [ ] ==看完了[P56 epoll反应堆](https://www.bilibili.com/video/BV1RJ411B761?p=56)==，觉得这个系列视频讲得蛮好的，有空要接着看。



# 字节序转换

* 主机字节序  无论是大端还是小端  本机的字节序就叫主机字节序

* htonl  这里的l 是long ，32位 ; htons 这里的s是 short ，16位。无论是long还是short ，都是大端的

  **htonl** 用于转换ip地址（4个字节）  --》 attention 这里的ip地址是数值形式的（而非点分十进制）

  **htons** 用于转换端口号（2个字节）

  > host to numerical long , host to numerical short

* **inet_pton**

  将ip地址从点分十进制( point )转换为大端的数值( numerical )形式

  **inet_ntop**

* 网络编程中尽量都用无符号的 ，不然一不小心出现负值






# 五大IO模型

## 阻塞IO BIO

应用层accept( ) -->  内核recvFrom( **Block**，...  ) 取一个socket

​			|

​			V

应用层read( ) -->内核 recvFrom( **Block**，... ) 取字节流

​			|

​			V

​			....

* 如果accept的时候没有客户端连接上来，那么就卡在这一步，不会往下行进了
* 另一方面，如果此时有别的连接进来了，也不会搭理，因为线程阻塞在其中某个步骤中了‘
  * 没有办法处理多个客户端连接的情况



## 非阻塞IO   基于线程驱动模型

应用层accept( ) --> 内核recvFrom( **nonBlock**，... ) 取一个socket

​			|

​			V

应用层read( ) --> 内核recvFrom( **nonBlock**，... ) 取字节流

​			|

​			V

​			....

* 如果有客户端进来，我可以都处理-->实际上是利用非阻塞的性质，一个函数没有获得结果，我还是可以往下走，keep循环走这个流程



## IO多路复用 NIO new IO   基于事件驱动模型

> New IO是java的一个包，which includes socketChannel,ByteBuffer，Nonblocking IO是Linux操作系统的非阻塞IO

* 多路复用器 应用层select( ) --> 内核epoll( )

![image-20200926145841363](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202009/26/145842-614824.png)

	* epoll的过程是非阻塞的，但是处理数据的过程是阻塞的（当然还是得遍历，一个一个去处理）
	* 此外，epoll做了优化，不用把数据从内核空间拷贝到用户空间了，采用内存地址的方式，实现了“零拷贝”



### 组件

* **channel**

  * BIO读写都是单向的

    <img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200926150226860.png" alt="image-20200926150226860" style="zoom:67%;" />

    但是NIO是双向的（利用channel）

    <img src="C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200926151233132.png" alt="image-20200926151233132" style="zoom:67%;" />

    且在byte数组基础上还包装成了bytebuffer

    > [bytebuffer与channel的交互](https://www.cnblogs.com/chenpi/p/5372786.html)

* **selector**



## NIO reactor模型  反应堆模型

* 单线程
* 多线程
* 主从模型