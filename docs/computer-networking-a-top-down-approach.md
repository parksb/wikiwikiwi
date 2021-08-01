# Computer Networking: A Top-Down Approach

## Ch.1. Computer Networks And The Internet

### Protocol의 key elements

* Syntax: 데이터 형식 정의. 인코딩 방식, 신호 레벨 정의 등.
* Semantics: 메시지 송수신 때 수행해야 할 동작 정의. control information 정의, error handling 등.
* Timing: 송수신 메시지와 연계된 시간정보, 순서를 정의. sequence number, speed matching 정의 등.

### OSI 7 Layers Model & TCP/IP Model

## Ch.2. Application Layer

### HTTP

* 전형적인 client-server model.
* transport layer protocol은 TCP를 사용.
* non-persistent의 경우 오브젝트마다 새로운 TCP 연결을 구축함. 따라서 N개 오브젝트를 받는다면 `(N + 1) * 2RTT`가 소요됨.
* persistent의 경우 N개 오브젝트를 받는다면 `2RTT + N * RTT`가 소요됨.

### Proxy Server

* request message에 `If-Modified-Since`가 있으면 캐시된 오브젝트의 `Last-Modified` header line을 확인, 업데이트가 필요하다면 서버에게 새 오브젝트를 요청함.
* conditional GET으로 proxy server에 캐시된 오브젝트를 그대로 받아오면 `2RTT`가 소요됨.

### Mail Send Protocol: SMTP

* client-server model & persistent connections.
* 다른 메일 서버에 메일을 보낼 때만 사용하는 push protocol.
* user agent에서 SMTP로 mail server에 메일을 전송하면, 메일 서버는 SMTP로 destination mail server에 메일을 전송. destination mail server는 메일을 mail box에 담는다. 이후 destination user agent에서 POP/IMAP/HTTP로 mail box의 메일을 가져와 읽는다.

### Mail Access Protocol: POP3 & IMAP & HTTP

* mail box에서 user agent로 메일을 가져올 때 사용하는 pull protocol.
* POP3는 non-persistent이며, mail server와 user agent가 동기화되지 않는다. authorization, transaction, termination를 거친다.

### DNS

* hostname으로 destination의 ip address를 알아내는 시스템.
* Root DNS server, Top-Level Domain server, Authoriative server가 있음.
* recursive query 방식, iterative query 방식으로 쿼리를 보낼 수 있음.
  * 기본적으로 host * local DNS server * root DNS server * TLD DNS server * authoritative DNS server * host 과정을 거침.
* resource records에는 name, value, type, ttl이 담긴다. type에 따라 name과 value가 달라진다.
  * type=A: name is hostname, value is IP address.
  * type=CNAME: name and value are real domain name.
  * type=NS: name is domain name, value is information of host managing domain name.
  * type=MX: value is mail server name, name is mail domain.

### FTP

* cline-server model, authentication control (login and password)
* control connection과 data connection 두 persistent TCP 연결을 사용하는 Out-Of-Band operation.

### P2P Model

* 피어들은 logical direct connection으로 데이터를 교환.
* 파일을 완전히 가진 피어를 seeder, 파일을 조각을 원하는 피어를 leecher라고 함. tracker server는 파일을 원하는 client에게 해당 파일 조각을 가진 다른 피어들의 key를 제공함.

### Distributed Hash Table

* hash table structure로 어떤 피어가 파일을 가지고 있는지 저장해둔 DB.
* 각 피어는 자신의 id를 가지고 있음. 파일의 hash key와 피어들의 id를 오름차순으로 비교해 가장 가까운 값의 피어에게 파일에 대한 정보를 저장.
  * 피어 21이 파일을 가지고 있고, 파일의 hash key는 43라고 가정.
  * 파일 32, 40, 48 피어가 있다면, 순서대로 hash key와  id를 비교해 피어 48에 (43, 21) kvp를 저장.
  * 만약 피어 32가 파일을 원한다면, 먼저 파일의 hash key가 43라는 것을 resolving함. 이후 자기보다 id가 큰 피어들에게 key가 43인 kvp가 있는지 쿼리.
  * 피어 48에게 (43, 21) kvp가 있으므로, 피어 32는 21에게 파일을 요청.
  * 피어 32가 파일을 가지게 된다면, 기존에 파일을 가지고 있던 피어 48에 (43, 32) kvp를 추가로 저장.
  * 이후 같은 파일을 원하는 다른 피어는 피어 48의 kvp를 확인하고, 피어 21에게 파일의 절반을, 피어 32에게 나머지 절반을 요청.

