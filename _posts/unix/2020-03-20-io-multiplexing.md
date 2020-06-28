---
layout: post
title: I/O 多路复用
category: UNIX 编程
---



设想一个聊天程序，需要从标准输入上读取用户输入，同时需要在套接字上读取其他用户发来的消息。如果采用阻塞 I/O，那么需要在多个线程里面来读取。采用非阻塞 I/O，可以在多个文件描述符上面轮询。以上两种方法，都不够好。前者涉及到多个线程，比较麻烦，后者，会造成不少的性能损耗。

I/O 多路复用，允许我们同时检查多个文件描述符的就绪状态。通俗一点讲，用户传给内核一组文件描述符，然后让内核在这些文件描述符上可以读或写的时候告诉用户。这样，用户大多数时间都在等待操作系统的通知。接到通知后，根据通知信息就知道那个文件描述符上可以进行 I/O 操作了。这能大大降低编码难度。

在 Linux 平台上，可以使用 `select` / `poll` / `epoll` 来完成实现上述的功能。

- *
{:toc}

## select

select 的函数声明如下：

```c
int select (int nfds, fd_set *readfds, fd_set *writefds, fd_set *exceptfds, struct timeval *timeout);
```

前面提到，告诉操作系统那些描述符上的那些事件需要被监听，这里事件就是可读、可写、异常。`select` 使用三个 `fd_set` 来接收用户的输入。如果这些文件描述符中的任何一个符合要求，`select` 就返回。

- `nfds` 为最大的文件描述符+1。
- `readfds` 为需要读取的 fd，如果这些 fd 中的一个变为可读状态，select 返回。
- `writefds` 中为需要写的 fd，同上，如果有可读的 fd，就返回。
- `exceptfds` 为需要捕获异常的 fd。
- `timeout` 参数可以指定 select 的阻塞时间。如果为 null，那就一直阻塞，否则阻塞指定时长。

`fd_set` 通常用一个含 32 个元素的长整形数组来存储文件描述符，每一个 bit 记录一个文件描述符，比如数组中的第一个元素记录文件描述符 `0~63`。最大能记录文件描述符 1023。但是不应该假设 `fd_set` 的实现，把它当做对用户透明，操作 `fd_set` 的时候需要使用一组宏。

- `FD_ZERO(&set)` 将 set 清空
- `FD_SET(fd, &set)` 把一个 fd 加入 set
- `FD_ISSET(fd, &set)` 检查一个 fd 是否被设置
- `FD_CLR(fd, &set)` 从 set 中清除一个 fd

在调用 `select` 之前，需要使用上面这些函数来将感兴趣的 fd 加入相应的集合中。`select` 调用会修改这些集合，修改后的集合中，存放的就是处于就绪状态的文件描述符。因此，`select` 返回后，对某个先前加入的 fd 需要在 `fd_set` 中检查是否包含，如果包含，说明这个 fd 上的事件触发了。

使用 `select` 的基本套路如下：

```c
// 初始化 fd_set
fd_set rset;
FD_ZERO(&rset);

for(;;){
    // 将感兴趣的 fd 加入 set
    FD_SET(fd1, &rset);
    FD_SET(fd2, &rset);
    
    // 调用 select
    int maxfd = max(fd1, fd2);
    int num_ready = select(maxfd+1, &rset, nullptr, nullptr, nullptr);

    // 判断各 fd 是否处于就绪状态
    if(FD_ISSET(fd1, &rset)){
        read(fd1, buf, MAXLEN);
        //...
    }
    
    if(FD_ISSET(fd2, &rset)){
        read(fd1, buf, MAXLEN);
        //...
    }
}
```

1. 先创建一个 set，然后把感兴趣的文件描述符加进入
2. 调用 select，select 阻塞，直到有文件满足条件（可读或可写）
3. select 返回后，会修改传入的 fd_set 把满足条件的 fd 置位
4. 调用 `FD_ISSET` 来检查各个 fd，结果为 true 的，就是可以进行 IO 操作的
5. 进行 IO 操作
6. 重新设置 fd_set，因为 fd_set 会被 select 修改。传给 select 的是感兴趣的 fd，select 返回的是满足条件的 fd

### select 例子

下面是一个使用 `select` 的例子，建立与某个服务器的连接，用键盘读取输入，把输入发送到远端服务器，收到远端服务器的发来消息后，打印在控制台上。

