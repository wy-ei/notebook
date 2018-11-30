---
layout: post
title: 常用的 Shell 命令
category: Unix/Linux
tag:
  - 命令行工具
  - Shell
---

* toc
{:toc}

## find

find 命令会沿着文件层次向下遍历，匹配符合条件的文件，然后执行响应的命令。

### 列出某个目录下的所有文件

```sh
find ./src -print
```

`-print` 是默认的，对输出的文件名使用 `\n` 分隔，也可以使用 `-print0` 这个时候会使用 `\0` 作为分隔符。

### 使用文件名来搜索

`-name` 选项的参数指定了文件名中必须包含的字符串。文件名中可以包含通配符。

```sh
find ./src -name "*.js" -print
```
这会打印出所有在 `src` 目录下的 js 文件

使用 `-iname`，忽略大小写，其他同 `-name`


### 从 path 中进行搜索

使用 name 选项之会考虑文件名，使用 `-path` 选项后，会在在文件的完整路径中进行匹配

```sh
find ./src -path "*/css/*"
```

搜索 src 下面 css 目录中的所有文件

### 使用正则来搜索

使用正则表达式，根据文件的完整路径来进行搜索

```sh
find ./src -regex ".*\.md$"
```

寻找到所有的 markdown 文化（以 `.md` 结尾），注意这里的正则表达式需要完全匹配文件路径才行，而不是只匹配其中的一部分。

使用 `-iregex`，忽略大小写，其他同 `-regex`

### 否定参数

```sh
find ./src ! -name "*.js"
```

使用一个 `!` 来将条件置反，以上命令搜索 `src` 下不是 js 的文件

所有的选项都可以使用 `!` 来取反，只需要将其放在选项前面：

```sh
find . ! -name "*.js" -atime +7 ! -type f
```

### 基于目录深度

使用 `-mindepth` 和 `-maxdepth` 来指定最小或最大的搜索深度

### 根据文件类型搜索

使用 `-type` 选项搜索指定类型的文件。这里的类型也就是 `ls -l` 命令打印出的文件列表的第一个字符。

```
-rw-r--r--   1 wangyu  staff   1857  8 21 16:58 style.css
drwxr-xr-x   4 wangyu  staff    136 11 16 21:35 typings
-rw-r--r--   1 wangyu  staff     87 11 16 21:35 typings.json
drwxr-xr-x   4 wangyu  staff    136 11 29 20:28 webpack
-rw-r--r--   1 wangyu  staff    612 12  1 15:55 yarn.lock
```

### 根据文件时间进行搜索

- `-atime`：最后一次访问文件的时间
- `-mtime`：最后一次修改文件的时间
- `-ctime`：文件元数据最后一次被修改的时间

这些选项的参数通常使用整数指定，并带一个 `-`（表示小于） 或 `+`（表示大于）。

比如：

- 找出七天内被访问过的文件

```
find . -type f -atime -7
```

`-atime`,`-mtime`,`-ctime` 都是以天为单位的，可以使用 `-amin`,`-mmin`,`-cmin` 来以分钟为单位进行搜索。

另外，还可以使用 `-newer` 选项来指定一个文件，使用找出被这个文件的修改时间更近的其他文件：

```sh
# 找出所有比 `file1.txt` 修改时间更晚的文件。
find . -newer file1.txt
```


### 基于文件大小的搜索

使用 `-size` 选项可以指定满足条件的文件大小。

```sh
# 找到所有小于 2k 的 js 文件
find . -size -2k -name "*.js"
```

除了 k 以外，还可以指定其他单位：

- b：磁盘上的一块，512 字节
- c：字节
- w：字，2字节
- k：1024 字节
- M：1024k
- G：1024M

### 删除匹配的文件

使用 `-delete` 选项可以删除搜索到的文件

```sh
find . -name "*.swp" -delete
```

### 基于文件权限来搜索

`-perm` 选项可以根据文件权限进行匹配

```sh
# 找出文件权限为 644 的文件
find . -perm 644
```

使用 `-user` 选项还可以搜索某个用户的文件


### 对 find 得到的结果执行命令

比如希望统计所有满足 find 条件的文件的行数，使用 `-exec` 选项可以轻松做到：

```
find . -name "*.sh" -exec wc -l {} \;
```