### Circular Distributed Hash Table

* 기존 DHT를 개량한 것, 각 피어는 자신의 predecessor와 successor만 알 수 있음.
* 기본적으로 DHT와 같은데, 과거 응답 history를 바탕으로 파일이 없다고 판단되는 피어에게는 쿼리를 날리지 않는다. O(log N) 시간이 걸림.
* 피어들이 자유롭게 스웜에 들어왔다 나갔다하는 것을 peer churn이라고 함.
  * 피어들은 주기적으로 successor에게 ping을 보내며 동작을 체크하고, 응답이 없다면 스웜에서 나간 것으로 판단.
  * 새 피어가 들어올 때는 그 피어가 스웜의 한 피어에게 JOIN p2p message를 보낸다. 피어 28이 피어 60에게 JOIN을 보냈다면, 60은 predecessor와 successor에게 28을 보냄. id가 28보다 작은 방향으로 쿼리를 계속 보내다가 successor가 28보다 크고, predecessor가 28보다 작은 자리에 피어 28을 넣음.

## Ch.3. Transport Layer

### Multiplexing & Demultiplexing

* multiplexing: source에서 하는 작업. 상위 레이어에서 하위 레이어로 데이터를 보낼 때 application layer에서 TCP나 UDP로, 또는 transport layer에서 IP로 데이터를 모으는 것.
* demultiplexing: destination에서 하는 작업. 하위 레이어에서 상위 레이어로 데이터를 가져올 때 network layer에서 TCP나 UDP로, 또는 transport layer에서 어플리케이션 포트별로 데이터를 분류하는 것.
* 각 connection은 각자 4개의 tuple을 가지고 있다: source IP address, source port, destination address, destination port.

### UDP

* 라우터에서 destination를 확인하지 않고 무조건 다음 노드에 패킷을 전송. 네트워크 상황에 따라 패킷이 서로 다른 경로를 갈 수 있고, destination에서 패킷을 이상한 순서로 받을 수 있음. (out-of-order)
* connectionless packet delivery, unreliable. 패킷이 손실될 수 있지만 헤더가 작아 overhead가 작고 빠르다.
* 패킷 손실, out-of-order 등의 문제를 상위 레이어인 application layer에서 해결해야 한다.
* UDP segment header에는 source port, destination port, option에 따라 달라지는 길이를 저장하는 length, 에러 감지를 위한 cheksum 필드가 있음.
  * checksum은 1) 주어진 16비트 정수들을 더하고 2) 그 결과를 16비트 right shift하고 3) 그 결과에 직전 결과 값을 더한다. 4) 그 결과에 보수를 취해 구할 수 있다.
  * 만약 16비트로 떨어지지 않는다면 끝에 zero bit를 하나 더한다.
  * checksum이 0이 아니라면 에러라는 의미로, 데이터를 상위 레이어로 보내지 않고 discard한다.

### ARQ

* 네트워크나 패킷에 문제가 있어 패킷이 손실, discard되는 경우가 있는데, 이때 sender에게 패킷을 다시 요청하는 것. (Automatic Repeat reQuest)
* ACK은 패킷을 잘 받았을 때 보내는 것, NACK은 패킷을 못 받았을 때 보내는 것. 실제로는 ACK만 사용.

### Stop-And-Wait ARQ

* sender는 receiver로부터 패킷에 대한 ACK을 받으면 다음 패킷을 보낸다. ACK가 안 오면 timeout 시간만큼 기다리고 패킷을 다시 보낸다.
* 만약 ACK가 손실되는 경우 receiver는 중복으로 받는 패킷을 discard하고 손실된 ACK을 다시 보낸다.
* sender가 timeout돼서 패킷을 다시 보냈는데, 그 사이 ACK이 온다면, sender는 중복되는 ACK을 discard, receiver는 중복되는 패킷을 discard.
* wait하는 동안 시간을 너무 오래 쓰고, 리소스 낭비가 심함. 심플하다는 것 외에는 장점이 없음.

