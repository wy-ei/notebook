---
layout: post
title: Jupyter Lab
category: 工具
---



本文为我在用 Jupyter Lab 时的备忘笔记，会持续更新。

## 简介

做数据科学的同学对 jupyter notebook 应该很熟悉，但他的一个缺点是不能够同时打开多个文件。jupyter lab 可以算的上是一个简易的 IDE，你可以同时打开多个窗口，打开终端，对窗口进行分割，同时编辑不同类型的文件。 如果正在使用 jupyter notebook，那么没有理由不切换到 jupyter lab 上。

其主界面如下：

![jupyter lab 界面](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2019/05/14/5cda4759697df1fd0cc1e1e9.jpg)

jupyter lab 的文档在 [JupyterLab Documentation](https://jupyterlab.readthedocs.io/en/stable/)。

## 安装与启动

```sh
# 安装
pip install jupyterlab

# 启动 jupyter lab
jupyter lab
```


## 通过密码访问

在启动 jupyter lab 之后，默认是通过在 url 后面跟上一个 token 来访问的。有时候关闭了页面之后，往往又需要去控制台复制这个带有 token 的 url，常常显得不够方便，为此可以设置一个密码，通过密码来访问。

先生成配置文件，然后配置密码，命令如下：

```sh
$ jupyter notebook --generate-config
$ jupyter notebook password
```

这会要求用户输入需要设置的密码。设置完成之后，就可以通过输入密码来访问 jupyter lab 了。

## 在服务器上部署

一种场景是，希望在服务器上运行 jupyter lab，然后可以在任何地方，使用任何设备访问到 jupyter lab 环境。默认情况下，只能通过 `http://localhost:8888` 这个地址访问，通过服务器的 IP 是访问不了的，需要做一些配置。

初始阶段 jupyter lab 采用默认配置，如果需要对其个性化配置，需要先生成配置项：

```sh
# 生成配置文件
$ jupyter notebook --generate-config
```

这个时候在用户根目录下的 `.jupyter` 目录下，就多出来了一个 `jupyter_notebook_config.py` 文件，在这个文件里，用户可以对 jupyter lab 进行个性化配置。

需要修改的地方主要有下面几处：

```python
# 当你使用服务器的 ip 访问的时候，可以不配置这一项
# 当时如果使用外网穿透技术，访问的 ip 不是部署 jupyter lab 的机器的 ip 的时候，
# 就需要配置这个了，否则部分功能无法正常工作
c.NotebookApp.allow_origin = '*'

# 修改可以通过本机的任意一个 ip 地址来访问 jupyter lab 环境
c.NotebookApp.ip = '0.0.0.0'

# 关闭自动打开浏览器的行为
c.NotebookApp.open_browser = False

# 修改端口，默认为 8888，根据自己的需要修改
c.NotebookApp.port = 8000
```

## Magic Command

此命令可以查看函数的性能瓶颈，看到函数每一行的运行次数和时间。

```python
%load_ext line_profiler

%lprun -f Quick.sort Quick.sort(nums)
```

## 快捷键

Notebook 存在两种模式，命名模式和编辑模式，可以使用 <kbd>Esc</kbd> 从编辑模式切换为命令模式，使用 <kbd>Enter</kbd> 进入编辑模式。

在命令模式下，有下列快捷键可以使用：

<kbd>m</kbd>: 将 cell 切换为 markdown 模式

<kbd>y</kbd>: 将 cell 切换为代码模式

<kbd>D</kbd>+<kbd>D</kbd>: 删除 cell

<kbd>Shift</kbd>+<kbd>↑ / ↓</kbd>: 选中多个 cell，选中后可以进行删除、复制、粘贴、运行等操作。

<kbd>Shift</kbd>+<kbd>M</kbd>: 合并选中的 cells

<kbd>Shift</kbd>+<kbd>Tab</kbd>: 代码提示，光标定位到某个函数、某个模块的时候，按这个组合键会得出提示

在编辑模式，有下面一些技巧：

输入 `?function-name` 可以得到对应函数的签名和文档，由此可以确定函数的输入和功能等信息，比如：

```
?len
```

输入 `??function-name` 可以得到函数更加详细的信息，包括源代码。