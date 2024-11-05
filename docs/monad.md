# 모나드

* [[functor]]{펑터}는 `(A) -> B`, `(B) -> C` 함수를 합성해 `(A) -> C` 함수를 만든다. 하지만 펑터는 `Just({ x -> x * 2 })`와 `Just(5)` 같이 함수와 값이 컨텍스트 안에 있을 때는 사용할 수 없다.
* [[applicative-functor]]{애플리케이티브 펑터}는 `apply` 함수를 이용해 문제를 해결한다. `Just({ x -> x * 2 })`에 `Just(5)`를 적용해 `Just10)`을 얻을 수 있다.
* 반대로 `Just(5)`를 `{ x -> x * 2 }` 함수의 입력으로 넣으려면 어떻게 해야할까? 즉, 어떤 값이 포함된 컨텍스트에 대해 일반적인 값을 받아서 컨텍스트를 반환하는 함수의 입력으로 넣으려면 어떻게 해야할까?
* 모나드는 `flatMap`이라는 함수를 제공하는 펑터이자 애플리케이티브 펑터이다. 따라서 모나드를 애플리케이티브 펑터의 확장으로 볼 수도 있다.

## 모나드 타입 클래스

```haskell
class Monad m where
  return :: a -> m a

  (>>=) :: m a -> (a -> m b) -> m b

  (>>)  :: m a -> m b -> m b
  m1 >> m2 = m1 >>= \_ -> m2
```

```kotlin
interface Monad<out A> : Functor<A> {
  fun <V> pure(value: V): Monad<V>

  override fun <B> fmap(f: (A) -> B): Monad<B> = flatMap { a -> pure(f(a)) }

  infix fun <B> flatMap(f: (A) -> Monad<B>): Monad<B>

  infix fun <B> leadTo(m: Monad<B>): Monad<B> = flatMap { m }
}
```

* `flatMap`:
  * `Monad<A>`를 `(A) -> Monad<B>` 함수에 적용해서 `Monad<B>`를 반환하는 함수.
  * 중첩된 컨텍스트를 하나의 컨텍스트로 펼쳐서 매핑할 수 있다. 가령 `Monad<Monad<A>>`를 입력으로 받으면 `(Monad<A>) -> Monad<B>` 타입의 매핑 함수를 사용해서 `Monad<B>`로 중첩을 벗겨낸 값을 매핑할 수 있다.
  * 중요한 것은 `flatMap`을 이용하면 모나드 컨텍스트에 있는 값을 일반값처럼 다룰 수 있다는 것.
* `pure`: 입력받은 값을 모나드 컨텍스트에 그대로 넣어서 반환한다. 애플리케이티브 펑터의 `pure`와 동일하다.
* `leadTo`: 기존 컨텍스트 `Monad<A>`의 값 `A`를 무시하고, 입력받은 `Monad<B>`로 컨텍스트를 이어갈 때 사용하는 함수.
* `ApplicativeFunctor`가 아닌 `Functor`를 상속한 이유는 이전에 [[applicative-functor]]{애플리케이티브 펑터}를 확장 함수로 구현했기 때문이다.

## 메이비 모나드

```kotlin
sealed class Maybe<out A> : Monad<A> {
  companion object {
    fun <V> pure(value: V) : Maybe<V> = Just(0).pure(value)
  }

  override fun <V> pure(value: V): Maybe<V> = Just(value)

  override fun <B> fmap(f: (A) -> B): Maybe<B> = supre.fmap(f) as Maybe<B>

  override infix fun <B> flatMap(f: (A) -> Monad<B>): Maybe<B> = when (this) {
    is Just -> try { f(value) as Maybe<B> } catch (e: ClassCastException) { Nothing }
    is Nothing -> Nothing
  }
}
```

```kotlin
data class Just<out A>(val value: A) : Maybe<A>() {
  override fun toString(): String = "Just($value)"
}
```

```kotlin
object Nothing : Maybe<kotlin.Nothing>() {
  override fun toString(): String = "Nothing"
}
```

```kotlin
infix fun <A, B> Maybe<(A) -> B>.apply(f: Maybe<A>): Maybe<B> = when (this) {
  is Just -> f.fmap(value)
  is Nothing -> Nothing
}
```

* `flatMap` 함수는 `Maybe`가 `Just`일 때 입력받은 함수 `f`에 값 `value`를 적용한 결과를 반환한다:
  ```kotlin
  Just(10).flatMap { x -> Maybe.pure(x * 2) } // Just(20)
  Nothing.flatMap { x: Int -> Maybe.pure(x * 2) // Nothing
  Just(Just(10)).flatMap { m -> m.fmap { x => x * 2 } } // Just(20)
  ```