### Go-Back-N ARQ

* ACK가 안 와도 한 번에 N개까지 패킷을 보낼 수 있도록 함. pipelined 방식이라고 부른다.
* 패킷 리스트에 길이가 N인 window가 있고, ACK#X를 받으면 window의 base가 #X+1이 되도록 slide해 "#X에 대한 ACK를 받았고 이제 #X+1번 패킷을 보내야 한다"를 의미.
  * window 안에는 보냈지만 ACK 아직 오지 않은 패킷과 아직 보내지 않은 패킷이 모두 담겨 있음.
  * receiver는 N개의 패킷에 대해 한번에 ACK을 보냄. 따라서 window가 한 번에 여러 칸씩 움직일 수 있음.
  * sender와 receiver 모두 window를 가지고 있다.
* sender는 첫 패킷을 보낼 때 timer를 구동해 timeout 시간까지 ACK이 오지 않으면 패킷을 다시 보낸다. receiver는 순서가 잘못된 패킷을 discard한다.
* sender는 receiver에서 패킷이 discard 된다면, 그 이후에 보낸 모든 패킷을 다시 보낸다. 즉, overhead가 크다.

### Selective Repeat ARQ

* GBN ARQ와 비슷한데, 재전송 해야하는 패킷만 전송해 overhead를 줄임. GBN을 개선한 것이지만, receiver가 버퍼를 다루는 게 비효율적이라 실제로는 GBN이 더 흔하게 쓰임.
* 못 받은 패킷에 대해서는 ACK를 보내지 않고, 이후에 오는 패킷들에 대해 ACK을 보내면서 버퍼에 담는다. sender는 timeout이 지났음에도 해당 패킷에 대한 ACK이 오지 않으면 패킷을 재전송한다.

### TCP

* connection-oriented, three-way handshake, client와 server가 논리적 관계를 맺는다.
* sender는 데이터를 여러 조각으로 나누며, 이를 세그먼트라고 부른다. 세그먼트의 크기는 MSS(Maximum Segmentation Size)에 맞춰진다. 세그먼트의 TCP header에는 다음과 같은 필드들이 있다:
  * Source port
  * Dest port
  * Sequence number: 보내야하는 segment의 첫 바이트 번호. MSS가 1200byte고, 최근 전송한 segment가 7개라면, 보내야하는 base byte는 7 * 1200 = 8400.
  * Acknowledgment number: 받아야하는 segment의 첫 바이트 번호. 최근 수신한 segment가 10개라면, 다음에 받을 byte는 10 * 1200 = 12000.
  * Header Length: 헤더 길이. 추가 option이 없는 경우 32bytes다.
  * URG: urgent data, generally not used.
  * ACK: ACK를 받았는지 여부.  receiver가 sender로부터 받은 segment의 ACK이 1이면 Acknowledgment number에 다음에 받아야할 sequence number를 넣어 segment를 보낸다.
  * PSH: push data now, generally not used.
  * RST, SYN, FIN
  * Receive window: 수신 가능한 바이트수. MSS가 1200이고, 100개의 segment를 더 받을 수 있다면, 1200 * 100 = 120000.
  * Urgent data pointer: end of urgent data
* segment의 첫 바이트가 해당 segment의 sequence number.

### ARQ in TCP

* Sample RTT와 Estimated RTT가 있음. 전자는 ACK이 바로 온 RTT로, 네트워크 상태에 따라 변동폭이 큼. 후자는 보다 smooth하게 평균을 낸 RTT.
* 기본적으로 GBN을 조금 수정한 방식. sender는 timeout 시간동안 ACK가 안 오면 동일한 세그먼트를 다시 보낸다.
* 기존 GBN은 누락된 패킷 이후의 모든 패킷을 다시 보내지만, TCP에서는 ACK가 오지 않은 세그먼트만 다시 보낸다.
* 상황에 따라 action이 정해져있다.
  * Delayed ACK: receiver에 세그먼트가 모두 순서대로 도착했다면 500ms를 기다리고 ACK를 보낸다. (짝수번째 세그먼트에만 ACK를 보내게 된다.)
  * Immediate and Cumulative ACK: 500ms를 기다리는 동안 새로운 세그먼트가 도착하면 바로 앞에 온 세그먼트를 포함해 한번에 ACK를 보낸다.
  * Immediate and Duplicate ACK: 세그먼트 하나가 누락된다면, 그 이후에 온 세그먼트는 버퍼에 담아두고, 누락된 패킷만 전송받는다.
  * Immediate and Cumulative ACK: 누락된 패킷을 전송받으면 그에 맞게 윈도우가 slide한다.
