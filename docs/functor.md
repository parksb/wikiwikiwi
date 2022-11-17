# 펑터

```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

```kotlin
interface Functor<out A> {
  fun <B> fmap(f: (A) -> B): Functor<B>
}
```

* 펑터는 '매핑 가능한' 행위를 선언한 타입 클래스:
  * '매핑 가능한'이란 리스트에 사용하는 `map`과 동일하다:
    ```kotlin
    fun <T, R> Iterable<T>.map(f: (T) -> R): List<R>
    ```
  * `map`은 `T` 타입의 값을 `f` 함수에 적용해 `R` 타입의 값을 얻어 `List<R>`로 반환한다.
* 펑터를 다시 정리하면:
  1. 리스트와 같은 컨테이너형 타입의 값을 꺼내서
  2. 인자로 받은 함수를 적용한 다음
  3. 함수의 결과값을 컨테이너형 타입에 넣어 반환
  4. 하는 행위를 선언한 타입 클래스다.
* 펑터 자체는 추상화된 타입이기 때문에 `List<T>`와 같은 일반화된 타입을 가진다:
  * 따라서 한 개의 매개변수를 받는 타입 생성자다.

## 메이비 펑터

```kotlin
sealed class Maybe<out A> : Functor<A> {
  abstract override fun toString(): String

  abstract override fun <B> fmap(f: (A) -> B): Maybe<B>
}
```
```kotlin
data class Just<out A>(val value: A) : Maybe<A>() {
  override fun toString(): String = "Just($value)"

  override fun <B> fmap(f: (A) -> B): Maybe<B> = Just(f(value))
}
```
```kotlin
data class Nothing<out A>(val value: kotlin.Nothing) : Maybe<A>() {
  override fun toString(): String = "Nothing"

  override fun <B> fmap(f: (kotlin.Nothing) -> B): Maybe<B> = Nothing
}
```

* 메이비는 어떤 값이 있을 수도 있고 없을 수도 있는 컨테이너형 타입:
  * 값의 유무를 각각 `Just`, `Nothing` 타입으로 표현한다.
  * 러스트의 `Option`과 같다.
* 메서드 체이닝을 지원하기 위해 `fmap`은 `Maybe` 타입을 반환하도록 오버라이드한다:
* `Just`와 `Nothing`에 각각 `fmap`을 호출해보면 이렇다:
  ```kotlin
  Just(10).fmap { it + 10 } // Just(20)
  Nothing.fmap { a: Int -> a + 10 }) // Nothing
  ```
* 펑터는 타입 생성자에서 컨테이너형 타입을 요구한다:
  * 즉, 어떤 값을 담을 수 있는 타입이라면 항상 펑터로 만드는 것을 고려해볼 수 있다.

## 이더 펑터

```kotlin
sealed class Either<out L, out R> : Functor<R> {
  abstract override fun <R2> fmap(f: (R) -> R2): Either<L, R2>
}
```
```kotlin
data class Right<out R>(val value: R): Either<Nothing, R>() {
  override fun <R2> fmap(f: (R) -> R2): Ether<Nothing, R2> = Right(f(value))
}
```
```kotlin
data class Left<out L>(val value: L): Either<L, Nothing>() {
  override fun <R2> fmap(f: (Nothing) -> R2): Ether<L, R2> = this
}
```

* 이더는 `Right`와 `Left` 타입만 허용하는 대수적 타입:
  * 함수 호출이 성공하면 올바른 결과를 `Right`에, 실패하면 에러를 `Left`에 담아 반환한다.
  * 러스트의 `Result`와 같다.
* 메이피 펑터와 달리 타입 매개변수가 두 개다:
  * `Right`에 포함된 값의 타입과 `Left`에 포함된 값의 타입이 다를 수 있기 때문.
  * 이더는 일반적으로 `Right` 값만 변경할 수 있으므로 `Left` 값은 생성 시점에 고정된다.
* `Right`와 `Left`에 각각 `fmap` 을 호출해보면 이렇다:
  ```kotlin
  fun divideTenByN(n: Int): Either<String, Int> = try {
    Right(10 / n)
  } catch (e: ArithmeticException) {
    Left("divide by zero")
  }

  divideTenBy(5) // Right(value=2)
  divideTenBy(0) // Left(value="divide by zero")

  divideTenBy(5).fmap { r -> r * 2 } // Right(value=4)
  divideTenBy(0).fmap { r -> r * 2 } // Left(value="divide by zero")
  ```
* `Functor`의 타입 생성자는 매개변수가 한 개이기 때문에 타입이 다른 두 개 이상의 매개변수를 가지는 타입을 `Functor`의 인스턴스로 만들기 위해서는 `fmap` 함수에 의해 변경되는 매개변수를 제외한 나머지 값들을 고정해야 한다.

## 단항 함수 펑터

```kotlin
data class UnaryFunction<in T, out R>(val g: (T) -> R) : Functor<R> {
  override fun <R2> fmap(f; (R) -> R2): UnaryFunction<T, R2> =
    UnaryFunction { x: T -> f(g(x)) }

