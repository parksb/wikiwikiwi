# 함수형 프로그래밍

* 함수를 통해 참조 투명성을 보장하고, 상태와 가변 데이터 생성을 피하는 프로그래밍 패러다임.
* 객체지향 프로그래밍에 대치되는 개념이 아니라 명령형 프로그래밍에 대치되는 개념.
* ['함수형 언어'의 정의?](https://twitter.com/simnalamburt/status/872282854784327681)
  > [@simnalamburt](https://twitter.com/simnalamburt) 참고로 PL 교수들은 어떻게 생각하냐면, 서울대 이광근교수님께선 함수형언어의 정의를 "1. First class function이면 함수형 언어다"라고 수업에서, 저서에서, 각종 발표에서 꾸준히 밀고계십니다. 이경우 js 파이썬 등 수많은 언어들이 함수형 언어로 편입됩니다. 카이스트 류석영교수님도 같은 정의를 쓰시는것으로 알고있어요. 저 정의가 아니면 사람들이 기존에 '뫄뫄 언어는 함수형언어다'라고 관습적으로 부르던것을 전부 만족하는것이 불가능합니다.

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
