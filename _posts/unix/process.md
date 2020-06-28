## 进程

进程是一个可执行程序的实例


## 进程的创建

### fork

```cpp
pid_t pid = fork();
switch(pid){
    case -1:
        // handle error
    case 0:
        // child
    default:
        // parent
}
```

- 共享代码段
- 数据段、堆和栈采用写时复制。

fork 调用后是先执行父进程还是子进程是不确定的。假如总是先执行父进程，但是有可能在执行开始前，父进程的时间片用完了。

因为很多子进程在创建后都会调用 exec 来执行一个程序，如果 fork 后先执行父进程，那么父进程的执行将导致子进程中共享的内存需要进行拷贝。而如果先执行子进程，那么 fork 后立刻执行 exec，这就不需要进行拷贝了。但从历史上看，linux 采用的策略发生过几次改变。综上，在需要依赖执行顺序的场景下，不能对系统的执行顺序做任何假设。



### wait

1. 如果子进程尚未终止，wait 将父进程挂起直到子进程终止
2. 子进程的终止状态通过 wait 的 status 参数返回

```c++
int status;
while((pid = wait(&status)) != -1)
    continue;
if(errno != ECHILD)
    err_exit("wait");
```

`wait` 返回一个已经终止的子进程的 pid，并用 status 传回子进程终止时的状态。当调用 wait 的时候，没有子进程终止，那么 wait 会一直阻塞知道某个子进程终止。当调用 wait 的时候，已经有了一个子进程终止，wait 会立刻返回。当没有尚未终止的子进程的时候，wait 会出错，返回 -1，且设置 erron 为 ECHILD。因此，可以使用上面的循环来等待所有的子进程终止。

### 孤儿进程和僵尸进程

当父进程终止后，子进程成为了孤儿进程，他们会被 init 进程接管。

当子进程终止后，父进程如果没有使用 wait 等函数来获取子进程的状态，那么子进程就成为僵尸进程。子进程虽然已经终止了，内核会回收内存，但是会保存进程相关的状态，等待父进程来获取。如果父进程不断地创建子进程，但是不回收，会因存在太多的僵尸进程导致无法再创建新的进程。

### SIGCHID 信号

父进程要回收子进程，可以采用下列方法：

1. 阻塞在 wait 调用上
2. 使用非阻塞的 wait 调用，然后周期性轮询

这两种方法，主进程都难以做其他的事情。因为子进程终止会给父进程发送 SIGCHILD 信号，因此父进程可以监听此信号，然后在信号处理函数中回收子进程。

```c++
void child_handler(int signo){
    int saved_error = errno;
    while (waitpid(-1, nullptr, WNOHANG) > 0)
        continue;
    errno = saved_error;
}
```

因为在信号处理的时候，可能有其他进程又发来了信号，但是因为该信号正在被处理，所以该信号处理函数不会被再次调用。因此需要在这里多次调用 waitpid，但是为了避免阻塞在这里，因此需要非阻塞地调用。

### `execve(pathname, argv, envp)`

加载一个新程序，路径为 `pathname`，参数为 `argv`，环境变量为 `envp`。调用此函数，将丢弃现有程序的文本端，并重新创建执行栈、数据段和堆。

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/04/5e8827a0504f4bcb048c623e.jpg)


```
int execle (const char *__path, const char *__arg, ...)
int execlp (const char *__file, const char *__arg, ...)
int execvp (const char *__file, char *const __argv[])
int execv (const char *__path, char *const __argv[])
int execl (const char *__path, const char *__arg, ...)
int execve (const char *__path, char *const __argv[], char *const __envp[])
int fexecve (int __fd, char *const __argv[], char *const __envp[])
```

结尾为字母 `p` 的，接受可执行程序的文件名，然后在 `PATH` 中去搜索该可执行文件，但如果文件名中包含 `/` 则将其视为路径名，不再去 `PATH` 中搜索。其他函数要求传入可执行程序的文件路径，可以是绝对路径，也可以是相对的。

含有 `l` 字母的，表示程序的参数需要使用参数列表的形式传入，`l` 表示 `list`。含有 `v` 的，参数需要使用字符串列表来传入，`v` 表示 `vector`。这两种方式，最后一个参数都得是空指针。

含有字母 `e` 的，可以指定环境变量。 在程序是使用环境变量需要使用 `environ` 参数：

```c++
extern char **environ;

int main(){
    for(char ep=environ; *ep != NULL; ep++)
        std::cout<< *ep << '\n';
    }
    return 0;
}
```

`fexecve` 可以执行由文件描述符指代的程序。

```c++
setenv("name","wangyu", 1);
printf("name: %s\n", getenv("name"));

char str[] = "email=wangyu_it@yeah.net";
putenv(str);
printf("email: %s\n", getenv("email"));

unsetenv("name");
unsetenv("email");
```


### System

