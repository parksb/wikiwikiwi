# 애플리케이티브 펑터

```haskell
class Functor f => Applicative f where
  pure  :: a -> f a
  (<*>) :: f (a -> b) -> f a -> f b
```

```kotlin
interface Applicative<out A> : Functor<A> {
  fun <V> pure(value: V): Applicative<V>

  infix fun <B> apply(ff: Applicative<(A) -> B>): Applicative<B>
}
```

* 함수를 가진 펑터가 다른 펑터의 값을 적용할 때 컨텍스트 안에서 처리할 수 없는 한계를 극복하기 위한 펑터.
* 값이 `Just({ x -> x * 2})`인 펑터와 `Just(5)`, 함수 `{ x- > x * 2 }`만 꺼내서 `Just(5)`에 적용하려면:
  * 일반적인 펑터:
    * `Just(5).fmap(Just({ x -> x * 2 }))`
    * 펑터는 일반적인 함수 `f: (A) -> B`로만 매핑할 수 있으므로 컴파일 에러가 발생한다.
  * 애플리케이티브 펑터:
    1. 첫 번째 펑터 `Just({ x -> x * 2 })`에서 `{ x -> x * 2 }`를 꺼낸다.
    2. 두 번째 펑터 `Just(5)`에서 `5`를 꺼낸다.
    3. 첫 번째 펑터에서 꺼낸 함수에 두 번째 펑터에서 꺼낸 값을 적용한다: `5 -> 5 * 2`
    4. 마지막으로 적용한 결과를 `Just`에 담아 `Just(10)`을 반환한다.
* 펑터의 `fmap`과 애플리케이티브 `apply`를 비교하면:
  * `fun <B> fmap(f: (A) -> B): Functor<B>`
  * `infix fun <B> apply(ff: Applicative<(A) -> B>): Applicative<B>`

## 메이비 애플리케이티브 펑터

```kotlin
sealed class ApplicativeMaybe<out A> : Applicative<A> {
  companion object {
    fun <V> pure(value: V): Applicative<V> = ApplicativeJust(0).pure(value)
  }

  override fun <V> pure(value: V): Applicative<V> = ApplicativeJust(value)

  abstract override fun <B> apply(ff: Applicative<(A) -> B>): ApplicativeMaybe<B>
}
```
```kotlin
data class ApplicativeJust<out A>(val value: A) : ApplicativeMaybe<A>() {
  override fun toString(): String = "ApplicativeJust($value)"

  override fun <B> apply(ff: Applicative<(A) -> B>): ApplicativeMaybe<B> = when (ff) {
    is ApplicativeJust -> fmap(ff.value)
    else -> ApplicativeNothing
  }

  override fun <B> fmap(f: (A) -> B): ApplicativeMaybe<B> = ApplicativeJust(f(value))
}
```
```kotlin
object ApplicativeNothing : ApplicativeMaybe<kotlin.Nothing>() {
  override fun toString(): String = "ApplicativeNothing"

  override fun <B> apply(ff: Applicative<kotlin.Nothing>): ApplicativeMaybe<B> = ApplicativeNothing

  override fun <B> fmap(f: (kotlin.Nothing) -> B): ApplicativeMaybe<B> = ApplicativeNothing
}
```

* 애플리케이티브 펑터도 기본적으로 펑터이기 때문에 `fmap` 함수를 정상적으로 실행해야 한다:
  ```kotlin
  ApplicativeJust(5).fmap { it * 2 } // ApplicativeJust(5)
  ApplicativeNothing.fmap { x: Int -> x + 10 } // ApplicativeNothing
  ```
* `pure` 함수는 입력받은 값을 그대로 컨텍스트에 넣어서 반환한다:
  ```kotlin
  ApplicativeMaybe.pure(10) // ApplicativeJust(5)
  ```
* `apply` 함수는 함수를 가진 메이비를 받아 값을 적용한 뒤 메이비에 넣어서 반환한다:
  ```kotlin
  ApplicativeJust(5) apply ApplicativeJust({ x: Int -> x * 2 }) // ApplicativeJust(10)
  ApplicativeNothing apply ApplicativeJust({ x: Int -> x * 2 }) // ApplicativeNothing
  ```
* 체이닝도 가능하다:
  ```kotlin
  ApplicativeMaybe.pure(5)
    apply ApplicativeJust({ x: Int -> x * 2 })
    apply ApplicativeJust({ x: Int -> x + 10 }) // ApplicativeJust(20)
  ```
  * 애플리케이티브 스타일 프로그래밍은 컨텍스트를 유지한 상태에서 함수에 의한 데이터 변환을 체이닝하는 방식이다.
  * 만약 `ApplicativeMaybe.pure({ x: Int -> x * 2 })` 컨텍스트에서 체이닝을 시도하면 컴파일 에러가 발생한다.
  * `Applicative` 타입 클래스가 타입 매개변수가 한 개인 메이비만 허용하기 때문이다.
  * [[higher-order-function]]{매개변수를 여러 개 전달하려면 커링을 사용한다:}
    ```kotlin
    fun <P1, P2, R> ((P1, P2) -> R).curried(): (P1) -> (P2) -> R =
      { p1: P1 -> { p2: P2 -> this(p1, p2) } }
    ```
    ```kotlin
    ApplicativeMaybe.pure({ x: Int, y: Int -> x * y }.curried())
      apply ApplicativeJust(10)
      apply ApplicativeJust(20) // ApplicativeJust(200)
    ```
  * 상속으로 펑터를 확장해 애플리케이티브 펑터를 만드는 대신 확장 함수를 사용할 수도 있다:
    ```kotlin
    sealed class Maybe<out A> : Functor<A> {
      abstract override fun toString(): String

      abstract override fun <B> fmap(f: (A) -> B): Maybe<B>

      companion object
    }

    fun <A> Maybe.Companion.pure(value: A) = Just(value)

    infix fun <A, B> Maybe<(A) -> B>.apply(f: Maybe<A>): Maybe<B> = when (this) {
      is Just -> f.fmap(value)
      is Nothing -> Nothing
    }
    ```

