# Redis Pub/Sub

- Pub/Sub 패턴은 퍼블리셔가 토픽별로 메시지를 발행하면 해당 토픽을 구독하는 구독자가 메시지를 수신하는 메시징 패턴.
- 레디스는 `SUBSCRIBE`, `UNSUBSCRIBE`, `PUBLISH` 명령을 통해 Pub/Sub 패턴을 지원.
  - 특정 채널을 구독: `SUBSCRIBE <channel> [channel ...]`
  - 특정 채널에 메시지를 발행: `PUBLISH <channel> <message>`
- 메시지가 수신됐는지 확인하지 않기 때문에 메시지 손실이 발생할 수 있음.

## 같이 읽기

- [[apache-kafka]]

## References

- [Redis Pub/Sub](https://redis.io/docs/interact/pubsub/)
