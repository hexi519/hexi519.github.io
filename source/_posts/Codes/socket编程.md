---
title: socket编程
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-22 22:35:59
categories: Codes
description:
tags:
    - Network
---


# reference

* 《Linux系统编程、网络编程》第10章 网络编程视频课程 ,which is in my Baidu Cloud

  > 目前看到12了，其他的组会上听吧

* [ ] [这个b站视频](https://www.bilibili.com/video/BV1RJ411B761/?spm_id_from=333.788.videocard.1)似乎是专门讲Unix网络编程这本书的



# API

* socket就是一个文件描述符，但是没有文件名（Linux有七种文件描述符）

* bind( int sockfd ,  const struct sockaddr *addr , socklen_t addrlen  )

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

    将sockaddr_in强制转换成sockaddr，看到有人这么写：(struct sockaddr*) &sockaddr_in , ==感觉很神奇？==

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