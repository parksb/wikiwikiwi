# 배열

```
+--------+--------+--------+     +--------+
| A[0]   | A[1]   | A[3]   |     | A[9]   |
| 4 Byte | 4 Byte | 4 Byte | ... | 4 Byte |
| 1000   | 1004   | 1008   |     | 1014   |
+--------+--------+--------+     +--------+
|        |        |              |
A        A + 1    A + 2          A + 8
```

* 배열은 연속적인 요소를 표현하기 위한 순서있는 자료구조.
* 메모리 위에 각 요소가 연속적으로 할당되므로 지역성 원리의 이점을 얻을 수 있다.
* 1차원으로 펼쳐놓은 메모리로써 임의 접근이 가능하므로 읽기 시간복잡도는 $O(1)$.
* 고정 크기 공간 안에 고정 타입을 담을 수 있다.

## diff Vector

* 벡터는 공간 크기가 고정되어있지 않은 동적인 배열.
* 미래에 추가될 요소를 위한 공간을 미리 할당해둠.
* 만약 할당된 공간을 초과해 요소가 추가되면 재할당된다.

## diff List

* 리스트도 연속적인 요소를 표현하기 위한 순서있는 자료구조.
* 배열과 달리 메모리에서의 연속적인 할당을 보장하지 않는다.
* 일반적으로 링크드 리스트를 의미함:
  * 다음 요소를 가리키는 포인터를 위한 추가 공간이 필요하다.
  * 임의 접근이 불가능.
* 삽입, 삭제, 병합이 효율적이다.

## 참고자료

* [The Rust Programming Language, "Data Types".](https://doc.rust-lang.org/book/ch03-02-data-types.html?highlight=array#the-array-type)
* [Jonathan M. Davis, "vector vs. list in STL", Stack Overflow, 2010.](https://stackoverflow.com/a/2209564/8463154)
* [trent, "Why address of pointer doesn't change when modifying the string variable in Rust?", Stack Overflow, 2019.](https://stackoverflow.com/a/59007880/8463154)
