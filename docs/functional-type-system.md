# 함수형 타입 시스템

* 함수형 프로그래밍 관점에서의 타입 시스템.
* 객체 뿐 아니라 표현식도 타입을 가질 수 있다.

## 대수적 데이터 타입

* 다른 타입들을 결합해 새롭게 정의되는 합성 타입.
* 곱 타입과 합 타입으로 나눌 수 있다.

### 곱 타입

* 두 개 이상의 타입을 AND로 결합한 타입.
* 하나의 자료구조에 여러 타입을 한번에 정의할 수 있다:
  ```kotlin
  class Circle(val name: String, val x: Float, val y: Float, val radius: Float)
  ```
  * 여기서 `Circle`은 String, Float 타입을 AND로 결합해 새롭게 정의한 타입.
* 클래스는 타입 간의 AND 결합만 가능하다:
  ```kotlin
  open class Shape(name: String, x: Float, y: Float)
  class Circle(val name: String, val x: Float, val y: Float, val radius: Float): Shape(name, x, y)
  class Square(val name: String, val x: Float, val y: Float, val length: Float): Shape(name, x, y)
  ```
  * `Shape`은 `Circle`이자, `Square`이다.
  * 만약 여기에 `Line` 클래스를 추가한다면 `Shape`의 형태가 완전히 달라져야 한다:
    ```kotlin
    open class Shape(name: String)
    class Circle(val name: String, val x: Float, val y: Float, val radius: Float): Shape(name, x, y)
    class Square(val name: String, val x: Float, val y: Float, val length: Float): Shape(name, x, y)
    class Line(val name: String, val x1: Float, val y1: Float, val x2: Float, val y2: Float): Shape(name, x, y)
    ```
  * 계층 구조가 복잡하면 유지보수나 유연성에 악영향을 끼친다.
* 클래스뿐 아니라 다른 곱 타입들도 타입을 결합하는 방법은 AND밖에 없다.
* 곱 타입은 타입을 구성하는 값(여기서는`Circle`, `Square`, `Line` 등)의 합이 전체를 의미하지 않는다:
  ```kotlin
  when (shape) {
    is Circle -> ...
    is Square -> ...
    is Line -> ...
    else -> throw IllegalArgumentException()
  }
  ```
  * 컴파일러는 `Shape`의 하위 클래스가 얼마나 있을지 모르기 때문에 예외처리를 해줘야 한다.

### 합 타입

* 곱 타입과 달리 두 개 이상의 타입을 OR로 결합한 타입.
* 코틀린에서는 `sealed class`를 통해 합 타입을 만들 수 있다:
  ```kotlin
  sealed class Shape
  data class Circle(val name: String, val x: Float, val y: Float, val radius: Float): Shape()
  data class Square(val name: String, val x: Float, val y: Float, val length: Float): Shape()
  data class Line(val name: String, val x1: Float, val y1: Float, val x2: Float, val y2: Float): Shape() 
  ```
  * `Shape`은 `Circle` 또는 `Square` 또는 `Line`이다.
  * 코틀린의 열거형도 합 타입의 일종이다. (한가지 생성자만 가질 수 있는 제한적인 합 타입)
* 곱 타입과 다르게 합 타입에서는 부분의 합이 전체를 의미한다:
  ```kotlin
  when (shape) {
    is Circle -> ...
    is Square -> ...
    is Line -> ...
  }
  ```
  * 따라서 부수적효과(`else`)를 따로 처리해줄 필요가 없다.
* 합 타입을 사용하면 다양한 장점이 있다:
  * 복잡한 상속 구조를 피하면서도 확장이 용이한 타입을 정의할 수 있다.
  * 컴파일러가 쉽게 타입을 추론, 검사할 수 있다.
  * 더 쉽게 타입을 결합하고 확장할 수 있다.
  * 생성자 패턴 매칭을 활용해 더 간결한 코드를 작성할 수 있다.

## 타입의 구성요소

* 타입은 표현식이 어떤 범주에 포함되는지 알려주는 라벨과 같다.
* 가령 `String`을 보면 표현식이 문자열이라는 것을 알 수 있다.

### 타입 변수

* 제네릭으로 선언된 `T`를 타입 변수라고 한다:
  ```kotlin
  fun <T> head(list: List<T>): T = list.first()
  ```
  * 이렇게 타입 변수를 가진 함수를 다형 함수라고 한다.
  * 타입이 결정되는 시점은 함수를 호출할 때다: `head(listOf(1, 2, 3)) // Int`
* 타입 변수를 사용하면 함수를 쉽게 일반화할 수 있다.
* 새로운 타입을 정의할 때도 타입 변수를 사용할 수 있다:
  ```kotlin
  class Box<T>(t: T) {
    val value = t
  }
  ```
