# Smart Pointers

* 스마트 포인터는 포인터처럼 동작하지만 추가적인 메타데이터와 기능을 가진 데이터 구조다.
* `Box<T>`: 값을 힙에 할당하기 위한 타입
* `Rc<T>`: 여러개의 오너십을 가능하게 하는 참조 카운팅 타입 
* `Ref<T>`, `RefMut<T>`: 빌림 규칙을 컴파일 타임 대신 런타임에 강제하는 `RefCell<T>` 타입을 통해 접근되는 타입.

## Using Box<T> to Point to Data on the Heap

* `Box<T>`는 스택 대신 힙에 데이터를 저장하기 위해 사용하는 스마트 포인터다.
* 아래와 같은 상황에서 자주 사용한다:
  * 컴파일 타임에 크기를 알 수 없는 타입을 갖고 있고, 정확한 사이즈를 알아야 하는 컨텍스트에서 해당 타입의 값을 이용하고 싶을 때.
  * 큰 데이터의 복사를 방지하고 오너십을 옭기고 싶을 때.
  * 어떤 값의 구체적인 타입을 알기보다는 특정 트레잇을 구현한 타입이라는 점만 신경쓰고 싶을 때.