```c++

int system_w(const char *command){
    sigset_t block_mask, origin_mask;
    struct sigaction saIgnore, saOrigQuit, saOrigInt, saDefault;
    int status, savedErrno;

    if(command == NULL){
        return system_w(":") == 0;
    }

    sigemptyset(&block_mask);
    sigaddset(&block_mask, SIGCHLD);
    sigprocmask(SIG_BLOCK, &block_mask, &origin_mask);

    saIgnore.sa_handler = SIG_IGN;
    saIgnore.sa_flags = 0;
    sigemptyset(&saIgnore.sa_mask);
    sigaction(SIGINT, &saIgnore, &saOrigInt);
    sigaction(SIGQUIT, &saIgnore, &saOrigQuit);

    pid_t pid = fork();
    switch (pid){
        case -1:
            status = -1;
            break;
        case 0:
            saDefault.sa_handler = SIG_DFL;
            saDefault.sa_flags = 0;
            sigemptyset(&saDefault.sa_mask);

            if(saOrigInt.sa_handler != SIG_IGN){
                sigaction(SIGINT, &saDefault, NULL);
            }
            if(saOrigQuit.sa_handler != SIG_IGN){
                sigaction(SIGQUIT, &saDefault, NULL);
            }

            sigprocmask(SIG_SETMASK, &origin_mask, NULL);

            execl("/bin/sh", "sh", "-c", command, nullptr);
            _exit(127);
        default:
            while (waitpid(pid, &status, 0) == -1){
                if(errno != EINTR){
                    status = -1;
                    break;
                }
            }
            break;
    }

    savedErrno = errno;
    sigprocmask(SIG_SETMASK, &origin_mask, nullptr);
    sigaction(SIGINT, &saOrigInt, nullptr);
    sigaction(SIGQUIT, &saOrigQuit, nullptr);

    errno = savedErrno;

    return status;
}
```

## setjmp 和 longjmp




## 进程的终止

```c++
void exit(int status){
    // 1. 调用退出处理函数（使用 atexit 和 on_exit 注册的函数），执行顺序与注册顺序相反
    // 2. 刷新 stdio 流缓冲区
    // 3. _exit(status)
}
```

`exit` 是标准 C 语言函数。


## 进程凭证

### 实际用户 ID 和实际组 ID

确定了进程所属的用户和组

### 有效用户 ID 和有效组 ID


## 进程组、会话、作业控制

一个会话就是一个终端，会话首进程通常是终端程序，如 bash。在终端中，用户键入命令会创建新的进程，每一个命令构成一个进程组。有的命令会创建多个进程，比如使用管道连接的多个进程，这些进程处于同一个进程组。
会话包含多个进程组，进程组包含多个进程。

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/17/5e99269dc2a9a83be520b73b.jpg)

### 进程组

在特点的进程组中父进程能够等待任意的子进程，信号能够被发送到进程组中的所有进程。子进程会继承其父进程的进程组 ID。

### SIGHUP 信号

当终端关闭的时候，内核会发送 SIGHUP 信号给该会话中的控制进程。还会发送一个 SIGCONT 信号，保证之前停止的进程能够重新运行。控制进程往往是 shell 程序，shell 会向它创建的其他进程组发送 SIGHUP 信号，可能还有 SIGCONT 信号。


SIGHUP 信号的默认处理方式是终止进程。


### nohup 的工作原理

nohub 的[源代码可以在此处看到](https://github.com/coreutils/coreutils/blob/master/src/nohup.c)。它先做了一些重定向，比如把标注错误输出重定向到文件。最最关键的原理性代码就下面几行：

```c
signal (SIGHUP, SIG_IGN);

char **cmd = argv + optind;
execvp (*cmd, cmd);
```

先调用 `signal` 忽略 `SIGHUP` 信号，然后执行用户想到执行的命令。如此一来，进程就替换成用户命令指定的程序了。在执行 `exec` 之后，原代码段已经被替换了，用户自定义的信号的信号处理函数也就无处找寻了，因此用户自定义信号也就都被重置为默认了。但是那些被设置为 `SIG_IGN` 和 `SIG_DFL` 的信号的设置依然保留。这就是为什么 `execvp` 后能够忽略 `SIGHUP` 信号的原因。

### 作业控制

```sh
# 在后台运行
$ sleep 100 &

# 查看当前作业
$ jobs
[1]+  Running   sleep 100 & # 方括号中为作业编号 

# 在前台运行 job 1，%1 表示 job 1
$ fg %1
sleep 100  # 会打印出命令

# 停止运行
$ Ctrl+Z
[1]+  Stopped   sleep 100  # job 1 已经停止


$ jobs
[1]+  Stopped   sleep 100  # 在后台处于停止状态

# 在后台运行 job 1
$ bg %1
[1]+ sleep 1000 &

# 在后台停止
$ kill -STOP %1
```

下图总结了作业控制中常用的命令：

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/17/5e993796c2a9a83be535259a.jpg)


## 守护进程

守护进程具有如下特征：

1. 生命周期很长，通常一个守护进程会在系统启动时被创建，一直运行到系统被关闭。
2. 在后台运行，且没有控制终端。


