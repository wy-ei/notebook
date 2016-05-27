
## select

```
select distinct name from user;
select birthday from user where name=='wangyu';

-- =				Equal
-- <>				Not equal. Note: In some versions of SQL this operator may be written as !=
-- >				Greater than
-- <				Less than
-- >=				Greater than or equal
-- <=				Less than or equal
-- BETWEEN	Between an inclusive range
-- LIKE			Search for a pattern
-- IN				To specify multiple possible values for a column

select name from user where age=21 and sex='male';

-- and
-- or

```

## order

```
select name from user where sex='male' order by age desc;

-- desc|asc
```



## insert into

```
insert into user(name,age,sex,job) values('john',21,'male','teacher');
```

## update

```
update user set job='student' where name='john';
```

## delete

```
delete from user where name='john';

delete from user;   -- delete all
delete * from user; 
```

## select top

```
select top 2 from user;
select top 50 percent from user;

-- mysql
select name from user limit 10;

```

## like

```
select name from user where name like 'j%';

```

## wildcards

```
-- Wildcard			Description
-- %						A substitute for zero or more characters
-- _						A substitute for a single character
-- [charlist]		Sets and ranges of characters to match
-- [^charlist]
-- or
-- [!charlist]	Matches only a character NOT specified within the brackets

select * from user where name like 'w_%'; 

```

## in

```
select * from user where name in ('ron','brain','jobs');
```

## between

```
select * from user where age between 10 and 20;
select * from user where age not between 10 and 20;
```

## aliases

```
select name as nickname from user;

select name,age+','+sex+','+birthday as information from user;

-- mysql
select name,CONCAT(age,',',sex,',',birthday) as information from user;

```

## Joins

```
select U.name from user as U inner join list as L on L.name==U.name;
```

## LEFT JOIN Keyword

```
-- The LEFT JOIN keyword returns all rows from the left table (table1), 
-- with the matching rows in the right table (table2). The result is NULL in 
-- the right side when there is no match.

select user.name,list.salary from user left join list on user.name=list.name; 

-- if user.name is not on list the salary will be null

-- SQL RIGHT JOIN Keyword
-- The RIGHT JOIN keyword returns all rows from the right table (table2), 
-- with the matching rows in the left table (table1). The result is NULL in 
-- the left side when there is no match.


-- SQL FULL OUTER JOIN Keyword
-- The FULL OUTER JOIN keyword returns all rows from the left table (table1) and from the right table (table2).
-- The FULL OUTER JOIN keyword combines the result of both LEFT and RIGHT joins.

```

## union

```
select name from class1 union select name from class2 order by name;
```


## insert into select

```
insert into newClass select * from class1 union all select * from class2;
```

## create database 

```
create databse new_database;
```

## create table

```
CREATE TABLE table_name
(
column_name1 data_type(size) constraint_name,
column_name2 data_type(size) constraint_name,
column_name3 data_type(size) constraint_name,
....
);

-- In SQL, we have the following constraints:

-- NOT NULL - Indicates that a column cannot store NULL value
-- UNIQUE - Ensures that each row for a column must have a unique value
-- PRIMARY KEY - A combination of a NOT NULL and UNIQUE. Ensures that a column (or combination of two or more columns) have an unique identity which helps to find a particular record in a table more easily and quickly
-- FOREIGN KEY - Ensure the referential integrity of the data in one table to match values in another table
-- CHECK - Ensures that the value in a column meets a specific condition
-- DEFAULT - Specifies a default value when specified none for this column 

```

## drop primary key

```
alter table persons drop primary key;
```

## add primary key

```
alter table persons add primary key (id);
```

## foreign key 

```
create table orders
(
o_id int not null,
orderno int not null,
p_id int,
primary key (o_id),
foreign key (p_id) references persons(p_id)
)

alter table orders
add foreign key (p_id)
references persons(p_id)
```


## check Constraint

```
CREATE TABLE Persons
(
P_Id int NOT NULL,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
CONSTRAINT chk_Person CHECK (P_Id>0 AND City='Sandnes')
)

ALTER TABLE Persons ADD CHECK (P_Id>0)

ALTER TABLE Persons DROP CHECK chk_Person
```

## drop

```
drop database my_db;
drop table user;
```

## truncate

```
truncate table table_name; -- delete the data inside the table not the table itself;
```

## alter table statement

```
-- SQL ALTER TABLE Syntax

alter table user add school varchar(20);
alter table user drop column school;

```

## Change Data Type Example

```
alter table user alter column school varchar(30);
alter table user modify column school varchar(30);  -- in MySQL;
```

## drop column example

```
alter table user drop column school;
```

## auto increment a field

```
CREATE TABLE Persons
(
ID int NOT NULL AUTO_INCREMENT,
LastName varchar(255) NOT NULL,
FirstName varchar(255),
Address varchar(255),
City varchar(255),
PRIMARY KEY (ID)
)

IDENTITY in ms sql server
select name from user where job is null;
```

## Create a table if the table not exists

```
create table  IF NOT EXISTS xxxx  (id int , ....
```