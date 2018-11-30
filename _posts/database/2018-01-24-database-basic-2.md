---
layout: post
title: 数据库基本操作
category: 数据库
tag: 数据库
---

* toc
{:toc}

## 操作数据库


### 创建关系

```sql
CREATE TABLE Movies(
    title CHAR(100),
    year  INT,
    length INT,
    genre CHAR(10),
    studioName char(30)
);
```

### 删除关系

```sql
DROP TABLE R;
```

### 修改关系

通常很少直接删除一个关系，常常发生的是修改一个关系。比如，为一个关系增加或者删除一个属性：

```sql
-- 增加一个属性 type
ALTER TABLE Movies ADD type CHAR(20);

-- 删除一个属性 genre
ALTER TABLE Movies DROP genre;
```

### 默认值

在创建关系的时候可以给某个属性指定默认值：

```sql
-- 创建关系时，设置默认值
CREATE TABLE MovieStar(
    name CHAR(30),
    address VARCHAR(255),
    gender CHAR(1) DEFAULT '?',
    birthdate DATE DEFAULT DATE '0000-00-00'
);

-- 增加一个属性 type 默认值为 'unknown'
ALTER TABLE Movies ADD type CHAR(20) DEFAULT 'unknown';
```

### 声明键

在使用 `CREATE TABLE` 语句定义关系时，有下列方法将某个属性或某组属性声明为一个键：

如，认定没有任何两个演员有相同的名字，所有，可以将属性 name 单独作为该关系的键。

```sql
CREATE TABLE MovieStar(
    name CHAR(30) PRIMARY KEY,
    address VARCHAR(255),
    gender CHAR(1) DEFAULT '?',
    birthdate DATE DEFAULT DATE '0000-00-00'
);
```

或者

```sql
CREATE TABLE MovieStar(
    name CHAR(30),
    address VARCHAR(255),
    gender CHAR(1) DEFAULT '?',
    birthdate DATE DEFAULT DATE '0000-00-00'
    PRIMARY KEY (name)
);
```

如果键有多个属性组成，则必须使用 `PRIMARY KEY (name, address)` 这种形式。


## 简单查询

SQL 的典型格式，即 select-from-where

```sql
SELECT *
FROM Movies
WHERE studioName = 'Disney' AND year = 1900;
```

### 投影

`SELECT *` 是选择整个元组，如果希望选择元组中的部分属性，则可运用投影：

```sql
SELECT title,length
FROM Movies
WHERE studioName = 'Disney' AND year = 1900;
```

如果在输出时，希望将 `title` 显示为 `name` 则可以使用 `AS` 重命名：

```sql
SELECT title AS name, length
FROM Movies
WHERE studioName = 'Disney' AND year = 1900;
```

这里的 `length` 显示的是电影的时长（以分钟为单位），如果希望以小时为单位，则可以把 `SELECT` 子句改为：

```sql
SELECT title AS name, length/60 AS lengthInHours
```

### SQL 中的选择

选择操作符，用在 SQL 的 WHERE 子句中。

可以通过比较运算符来构成选择，常见的比较运算符为 `=`、`<>`、`<`、`>`、`<=`、`>=`，其中 `<>` 表示不等于（等价于 C 语言中的 `!=`），`=` 表示等于（等价于 C 语言中的 `==`）。

还可以通过 `AND`、`OR`、`NOT` 来连接多个比较语句：

```sql
SELECT title
FROM Movies
WHERE (year > 1970 OR length < 90) AND studioName = 'MGM';
```

### 字符串的比较

使用 `>`、`=`、`<`、`>=`、`<=` 对字符串进行比较，是按照字典序进行比较。

还可以使用 `s LIKE p` 使用模式匹配。s 为待匹配字符串，p 为模式字符串。

```sql
SELECT title
FROM Movies
WHERE title LIKE 'Star ____';
```

