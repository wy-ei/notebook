## 时间处理

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/10/5e903930504f4bcb0483380d.jpg)


## 定时器

### 间隔定时器


### 给阻塞操作设置超时

为了避免某些阻塞操作长时间阻塞，我们希望能够给他添加一个超时时间。但超时时间并不是所有接口都有的，比如 `select` 就可以设置超时时间，但是 `read` 就不行。不过我们可以人为地加入对超时的支持。

由于阻塞的系统调用会被信号处理程序中断，因此在调用某阻塞操作之前，可以设置一个定时器，当定时器超时后，阻塞的函数调用就会返回，通常为 `-1`，且设置错误码 `errno` 为 `EINTR`。因为定时器超时的默认动作是终止进程，因此需要修改默认的信号处理程序。

```c++
static void do_nothing(int signum){
}

void example(){
    struct sigaction sa{};
    sa.sa_flags = 0;
    sigemptyset(&sa.sa_mask);
    sa.sa_handler = do_nothing;
    sigaction(SIGALRM, &sa, nullptr);

    char buf[BUFSIZ];

    alarm(10); // timeout after 10s
    int n = read(STDIN_FILENO, buf, BUFSIZ-1);
    alarm(0); // turn off timer

    if(n == -1){
        if(errno == EINTR){
            fprintf(stderr, "timeout for read\n");
        }else{
            fprintf(stderr, "read fail: %s\n", strerror(errno));
        }
    }else{
        buf[n] = '\0';
        printf("read success. %s\n", buf);
    }
}
```