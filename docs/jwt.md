# JWT

* [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519)
* 토큰 기반 인증 방식. 서버의 무상태성, 확장성, 보안성을 확보할 수 있다.

## 구조

* Header, Payload, Signature 세 부분으로 구성됨.
* 세 부분은 `.`으로 구분한다. (`xxxxx.yyyyy.zzzzz`)

### Header

* 토큰의 타입, 서명 알고리즘 정보를 포함하는 JSON 포맷:
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```
* Base64Url로 인코딩되어 JWT의 첫 번째 부분으로 들어간다.

### Payload

* 페이로드는 클레임들을 가진 JSON 포맷:
  ```json
  {
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true
  }
  ```
* 클레임은 엔티티(유저)와 추가적인 데이터에 대한 상태.
* 세 가지 종류의 클레임이 있다:
  * registered claims: 필수는 아니지만 권장된다:
    * iss(issuer)
    * exp(expiration time)
    * sub(subject)
    * aud(audience)
    * others
  * public claims: URI 형식으로 충돌이 방지된 이름을 가져야 한다.
  * private claims: 커스텀 클레임. 양측 사이에 합의된 이름을 사용한다.
* Base64Url로 인코딩되어 JWT의 두 번째 부분으로 들어간다.

### Signature

* 인코딩된 헤더와 페이로드, 시크릿을 헤더에 명시된 서명 알고리즘으로 인코딩한 문자열:
  ```
  HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
  ```
* Base64Url로 인코딩되어 JWT의 세 번째 부분으로 들어간다.

### 합치기

* 헤더, 페이로드, 시그니처를 `.`을 구분자로 모두 합치면 하나의 JWT가 된다.

![](https://cdn.auth0.com/blog/legacy-app-auth/legacy-app-auth-5.png)

## 동작 방식

* 기존 서버 기반 인증의 경우 서버가 세션 정보를 들고 있어야 했다:
  ```mermaid
  sequenceDiagram
    participant S as Server
    participant C as Client
    S->>C: 웹 페이지
    C->>S: 로그인 요청
    Note left of S: 세션 생성
    S->>C: 로그인 응답
    C->>S: 요청
    Note left of S: 세션 저장소 조회
    S->>C: 응답
  ```
* 토큰 기반으로 인증하면 서버가 토큰의 유효성만 검증한다:
  * 클라이언트가 서버의 보호된 자원에 접근하려면 요청에 JWT를 담아 보낸다:
    ```
    Authorization: Bearer <token>
    ```
  * 서버는 요청의 Authorization 헤더에 담긴 JWT의 유효성을 검증하고 응답한다.
  ```mermaid
  sequenceDiagram
    participant S as Server
    participant C as Client
    S->>C: 웹 페이지
    C->>S: 로그인 요청
    Note left of S: 토큰 생성
    S->>C: 로그인 응답
    Note right of C: 토큰 저장
    Note right of C: 토큰 읽기
    C->>S: 토큰과 함께 요청
    Note left of S: 토큰 검증
    S->>C: 응답
  ```

## References

* https://jwt.io/introduction
* https://datatracker.ietf.org/doc/html/rfc7519
* https://velopert.com/2350
