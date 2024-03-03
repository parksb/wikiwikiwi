# 관계형 데이터 모델

- Schema $R$: $R(A_1, A_2, \cdots, A_n)$
  - e.g., `STUDENT(Id, Name, Dept)`
- Tuple: 값의 순서있는 집합.
  - 튜플 내의 어트리뷰트에는 순서가 있음. e.g., `<202300001, "Park", "Media">`
  - relation은 튜플의 집합이다.
  - 튜플의 모든 값은 atomic하다.
  - null 값은 unknown, not available, inapplicable, undefined를 의미한다.
- Key: 테이블의 로우를 유일하게 식별 가능하게 하는 값.
- Domain: 논리적 정의와 데이터 타입 또는 형식을 갖는다.
- State: 어트리뷰트의 도메인에 대한 cartesian product의 서브셋.
  - relation state $r(R) \in dom(A_1) \times dom(A_2)$
  - state의 도메인은 cartesian product의 결과. 즉, 조합 가능한 모든 경우.
- 스키마의 어트리뷰트를 표현할 때는 순서가 중요.
  - $R(A_1, A_2, \cdots, A_n)$의 값은 $t_i = <v_1, v_2, \cdots, v_n>$.
  - 이걸 신경쓰지 않아도 되는 표현은 self-describing이라고 한다. (e.g., XML, JSON)
  - 튜플 간의 순서는 중요하지 않다.

## Constraints

- constraints에는 3가지 주요 타입이 있음:
  - Inherent or Implicit Constraints:
    - 데이터 모델 자체에 기반하는 제약.
    - e.g., 관계형 모델은 리스트를 값으로 취급하지 않음.
  - Schema-based or Explicit Constraints:
    - 모델로부터 제공되는 제약.
    - e.g., ER 모델의 max cardinality ratio 제약
  - Application based or Semantic Constraints:
    - 애플리케이션 프로그램으로부터 제공되는 제약.
    - 종종 SQL의 assertions로 명시되기도 한다.
- explicit constraints에 3가지 주요 타입이 있음:
  - Key constraints:
    - PK는 중복되어서는 안 된다.
    - Superkey: 여러 어트리뷰트의 집합으로 이뤄진 키. 각각의 어트리뷰트는 유일성을 만족하지 않을 수 있음.
    - Key: 최소성을 만족하는 superkey. key는 superkey이지만, 그 반대는 아니다.
    - Primary key: 여러 후보키가 있을 때, 그 중 하나를 PK로 사용.
  - Entity integrity constraints:
    - 각 relation schema의 PK는 null이 될 수 없다.
    - entity를 식별할 수 있어야 한다는 제약이기 때문에 entity constraint.
  - Referential integrity constraints:
    - $R_1$에 있는 튜플의 FK는 $R_2$에 실제 존재하는 튜플의 PK를 참조해야 한다.
    - Foreign key: FK는 자신이 참조하는 PK와 같은 도메인이어야 한다.
- 또 다른 schema-based constraint는 Domain constraints.

## Update Operations

- 데이터 업데이트 시에 integrity constraints를 위반해서는 안 된다.
- CASCADE, SET NULL, SET DEFAULT와 같은 트리거를 설정할 수 있다.
- INSERT는 모든 제약을 위반할 가능성이 있음:
  - domain:
    - 새 튜플의 값이 어트리뷰트의 도메인에 포함되지 않은 경우.
    - 애플리케이션 코드에서 확인이 필요함.
  - key: 같은 키 속성을 가진 튜플이 이미 존재하는 경우.
  - referential: 새 튜플이 참조하는 외래키가 존재하지 않는 경우.
  - entity: 새 튜플의 주요키가 null인 경우.
- DELETE:
  - referential: 다른 튜플이 삭제하려는 값의 주요키를 참조하는 경우.
- UPDATE:
  - PK를 변경하는 경우에는 모든 제약을 위반할 수 있다.
  - FK를 변경하는 경우: referential, domain.
  - 일반적인 어트리뷰트를 변경하는 경우: domain.
