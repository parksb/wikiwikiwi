# Mobile Plus: Multi-device Mobile Platform for Cross-device Functionality Sharing

## 1st Pass

> 1. 제목, 초록, 서론을 주의깊게 읽는다.
> 1. 각 대문단과 소문단의 머릿말을 읽는다. 다른 내용은 무시한다.
> 1. 수학적 내용이 있다면, 내용을 훑으며 이론적 기반을 살펴본다.
> 1. 결론을 읽는다.
> 1. 참고문헌을 훑어보고, 이미 읽은 문헌이 있는지 체크한다.

- 멀티 모바일 컴퓨팅 솔루션 M+ 제안.
- 기존 앱을 수정하지 않고 분산 앱을 만들 수 있게 해주는 플랫폼.
- RPC를 통해 디바이스 상호작용.
- 안드로이드는 같은 기기 내에서 프로세스가 동작한다고 가정하기 때문에 어려움이 있음.
- virtual activity, remote app registration.
- 큰 성능 저하없이 실기기에서 테스트함.

## 2nd Pass

> 1. 주의 깊게 논문을 읽는다. 단, 증명과 같은 상세한 내용은 무시한다.
> 1. 논문을 읽으면서 키 포인트를 메모하거나, 여백에 코멘트를 적어두면 도움이 된다.
> 1. 논문에 있는 도표나 다이어그램, 삽화를 유심히 본다. 특히 그래프는 자세히 확인한다.
> 1. 이해하지 못한 용어나 저자에게 물어보고 싶은 질문을 메모한다.
> 1. 나중에 읽기 위해 관련된 참고문헌 중 읽지 않은 것들을 표시해 둔다.

### Key points

- 안드로이드가 within-device RPC를 지원, M+는 이를 확장해 cross-device binder connection을 구현함.
- cross-device RPC를 위해 기존 IPC 매커니즘을 확장함:
  - 애플리케이션 수정없이 right place의 binder parcel을 인터셉트해야 한다.
  - 오버헤드를 줄이기 위해 최소한의 parcel만을 인터셉트해야 한다.
  - 애플리케이션이 다른 기기의 목적지에 도달할 수 있어야 한다.
  - Binder Parcel Interception:
    - 만약 interface layer에서 인터셉트한다면? 함수 인터페이스를 수정해야 하므로 우리 목표와 맞지 않다.
    - interface layer 아래로는 안드로이드 플랫폼임. 애플리케이션을 수정하지 않으려면 이쪽 레이어에서 인터셉트해야 한다.
    - M+는 인터셉트 지점을 BpBinder로 지정하고, native IPC layer에서 인터셉트를 한다.
    - 모든 애플리케이션이 Bpbinder 오브젝트를 거치기 때문에 이곳이 적절하다.
    - 어디서 인터셉트할지는 정했고, 그럼 어떤 parcel을 인터셉트할 것인가?
      - 모든 parcel을 인터셉트하는 대신, M+는 최소한의 parcel, seed parcel만을 인터셉트한다.
      - ActivityManager와 ServiceManager의 특정 메서드를 호출하기 위한 parcel을 인터셉트해야 한다.
      - 이 둘이 binderService와 startActivity를 제공하기 때문. 이렇게 함으로써 인터셉트 크기를 최소화할 수 있다.
  - Cross-device Binder IPC:
    - 네트워크 커넥션을 통해 server M+(S-M+)와 client M+(C-M+)가 통신한다.
    - 먼저 seed parcel을 인터셉트하고 C-M+에 전달된다.
    - 그러면 유저가 리모트 디바이스의 어떤 기능을 사용할지 선택하고, C-M+는 S-M+에 parcel을 전달한다.
    - parcel은 S-M+의 activity/service manager에게 전달되고, 바인더 드라이버는 S-M+와 서버 프로세스 사이에 로컬 바인더 채널을 만든다.
    - proxy object가 C-M+로 다시 보내지면, C-M+는 새 stub을 만들고 클라이언트 프로세스와의 로컬 바인터 채널을 만든다.
    - 결과적으로 C-M+와 S-M+는 두 개의 로컬 바인더를 TCP 네트워크 커넥션으로 브릿징함으로써 매핑된다.
- 확장한 IPC 매커니즘으로 cross-device RPC를 지원한다:
  - 앞서 클라이언트가 리모트 서버의 RPC를 호출할 수 있도록 cross-device 바인더 커넥션을 만들었다.
  - 하지만 문제가 있음. 안드로이드는 RPC 콜에 레퍼런스를 인자로 넘기곤 한다.
  - 하나의 기기에서는 shared memory와 UDS를 사용할 수 있으므로 참조를 주고 받아도 문제가 없음.
  - M+는 RPC에 쓰이는 모든 레퍼런스 인자를 식별할 수 있어야 한다:
    - binder proxy, URI, UDS, shared memory를 사용.
- 클라이언트와 서버 프로세스는 app metadata라고 하는 상대 애플리케이션에 대한 정보를 필요로 한다.
  - 안드로이드에서는 manifest 파일로 메타데이터를 기술한다.
  - 다른 디바이스의 서버 프로세스가 패키지 매니저에게 클라이언트 앱의 메타데이터를 요청할 때 문제가 생김.
  - 요청을 인터셉트하는 방식은 비효율적이기 때문에 M+는 (remote) app registration을 한다.
  - 앱이 설치될 때 패키지 매니저가 앱의 메타데이터를 다른 기기에 보내준다.
  - 클라이언트와 서버의 앱은 서로 다른 시간에 원격으로 등록된다.
- Cross-device execution management:
  - 보통 클라이언트 앱은 서버 기능을 실행할 때 서버 액티비티를 런치한다.
  - 가장 중요한 컨텍스트 정보 중 하나는 caller-callee relationship, 누가 요청한건지 알아야 하니까.
  - 이를 위해 안드로이드의 액티비티 매니저는 스택을 쓴다.
  - 그런데 다른 기기의 스택과 연동할 때 문제가 생김. 두 스택은 서로 독립적이고, caller-callee relationship을 알지 못함.
  - 또한 client에서 띄운 server 액티비티가 활성화 되어 있을 때도 client의 top activity가 여전히 active하다고 간주됨.
  - M+는 액티비티 매니저를 수정하는 대신, virtual activity를 사용한다.
  - 이렇게 하면 client의 스택 top에 viertual activity가 놓이므로, 클라이언트의 액티비티를 paused 상태로 유지할 수 있음.
  - 반대로 만약 클라이언트와 서버의 top을 둘 다 active하게 쓰고 싶다면 M+는 '진짜로' parallel하게 두 액티비티를 실행할 수 있다.
- 보안 문제에 대해 이야기해보자:
  - 안드로이드는 퍼미션 기반 보안 매커니즘을 사용함.
  - 따라서 클라이언트가 서버 리소스에 접근하려면 적절한 권한이 필요하다.
  - app registration에서 필요한 권한을 얻을 수 있음.
  - 네트워크 보안을 위해 M+는 SSL을 쓴다.
- 그리고 각종 evaluations...

### Questions

- UDS? ASHMEM?
- proxy-stub pattern에 대해 다시 찾아봐야 할듯.
- 서로 다른 기기에서 어떻게 shared memory를 사용할 수 있는지?
- cross-device execution management에서 concurrent하게 쓰는 경우에는 virtual activity를 사용하지 않는 것인지?

### References

- Multi-device mobile platforms: Flux, Rio
- Android RPC: AndroidRMI

## 3rd Pass

### Strength

### Weakness