* fast retransmit을 위해 sender가 3개의 중복된 ACK를 받으면 패킷이 누락됐다고 판단, ACK의 패킷을 재전송한다. 하필 3개인건 그냥 해보니까 그게 타당해서 정해진 것.

### Flow Control in TCP

* receiver는 운영체제 위에서 동작하므로 즉각 task를 처리하지 못할 수 있기 때문에 overflow가 발생할 수 있음. 그래서 receiver는 sender에게 자기가 처리할 수 있는 task의 정보를 제공한다.
* TCP header의 Receive Window 필드에 수신 가능한 바이트를 담는다. `rwnd = RcvBuffer * [LastByteRcvd * LastByteRead]`
* sender는 윈도우 크기를 reciever가 보낸 rwnd 크기보다 크게 잡을 수 없음. 이후에도 rwnd를 계속 받으며 윈도우 크기를 조정.

### TCP Connection Management

* TCP는 연결 구축에 three-way handshake 방식을 사용.
* closing 때는 sender가 FIN을 보내고, receiver가 ACK를 보낸다. 그리고 다시 receiver가 FIN을 보내고, sender가 ACK를 보낸다. sender가 `2 * MSL` 시간만큼 대기하다가 receiver에게 아무런 데이터도 오지 않으면 비로소 연결이 끊긴다.
* 만약 `2 * MSL` 시간 안에 FIN이 또 오면 자신이 보낸 ACK가 누락된 것으로 판단한다.
* 연결이 끊기면 서버는 클라이언트와의 연결 정보를 모두 잊는다.

## Ch.3 TCP Congestion Control

### Congestion Control

* 네트워크가 혼잡하면 버퍼가 오버플로우될 수 있음.
  * 라우터가 오버플로우되면 패킷 손실이 발생.
  * 라우터 버퍼의 queueing이 길어지면 패킷 전송이 오래 걸림.
  * 요청이 너무 많으면 연결자체가 막힐 수도 있음.
* congestion control은 쾌적한 환경을 유지하는 것.
* end to end delay: 엔드 시스템에서 엔드 시스템까지의 지연. queueing delay가 가장 큰 영향을 미침.
* congestion collapse: 네트워크가 더 이상 패킷을 처리할 수 없음.
* congestion avoidance: 혼잡을 예측하고 회피하는 것.
* congestion control stratesies:
  * implicit congestion control: ACK 수신을 기준으로 RTT에 따라 혼잡을 예측.
  * explicit congestion control: 라우터가 네트워크를 모니터링하다가 sender에게 보고.
* TCP congestion control: source가 네트워크 상태에 따라 전송 패킷양을 조절.
  * TCP flow control eliminates: receiver와 버퍼의 오버플로우 방지. (receiver 주도)
  * TCP congestion control prevents: 라우터 버퍼의 오버플로우 방지. (source 주도)
* TCP windows
  * rwnd: receive window
  * cwnd: congestion window
  * TCP window size at sender ≤ min { rwnd, cwnd }

### AIMD

* Additive Increase Multiplicative Decrease
  * Additive Increase: 손실이 감지될 때까지 모든 RTT에 대해 cwnd를 1씩 증가.
  * Multiplicative Decrease: 손실이 발생하면 cwnd를 반으로 자름. `cwnd = cwnd / 2`

### Slow Start

* 매 RTT마다 cwnd가 1씩 증가.
* timeout되면 cwnd가 2배 증가.

### Congestion Avoidance (Tahoe):