模式字符串中的 `-` 匹配任意字符，`%` 匹配任意字符串。如果希望匹配的串中就含有 `%` 和 `_`，在模式串中需要使用 `\` 进行转义。 

### 涉及空值的比较

`NULL` 和任何数进行算数运算，结果均为 `NULL`， 使用比较运算符拿 `NULL` 和任何数进行比较，结果均为 `UNKNOWN`。

### UNKNOWN

布尔值有三种取值 `FALSE`、`UNKNOWN`、`TRUE`，可以将其分别看为 0、0.5、1。 `AND` 运算取值最小者，`OR` 取最小者。`NOT x` 结果则为 `1-x`。

### 输出排序

有时候需要对输出的结果进行排序，这个时候就可使用 `ORDER BY` 子句。比如对电影列表按照时长升序排列。

```sql
SELECT *
FROM Movies
WHERE studioName = 'Disney' AND year = 1900
ORDER BY length;
```

`ORDER BY` 子句中可以使用元组中的任何属性，即使 `SELECT` 子句没有选择该属性。

如果要降序排列，可以在属性后加上 `DESC` 保留字，即 `ORDER BY length DESC;`

还可以对多个属性进行运算后排序：

```sql
SELECT *
FROM R
ORDER BY count * price;
```

## 多关系查询

### SQL 中的积和连接

```sql
SELECT *
FROM R, S
```

这条语句中，FROM 子句的内容是两个关系 R 和 S，这里 `R, S` 实际上是 R 和 S 的积。 如果 R 或 S 中一个为空，那么积也为空，最后 SELECT 语句就没有可搜索的元组。



### 查询的并、交、差

具有相同属性的列表，可以做并、交、差处理。如下，找出所有男生和男老师的姓名和生日：

```sql
(SELECT name, birthday FROM student WHERE gender = 'M')
INTERSECT
(SELECT name, birthday FROM teacher WHERE gender = 'M');
```

这里两个 SELECT-FROM-WHERE 语句得出两组具有相同属性元组，这两组元组就能进行并、交、差操作。分别使用关键字 UNION、INTERSECT、EXCEPT 来表示并、交、差。



## 子查询

当某个查询是另一个查询的一部分时，称之为子查询。

### 产生标量的子查询

如果一个查询得到的结果只有一行一列，即只有一个值，那么称得到的结果是一个标量。得到的这个结果就可以作为其他查询的比较对象。

比如有一张学生表，和老师表，要想找到学生 John 的老师，需要先找出这个学生的班级，然后在老师表中查找带这个班的老师，则可以写出下面的查询语句：

```sql
SELECT name
FROM teacher
WHERE class = (
    SELECT class
    FROM Student
    WHERE name = 'John'
);
```

这种直接使用 `=` 的情况，要求子查询必须返回一行一列的值。

### 关系的条件表达式

如果查询结果含多列，那么可以使用一些运算符作用在上面，得到布尔值，用在 WHERE 子句中。 比如：

1. `EXISTS R` 表示当且仅当 R 非空时为真。
2. `s IN R` 当 s 为 R 的一个值时候为真。
3. `s > ALL R` 当 s 比 R 中所有值都大时候为真。
4. `s > ANY R` 当 s 比 R 中某一个值大时为真。

还可以使用 `NOT` 将得到的布尔值取反。

### 关联子查询

子查询中可以使用高层查询中的数据，比如要查询是否有同名的学生，需要就每个学生的姓名，查找是否具有和该姓名一样的学生且学号（唯一）不同的学生。

```sql
SELECT name
FROM student stu
WHERE NOT id = ALL
    (SELECT id
    FROM student
    WHERE name = stu.name);
