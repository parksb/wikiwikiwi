# 부동소수점

* 다양한 방식으로 소수를 표현할 수 있어서 IEEE 표준을 정함. (IEEE 754-1985)
* '부동소수점'의 '부동'은 不動이 아니라 'Floating'이다.
  * ['둥둥소수점'을 쓰자!](https://twitter.com/search?q=%EB%91%A5%EB%91%A5%EC%86%8C%EC%88%98%EC%A0%90)

## 부동소수점 인코딩

* 정규화된 표현: $+1.xxx \dots x_{two} \times 2^{yyy \dots y}$
* 32-bit word를 3개의 필드로 나누면:
  ```
  | S | Exponent | Mantissa (fraction |
  31  30         23                   0
  ```
  * Sign (1 bit): `1` is negative, `0` positive
  * Exponent (8 bit): $y$
  * Mantissa (23 bit): $x$
* Exponent 필드에는 biased notation을 사용한다:
  * $2^1, \text{Exponent} = 1 + 127 = 128 = 1000 \ 0000_{two}$
  * $2^{127}, \text{Exponent} = 127 + 127 = 254 = 1111 \ 1110_{two}$
* 그래서 정리하면: $(-1)^S \times (1.\text{Mantissa}) \times 2^{(\text{Exponent} - 127)}$
  * $2003.0 = 0111 \ 1101 \ 0011_{two} = (-1)^0 \times 1.1111010011 \times 2^10$
    * $S = 0$
    * $\text{Exponent} = E + \text{Bias} = 10 + 127 = 137 = 1000 \ 1001_{two}$
    * $\text{Mantissa} = 1111010011 = 111 \ 1010 \ 0110 \ 0000 \ 0000 \ 0000_{two}$
    * $2003.0 = 0 \ 10001001 \ 11110100110000000000000_{two}$
* `0`을 표현할 수 없어서 Exponent와 Mantissa가 모두 0이면 0으로 특수하게 취급.

## Binary FP to Decimal

```
0 | 0110 1000 | 101 0101 0100 0011 0100 0010
```

* Sign: $0$이므로 positive
* Exponent: $0110 \ 1000_{two} = 104_{ten}$
  * Bias adjustment: $\text{Exponent} - 127 = 104 - 127 = -23$
* Mantissa: $1.10101010100001101000010$ (첫 자리가 `1`이므로 정규화된 표현)

$$
\begin{aligned}
1.10101010100001101000010 &= 1 + (1 \times 2^{-1}) + (0 \times 2^{-2}) + (1 \times 2^{-3}) + (0 \times 2^{-4}) + \dots \\
&=1 + 2^{-1} + 2^{-3} + 2^{-5} + 2^{-7} + 2^{-9} + 2^{-14} + 2^{-15} + 2^{-17} + 2^{-22} \\
&=1.0 + 0.666115
\end{aligned}
$$

$$
\text{Mantissa} \times 2^{Bias} = 1.666115_{ten} \times 2^{-23} \approx 1.986 \times 10^{-7}
$$

## 부동소수점 오류

* 무한 소수가 되는 2진 분수를 정확히 표현하지 않고 10진수 근삿값으로 표현한다.[^winterjung]
* 따라서 실제 값과 오차가 발생한다. 실수는 동등 연산(`==`)으로 비교하면 안된다.
* `round()` 등의 함수로 미리 소수를 가공한 뒤 연산하자.

## 참고자료

* [[computer-organization-and-design]]
* [Floating Point Math.](https://0.30000000000000004.com/)

[^winterjung]: [정겨울, "파이썬에서 부동소수점 오차 해결하기", 2020.](https://blog.winterjung.dev/2020/01/06/floating-point-in-python)