下面代码中使用到的 `Socket` 类可以在 [https://github.com/wy-ei/ws/blob/master/net/Socket.h](https://github.com/wy-ei/ws/blob/master/net/Socket.h) 找到。

```cpp
#include <unistd.h>
#include <fcntl.h>
#include <sys/select.h>
#include <errno.h>
#include "Socket.h"

int main(int argc, char *argv[]){
    // 对 socket 进行了简单的封装，这里实际是创建了一个套接字，同时连接到 127.0.0.1:8001
    Socket sock(AF_INET, SOCK_STREAM);
    sock.connect({"127.0.0.1", 8001});

    char buffer[1024];
    while(true){
        timeval timeout;
        timeout.tv_sec = 2;
        timeout.tv_usec = 0;

        // 设置 fd_set
        fd_set read_fds;
        FD_ZERO(&read_fds);
        FD_SET(sock.fd(), &read_fds);
        FD_SET(STDIN_FILENO, &read_fds);
        int max_fd = sock.fd();

        // 调用 select
        int n = select(max_fd+1, &read_fds, nullptr, nullptr, &timeout);

        if(n == -1){
            perror("select");
            exit(1);
        }

        if(n > 0){
            // socket
            if(FD_ISSET(sock.fd(), &read_fds)){
                int len = read(sock.fd(), buffer, sizeof(buffer));
                write(STDOUT_FILENO, buffer, len);
            }
            // 标准输入
            if(FD_ISSET(STDIN_FILENO, &read_fds)){
                int len = read(STDIN_FILENO, buffer, sizeof(buffer));
                write(sock.fd(), buffer, len);
            }
        }else{
            printf("no input arrive after %ld sec\n", timeout.tv_sec);
        }
    }
}
```


### select 的实现原理

在一个循环里面，检查 `fd_set` 中的每个 fd，调用驱动程序查看该 fd 上是否存在读写等操作，如果有就可以返回了，如果没有就让进程休眠。当某个 fd 上存在 I/O 操作时，设备驱动程序的会唤醒该进程。进程再次检查，此时会发现存在 I/O 操作的 fd，此时可以返回。

`select` 可以监听 1024 个文件描述符，这里的 1024 是指 `0~1023`，如果文件描述符的值大于等于 1024，那么基于位图实现的 `fd_set` 就没法记录它了。`select` 返回的不是就绪的文件描述符个数，而是就绪的事件个数。如果将同一个文件描述符加入到读和写两个 set 中，若此文件既可读也可写，此时 select 将会返回 2。

`select` 的第一个参数是最大文件描述符加 1，该参数可以减少 `select` 内部的检查范围，即，不需要遍历所有 1024 个 bit。但是我觉得这收益很小，在 select 的实现中，通常一次性检查 64 位，即判断长整型是否为 0，因此，缩小检查范围带来的收益很小。


## poll

`poll` 和 `select` 执行分任务很相似，区别在于如何指定待检查的文件描述符。在 `poll` 中，我们提供一系列的文件描述符，并在每个文件描述符上标明我们感兴趣的事件。

```c
int poll(struct pollfd fds[], nfds_t nfds, int timeout);


struct pollfd{
    int fd;
    short events;
    short revents;
}
```

其中 `events` 和 `revents` 都是位掩码，后者由 `poll` 函数设置，作为返回值。

timeout 决定了 poll 的阻塞行为：

- timeout == -1：poll 会一直阻塞，知道有文件描述符达到就绪状态
- timeout == 0：poll 检查各文件描述符，看看那些处于就绪状态，然后立刻返回
- timeout > 0：poll 至多阻塞 timeout 毫秒

## select 和 poll 的区别

1. 因为 fd_set 可存放的 bit 有限，因此 select 可以监听的文件描述符存在上限，而 poll 理论上没有上限（有多少描述符就可以监听多少）
2. `select` 使用 `fd_set` 作为输入和输出，因此每次迭代都需要设置 `fd_set`，而 `poll` 使用分立的 `events` 和 `revents`，可以避免重复设置。
3. select 提供的超时精度为微秒，poll 提供的精度为毫秒。
4. 如果某个监听的文件描述符被关闭了，select 返回 -1，表示出错，而 poll 能告知那个文件描述符被关闭了。

## select 和 poll 存在的问题

1. 每次调用，内核都需要检查所有指定的文件描述符，看它们是否就绪。当文件描述符很多的时候，会耗费很多时间。
2. 每次调用 select 和 poll 时，程序都必须传递文件描述符的数据到内核，从用户空间和内核空间来回拷贝数据将占用大量 CPU 时间。
3. select 和 poll 调用完成后，程序必须逐个检查。

综上，随着监听的文件描述符增多，select 和 poll 消耗的时间会增多。


## 文件描述符何时就绪

对 I/O 函数的调用如果不会阻塞，此时文件描述符被认为是就绪的。

- 普通文件：始终就绪，因为 read 会返回数据、EOF、错误。write 总会写数据或者出错。
- 管道和FIFO：无论管道中是否有数据，read 都能立刻返回（数据或EOF），因此读始终是就绪的。如果有空间可写，写就是就绪的。
- 套接字：有输入、有新连接、对端关闭，读都是就绪的。输出缓冲区有空间时，或者对端关闭，写就绪。接收到带外数据，出现异常。


## epoll

`epoll` 是 Linux 2.6 中新增的，可以实现与 `select` 和 `poll` 相同的功能，但是功能比这两者要强不少。`epoll` 可以监听大量的文件描述符，且支持边沿触发。

```c
int epoll_create(int size)
```

`epoll_create` 返回创建的 epoll 文件描述符，这个文件描述符是一种抽象的概念，并不能进行读写操作。当 epoll 不使用的时候，使用 `close` 关闭。


```c
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *ev);
```

`op` 可取值如下:

- `EPOLL_CTL_ADD`: 将 fd 添加到 epoll 实例的兴趣列表中，对于 fd 上感兴趣的事件，可以使用 ev 指定
- `EPOLL_CTL_DEL`: 移除
- `EPOLL_CTL_MOD`: 修改 fd 上的 epoll_event


```c
struct epoll_event{
    uint32_t events;  // 位掩码
    epoll_data_t data;
}
```

`epoll_data` 是个联合体，用来在 `event` 上记录一些信息，在 `select` 中 fd 是通过 `fd_set` 中位图的位置决定的，在 `poll` 中也有相应的字段来记录 fd。在 `epoll` 自然也要能够记录 fd，不过 `epoll` 给用户更大的自由，可以在 event 上关联多种类型的信息。

```c
typedef union epoll_data{
    void *ptr;
    int fd;
    uint32_t u32;
    uint64_t u64;
} epoll_data_t;
```

```c
int epoll_wait(int epfd, struct epoll_event *evlist, int maxevents, int timeout)
```

evlist 为返回值，空间由调用者申请，最大大小由 `maxevent` 指定。返回回来的 `epoll_event`，可以通过 `events` 字段获知发生的事件，从 data 来确定事件对应的文件描述符。因此在使用 `epoll_ctl` 添加文件描述符的时候，就需要在 `ev->data` 中加入合适的数据来标识该文件描述符。

### epoll 的例子

这里我把前面 `select` 的例子改成使用 `epoll`

```cpp
#include <unistd.h>
#include <fcntl.h>
#include <sys/epoll.h>
#include <errno.h>
#include "Socket.h"


int main(int argc, char *argv[]){
    Socket sock(AF_INET, SOCK_STREAM);
    sock.connect({"127.0.0.1", 8001});

    int efd = epoll_create(5);
    epoll_event ev{};

    ev.events = EPOLLIN;
    ev.data.fd = sock.fd();
    epoll_ctl(efd, EPOLL_CTL_ADD, sock.fd(), &ev);

    ev.events = EPOLLIN;
    ev.data.fd = STDIN_FILENO;
    epoll_ctl(efd, EPOLL_CTL_ADD, STDIN_FILENO, &ev);


    epoll_event events[10];
    char buffer[1024];
    while(true){
        int ms = 3000;
        int n = epoll_wait(efd, events, 10, ms);
        if(n == -1){
            perror("epoll_wait");
            exit(1);
        }
        if(n == 0) {
            printf("no input arrive after %d ms\n", ms);
            continue;
        }

        for(int i=0; i < n;i++){
            int fd = events[i].data.fd;

            if(fd == sock.fd()){
                int len = read(sock.fd(), buffer, sizeof(buffer));
                write(STDOUT_FILENO, buffer, len);
            }
            if(fd == STDIN_FILENO){
                int len = read(STDIN_FILENO, buffer, sizeof(buffer));
                write(sock.fd(), buffer, len);
            }
        }
    }
}
```

### epoll 底层工作原理

`epoll_create` 会创建一个红黑树，红黑树的每个节点记录了一个文件描述符的信息，包括期待发生的事件类型。在使用 `epoll_ctl` 添加/删除/修改文件描述符和监听事件的时候，这些信息都会反映在在红黑树上。

红黑树上每个节点都会注册一个回调函数，这个回调函数由设备驱动程序调用，当调用这个该函数时，就意味着有 IO 操作发生在该文件上了。这个时候可以讲该节点加入到 `ready_list` 中。

`epoll_wait` 就是等待设备驱动程序调用回调函数，当 `ready_list` 上有数据的时候，就将其拷贝到用户空间，然后返回。


## 文件描述符准备就绪的通知模式

在 I/O 多路复用中，存在两种通知模式，即水平触发(Level Trigger)、边缘触发(Edge Trigger)。初次看到这两个词的时候，挺莫名其妙的，这好像是电子领域的两个词。了解一下在电子工程里面这两个词的意思，有助于我们理解这两种通知模式。

如果有过给单片机编程的经验，单片机有时候需要检测外部设备的状态，但是又不能不停的轮询，此时就会使用外部中断。把外设接到单片机的某个引脚上，对于单片机而言，外设就是一个输入。外设有什么变化就会通知单片机，单片机的中断就会被触发。在设置外部中断的时候，常常会涉及到电平触发或者边缘触发，如果细分就是高/低电平触发，上升沿/下降沿触发。高电平触发，给中断引脚输入一个高电平时，就会触发中断。上升沿触发，输入电平由低电平变为高电平的时，会触发中断。电平触发模式下，比如高电平触发，当高电平存在时，就会一直触发，直到高电平消失。而边缘触发模型下，如上升沿触发，电平状态由低电平变为高电平时会触发。

回到 I/O 多路复用模型的水平触发和边缘触发上，这里没有高低电平触发的说法，也没有上升沿下降沿的说法。我觉得它是借鉴了电子领域的术语。

### 1. 水平触发

如果文件描述符上存在可读或者可写的数据，换句话说可以无阻塞地执行 I/O 操作时，这个时候就会触发通知。如果这种状态一直持续（数据未读完、可以写数据），那么就会不断地触发。在读取的场景下，使用水平触发模式，如果没有一次性读完，那么下一次再次得到通知。 

对于写场景，虽然当前处于可写状态，但是如果写入的数据量很大，那么就会阻塞。

### 2. 边缘触发

边缘触发，显然就是文件描述的状态发生了改变，比如从不可读变成了可读，或者从不可写变成了可写，这个时候会触发通知。比如一个读取场景，如果文件描述符上有数据时，会收到通知，如果数据没有读完，将不会再次收到通知。直到有新数据写入时，才会再次触发通知。因此，使用边缘触发时，在读取数据时，要一次性把可读的数据都读完，否则在下次对方写数据之前，收不到任何通知。

因为需要一次性把所有可读的数据全部读出来，因此在读取数据的时候，往往要在一个循环中不断读取。这种场景下，判断读取完毕的一种可能的依据是缓冲区是否读满，比如接收缓存区是 100 字节，而只读取到了 60 字节，那说明已经读完了。但是如果恰好有 100 字节可读，此时会觉得还存在数据，其实已经没有数据可读了。再次读取的时候，由于没数据可读，因此就会阻塞。因此这种方法并不可靠。

在使用边缘触发模式时，通常采用非阻塞模式进行读取。非阻塞模式下，如果当前没有数据可读，读取操作(read)就会立刻返回，返回值为 -1，并设置 `errno` 为 `EAGAIN` 或者 `EWOULDBLOCK`。

下表中总结了 I/O 多路复用、信号驱动 I/O 、epoll 采用的通知模式。epoll 可以通过配置选择通知模式。

|I/O 模式|水平触发|边缘触发|
|:------|:------|:------|
|select, poll|yes  |no   |
|信号驱动 I/O|no   | yes |
|epoll  |yes      | yes |