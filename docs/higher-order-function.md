# 고차 함수

* 다음 두 가지 조건 중 하나 이상을 만족하는 함수:
  * 함수를 매개변수로 받는 함수.
  * 함수를 반환하는 함수.
* 코드 재사용성과 확장성, 간결성을 높일 수 있다.

## 부분 함수

* 모든 가능한 입력 중, 일부 입력에 대한 결과만 정의한 함수.
* 인자 `x`가 4 이상인 경우에 대한 결과를 정의하지 않은 부분 함수:
  ```kotlin
  fun say(x: Int): String = when (x) {
    1 -> "One"
    2 -> "Two"
    3 -> "Three"
    else -> throw IllegalArgumentException()
  }
  ```
* 부분 함수를 만들기 위한 추상화된 클래스:
  ```kotlin
  class PartialFunction<in P, out R>(
    private val condition: (P) -> Boolean,
    private val f: (P) -> R,
  ) : (P) -> R {
    override fun invoke(p: P): R = when {
      condition(p) -> f(p)
      else -> throw IllegalArgumentException()
    }
  }
  ```
* 최대한 부분 함수를 만들지 않는 편이 좋다.

## 부분 적용 함수

* 함수가 일부 인자만 받았다가, 이후 나머지 인자를 받았을 때 결과를 반환하는 함수.
* 두 개의 인자를 받는 부분 적용 함수를 생성하기 위한 확장 함수:
  ```kotlin
  fun <P1, P2, R> ((P1, P2) -> R).partiallyApplied(p1: P1): (P2) -> R =
    { p2 -> this(p1, p2) }
  ```
* 두 번에 나눠 인자를 넘길 수 있다:
  ```kotlin
  val concatFunction = { a: String, b: String -> a + b }
  val partiallyAppliedFunction = concatFunction.partiallyApplied("Hello, ")
  println(partiallyAppliedFunction("World!")) // "Hello, World!"
  ```

## 커링 함수

* 커링은 여러 개의 파라미터를 받는 함수를 분리해 부분 적용 함수의 체인으로 만드는 방법.
* 3개의 `Int` 타입 인자를 받아 모두 곱하는 함수:
  ```kotlin
  fun multiplyThreeNumbers(a: Int, b: Int, c: Int): Int = a * b * c
  ```
  ```kotlin
  println(multiplyThreeNumbers(1, 2, 3)) // "6"
  ```
* 같은 함수를 부분 적용 함수의 체인, 즉 커링 함수로 바꿔보면:
  ```kotlin
  fun multiplyThreeNumbers(a: Int) = { b: Int -> { c: Int -> a * b * c } }
  ```
  ```kotlin
  println(multiplyThreeNumbers(1)(2)(3)) // "6"
  ```
* 커링 함수를 만들면 부분 적용 함수의 마지막 매개변수가 입력될 때까지 함수 실행을 늦출 수 있다.
* 파라미터가 4개인 함수를 커링 함수로 만드는 확장 함수:
  ```kotlin
  fun <P1, P2, P3, R> ((P1, P2, P3) -> R).curried(): (P1) -> (P2) -> (P3) -> R =
    { p1: P1 -> { p2: P2 -> { p3: P3 -> this(p1, p2, p3) } } }
  ```
  ```kotlin
  val multiplyThreeNumbers = { a: Int, b: Int, c: Int -> a * b * c }
  val curriedMultiplyThreeNumbers = multiplyThreeNumbers.curried()
  println(curriedMultiplyThreeNumbers(1)(2)(3)) // "6"
  ```

## 함성 함수

* 함수를 파라미터로 받고, 함수를 반환하는 고차 함수를 이용해 두 함수를 결합한 함수: $`(f \circ g)(x) = f(g(x))`$
* 하스켈에는 합성 함수를 표현하기 위한 연산자 `.`이 있음.
* 합성 함수를 생성하기 위한 확장 함수:
  ```kotlin
  infix fun <F, G, R> ((F) -> R).compose(g: (G) -> F): (G) -> R =
    { gInput: G -> this(g(gInput)) }
  ```
  ```kotlin
  val absolute = { l: List<Int> -> l.map { l -> abs(it) } }
  val negative = { l: List<Int> -> l.map { l -> -it } }
  val minimum = { l: List<Int> -> l.min() }
  val composed = minimum compose negative compose absolute
  println(composed(listOf(3, -1, 5, -2, -4, 8, 14)) // "-14"
  ```
  * `absolute`, `negative`, `minimum` 순서로 실행된다.
  * 함수 합성을 통해 매개변수나 타입 선언없이 함수를 만드는 방식을 포인트 프리 스타일이라고 함. 
* 여러 개의 매개변수에 동일한 함수를 적용해야 할 때는 함수 합성 대신 일반적인 고차 함수로 연결하는 것이 낫다.

