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

## Notes

### `$PATH`

```sh
$ echo $PATH
/usr/bin /bin /usr/sbin /sbin /usr/local/bin
$ set PATH $PATH $HOME/.cargo/bin
$ echo $PATH
/usr/bin /bin /usr/sbin /sbin /usr/local/bin /home/.cargo/bin
```

## References

* [fish-shell documentation](https://fishshell.com/docs/current/index.html)
