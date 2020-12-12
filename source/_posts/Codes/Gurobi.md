---
top: false
cover: false
mathjax: true
title: Gurobi
date: 2020-12-09 09:45:30
categories: Codes
description: Gurobi usage in Python
tags:
---



* python的扩展对象 TupleList TupleDict  更加高效

  <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202012/09/095006-189335.png" alt="image-20201209095006228" style="zoom:67%;" />

  	> 有高效的筛选API，而传统的python对象，就只能通过循环

  * TupleList快速筛选

    select('key','*')

    TupleDict ( gurobi变量一般都是这个 )

    select sum prod 

    ​	prod其实是逐元素相乘

    

    Multidict

    <img src="https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202012/09/095353-622995.png" alt="image-20201209095343645" style="zoom:67%;" />

  * 创建list  列表解析

    ![image-20201209095423990](https://gitee.com/HesyH/Image-Hosting/raw/master/image4typora/202012/09/112600-482003.png)

  * quicksum

    ![image-20201209112559171](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20201209112559171.png)