##变参函数实现

在编写不定参数函数时需要用到几个宏va_list,va_start,va_arg,va_end ,在微软的头文件vadefs.h里面定义了实现变参函数的几个重要的宏，如下：

### 定义

```
typedef char *  va_list;
#define va_start 	_crt_va_start
#define va_arg 		_crt_va_arg
#define va_end 		_crt_va_end

#define _ADDRESSOF(v)   ( &reinterpret_cast<const char &>(v) )
#define _INTSIZEOF(n)   ( (sizeof(n) + sizeof(int) - 1) & ~(sizeof(int) - 1) )

#define _crt_va_start(ap,v)  ( ap = (va_list)_ADDRESSOF(v) + _INTSIZEOF(v) )
#define _crt_va_arg(ap,t)    ( *(t *)((ap += _INTSIZEOF(t)) - _INTSIZEOF(t)) )
#define _crt_va_end(ap)      ( ap = (va_list)0 )
```

### 使用例子

下面使用一个例子来看看他们的用法：

```
void error(int severity ...){
	va_list ap;
	va_start(ap,severity);
	for(;;){
		char *p = va_arg(ap,char*);
		if(p==NULL){
			break;
		}
		cerr<<p<<' ';
	}
	va_end(ap);
	cerr<<'\n';
	if(severity){
		exit(severity);
	}
}
int main(int argc,char* argv[]){
	error(2,argv[0],argv[1],(char*)0);
}
```
### va_list

typedef char *  va_list; 

### va_start

va_start(ap,severity) 这句的功能是将第二个参数的地址赋给ap。看看与 va_start 有关的定义

```
#define _ADDRESSOF(v)   ( &reinterpret_cast<const char &>(v) )
#define _INTSIZEOF(n)   ( (sizeof(n) + sizeof(int) - 1) & ~(sizeof(int) - 1) )

#define _crt_va_start(ap,v)  ( ap = (va_list)_ADDRESSOF(v) + _INTSIZEOF(v) )
```

_ADDRESSOF(v) 是取得v的地址

_INTSIZEOF(n) 是取得n的大小 ` ( (sizeof(n) + sizeof(int) - 1) & ~(sizeof(int) - 1) )` 这个奇怪的宏保证了字节对齐的问题。假如sizeof(n) 是11，如果int 是4个字节，那么其实 n 在内存中是占用12个字节的。(11+ 4 -1)& ~(4 - 1)  = (14)&~(3) = 12

所以va_start(ap,severity) 就是将ap指向severity后面的数，也就是第二个参数

### va_arg

```
#define _crt_va_arg(ap,t)    ( *(t *)((ap += _INTSIZEOF(t)) - _INTSIZEOF(t)) )
```

`char *p = va_arg(ap,char *)`  这将第一个参数的地址赋值给p并且将ap指向下一个参数，这里需要注意的是va_arg(ap,char *)中第二个参数要是可变参数的类型。

### va_end

```
#define _crt_va_end(ap)      ( ap = (va_list)0 )
```

