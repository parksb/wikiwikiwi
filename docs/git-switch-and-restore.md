# switch & restore

git 2.23 버전이 출시되면서 많은 기능을 수행하던 `checkout`이 `switch`와 `restore`로 분리됐다.

브랜치 전환은 `switch`로 한다.

```
$ git checkout <branch>
```
```
$ git switch <branch>
```

브랜치 생성 및 전환은 `--create` 옵션의 약자인 `-c` 옵션을 주면된다.

```
$ git checkout -b <branch>
```
```
$ git switch -c <branch>
```

워킹 디렉토리 복원은 `restore`가 수행한다. 아무 옵션을 주지 않거나 `--worktree` 옵션을 주면 된다.

```
$ git checkout -- <file>
```
```
$ git restore <file>
```

스테이지된 파일을 언스테이지할 때는 `--staged` 옵션을 준다.


```
$ git reset <file>
```
```
$ git restore --staged <file>
```

## 참고자료

* ["git-switch", git-scm, 2019.](https://git-scm.com/docs/git-switch)
* ["git-restore", git-scm, 2019.](https://git-scm.com/docs/git-restore)
* [Taylor Blau, "Highlights from Git 2.23", The GitHub Blog, 2019.](https://github.blog/2019-08-16-highlights-from-git-2-23/)
