## 原子操作和竞争条件

多个进程向文件尾部追加内容，如果使用下面的代码，就会出现 bug，因为在执行完 `lseek` 之后，有可能另一个进程执行了写操作，当前进程随后的 `write` 操作就会覆盖另一个进程写入的内容。

```c++
if(lseek(fd, 0, SEEK_END) == -1){
    errExit("lseek");
}
if(write(fd, buf, len) != len){
    fatal("Partial/failed write");
}
```

在打开文件的时候，使用 `O_APPEND` 标志，可以保证写入操作是以追加的形式进行的。


## `/dev/fd` 目录

对于每个进程，内核都提供一个特殊的虚拟目录，其中包含 `/dev/fd/n` 形式的文件名，这里的文件 n，就是文件描述符 n 所指的文件。

```c++
fd = open("/dev/fd/1", O_WRONLY);
fd = dup(1);
```

以上两行代码是等价的。

## 创建临时文件

有些程序需要的运行时创建一些临时文件，在程序运行完毕后立刻删除。

```c++
#include <stdlib.h>

int mkstemp (char *__template)
```

其用法如下：

```c++
char tmp[] = "/tmp/file_XXXXXX";
int fd = mkstemp(tmp);
printf("generated filename was: %s\n", tmp);
unlink(tmp);

/* use file */

close(fd);
```

传入的文件名是一个模板，最后 6 个字符一定是 `XXXXXX`，系统将会修改这 6 个字符，构造出一个唯一的文件名，并创建文件并打开，返回文件描述符。因为该函数会修改参数，因此参数不能是字符串常量。

为了避免其他用户和进程看到此文件，在创建完成后可以立刻调用 `unlink`，该文件就会立刻被从文件系统中删除，但只有再 close 的时候，其引用的 inode 才会被删除。在 close 之前，内存中存有文件表，可以正常使用该文件。

另一个函数是：

```c++
#include <stdio.h>
FILE *tmpfile();
```

该函数打开一个以读写方式打开的流，在关闭流的时候，文件会自动删除。