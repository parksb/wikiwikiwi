# Redis

* Redis(Remote Dictionary Server)는 kvp 구조의 비관계형 데이터를 관리하기 위한 인메모리 NoSQL 저장소다.
* 데이터베이스나 캐시, 메시지 브로커로 사용할 수 있으며, 각종 데이터 타입을 지원한다.

## Data Types

### Strings

* 문자열은 레디스 값의 가장 기본적인 타입이다.
* INCR, APPEND 등 각종 동작이 가능하다.

### Lists

* 리스트는 문자열의 리스트다.
* LPUSH, RPUSH 등의 동작이 가능하다.

### Sets

* 집합은 문자열의 순서없는 컬렉션이다.
* SADD, SPOP, SMEMBERS 등의 동작이 가능하다.

### Hashes

* 해시는 문자열 필드와 문자열 값으로 이뤄진 맵이다.
* 따라서 오브젝트를 표현하기에 가작 적합한 타입이다.
* HSET, HMSET, HGETALL 등의 동작이 가능하다.

### Sorted sets

* 집합과 비슷하지만 점수로 정렬되는 순서있는 컬렉션이다.
* ZADD, ZRANK 등의 동작이 가능하다.

## Commands

### SET

* 키와 값을 인자로 받아 kvp 데이터를 저장한다.

```redis
redis> SET key ”value”
“OK”
```

### GET

* 키를 인자로 받아 해당 키의 값을 반환한다.

```redis
redis> SET key “value”
“OK”

redis> GET key
“value”
```

### DEL

* 키를 인자로 받아 해당 키와 값을 삭제한다. 삭제한 키의 개수를 반환하며, 키가 없으면 무시한다.

```redis
redis> SET key1 “value”
“OK”

redis> SET key2 “value”
“OK”

redis> DEL key1 key2 key3
(integer) 2
```

### INCR

* 키를 인자로 받아 해당 키의 값을 1 증가시키고 반환한다.

```redis
redis> SET key “10”
“OK”

redis> INCR key
(integer) 11

redis> GET key
“11”
```

### KEYS

* 패턴을 인자로 받아 해당 패턴에 맞는 모든 키를 반환한다.
  * `h?llo` matches `hello`, `hallo` and `hxllo`
  * `h*llo` matches `hllo` and `heeeello`
  * `h[ae]llo` matches `hello` and `hallo`, but not `hillo`
  * `h[^e]llo` matches `hallo`, `hbllo`, ... but not `hello`
  * `h[a-b]llo` matches `hallo` and `hbllo`
* 오버헤드가 크기 때문에 프로덕션 환경에서 사용하면 안된다.

```redis
redis> SET key1 "value1" key2 "value2"
"OK"

redis> KEYS key1
1) "key1"

redis> KKEYS *
1) "key1"
2) "key2"
```

### SCAN

* 커서 기반 키 이터레이터.
* KEYS와 비슷하지만 제한된 버킷을 순회하기 때문에 프로덕션에 사용할 수 있을 정도로 오버헤드가 작다.

```redis
redis> scan 0
1) "17"
2)  1) "key:12"
    2) "key:8"
    3) "key:4"
    4) "key:14"
    5) "key:16"
    6) "key:17"
    7) "key:15"
    8) "key:10"
    9) "key:3"
   10) "key:7"
   11) "key:1"

redis> scan 17
1) "0"
2) 1) "key:5"
   2) "key:18"
   3) "key:0"
   4) "key:2"
   5) "key:19"
   6) "key:13"
   7) "key:6"
   8) "key:9"
   9) "key:11"
```

## 하위문서

* [[redis-cluster]]{Redis 클러스터}
* [[redis-pub-sub]]{Redis Pub/Sub}

## 참고자료

* [Redis Labs, “Commands”, redis.io.](https://redis.io/commands)
* [Clark Kang, "Redis의 SCAN은 어떻게 동작하는가?", kakao Tech, 2016.](https://tech.kakao.com/2016/03/11/redis-scan/)
