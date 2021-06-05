# Database System Concepts Ch 1. Introduction

* database-management system (DBMS)은 일련의 상호연관 데이터와 그 데이터에 접근하는 프로그램의 집합이다.
* 일련의 데이터는 데이터베이스라고 하며, 기업과 관련된 정보를 포함한다.
* DBMS의 주요 목표는 데이터베이스를 편리하게, 효과적으로 저장하고 검색하는 방법을 제공하는 것이다.

## Database-System Applications

* 60년대 데이터베이스 시스템은 현재에 비해 간단했다.
* 일반적으로 데이터베이스는 두 개의 모드로 사용된다:
  * 온라인 트랜잭션 처리 - 사용자 측면에서 데이터를 검색하고, 업데이트 하는 등의 동작 처리.
  * 데이터 분석 - 기업 측면에서 비즈니스 결정을 위한 데이터 처리.

## Purpose of Database Systems

* 컴퓨터에 정보를 저장하는 가장 쉬운 방법은 파일로 쓰는 것:
  * file-processing system이라고 한다.
  * 여기에는 많은 단점이 있다:
    * 데이터 중복과 불일치
    * 데이터 접근의 어려움
    * 데이터 격리
    * 무결성 문제
    * 원자성 문제
    * 병렬 접근 이상
    * 보안 문제
* 앞으로 이러한 문제를 해결하기 위한 데이터 베이스 시스템을 살펴본다.

## View of Data

* 데이터베이스 시스템의 주요 목적은 유저에게 추상화된 데이터 뷰를 제공하는 것이다.
* 데이터 모델 - 데이터, 데이터의 관계, 시맨틱, 제약을 설명하기 위한 개념적 도구.

### Data Models

* Relational Model:
  * 데이터와 데이터 사이의 관계를 표현하기 위해 테이블을 사용한다.  
  * 각 테이블을 여러 컬럼을 가지며, 각 컬럼은 유일한 이름을 가진다.
  * 테이블은 '관계'라고도 불린다.
* Entity-Relationship Model:
  * E-R 데이터 모델은 '엔티티'라고 부르는 기본 객체와 객체 간의 관계를 사용한다.
  * 데이터베이스 설계에 광법위하게 사용되고 있다.
* Semi-structured Data Model:
  * 각자 다른 속성을 가진 같은 타입의 개별 데이터를 정의할 수 있도록 해준다.
  * 특정 타입의 모든 데이터들이 똑같은 속성을 가져야 하는 앞선 데이터 모델과 대비된다.
  * JSON이나 XML이 광범위하게 사용된다.
* Object-Based Data Model:
  * OOP의 영향을 받은 데이터 모델.
  * 관계형 모델을 캡슐화, 메서드, 객체 식별로 확장한 것으로 볼 수도 있다.

### Relational Data Model

* 관계형 모델에서 데이터는 테이블 형태로 표현된다.
* 테이블의 각 로우는 하나의 정보 조각을 의미한다.

### Data Abstraction

* 대부분의 데이터베이스 시스템 사용자들은 컴퓨터과학에 익숙하지 않다.
* 따라서 개발자는 여러 계층의 데이터 추상화로 복잡성을 숨겨 사용자와 시스템의 상호작용을 간소화해야 한다:
  * Physical level - 데이터를 '어떻게' 저장할 것인가를 정의하는 추상화 계층.
  * Logical level - '어떤' 데이터를 저장할 것인가를 정의하는 추상화 계층.
  * View level - 데이터베이스의 일부 데이터에 접근할 수 있도록 추상화하는 계층.
* `instructor` 타입으로 예시를 들어보자:
  ```
  type instructor = record
      ID : char(5);
      name: char(20);
      dept_name: char(20);
      salary: numeric(8, 2);
    end
  ```
  * Physical level:
    * 각 레코드를 연속적인 바이트 블록으로 표현한다.
    * 테이블을 저장하는 방식, 인덱스 자료구조 등 DBA는 이 계층을 이해해야 한다.
  * Locgical level:
    * 각 레코드를 타입 정의로 표현하며, 레코드 타입간의 상호연관을 정의한다.
    * DBA와 프로그래머는 이 계층에서 프로그래밍 언어를 통해 작업한다.
  * View level
    * 사용자에게 데이터베이스의 특정 뷰를 제공한다.
    * 가령 입학처 교직원들은 데이터베이스의 학생 정보에만 접근할 수 있어야 한다. 

### Instances and Schemas

* 데이터베이스는 시간이 지남에 따라 정보가 추가/삭제되며 변한다.
* 데이터베이스의 정반적인 설계를 데이터베이스 스키마(schema)라고 부른다:
  * 스키마는 프로그래밍 언어에서 변수 선언과 같다.
* 특정 시점에 데이터베이스에 저장된 일련의 정보를 인스턴스(instance)라고 부른다:
  * 인스턴스는 변수의 값이라고 볼 수 있다.
* 데이터베이스 시스템에는 추상화 계층에 따른 다양한 스키마가 있다:
  * 뷰 레벨의 스키마는 서브스키마(subschema)라고도 한다.

