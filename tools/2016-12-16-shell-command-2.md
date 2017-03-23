---
layout: post
title: 常用的 Shell 命令（其二）
category: Unix/Linux
tag:
  - 命令行工具
  - Shell
---

* toc
{:toc}


## grep

### 搜索包含特定内容的文本行

```sh
grep pattern filename
# 如
grep hello main.cpp
```

### 使用正则表达式

```sh
grep -E "[a-z]+" filename
# 或者
egrep "[a-z]+" filename
```

### 只输出匹配的部分

```sh
grep -E -o "[a-z]+" filename
```

### 反转匹配结果

```sh
grep -v "hello" main.cpp
```

### 输入匹配的行数

```sh
grep -c "text" file.txt
```


这里只是匹配的行数，而不是次数，因为一行可能会出现多个匹配项。要想统计匹配次数可以使用：

```
grep -o "text" file.txt | wc -l
```

### 打印出行号

```
grep -n "text" wait.md
```

### 搜索包含某段文本的文件

```sh
grep -l "text" file1.txt file2.txt file3.txt
```

使用 `-L` 选项会反过来，列出不包含某段文本的文件，也就相当于 `-lv`。

### 递归搜索

```sh
grep -R "text" ./src
```

### 忽略大小写

```sh
grep -i "TExt" file.txt
```

### 指定多个模式

```sh
grep -e "hello" -e "world" file.txt
```

### 从文本中读取匹配模式

可以将模式写入文件，然后使用 `-f` 命令来读入模式

```sh
# pattern.txt 中每一行都是一个模式
grep -f pattern.txt file.txt
```

### 指定包含或排除文件

使用 `--include` 和 `--exclude` 可以指定包含或排除一些文件

```sh
# 只在 css 和 less 文件中寻找
grep -r "padding" . --include *.{css,less}
```

### 使用 0 值字节作为终结符

```
grep -rZl "hello" . | xargs -0
```

grep 常常用来输出一些文件，然后使用 xargs 来处理文件，这个时候如果文件名中包含空格，那么就会出现问题。因此需要使用 `\0` 来做输出文件的分隔，在 xargs 中使用 `-0` 指定使用 `\0` 作为分隔符。在 `grep` 中指定 `-Z` 就能使用 `\0` 来做分隔符。

### 静默模式

有时候只想知道是否能够匹配成功，这个时候可以使用静默模式，不会打印出任何东西，指向完成后可以通过 `$?` 来判断是否匹配成功。匹配成功为 0。

### 查看匹配行的前后几行的内容

```sh
# 查看匹配项以及后面 2 行
➜ seq 10 | grep 5 -A 2
5
6
7

# 查看匹配项以及之前的 2 行
➜ seq 10 | grep 5 -B 2
3
4
5

# 查看匹配项以及前后 2 行
➜ seq 10 | grep 5 -C 2
3
4
5
6
7
```

`seq 10` 生成 1~10 的序列，每行一个数。

## sed

sed（stream editor）常用来进行文本替换。

### 使用 sed 替换文本中的字符串

```sh
sed 's/pattern/replace/' file
```

默认情况下 sed 会打印出替换后的文本内容。为了将其写回文件可以使用 `-i` 选项：

```sh
# 使用 i 选项将替换后的内容写回文件中
# 这里 -i 需要指定一个字符串，sed 会将其拼接在原文件名的后面得到新的文件名来进行保存原文件，作为备份，
# 然后将替换后的内容写入原文件。如果指定一个空字符串，表示新生成的文件和原文件一样，也就是覆盖原文件。
sed -i "" 's/H/h' file.txt
```

另外使用 `'s/pattern/replace/'` 这样的方法只会替换第一次出现的字符串。如果要全部替换，需要使用 `'s/pattern/replace/g'`

```sh
# 使用 g 表示全部替换
sed 's/this/This/g' file.txt

# 使用 Ng 表示从第 N 次出现开始替换
sed 's/this/This/4g' file.txt
```

### 移除空白行

```sh
# /pattern/d 用来移除匹配的行
sed '/^$/d' file
```

