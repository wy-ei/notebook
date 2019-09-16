---
layout: post
title: C字符串库函数实现
category:
---



- *
{:toc}

### strlen

**函数原型**: `size_t strlen(char const *string )`

**函数作用**：返回字符串的长度。**注意**：C中的字符串是以`\0`结尾的，而`\0`并不被计入长度中。

**函数实现**：

```c
size_t strlen(char const *string){
	int length;
	for(length=0;*string!='\0';++string){
		length+=1;
	}
	return length;
}
```


### strcmp

**函数原型**:`int strcmp(const char *s1, const char *s2);`

**函数功能**：比较两个字符串s1与s2,返回大于零小于零或等于零，如果s1大于s2则返回大于零，若两者相等返回0，若s1小于s2则返回小于零。

**函数实现**：

```c
int strcmp(const char *src,const char *dst){
	int ret;
	while(!(ret=*src-*dst) && *dst){
		++src,++dst;
	}
	if(ret<0){
		ret=-1;
	}else if(ret>0){
		ret=1;
	}
	return ret;
}


```




### strcpy

**函数原型**：`char *strcpy(char *dst,const char *src);`

**函数功能**：将src拷贝到dst中。一定要确保目标操作数dst的长度要大于源操作数src，否则会超出dst的范围，而破坏dst后面内存中的数据。该函数返回dst的指针是为了能够进行链式操作，比如strlen(strcpy(str,"hello"));

**函数实现**：


```c
#include <assert.h>

char *strcpy(char *dst,const char *src){
	assert((dst!=NULL)&&(src!=NULL));
	char *pos=dst;
	while((*dst++=*src++)!='\0')
	  ;
	return pos;
}

```


### strcat & strncat

**函数原型**：`char *strcat(char *dst,const char *src);`

**函数功能**：此函数连接两个字符串，将src连接到dst后面，需要保证dst足够大以至于能容纳连接后的字符串。

**函数实现**：

```c
char *strcat(char *dst,const char *src){
	assert(dst!=NULL);
	if(src==NULL)
		return dst;

	char *pos=dst;
	while(*dst!='\0'){   //这里是找到目标操作数的结尾，注意不能写成 while(*sdt++!='\0');  
	  dst++;            //因为那样循环结束后，dst是指向'\0'后面位置的。
	}
	while((*dst++=*src++)!='\0')
	  ;
	return pos;
}

```


**函数原型**：`char *strncat(char *dst,const char *src,size_t n);`

**函数功能**：此函数连接两个字符串，将src连接到dst后面，需要保证dst足够大以至于能容纳连接后的字符串。当src的长度不够n的时候，用'\0'补足

```c
char *strncat(char *dst,const char *src,size_t n){
	assert(dst!=NULL);
	if(src==NULL)
		return dst;

	char *pos=dst;
	while(*dst!='\0'){   //这里是找到目标操作数的结尾，注意不能写成 while(*sdt++!='\0');  
	  dst++;            //因为那样循环结束后，dst是指向'\0'后面位置的。
	}
	int i;
	for(i=0;i<n&&*src!='\0';i++){
		*dst++=*src++;
	}
	for(;i<n;i++){
		*dst='\0';
	}
	*dst='\0';
	return pos;
}
```

### strtok

函数原型：`char *strtok(char *str, const char *delim);`

函数功能：该函数将str字符串以第二个参数字符串中的字符分割成多个段，第一次调用时，返回第一个字串，之后的调用若第一个参数为NULL，那么函数将返回剩下的字串，当多次调用后，函数返回NULL表示结束。

函数实现：

```cpp
char *strtok_i(char *string,const char *control){
	unsigned char map[32]={0};
	while(*control){
		map[*control>>3]|=(1<<(*control&7));
		control++;
	}
	static char *nexttoken;

	unsigned char *str;
	if(string==NULL){
		str=nexttoken;
	}else{
		str=string;
	}

	while(map[*str>>3]&(1<<(*str&7))){   //对于'\0',在map中始终是0。
		str++;                           //跳过开头的分割符号
	}

	//--位置1--
	string=str;         //string作为返回值，指向子字符串

	/*下面需要做的是将下一个分割符设为'\0'*/

	while(*str){
		if((map[*str>>3]&(1<<(*str&7)))){
			*str='\0';
			break;
		}
		str++;
	}

	nexttoken=str+1;   //余下的字符串，保存在静态变量里面，便于下次使用


	if(*string=='\0'){	//如果*string=='\0',说明后面没有可分割的字符串了。在上面位置1处str已经指向了最后的'\0'
		return NULL;
	}else{
		return string;
	}
}



int main(){
	char a[]=",,,  hello,This is an example, , ,  ,  ,w";
	char *b=", ";
	char *p;
	p=strtok_i(a,b);        //这个函数会修改原字符串，a字符串中的第一个分隔符被设置为'\0'
	while(p){
		printf("%s\n",p);			
		p=strtok_i(NULL,b); //当采用NULL作为第一个参数的时候，strtok将返回第二个被分割符号分割的字符串
	}					  //所以可以猜想strtok函数里面使用了静态变量存储了之前的字符串
						  //当所以的子字符串都被处理完后，strtok会返回NULL
	return 0;
}
/*
运行结果：
hello
This
is
an
example
w
*/
```


### strspn

函数原型：`int strspn(const char *s,const char *accept);`

函数功能：本函数的作用是计算在S中在accept中的字符的数量，其实可以看作是在s中找到第一个不在accept中出现的字符的下标。下面是 Linux Programmer's Manual 上的解释:The strspn() function calculates the length (in bytes) of the initial segment of s which consists entirely of bytes in accept.