对于每一个搜索结果，这里的 `{}` 都会被替换为相应的文件名，而后面的 `\;` 则表示 exec 参数的结束，之所以需要加 `\` 是为了转译，在 shell 中，`;` 是有特殊意义的。你也可以将 `\;` 换做 `';'`，效果一样，都是不让 shell 对它进行转译。


### 跳过某些目录

```
find . \(  -name ".git" -prune \) -o \( -type f -print \)
```

这里使用圆括号和 `-o` 分了两个组，`-prune` 是指去除满足该分组条件的文件，而 `-print` 是指打印满足该分组条件的文件。

## cat

cat 用于输出一个文本中的内容，或者使用管道输出标准输出中的内容，最常见的用法如下：

```
cat file1.txt file2.txt

echo 'hello' | cat
```

cat 还有其他的一些技巧：

### 组合标准输出和文件的内容

要将标准输入的内容和另外一个文件的内容拼起来得到一个新的文件

```
ls | cat - file1.txt > file2.txt
```

这里的 `-` 是一个占位符，表示标准输出，这样标准输出的内容和 file1.txt 的内容就被组合起来添加到 file2.txt 中了。

### 删除多余空行

加上 `-s` 选项，相邻的空白行会被压缩

### 打印行号

`-n` 选项可以打印行号。`-b` 选项也可以打印行号，且会跳过空白行。

### 使用特殊字符表示制表符

`-t` 选项，可以将制表符打印为 `^I` 便于发现这些隐藏符号。

## xargs

利用管道可以轻松地将标准输出重定向至标准输入。比如：

```sh
cat main.cpp | wc -l
```

但是，有的时候希望将标准输出作为某个命令的参数传入。比如：

一个文件（list.txt）中有以下内容，其中包含的是一些文件名，现在希望统计这些文件的行数

```
ex1.sh
ex2.sh
ex3.sh
```

希望执行的命令应该是 `wc -l ex1.sh ex2.sh ex3.sh`，使用管道肯定是不能达成希望的。

这个时候就需要使用 xargs 命令了，这个命令可以轻松地**将标准输入进行一些转换，然后传给一个命令作为参数**，xargs 以标准输入作为数据源。因此常见的用法是结合管道使用，上面案例使用 xargs 的解法如下：

```sh
cat list.txt | xargs wc -l
```

这样 list.txt 中的内容，就作为 wc 命令的参数传入了。xargs 可以对传入命令的参数做更精细的控制：


### 格式化参数

#### 将多行输入转换为单行输出

上面的 `list.txt` 中的内容是多行的，经过了 xargs 之后就变成单行的了。

```
$ cat list
ex1.sh
ex2.sh
ex3.sh

$ cat list | xargs
ex1.sh ex2.sh ex3.sh
```

#### 将单行输入转换为多行输出

使用 `-n` 选项可以指定每行的最大参数数量，这里会使用默认定界符（空格）来将标准输入进行切分，然后每行显示指定数量的参数。

```
$ cat line.txt
1 2 3 4

$ cat line.txt | xargs -n 2
1 2
3 4
```

### 读取 stdin 将其进行格式化后传给命令

使用 `-n` 选择，可以指定每次传给命令的最大参数个数：

```sh
$ echo "1 2 3 4" | xargs -n 2 echo  # 每次传入最多两个参数
1 2
3 4

$ echo "1 2 3 4" | xargs -n 3 echo  # 每次传入最多 3 个参数
1 2 3
4
```

很多时候，一个命令还需要传入其他的一些选项，而且参数的传入顺序是固定的，这个时候可以使用占位符

```sh
$ echo "1 2 3 4" | xargs -n 1 -I {} printf "%s --> %s\n" {} {}
1 --> 1
2 --> 2
3 --> 3
4 --> 4
```

这里 `-I` 指定了占位符号 `{}` 后面所有的 `{}` 都会被参数所代替，这里的 `{}` 并没有什么特别意义，可以使用 `-I` 指定其他字符。


### 结合 find 使用 xargs

xargs + find 可以做很多有用的事情，但要注意别使用错误的方法

```sh
find . -type f -name "*.txt" -print | xargs rm -f
```

这个时候如果文件名中存在空格，比如 `lib xxx.md`，xargs 使用空格作为定界符，就会将它误认为是 `lib` 和 `xxx.md`，因此在 find 中要使用 `-print0` 来输出，在 xargs 中要使用 `\0` 来作为定界符。

 ```sh
