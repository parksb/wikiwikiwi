# MySQL

- 관계형 모델의 관계, 튜플, 속성이 테이블, 행, 열로 대응.
- 각 구문 마지막에는 세미콜론이 있어야 한다. (중간고사에 세미콜론 꼭 써야 함.)
- 테이블 생성: `CREATE TABLE COMPANY.EMPLOYEE` 또는 `CREATE TABLE COMPANY`

## Specifying Constraints

- Key constraints: PK 값은 중복될 수 없다.
- Entity integrity constraint: PK 값은 null이 될 수 없다.
- Referential integrity constraint: FK는 PK로 표현되는 기존 값이거나, null이어야 한다.
- `CONSTRAINT` 구문으로 constraint에 이름을 붙일수도 있음:
  ```sql
  CREATE TABLE EMPLOYEE(
    Ssn CHAR(9) NOT NULL,
    ...
    CONSTRAINT EMPPK
      PRIMARY KEY (Ssn),
    CONSTRAINT EMPSUPERFK
      FOREIGN KEY (Super_ssn) REFERENCES EMPLOYEE(Ssn)
        ON DELETE SET NULL
        ON UPDATE CASCADE
  );
  ```
- 테이블을 생성하는 시점에 아직 없는 값을 FK로 참조하면 referential integrity constraint를 위반하는 문제가 생김. 테이블을 생성한 뒤, `ALTER TABLE`해 FK를 추가하면 된다.

## Basic Retrieval Queries

- 기본형은 `SELECT <attribute list> FROM <table list> WHERE <condition>;`.
- 'Research' 부서에서 일하는 모든 직원의 이름과 주소를 찾는 경우:
  - `FROM EMPLOYEE, DEPARTMENT` 쿼리는 두 테이블 사이 모든 쌍이 포함된 테이블을 만듦. 즉, `EMPLOYEE`와 `DEPARTMENT`의 cartesian product.
    ```sql
    SELECT Fname, Lname, Address
    FROM EMPLOYEE E, DEPARTMENT D
    WHERE D.Dname='Research' AND D.Dnumber=E.Dno;
    ```
  - 따라서 `WHERE`절이 필수.

## NULL

