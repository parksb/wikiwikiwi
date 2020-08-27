# The Rust Programming Language Book

## Introduction

* 러스트는 [그레이든 호어(Graydon Hoare)](https://github.com/graydon)가 만들기 시작해, 현재는 모질라가 메인테이닝하고 있는 프로그래밍 언어다.
* 다양한 언어로부터 영향을 받았다. 데이터 타입이나 추상 머신 모델은 C, 옵셔널 바인딩은 스위프트, 함수형 프로그래밍은 하스켈, 속성은 ECMA, 메모리 모델은 C++ 등.
* 거의 C 정도로 안정적이라는 느낌. 모질라 재단에서 메인테이닝하는 것도 너무 좋다.

## Installation

* Rustup을 이용해 간단하게 설치할 수 있다.
  ```bash
  $ curl https://sh.rustup.rs -sSf | sh
  ```
* rustup은 rustc(컴파일러)와 cargo(패키지 매니저)를 설치한다.

## Hello, World!

```rust
fn main() {
    println!("Hello, world!");
}
```

* `rustc main.rs` - 러스트 코드를 컴파일한다. 실행가능한 파일이 만들어진다.

## Hello, Cargo!

* cargo는 자바스크립트 생태계의 npm과 같은 패키지 매니저다.
  * `cargo new project` - 새 프로젝트를 생성한다. project 디렉토리 아래에 Cargo.toml 파일이 만들어지며, npm의 package.json과 같다.
  * `cargo build` - 프로젝트를 빌드한다.
  * `cargo run` - 프로젝트를 실행한다.
* 패키지는 crate라고 부르며, [crates.io](https://crates.io/)에 공유된다.

## Common Programming Concepts

### Variables and Mutability

* 러스트에서 변수(variable)는 기본적으로 불변(immutable)하다.
* `let num: i32 = 10` - 불변 변수 선언.
* `let mut num: i32 = 10` - 가변 변수 선언. `mut` 키워드를 붙인다.
* `const NUM: i32 = 10` - 상수 선언.
  * 항상 불변하기 때문에 `mut` 키워드를 사용할 수 없다.
  * 불변 변수와 다르게 상수는 상수 표현식으로만 초기화할 수 있다. 함수의 결과나 런타임 중 계산되는 값으로 초기화할 수 없다.
* Shadowing: 새로 선언한 변수명이 이전에 사용한 변수명과 같다면 새 변수가 이전 변수를 '가린다'.
  ```rust
  fn main() {
      let x = 5;
      let x = x + 1;
      let x = x * 2;

      println!("The value of x is: {}", x); // The value of x is: 12
  }
  ```
  * 쉐도잉을 통해 변수를 재선언함으로써 타입을 바꿀 수 있다. 

### Data Types

* 스칼라 타입 (Scalar types)
  * `i8`, `i16`, `i32`, `i64`, `i128` - 8, 16, 32, 64, 128 비트 정수 타입.
  * `f32`, `f64`, `f128` - 32, 64, 128 비트 부동소수점 타입.
  * `bool` - 불리언 타입.

* 복합 타입 (Compound types)
  * `let tup: (i32, f64, u8) = (500, 3.14, 1)` - 튜플.
    * `let (x, y, z) = tup`처럼 전개할 수 있다.
  * `let arr = [1, 2, 3, 4, 5]` - 배열.
    * `let arr: [i32; 5] = [1, 2, 3, 4, 5]` - 타입과 길이 명시.
    * `let arr = [3; 5]` - `[3, 3, 3, 3, 3]`과 같다.
    * `arr[0]`처럼 접근한다. `arr[index]` 처럼 변수를 인덱스로 넘길 수는 없다.

### Functions

* `fn main() { ... }` 형식으로 함수를 선언한다.
* 함수 바디는 statement와 expression을 담을 수 있다.
* 중괄호를 이용하면 새로운 스코프를 만들 수 있다.
  ```rust
  let x = 5;
  let y = {
      let x = 3;
      x + 1
  };
  ```
* `x + 1` 뒤에 세미콜론이 붙지 않은 이유는 이것이 expression이기 때문이다. 세미콜론을 붙이면 statement가 된다.
* 함수를 값을 반환할 수 있다. 반환 값에 이름을 붙이지 않고 화살표 뒤에 타입만을 명시해도 된다.
  ```rust
  fn five() -> i32 {
      5
  }
  ```
* 파라미터를 받을 수도 있다.
  ```rust
  fn plus_one(x: i32) -> i32 {
      x + 1
  }
  ```

### Control Flow

* `if ... else if ... else`를 지원한다.
* `if`는 expression이기 때문에 `let` statement의 우변에 올 수 있다.
  ```rust
  let number = if condition {
      10
  } else {
      20
  };
  ```
* `loop` - 프로그램을 종료하거나 `break value`를 걸기 전까지 블록을 반복한다.
* `while condition` - 조건이 거짓이 될 때까지 블록을 반복한다.
* `for element in array` - 컬렉션의 각 요소를 순회하며 블록을 반복한다.

## Ownership

* 오너십은 러스트의 메모리 관리 방식이다. C에서는 개발자가 직접 메모리를 할당, 해제한다. JVM에서는 가비지 컬렉터가 메모리를 정리한다.
* 오너십에는 세 가지 규칙이 있다.
  * 각 값은 오너(owner)라고 부르는 변수를 갖는다.
  * 하나의 값은 한 번에 하나의 변수만을 가질 수 있다.
  * 오너가 스코프를 벗어나면 값은 버려진다.

```rust
{ // s is not valid here, it’s not yet declared
    let s = "hello"; // s is valid from this point forward
    // do stuff with s
} // this scope is now over, and s is no longer valid
```

### Copy types and Move types

* 어떤 변수를 다른 변수에 할당할 때 타입에 따라 값이 복사되거나 이동한다.
* Copy type
  ```rust
  let x = 5;
  let y = x; // y is 5, and x is still valid
  ```
  * `x`의 값이 복사되어 `y`에 할당된다. 이것을 '값이 복사되었다'라고 말한다.
  * 정수, 불리언 등 스택 메모리만을 사용하는 대부분의 원시 타입.
* Move type
  ```rust
  let s1 = String::from("hello");
  let s2 = s1; // s2 is "hello", and s1 is nolonger valid
  ```
  * `s1`이 가리키는 메모리 위치를 `s2`가 가리키고, `s1`은 메모리 해제된다. 이것을 '값이 이동했다'라고 말한다.
  * 값을 복사하려면 `clone` 메소드를 사용해야 한다. (`let s2 = s1.clone()`)
  * 문자열, 벡터 등 비원시 타입.

### Ownership and Functions

* 함수 파라미터로 값을 넘기는 것도 변수에 값을 할당하는 것과 비슷하다.
  * move type을 넘기면 값이 이동한다.
  ```rust
  let s = String::from("hello"); // s comes into scope
  do_something(s); // s's value moves into the function...
  // ... and so is no longer valid here
  ```
  * copy type을 넘기면 값이 복사된다.
  ```rust
  let x = 5; // x comes into scope
  do_something(x); // x would move into the function,
  // but i32 is Copy, so it’s okay to still
  // use x afterward
  ```

### References and Borrowing

* 값을 이동시키지 않고 빌려줄 수 있다.
* 변수의 주소를 참조하는 것이다. 단, 값을 변경할 수는 없다. 이것을 shared borrowing이라고 한다.
  ```rust
  fn main() {
      let a = [1, 2, 3];
      let b = &a;
      println!("{:?} {}", a, b[0]); // [1, 2, 3] 1
  }
  ```
  ```rust
  fn main() {
      let s1 = String::from("hello");
      let len = calculate_length(&s1);
      println!("The length of '{}' is {}.", s1, len);
  }

  fn calculate_length(s: &String) -> usize {
      s.len()
  }
  ```
  * 여기서 `s`는 `s1`을 참조한다. 함수의 파라미터로 `s1`의 주소값만 넘기기 때문에 값이 이동하지 않는다.
* 참조한 데이터를 변경하려면 `&mut` 키워드가 붙어야 한다. 이것을 mutable borrowing이라고 한다.
  ```rust
  fn main() {
      let mut a = [1, 2, 3];
      let b = &mut a;
      b[0] = 4;
      println!("{:?}", b); // [4, 2, 3]
  }
  ```
  ```rust
  fn main() {
      let mut s = String::from("hello");
      change(&mut s);
  }

  fn change(some_string: &mut String) {
      some_string.push_str(", world");
  }
  ```
  * 이렇게 하면 `change` 함수 내에서 `some_string`을 변경할 때 caller의 `s`도 변경된다.

## Struct

* C의 구조체와 비슷하다.
  ```rust
  struct User {
      username: String,
      email: String,
      sign_in_count: u64,
      active: bool,
  }
  ```
* `User` struct의 인스턴스를 만들 수 있다.
  ```rust
  let user1 = User {
      email: String::from("someone@example.com"),
      username: String::from("someusername123"),
      active: true,
      sign_in_count: 1,
  };
  ```
* 인스턴스가 가변적이라면 속성에 dot notation으로 접근해 값을 바꿀 수 있다.
* 이름 없는 필드로 이뤄진 tuple struct를 만들 수 있다.
  ```rust
  struct Color(i32, i32, i32);
  struct Point(i32, i32, i32);

  let black = Color(0, 0, 0);
  let origin = Point(0, 0, 0);
  ```

### Derived traits

* struct를 그대로 출력하려고 하면 오류가 발생한다.
  * 일단 포맷 스트링은 `{:?}` 또는 `{:#?}`를 사용해야 한다.
  * 그리고 `std::fmd::Debug`를 implement해야 한다. 러스트는 디버깅 정보를 출력하도록 지원하기 때문이다. 
  * 실제로 구현하지 않고 struct 정의 위에 annotation `#[derive(Debug)]`를 적어주면 된다.
  ```rust
  #[derive(Debug)]
  struct Rectangle {
      width: u32,
      height: u32,
  }

  fn main() {
      let rect1 = Rectangle { width: 30, height: 50 };
      println!("rect1 is {:?}", rect1); //  rect1 is Rectangle { width: 30, height: 50 }
  }
  ```
### Method

* struct는 메소드를 가질 수 있으며, `impl` 키워드를 사용해 정의한다.
  ```rust
  impl Rectangle {
      fn area(&self) -> u32 {
          self.width * self.height
      }
  }
  ```
  * 호출할 때는 `rect1.area()`와 같이 한다.
  * 메소드가 인스턴스 자기 자신을 사용하고 싶으면 `&self`를 파라미터로 사용한다. 호출부에서는 무시된다.
* 한 struct에 대한 `impl` 블록이 여러개일 수 있다. 

### Enums and Pattern Matching

* `enum` 키워드로 enum을 정의할 수 있다.
  ```rust
  enum Color {
      red,
      blue,
  }
  ```
* `::`으로 접근한다: `let red = Color::red`
* 타입을 지정할 수도 있다: `enum Color { red(String), blue(String) }`
 * 할당: `let red = Color::red(String::from("red"))`

### `Option` Enum

* 표준 라이브러리에 `Option` 타입이 있다.
* 러스트에는 Null이 없다. null 값의 문제는 null 값을 not-null 값으로 사용하려 할 때 발생한다. 이는 에러를 일으키기 쉽다
* 하지만 null은 유용한 점이 있는 것이 사실이다. 그래서 러스트는 null 대신 `Option<T>`라는 enum을 사용하기로 했다.
  ```rust
  enum Option<T> {
      Some(T),
      None,
  }
  ```
  * `Some`과 `None`은 `Option::` 없이 직접 사용할 수 있다.
  * `<T>` 문법은 제네릭 타입 파라미터다.

```rust
let some_number = Some(5);
let some_string = Some("a string");
let absent_number: Option<i32> = None;
```

* `Some`은 어떤 값이든 담을 수 있다.
* `None`을 할당할 때는 변수의 `Option<T>` 타입을 명시해야 한다.
  * `None`은 사실상 `null`과 같다.
  * `null`보다 나은 점은 `Option<T>`와 `T`가 다른 타입이라는 점이다. `i8` 타입과 `Option<i8>` 타입을 연산하면 에러가 발생한다.

### The match operator

* 러스트에는 `match`라는 강력한 연산자가 있다. `match`는 패턴에 따라 값을 비교해 일치하는 것을 실행한다.
  ```rust
  enum Coin {
      Penny,
      Nickel,
      Dime,
      Quarter,
  }

  fn value_in_cents(coin: Coin) -> u8 {
      match coin {
          Coin::Penny => 1,
          Coin::Nickel => 5,
          Coin::Dime => 10,
          Coin::Quarter => 25,
      }
  }
  ```
  * `if`로도 할 수 있지만, `if`는 불리언 값을 반환하는 반면 위 코드는 `coin` 타입을 반환한다.
  * `match` arm은 패턴과 실행할 코드 두 개의 부분으로 나뉜다. `Coin::Penny`는 패턴이다. `=>`는 패턴과 코드를 분리하는 연산자다. 뒤이어 나오는 `1`은 코드다.
  * 코드 블록을 쓸 수도 있다.
  ```rust
  Coin::Penny => {
      println!("Lucky penny!");
      1
  },
  ```

### Matching with `Option<T>`

* `None`을 매칭해 필터링할 수 있다.

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}
```

* 만약 `match`가 `Option<T>` 타입을 비교한다면 반드시 `None`도 비교해야 한다.
* `match`에는 `_` placeholder를 사용할 수 있다. switch문의 `default`와 같다.
  ```rust
  let some_value = 0u8;
  match some_value {
      1 => println!("one"),
      2 => println!("two"),
      _ => (),
  }
  ```

### `if let`

* `if`와 `let`을 합친 문법이다.
* `match`를 이렇게 쓰는걸:

```rust
let some_u8_value = Some(0u8);
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}
```

* 이렇게 줄일 수 있다:

```rust
if let Some(3) = some_u8_value {
    println!("three");
}
```

## Module

* 모듈은 `mod` 키워드로 정의한다.
  ```rust
  fn serve_order() {}

  mod back_of_house {
      fn fix_incorrect_order() {
          cook_order();
          super::serve_order();
      }

      pub fn cook_order() {}
  }
  ```
  * 외부에서 `hello`를 호출하려면 모듈을 특정해야 하므로, 네임스페이스 문법인 `::`를 이용해야 한다. `greetings::hello()`
  * `pub`은 public 접근제한자를 뜻한다. 기본적으로 private이다.
  * `mod`는 중첩할 수 있다. 상위 컨텍스트(부모 모듈 등)의 함수에 접근할 때는 `super::`를 이용한다.

### `use`

* `use` 키워드를 이용하면 로컬에 있는 모듈을 스코프로 가져올 수 있다.

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

* `use`를 사용하는 건 심볼릭 링크를 만드는 것과 비슷하다. 위의 경우 `hosting`이 해당 스코프에서 유효한 이름이 된다. `hosting` 모듈은 crate root에 정의되어 있다.
* 표준 라이브러리에 있는 모듈을 가져올 수 있다. `use std::io`
* `as` 키워드로 이름을 부여할 수도 있다. `use std::io::Result as IoResult`
* 스코프로 모듈을 가져오면 private으로 가져오게 된다. 이것을 public으로 re-exporting할 수 있다. `pub use crate::front_of_house::hosting`
* 외부 모듈을 설치해서 가져올 수 있다.
  * Cargo.toml 파일에 설치할 모듈을 추가한다.
    ```toml
    [dependencies]
    rand = "0.5.5"
    ```
  * `rand` 모듈을 가져올 때도 `use`를 사용한다. `use rand::Rng`
* `use` 경로를 중첩할 수 있다. `use std::{cmp::Ordering, io}` 
  * `io` 자기 자신과 `io::Write`를 스코프로 가져올 때 중첩을 이용한다. `use std::io::{self, Write}`
* 모든 public 요소를 가져올 때는 glob 연산자 `*`을 사용한다. `use std::collections::*`

### Separating modules

* 모듈을 꼭 한 파일에 둘 필요는 없다.
* `src/lib.rs` 파일이 있다.
```rust
mod front_of_house;
pub use crate::front_of_house::hosting;
pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```
* 그리고 `src/front_of_house.rs` 파일이 있다.
```rust
pub mod hosting {
    pub fn add_to_waitlist() {}
}
```

## Common collections

### Vector (`Vec<T>`)

* `let v: Vec<i32> = Vec::new()`
* `let v = vec![1, 2, 3]` - `vec!` 매크로를 이용해 쉽게 벡터를 만들 수 있다.
* `v.push(4)` - 일반 배열과 다르게 선언이후 업데이트할 수 있다.
* `v.get(2)` - index 2의 요소에 접근한다.
  * `let third: &i32 = &v[2]` - 이렇게 접근할 수도 있다.
* `for`문으로 벡터를 이터레이트할 수 있다.
  ```rust
  let mut v = vec![100, 200, 300];
  for item in &mut v {
      *item += 50;
  }
  ```
  * dereference 연산자 `*`은 이후에 설명한다.

### String (`String`)

* `let mut s = String::new()` - 문자열 생성
* `let s = "Initial contents".to_string()` - String 타입에는 Display trait가 포함되어 있는데, `to_string` 메소드를 이용해 이를 구현하도록 할 수 있다.
* `s.push_str(", world!")` - 문자열을 이어붙일 수 있다.
* `s.push('w')` - 문자 하나를 이어붙일 때는 push로 할 수 있다.
* `let s = s1 + "-" + &s2 + "-" + &s3`
* `let s = &hello_world[0..4]` - 0번 인덱스부터 4번 인덱스까지의 문자열을 담는다.

### Hash map (`HashMap<K, V>`)

* `use std::collections::HashMap`으로 import해야 한다.
* `let mut scores = HashMap::new()`
* `scores.insert(String::from("Blue"), 10)` - kvp를 추가/업데이트한다.
* `scores.get(&team_name)` - key로 value를 가져온다.
* 이터레이트할 수도 있다.
  ```rust
  for (key, value) in &scores {
      println!("{}: {}", key, value);
  }
  ```

## References

* [Rust Team, "The Rust Programming Language", doc.rust-lang.org.](https://doc.rust-lang.org/book/)
* [Dumindu Madunuwan, "Learning Rust", learning-rust.github.io.](https://learning-rust.github.io/docs/)