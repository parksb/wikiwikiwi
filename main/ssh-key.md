# SSH Key

* SSH(Secure Shell Protocol)는 보안적으로 안전한 통신을 위한 프로토콜.
* ssh 통신을 위해서는 비대칭 키가 필요하다.
  * Private key
  * Public key
* `ssh-keygen`으로 키를 생성한다.
  ```sh
  $ ssh-keygen # RSA 암호화, ~/.ssh 디렉토리에 id_rsa, id_rsa.pub 파일이 만들어진다.
  $ ssh-keygen -f ./ssh/key # RSA 암호화, ./ssh 디렉토리에 key, key.pub 파일이 만들어진다.
  ```
  * `id_rsa`는 비공개 키이므로 절대 공개되어서는 안 된다.
  * `id_rsa.pub`은 공개 키다.
* `ssh-keyscan`으로 다른 컴퓨터(보통 서버)의 공개 키를 가져온다.
  ```sh
  $ ssh-keyscan 192.168.43.39 # 192.168.43.39의 공개 키를 가져온다.
  $ ssh-keyscan github.com >> ~/.ssh/known_hosts # github.com의 공개 키가 ~/.ssh/known_hosts에 추가된다.
  ```
  * `known_hosts`에 키를 추가하면 접속할 때 물어보지 않는다.

## Troubleshooting

* public key를 잃어버린 경우:
  ```bash
  $ ssh-keygen -y -f ~/.ssh/id_rsa # `-y` 옵션을 주면 private 키로부터 public 키를 다시 생성한다.
  ```

## References

* [GitHub, Inc., "Connecting to GitHub with SSH", help.gihtub.com.](https://help.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh)