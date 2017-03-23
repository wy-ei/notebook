---
layout: post
title: 常用的 Shell 命令（其三）
category: Unix/Linux
tag:
  - 命令行工具
  - Shell
---

## wget

wget 用于下载指定 url 对应的内容，基本用法如下：

```sh
$ wget URL1 URL2 URL3 ...
```

### 使用 `-O` 选项指定文件名

wget 默认会使用 url 中对应的文件名来存储文件，如果希望指定另外一个名字，可以使用 `-O` 选项。

```sh
$ wget http://example.com/file.png -O download.png
```

### 使用 `-o` 选项将输出写出文件

wget 在下载内容的时候，屏幕上会输出实时的进度，如果不希望它显示在屏幕上，可以使用 `-o` 选项将其写入文件。

```sh
$ wget http://example.com/file.png -O download.png -o download.log
```

### 使用 `-t` 指定重试次数

如果失败可能中断，那么指定一个重试次数将会很有用。

```sh
# 重试 5 次
$ wget -t 5 URL

# 不断重试
$ wget -t 0 URL
```

### 限制下载速度和下载文件大小

使用 `--limit-rate` 来限速：

```sh
# 限制最大速度为 20k/s
$ wget --limit-rate 20k URL
```

使用 `--quota` 或者 `-Q` 选项来限制最大下载大小，这可以避免不经意间下载太多东西占满了磁盘

```sh
# 最多下载 20M 的内容
$ wget -Q 20m URL
```




