# 관계대수

- 관계형 모델에 대한 기본 명령 집합.
- 쿼리의 기본적인 구현과 최적화에 사용할 수 있음.

## Unary Relational Operations

- SELECT ($\sigma_{<condition>}(R)$):
  - SQL의 WHERE에 대응하는 명령.
  - $\sigma_{Dno = 4}(EMPLOYEE)$
  - $\sigma_{Salary > 30000}(EMPLOYEE)$
  - 교환법칙이 성립하므로 순서를 바꿔도 상관없다. 따라서 연산을 적게 하는 방향으로 명령을 구성할 수 있다.
  - AND 조건을 걸어 중첩된 $\sigma$ 명령을 하나로 작성할 수 있다.
- PROJECT ($\pi_{<attributes>}(R)$):
  - SQL의 SELECT에 대응하는 명령.
  - $\pi_{Lname, Fname, Salary}(EMPLOYEE)$
  - 결과에서 중복 튜플이 제거된다.
  - 교환법칙이 성립하지 않는다.
  - 아래첨자에 여러 속성을 나열하여 중첩된 $\pi$ 명령을 하나로 작성할 수 있다.
- Assignment ($\leftarrow$)
  - 화살표를 이용해 중간 결과값을 저장할 수 있다:
    - $DEP5\_EMPS \leftarrow \sigma_{DNO=5}(EMPLOYEE)$
    - $RESULT \leftarrow \pi_{Fname, Lname, Salary}(DEP5\_EMPS)$
- RENAME ($\rho_{S(B_1, B_2, \cdots, B_n)}(R)$)
  - 릴레이션 이름과 어트리뷰트 이름을 변경한다.
  - 둘 중 하나만 변경할 수도 있다: $\rho_S(R)$, $\rho_{B_1, B_2, \cdots, B_n}(R)$
  - 보통 대입 연산과 함께 쓰인다:
    $RESULT(F, M, L, S, B, A, SX, SAL, SU, DNO) \leftarrow \rho_{RESULT(F, M, L, S, B, A, SX, SAL, SU, DNO)}(DEP5\_EMPS)$
  - 이렇게 축약할 수도 있다: $RESULT(First\_name, Last\_name) \leftarrow \pi_{Fname, Lname}(EMPLOYEE)$

## Relational Algebra Operations From Set Theory

- UNION ($R \cup S$):
  - R, S에 존재하는 튜플을 모두 얻는다.
  - R, S 릴레이션의 타입이 서로 다르면 안 된다(type compatible).
  - 교환법칙(commutative)과 결합법칙(associative)이 성립한다.
  - 결과에서 중복된 결과는 제거된다.
- INTERSECTION ($R \cap S$):
  - R, S에 공통으로 존재하는 튜플을 얻는다.
  - R, S의 타입이 서로 다르면 안 된다.
  - 교환법칙과 결합법칙이 성립한다.
- SET DIFFERENCE ($R - S$)
  - R에서 S에 존재하는 튜플을 제외하고 얻는다.
  - R, S의 타입이 서로 다르면 안 된다.
  - 교환법칙과 결합법칙이 성립하지 않는다.

## Binary Relational Operations

- CARTESIAN PRODUCT ($R(A_1, A_2, \cdots, A_n) \times S(B_1, B_2, \cdots, B_m)$)
  - R, S 사이의 모든 튜플 조합을 얻는다.
  - 결과 Q에는 $n + m$개의 어트리뷰트가 생긴다.
  - R의 튜플 수가 $|R| = n_R$, S의 튜플 수가 $n_S$라면, $R \times S$에는 $n_R \times n_S$개의 튜플이 생긴다.
  - R, S의 타입이 서로 달라도 된다.
  - $\times$ 명령만으로는 큰 의미가 없고, 여기에 $\sigma$를 걸어야 한다.
- JOIN ($R \Join {}_{<condition>}S$):
  - 두 릴레이션을 결합해 조건을 만족하는 튜플들을 얻는다.
  - 여기서 condition을 theta라고 부른다: $R \Join {}_{theta}S$.
  - EQUI JOIN: 어트리뷰트 값이 같은 것을 기준으로 THETA JOIN하는 것.
  - NATURAL JOIN: $S \ast R$. 어트리뷰트 이름이 같은 것에 대해 EQUI JOIN 하는 것.
    - 명시적으로 조건을 걸 수도 있다: $Q \leftarrow R(A, B, C, D) \ast S(C, D, E)$.
      - EQUI JOIN과 달리 결과에서 이름이 중복되는 컬럼을 제거한다: $Q(A, B, R.C, S.C, R.D, S.D, E)$가 아닌 $Q(A, B, C, D, E)$.
    - e.g., DEPARTMENT에도 Dnumber가 있고, DEPT_LOCATION에도 Dnumber가 있다면 다음과 같이 부서별 위치를 구할 수 있다: $DPET\_LOCS \leftarrow DEPARTMENT \ast DEPT\_LOCATION$.
- DIVISION ($R(Z) \div S(X)$):
  - X가 Z의 부분집합일 때 나누기 연산을 할 수 있다.

## Additional Relational Operations

- Complete set of relational operations: SELECT, PROJECT, UION, DIFFERENCE, RENAME, CARTESIAN PRODUCT. 다른 모든 명령을 이 6개 명령으로 구성할 수 있다.
  - e.g., $R \cap S = (R \cup S) - ((R - S) \cup (S - R))$
  - e.g., $R \Join {}_{<condition>}S = \sigma_{<condition>}(R \times S)$
- LEFT/RIGHT/FULL OUTER JOIN 모두 가능:
  - OUTER JOIN은 기준 릴레이션의 모든 튜플이 포함. 매칭되지 않는 튜플의 조인된 어트리뷰트는 null로 채워짐.

## Query Tree Notation

- 쿼리를 표현하기 위한 internal data structure.
- 쿼리의 동작을 트리로 표현할 수 있다.

## 관련문서

- [[relational-data-model]]{관계형 데이터 모델}
- [[mysql]]{MySQL}