* `Just`와 `Nothing`에 각각 fmap을 적용해보면 이렇다:
  ```kotlin
  Just(10).fmap { it + 10 } // Just(20)
  Nothing.fmap { x: Int -> x + 10 } // Nothing
  ```
* `leadTo` 함수의 동작은 이렇다:
  ```kotlin
  Just(10).leadTo(Nothing) // Nothing
  Nothing.leadTo(Just(10)) // Nothing
  Just(10).leadTo(Just(20)) // Just(20)
  ```
* 애플리케이티브 펑터의 `apply` 함수는 단순히 컨텍스트가 가진 함수의 매개변수로 컨텍스트를 전달한다. 반면 `flatMap` 함수는 기존 컨텍스트의 결과를 입력으로 받아 동작을 이어갈 수 있다.

## 모나드 법칙

* 작성한 타입이 모나드 법칙을 만족하면 안전하게 동작함을 보장할 수 있다.
* 모나드 법칙은 카테고리 이론을 기반으로 하여 수학적으로 증명되어 있다.

### 왼쪽 항등 법칙

```kotlin
pure(x) flatMap f = f(x)
```

* 좌변은 어떤 값 `x`를 `pure` 함수에 넣어 모나드로 만든 다음 `flatMap` 함수에 일반값을 매개변수로 받는 함수 `f`를 넣어 변환한 모나드를 반환한다.
* 우변은 함수 `f`에 `x`를 적용한 모나드를 반환한다.
* 이때 좌변과 우변의 결과가 같아야 한다.
* 메이비 모나드가 왼쪽 항등 법칙을 만족하는지 보면:
  ```kotlin
  val x = 10
  val f = { a: Int -> Just(a * 2) }
  val pure = { a: Int -> Just(a) }

  pure(x) flatMap f == f(x)) // true
  ```

### 오른쪽 항등 법칙

```kotlin
m flatMap pure = m
```

* 어떤 모나드 `m`의 `flatMap` 함수에 `pure` 함수를 넣은 결과는 모나드 `m`을 그대로 반환해야 한다.
* 메이비 모나드가 오른쪽 항등 법칙을 만족하는지 보면:
  ```kotlin
  val pure = { a: Int -> Just(a) }
  val m = Just(10)

  m flatMap pure == m // true
  ```

### 결합 법칙

```kotiln
(m flatMap f) flatMap g = m flatMap { x -> f(x) flatMap g }
```

* 함수 `f`, `g`는 일반값을 입력받아서 모나드를 반환한다.
* 좌변은 `m`과 `f`를 `flatMap` 함수로 적용한 뒤 `g`를 적용한다.
* 우변은 `m`과 `{ x -> f(x) flatMap g }`를 `flatMap` 함수로 적용한다.
* 이때 좌변과 우변의 결과가 같아야 한다. 즉, `flatMap`이 어떤 순서로 중첩되어 호출되든 동일한 결과를 반환해야 한다.
* 메이비 모나드가 결합 법칙을 만족하는지 보면:
  ```kotlin
  val f = { a: Int -> Just(a * 2) }
  val g = { a: Int -> Just(a + 1) }
  val m = Just(10)

  (m flatMap f) flatMap g == m flatMap { a -> f(a) flatMap g } // true
  ```

### 함수 합성 관점에서의 모나드 법칙

* 함수 합성의 성질을 이용해서 정리하면 보다 직관적인 수식을 얻을 수 있다.
* 항등 법칙과 결합 법칙을 항등 함수와 일반 함수 `f`, `g`, `h`의 합성으로 재정립하면:
  ```kotlin
  identity compose f = f
  ```
  ```kotlin
  f compose identity = f
  ```
  ```kotlin
  (f compose g) compose h = f compose (g compose h)
  ```

## IO 모나드

* 입출력은 외부와의 연결이 불가피하기 때문에 필연적으로 데이터의 순수성을 깬다.
* 하스켈의 경우 프로그램의 순수한 영역과 상태를 변경해야 하는 사이드 이펙트 영역을 완전히 분리하는 방법으로 입출력을 구현했다.
* 입출력 컨텍스트를 IO 모나드로 분리해서 관리하고, 모나드 내부에서 일어나는 작업이 외부에 영향을 줄 수 없도록 할 수 있다.
* 코틀린은 입출력과 비입출력 영역을 분리하도록 강제하지 않으므로, 프로그래머가 최대한 분리해서 작성해야 한다.

## 참고자료

* [서재원, "3분 모나드, 2020.](https://overcurried.com/3%EB%B6%84%20%EB%AA%A8%EB%82%98%EB%93%9C/)
* [엑스티, "모나드 괴담", 2015.](https://xtendo.org/ko/monad)
