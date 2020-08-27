# How to distribute npm package

* 타입스크립트로 더 캠프 라이브러리를 만들었다: [the-cmap-lib](https://github.com/ParkSB/the-camp-lib)
* 하루 서버에서 돌리려고 npm에도 배포했는데 생각대로 동작하지 않았다.
* parcel로 번들링하는게 적절한 선택이 아니었다. parcel을 지우고 tsc로 컴파일했다. dist 디렉토리 아래에 빌드된 파일들이 생겼다.
* 안 보이던 타입 에러들이 쏟아졌다. 모두 수습하고 example 디렉토리에서 `npm install ../../`해서 테스트해봤다.
* 이젠 잘 됐다. 번들링이 필요할 것 같기는한데 parcel은 entry를 지정해도 잘 되지 않았다. tsc로 컴파일한 다음에 번들링을 해야했나?
* 그 와중에 루트 디렉토리랑 example 디렉토리를 헷갈려서 .env 파일이 올라가는 참사가 일어났다. npm unpublish로 급하게 내렸다. 그랬더니 24시간 뒤에 다시 republish할 수 있다고....

## References

* ["npm-unpublish", npm Documentation.](https://docs.npmjs.com/cli/unpublish)
* [Reid Lee, "[번역] TypeScript로 NPM 모듈을 만들어 배포하기", ull.im, 2018.](https://blog.ull.im/engineering/2018/12/23/how-to-create-and-publish-npm-module-in-typescript.html)
