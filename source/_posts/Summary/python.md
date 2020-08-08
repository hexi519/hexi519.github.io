\---

title: python总结

top: false

cover: false

toc: true

mathjax: true

date: 2020-08-08 17:35:17

categories: Summary

description: 关于python的总结

tags:

  \- Network

\---



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