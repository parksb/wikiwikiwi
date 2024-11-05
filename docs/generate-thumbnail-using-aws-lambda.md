# AWS Lambda로 썸네일 생성하기

## Traditional way

* 상품이 연동되면 바로 썸네일을 만들어 S3에 올리는 방식.
* 히트율이 낮다면 불필요하게 공간을 차지할 수 있음.
* UI 개편으로 썸네일 크기가 변경되면 기존 썸네일을 모두 새로 생성해야 한다.
* 하지만 간단하게 구현할 수 있다.

## Lambda@Edge

* 클라이언트가 요청하면 실시간으로 이미지를 리사이징해 제공하는 방식.
* cdn에 이미지가 캐싱되기 전에는 리사이징 딜레이가 발생. (100ms → 500ms 정도?)
* CloudFront의 origin-response와 viewer-request에 람다 함수를 연결한다.

![image generation workflow](https://user-images.githubusercontent.com/6410412/63613436-c13e1a00-c61b-11e9-82fc-8319469cb410.png)

* 클라이언트가 CloudFront에 이미지를 요청하면 CloudFront는 캐시된 썸네일이 있는지 체크한다.
* 썸네일이 있으면 그대로 응답하고, 없으면 S3에서 이미지를 가져와 리사이징한다.
* S3에 원본 이미지가 올라가 있어야 한다.

## 방금 갑자기 생각난 방법

* 사용자가 이미지를 요청하면 CloudFront는 캐시된 썸네일이 있는지 체크한다.
* 이미지가 있으면 그대로 응답, 없으면 S3에 해당 이미지가 있는지 확인한다.
* S3에 이미지가 있으면 리사이징해 응답하고, 없으면 S3에 등록한 뒤 리사이징해 응답한다.
* S3에 불필요한 이미지를 업로드하지 않으니까 비용 절감 효과가 있다.
* 히트율이 높으면 그다지 메리트는 없을 것 같다.

## 참고자료

* [Jaiganesh Girinathan, "Resizing Images with Amazon CloudFront & Lambda@Edge", AWS CDN Blog, 2018.](https://aws.amazon.com/ko/blogs/networking-and-content-delivery/resizing-images-with-amazon-cloudfront-lambdaedge-aws-cdn-blog/)
* [seapy, "AWS Lambda를 이용한 이미지 썸네일 생성 개발 후기", 당근마켓 팀블로그, 2016.](https://medium.com/daangn/aws-lambda%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%83%9D%EC%84%B1-%EA%B0%9C%EB%B0%9C-%ED%9B%84%EA%B8%B0-acc278d49980)
* [Marco, "AWS Lambda@Edge에서 실시간 이미지 리사이즈 & WebP 형식으로 변환", 당근마켓 팀블로그, 2019.](https://medium.com/daangn/lambda-edge%EB%A1%9C-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-on-the-fly-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%A6%AC%EC%82%AC%EC%9D%B4%EC%A7%95-f4e5052d49f3)
* [Myung-Bo Kim, "서버 비용을 70%나 줄인 온디맨드 리사이징 이야기", VCNC Engineering, 2016.](http://engineering.vcnc.co.kr/2016/05/ondemand-image-resizing/)
* [Jinho Hong, "Lambda 한개로 만드는 On-demand Image Resizing", Huiseoul Engineering, 2018.](https://engineering.huiseoul.com/lambda-%ED%95%9C%EA%B0%9C%EB%A1%9C-%EB%A7%8C%EB%93%9C%EB%8A%94-on-demand-image-resizing-d48167cc1c31)
* [최준승, "Lambda@Edge를 활용한 이미지 리사이즈 자동화", WiseN, 2018.](https://blog.wisen.co.kr/?p=7258)
