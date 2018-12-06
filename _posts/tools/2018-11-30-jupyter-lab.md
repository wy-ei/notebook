---
layout: post
title: 数据科学利器 —— Jupyter Lab
category: 工具
---

本文为我在使用 jupyter lab 时的笔记，会持续更新。

- toc
{:toc}

## 简介

做数据科学的同学对 jupyter notebook 应该很熟悉，但他的一个缺点是不能够同时打开多个文件。jupyter lab 可以算的上是一个简易的 IDE，你可以同时打开多个窗口，打开终端，对窗口进行分割，同时编辑不同类型的文件。 如果正在使用 jupyter notebook，那么没有理由不切换到 jupyter lab 上。

其主界面如下：

![]({{site.images}}/18-12-6/jupyter-lab.jpg)


jupyter notebook 的文档在 [JupyterLab Documentation](https://jupyterlab.readthedocs.io/en/stable/)。

## 安装与启动

```sh
# 安装
pip install jupyterlab

# 启动 jupyter lab
jupyter lab
```


## 通过密码访问

在启动 jupyter lab 之后，默认是通过在 url 后面跟上一个 token 来访问的。有时候关闭了页面之后，往往又需要去控制台复制这个带有 token 的 url，常常显得不够方便，为此可以设置一个密码，通过密码来访问。


命令如下：

```
$ jupyter notebook password
```

这会要求用户输入需要设置的密码。设置完成之后，就可以通过输入密码来访问 jupyter lab 了。


## 在服务器上部署

一种场景是，希望在服务器上运行 jupyter lab，然后可以在任何地方，使用任何设备访问到 jupyter lab 环境。默认情况下，只能通过 `http://localhost:8888` 这个地址访问，通过服务器的 IP 是访问不了的，需要做如下配置：

初始阶段 jupyter lab 采用默认配置，如果需要对其个性化配置，需要先生成配置项：

```sh
# 生成配置文件
$ jupyter notebook --generate-config
```

这个时候在用户根目录下的 `.jupyter` 目录下，就多出来了一个 `jupyter_notebook_config.py` 文件，在这个文件里，用户可以对 jupyter lab 进行个性化配置。

需要修改的地方主要有下面几处：

```python
# 修改 ip 为任意 ip，这样以来可以通过本机的任意一个 ip 地址来访问 jupyter lab 环境
c.NotebookApp.ip = '*'

# 关闭自动打开浏览器的行为
c.NotebookApp.open_browser = False

# 修改端口，默认为 8888，根据自己的需要修改
c.NotebookApp.port = 8000
```