---
title: 建站 | Jekyll -》 mkdocs -》 hexo
top: true
toc: true
mathjax: true
date: 2020-07-30 21:50:53
tag:
	- tool
categories: 程序员的自我修养
description: github pages建站
---

# Jekyll
之前是用的jekyll，但是没找到我想要的全局搜索功能，有兴趣的还是可以看下：[Jekyll建站](https://blog.csdn.net/Hesy_H/article/details/104184720)

---
# mkdocs
> 其实Jekyll已经省去了很多麻烦了，但是我真的真的很烦每个md开头要写一大段乱七八糟的配置，不方便迁移，所以就转到mkdocs了，虽然模板的页面效果没有Jekyll丰富，但是对懒人还是极其友好的。

> 本来想用mkdocs的，毕竟还是挺省事儿的，文件结构也很清晰，学神点拨下我发现hexo可以全局搜索，跟mkdocs的标题搜索等级比起来，更香了！
> 简单学了下，后续可能考虑用mkdocs做一些项目文档手册，作为子网址吧，做手册挺合适的。

## ref
* [蛮详细的，尤其是关于yml配置文件相关的](https://www.xncoding.com/2020/03/01/tool/mkdocs.html)
* [配置也很详细，尤其有一些关于mkdocs的冷知识](http://wutongtree.github.io/devops/manage-your-cms-using-mkdocs)
* [列了一些注意事项，which我也觉得很重要](https://my.oschina.net/fzxiaomange/blog/3010921)
* 这个没仔细看，但是感觉很高贵的样子 [将 Jupyter 自动发布到 GitHub Pages](https://toutiao.io/posts/t93a5c/preview)

## 配置中遇到的问题
[py37下字符编码遇到的问题](https://blog.csdn.net/stone9159/article/details/79071316)





---
# hexo
> 我的两个config.xml（_config.next.xml是对应next主题的配置）都做了比较详细的注释，大家改起来也会很方便，欢迎在我的基础上修改！（虽然我本来也就是改学神的 :)

## ref
1. 环境配置请参考：[linux下使用hexo建站](https://lrscy.github.io/2017/11/10/Ubuntu-Github-io-config-Hexo/)	
> * 安装的时候提示8.x已经deprecated，所以我按照提示安装了12.x
> * 在服务器上跑`npm install -g hexo-cli`等命令的时候，会遇到权限不够，根据提示给sudo就行
2. 推送过程和基本配置网上已经很多了
> *  next主题的仓库已经过期，我用的是学神给的这个：https://github.com/theme-next/hexo-theme-next
> * [next主题的基本设置](https://tding.top/archives/42c38b10.html)
> * [hexo主题进阶设置](https://zhuanlan.zhihu.com/p/94038688)

3. 其他trivial的可选功能
> * [Hexo添加Disqus评论](https://www.jianshu.com/p/d68de067ea74)
> * hexo添加google-analytic功能 （ 不想做了2333累了

## 基本命令
hexo new '文章标题'
hexo new draft
 hexo clean
 > 清除缓存文件 (db.json) 和已生成的静态文件 (public)。在某些情况（尤其是更换主题后），如果发现您对站点的更改无论如何也不生效，您可能需要运行该命令。

hexo g
hexo s
hexo d

---





# mkdown+图床 获取 永久链接 （ 香

可以参考[我之前写的文章：typora+gitee图床](https://blog.csdn.net/Hesy_H/article/details/107622202)

---




# Actions

* [x] [简单入个门](https://juejin.im/post/5c417da751882525c63809cd)
* [x] [hexo+Actions保姆教程](https://juejin.im/post/6854573218779381773)

本来想自己写的，结果学神也用的actions，哈哈作业一抄到底 （ docker确实不太精通啊...  - -||| ）

---
# miscelleous
* [ ] 添加多个部署源
```
deploy:
- type: git
  repo:
- type: heroku
  repo:
```

