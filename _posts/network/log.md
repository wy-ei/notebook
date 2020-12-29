## syslog

![](https://wangyu-name.oss-cn-hangzhou.aliyuncs.com/superbed/2020/04/23/5ea10854c2a9a83be587be01.jpg)

配置文件：

```
/etc/rsyslog.d/


/var/log/
```

配置文件格式：

```
facility.level  action

*.=debug;\
        auth,authpriv.none;\
        news.none;mail.none     -/var/log/debug
*.=info;*.=notice;*.=warn;\
        auth,authpriv.none;\
        cron,daemon.none;\
        mail,news.none          -/var/log/messages
```



```c++
openlog(argv[0], 0, LOG_DEBUG);

// 用于设置哪些级别的日志会被记录
// 多个级别可以使用与操作一次传入
setlogmask(LOG_INFO | LOG_ERR);

syslog(LOG_ERR, "hello %s\n", "syslog");
```

## 用户信息

用户 ID（UID）和有效用户 ID(EUID) 都是什么？一个进程拥有两个用户 ID，UID 就是运行该进程的用户 ID，有效用户 ID 则是用于方便控制资源的访问。当一个可执行程序设置了 `set-user-id` 标志时，运行该程序时，该进程的有效用户 ID 就是程序拥有者的 ID。

比如 `su` 程序，他的文件拥有是 root，其他用户执行该程序的时候，进程里的用户 ID 就是执行该程序的用户的 ID，由于该程序设置了  `set-user-id` 标志，因此在执行该程序的时候，有效用户 ID 就是 root。

## 守护进程

