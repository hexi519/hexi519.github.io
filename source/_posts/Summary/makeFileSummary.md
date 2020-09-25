---
title: Summary of makefile
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-17 17:18:59
categories: Summary
description: makefile的总结和梳理
tags:
    - Compilation and Link
---

# refer
* [陈皓：跟我一起写makefile](https://seisman.github.io/how-to-write-makefile/introduction.html)



## others[拓展]

* [x] [陈皓：如何调试MAKEFILE变量](https://coolshell.cn/articles/3790.html)
  * makefile中的origin函数 等等， 在这里又介绍了几个自带的函数
  * 陈皓自己写了个用于debug的mk
  * make的f参数，指定特定名称的文件，多个参数一起用，会连接起来传递给程序一起执行
  * 还附上了一个remake tool的教程，which tl;dr ，以后再说吧



# basis

* Makefile里主要包含了五个东西：显式规则、隐晦规则(自动推导)、变量定义、文件指示(makefile里面包含别的makefile 以及 其他一些规则)和注释(#)

* Makefile最灵魂的东西就是：
  
* 如果目标(<target>)不存在 **或者** prerequisites的日期新于目标，就执行相应的command
  
* make的**工作方式**
    ```
    GNU的make工作时的执行步骤如下：（想来其它的make也是类似）
    1. 读入所有的Makefile。
    2. 读入被include的其它Makefile。
    3. 初始化文件中的变量。
    4. 推导隐晦规则，并分析所有规则。
    5. 为所有的目标文件创建依赖关系链。
    6. 根据依赖关系，决定哪些目标要重新生成。
    7. 执行生成命令。
    ```
    * 两个阶段
        * lazy展开（有点python的意思

## trivial points
* .PHONY 伪目标
  * clean命令放最后，因为最前的是默认的总目标
  * [伪目标的巧用](https://seisman.github.io/how-to-write-makefile/rules.html) --》 [ 单独一个make可以work的原理 ]
* 命令前的小减号 , 出现错误只会弹警告，然后继续运行，不会退出
    ```python
        -include <filename>   # 找不到就不用找了
        -rm edit $(objects)   # 删除失败就就继续执行吧
    ```
* **自动推导** [隐晦规则]
    在生成xx.o的过程中可以省去gcc -c xx.c的命令
* **另类风格**
    文件依赖关系会显得有点凌乱，但是会让makefile变得简单 
    简而言之，就是一个xx.o可以在多行的左边出现
* make -f / make --file 指定除了makefile 和Makefile以外的别的命名方式
* 寻找别的makefile的目录
    * 系统缺省的目录
    * -I / --include-dir 指定的目录
    * VPATH变量 & 更灵活的vpath （in whose pattern我们应该用%而不是*的通配符），目录之间使用冒号(:)分隔
    * 环境变量MAKEFILES
        * 不建议使用

## 规则
* 一般来说，make会以UNIX的标准Shell，也就是 /bin/sh 来执行命令。
* 命令要缩进(tab)

# 书写命令
> 每条规则中的命令和操作系统Shell的命令行是一致的。make会**按顺序一条一条的执行命令会**，每条命令的开头必须以 Tab 键开头，除非，命令是紧跟在依赖规则后面的分号后的。在命令行之间中的空格或是空行会被忽略，但是如果该空格或空行是以Tab键开头的，那么make会认为其是一个空命令。

* 注意点！
    * 如果你要让上一条命令的结果应用在下一条命令时，你应该使用分号分隔这两条命令。比如你的第一条命令是cd命令，你希望第二条命令得在cd之后的基础上运行，那么你就**不能把这两条命令写在两行上**，而应该把这两条命令写在一行上，用分号分隔

* 全局参数
    * debug
        * --just-print / -n
        * -s / --silent / --quiet
    * -i / --ignore-errors
        * .IGNORE为目标的规则 是另一种级别的防止命令出错的方式
    * -k / --keep-going
    * -w / --print-directory
        * -C 的时候自动打开-w
        * -s的时候-w总是失效的

## 嵌套执行make
* 总控Makefile , subsystem
* 变量传递
    * 传递变量到下层用export
        * 后面什么都不跟，表示传递所有的变量
    * SHELL 和 MAKEFLAGS 不管你是否export，其总是要传递到下层 Makefile中
        * MAKEFLAGS如果是自己定义的，得确保其中的选项是大家都会用到的。如果其中有 -t , -n 和 -q 参数，容易出现让人意想不到的结果
    * make命令中的有几个参数并不往下传递
    * 不想往下层传递参数的话：
    ```makefile
    subsystem:
    cd subdir && $(MAKE) MAKEFLAGS=
    ```

## 命令包  
* 调用的时候和调用变量一样的方式  

# 条件判断和函数
## 条件判断
* 格式
```makefile
<conditional-directive>
<text-if-true>
else
<text-if-false>
endif
```
* 命令
    * ifeq & ifneq
        ```makefile
        ifeq (<arg1>, <arg2>)
        ifeq '<arg1>' '<arg2>'
        ifeq "<arg1>" "<arg2>"
        ifeq "<arg1>" '<arg2>'
        ifeq '<arg1>' "<arg2>"        
        ```
    * ifdef & ifndef
      
        * ifdef只是测试一个变量是否有值，其并不会把变量扩展到当前位置。*
* 注意点
    **make是在读取Makefile时就计算条件表达式的值**，并根据条件表达式的值来选择语句，所以，不要把自动化变量（如 $@ 等）放入条件表达式中，因为**自动化变量是在运行时才有的**。

## 函数
```makefile
$(<function> <arguments>)
```

* $(subst <from>,<to>,<text>)
* $(patsubst <pattern>,<replacement>,<text>)
    * 顾名思义，不是text上的substitution了，而是pattern上的substitution
    * 和变量替换的作用一样
    > $(objects:.o=.c) 和 $(patsubst %.o,%.c,$(objects)) 是一样的。
* $(strip <string>)
* $(findstring <find>,<in>)
* $(filter <pattern...>,<text>)
* $(filter-out <pattern...>,<text>)
* $(sort <list>)
* $(word <n>,<text>)
* $(wildcard PATTERN...) 
    * **在Makefile规则中，通配符会被自动展开。但在变量的定义和函数引用时，通配符将失效。这种情况下如果需要通配符有效，就需要使用函数“wildcard”**。
    > 在Makefile中，它被展开为已经存在的、使用空格分开的、匹配此模式的所有文件列表。如果不存在任何符合此模式的文件，函数会忽略模式字符并返回空。需要注意的是：这种情况下规则中通配符的展开和上一小节匹配通配符的区别。

* 循环 $(foreach <var>,<list>,<text>)
* 判断 $(if <condition>,<then-part>)   /  $(if <condition>,<then-part>,<else-part>)
* shell函数
    > 注意，这个函数会新生成一个Shell程序来执行命令，所以你要注意其运行性能，如果你的Makefile中有一些比较复杂的规则，并大量使用了这个函数，那么对于你的系统性能是有害的。特别是Makefile的隐晦的规则可能会让你的shell函数执行的次数比你想像的多得多。
... [tl;dr](https://seisman.github.io/how-to-write-makefile/rules.html)



# 书写规则
* 最重要的是 依赖关系 & 生成目标的方法
* 通配符
    * \~ , \* , ?
    * 在目标和命令中都可以用
* 多目标
* 静态模式语法
    ```makefile
    <targets ...> : <target-pattern> : <prereq-patterns ...>
        <commands>
        ...
    ```
    * e.g.  <target-pattern> like %.o , <prereq-pattern> like %.c
    * 注意，这里<target-pattern> 和<prereq-pattern> 都是一个集合，所以后面的 $< 表示第一个依赖文件，会**依次**取出这个集合里面的所有文件
    * example
    ```makefile
    objects = foo.o bar.o
    all: $(objects)
    $(objects): %.o: %.c
        $(CC) -c $(CFLAGS) $< -o $@ 
    ```
* 自动生换成依赖性
    ```makefile
    cc -M xx.cc 
    cc -MM xx.cc 
    ```
    * 与源代码解耦合的方法  
        * .d文件包含.c文件的依赖
        * makefile配置生成.d文件，然后再包含这些.d文件

# 变量
## 基本用法
* 命名规则
    > 传统的Makefile的变量名是全大写的命名方式，但我推荐使用大小写搭配的变量名，如：MakeFlags。这样可以避免和系统的变量冲突，而发生意外的事情。
    > 可以是数字开头的
* 调用
    * ${} 与 $() 
    * 也可以不加括号，但是加上比较安全

* 定义 & 赋值
    * = 
        * 右边可以是目前未定义变量
        * 小心递归定义
        * 避免在变量中使用函数,whcih 比较增大开
    * :=
      
        * 只可以用前面定义好了的 ，所以比较安全
    * #的用法：表示变量定义的中止
        * 正例
        ```makefile
        nullstring :=
        space := $(nullstring) # end of the line
        ```
    > nullstring是一个Empty变量，其中什么也没有，而我们的space的值是一个空格。因为在操作符的右边是很难描述一个空格的，这里采用的技术很管用，先用一个Empty变量来标明变量的值开始了，而后面采用“#”注释符来表示变量定义的终止，这样，我们可以定义出其值是一个空格的变量。
    
        * 反例
        ```makefile
        dir := /foo/bar    # directory to put the frobs in
        ```
        > dir这个变量的值是“/foo/bar”，后面还跟了4个空格，如果我们这样使用这样变量来指定别的目录——“$(dir)/file”那么就完蛋了。
        * 个人想法
            何必呢。直接回车换行，也不用#不是很好。不过也可能一方面是为了方便阅读，另一方面也是显式定义，防止不小心打了空格啥的没有看见
        * ?=
            如果之前没定义过，就赋值，否则就omit

## 高级用法
### 变量值替换
* $(var:a=b) 或 ${var:a=b}
```makefile
foo := a.o b.o c.o
bar := $(foo:.o=.c)
```
另一种也能完成变量替换的级数就是 “静态模式”
```makefile
foo := a.o b.o c.o
bar := $(foo:%.o=%.c)
```

### 变量值再当作变量
* 用法
    ```makefile
    x = y
    y = z
    a := $($(x))
    ```
    * 这个知识点主要要明确的就是，是“x=y”，而不是“x=$(y)”,如果没有$,关于y的值不会自动解开来赋值给x的

* 使用多个变量来组成一个变量的名字，然后再取其值
    ```makefile
    first_second = Hello
    a = first
    b = second
    all = $($a_$b)
    ```
    > 这个例子中，如果 $(a1) 的值是“a”的话，那么， $(sources) 的值就是“a.c b.c c.c”；如果 $(a1) 的值是“1”，那么 $(sources) 的值是“1.c 2.c 3.c”。
    > 所以配合条件句使用特别好

* 也可以放在左值中
```makefile
$(dir)_sources := $(wildcard $(dir)/*.c)
```

### 多行变量
* 利用原理：因为命令需要以[Tab]键开头，所以如果你用define定义的命令变量中没有以 Tab 键开头，那么make 就不会把其认为是命令。

* 格式
```makefile 
define two-lines
echo foo
echo $(bar)
endef
```

### overridd

如果有变量是通常make的命令行参数设置的，那么Makefile中对这个变量的赋值会被忽略
```makefile
# 覆盖外部命令行的定义
override <variable>; = <value>;
override <variable>; := <value>;

# 追加覆盖方式
override <variable>; += <more text>;

# 多行变量的覆盖
override define foo
bar
endef
```


## 环境变量
* 优先考虑文件中的，但是如果有make -e的参数，就优先考虑e(nvironment)的变量

## 目标变量 Target-specific Variable
* 变量分类
    * 全局变量
        整个文件，我们都可以访问这些变量
    * 自动化变量
        如 $< 等这种类量的自动化变量就属于“规则型变量”，这种变量的值依赖于规则的目标和依赖目标的定义
    * 目标变量
        可以和“全局变量”同名，因为它的作用范围只在这条规则以及连带规则中，所以其值也只在作用范围内有效。而不会影响规则链以外的全局变量的值

* 这个特性非常的有用，当我们设置了这样一个变量，这个变量会作用到由这个目标所引发的所有的规则中去。如：
```makefile
prog : CFLAGS = -g
prog : prog.o foo.o bar.o
    $(CC) $(CFLAGS) prog.o foo.o bar.o

prog.o : prog.c
    $(CC) $(CFLAGS) prog.c

foo.o : foo.c
    $(CC) $(CFLAGS) foo.c

bar.o : bar.c
    $(CC) $(CFLAGS) bar.c
```
在这个示例中，不管全局的 $(CFLAGS) 的值是什么，在prog目标，以及其所引发的所有规则中（prog.o foo.o bar.o的规则）， $(CFLAGS) 的值都是 -g

* 语法
```makefile
<target ...> : <variable-assignment>;
<target ...> : overide <variable-assignment>
```
<variable-assignment>;可以是前面讲过的各种赋值表达式，如 = 、 := 、 += `` 或是 ``?= 。第二个语法是针对于make命令行带入的变量，或是系统环境变量。

## 模式变量 Pattern-specific Variable
* 其实没有很懂 如何 定义到**模式**上，还要[回来](https://seisman.github.io/how-to-write-makefile/variables.html)再看下

## 自动化变量

## 特殊变量
* ${MAKELEVEL}
* ${MAKE}
    * 代替make命令本身，在递归调用子文件中的makefile的时候，不能出现make本身(否则会陷入无穷的递归)，应该使用${MAKE}
    * [refer](https://stackoverflow.com/questions/2206128/how-to-call-makefile-from-another-makefile)
    * 经常和-C参数一起使用，代表进入一个目录后使用make命令
    ```makefile
    subsystem:
        cd subdir && $(MAKE) # 注意，这两行命令不能分开写
    
    #  与上面的作用是一致的
    subsystem:
        $(MAKE) -C subdir
    
    # 更进一步，我想要执行特定的命令(比如clean)
    subsystem:
        $(MAKE) -C subdir clean
    ```


## 关于各种赋值符号的小总结
* =
* :=
* ?=
* +=





# 隐含规则

## basis
* 如果没有写.o文件的生成规则，默认就会调用如下规则:把 .o 的目标的依赖文件置成 .c ，并使用C的编译命令 cc –c $(CFLAGS)  foo.c 来生成 foo.o 的目标
* 隐含规则可能优先于别的规则被使用，因为隐含规则也有分优先级
* 模式的隐含规则，只不过是规则中要有 % 罢了



## 自动化变量

* 扩展时会一个个文件取出
    * $@
    
    * $%
    
    * $<
    
    * $*
    
      > \$* 指代匹配符 % 匹配的部分， 比如% 匹配 f1.txt 中的f1 ，$* 就表示 f1。
      >
      > 这里陈皓的一起来写makefile里面写错了
* 返回文件列表
    * $?
        **比较有用**
        
        > 所有比目标新的依赖目标的集合。以空格分隔。
    * $^
      
        > 所有的依赖目标的集合。以空格分隔。如果在依赖目标中有多个重复的，那么这个变量会去除重复的依赖目标，只保留一份。
    * $+
      
        > 所有的依赖目标的集合。以空格分隔。如果在依赖目标中有多个重复的，那么这个变量会去除重复的依赖目标，只保留一份。



## [本章节尾部](https://seisman.github.io/how-to-write-makefile/implicit_rules.html#)tl;dr





# question

* [x] 手写makefile不是很麻烦？没有自动的么？like cmake
> autotools（常见的./configure文件就是autotools生成的）和 cmake （cmakelist） 都是用于自动生成makefile的
* [x] := 和 = 的区别
  
    > 后者可以使用未定义(但是后文定义了的)变量，但是前者不可以（所以更安全）
* [x] [Makefile中*和%的区别](https://www.cnblogs.com/warren-wong/p/3979270.html)
* [x] CPPFLAGS 和 CXXFLAGS 的区别
  
    > 前者是C预处理器的参数（PP代表preprocessing），后者是C++的语言编译器