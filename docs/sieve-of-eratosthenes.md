# 에라토스테네스의 체

```py
xs = [0, 0] + list(range(2, N + 1))

# N = a * b를 만족하는 a와 b가 모두 sqrt(N)보다 클 수는 없다.
# e.g., N=100이라면 10까지만 확인하면 됨.
for i in range(2, int(sqrt(N)) + 1)
    if xs[i] == 0: continue
    # xs[i]의 배수를 모두 지운다.
    for j in range(i + i, N + 1, i):
        xs[j] = 0
```
