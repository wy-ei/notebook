
https://beej.us/guide/bgipc/pdf/bgipc_A4.pdf

## 进程间通信

字节流形式

1. 管道
2. FIFO
3. Unix domain 流 socket

包含分隔符的消息形式

4. System V 消息队列
5. POSIX 消息队列
6. Unix domain 数据报 socket

共享内存：

7. System V 共享内存
8. POSIX 共享内存
9. 内存映射

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/17/5e995b0ec2a9a83be55ffe1b.jpg)

## IPC 工具分类

- 通信：进程间交换数据
- 同步：进程和线程间的同步
- 信号：


## 同步工具

- 信号量：
- 文件锁：
- 互斥体和条件变量：

## IPC 工具比较

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/04/5e880bbf504f4bcb0471293a.jpg)



### System V 消息队列缺点

- 消息队列是使用标识符引用的，无法使用 select、poll 等技术
- 使用键来标识消息队列会增加程序设计的复杂性。
- 消息队列是无连接的，不知道存在多少个进程引用了该消息队列，不知道何时能安全地删除掉队列
- 消息队列的总数是有限制的


## 管道

```c++
int fds[2];
if(pipe(fds) < 0){
    perror("pipe");
}
```

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/04/5e881b4a504f4bcb047e02d2.jpg)

创建完成后，两个文件描述符之间就构成了管道，向 `fds[1]` 写入的数据，可以从 `fds[0]` 中读取出来。因此常见的编程模型是创建管道之后，调用 `fork` 创建子进程，这样父子进程就可以使用管道进行通信了。

```c++
int fds[2];
if(pipe(fds) < 0){
    perror("pipe");
}

pid_t pid = fork();

if(pid == 0){
    close(fds[1]);
    read_from_pipe(fds[0]);
}else if(pid > 0){
    close(fds[0]);
    write_to_pipe(fds[1]);
}else{
    perror("fork");
}
```

在父进程和子进程中，可以关闭掉不需要使用的文件描述符。

管道的一种常见用法是，执行一个命令，利用管道连接该命令和主进程。一种做法是在 fork 之前，创建管道，连接父进程和子进程，子进程中使用 `exec` 执行命令。这个管道，可用于父进程向子进程发送数据，或者父进程从子进程中获取执行结果。

在 C 标准库中提供了一个 `popen` 函数，该函数的第一个参数就是由字符串表示的命令，新建一个进程执行该命令，并使用管道连接两个进程。调用者不用自己创建进程，只需要调用此函数传入参数，就可以打开一个管道。

如下代码，启动 `ls` 命令，调用方可以在打开的管道上读取到执行结果。

```c++
char buf[BUFSIZ];

FILE* fin = popen("ls", "r");

while(fgets(buf, BUFSIZ, fin) != nullptr){
    fputs(buf, stdout);
}

pclose(fin);
```

## FIFO

FIFO 是一种文件类型，可以使用命令 `mkfifo filename` 来创建，之后可以使用 `open` 打开该文件，然后使用 `write` 写入数据， 使用 `read` 读取。因为可以使用文件名打开 FIFO 文件，因此可以在两个不相关的进程间使用 FIFO 文件。管道只能连接父子进程，而 FIFO 则可以连接本地的任意进程。

一个进程打开 FIFO 的一端，如果对端还没有被打开，那就会被阻塞，除非指定非阻塞式打开。

## System V IPC

### 消息队列

```c++
int msgget (key_t __key, int __msgflg);

ssize_t msgrcv (int __msqid, void *__msgp, size_t __msgsz, long int __msgtyp, int __msgflg);

int msgsnd (int __msqid, const void *__msgp, size_t __msgsz,
		   int __msgflg);
            
int msgctl (int __msqid, int __cmd, struct msqid_ds *__buf);
```

`msgget` 用于创建消息队列，key 可以使用一个固定的数值，也可以使用 `ftok` 生成，或者使用 `IPC_PRIVATE`。

```c++
int flag = IPC_CREAT | IPC_EXCL | S_IRUSR | S_IWUSR | S_IWGRP;
int serverId = msgget(SERVER_KEY, flag);
```

`msgrcv` 和 `msgsnd` 用于发送数据，发送的数据的格式为：

```c++
struct Msg{
    long mtype;
    char mtext[];
};
```

其中只有 `mtype` 是必须有的，其他的字段可以自己定义，其他字段的长度需要使用 `msgsz` 指出。在发送和接收的时候，只需要使用相同的结构体就可以了。


`msgctl` 用来控制消息队列，比如删除：

```c++
msgctl(serverId, IPC_RMID, nullptr);
```

可以使用消息队列来开发 C/S 架构的程序，客户端和服务端使用消息队列来交换信息。比如如下设计：



```c++
#define RESP_MSG_SIZE 1024
#define REQ_MSG_SIZE  sizeof(int)


struct Request{
    long mtype;
    int client_mq_id;
};

struct Response{
    long mtype;
    char data[RESP_MSG_SIZE];
};

// 服务端：

static void serve_request(const Request *req){
    Response res = handle_request(req->data);

    msgsnd(req->client_mq_id, &res, 0, 0);
}


int main(){
    int server_mq_id = msgget(SERVER_KEY, flag);

    for(;;){
        // 接收请求消息
        msgrcv(server_mq_id, &req, REQ_MSG_SIZE, 0, 0);
        
        // 在子进程中处理请求
        pid_t pid = fork();    
        if(pid == 0){
            serve_request(&req);
            _exit(EXIT_SUCCESS);
        }
    }

    msgctl(server_mq_id, IPC_RMID, nullptr);
}


// 客户端

int main(int argc, char *argv[]){
    // 获取服务端 id
    int server_mq_id = msgget(SERVER_KEY, S_IWUSR);
    
    // 获取客户端 id
    int client_mq_id = msgget(IPC_PRIVATE, S_IRUSR|S_IWUSR|S_IWGRP);
    
    // 向服务端发送数据
    Request req;
    req.mtype = 1;
    req.client_mq_id = client_mq_id;
    msgsnd(server_mq_id, &req, REQ_MSG_SIZE, 0);

    // 从服务端接收数据
    Response res;
    msgrcv(client_mq_id, &res, RESP_MSG_SIZE, 0, 0);
   
    msgctl(client_mq_id, IPC_RMID, nullptr);

    exit(EXIT_SUCCESS);
}
```

以上的模型中，服务端使用一个总所周知的值 `SERVER_KEY` 来创建一个消息队列。其他客户端可以使用这个 key 来获取到已经创建好的消息队列，并使用它向服务端发送数据。

客户端可以使用该消息队列向服务端发送请求，因为服务端处理单个客户端请求可能需要花费较长时间，因此服务端创建一个子进程来处理该请求。如果所有子进程都使用同一个消息队列和服务端通信，消息队列的容量可能不够，因此每个客户端都创建一个消息队列，并把该消息队列的编号传给服务端。之后服务端和客户端之间的通信就使用这个由客户端创建的消息队列来进行。


### 信号量

### 共享内存