* cwnd > ssthresh라면 매 RTT마다 cwnd를 1씩 증가.
* cwnd ≤ ssthresh라면 매 RTT마다 cwnd를 2배씩 증가.
* 3번 ACK가 중복되거나 timeout되면 ssthresh = cwnd / 2, cwnd = 1 (slow start)

### Fast Retransmit

* 3번 ACK개 중복되면 timeout 발생 전에 세그먼트를 재전송.

### Fast Recovery (Reno):

* cwnd > ssthresh라면 매 RTT마다 cwnd를 1씩 증가.
* cwnd ≤ ssthresh라면 매 RTT마다 cwnd를 2배씩 증가.
* timeout이 일어나면 ssthresh = cwnd / 2. cwnd = 1 (slow start)
* 3번 ACK가 중복되면 ssthresh = cwnd / 2. cwnd = cwnd / 2 + 3 (fast recovery)

## Ch.4. Network Layer: Data Plane

### Virtual Circuit Packet Switching

* 상대방까지 가는 물리적 connection을 맺는다.
* 패킷 전송 전 경로를 설정. 하지만 링크가 dedicated하진 않음.
* 한 경로로 보내니까 패킷 순서가 바뀌지 않고, 경로 차이로 인한 패킷 손실이 없음.
* connection-oriented

### Datagram Packet Switching

* 각 라우터에서 마음대로 패킷을 보내며, 패킷들이 독립적이다.
* 라우터의 queing delay에 따라 패킷 순서가 뒤바뀐다. (out of order, unreliable)
* re-order와 recover missing packets은 상위 레이어(TCP, UDP라면 App layer)가 해결.
* connectionless

### Data and Control Planes

* SDN: Software Defined Networking 기술적인 개념을 정의.
* data plane과 control plane을 물리적으로 분리. 원래 라우터가 직접 라우팅 테이블을 만들었으나, 서버(control plane)에 정보를 올리면 라우팅 알고리즘을 돌려 라우터들(data plane)에게 라우팅 테이블을 보내주는 방식을 사용.

### The Internet Protocol (IP)

* Datagram Format:
  * Header length: 옵션에 따라 가변적. default = 5.
  * Datagram length: total datagram length (bytes)
  * TTL: 라우터를 거칠 때마다 1씩 감소.
* IP Fragmentation
  * Network layer에선 segmentation을 fragmentation이라고 부름.
  * fragmentation해야 하면 `frag`가 0, 아니면 1.
* datagram 크기가 MTU보다 크면 fragmentation을 해야 한다.
* `offset`은 잘라진 위치. offset=n/8.

### IPv4 Addressing

* IP는 네트워크 인터페이스 카드(NIC)마다 부여
* IP는 network part와 host part로 나뉨.
  * 같은 서브넷의 NIC는 같은 network part를 갖는다. (192.168.0.xxx)
  * network part를 보고 서브넷을 판단할 수 있다.
* Classful IPv4 Addresses
  * 0: class A
  * 10: class B
  * 110: class C
  * 1110: class D
* Unicast, Broadcass and Multicast
  * Unicast: class A, B, C. 1:1 양방향 연결.
  * Broadcast: host part has all 255. 1:N 단반향 연결. 그룹내 통신.
  * Multicast: class D. 1:N 단방향 연결. 그룹간 통신.

### Subnet and Subnetting

* 같은 네트워크 주소를 공유하는 네트워크 그룹.
* 라우터 간의 연결도 서브넷을 형성.
* 서브넷마스크: subnet address/subnet mask (210.104.35.0/24)
  * 255.0.0.0/8: class A
  * 255.255.0.0/16: class B
  * 255.255.255.0/24: class C
  * 앞 n bit를 모두 1로 바꾸고 나머지를 0으로 바꾼다음, ip address와 AND 연산을 하면 ip address의 network portion을 구할 수 있다.
* Subnetting: 하나의 서브넷을 여러개로 나누는 것.
  * 기존 subnet mask에 3 bit를 더 포함시킨다.
  * maximum number of hosts in each subnet = 2^r * 2 (r = subnet mask)

### CIDR (Classless Inter-Domain Routing)

* classful을 대체해 현재 쓰이는 방식.
* a.b.c.d/x: x bits를 subnet address를 위해 사용한다.
* address aggregation: 여러 subnet address를 합쳐 하나의 address로 표현.
* common part가 CIDR prefix, common part를 1로 매핑한 건 subnetmask.
* common part 외의 부분을 0으로 매핑하면 network address.