### 使用正则表达式来进行匹配

```sh
sed `s/[0-9]/x/g` list.txt
```

咋正则表达式中出现 `{`,`}` 等特殊字符要进行转译 `\{`, `\}`

### 使用已匹配字符串的标记（ **&** ）

```sh
# & 代表已匹配的字符串
$ echo "1234" | sed 's/[1-9]/[&]/g'
[1][2][3][4]
```

### 使用正则表达式的分组

```sh
# 这里 \1 代表的是正则表达式中第一个分组匹配的内容
echo "--xxx--yyy" | sed 's/--\([a-z]\{3\}\)/**[\1]/g'
```

### sed 表达式的组合

```sh
sed 'expression' | sed 'expression'
# 等价于
sed `expression;expression`
# 或者
sed -e 'expression' -e 'expression'
```

另外 sed 表达式可以使用双引号括起来，这个时候表达式会被求值。

```sh
$ echo 'var logName = env.LOGNAME' | sed "s/env.LOGNAME/$LOGNAME/"
var logName = wy
```


## awk

_推荐阅读 **The AWK Programming Language** 详细学习 AWK。_

AWK 程序的结构类似于:

```
pattern { action }
pattern { action }
```

针对每一个匹配的 pattern，执行对应的 action。

**注意：** 这里 action 前后需要有一个空格。

### 内建变量

|变量|解释|
|:-|:-|
|$0 | 当前记录（这个变量中存放着整个行的内容）|
|$1~$n 当前记录的第n个字段，字段间由FS分隔|
|ARGC|number of command-line arguments|
|ARGV|array of command-line arguments|
|FS | 输入字段分隔符 默认是空格或Tab|
|NF | 当前记录中的字段个数，就是有多少列|
|NR | 已经读出的记录数，就是行号，从1开始，如果有多个文件话，这个值也是不断累加中。|
|FNR| 当前记录数，与NR不同的是，这个值会是各个文件自己的行号|
|RS | 输入的记录分隔符， 默认为换行符|
|OFS| 输出字段分隔符， 默认也是空格|
|ORS | 输出的记录分隔符，默认为换行符|
|FILENAME | 当前输入文件的名字|
|RLENGTH|length of string matched by match function|
|RSTART|start of string matched by match function|
|SUBSEP|subscript separator|

### pattern

pattern 是一些数值比较，正则匹配，字符串比较等，只有满足条件才能执行后面的 action

```
$2 > 3
$1 == 'Mary'
$3 >= 20
!($3 > 20)
/Beth/
$2 > 20 || $3 < 30
```

以上都是合法的 pattern。如果没有提供 pattern 后面的 action 会始终被执行。

pattern 可以是数值或者字符串的比较，如果比较双方是一个数字和一个字符串，那么数字会被转换为字符串。

如果 pattern 是正则表达式，存在以下三种形式：

- `/regexpr/`：整行存在匹配
- `expression ~ /regexpr/`：expression 匹配
- `expression !~ /regexpr/`：expression 不匹配

pattern 还可以是两个，使用逗号隔开

```
pattern1, pattern2 {
    print
}
```

两个 pattern 中间使用 `,` 隔开，这会匹配一个范围。pattern1 和 pattern2 都会匹配某些行。这个范围就是介于 pattern1 第一次匹配的行，和 pattern2 最后一次匹配的行之间的所有行，比如：

```sh
NR == 3, NR == 8 {
    print
}
```

这会匹配 3~8 行。

### BEGIN & END

BEGIN 里面的语句会在开始处理第一行之前执行，而 END 会在处理完最后一行后执行。


```awk
BEGIN {
    print "----HEAD-----"
}

{
    print
}

END {
    print "----END------"
}
```

以上 awk 语句在起始和结尾加上了一行内容。

### 控制语句和操作符

AWK 的控制语句包括：


- printf(format, expression-list)
- if (expression) statement
- if (expression) statement e l s e statement
- while (expression) statement
- for (expression ; expression ; expression) statement
- for (variable i n array) statement
- do statement while (expression)
- break
- continue
- next
- exit
- exit expression