```

这里 `stu.name` 就是当前在查找的学生的姓名。从上面的 SQL 中，可以看出两层循环的意味。

### FROM 子句中的子查询

因为子查询能够返回一个临时的关系，这个关系就可以作为 FROM 子句的值。

## SQL 的连接表达式

针对这两个关系，`Students(id, name, class)` 和 `Teachers(id, name, class)`：

### 交叉连接

交叉连接和笛卡尔积是一个意思，如果要计算这两个关系的积，可以写作：

```sql
Students CROSS JOIN Teachers;
```

结果则会是一个含有 6 个列的关系，关系中的每个元组由来自 `Students` 和 `Teachers` 两个关系中的元组组成。

通常直接使用交叉连接的情况很少，往往会通过关键字 `ON` 来进行 `θ` 连接：

```sql
Students JOIN Teachers ON
    Students.class = Teachers.class;
```

先进行交叉连接，而后根据 `ON` 后面的条件来筛选符合条件的元组。只有班级相同才会选出来。

### 自然连接

`NATURAL JOIN` 对两个关系中具有相同名字且值相同的属性进行连接。

### 外连接

在悬浮元组中填充 NULL 值使之成为查询结果。

`FULL OUTER JOIN`、`LEFT OUTER JOIN`、`RIGHT OUTER JOIN`。



两个元组进行 JOIN 会得到一些悬浮元组，比如 R(A,B,C) 和 S(A,B,D) 进行 JOIN 后得到的元组含有 4 个属性。得到的这些元组中有的可能 C 属性为空，有的可能 D 属性为空。

FULL 则保留所有悬浮元组，LEFT 只保留左边关系中包含属性都存在的元组，RIGHT 保留右边关系中包含的属性都存在的元组。

## 全关系操作

### 消除重复


使用 `DISTINCT` 关键字可以将结果中重复的元组去掉，如 `SELECT DISTINCT name`。去重涉及到排序，所有去重的代价不低，要谨慎使用。

### 并、交、差中的重复

SELECT 语句默认是保留重复的，而集合表达式中默认是去掉重复的，如果要让集合操作保留重复，需要使用 ALL 关键字。

```sql
(SELECT name FROM R)
UNION ALL
(SELECT name FROM S);
```

### 聚集操作符

对查询来的结果进行一些数学运算，比如从成绩表中计算数学成绩的平均分。

```sql
SELECT AVG(math)
FROM score;
```

可以使用的操作符有 `SUM`、`AVG`、`MIN`、`MAX`、`COUNT`，COUNT 用来统计数量，比如 `SELECT count(*)` 则是得到元组的个数。

### 分组

对于整张表，可以根据某些属性将其分组。比如从全年级学生的信息表中，得出各个班级有多少人：

```sql
SELECT class, count(*)
FROM student
GROUP BY class;
```

### HAVING 子句

`GROUP BY` 子句将整个关系分成了多个组，HAVING 子句用来过滤这些分组。比如，要得出各班全校前 100 名的学生数量，则希望过滤掉那些没有全校前 100 名学生的班级。



```sql
SELECT class, count(*)
FROM student
GROUP BY class
HAVING MIN(rank) <= 100
```

## 数据库的更新

### 插入

```sql
INSERT INTO R(A,B,C) VALUES(a,b,c);
```

R 为关系名，后面的括号中为要插入的属性，VALUES 中则给出对应属性的值。如果有某些属性没有被指定则会使用默认值。

也可以省略属性列表，但这个时候就必须要按照属性的顺序给定全部的属性值。

### 删除

`DELETE FROM R WHERE <条件>;` 将满足条件的元组删除掉。

### 修改

`UPDATE R SET <属性=值> WHERE <条件>;` 将满足条件的元组的指定属性修改为指定值。

比如在为姓名为 `wangyu` 的学生更换班级为三年级三班：

```sql
UPDATE student SET class='3-3' WHERE name='wangyu';
```

## SQL 中的事务

数据库可能被多台服务器的多个进程访问，每秒钟可能访问上万次。设想这种场景，用户点击一下某个按钮，需要将数据库中的某个字段加 1，这需要读出原来的值，加 1 后再写回，问题是在它读出后写回之前，有其他进程完成了写回操作，这个时候再写回的时候就出错了。因此需要保障，读出以及写入不能被打断。事务就是用来处理这类问题的。

事务是一组需要一起执行的操作，上面举的例子，读取并更新就构成一个事务，这两步操作不应该被打断。事务是必须原子地执行的一个或者多个数据库操作的集合，要么所有操作都执行，要么所有操作都不执行。

默认每执行一条语句就把这条语句当成一个事务然后进行提交。但程序员也可以将几条语句组成一个事务。使用 `START TRANSACTION` 标记事务开始，有两种方式结束事务：

1. COMMIT 使事务成功结束
2. ROLLBACK 使事务夭折

### 只读事务

如前面举的例子，读取一个数，而后将其加 1 后写回，这个事务一旦开始，其他读取者就必须阻塞至该事务完成之后。但是如果一个事务只会读数据而不会更新数据，那么就可以不阻塞其他读取者。指定一个事务是只读事务，可以让多个访问同一数据的只读事务并发执行。在开始事务之前，使用 

```sql
SET TRANSATION READ ONLY;
```

告诉 SQL 系统接下来的事务是只读事务。务的默认模式为 `READ WRITE`。


### 读脏数据

当一个事务更新了数据但是还没有提交时，这些数据就是脏数据。读脏数据有时候也很有用，比如在 Web 页面中要展示某项活动的参加人数，这个人数还在不断地上涨中，但当用户请求该数据时，就可以不等待正在执行 +1 操作的事务提交，读取这个脏数据也没有什么关系。

```sql
SET TRANSATION READ WRITE
    ISOLATION LEVEL READ UNCOMMITTED;
