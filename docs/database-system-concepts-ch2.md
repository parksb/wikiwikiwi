# Database System Concepts Ch 2. Introduction to the Relational Model

* 관계형 모델은 상용 어플리케이션의 주요 데이터 모델로 남았다.
* 관계형 모델은 간단하고, 네트워크 모델, 계층 모델에 비해 다루기 쉽다.

## Structure of Relational Databases

* 관계형 데이터베이스는 고유의 이름을 가진 테이블의 모음이다.
* 관계형 모델에서 사용하는 용어:
  * relation: table
  * tuple: row
  * attribute: column

## Database Schema

* 데이터 베이스의 논리적 디자인: 데이터베이스 스키마
* 특정 시점의 스냅샷 데이터: 데이터베이스 인스턴스

## Keys

* superkey: 튜플을 unique하게 특정할 수 있도록 해주는 일련의 어트리뷰트
* candidate keys: 가장 적은 어트리뷰트로 구성된 minimal superkeys (primary key의 후보군)
* primary key: candidate keys 중 선택하는 키
* foreign key: 다른 릴레이션의 primary key를 참조하는 속성

## Schema Diagrams

* 데이터베이스 스키마를 나타낸 다이어그램.

## Relational Query Languages

* query language: 사용자가 데이터베이스에 정보를 요청하기 위해 사용하는 언어.
* 다양한 쿼리 언어가 있음:
  * imperative query language
  * functional query language
  * declarative query language

## The Relational Algebra

* 많은 SQL 쿼리가 algebnra operation의 개념을 광범위하게 채택하고 있다.

### The Select Operation

* 주어진 조건에 따라 튜플을 선택하는 명령.
* 소문자 그리스 문자 시그마를 사용한다.

$$
\sigma_{dept\_name = "Physics"}(instructor)
$$

$$
\sigma_{salary \gt 90000}(instructor)
$$

$$
\sigma_{dept\_name = "Physics" \land salary \gt 90000}(instructor)
$$

### The Project Operation

* 릴레이션의 요소를 리스팅해주는 명령.
* 대문자 그리스 문자 파이를 사용한다.

$$
\Pi_{ID, name, salary}(instructor)
$$

$$
\Pi_{ID, name, salary / 12}(instructor)
$$

### Composition of Relational Operations

$$
\Pi_{name}(\sigma_{dept\_name = "Physics"}(instructor))
$$

### The Cartesian-Product Operation

* 두 릴레이션을 합치는 명령.

$$
r_1 \times r_2
$$

$$
r = instructor \times teaches
$$

### The Join Operation

* join operation은 select와 cartesian product를 합친 명령.

$$
r \Join_\theta s = \sigma_\theta(r \times s)
$$

$$
\Join_{instructor.ID = teaches.ID} = \sigma_{instructor.ID = teaches.ID}(instructor \times teaches)
$$
