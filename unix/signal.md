## 信号

### signal


### 信号集

```
int sigemptyset (sigset_t *__set)
int sigfillset (sigset_t *__set)
int sigaddset (sigset_t *__set, int __signo)
int sigdelset (sigset_t *__set, int __signo)
```

### 信号掩码

内核会为每一个进程维护一个信号掩码，即一组信号，并将阻塞这些信号向该进程进行传递，直到这些遭到阻塞的信号解除阻塞为止。

有如下方式向信号掩码中添加信号：

1. 当调用某信号处理程序时，可将引发调用的信号添加到信号掩码中。是否添加，取决于安装信号处理程序时的设置。
2. 使用 `sigaction` 函数建立信号处理程序时，可以指定额外一组信号，在调用该处理程序的时候，将这些信号阻塞。目的就是为了避免该信号处理程序被其他信号打断。
3. 使用 `sigprocmask` 系统调用，可以显式地向信号掩码中添加或移除信号。

```c++
int sigprocmask (int __how, const sigset_t *__restrict __set, sigset_t *__restrict __oset);
```

how 可以取3个常量，`SIG_BLOCK`，`SIG_UNBLOCK`，`SIG_SETMASK`，用于说明如何修改掩码。下面是一个例子，注释起来的部分，不会被 `SIGINT` 信号中断。

```c++
sigset_t block_set, old_set;

sigemptyset(&block_set);
sigaddset(&block_set, SIGINT);

sigprocmask(SIG_BLOCK, &block_set, &old_set);

// code that should not be interrupted by SIGINT

sigprocmask(SIG_SETMASK, &old_set, nullptr);
```

### sigaction

```c++
int sigaction (int __sig, const struct sigaction *__restrict __act,
		      struct sigaction *__restrict __oact);

struct sigaction{
    __sighandler_t sa_handler;

    /* Additional set of signals to be blocked.  */
    __sigset_t sa_mask;

    /* Special flags.  */
    int sa_flags;

    /* Restore handler.  */
    void (*sa_restorer) (void);
};
```

`sa_mask` 字段定义一组信号，在调用 `sa_handler` 所定义的处理程序时，阻塞该组信号。另外，引发中断的信号，也将自动加入信号掩码中。因此，同一个信号多次抵达，不会递归调用自己。

### 等待信号

```c++
int pause();
```

调用 `pause` 将暂停进程的执行，直到信号处理器中断该调用为止。


### 信号处理函数的设计

1. 在信号处理函数内设置某个全局变量，在主程序中周期性轮询此变量。
2. 创建一个管道，信号处理函数中向管道中写入数据，在主函数中监听管道的文件描述符。


### 实现 `abort`

```c++
void abort(){
    sigset_t mask;
    struct sigaction action{};

    sigaction(SIGABRT, nullptr, &action);
    if(action.sa_handler == SIG_IGN){
        action.sa_handler = SIG_DFL;
        sigaction(SIGABRT, &action, nullptr);
    }
    if(action.sa_handler == SIG_DFL){
        fflush(nullptr);
    }

    // block other signal excepting SIGABRT
    sigfillset(&mask);
    sigdelset(&mask, SIGABRT);
    sigprocmask(SIG_SETMASK, &mask, nullptr);
    raise(SIGABRT);

    // process caught SIGABRT and returned

    fflush(nullptr);
    action.sa_handler = SIG_DFL;
    sigaction(SIGABRT, &action, nullptr);
    sigprocmask(SIG_SETMASK, &mask, NULL);
    raise(SIGABRT);
}
```

1. 如果当前 `SIGABRT` 信号被忽略，那就修改为默认处理函数
2. 如果是默认处理函数，那就刷新标准 IO 的缓冲区，因为 `SIGABRT` 信号的默认动作是退出进程，需要在此之前刷新标 IO 的缓冲区。
3. 阻塞除了 `SIGABRT` 之外的其他信号，防止其他信号打断 `SIGABRT` 的处理函数
4. 使用 `raise` 向当前进程发送 `SIGABRT` 信号
5. 如果还会返回回来，说明调用了用户自定义的处理函数。这期间可能还做了一些 IO 操作，因此需要刷新
6. 把处理函数设置为默认，然后再次发送信号。这一次，一定会调用默认处理函数。

