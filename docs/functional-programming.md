# 함수형 프로그래밍

* 함수를 통해 참조 투명성을 보장하고, 상태와 가변 데이터 생성을 피하는 프로그래밍 패러다임.
* 객체지향 프로그래밍에 대치되는 개념이 아니라 명령형 프로그래밍에 대치되는 개념.
* ['함수형 언어'의 정의?](https://twitter.com/simnalamburt/status/872282854784327681)

## 특징

* pure function:
  * 동일한 인자에 대해 항상 동일한 값을 반환하는 함수.
  * 부수효과가 없는 함수.
* immutable
* referential transparency:
  * 프로그램 변경 없이 어떤 표현식을 값으로 대체할 수 있음.
  * 함수가 외부의 영향을 받지 않으며, 반환 결과는 파라미터에만 의존해야 함.
* first class function:
  * 함수를 함수의 매개변수로 넘길 수 있다.
  * 함수를 함수의 반환값으로 돌려 줄 수 있다.
  * 함수를 변수나 자료구조에 담을 수 있다.
* lazy evaluation

## Docs

* [[higher-order-function]]
* [[functional-type-system]]
* [[functor]]
* [[applicative-functor]]
* [[monoid]]
* [[monad]]

## References

* 조재용, 우명인, "코틀린으로 배우는 함수형 프로그래밍", 인사이트, 2019.
