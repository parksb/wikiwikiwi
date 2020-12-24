# Unix Command line tools

## BSD $`\neq`$ UNIX

* 커맨드 라인 툴은 대부분 두가지 버전이 있다:
  * BSD 버전 (BSDs & MacOS)
  * GNU 버전 (Linux)
* MacOS에서 `brew install coreutils` 명령을 이용해 GNU 버전 툴을 설치할 수 있다.

## grep

파일에서 문자열을 검색한다.

```
grep [-abcdDEFGHhIiJLlmnOopqRSsUVvwxZ] [-A num] [-B num] [-C[num]]
     [-e pattern] [-f file] [--binary-files=value] [--color[=when]]
     [--colour[=when]] [--context[=num]] [--label] [--line-buffered]
     [--null] [pattern] [file ...]
```
```bash
$ grep bananas foo.txt
```

* `-A [NUM]` (after) - 일치하는 라인의 이후 라인을 보여준다.
* `-B [NUM]` (before) - 일치하는 라인의 이전 라인을 보여준다.
* `-C [NUM]` (current) - 일치하는 라인의 전후 라인을 보여준다.
* `-i` (case Insensitive) - 대소문자를 구분하지 않는다.
* `-l` (fiLenames) - 일치하는 파일의 파일 이름만 보여준다.
* `-v` (inVert match) - 일치하지 않는 모든 라인을 찾는다.
* `-r` (Recursive) - 디렉토리 안의 모든 파일에 대해 검색한다.
* `-o` (Only) - 라인에서 일치하는 부분만 보여준다. 
* `-E` (Egrep) - 졍규표현식을 이용해 검색한다.
* `-F` (Fgrep) - 정규표현식을 이용하지 않고 검색한다.

## find

디렉토리에서 파일을 찾는다.

```
find [-H | -L | -P] [-EXdsx] [-f path] path ... [expression]
find [-H | -L | -P] [-EXdsx] -f path [path ...] [expression]
```
```bash
$ find /tmp -type d -print
```

* `-name` - 이름으로 찾는다. eg. `-name '*.txt'`
* `-path` - 파일 경로로 찾는다. eg. `-path '/home/*/*.go'`
* `-type [TYPE]` - 타입으로 찾는다. eg. `-type d`
  * `f` (File) - 일반 파일
  * `l` (symLink) - 심볼릭 링크
  * `d` (Directory) - 디렉토리
* `-size0` - 빈 파일(크기가 0인 파일)을 찾는다.
* `-exec [COMMAND]` - 파일을 찾을 때마다 명령을 실행한다.
* `-delete` - 찾은 파일을 삭제한다.

## xargs

입력 스트림으로부터 공백으로 구분된 문자열을 받아 명령의 인자로 변환한다.

```
xargs [-0opt] [-E eofstr] [-I replstr [-R replacements]] [-J replstr]
      [-L number] [-n number [-x]] [-P maxprocs] [-s size]
      [utility [argument ...]]
```

```bash
$ echo "/home/tmp" | xargs ls
```

* 파일 리스트에 대해 같은 명령을 실행할 때 유용하다:
  * `xargs rm` - delete
  * `xargs cat` - combine
  * `xargs grep` - search
  * `xargs sed` - replace
* `find . -name '*.txt' | xargs sed -i s/foo/bar/g`- 모든 .txt 파일에 있는 단어 "foo"를 모두 "bar"로 바꾼다:
* 파일명에 공백이 있으면 분리된 인자로 간주한다.
* `-n 1` - 각 입력에 대해 xargs가 분리된 프로세스로 동작한다.
* `-P` - 병렬 프로세스의 최대 개수를 설정한다.
  
## awk

데이터를 조작하기 위한 작은 프로그래밍 언어다.

```
awk [ -F fs ] [ -v var=value ] [ 'prog' | -f progfile ] [ file ...  ]
```

* awk 프로그램의 기본적인 구조는 다음과 같다:

```
BEGIN { ... }
CONDITION { action }
CONDITION { action }
END { ... }
```

* 텍스트의 컬럼을 추출한다:
  * `,` - column separator
  * `{print $5}` - print the 5th column

```bash
$ awk -F, '{print $5}'
```

* 세번째 컬럼의 숫자들을 모두 더해 출력한다:

```bash
$ awk '{s += $3};END{print s}'
```

## bash tricks

* magical braces
  * `convert file.{jpg.png}` expands to `convert file.jpg file.png`
  * `{1...5}` expands to `1 2 3 4 5`
* `!!` - 마지막 명령 (`$ sudo !!`)
* 반복문:
  ```shell
  for i in *.png
  do
    convert $i $i.jpg
  done
  ```
* `$(...)` - 명령의 출력 (`touch file@$(date -I)` create a file named file@2019-10-26)
* `cd -` - 이전 디렉토리로 이동
* `bg` (BackGround) - 백그라운드 프로그램 시작
* `fg` (ForeGround) - 백그라운드 프로그램을 포그라운드로 전환

## disk usage

* `du` (Disk Usage) - 디스크 공간을 얼마나 사용하고 있는지 보여준다.
  * `-s` (Summary)
  * `-h` (Human-readable sizes)
* `df` (Disk Filesystem) - 각 파티션의 디스크 공간을 보여준다.
  * `-h` (Human-readable sizes)
  * `-i` (disk Inodes)

## tar

.tar (Tape ARchiver) 파일 형식은 여러 파일을 하나의 파일로 묶은 형식이다. .tar 파일 자체로는 압축을 하지 못한다. 압축에는 일반적으로 .tar.gz나 .tgz 형식을 사용한다.

```
tar [bundled-flags <args>] [<file> | <pattern> ...]
tar {-c} [options] [files | directories]
tar {-r | -u} -f archive-file [options] [files | directories]
tar {-t | -x} [options] [patterns]
```

* `tar` 명령은 보통 tar.gz 파일을 압축 해제할 때 사용한다. (`tar -xzf file.tar.gz`)
* `-x` (eXtract) - 현재 디렉토리에 파일을 추출한다.
* `-c` (Create) - 새로운 tar 파일을 만든다.
* `-t` (lisT) - tar 파일의 내용을 출력한다.
* `-f` (File) - 특정 tar 파일을 만들거나 압축 해제한다.
* tar는 파일을 여러 형식으로 압축하거나 압축 해제할 수 있다.
  * `-z` - gzip (.gz)
  * `-j` - bzip2 (.bz2)
  * `-J` - xz (.xz)

## ps

실행 중인 프로세스를 보여준다.

```
ps [-AaCcEefhjlMmrSTvwXx] [-O fmt | -o fmt] [-G gid[,gid...]] [-g grp[,grp...]] [-u uid[,uid...]] [-p pid[,pid...]]
   [-t tty[,tty...]] [-U user[,user...]]
ps [-L]
```

## References

* [Julia Evans, "Bite size command line", gumroad.com, 2018.](https://gumroad.com/discover?query=bite%20size%20command#EJRth)
