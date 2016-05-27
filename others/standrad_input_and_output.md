
总结如下：


### 字符输入输出

+ `int getchar()`:从标准输入中读取一个字符，并返回。

+ `int putchar(int)`:将一个字符输出到标准输出，并返回该字符，如果发生错误则返回`EOF`。

### 格式化输入输出

+ `int printf(char *format,...)`:格式化输出，是一个可变差数的函数，但是第一个参数一定是一个字符串，这个字符串唯一的决定了，后面会跟多少个参数，所以该函数是根据第一个参数在后面的栈空间取其他的参数。最后函数返回打印的字符数。

+ `int scanf(char *format,...)`:格式化输入，同`prinf`一样该函数也是可变参数，同样第一个参数必须是字符串，这个字符串也唯一确定了，后面的参数个数。同`printf`不同的是，该函数返回的是正确输入个数。举个例子就是`scanf("%d",&a);`这个时候需要输入一个数字，但是如果输入的是字符的话，就是一个错误输入，这时候会返回0，如果正确地输入了数字，那么会返回1.

+ `int sprintf(char *string,char *format,...)`:与`printf`不同的地方仅仅在于这里并不是打印到标准输出（多数情况是屏幕）而是输出到第一个参数的字符串中，该字符窗需要保证有足够的空间。

+ `int sscanf(char *string,char *format,...)`:用第一个参数的字符串作为输入。


### 文件输入输出

+ `FILE *fopen(char *name,char *mode)`:打开文件，第一个参数是文件名，第二个参数是打开的模式，打开模式有三种分别对应三个不同的字符串,只读("r"),只写("w"),追加("a")，有的系统区别文本文件与二进制文件，在对二进制文件进行操作时候，需要在模式字符串后面附加一个"b",即"rb"为读二进制文件。打开成功后返回一个指向个文件按的指针,若因为权限或者文件不存在等问题造成打开文件失败则返回NULL。

+ `int getc(FILE *fp)`:从文件中读取一个字符，与`getchar`的不同点在于`getchar`是唯一地从标准输入进行读取。其实有这样一个宏定义`#define getchar() getc(stdin)`

+ `int putc(int c,FILE *fp)`:将字符输出到文件fp。与`putchar()`的关系为`#define putchar(c) putc((c),stdout)`


+ `int fprintf(FILE *fp,char *format,...)`:格式化输出到文件。其他同`printf`。

+ `int fscanf(FILE *fp,char *format,...)`:将文件作为输入，其他同`scanf`。

	**注意**：涉及到参数包含文件的函数，文件fp是按照合适的模式打开的。即getc，fscanf这类函数需要以"r"模式打开，而putc,sprintf这类函数中需要以"w"或"a"模式打开。

+ `int fclose(FILE *fp)`:关闭打开的文件，将文件指针与文件断开联系，有的系统限制了同一个文件被同时打开的次数，所以在不再使用的时候，最好关闭该文件，释放掉对文件的引用。

+ `int ferror(FILE *fp)`:返回非零如果有错误发生在这个文件流上。

+ `int feof(FILE *fp)`:返回非零值如果文件到达EOF。

### 行输入输出

+ `char *fgets(char *line,int maxline,FILE *fp)`:从文件中读取小于maxline个字符，保存在line所指的缓存区中，当遇到`EOF`或则`\n`时候停止，如果遇到`\n`它会被保存，之后在后添加'\0'。如果读取成功返回该行，若失败返回NULL。

+ `int fputs(char *line,FILE *fp)`:将一个字符串写入文件中，不要求该字符串包含`'\n'`。如果发生错误返回`EOF`，否则返回一个非负值。

+ `char *gets(char *line)`:从标准输入读取。与fgets区别的一点在于gets不保留`'\n'`而fgets保留。由于没有限制输入个数，所以这个函数是及不安全的，不建议使用。可以使用fgets代替。

+ `int puts(const char *line)`:将字符串 line 写到标准输出，值得注意的是fputs会在末尾添加添加`'\n'`。

