# 모노이드

* 모노이드는 연관 바이너리 함수와 항등값을 가진 대수적 타입이다.
* 연관 바이너리 함수(associative binary function):
  * 매개변수와 반환값의 타입이 동일한 바이너리 함수.
* 모노이드는 대수적 타입을 입력으로 받을 때 사용하는 가장 기본적이고 일반화된 타입.

## 모노이드 타입 클래스

```kotlin
interface Monoid<T> {
  fun mempty(): T
  
  fun mappend(m1: T, m2: T): T
}
```

* `mempty`: 항등원을 반환하는 함수.
* `mappend`: 바이너리 함수.
* 체이닝 가능하도록 하려면 두 함수가 `Monotid<T>`를 반환하도록 하면 된다.
* 덧셈 모노이드:
  ```kotlin
  class SumMonoid : Monoid<Int> {
    override fun mempty(): Int = 0

    override fun mappend(m1: Int, m2: Int): Int = m1 + m2
  }
  ```
* 곱셈 모노이드:
  ```kotlin
  class ProductMonoid : Monoid<Int> {
    override fun mempty(): Int = 1

    override fun mappend(m1: Int, m2: Int): Int = m1 * m2
  }
  ```

## 모노이드의 법칙

* 모노이드는 항등 법칙과 결합 법칙을 만족해야 한다.
* `empty` 함수가 `mappend` 함수의 입력일 때, 순서에 관계없이 동일한 결과를 반환해야 한다:
  ```kotlin
  mappend(mempty(), x) == x
  mappend(x, mempty()) == x
  ```
* `mappend` 함수를 사용해 여러 값을 하나로 줄일 때, 연산 순서에 관계없이 동일한 결과를 반환해야 한다:
  ```kotlin
  mappend(mappend(x, y), z) == mappend(x, mappend(y, z))
  ```
* 덧셈 모노이드가 법칙을 만족하는지 보면:
  ```kotlin
  SumMonoid().run { mappend(mempty(), 1) == 1 } // true
  SumMonoid().run { mappend(1, mempty()) == 1 } // true
  ```
  ```kotlin
  SumMonoid().run { mappend(mappend(1, 2), 3) == mappend(1, mappend(2, 3)) } // true
  ```
* 뺄셈이나 나눗셈의 경우 연산 순서에 영향을 받기 때문에 법칙을 만족하지 못한다.

## 메이비 모노이드

```kotlin
object MaybeMonoid {
  fun <T> monoid(inValue: Monoid<T>) = object : Monoid<Maybe<T>> {
    override fun mempty(): Maybe<T> = Nothing
    
    overrid fun mappend(m1: Maybe<T>, m2: Maybe<T>): Maybe<T> = when {
      m1 is Nothing -> m2
      m2 is Nothing -> m1
      m1 is Just && m2 is Just -> Just(inValue.mappend(m1.value, m2.value))
      else -> Nothing
    }
  }
}
```

* 메이비 모노이드는 `monoid`라는 정적 팩토리 함수를 이용해 작성한다:
  * 컴파일 타임에는 메이비가 가진 값이 어떤 타입인지 모르기 때문.
  * 가령 `MaybeMonoid<T : Monoid<T>> : Monoid<Maybe<T>>`와 같이 선언하면 `T`를 결합하는 방법이 덧셈인지 곱셈인지 알 수 없다.
  * 따라서 런타임에 `inValue`를 받고, `inValue`의 `append` 함수를 사용해 메이비의 값을 결합한다.
* 항등원은 `Nothing`이다:
  * 따라서 `mappend` 함수는 `m1`이나 `m2`가 `Nothing`이면 다른 값을 그대로 반환한다.
* `m1`, `m2`가 모두 `Just`면 `m1.value`, `m2.value`가 `inValue`의 `mappend`로 결합되어야 한다.

