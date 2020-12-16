# MySQL

## INSERT

```sql
INSERT INTO student (name, major, grade) VALUES ('park', 'DGMD', 2)
```

## SELECT

모든 student 레코드의 name 컬럼과 grade 컬럼을 가져온다.

```sql
SELECT name, grade FROM student
```

id 순서로 모든 student 레코드의 name 컬럼과 grade 컬럼을 가져온다.

```sql
SELECT name, grade FROM student ORDER BY id
```

## WHERE

name이 park인 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE name = 'park'
```

grade가 1보다 크고, 4보다 작은 모든 student 레코드를 가져온다.

```sql
SELECT * FROM user WHERE level > 1 AND level < 4
```

name이 kim으로 시작하는 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE name LIKE 'kim%'
```

## BETWEEN

grade가 1보다 크고, 4보다 작은 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE grade BETWEEN 1 AND 4
```

major가 DGMD나 SCE인 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE major IN ('DGMD', 'SCE') 
```

## UPDATE

name이 lee인 student 레코드의 major를 SCE로 업데이트한다.

```sql
UPDATE student SET major = 'SCE' WHERE name = 'lee'
```

## GROUP BY

student 레코드를 major 컬럼 단위로 그룹지어 각 값의 개수를 가져온다.

```sql
SELECT major, COUNT(*) FROM student GROUP BY major
```

## JOIN

* [SQL Joins Visualizer](https://sql-joins.leopard.in.ua/)

student, professor 테이블에서 major 컬럼의 값이 일치하는 레코드의 모든 컬럼을 가져온다.

```sql
SELECT * FROM student INNER JOIN professor ON student.major = professor.major
```

student, professor 테이블에서 major 컬럼의 값이 일치하지 않는 레코드의 모든 컬럼을 가져온다.

```sql
SELECT * FROM student FULL OUTER JOIN professor ON student.major = professor.major WHERE student.major IS NULL OR professor.major IS NULL
``` 