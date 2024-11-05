# rebase --onto

* server 브랜치에서 출발한 client 브랜치를 master 브랜치로 리베이스하고자 한다.

![image](https://user-images.githubusercontent.com/6410412/70377589-8d33fe00-1959-11ea-96d1-9fad10857c8b.png)

* rebase의 `--onto` 옵션으로 옮긴다.
* `git rebase --onto [base] [from] [to]`

```bash
$ git rebase --onto master server client
```

* master로 **(server, client]** 범위를 리베이스하겠다는 의미.
* client 브랜치의 변경 사항들이 master 브랜치로 리베이스된다.

![image](https://user-images.githubusercontent.com/6410412/70377590-902eee80-1959-11ea-8c32-f51bc65d2696.png)

* 특정 커밋 범위를 지정할 수도 있다.
* 39a527 다음 커밋부터 8772ea 커밋까지 master로 리베이스된다.

```bash
$ git rebase --onto master 39a527 8772ea
```

## 참고자료

* ["Git Branching - Rebasing", git-scm.](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)
* [Xmanoux, "I can't understand the behaviour of git rebase --onto", 2015.](https://stackoverflow.com/questions/29914052/i-cant-understand-the-behaviour-of-git-rebase-onto)
