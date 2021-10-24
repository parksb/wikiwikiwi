# 변성

* 타입의 계층 관계에서 타입의 가변성을 처리하는 방식.
* 타입 `S`가 `T`의 하위 타입일 때:
  * 무공변(invariant): `Box[S]`와 `Box[T]`는 상속 관계가 없다.
  * 공변(covariant): `Box[S]`는 `Box[T]`의 하위 타입이다.
  * 반공변(contravariant): `Box[T]`는 `Box[S]`의 하위 타입이다.
* `Dog` < `Canine` < `Animal` 상속 관계가 있다고 전제하고 각 변성을 살펴본다:
  ```kotlin
  interface Box<T>
  
  class Animal
  class Canine : Animal()
  class Dog : Canine()
  ```
  ```kotlin
  val animalBox = object : Box<Animal> {}
  val canineBox = object : Box<Canine> {}
  val dogBox = object : Box<Dog> {}
  ```

## 무공변

```kotlin
fun invariant(value: Box<Canine> {}

invariant(animalBox) // compile error
invariant(canineBox)
invariant(dogBox) // compile error
```


* 타입 `S`가 `T`의 하위 타입일 때 `Box[S]`와 `Box[T]` 사이에 상속 관계가 없는 경우.
* 위 코드에서 `animalBox`, `canineBox`, `dogBox` 사이에는 상속 관계가 없다.
* 상속 관계가 없으므로 `Box<Animal>`을 매개변수로 받는 함수는 `Box<Canine>`, `Box<Dog>` 타입을 입력받을 수 없다.
* 이때 `Box<Animal>`의 변성은 무공변이 된다.

## 공변

```kotlin
fun covariant(value: Box<out Canine> {}

covariant(animalBox) // compile error
covariant(canineBox)
covariant(dogBox)
```

* 타입 `S`가 `T`의 하위 타입일 때 `Box[S]`가 `Box[T]`의 하위 타입인 경우.
* 코틀린에서는 공변 타입 매개변수를 `<out T>`로 선언한다.

## 반공변

```kotlin
fun contravariant(value: Box<in Canine>) {}

contravariant(animalBox)
contravariant(canineBox)
contravariant(dogBox) // compile error
```

* 타입 `S`가 `T`의 하위 타입일 때 `Box[S]`가 `Box[T]`의 상위 타입인 경우.
* 코틀린에서는 반공변 타입 매개변수를 `<in T>`로 선언한다.