* 타입이 복잡해지면 코드를 통해 타입을 유추하기 힘들 수 있다:
  ```kotlin
  val list = listOf(Box(1), Box("str")) // List<Any>
  ```
  * 컴파일러는 코틀린 최상위 오브젝트인 `List<Any>`로 타입을 추론한다. 

### 값 생성자

* 타입의 값을 반환하는 생성자.
* `Box` 타입의 값 생성자는 `class Box<T>(t: T)`이다.
* 값 생성자가 여러 개일 수도 있다:
  * `Shape` 타입의 값 생성자는 `Circle`, `Square`, `Line` 3개다.
  * 코틀린 열거형의 경우 값 생성자는 값 생성자로만 사용되고, 타입으로는 사용될 수 없다.

### 타입 생성자와 타입 매개변수

* 타입 생성자는 새로운 타입을 생성하기 위해 매개변수화된 타입을 받을 수 있음.
* 가령 `class Box<T>(t: T)`에서 `Box`는 타입 생성자, `T`는 타입 매개변수:
  * 매개변수의 타입에 따라 여러 타입을 만들 수 있다.
  * 인자 값을 전달할 때 타입 추론에 의해 타입 매개변수가 결정된다.
* 값 생성자에 포함된 타입들이 타입의 동작과 관계가 없을 때 타입 매개변수를 사용한다.

## 행위를 가진 타입

* 인터페이스, 추상 클래스, 트레이트, 믹스인 등으로 행위를 가진 타입을 정의할 수 있다.
* 언어마다 구현이 다르기 때문에 용어 자체보다는 구현에 따른 기능과 한계를 알아야 한다.

### 인터페이스

```kotlin
interface Developer {
  val language: String
  
  fun writeCode(): String
}
```

* 객체지향 프로그래밍에서 인터페이스는 클래스의 기능 명세.
* 메서드의 시그니처로 클래스의 행위를 정의하고, 구현은 하지 않는다:
  * 인터페이스를 구현하는 하위 클래스에서 메서드의 구현부를 정의해야 한다. 
* 여러 클래스가 하나의 인터페이스를 구현할 수 있다.

### 트레이트

```kotlin
interface Developer {
  val language: String
  
  fun writeCode(): String = "code"
}
```

* 인터페이스와 비슷하지만, 구현부를 포함한 메서드를 정의할 수 있다.
* 코틀린의 `interface`는 사실 트레이트다.

### 추상 클래스

```kotlin
abstract class Developer {
  abstract val language: String
  
  abstract fun writeCode(): String
  
  fun findBugs(): String = "bugs"
}
```

* 상속 관계에서 추상적인 객체를 나타내기 위한 클래스.
* 추상 메서드는 해당 추상 클래스를 상속하는 클래스에서 구현부를 정의해야 한다.
* 추상 클래스는 클래스이기 때문에 인터페이스나 트레이트와는 사용 목적이 다르다.
* 코틀린에서는 다중 상속이 불가능하다.

### 믹스인

```kotlin
interface Developer {
  val language: String
  
  fun writeCode(): String = "code $language"
}

interface BackendDeveloper : Developer {
  fun operateEnv(): String = "backend env"
  
  override val language: String
    get() = "rust"
}

interface FrontendDeveloper : Developer {
  fun operateEnv(): String = "frontend env"
  
  override val language: String
    get() = "elm"
}

interface FullStackDeveloper : FrontendDeveloper, BackendDeveloper {
  override val language: String
    get() = super<FrontendDeveloper>.language + super<BackendDeveloper>.language
}
```

* 클래스 간에 어떤 프로퍼티나 메서드를 결합하는 것.
* 메서드 재사용성이 높고 다중 상속에서 발생하는 모호성을 해결 할 수 있다.
* 위 코드에서 `FullStackDeveloper`는 다중 상속을 받는다:
  * `language` 프로퍼티만 오버라이드해 `BackendDeveloper`와 `FrontendDeveloper`의 `language`를 믹스인했다.

### 타입 클래스

```kotlin
interface Eq<in T> {
  fun equal(t: T): Boolean
  fun notEqual(t: T): Boolean = this != t
}

sealed class TrafficLight: Eq<TrafficLight> {
  override fun equal(t: TrafficLight): Boolean = this == t
}
object RedLight: TrafficLight()
object YellowLight: TrafficLight()
object GreenLight: TrafficLight()
```

* 타입의 행위를 선언하는 방법을 타입 클래스라고 한다:
  * 행위에 대한 선언을 할 수 있다.
  * 필요하다면 행위의 구현부도 포함할 수 있다.
* 객체지향 프로그래밍에서의 클래스와는 의미가 다르다.
* 코틀린의 인터페이스와 비슷하지만, 타입 클래스는 타입의 선언 부분과 인스턴스로 정의하는 부분이 분리되어 있다:
  * :question: 러스트의 `trait`, `impl` 조합이 타입 클래스의 속성에 부합하지 않을지?
* 참고로 위 코드에서 `TrafficLight`는 세 가지 값을 가지는 대수적 타입.