### DHCP (Dynamic Host Configuration Protocol)

* 사용할 때만 IP를 부여하는 게 DHCP.
* UDP를 사용한다. 67 port는 DHCP 서버, 68 port는 클라이언트.
* DHCP opration:
  1. client가 broadcast message를 보낸다. (UDP) src: 0.0.0.0 / dest: 255.255.255.255
  2. DHCP server들이 응답을 보낸다. src: server ip / dest: 255.255.255.255
  3. 응답 중 하나를 골라 broadcast로 request를 보낸다. src: 0.0.0.0 / dest: 255.255.255.255
  4. 해당 서버가 broadcast로 ACK를 응답한다. src: server ip / dest: 255.255.255.255

### NAT (Network Address Translation)

* private ip에서 출발해 public ip로, 또 그 반대로 변환하는 것.
* 라우터가 NAT table을 보고 특정 ip를 특정 포트로 대응시킨다.

### IPv6

* datagram의 base header 40bytes는 고정. extension header가 이어서 붙여짐.
* fragmentation이 없어서 관련 필드도 없음.

## Ch.5. Network Layer: Control Plane

### Routing

* 라우팅은 패킷의 경로를 결정하는 것. (control plane)
* 포워딩은 적절한 라우터 output으로 패킷을 보내는 것. (data plane)

### Link-State Routing Algorithm

* 시작점과 목표점을 기준으로 경로를 구하는 알고리즘.
* 기준점을 바꿔가며 최소 비용 경로를 구한다.

### Distance-Vector Algorithm

* 주변 라우터에게 정보를 받아 경로를 구하는 알고리즘.

### RIP (Routing Information Protocol)

* Autonomous System: 동일한 관리체계 아래에서 관리되는 네트워크의 집합.
* Intra-AS routing: IGP (Interior Gateway Protocol)
  * Distance-Vector
    * RIP (Routing Information Protocol)
    * EIGRP (Enhanced Interior Gateway Routing Protocol)
  * Link-State
    * OSPF (Open Shortest Path First)
    * IS-IS (Intermediate System-to-Intermediate System)
* Intra-AS routing: EGP (Exterior Gateway Protocol)
  * Path-Vector
    * BGP (Border Gateway Protocol)
* RIP는 application layer에서 동작, transport layer에서는 UDP를 사용.
* 30초마다 계산을 수행해서 RIP 메시지를 주고받음.
* loop가 생기는 문제가 있음.

### OSPF (Open Shortest Path First)

* TCP나 UDP가 아닌 IP를 통해 메시지를 전송함.
* area 안에서 flooding으로 경로를 구축. LS와 동일함.
* backbone과 area를 나눠 관리함.

### BGP (Border Gateway Protocol)

* TCP 연결을 사용.
* 경로 정보를 누적하며 전체 경로를 구축.
* 정책에 따라 경로가 다르게 결정된다.
* eBGP: AS와 AS를 잇는 BGP.
* iBGP: AS 내에서 외부 라우터와 통신하는 BGP.

### ICMP (Internet Control Message Protocol)

* 라우터가 패킷을 전달하며 생긴 상황을 sender에게 알려주기 위한 프로토콜.
* receiver에게 ICMP echo message를 보내 receiver가 살아있는지 확인.
* TTL 설정에 따라 중간 라우터를 확인하는 것도 가능. 라우터를 거칠 때마다 TTL이 감소.

### IGMP (Internet Group Management Protocol)

* multicast group에 join할 때 쓰이는 프로토콜.

### SDN Data Plane

* flow table의 action 필드에 따라 행동을  수행.
  * IP dst 51.6.0.8, port #6: 목적지가 51.6.0.8인 모든 데이터그램을 6번 포트로 포워딩.
  * TCP/UDP dport 22, drop: 22번 포트로 들어오는 모든 데이터그램을 삭제.

### SDN Control Plane

* 트래픽이 한쪽으로만 몰리면 버퍼오버플로우 발생.
* 네트워크(data plane)에서 정보를 받아 라우팅 알고리즘을 수행.