find . -type f -name "*.txt" -print0 | xargs -0 rm -f
```

在 xargs 指定 `-0` 就可以指定其使用 `\0` 来作为定界符。



### 题外话

在 shell 中使用括号括起来的命令会在子 shell 中执行：

```
ls ; (cd ..; ls); ls
```

括号中的 cd 之后改变括号里面的语句执行时的目录，而不会影响第三个 ls 执行时候的目录。



## tr

tr 命令用来转换字符，它将字符从一个集合映射到另外一个集合。其基本用法如下：

```sh
tr [options] charset1 charset2
```

将 charset1 中的字符转换为 charset2 中对应的字符，需要注意的是 charset1 和 charset2 的长度理论上应该相等，这样才能实现字符的一一映射。

如果 charset1 的长度大于 charset2，那么 charset2 会重复最后一个字符，直到长度相等。如果 charset2 的长度大于 charset1，那么多出来的字符会被忽略掉。

### 将字符串转换为大写

```
echo "hello world" | tr "a-z" "A-Z"
```

`a-z`, `A-Z`, `0-9`, `A-Z0-9` 这都是合法的字符集

### 用 tr 删除字符

使用 -d 选项，可以删除集合中的字符。

```
$ echo 'A1B2C3' | tr -d "1-9"
ABC
```

### 使用字符补集来删除字符

使用 -c 选项，可以指定一个字符集，配合 -d 使用，会只保留集合中的字符

```
$ echo 'A1B2C3' | tr -d -c "A-Z"
ABC
```

### 删除重复字符

使用 -s 选项，可以指定一个字符集，tr 会将存在于该字符集中的重复字符压缩至 1 个。

```
$ echo 'AAA-BBB-C' | tr -s "AB"
A-B-C
```

### tr 还可以使用字符类来表示集合

- `[:alnum:]`：字母和数字
- `[:alpha:]`：字母
- `[:cntrl:]`：控制（非打印）字符
- `[:digit:]`：数字
- `[:graph:]`：图形字符
- `[:lower:]`：小写字母
- `[:print:]`：可打印字符
- `[:punct:]`：标点符号
- `[:space:]`：空白字符
- `[:upper:]`：大写字母
- `[:xdigit:]`：十六进制字符

用法:

```
echo "AB" | tr "[:upper:]" "[:lower:]"
```

## sort

sort 用来对文本中的每一行进行排序。

示例：

```sh
# 默认排序
sort file.txt

# 按数学顺序排序
sort -n file.txt

# 逆序排序
sort -r file.txt

# 判断文件是否经过排序
sort -c file.xtt
```

### 根据键或列来排序

常常看到这样的文本内容，希望以每行的数字来进行排序

```
james 23
kobe 24
wade 3
```

这类文件的内容，使用分隔符分为了多列，利用 sort 的 `-k` 选项可以指定以第几列作为排序的依据:

```sh
# 依据第二列，按数字顺序排序
cat list.txt | sort -nk 2
wade 3
james 23
kobe 24
```

有的时候文本并没有使用空格隔成列，比如：

```
b78434
s89988
c89878
```

这是一列列编号，假如希望以其中第 2 和第 3 个字符来进行排序，可以这样：

```
cat No.txt | sort -nk 2,3
```

这里的 `2,3` 指定了起始位置。

## uniq

uniq 用来消除重复的行。它只能接受排序后的内容作为输入，基本用法如下：

```
sort file.txt | uniq
```

### 显示唯一的行

使用 `-u` 选项，只显示唯一的行，而不是多行被压缩至一行。

### 显示重复次数

使用 `-c` 选项，可以显示每一行重复出现的次数。

### 找出重复的行

使用 `-d` 选项，可以找到那些重复出现的行。

### 指定比较的区间

如果 sort 可以使用 -k 选项指定每行中要进行比较的内容一样，uniq 也可以指定，它是通过 `-s` 和 `-w` 来完成的

- `-s`：指定可以跳过前 n 个字符
- `-w`：指定用于比较的最大字符数


## mktemp

这个命令用来生成临时文件或临时文件夹，常常需要一个临时文件来保存一些内容，这个时候该命令就很有用了。

```sh
# 创建临时文件
file=`mktemp`

# 创建临时目录
dir=`mktemp -d`

# 仅仅生成文件名，而不实际创建文件或目录
tmpfile=`mkdir -u`

# 根据模板来创建，这里的 XXX 会被替换为随机字符，至少要保证存在 3 个及 3 个以上的 X
mktemp test.XXX
```

## 生成任意大小的文件

dd 命令可以用来生成指定大小的文件，其使用方法如下：

```
dd if=/dev/zero of=junk.data bs=1M count=1
```

其中各个字段的意思是：

- if：input file，默认 stdin
- of：output file，默认 stdout
- bs：块大小，可以是 1k 1G 等
- count：需要多少块

## 文本文件的交集和差集

comm 命令用来比较两个排过序的文件

## 设置文件权限

```sh
# 设置权限
$ chmod u=rwx g=rw o=r filename
$ chmod 764 filename