## Database Languages

* 데이터베이스 시스템은 data-definition language(DDL)을 제공해 스키마를 정의한다. (SQL에서 `CREATE`, `ALTER`, `DROP` 등)
* data-manipulation language(DML)은 데이터베이스 쿼리와 업데이트를 표현한다. (`SELECT`, `INSERT`, `UPDATE`, `DELETE` 등)
* 관습적으로 DDL과 DML은 분리된 언어가 아니며, SQL처럼 하나의 언어에 포함된다. 

### Data-Definition Language

* 예를 들어, 학과 예산 잔고는 음수가 될 수 없다. DDL은 이러한 제약을 걸 수 있도록 해준다.
* Domain Constraints:
  * 값의 도메인은 속성과 관련이 있어야 한다. (정수 타입, 문자 타입 등)
  * 속성을 선언하는 것은 가질 수 있는 값에 대한 제약을 거는 것이다.
* Referential Integrity:
  * 한 관계(테이블)의 속성 값이 다른 관계의 속성에 존재해야 하는 경우가 있다.
  * 가령, `course` 레코드의 `dept_name` 값은 `department` 관계의 `dept_name` 속성에 존재해야 한다.
  * 데이터베이스 변경은 참조 무결성 위반을 일으킬 수 있다.
  * 참조 무결성 제약이 위반될 때 위반을 일으키는 동작에 제약을 건다.
* Authorization - 읽기 권한, 쓰기 권한 등 다양한 권한에 대한 제약을 걸 수 있다.
* DDL 구문의 출력은 메타데이터를 지닌 데이터 딕셔너리에 놓여진다:
  * 데이터 딕셔너리는 데이터베이스 시스템 자체만 접근할 수 있는 특수한 테이블이다.
  * 데이터베이스 시스템은 데이터를 읽거나 쓰기 전에 데이터 딕셔너리를 참고한다.

### The SQL Data-Definition Language

* 아래 SQL DDL은 `department` 테이블을 생성한다.
  ```sql
  CREATE TABLE department (dept_name CHAR(20), building CHAR(15), budget numeric(12,2));
  ```
* SQL DDL은 여러 무결성 제약을 제공한다.

### Data-Manipulation Language

* DML에는 크게 두 종류로 나뉜다:
  * Procedural DMLs - 어떤 데이터를 필요로하는지, 그 데이터를 어떻게 가져올지.
  * Declarative DMLs - 어떤 데이터를 필요로하는지.
* 쿼리(query)는 정보의 검색을 요청하는 구문이다:
  * 정보 검색을 포함한 DML의 일부분을 쿼리 언어라고 한다.
  * 기술적으로 틀렸지만, 쿼리 언어와 DML은 동의어처럼 사용된다.

### The SQL Data-Manipulation Language

* SQL 쿼리 언어는 선언적이며, 여러 테이블을 입력받고 항상 하나의 테이블을 반환한다.

### Database Access from Application Programs

* 선언형 쿼리 언어의 경우, 일반 목적 프로그래밍 언어를 사용할 수 있는 튜링 머신에서는 파워풀하지 않다.
* 어플리케이션 프로그램은 데이터베이스와 상호작용하는 프로그램이다.
* 데이터베이스에 접근하기 위해서는 호스트에서 데이터베이스로 DML 구문을 보내야 한다:
  * 보통 DML과 DDL 구문을 보내고, 결과를 검색할 수 있는 어플리케이션 프로그램 인터페이스를 사용한다.
  * Open Database Connectivity(ODBC) 표준은 여러 언어를 위한 어플리케이션 프로그램 인터페이스를 정의한다.
  * Java Database Connectivity(JDBC) 표준은 자바를 위한 인터페이스를 정의한다.

## Database Design

* 데이터베이스 설계는 데이터베이스 스키마 설계와 연관이 있다.
* 하이레벨 데이터 모델은 요구사항에 대한 개념적인 프레임워크를 제공한다.
* 첫 단계에서 설계자는 유저의 요구사항을 정의한다.
* 이어서 개념적 설계 단계에서는 설계자는 데이터 모델을 정하고, 요구사항을 데이터베이스 스키마로 변환한다.
* 관계형 모델에서 개념적 설계 과정은 어떤 속성을 사용할지, 속성을 어떻게 그루핑할지 정하는 것이다:
  * '어떤'은 비즈니스 결정에 관련된 부분이다.
  * '어떻게'는 컴퓨터과학의 문제다.
* 마지막 단계에서 설계자는 스키마가 기능적 요구사항을 만족하는지 리뷰한다.
* 추상적 데이터 모델에서 데이터베이스 처리의 구현으로 가는 과정에 두 절차를 거친다:
  * logical-design phase: 하이레벨의 개념적 스키마 데이터 모델 구현에 매핑하는 단계.
  * physical-design phase: 파일 조직과 내부 스토리지 구조 등 물리적 기능을 정의하는 단계.

## Database Engine