## 애플리케이티브 펑터의 법칙

* 모든 애플리케이티브 펑터가 지켜야하는 법칙이 있다.
* 수학적으로 증명된 법칙들이기 때문에 법칙을 만족한다면 항상 기대 동작을 보장한다.
* 수학적으로 자세한 내용은 [프로그래머를 위한 카테고리 이론](https://github.com/pilgwon/CategoryTheory) 참고.

### 항등 법칙

```kotlin
pure(identity) apply af = af
```

* 항등 함수에 값을 적용하는 것 외에는 아무것도 하지 않는다.
* 따라서 그대로 `af`를 반환해야 한다.
* `ApplicativeMaybe`가 항등 법칙을 만족하는지 보면:
  ```kotlin
  fun identity() = { x: Int -> x }
  ```
  ```kotlin
  val af = ApplicativeJust(10)
  ApplicativeMaybe.pure(identity()) apply af == af // true
  ```

### 합성 법칙

```kotlin
pure(compose) apply af1 apply af2 apply af3 = af1 apply (af2 apply af3)
```

* 좌변: `pure`를 사용해 합성함수 `compose`를 넣고 애플리케이티브 펑터 `af1`, `af2`, `af3`를 적용.
* 우변: 애플리케이티브 펑터 `af2`, `af3`를 적용한 애플리케이티브 펑터를 `af1`에 적용.
* 이때 좌변과 우변이 같아야 한다.
* `ApplicativeMaybe`가 합성 법칙을 만족하는지 보면:
  ```kotlin
  fun <P1, P2, P3> compose() = { f: (P2) -> P3, g: (P1) -> P2, v: P1 -> f(g(v)) }
  ```
  ```kotlin
  val af1 = ApplicativeJust({ x: Int -> x * 2 })
  val af2 = ApplicativeJust({ x: Int -> x + 1 })
  val af3 = ApplicativeJust(30)

  ApplicativeMaybe.pure(compose<Int, Int, Int>().curried()) apply af1 apply af2 apply af3
    == af1 apply (af2 apply af3) // true
  ```

### 준동형 사상 법칙

```kotlin
pure(function) apply pure(x) = pure(function(x))
```

* 좌변: `pure`를 사용해 함수와 값 `x`를 애플리케이티브 펑터에 넣는다.
* 우변: 애플리케이티브 펑터에 `function(x)`를 넣는다.
* 이때 좌변과 우변이 같아야 한다.
* `ApplicativeMaybe`가 준동형 사상 법칙을 만족하는지 보면:
  ```kotlin
  val function = { x: Int -> x * 2 }
  val x = 10

  ApplicativeMaybe.pure(function) apply ApplicativeMaybe.pure(x)
    == ApplicativeMaybe.pure(function(x)) // true
  ```

### 교환 법칙

```kotlin
af apply pure(x) = pure(of(x)) apply af
```

* 좌변: 애플리케이티브 펑터 `af`와 값 `x`를 넣은 애플리케이티브 펑터를 적용.
* 우변: `of(x)`를 애플리케이티브 펑터에 넣어 `af`를 적용.
* 이때 좌변과 우변이 같아야 한다.
* `of`는 `x`를 다른 함수의 매개변수로 제공하는 함수다:
  ```kotlin
  fun <T, R> of(value: T) = { f: (T) -> R -> f(value) }
  ```
  * `value` 값을 받아 다른 함수(`(T) -> R`)의 입력 매개변수로 사용하는 람다 함수를 반환한다.
  * 이를 통해 미래에 입력받을 함수에 값 `value`를 적용할 함수를 만들 수 있다.
  * 값 `x`를 미래에 적용될 함수로 만듦으로써 `pure` 함수의 입력으로 넣을 수 있게 해준다.
* `ApplicativeMaybe`가 교환 법칙을 만족하는지 보면:
  ```kotlin
  val af = ApplicativeJust({ a: Int -> a * 2 })
  val x = 10

  af apply ApplicativeMaybe.pure(x) == ApplicativeMaybe.pure(of<Int, Int>(x)) apply af // true
  ```

### 펑터와 애플리케이티브 펑터의 관계 법칙

```kotlin
pure(function) apply af = af.fmap(function)
```

* 앞선 4개 법칙을 활용해 펑터와의 관계 법칙을 도출할 수 있다.
* `ApplicativeMaybe`가 펑터와 애플리케이티브 펑터의 관계 법칙을 만족하는지 보면:
  ```kotlin
  val function = { x: Int -> x * 2 }
  val af = ApplicativeJust(10)

  ApplicativeMaybe.pure(function) apply af == af.fmap(function) // true
  ```
