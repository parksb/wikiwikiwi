# Ownership

## 메소드의 `self`, `&self`, `&mut self`

* `self` - 함수가 값을 소모하는 경우. 오너십을 받는다. (move)
* `&self` - 함수가 값을 읽기만 하는 경우. 참조만 받는다. (borrow)
* `&mut self` - 함수가 값을 소모하지 않고 변경하는 경우. 가변참조를 받는다. (borrow)