# Module

## 다른 파일에서 모듈 가져오기

* [app.rs](http://app.rs/) 파일에서 [lib.rs](http://lib.rs/) 파일의 struct를 가져와서 쓰고자 한다.
* 그냥 `use crate::lib`을 하면 root에 lib.rs가 없다는 에러가 발생한다.

**src/main.rs**

```
mod app;
mod lib;
fn main() { ... }
```

**src/lib.rs**

```
pub struct Model { ... }
```

**src/app.rs**

```
use crate::lib;
pub fn build() { ... }
```

* main.rs에 `mod lib`을 선언해야 app.rs에서 lib.rs의 내용을 사용할 수 있다.

## 크레이트와 모듈의 차이

* 크레이트는 컴파일 단위로, 컴파일러가 다룰 수 있는 가장 작은 규모의 코드를 말한다.
* 모듈은 크레이트 안에 있는 코드 구조의 단위를 말한다.
* `mod` - 모듈이 존재함을 선언.
* `use` - 다른 곳에 선언된 모듈을 참조해 그 내용을 현재 모듈의 스코프에 가져온다.