# Entity-Relationship 모델

- ER 모델은 아래와 같은 과정으로 모델링:
  ![](https://user-images.githubusercontent.com/6410412/229670315-de5a73e6-3c01-44b8-ad99-68afa05eb442.png)
  1. 미니월드의 요구사항을 수집, 분석해 데이터 요구사항을 얻는다.
  2. 요구사항을 바탕으로 개념적 설계를 해 모델을 만든다: ER Diagram
  3. 개념적 모델을 기반으로 논리적 모델을 만든다: Relational Model
  4. DB를 구현해 데이터베이스를 구축한다.
- Entity: 데이터베이스에 표현되는 미니월드의 특정 개체.
- Attribute: 엔티티를 묘사하는 속성.
  - Simple: 원자적 값을 가진 속성.
  - Composite: 여러 속성들로 구성된 속성.
  - Multi-valued: 여러 값을 가진 속성.
- Entity type: 같은 기본 속성들로 그룹핑되거나, 하나의 엔티티 타입으로 타이핑되는 엔티티. (e.g., EMPLOYEE, PROJECT)
- Key attribute: 엔티티 타입의 속성은 각 엔티티에 대해 고유한 값을 가져야 한다. (e.g., SSN of EMPLOYEE)
  - 복합 키를 만들 수 있음. (e.g., 차량번호는 번호와 지역으로 구성)
  - 여러 키를 가질 수 있음. (e.g., CAR는 차량등록번호와 차량번호)

## E-R Diagram

![](https://user-images.githubusercontent.com/6410412/229708819-c913d251-3cd5-4dae-b698-3d437a6c8aba.png)

- Employee는 EID, Department는 DID처럼 중복되는 이름을 피하면 구분이 편함.
- ER 다이어그램에서 여러 어트리뷰트로 묶인 키를 표현하려면 어떻게?
  - relational model에서 복합키를 PK로 쓰는건 특수한 상황. ER 모델에서 여러 어트리뷰트를 묶어서 키로 표현할 필요가 없다.
- 왜 weak entity가 필요한가? 그냥 임의의 ID를 주면 되는데?
  - 실제로 대부분의 경우 그냥 ID를 줌. ID가 있는 엔티티는 중요하다는 것. 명시적으로 weak entity로 만들면 스키마만 보고도 그 엔티티 자체로는 의미가 없다는 것을 보여줄 수 있다.
- Relational 모델에서 여러 어트리뷰트에 underline하는 건 그 어트리뷰트들의 묶음이 하나의 PK라는 의미, ER 다이어그램에서 여러 어트리뷰트에 underline하는 건 개별 어트리뷰트 하나 하나가 유니크한 key라는 의미. superkey는 relational model에만 존재하는 개념이다.

## Relationship

- 2개 이상의 엔티티 사이의 관계에 구체적인 의미를 갖는 것.
- Relationship type:
  - 관계의 이름과 참여하는 엔티티 타입.
  - 특정 관계 제약을 명시해야 한다 (e.g., 1:1, 1:N, etc.)
- Recursive relationship type
- Cardinality of Relationships:
  - One-to-one (1:1): A와 B가 일대일 대응.
  - One-to-many (1:N) or Many-to-one (N:1): A 하나에 여러 개의 B가 대응.
  - Many-to-many (M:N): 여러 개의 A에 여러 개의 B가 대응.
- Participation Constraints:
  - Total
  - Partial

## Weak Entity Types

- 키가 없는 엔티티.
- 반드시 indentifying relationship type에 참여해야한다.
- 엔티티는 weak entity type의 부분키(partial key)와 identifying relationship type에 관계된 특정 엔티티의 조합으로 식별된다.