```

## 键和外键

### 外键约束

外键约束是一个断言，它要求某些属性的值必须有意义。比如 student 关系中的 class 属性的值，必须要是 school 关系中的某个元组的 class 属性。也就是说一个学生的班级，必须要是学校存在的班级。为了实现这样的约束，可以使用外键约束。

```sql
CREATE TABLE Student(
    id CHAR(15) PRIMARY KEY,
    name CHAR(30),
    class CHAR(10) REFERENCES School(class)
);
```

或者

```sql
CREATE TABLE Student(
    id CHAR(15) PRIMARY KEY,
    name CHAR(30),
    class CHAR(10),
    FOREIGN KEY (class) REFERENCES School(class)
);
```

当插入、或修改学生信息时，若其班级不等于 School 中任意一个元组的 class 属性，则会出错。

当 School 中的某个元组被删除，即某个班级被删除时，这个时候 Student 表该怎么办呢，因为有可能删除了一个班级后，Student 表中就违背了外键约束。这个时候数据库系统有以下选择：

1. 缺省原则（The Default Policy）：拒绝任何违背引用完整性约束的更新，即删除失败。
2. 级联原则（The Cascade Policy）：如果某个班级被删除，Student 表中该班级的学生也会被删除。如果某个班级修改了班名，那么 Student 表中的 class 也跟着改变。
3. 置空原则（The Set-Null Policy）：如果某个班级被删除或修改，Student 表中对应的该班级的学生的班级被置为 NULL。

可以使用 `ON DELETE` 和 `ON UPDATE` 来选择外键引用删除和更新后采用哪一种措施。

```sql
CREATE TABLE Student(
    id CHAR(15) PRIMARY KEY,
    name CHAR(30),
    class CHAR(10),
    FOREIGN KEY (class) REFERENCES School(class)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
```

### 延迟约束检验

如果两个关系存在循环约束，即 A 被 B 约束，B 也被 A 约束，这个时候对 A 或 B 单独修改都会违反约束条件，只有同时修改才行。此时就可以将约束检验延迟到事务结束后进行。

## 属性和元组上的约束

### 非空约束

```sql
CREATE TABLE Student(
    name CHAR(30) NOT NULL
);
```

### 基于属性的 CHECK 约束

对某个属性的值可以进行一些检验，如下面例子中，要求物品的单价要大于 0：

```sql
CREATE TABLE Product(
    price FLOAT CHECK price > 0
);
```

### 基于元组的 CHECK 约束

有时，检验需要基于多个属性。比如某个表中，若属性 a 大于 0，则属性 b 也要大于 0。

```sql
CREATE TABLE R(
    a INT,
    b INT,
    CHECK ((a > 0 AND b > 0) OR (a <= 0))
);
```

### 修改约束

任何时候都可以增进、修改、删除约束，为了修改或者删除约束，就要给约束命名。在约束前加 `CONSTRAINT <约束名>` 来给约束命名：

```sql
CREATE TABLE Student(
    id CHAR(15) CONSTRAINT idAsKey PRIMARY KEY,
    name CHAR(30) CONSTRAINT nameNotNull NOT NULL,
    class CHAR(10),
    CONSTRAINT classCheck CHECK (class LIKE '%-%')
);
```

### 删除约束

语法为 `ALTER TABLE Student DROP CONSTRAINT <约束名>`，如：

```sql
ALTER TABLE Student DROP CONSTRAINT nameNotNull;
```

### 添加约束

语法为 `ALTER TABLE Student ADD CONSTRAINT <约束名> <约束内容>`，如：

```sql
ALTER TABLE Student ADD CONSTRAINT idAsKey PRIMARY KEY (id);
ALTER TABLE Student ADD CONSTRAINT nameNotNull NOT NULL (name);
```

### 断言

Check 可以针对单个属性，也可以针对单个元组，还可以针对关系。

```sql
CREATE ASSERTION count_samll_than_100 CHECK
(
    100 >
    (
        SELECT COUNT(id)
        FROM Students
    )
);
```

各种约束的比较如下：

![]({{site.images_dir}}/18-3-23/53337733.jpg)


## 虚拟视图

使用 `CREATE TABLE` 定义的关系实际存储在数据库中，数据库系统以物理组织的方式存储这些表。而视图则示对这些表进行某种方式的查询，呈现出来的是一种基于物理存在的表的变换形式。

### 定义视图

```sql
CREATE VIEW StudentFamilyInfomaton AS
    SELECT name, father_name, mother_name, home_address
    FROM Student;
```

基于 Student 表创建了一个视图，该视图的元组中含有三个属性。

### 视图查询

可以像普通表那样使用视图：

```sql
SELECT name, address
FROM StudentFamilyInfomaton
WHERE name = 'John';
```

### 属性重命名

在创建视图时，可以对原属性名进行修改：

```sql
CREATE VIEW StudentFamilyInfomaton(name, father, monther, address) AS
    SELECT name, father_name, mother_name, home_address
    FROM Student;
```

### 删除视图

```sql
DROP VIEW <视图名>
```

### 可更新视图

按一定规则定义的视图，在对其进行插入、修改、删除等操作时，可以将操作反映到背后的物理关系上。视图需要时基于单个表定义的，对视图进行插入，就相当于对原表只插入视图中所选的那几个属性。也就是说，如果视图所选属性之外的属性，在原表中在插入时可以为空，则能直接在视图中插入。

## 索引

数据库中的数据量常常是非常大的，数据也是存储在磁盘上的，如果每次查询都遍历一次所有的元组，这意味着要将所有内容从磁盘读入内存，这会非常的慢。而索引正是用来加快查找速度的。

对某个属性增加了索引后，数据就会以该属性为键，按照树的结构来存储。这样以来查找的速度就能大幅提高。

```sql
SELECT *
FROM Student
Where id = '3020412006';
```

如果没有索引，那么数据库就会对 Student 中的每个元组进行遍历，而如果对 id 属性增加索引，那么所有元组都以 id 为键，在树种存储。这个时候查询起来就很快了。

### 索引的声明

```sql
CREATE INDEX StudentId ON Student(id);
```

### 索引的删除

```sql
DROP INDEX <索引名>
```

### 索引的选择

为数据库增加索引，要考虑下面两个因素：

1. 如果某个属性上有索引，那么涉及该属性的查询操作速度会大大加快
2. 如果某个属性或属性集合上有索引，那么插入、删除、修改操作会更费时一些