![](https://user-images.githubusercontent.com/6410412/233791999-fb1dada0-3288-4462-a033-4c7148ee9eb9.png)

- 위와 같이 three-valued logic에 logical connectives가 있다.
- 따라서 NULL 조건을 적용할 때는 비교 연산이 아니라 `IS` 연산을 해야한다:
  - e.g., `SELECT * FROM EMPLOYEE WHERE Pno IS NULL;`

## Nested Queries

- `WHERE` 절 안에 완성된 형태의 select-from-where 블록을 중첩시킬 수 있다.
- `IN` 명령을 이용해 튜플 집합에서 대상 튜플을 비교할 수 있음.
  ```sql
  SELECT DISTINCT Essn
  FROM WORKS_ON
  WHERE (Pno, Hours) IN (SELECT Pno, Hours
                         FROM WORKS_ON
                         WHERE Essn='123456789');
  ```
  - `DISTINCT`를 하면 중복된 값이 제거된다.
- 집합론을 기반으로 하므로 `UNION`, `INTERSECT`도 가능.
  ```sql
  (SELECT DISTINCT Pnumber
   FROM PROJECT, DEPARTMENT, EMPLOYEE
   WHERE Dnum = Dnumber AND Mgr_ssn = Ssn AND Lname = 'Smith')
   UNION
  (SELECT DISTINCT Pnumber
   FROM PROJECT, WORKS_ON, EMPLOYEE
   WHERE Pnumber = Pno AND Essn = Ssn AND Lname = 'Smith');
  ```

## Use of (`NOT`) `EXISTS`

- 5번 부서의 모든 프로젝트에 참여하는 직원의 이름을 찾는 경우:
  ```sql
  SELECT Fname, Lname
  FROM Employee
  WHERE NOT EXISTS (
    (SELECT Pnumber FROM PROJECT WHERE Dno = 5)
      EXCEPT (SELECT Pno FROM WORKS_ON WHERE Ssn = ESsn)
  );
  ```
- 5번 부서의 모든 프로젝트에서 개별 직원이 참여하는 프로젝트 목록을 뺐을 때, 남는 프로젝트가 없다면 해당 직원은 5번 부서의 모든 프로젝트에 참여하고 있다고 할 수 있음.

## SQL Joins

![](https://user-images.githubusercontent.com/6410412/229053775-944ef5a5-61e3-4cda-940e-7f5a569311b8.png)

- `INNER JOIN`:
  - `SELECT * FROM EMPLOYEE E INNER JOIN DEPENDENT D ON E.Ssn = D.Essn;`
  - DEPENDENT가 있는 모든 EMPLOYEE를 반환.
  - 비교하는 속성 이름이 같다면 `NATURAL JOIN`을 할 수 있다.
- `FULL OUTER JOIN`
- `LEFT OUTER JOIN`:
  - `SELECT * FROM EMPLOYEE E LEFT JOIN DEPENDENT D ON E.Ssn = D.Essn;`
  - DEPENDENT가 없는 직원까지 포함해 반환.
- `RIGHT OUTER JOIN`

## Aggregate Functions

- `COUNT`, `SUM`, `MAX`, `MIN`, `AVG` 등 함수로 여러 튜플을 하나로 요약할 수 있다.
- `SELECT Dno, COUNT(*), AVG(Salary) FROM EMPLOYEE GROUP BY Dno;`
  - 그루핑의 기준 컬럼(`Dno`)을 함께 선택해야 어떤 튜플이 어떤 조건에 속하는지 알 수 있음.
- 그루핑 조건은 `HAVING` 절에 작성한다:
  ```sql
  SELECT Pnumber, Pname, COUNT(*)
  FROM PROJECT, WORKS_ON
  WHERE Pnumber = Pno
  GROUP BY Pnumber, Pname
  HAVING COUNT(*) > 2;
  ```
  - 여러 개 컬럼으로 `GROUP BY`하면?
- `WHERE`는 조심해야 한다. 이미 필터링된 상태에서 그루핑을 하면 `HAVING` 조건을 만족하지 못할 수 있음:
  ```sql
  SELECT Dno, COUNT(*)
  FROM EMPLOYEE
  WHERE Salary > 40000 AND Dno IN
    (SELECT Dno FROM EMPLOYEE GROUP BY Dno HAVING COUNT(*) > 5)
  GROUP BY Dno;
  ```
- `GROUP BY`되지 않은 컬럼은 `SELECT`할 수 없다.

## Alter and Dropping

- `ALTER TALBE <table> <ADD|DROP> <column> [type] [CASCADE|RESTRICT]`: 컬럼 추가/제거.
  - `CASCADE`: 삭제할 컬럼에 있는 모든 제약과 뷰를 제거한다.
  - `RESTRICT`: 삭제할 컬럼이 제약을 위반하면 삭제를 막는다.
- `ALTER TALBE <table> ALTER COLUMN <column> <SET|DROP> DEFAULT [default]`: 디폴트 값 추가/제거.
- `DROP TABLE <table>`: 테이블 삭제.

## 예시 쿼리

### INSERT

```sql
INSERT INTO student (name, major, grade) VALUES ('park', 'DGMD', 2)
```

### SELECT

모든 student 레코드의 name 컬럼과 grade 컬럼을 가져온다.

```sql
SELECT name, grade FROM student
```

id 순서로 모든 student 레코드의 name 컬럼과 grade 컬럼을 가져온다.

```sql
SELECT name, grade FROM student ORDER BY id
```

### WHERE

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

### BETWEEN

grade가 1보다 크고, 4보다 작은 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE grade BETWEEN 1 AND 4
```

major가 DGMD나 SCE인 모든 student 레코드를 가져온다.

```sql
SELECT * FROM student WHERE major IN ('DGMD', 'SCE')
```

### UPDATE

name이 lee인 student 레코드의 major를 SCE로 업데이트한다.

```sql
UPDATE student SET major = 'SCE' WHERE name = 'lee'
```

### GROUP BY

student 레코드를 major 컬럼 단위로 그룹지어 각 값의 개수를 가져온다.

```sql
SELECT major, COUNT(*) FROM student GROUP BY major
```

### JOIN

* [SQL Joins Visualizer](https://sql-joins.leopard.in.ua/)

student, professor 테이블에서 major 컬럼의 값이 일치하는 레코드의 모든 컬럼을 가져온다.

```sql
SELECT * FROM student INNER JOIN professor ON student.major = professor.major
```

student, professor 테이블에서 major 컬럼의 값이 일치하지 않는 레코드의 모든 컬럼을 가져온다.

```sql
SELECT * FROM student FULL OUTER JOIN professor ON student.major = professor.major WHERE student.major IS NULL OR professor.major IS NULL
```

## 관련문서

- [[relational-algebra]]{관계대수}