函数实现：

```c
#include <stdio.h>

int strspn(const char *s,const char *accept){

	unsigned char map[32]={0};

	while(*accept){
		map[*accept>>3]|=(1<<(*accept&7));
		accept++;
	}

	int count=0;
	while(map[*s>>3]&(1<<(*s&7))){
		count++;
		s++;
	}
	return count;
}

int main(){
	char *s="loveyou";
	char *s2="love";

	printf("%d\n",strspn(s,s2));  //4 也就是'y'的位置   
	return 0;
}
```

程序分析：

当我第一次自己实现这个函数的时候我写出了最最常见的双层循环。这是我拒绝的，作为库函数，绝对不允许O(N*M)的复杂度。

这里的基本思路是采用查表法。map是一个unsigned char 的数组，一共有8个元素，这样一共有8*32=256位，所以可以把它看成是一个有256个元素组成的数组，可以用每一位置0或1来代表对应字符是否存在。

第一次循环建立这样的一个表

第二次循环，如果那一位为1说明该字符在accept中存在，所以count加1，如果为0，结束循环。


至于为什么是`map[*accept>>3]|=(1<<(*accept&7));`。且看下面分析：

由于unsigned char是8位的，所以每个unsigned char可以存放八个字符的状态，所以可以将字符8个一组，分成组来存放在不同的元素里。比如'A'为65，65/8=8余1，所以可以将A是否存在的标志放在map[8]这个元素的第2位上，也就是 `map[8]|=(1<<1)`。

而这个8就可以用'A'>>3得到，后面的(1<<1) 也就是(1<<('A'&7))了。




### strcspn

**函数原型**：`int strcspn(const char *s,const char *reject);`

**函数功能**：本函数的作用是,计算s起始端不在reject中的字符数。下面是Linux Programmer's Manual 上的解释:

The strcspn() function calculates the length of the initial segment of s which consists entirely of bytes not in reject.

其实我们也可以理解为，在s中第一个出现在reject中的字符的下标。

**函数实现**：

```c
int strcspn(const char *s,const char *reject){
	unsigned char map[32]={0};
	while(*reject){
		map[*reject>>3]|=(1<<(*reject&7));
		reject++;
	}

	map[0]|=1;

	int count=0;
	while(!(map[*s>>3]&(1<<(*s&7)))){
		count++;
		s++;
	}
	return count;
}

int main(){
	char *s="hello123";
	char *s2="o123";

	printf("%d\n",strcspn(s,s2));  //4 也就是s中'o'的下标   
	return 0;
}

```

**注**：关于程序中map的意义请参看：[这里](http://blog.csdn.net/wy_ei/article/details/44279843)



### strchr & strrchr

**函数原型**：`char *strchr(char *dst,int c)；`

**函数功能**：找到dst中第一个字符c出现位置的指针。

**函数实现**：

```c
#include <assert.h>
#include <stdio.h>

char *strchr(char *dst,int c){
	assert(dst!=NULL);

	while((*dst!=c)&&(*dst!='\0')){
		dst++;
	}
	if(*dst=='\0'){
		return NULL;
	}else{
		return dst;
	}
}

int main(){
	char a[20]="hello,world";
	char b='w';
	printf("%s\n",strchr(a,b));  //world
	return 0;
}

```


**函数原型**：`char *strrchr(char *dst,int c)；`

**函数功能**：找到dst中字符c最后出现位置的指针，如果dst中没有c字符那就返回NULL。

**函数实现**：

```c
char *strrchr(char *dst,int c){
	assert(dst!=NULL);
	char *p=NULL;
	while(*dst!='\0'){
		if(*dst==c){
			p=dst;
		}
		dst++;
	}
	return p;
}
```

### strdup

**函数原型**：`char *strdup_i(const char *string)`

**函数功能**：复制一个字符串。在函数内部将会动态创建一片空间用来保存string的一份拷贝然后将地址作为返回值。

**函数实现**：

```c
char *strdup(const char *string){
	char *newString;
	newString=malloc(strlen(string)+1);
	if(newString!=NULL)
		strcpy(newString,string);
	return newString;
}
```

### strstr

**函数原型**：`char *strstr_i(const char *str, const char *substr)`

**函数功能** : 找到在str中子串substr首次出现的地址。


```c
#include <assert.h>
#include <stdio.h>
#include <string.h>

char *strstr_i(const char *str, const char *substr){
	assert((str!=NULL)&&(substr!=NULL));   //如果为NULL，报错

	const char *p=str;

	size_t len=strlen(substr);   

	for(;(p=strchr(p,*substr))!=NULL;p++){    //用strchr函数找到substr的第一个字符在str中出现的位置
		if(strncmp(p,substr,len)==0){	    //用strncmp来匹配
			return (char*)str;
		}
	}
	return NULL;
}

```


### strpbrk

**函数原型**：`char *strpbrk(const char *source,const char *chars);`

**函数功能**：返回在source中chars中任意字符首次出现的位置的指针，如果source中没有chars中的所有字符，那么函数会返回NULL


```c
char *strpbrk(const char *source,const char *chars){

	unsigned char map[32]={0};

	while(*chars){
		map[*chars>>3]|=(1<<(*chars&7));
		chars++;
	}

	while(*source){
		if(map[*source>>3]&(1<<(*source&7))){
			return (char*)source;
		}
		source++;
	}
	return NULL;
}

```
