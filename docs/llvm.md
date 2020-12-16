# LLVM

* LLVM은 컴파일러의 기반 구조로 사용되고 있다.
* 전통적인 컴파일러는 프론트엔드, 옵티마이저, 백엔드 three-phase 일체형 구조로 설계된다.

  ![](https://aosabook.org/images/llvm/SimpleCompiler.png)

* 프론트엔드: 소스 코드 파싱, 에러 체크, AST 생성
* 옵티마이저: 불필요한 연산 제거 등 성능 개선을 위한 각종 변환
* 백엔드: target instruction set에 코드 매핑, 레지스터 할당, 명령 스케줄링
* 전통적인 설계의 문제는 하나의 컴파일러가 여러 아키텍처 또는 언어를 지원하지 못한다는 것이다.
* LLVM은 전통적인 설계의 문제를 해결한다.

  ![](https://aosabook.org/images/llvm/RetargetableCompiler.png)

* 위와 같이 retargetable하게 설계하면 기존 옵티마이저와 백엔드를 그대로 둔 채로 새로운 프론트엔드만을 추가해 새 언어를 지원할 수 있다. 

## References

* [Chris Lattner, "LLVM," in _The Architecture of Open Source Applications_, 2011.](https://aosabook.org/en/llvm.html)
