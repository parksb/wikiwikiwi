# Vim

## Moving the cursor

* `h`, `j`, `k`, `l` - 좌, 하, 상, 우 이동
* `H` (High) - 화면 최상단으로 이동 
* `M` (Middel) - 화면 중간으로 이동
* `L` (Low) - 화면 최하단으로 이동
* `w`, `W` (Word) - 다음 단어 시작으로 이동, 특수문자 포함
* `e`, `E` (End) - 다음 단어 끝으로  이동, 특수문자 포함
* `b`, `B` (Back) - 이전 단어 시작으로 이동, 특수문자 포함
* `%` - 현재 괄호의 짝으로 이동
* `0` - 라인의 처음으로 이동
* `$` - 라인의 끝으로 이동
* `^` - 라인의 첫번째 단어로 이동
* `gg` - 문서의 첫 라인으로 이동
* `G` - 문서의 마지막 라인으로 이동
* `{`, `}` - 빠르게 상, 하 이동

## Inserting & Appending

* `i` (Insert) - 커서 앞에 삽입
* `I` (Insert) - 라인의 시작에 삽입
* `a` (Append) - 커서 뒤에 삽입
* `A` (Append) - 라인 끝에 삽입
* `o` (Open) - 아래 라인에 삽입
* `O` (Open) - 위 라인에 삽입

## Editing

* `r` (Replace) - 한 글자 교체
* `c [motion]` (Change) - 교체
* `[number] C` (Change) - 커서부터 라인 끝까지 교체
* `[number] cc` (Change) - 라인 전체 교체
* `.` - 마지막 명령 반복
* `u` (Undo) - 되돌리기
* `Ctrl-r` (Redo) - 되돌리기 취소

## Selecting

* `v` (Visual) - 비주얼 모드 시작
* `y` (Yank) - 선택한 텍스트 복사
* `d` (Delete) - 선택한 텍스트 잘라내기
* `-` - 대소문자 반전

## Cut & Paste

* `y [motion]` (Yank) - 복사
* `[number] yy` (Yank) - 라인 전체 복사
* `p` (Paste) - 커서 뒤에 붙여넣기
* `P` (Paste) - 커서 앞에 붙여넣기
* `d [motion]` (Delete) - 잘라내기
* `[number] dd` (Delete) - 라인 전체 잘라내기
* `x` - 한 글자 잘라내기

## Editor

* `gt` - 다음 탭으로 전환
* `gT` - 이전 탭으로 전환
* `:vs` - 윈도우 수직 분할
* `:sp` - 윈도우 수평 분할
* `Ctrl-w Ctrl-w` - 분할된 윈도우 포커싱 전환
* `Ctrl-o` - 돌아가기

## Substitute

* `:s/old/new` - 현재 라인의 첫 `old` 문자열을 `new`로 치환
* `:s/old/new/g` - 현재 라인의 모든 `old` 문자열을 `new`로 치환
* `:%s/old/new` - 문서 전체의 첫 `old` 문자열을 `new`로 치환
* `:%s/old/new/g` - 문서 전체의 모든 `old` 문자열을 `new`로 치환


## References

* ["VIM Tutor Version 1.7", GitHub, 2019.](https://github.com/vim/vim/blob/4c92e75dd4ddb68dd92a86dd02d53c70dd4af33a/runtime/tutor/tutor)
* [Richard, "Vim Cheat Sheet", rtorr.com.](https://vim.rtorr.com/)
* [변정훈, "Vim 단축키 정리", Outsider's Dev Story, 2010.](https://blog.outsider.ne.kr/540)