## Ch.6. Datalink Layer and LAN

### Error Detection and Correction

* Error detection: 데이터 비트 뒤에 error detection bits가 붙는다.
* Error correction: 현재 데이터와 에러정정 데이터가 섞인 프레임을 만든다.

### Parity Check for Error Detection

* Single bit parity
  * 비트 하나를 추가해 1의 개수를 홀수나 짝수로 만들어 에러를 탐지하는 방법.
  * 두 비트 이상이 변조되면 에러를 탐지할 수 없다.
* Two-dimensional parity
  * 각 행과 열에 1의 개수가 짝수가 되도록 비트를 붙여 에러를 탐지하는 방법.
  * 짝수가 아닌 행, 열의 교차지점에 있는 비트를 변환해준다.

### Cyclic Redundancy Check (CRC)

* 두 바이너리 숫자를 나눠서 나머지가 0인지 확인하는 방법.
* 0이면 에러가 없다는 것을 의미.
* polynomial로 표현: X5 + X4 + X3 + X + 1 = 111011

### Multiple Access Protocols

* 여러 노드가 동시에 데이터를 보낼 때 신호가 중첩되는 문제.
* TDMA (Time Division Multiple Access)
* FDMA (Frequency Division Multiple Access)
* CSMA/CD (Carrier Sense Multiple Access with Collision Detection)
  1. 1-persistent CSMA
    * 채널이 idle하면 바로 전송.
    * 채널이 busy하면 대기, idle해지는 즉시 전송.
  2. Collision Detection
    * 전송 중 collision을 계속 확인.
    * collision이 감지되면 signal을 보내 전송 중단.
  3. Binary Exponetial Backoff
    * 랜덤 시간을 대기하고 처음으로 돌아간다. (모든 station이 random backoff)

### ARP (Address Resolution Protocol)

* MAC(Medium Access Control) address: 단말마다 부여되는 식별 주소.
* ARP는 MAC 주소를 알아내기 위한 프로토콜.
  1. source station이 ARP request message를 broadcast한다.
  2. destination station이 ARP reply message를 source에게 보낸다.
* Proxy ARP: 라우터가 MAC 주소를 캐시해두는 것.
  * 다른 subnet의 node들은 라우터의 NIC MAC 주소로 생각한다.

### Ethernet

* IEEE 802.3 표준을 따른다.

### Virtual LAN

* 논리적인 서브넷을 구축할 수 있다.
* 스위치의 포트에 연결하면 VLAN을 구축할 수 있다.

## Ch.7. Wireless LAN

### IEEE 802.11 Architecture

* wireless host는 이동중에도 사용할 수 있음.
* BS(Base Station): wirelss와 wired를 relay 해주는 장비. AP(Access Point) 역할.
* 직접 통신하지 않고 AP를 거쳐야한다.

### IEEE 802.11 MAC Protocol

* 신호가 방해받으면 strength가 떨어진다.
* Hidden Terminal Problem: 장애물이 있으면 신호가 막힌다. (중간 AP가 필요)
* CSMA/CA (CSMA with Collision Avoidance)
  1. 전송 전 carrier sensing을 통해 채널을 확인.
  2. medium이 idle하면 DIFS 시간을 대기하고 전송.
  3. medium이 busy하면 idle할 때까지 대기.
  4. 추가로 DIFS 시간 + 랜덤 시간 대기하고 전송.
* RTS/CTS
  * Hidden terminal problem을 해결하기 위한 방법.
  1. sender가 DIFS 시간 대기하고 AP에게 RTS message 전송.
  2. AP는 RTS message 수신 후 SIFS 시간을 대기하고 CTS message를 broadcast
  3. sender가 CTS message를 수신하고 frame을 전송.
  4. AP가 SIFS 시간 대기하고 ACK를 broadcast.
  5. 다른 sender가 DIFS 시간 + Badck Off 시간 대기하고 RTS message 전송.

### IEEE 802.11 Frame Format

* 4개의 address를 담고 있음. (dest, source, AP)

## References

* [아주대학교, 컴퓨터네트워크, 2018.](https://github.com/parksb/campus-life/tree/master/%EC%BB%B4%ED%93%A8%ED%84%B0%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC)
