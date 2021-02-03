# Spring

* 스프링은 IoC와 AOP를 지원하는 경량 컨테이너 프레임워크.
* 개인적으로 스프링을 안 좋아하지만 스프링의 주요 개념들이 다른 프레임워크에 많은 영향을 준 것 같다.
* 지금 업무에서도 쓰고 있다. 사용법은 알겠는데, 내부 구조를 잘 모르겠다. 

## Spring vs Spring Boot

* 스프링은 엔터프라이즈 애플리케이션을 쉽게 만들기 위한 프레임워크.
* 스프링 부트는 스프링의 각종 설정을 자동화한 프레임워크:
  * 임베디드 톰캣 - 톰캣이 내장되어 있어 별도의 웹 서버 구축이 불필요하다.
  * 디펜던시 자동화 - 디펜던시의 버전 충돌을 신경쓸 필요가 없다.
  * jar - war 파일로 빌드되는 스프링과 달리 jar 파일을 사용하기 때문에 배포가 쉽다.

## IoC(Invertion of Control) Container

* 컨테이너는 설정에 따라 오브젝트를 관리하고, 애플리케이션을 제공한다.
* IoC는 객체가 자신의 디펜던시를 정의하는 과정:
  * 이때 디펜던시를 객체가 아닌 컨테이너가 담당하며 역전이 일어난다.
  * 마틴 파울러는 IoC를 DI라고 불러야 한다고 주장했다.
* `org.springframework.context.ApplicationContext` 인터페이스가 스프링 IoC 컨테이너를 표현한다.
* 컨테이너는 XML, 자바 어노테이션, 또는 자바 코드로 표현된 설정 메타데이터를 읽는다:
  * 전통적으로는 XML을 사용한다 - `<beans ...> ... </beans>`
  * 지금은 대부분 자바 기반을 사용한다 - `@Configuration`, `@Bean`, `@Import`, `@DependsOn`
* high-level에서 보면 컨테이너는 설정 메타데이터와 POJO를 읽고 애플리케이션을 제공하는 역할을 한다:
  ![](https://docs.spring.io/spring-framework/docs/5.3.3/reference/html/images/container-magic.png)

## Bean

* 빈은 스프링의 개념이 아니라 자바의 개념임.
* 빈은 컨테이너에 제공한 설정 메타데이터와 함께 생성된다.
* IoC 컨테이너는 빈을 관리한다.
* XML로 빈을 등록할 수 있다:
  ```xml
  <beans>
      <bean id="myService" class="com.acme.services.MyServiceImpl"/>
  </beans>
  ```
* 당연히 어노테이션으로도 할 수도 있다:
  ```kotlin
  @Configuration
  class AppConfig {

      @Bean
      fun myService(): MyService {
          return MyServiceImpl()
      }
  }
  ```
  * 스프링은 `@Component`, `@Service`, `@Controller` 등 스테레오타입 어노테이션도 제공한다.
  * 어노테이션을 붙은 클래스는 빈 스캐너를 통해 빈으로 등록된다. 

## Dependency Injection

* 애플리케이션이 커질수록 객체간의 의존성이 복잡해진다:
  * 의존성이 늘어나면 유닛 테스트도 어렵고, 코드의 변경도 어려워진다.
* 스프링 애플리케이션은 스프링 프레임워크에 의해 객체 의존성이 주입된다:
  * 프레임워크에 의해 의존성이 주입되므로 객체간의 결합이 줄어든다.

### Without DI

```java
// An example without dependency injection
public class Client {
    // Internal reference to the service used by this client
    private ExampleService service;
  
    // Constructor
    Client() {
        // Specify a specific implementation in the constructor instead of using dependency injection
        service = new ExampleService();
    }
  
    // Method within this client that uses the services
    public String greet() {
        return "Hello " + service.getName();
    }
}
```
  
### With DI

#### Constructor-based Injection

```java
// Constructor
Client(Service service) {
    // Save the reference to the passed-in service inside this client
    this.service = service;
}
```

```kotlin
class Client(private val service: Service) {
    // business logic that actually uses the injected Service is omitted...
}
```

* 스프링 4.3 버전부터 생성자가 하나일때는 `@Autowired` 어노테이션을 붙이지 않아도 된다:
  * 코틀린은 한 클래스에 하나의 생성자만 정의할 수 있으므로 항상 붙이지 않는다고 생각해도 된다.
    
#### Setter-based Injection    
    
```java
// Setter method
@Autowired
public void setService(Service service) {
    // Save the reference to the passed-in service inside this client.
    this.service = service;
}
```

```kotlin
class Client {
    // a late-initialized property so that the Spring container can inject a Service
    @Autowired
    lateinit var service: Service

    // business logic that actually uses the injected Service is omitted...
}
```

* `@Autowired` 어노테이션을 이용해 메타데이터를 설정한다:
  * 이때는 어노테이션을 생략할 수 없다.
  * 어노테이션이 아니라 XML로 정의할 수도 있다.
* 권장하는 방식은 아니다.

## AOP (Aspect-Oriented Programming)

* 관점 지향 프로그래밍.
* 핵심 관심사와 부가 관심사를 분리해 모듈화하는 방법론.
* 스프링의 기반 철학은 AOP. 많은 low-level API를 제공한다.

## References

* [Spring Framework Documentation Version 5.3.3](https://docs.spring.io/spring-framework/docs/5.3.3/reference/html/)
* [Martin Fowler, "Inversion of Control Containers and the Dependency Injection pattern", 2004.](https://martinfowler.com/articles/injection.html)














