用法和 C 语言一样。

操作符号也和 C 语言一样，逻辑运行，条件表达式等也和 C 语言一样

### 内建函数

#### 数学函数：

|FUNCTION | VALUE RETURNED|
|:--|:---|
|atan2(y,x) | arctangent of y/x |
|cos(x) | cosine of x, with x in radians|
|exp(x) | exponential function of x, e^x|
|int(x) | integer part of x; truncated towards 0 when x > 0|
|log(x) | natural (base e) logarithm of x|
|rand() | random number r, where 0 <= r < 1|
|sin(x) | sine of x, with x in radians|
|sqrt(x) | square root of x|
|srand(x) | x is new seed for rand()|

#### 字符串函数：

|函数|解释|
|:--|:--|
|gsub(r,s) | 在整个$0中用s替代r|
|gsub(r,s,t) | 在整个t中用s替代r|
|index(s,t) | 返回s中字符串t的第一位置|
|length(s) | 返回s长度|
|match(s,r) | 测试s是否包含匹配r的字符串|
|split(s,a,fs) | 在fs上将s分成序列a|
|sprintf(fmt,exp) | 返回经fmt格式化后的exp|
|sub(r,s) | 用$0中最左边最长的子串代替s|
|substr(s,p) | 返回字符串s中从p开始的后缀部分|
|substr(s,p,n) | 返回字符串s中从p开始长度为n的后缀部分|

## tar

tar 命令用来将多个文件或文件夹归档至单个文件。

### 使用 tar 对文件进行归档

```
tar -cf output.tar file1 file2 file3
```

`-c` 代表 create，`-f` 代表 specific file

`-f` 必须在最后一个，后面紧跟目标 tar 文件

### 使用 -t 和 -v 选项查看归档细节


```
tar -cvtf output.tar file1 file2 file3
```

### 使用 `-r` 向归档文件中追加文件

```
tar -rf output.tar file4
```

### 使用 `-x` 选项将归档文件中的内容提取出来

```
tar -xf archive.tar
```

可以使用 `-C` 选项来指定提取到的目录

```
tar -xf archive.tar -C /home/code
```

也可以只提取部分文件

```
tar -xf archive.tar file1 file2
```

这样就只提取 file1, file2 到当前目录

### 配合 stdin 和 stdout 使用

```
tar -cvf - file1 file2
```

### 使用 `-A` 选项拼接两个归档文件


```
tar -Atf archive1.tar archive2.tar
```


### 使用 `-u` 来更新 tar 包中的文件

```
tar -uf archive.tar file1
```

只有 file1 比 tar 包中的 file1 更新的时候才起作用

### 使用 `-d` 来比较 tar 包中的文件与文件系统的差异


```
tar -df archive.tar file1
```

### 从 tar 包中删除指定文件

```
tar -f archive.tar --delete file1 file2
```

### 压缩 tar 包

tar 包只是归档，但没有压缩，通常使用不同的压缩方式，会给 tar 包指定不同的后缀

- gzip: file.tar.gz，使用 -z 选项
- bunzip2: file.tar.bz2，使用 -j 选项
- lzma: file.tar.lzma，使用 --lzma 选项

也可以不指定压缩方式，使用 `-a` 选项，tar 能根据指定的 tar 包的后缀来选择使用合适的压缩方式。

### 使用 `--exclude` 来排除部分文件

因为 tar 在指定文件的时候可以使用通配符，因此可以使用该选项来排除部分文件




## gzip

gzip 用来压缩文件，且只能压缩单个文件，多个，需要先使用 tar 命令打包，然后再压缩

### 压缩文件

```
gzip file
```

### 解压缩

```
gunzip file.gz
```

### 列出压缩文件的信息

```
gzip -l test.txt.gz
```

### 使用 stdin 和 stdout

```
cat file | gzip -c > file.gz
```

使用 -c 可以指定将压缩结果输出到 stdout，然后利用管道定向到一个文件中


### 指定压缩级别

使用 `--fast` 和 `--best` 来指定压缩率最低和最高的压缩级别
