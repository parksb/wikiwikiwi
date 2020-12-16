# GitHub GPG 키 업데이트하는 방법

1. GitHub에 등록한 GPG 키가 만료된 경우 서명한 커밋에 'Unverified' 뱃지가 보여진다.
1. 키 목록을 확인한다.
    ```sh
    $ gpg -k
	pub   rsa2048 2019-12-29 [SC] [expires: 2021-10-25]
      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    uid           [ultimate] Park Seong Beom <parkgds@gmail.com>
    ```
1. 갱신할 키를 수정하기 위한 프롬프트로 진입한다.
    ```sh
    $ gpg --edit-key parkgds@gmail.com
    ```
1. `expire` 명령을 실행하고 연장할 기간을 선택한다.
    ```sh
    gpg> expire
    Changing expiration time for the primary key.
    Please specify how long the key should be valid.
             0 = key does not expire
          <n>  = key expires in n days
          <n>w = key expires in n weeks
          <n>m = key expires in n months
          <n>y = key expires in n years
    Key is valid for? (0) 1y
    Key expires at Mon 10/25 23:29:41 2020 KST
    Is this correct? (y/N) y
    ```
1. `save` 명령으로 저장한다.
    ```sh
    gpg> save
    ```
1. 퍼블릭 키를 복사한다.
    ```sh
	$ gpg --export --armor XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
	-----BEGIN PGP PUBLIC KEY BLOCK-----
	...
	-----END PGP PUBLIC KEY BLOCK-----
	```
1. GitHub에서 기존의 만료된 키를 제거한다. (https://github.com/settings/keys)
1. `New GPG Key` 버튼을 눌러 복사한 퍼블릭 키를 붙여넣고 저장한다.