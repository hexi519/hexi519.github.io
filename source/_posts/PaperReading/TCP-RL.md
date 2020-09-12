* 不需要**客户端**或者中间件做任何改动 [ 惊了 ]

> 为了解决挑战一，TCP-RL 修改了前端服务器的 Linux 内核代码和 Web Server 应用 Nginx的代码，使得服务器能够测量并且实时输出每条用户请求的 TCP 流信息(比如网络传输延迟、丢包率、RTT 等)。整个过程在服务器端完 成，不需要客户端或者中间件做任何改动。该数据采集和测量的工具不仅仅可以用于初始窗口的调整，也可用于 Web 服务的网络性能指标管理、监控、 故障诊断。

* 对于问题的建模做的很好，而且作为了一个challenge



* 我觉得slides里面这个图做的很好

![image-20200810092501270](C:\Users\hesy\AppData\Roaming\Typora\typora-user-images\image-20200810092501270.png)



hesy:The long flow switch like this, the cold start process should not be ignored--"Use SmartIW



# inspiration of hesy

* 要会用这个词: **data-driven** 代替 ML-based 或者RL-based。高大上！

* contribution绝对不能写自己是首先用DRL做这个的，因为还有些水会也是做这个的，所以我们也要credit他们并且讲清楚区别。
* 写作的时候要注意层次感，不能一上来就说这个feature适合用RL做，应该先给出一个也比较适合但是naive的solution，再说RL可以解决这个naive的defects
* 目标函数或者奖励函数的形式  需要找人背书，不能自己造一个
  * 目标函数没有想好要不要让清空队列，因为延迟梯度也能包含这个目标。（或许可以做一个实验来证明这两个的相关性，看下Timely怎么做ECN和延迟的相关性的，记得这两个并不是很大程度上的相关鸭）
* 实验细节要好好看下