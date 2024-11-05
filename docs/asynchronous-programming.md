# 비동기 프로그래밍

* 독립적으로 발생하는 이벤트에 대한 처리를 위한 동시성 프로그래밍 기법의 총칭.

## 동시 서버

* 간단한 TCP 서버를 보자.

```rust
use std::io::{BufRead, BufReader, BufWriter, Write};
use std::net::TcpListener;

fn main() {
    let listener = TcpListener::bind("127.0.0.1:10000").unwrap();
    while let Ok((stream, _)) = listener.accept() {
        let stream0 = stream.try_clone().unwrap();
        let mut reader = BufReader::new(stream0); // 읽기 객체
        let mut writer = BufWriter::new(stream); // 쓰기 객체

        let mut buf = String::new();
        reader.read_line(&mut buf).unwrap(); // 한 줄씩 읽는다.
        writer.write(buf.as_bytes()).unwrap(); // 읽은 내용을 그대로 쓴다.
        writer.flush().unwrap();
    }
}
```

* 이 서버는 한 번에 한 유저의 요청만 처리할 수 있다. 유저A의 요청에 응답하기 전까지는 유저B의 요청을 처리할 수 없다.
* 동시 서버는 클라이언트의 요청에 대한 처리를 이벤트 단위로 분류해 이벤트에 따라 처리를 수행할 수 있다.
* IO 이벤트 감시는 파일 디스크립터를 감시하는 것이다:
  * 여러 TCP 커넥션이 있다면, 서버는 여러 파일 디스크립터를 가진다.
  * 각 파일 디스크립터에 대한 읽기/쓰기 가능 여부를 `select`, `kqueue`, `epoll`과 같은 함수로 판단한다.

## 코루틴

* 코루틴은 다양한 의미로 사용되지만, 보통은 중단과 재개가 가능한 함수를 총칭한다.
* [[coroutine]]{코루틴} 문서를 참고.
