# REST: Representational State Transfer

* [x] ABSTRACT OF THE DISSERTATION
* [x] INTRODUCTION
* [ ] CHAPTER 1. Software Architecture
* [ ] CHAPTER 2. Network-based Application Architectures
* [ ] CHAPTER 3. Network-based Architectural Styles
* [ ] CHAPTER 4. Designing the Web Architecture: Problems and Insights
* [ ] CHAPTER 5. Representational State Transfer (REST)
* [ ] CHAPTER 6. Experience and Evaluation
* [ ] CONCLUSIONS

## ABSTRACT OF THE DISSERTATION

* 월드 와이드 웹은 큰 성공을 이뤘고, 이젠 모던 웹 아키텍처를 가이드하기 위한 모델이 필요하다.
* 이 연구는 네트워크 기반 어플리케이션의 설계를 이해하고 평가함으로써 아키텍처의 기능적, 성능적, 사회적 요구를 분석하기 위해 시작됐다.
* 이 논문에서는 Representational State Transfer (REST) 아키텍처 스타일을 소개하며, REST가 모던 웹 아키텍처의 개발과 설계를 어떻게 가이드할 수 있는지 설명할 것이다.
* REST는 컴포넌트 상호작용의 확장성, 인터페이스의 범용성, 컴포넌트의 독립된 배포, 상호작용 레이턴시를 줄이는 중계 컴포넌트, 보안, 레거시 시스템 캡슐화를 강조한다.
* 마지막으로 Hypertext Transfer Protocol(HTTP)과 Uniform Resource Identifier(URI)에 REST를 적용하며 배운 교훈에 대해 설명하겠다.

## INTRODUCTION

* 아키텍처는 90년대 소프트웨어 공학 연구의 중심이 되었다. 좋은 아키텍처는 진공 상태에서 만들어지지 않는다. 아키텍처 레벨의 모든 설계는 기능적, 사회적 요구 맥락에 맞춰 결정되어야 한다.
* 지난 수백년간의 프로젝트 실패 경험으로부터 "형태는 기능을 따른다"라는 원칙이 만들어졌지만, 소프트웨어 실무자들은 종종 이 원칙을 무시한다.
* 처음 세 챕터에서는 이키텍처를 이해하기 위한 프레임워크를 정의하고, 챕터 4에서는 웹 설계의 요구사항에 대해 논의한다. 챕터 5에서는 하이퍼 미디어 시스템을 위한 REST 아키텍처 스타일에 대해 자세히 소개할 것이다.

## CHAPTER 1. Software Architecture

* 연구 분야로서의 소프트웨어 아키텍처에 대한 관심에도 불구하고, 연구자들 사이에는 아키텍처 정의에 어떤 것을 포함해야 하는지에 대한 의견 일치가 거의 없다.
* 이 챕터에서는 소프트웨어 아키텍처에 대한 일관된 용어를 정의한다.

### 1.1. Run-time Abstraction

* 소프트웨어 아키텍처는 시스템이 운영되는 일부 단계의 런타임 요소들을 추상화한 것이다. 시스템은 각각의 아키텍처에 따라 여러 부분에서 여러 계층으로 추상화될 수 있다.
* 소프트웨어 아키텍처의 심장은 추상화 원칙이다. 복잡한 시스템은 더 많은 계층으로 추상화될 것이다.
* 시스템은 구동, 초기화, 처리, 재초기화, 정지와 같은 여러 운영 단계를 거치며, 각 운영 단계는 자신의 아키텍처를 가진다.

### 1.2. Elements

* 소프트웨어 아키텍처는 아키텍처 요소(컴포넌트, 커넥터, 데이터)의 구성과 관계의 제약으로 정의된다.
  * 컴포넌트(Component): 명령과 인터페이스를 통한 데이터 변환을 제공하는 내부 상태의 추상 단위.
  * 커넥터(Connector): 컴포넌트 간의 통신, 조정 또는 협력을 매개하는 추상 매커니즘.
  * 데이터(Datum): 컴포넌트가 커넥터를 통해 수신하는 정보.

### 1.3. Configurations

* 구성은 시스템 런타임 동안 이뤄지는 아키텍처 요소 사이의 관계 구조다.

### 1.4. Properties

* 소프트웨어 아키텍처의 속성 집합은 컴포넌트, 커넥터, 데이터에서 파생되는 모든 특성을 포함한다.
* 속성은 아키텍처의 제약 집합에 의해 유도된다.

### 1.5. Styles

* 아키텍처 스타일은 요소들의 역할과 기능을 제한하는 제약 집합으로 이뤄진다. 
* 서로 다른 시스템의 아키텍처를 직접 비교하는 것은 어려운 일인데, 스타일은 아키텍처의 일반적인 성격을 정의하고 분류하는 매커니즘이다.

## References

* [김동범, "REST API 제대로 알고 사용하기", TOAST Meetup, 2016.](https://meetup.toast.com/posts/92)
* [이응준, "그런 REST API로 괜찮은가," in _10th DEVIEW_, Nov. 2017.](https://tv.naver.com/v/2292653)
* [R. T. Fielding, "Architectural Styles and the Design of Network-based Software Architectures", Ph.D. dissertation, Dept. Inf. and Comput. Sci., Univ. California, Irvine, USA, 2000.](https://www.ics.uci.edu/~fielding/pubs/dissertation/fielding_dissertation.pdf)