  fun invoke(input: T): R = g(input)
}
```

* 함수도 펑터로 만들 수 있다.
* 함수는 여러 개의 매개변수를 받을 수 있지만, `Functor` 타입 클래스는 하나의 매개변수만 가진다:
  * 이 문단에서는 매개변수가 하나인 단항 함수에 대한 펑터로 제한한다.
  * 단항 함수는 입력 하나, 출력 하나를 가지므로 타입 매개변수 두 개가 필요하다.
  * 이때 변경되는 값은 출력 뿐이므로 입력 값은 고정할 수 있다.
  * 따라서 펑터의 타입은 `Functor<R>`이다.
* `fmap` 메서드:
  * 펑터 안의 함수 `g`를 인자로 전달된 함수 `f`에 적용하고 결과를 `UnaryFunction`에 넣어 반환한다.
  * 체이닝을 위해 `UnaryFunction<T, R2>` 타입을 반환한다.
* `invoke` 메서드:
  * 펑터 안의 함수 `g`를 호출한 결과를 그대로 반환한다.
* 실제로 사용해보면 이렇다:
 ```kotlin
  val f = { a: Int -> a + 1 }
  val g = { b: Int -> b * 2 }

  val fg = UnaryFunction(g).fmap(f)

  fg.invoke(5) // 11
 ```
* 입출력이 하나인 `UnaryFunction`을 체이닝하면 결국 입력이 여러 개인 함수와 동일해진다:
  * `famp`의 타입입 `((T) -> R) -> R2`가 `T -> ((R) -> R2)`와 같기 때문이다.
  * 커링과 동일한 원리다.
* 다른 펑터로 컨텍스트를 변경할 수도 있다:
  ```kotlin
  val f = { a: Int -> a + 1 }
  val g = { b: Int -> Just(b) }

  val fg = UnaryFunction(g).fmap(f)

  fg.invoke(5) // Just(10)
  ```

## 펑터의 법칙

* 펑터가 되기 위해서는 두 가지 법칙을 만족해야 한다.
  * 펑터를 통해 항등 함수를 매핑하면 반환되는 펑터는 원래의 펑터와 같다.
  * 두 함수를 합성한 함수의 매핑은 각 함수를 매핑한 결과를 합성한 것과 같다.
* 펑터의 법칙을 만족하면 펑터의 `fmap`이 매핑 동작 외에는 어떤 것도 하지 않는다는 것을 보장할 수 있다.

### 펑터 제1법칙

```kotlin
fmap(identity()) == identity()
```

* 매핑 함수에 에 항등 함수를 입력으로 넣으면 결과는 반드시 항등 함수를 호출한 결과와 같아야 한다.
* 이때 항등 함수는 `{ x -> x }`와 같이 인자를 항상 그대로 반환하는 함수다.
* `Maybe` 펑터가 제1법칙을 만족하는지 보면:
  ```kotlin
  fun <T> identity(x: T): T = x
  ```
  ```kotlin
  Nothing.fmap { identity(it) } == identity(Nothing) // true
  Just(5).fmap { identity(it) } == identity(Just(5)) // true
  ```

### 펑터 제2법칙

```kotlin
fmap(f compose g) == fmap(f) compose fmap(g)
```

* 함수 `f`와 `g`를 합성한 결과를 `fmap`의 입력으로 넣어서 얻은 결과는 각 함수를 따로 `fmap`의 입력으로 넣어 얻은 결과를 합성한 결과와 같아야 한다.
* `Maybe` 펑터가 제2법칙을 만족하는지 보면:
  ```kotlin
  infix fun <F, G, R> ((F) -> R).compose(g: (G) -> F): (G) -> R =
    { gInput: G -> this(g(gInput)) }
  ```
  ```kotlin
  val f = { a: Int -> a + 1 }
  val g = { b: Int -> b * 2 }
  ```
  ```kotlin
  val left = Nothing.fmap(f compose g)
  val right = Nothing.fmap(g).fmap(f)
  left == right // true
  ```
  ```kotlin
  val left = Just(5).fmap(f compose g)
  val right = Just(5).fmap(g).fmap(f)
  left == right // true
  ```
  * `compose`는 입출력 함수이기 때문에 `Maybe`로는 체이닝이 불가능하다:
    * 그래서 `Nothing.fmap(f) compose Nothing.fmap(g)` 처럼하면 컴파일 에러가 난다.
    * 이는 [[applicative-functor]]{애플리케이티브 펑터}를 사용해 해결해야 한다.
    * 하지만 여기에선 `fmap`을 체이닝하는 것으로 대체한다.
