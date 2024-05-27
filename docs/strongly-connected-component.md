# Strongly Connected Component

- 연결(connectedness):
  - 그래프 $G$의 모든 정점쌍에 대해, 경로가 있다면 $G$는 연결되어 있다.
  - 즉, 임의의 한 정점에서 다른 모든 정점으로의 경로가 존재한다면 연결되어 있다.
- 연결요소(connected component):
  ![](./images/connected-components.png)
  - 최대로 연결된 부분그래프. (A maximal connected subgraph)
- 강한 연결(strongly connectivity):
  ![](./images/strongly-connected-components.png)
  - 유향 그래프 $G$의 모든 정점쌍에 대해 양방향으로 경로가 존재한다면 $G$는 강하게 연결되어 있다.
  - 즉, 모든 정점쌍이 양방향으로 연결되어 정점쌍 사이에 사이클이 만들어지는 경우.
- 강한 연결요소(strongly connected component)
  ![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Scc-1.svg/220px-Scc-1.svg.png)
  - 최대로 강하게 연결된 부분그래프. (A maximal strongly connected subgraph)
  - 어떤 강한 연결을 가진 부분그래프보다 더 큰 강한 연결을 가진 부분그래프가 없는 경우.
  - 정점 하나가 SCC가 될 수 있다.
- 문제: https://www.acmicpc.net/problem/2150

## Kosaraju's algorithm

```python
def kosaraju(G):
    stack = []
    visited = [False] * len(G)

    def dfs(u, S):
       visited[u] = True
       for v in G[u]:
           if not visited[v]:
               dfs(v)
       S.append(u)

    for u in range(len(G)):
       visited[u] = True
       if not visited[u]:
           dfs(u)

    def dfs_R(v, S):
       S.append(v)
       for u in G[v]:
           if not visited[u]:
               visited[u] = True
               dfs_R(u, S)

    visited = [False] * N
    sccs = []
    while stack:
        u = stack.pop()
        if not visited[u]:
            visited[u] = True
            scc = []
            dfs_R(u, scc)
            sccs.append(scc)
```

- 시간복잡도(인접리스트): $O(|V| + |E|)$
- 시간복잡도(인접행렬): $O(|V|^2)$

## Tarjan's algorithm

```python
def tarjan(G):
    stack = []
    onstack = [False] * (V + 1)

    sccs = []
    lowlink = [0] * (V + 1)
    idxs = [-1] * (V + 1)
    idx = 0

    def dfs(u):
        nonlocal idx
        idx += 1

        idxs[u] = lowlink[u] = idx
        stack.append(u)
        onstack[u] = True

        for v in G[u]:
            if idxs[v] == -1:
                dfs(v)
                lowlink[u] = min(lowlink[u], lowlink[v])
            elif onstack[v]:
                lowlink[u] = min(lowlink[u], idxs[v])

        if idxs[u] == lowlink[u]:
            scc = []
            w = -1
            while u != w:
                w = stack.pop()
                scc.append(w)
                onstack[w] = False
            sccs.append(sorted(scc))

    for u in range(1, V + 1):
        if idxs[u] == -1:
            dfs(u)

    return sccs
```

- 시간복잡도: $O(|V|+|E|)$

## Path-based algorithm

```python
def path_based(G):
    S = []
    B = []

    I = [0] * (V + 1)
    c = V

    def dfs(v):
        S.append(v)
        I[v] = S.top()
        B.append(I[v])

        for w in G[v]:
            if I[w] == 0:
                dfs(w)
            else:
                while I[w] < B.top():
                    B.pop()

        if I[v] == B.top():
            B.pop()
            c += 1
            while I[v] <= S.top():
                I[S.pop()] = c

    for v in range(1, V + 1):
        if I[v] == 0:
            dfs(v)
```

- 스택 `S`는 현재 컴포넌트의 정점을 추적하고, `B`는 현재 경로를 추적한다.
- https://www.cs.princeton.edu/courses/archive/spr04/cos423/handouts/path%20based...pdf

## Reachability-based algorithm

- DCSC: Divide-and-Conquer Strong Components
- 병렬 처리를 위해 DFS 대신 분할정복을 사용하는 알고리즘.
- 랜덤하게 시작 정점을 선택하고, 그 정점에서 이어지는 정점들과의 교집합을 찾으면 SCC를 구성한다.
- https://citeseerx.ist.psu.edu/document?repid=rep1&type=pdf&doi=4190183d58ff310dc61e833651c4147ef0dfc487