# 给某类用户增加或取消某个权限
$ chmod o+x filename
$ chmod u-x filename
```

- o: other
- u: user
- g: group
- a: all

### 设置粘滞位

粘滞位是一种给目录设置的权限类型，通过给目录设置粘滞位，目录内的文件只有目录所有者才能删除。

```
$ chmod a+t dir_name
```

### 递归地设置权限

使用 `-R` 选项指定以递归的方式修改权限：

```
$ chmod 777 . -R
```

## 链接

链接分为软连接和硬链接，软链接又被称为符号链接。

### 软链接

软链接包含一个绝对路径，指向另外一个文件，被指向的文件可以不存在。被指向的文件被删除后，软连接还存在，只是打不开什么东西了，这和 Windows 中的快捷方式的概念类似。

使用如下命令创建软链接：

```
ln -s app.js app.link.js
```

然后使用 `ls -l` 就能看到：

```
lrwxr-xr-x   1 xxx  yyy     5B 12 11 14:06 app.link.js -> app.js
```

这里指 `app.link.js` 是 `app.js` 的符号链接。

### 硬链接

硬链接存储的是文件的 inode 号，inode 中记录着文件内容在磁盘上存放的位置。因此硬链接实际上是给文件创建了多个别名，每创建一个硬链接，文件的 inode 引用数量就会加 1，这个数量可以在 `ls -l` 得到的结果的第二项中看到，当一个文件删除了以后，这个数量就会减小，直到该数量减到 0 ，文件才会被删除。因此创建了硬链接后删除原文件，不会对链接文件造成影响。甚至可以说它们是相同的，不存在谁是谁的链接这种说法，他们都保存了 inode，通过 inode 来获取到文件信息。


## head

```sh
# 打印前十行
head file

# 打印前 m 行
head -n m file
```

## tail

```sh
# 打印最后十行
tail file

# 打印后 m 行
tail -n m file
```

## 只列出目录

```sh
# 利用目录后的斜杠
ls -F | grep "/$"

# 利用文件的类型
ls -l | grep "^d"

# 使用 find 的 type 选项
find . -type d -maxdepth 1 -print
```

## 使用 pushd 和 popd 来切换目录

在命令行中如果要经常切换目录，恰恰这两个目录又不是父子关系的时候，可能每次都要键入很长的目录。使用 pushd 和 popd 可以将目录压入栈中，便于快速切换。


```sh
# 压栈并切换目录
pushd /var/www

# 回到栈中的第 2 个（从 0 开始计数）目录
push +1

# 查看栈中的内容
dirs

# 回到堆栈中的上一个目录
popd

# 回到之前的目录
cd -
```

## wc

```sh
# 统计行数
wc -l file

# 统计单词数
wc -w file

# 统计 byte 数
wc -c file

# 统计字符数，涉及中文字符的时候使用这个才准确
wc -m file
```

## 打印目录树

```sh
# 只打印目录
tree . -d

# 打印出文件大小
tree . -h
```

## 字符串操作

### 提取部分字符串

针对 `名称.扩展名` 这样的字符串，可以使用 `%` 和 `#` 操作符来提取它的名称和后缀。

- `${VAR%.*}`：从 VAR 中删除 % 右边指定的通配符匹配的字符串，通配符由右向左匹配。
- `${VAR#*.}`：从 VAR 中删除 # 右边指定的通配符匹配的字符串，通配符由左向右匹配。

另外还有 `%%` 和 `##` 他们是 `%` 和 `#` 的贪婪版本。


## cut

cut 是一个可以按列切分文件的工具。使用 cut 可以轻松提取出文本中的某几列，在制作报表的时候很有用。

下面以这个文件为例子:

**list.txt:**

```
file1.txt 1.1kb 2016-10
file2.cpp 2.4kb 2016-11
file3.css 3.1kb 2016-09
```

### 提取特定的列

```sh
# 提取第二列（文件大小），使用空格做定界符
cut -f 2 -d " " list.txt
```

列与列之间总需要有个符号来隔开，默认 cut 使用制表符来分隔，但是这里是空格，因此需要使用 `-d` 选项指明定界符为空格。使用 `-f` 选项指明需要提取第几列。

```sh
# 提取第一列和第二列
cut -f 1,2 -d " " list.txt
```

### 提取字符串的某个范围

可以从每行中提起特定范围的字符串

```sh
# 提取每一行的第一至第二个字符
cut -c 1-2 list.txt

# 提取前三个字符
cut -c -3 list.txt

# 提取从第 3 个字符开始至行位的字符
cut -c 3- list.txt
```


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