* Storage manager:
  * 데이터베이스는 큰 공간을 필요로 하기 때문에 중요하다.
  * 데이터는 필요에 따라 디스크와 메인 메모리를 오가는데, 디스크는 느리기 때문에 이동을 최소화해야 한다.
  * 데이터베이스 스토리지에 SSD를 사용하는 경우가 많아지고 있다. 
* Query processor:
  * 데이터베이스 시스템을 간소화하고, 데이터 접근을 용이하게 하기 때문에 중요하다.
  * 쿼리 프로세서는 사용자가 물리 레벨의 구현을 이해할 필요 없이 뷰 레벨에서 작업할 수 있도록 해준다.
* Transaction manager:
  * 어플리케이션 개발자가 일련의 데이터베이스 접근을 다룰 수 있도록 해주기 때문에 중요하다.
  * 개발자가 병렬 접근의 영향을 신경쓰지 않고 높은 레벨의 추상화만 고려할 수 있도록 해준다.
  * 모던 데이터베이스 엔진들은 병렬 데이터 스토리지와 병렬 쿼리 처리에 많은 주의를 기울이고 있다.

### Storage Manager

* 데이터베이스에 저장된 로우레벨 데이터와 어플리케이션 프로그램, 제출된 쿼리 사이의 인터페이스를 제공하는 컴포넌트다.
* 파일 매니저와 상호작용하며, 디스크에 저장된 데이터를 다루기 위해 다양한 DML 구문을 로우레벨 파일 시스템 명령으로 번역한다.
* 스토리지 매니저는 데이터베이스의 데이터를 저장, 검색, 업데이트하는 역할을 한다.
* 아래와 같은 컴포넌트를 포함한다:
  * Authorization and integrity manager - 권한, 무결성 제약 검증.
  * Transaction manager - 데이터베이스 일관성 유지, 충돌없는 병렬 트랜잭션 처리.
  * File manager - 디스크 저장소 공간 할당, 자료 구조 관리.
  * Buffer manager - 디스크에서 메모리로 데이터 이동, 캐시할 데이터 결정. 메모리보다 더 큰 데이터를 다룰 수 있도록 해준다.
* 물리 시스템 구현의 일부로 여러 자료구조를 구현한다:
  * Data files - 데이터베이스 스스로 저장하는 파일들.
  * Data dictionary - 데이터베이스 구조에 대한 메타데이터 저장.
  * Indices - 데이터에 빠르게 접근할 수 있도록 해줌.

### The Query Processor

* DDL interpreter - DDL 구문과 데이터 딕셔너리의 레코드를 해석.
* DML compiler - 쿼리 언어의 DML 구문을 쿼리 평가 엔진이 이해할 수 있는 로우레벨 명령으로 번역.
* Query evaluation engine - DML 컴파일러에 의해 생성되는 로우레벨 명령을 실행.

### Transaction Management

* 트랜잭션은 데이터베이스 어플리케이션에서 하나의 논리적 기능을 수행하는 일련의 명령이다.
* 트랜잭션은 원자성과 일관성의 단위이며, 데이터베이스 일관성 제약을 위반해서는 안 된다.
* 다양한 트랜잭션을 적절히 정의하여 데이터베이스의 일관성을 유지하는 것은 프로그래머의 책임이다.
* 내구성과 원자성은 데이터베이스 시스템의 책임이다.

## Database and Application Architecture

![](https://user-images.githubusercontent.com/6410412/115530044-61a38080-a2ce-11eb-97fb-baedf32e0e8f.png)

## Database Users and Administrators

* 데이터베이스 시스템의 주요 목표는 정보를 저장하고, 검색하는 것이다.
* 데이터베이스를 사용하는 사람들은 사용자와 관리자 둘로 나눌 수 있다.

### Database Users and User Interfaces

* Naive users - 웹이나 모바일 어플리케이션 등 유저 인터페이스를 이용해 데이터베이스와 상호작용하는 비전문 사용자.
* Application programmers - 어플리케이션 프로그램을 작성하는 전문가.
* Sophisticated users - 프로그램을 작성하는 대신 쿼리 언어 또는 데이터 분석 도구를 사용하는 전문가.

### Database Administrator

* 데이터베이스 시스템을 중앙 통제하는 사람을 DBA라고 한다.
* Schema definition - DDL을 사용해 데이터베이스 스키마를 생성.
* Storage structure and access-method definition - 물리 계층과 관련된 파라미터와 인덱스를 정의.
* Schema and physical-organization modification - 성능 향상을 위해 스키마와 물리 계층을 변경.
* Routine maintenance - 주기적인 데이터 백업, 데이터 공간 확보, 모니터링.

## History of Database Systems

* 1950년대, 1960년대 초반 - 자기 테이프.
* 1960년대 후반, 1970년대 초반 - 하드디스크.
* 1970년대 후반, 1980년대 - 성능 문제로 잘 사용되지 않던 관계형 모델이 인기를 얻음.
* 1990년대 - SQL 언어를 주로 사용함.
* 2000년대 - 데이터의 종류가 빠르게 진화함.
* 2010년대 - 클라우드, SaaS, 개인정보 등.

