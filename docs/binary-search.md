# 이분탐색

정렬된 원소 중 특정 원소를 찾는 알고리즘. 정렬된 리스트 `A`에서 `x`를 찾는다고 해보자. 쉽게 생각할 수 있는 방법은 하나씩 살펴보는 선형탐색이다.

```py
def linear_search(A: list[int], x: int):
    for i in range(len(A)):
        if A[i] == x:
          return i
    return None
```

하지만 이렇게 하면 최악의 경우 `len(A)`번 비교가 필요하다. 대신 이분탐색을 해보자.

```py
def binary_search(A: list[int], x: int):
    l, r = 0, len(A) - 1
    while l <= r:
        mid = (l + r) // 2
        if A[mid] == x:
            return mid
        elif A[mid] < x:
            l = mid + 1
        else:
            r = mid - 1
    return None
```

핵심은 값이 존재할 수 있는 구간을 절반씩 줄여나간다는 점이다. `mid`를 중심으로 한쪽에는 `x`가 존재하고, 다른 한쪽에는 `x`가 존재하지 않는다는 것을 알 수 있기 때문이다.

여기서 `check` 함수를 정의할 수 있다. `check` 함수는 구간 `[l, r]`에서 찾고자 하는 자연수 `x`에 대해, `x`보다 작거나 같은 자연수에 대해서는 `true`를, `x`보다 큰 자연수에 대해서는 `false`를 반환한다. 앞서 본 예시에서 `check` 함수는 `A[mid] < x`였다.

## 구현

### 닫힌 구간 탐색

```py
while l <= r:
    mid = (l + r) // 2
    if check(mid):
        l = mid + 1
    else:
        r = mid - 1
return r
```

탐색하고자 하는 구간이 `[L, R]`이라면, 탐색이 끝났을 때는 `[L, r]`이 `true`인 구간이 되고, `[l, R]`은 `false`인 구간이 되어야 한다. 이때 `l == r + 1`이다.

### 반열린 구간 탐색

```py
while l < r:
    mid = (l + r) // 2
    if check(mid):
        l = mid + 1
    else:
        r = mid
return # 문제 조건에 따라 l 또는 l - 1을 반환
```

탐색하고자 하는 구간이 `[L, R)`이라면, 탐색이 끝났을 때는 `[L, r)`이 `true`인 구간이 되고, `[l, R)`은 `false`인 구간이 되어야 한다. 이때 `l == r`이다.

길이가 `N`인 배열에서 값을 찾는다면 `[0, N - 1]`보다는 `[0, N)`이 더 직관적일수도.
