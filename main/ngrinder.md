# nGrinder

> 사내 문서로 작성한 글이다.

nGrinder는 네이버가 Grinder를 기반으로 개발한 부하 테스트 도구입니다. 스크립트를 작성해 타겟 서버에 부하를 발생시키고, 이를 모니터링할 수 있습니다.

## 아키텍처

![image](https://user-images.githubusercontent.com/6410412/63666804-51db4c80-c80c-11e9-8092-697ae965460b.png)

nGrinder는 컨트롤러와 에이전트로 구성됩니다. 컨트롤러는 테스트 프로세스를 구성하고 통계를 내며 웹 ui를 제공합니다. 에이전트는 실제 타겟에 부하를 발생시키는 역할을 합니다. 에이전트를 실행하면 컨트롤러와 연결을 시도하며, 컨트롤러는 에이전트 컨트롤러 서버를 통해 에이전트 풀을 관리합니다.

하나의 nGrinder 컨트롤러에서 테스트를 실행하면 여러 에이전트에게 테스트 스크립트를 배포해 같은 테스트를 실행하게 됩니다.

컨트롤러는 아래와 같은 포트를 사용합니다:

- 80: 컨트롤러의 기본 웹 UI 포트
- 9010-9019: 에이전트가 컨트롤러 클러스터에 접속하는 포트
- 12000-12029: 컨트롤러가 부하 테스트를 할당하는 포트

## 설치

설치는 도커를 쓰는 게 정신 건강에 이로웠습니다. (수동 설치는 war 파일을 다운받아 자바를 이용해 실행하면 됩니다: [https://github.com/naver/ngrinder/releases](https://github.com/naver/ngrinder/releases))

도커를 사용해 컨트롤러를 설치합니다: [https://hub.docker.com/r/ngrinder/controller/](https://hub.docker.com/r/ngrinder/controller/)

```bash
$ docker pull ngrinder/controller:3.4
$ docker run -d -v ~/ngrinder-controller:/opt/ngrinder-controller -p 80:80 -p 16001:16001 -p 12000-12009:12000-12009 ngrinder/controller:3.4
```

이어서 에이전트를 설치하기 전에 컨트롤러의 ip를 확인합니다.

```bash
$ docker exec {id} ip addr show eth0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
```

에이전트를 설치합니다. `{controller_ip}:{controller_web_port}`는 직접 입력해야 합니다. 이 경우 `controller_ip`는 위에서 확인한 172.17.0.2이고, 기본 포트는 16001이니까 `172.17.0.2:16001`을 입력합니다.

```bash
$ docker pull ngrinder/agent:3.4
$ docker run -v ~/ngrinder-agent:/opt/ngrinder-agent -d ngrinder/agent:3.4 {controller_ip}:{controller_web_port}
```

## 설정

`~/ngrinder-agent`에 `__agent.conf`파일을 작성하면 기본 설정을 덮어 씌울 수 있습니다:

```conf
common.start_mode=agent
agent.controller_host=172.17.0.2
agent.controller_port=16001
#agent.region=
#agent.host_id=
#agent.server_mode=true
    
# provide more agent java execution option if necessary.
#agent.java_opt=
# set following false if you want to use more than 1G Xmx memory per a agent process.
#agent.limit_xmx=true
# please uncomment the following option if you want to send all logs to the controller.
#agent.all_logs=true
# some jvm is not compatible with DNSJava. If so, set this false.
#agent.enable_local_dns=false
```

에이전트를 띄우면 `~/ngrinder-agent` 하위에 `.ngrinder-agent` 디렉토리가 만들어집니다. 여기에 있는 `agent.conf` 파일을 수정하지 않고 에이전트를 띄우면 `__agent.conf`설정을 바꿔도 반영되지 않는 경우가 있으니 설정을 변경할 경우 주의해야 합니다.[^aidanbae]

## 실행

컨트롤러를 띄우면 `127.0.0.1:80`에서 웹 ui를 확인할 수 있습니다. 기본으로 설정된 아이디와 비밀번호는 `admin`입니다. 로그인 후 첫 화면에서 URL을 입력하면 해당 서버를 향한 부하 테스트 설정 페이지가 나타납니다.

![image](https://user-images.githubusercontent.com/6410412/63666837-6cadc100-c80c-11e9-9e80-4a7bf5485081.png)

vuser(viertual user)는 동시 접속자 수를 뜻하며, 각각의 vuser는 서버로부터 응답을 받는 즉시 다시 요청을 보냅니다.  `vuser = agent * processes * threads`입니다. vuser 입력 필드 오른쪽에 있는 '+' 버튼을 누르면 프로세스와 쓰레드로 vuser 수를 조절할 수도 있습니다. 에이전트 하나 당 vuser의 최대치는 3000이기 때문에 이를 넘기고 싶으면 에이전트를 더 띄워야 합니다.

vuser ramp-up도 가능합니다. 위 설정에서는 쓰레드를 기준으로 1000ms마다 vuser를 2씩 늘립니다. (프로세스는 비싼 리소스이기 때문에 한계가 있습니다. nGrinder 3.3부터 쓰레드 ramp-up을 지원하기 시작했다고 합니다.) 테스트 시간을 1분으로 설정했기 때문에 vuser 최대치에 도달하는 시간이 1분을 넘지 않도록 했습니다.

이렇게 하면 서버가 어느 시점부터 에러를 일으키는지 알 수 있습니다.

## 결과

테스트가 끝나면 통계를 확인할 수 있습니다.

![image](https://user-images.githubusercontent.com/6410412/63666855-7d5e3700-c80c-11e9-910e-77084c4cbc07.png)

TPS(Transactions Per Second)가 일정하게 나왔습니다. vuesr가 489명이 된 24초에서 최초 에러 두 개를 확인했습니다. TPS는 초당 요청을 몇 개 처리 했는지 의미하기 때문에 요청 하나의 처리 속도가 1초를 넘긴다면 TPS가 전체 요청 개수보다 낮게 나타납니다.

테스트 로그는 `~/ngrinder-controller/perftest/0_999` 디렉토리의 하위 디렉토리에 분류되어 쌓입니다.

## 스크립트

스크립트를 직접 작성해 테스트를 수정할 수도 있습니다. jython과 groovy를 지원하며, 프로세스/스레드 시작 전, 테스트 실행 중 동작을 정의할 수 있습니다. grinder 홈페이지에 다양한 스크립트 예시들이 있습니다: [http://grinder.sourceforge.net/g3/script-gallery.html](http://grinder.sourceforge.net/g3/script-gallery.html)

## (+) AWS Elastic Beanstalk

앞서 CloudFront(CF)를 대상으로 부하 테스트를 했는데 예상한 그래프가 나오지 않아 설정을 잘못했다고 생각했습니다. 에러가 한 번 시작되면 TPS가 급락해야 하는데 그렇지 않았습니다.

그래서 Elastic Beanstalk(EB)를 이용해 테스트해봤습니다. EB는 쉽게 웹앱을 배포, 모니터링할 수 있는 환경을 제공합니다. EB를 생성하면 EC2 가상 머신을 만들어 추가적인 설정 없이 바로 웹앱을 배포해줍니다.

여기서는 nGrinder 설정을 확인하기 위해서만 사용했는데, 부하 테스트를 위해 특정 서비스의 mock 서버를 구축하는 방식으로 사용하면 더 좋을 것 같습니다. 

![image](https://user-images.githubusercontent.com/6410412/63666868-8bac5300-c80c-11e9-8e02-e9f75785afc2.png)

![image](https://user-images.githubusercontent.com/6410412/63666870-8ea74380-c80c-11e9-8f3b-13f2252b1fbc.png)

CF와 다르게 에러 발생 시점부터 응답이 돌아오지 않고 타임아웃돼 TPS 그래프가 예상대로 나왔습니다. CF에서 로드밸런싱이 잘 돼서 그런걸까...라고 추측하고 있습니다.

## 후기

### 테스트 1

* 람다 엣지를 이용해 썸네일 생성 기능을 만들었다.[^huiseoul]  갑자기 트래픽이 몰릴 상황을 대비해 부하 테스트를 했다.
* dummy thumbnail의 CloudFront 주소로 3분간 30만개 요청을 보냈다.
* 에러가 쏟아지며 테스트가 중단됐다. 왜 이렇게 빨리 죽지?

### 테스트 2

* 내가 뭔가 설정을 잘못했나 싶어서 네이버 cdn으로 같은 요청을 보냈다.
* 어느정도 되니까 에러가 쏟아졌다. 그래도 더 오래 버텼다.

### 테스트 3

* 어느 정도에서 죽는건지 궁금해서 ramp-up 방식으로 CloudFront 주소에 요청을 보냈다.
* 1000ms마다 vuser를 1씩 올렸다. 어느 지점에서 서버가 죽는지 알게 됐다.
* 근데 보통은 에러가 떨어지기 시작하면 그래프가 뚝 떨어진다는데, cf는 그렇지 않았다. 에러가 나는데도 계속 응답이 오긴했다. aws가 load balancing이나 auto scaling해서 그런가? ngrinder 설정을 잘못했나?

### 테스트 4

* AWS Elastic Beanstalk에 node 서버를 만들고 같은 테스트를 돌렸다.[^woowabros]
* 예상대로 에러가 나는 시점에 tps(transaction per second)가 뚝 떨어지고 응답이 전혀 오지 않았다.
* ngrinder 설정에 문제가 없다는 걸 확인했다. 그냥 cf가 특이한듯.

### 결론

* 알고보니 CloudFront는 기본 초당 100,000건 제한이 있었다.[^amazon]
* cf에 캐시된 이후에는 tps가 높아졌다. 이정도면 서비스하는데 문제가 없을 것이라고 판단했다.

## References

* [ngrinder, naver.github.io.](https://naver.github.io/ngrinder/)
* [nesoy, "nGrinder 시작하기", Nesoy Blog, 2018.](https://nesoy.github.io/articles/2018-10/nGrinder-Start)

[^aidanbae]: [배상익, "nGrinder agent가 controller에 못붙는 현상", 아이단은 어디갔을까, 2018.](https://aidanbae.github.io/code/devops/ngrinder/agentcontroller/)
[^huiseoul]: [Jinho Hong, "Lambda 한개로 만드는 On-demand Image Resizing", Huiseoul Engineering, 2018.](https://engineering.huiseoul.com/lambda-%ED%95%9C%EA%B0%9C%EB%A1%9C-%EB%A7%8C%EB%93%9C%EB%8A%94-on-demand-image-resizing-d48167cc1c31)
[^woowabros]: [권용근, "결제 시스템 성능, 부하, 스트레스 테스트", 우아한형제들 기술 블로그, 2018.](http://woowabros.github.io/experience/2018/05/08/billing-performance_test_experience.html)
[^amazon]: ["Amazon CloudFront - 한도", AWS 설명서, 2016.](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html)
