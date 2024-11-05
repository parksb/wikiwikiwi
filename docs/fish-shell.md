# Fish Shell

## Installation

* brew로 설치한다:
  ```sh
  $ brew install fish
  ```
* 기본 쉘로 쓰려면:
  ```sh
  $ echo /usr/local/bin/fish | sudo tee -a /etc/shells
  $ chsh -s /usr/local/bin/fish
  ```

## Plugins

* oh-my-fish와 fisher가 있음. 뭐가 더 좋은지는 모르겠다.
* 내 SDD(Star Driven Development) 원칙에 따라 oh-my-fish를 설치했다:
  ```sh
  $ curl -L https://get.oh-my.fish | fish
  ```

### dracula 

https://github.com/dracula/fish

```sh
$ omf install https://github.com/dracula/fish
```

### z

https://github.com/oh-my-fish/plugin-z

```sh
$ omf install z
```

## Variable

### Scope[^scope]

* universal: 모든 세션 사이에 공유되는 변수. (`set -U`)
* global: 현재 세션에 한정되며, `set -e` 명령으로 지우지 않는 이상 지워지지 않는 변수. (`set -g`)
* local: 현재 세션과 특정 명령 블록에 한정되며, 해당 블록 범위를 벗어나면 지워지는 변수. (`set -l`)

### Exporting[^exporting]

* 변수를 export한다는 것은 해당 변수를 외부 명령에게 제공하겠다는 의미다.
* `set` 명령에 `-x`(`--export`) 옵션을 사용하면 exported variable을 만들 수 있다.
* "exported"는 변수의 스코프를 의미하지 않는다.

### PATH[^path]

* PATH 변수는 쉘이 명령을 검색하기 위한 디렉토리를 포함하는 특수한 환경 변수다.
* 경로를 추가하는 가장 빠른 방법은 `fish_add_path` 함수를 사용하는 것:
  ```sh
  $ fish_add_path /usr/local/bin
  ```
  * 추가하려는 경로가 기존 `$PATH`에 없을 때만 추가된다. 
  * 따라서 `config.fish` 파일에 넣어둬도 안전하다.
* PATH 변수에 직접 `/usr/local/bin`와 `/usr/sbin`를 추가하는 경우:
  ```sh
  $ set PATH /usr/local/bin /usr/sbin $PATH
  ```
* PATH 변수에서 `/usr/local/bin`를 제거하는 경우:
  ```sh
  $ set PATH (string match -v /usr/local/bin $PATH)
  ```

## 참고자료

* [fish-shell documentation](https://fishshell.com/docs/current/index.html)

[^scope]: https://fishshell.com/docs/current/language.html#variables-scope
[^exporting]: https://fishshell.com/docs/current/language.html#exporting-variables
[^path]: https://fishshell.com/docs/current/tutorial.html#path

