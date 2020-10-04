---
title: pythonConfig
top: false
cover: false
toc: true
mathjax: true
date: 2020-09-28 01:34:53
categories: Codes
description: python配置相关总结
tags:
	- Language
---



# 查看whl文件需要满足的条件

```python
import wheel.pep425tags
print(wheel.pep425tags.get_supported())
```

