# Abstract Syntax Tree

* 줄여서 AST, 한국어로 추상구문트리라고 한다.
* 소스 코드의 구조를 표현하는 자료구조.
* 아래 코드를 AST로 변환하면:
  ```
  while b ≠ 0
    if a > b
      a := a − b
    else
      b := b − a
  return a 
  ```
* 이렇게 된다:
  ![ast](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Abstract_syntax_tree_for_Euclidean_algorithm.svg/800px-Abstract_syntax_tree_for_Euclidean_algorithm.svg.png)

## References

* ["Abstract syntax tree", Wikipedia](https://en.wikipedia.org/wiki/Abstract_syntax_tree)
* [AST Explorer](https://www.etoday.co.kr/news/view/1728667)
