# 동기 처리

## Race condition

* 여러 프로세스가 동시에 공유하는 자원에 접근함에 따라 일어나는 예상치 않은 이상이나 상태.
* 공유 메모리상에 있는 변수를 여러 프로세스가 증가시키는 상황:
  1. P1이 공유 변수 v의 값 1을 읽는다.
  2. 직후 P2가 v의 값 1을 읽는다.
  3. 이어서 P1이 v의 값 1에 1을 더해 2를 쓴다.
  4. P2도 v의 값 1에 1을 더해 2를 쓴다.
* 레이스 컨디션을 일으키는 코드 영역을 크리티컬 섹션(critical section)이라고 한다.

## Atomic operation

* 불가분한(더 이상 쪼갤 수 없는) 처리 단위.
* 엄밀히는 프로세서의 덧셈, 곱셈 명령도 아토믹 처리이지만, 일반적으로 여러 번의 메모리 접근이 필요한 처리를 말한다.
* 어떤 처리가 아토믹하다: 해당 처리 도중 상태는 시스템적으로 관측할 수 없고, 처리가 실패하면 처리 전 상태로 복원된다.

### Compare and Swap (CAS)

```c
bool compare_and_swap(uint64_t *p, uint64_t val, uint64_t newval) {
    if (*p != val) {
        return false;
    }

    *p = newval;
    return true;
}
```

* 메모리 위치의 값(`*p`)과 주어진 값(`val`)을 비교해 두 값이 같은 경우에만 메모리 위치의 값을 변경하는 아토믹 처리.
* 그런데 이 코드는 아토믹하지 않다. L2(`if (*p != val)`)는 L5(`*p = newval`)와 별도로 실행될 수 있다.
* x86 어셈블리 코드로 컴파일하면 다음과 같다.

```x86
    cmpq %rsi, (%rdi) ; rsi 레지스터의 값과 rdi 레지스터가 가리키는 값을 비교한다.
    jne LBB0_1        ; 비교 결과가 같지 않으면 LBB0_1 라벨로 점프한다.
    movq %rdx, (%rdi)
    movl $1, %eax
    retq              ; 1을 반환한다.
LBB0_1:
    xorl %eax, %eax   ; eax 레지스터 값을 0으로 설정한다.
    retq              ; 0을 반환한다.
```

* gcc, clang 같은 컴파일러는 아토믹 처리를 위한 내장 함수 `__sync_bool_compare_and_swap`을 제공한다.

```c
bool compare_and_swap(uint64_t *p, uint64_t val, uint64_t newval) {
    return __sync_bool_compare_and_swap(p, val, newval);
}
```

* 앞서 정의한 `compare_and_swap`과 의미는 똑같지만, 어셈블리 코드로는 다르게 컴파일된다.

```x86
movq %rsi, %rax            ; rsi 레지스터 값을 rax 레지스터로 복사한다.
xorl %ecx, %ecx            ; ecx 레지스터 값을 0으로 초기화한다.
lock cmpxchgq %rdx, (%rdi) ; lock 접두사를 이용해 아토믹하게 값을 비교, 교환한다.
sete %cl
movl %ecx, %eax
retq
```

### Test and Set (TAS)

```c
bool test_and_set(bool *p) {
    if (*p) {
        return true;
    }

    *p = true;
    return false;
}
```

* 메모리 위치의 값(`*p`)이 `true`인 경우 `true`를 반환하고, `false`인 경우 `true`로 변경한 뒤 `false`를 반환하는 아토믹 처리.
* CAS와 마찬가지로 아토믹하게 실행하기 위한 내장 함수 `__sync_lock_test_and_set`을 제공한다.

```c
bool test_and_set(bool *p) {
    return __sync_lock_test_and_set(bool *p);
}
```

### Load-Link / Store-Conditional (LL/SC)

* x86, x86-64에서는 `lock` 접두사로 메모리 락을 걸었지만, ARM, RISC-V 등의 CPU에서는 LL/SC 명령으로 아토믹 처리를 구현한다.
* Load-Link (LL): 메모리 읽기를 배타적으로 수행한다.
* Store-Conditional (SC): 메모리 쓰기. LL 명령으로 지정한 메모리로의 쓰기는 다른 프로세스가 침범하지 않은 경우에만 성공한다.
* 공유 메모리상에 있는 변수를 여러 프로세스가 증가시키는 상황:
  1. P1이 공유 변수 v의 값 1을 LL 명령으로 읽는다.
  2. 직후 P2가 v의 값 1을 read 명령으로 읽는다.
  3. 이어서 P2가 v의 값 1에 1을 더해 write 명령으로 2를 쓴다.
  4. P1이 v의 값 1에 1을 더해 SC 명령으로 2를 쓰지만 실패한다. (LL 명령과 SC 명령 사이에 v로의 쓰기가 발생했기 때문)

## Mutual execution (Mutex)

* 크리티컬 섹션을 실행할 수 있는 프로세스 수를 1개로 제한하는 동기 처리.
* 공유 변수 `lock`을 플래그로 이용해 크리티컬 섹션이 점유되어 있는지 판단한다.

```c
bool lock = false;

void do_something() {
retry:
    if (!test_and_set(&lock)) { // 락이 걸려있는지 확인하고, 락을 얻는다.
        // critical section
    } else {
        goto retry; // 락이 걸려있다면 재시도한다.
    }

    tas_release(&lock); // 락을 해제한다.
}
```

* `lock`을 검사할 때 TAS를 사용하지 않으면 여러 프로세스가 동시에 락을 획득할 위험이 있다.
* 위 코드처럼 락을 얻을 수 있는지 반복하며 확인하는 것을 스핀락(spinlock)이라고 한다.

```c
void spinlock_aquire(volatile bool *lock) add{
    while(1) {
        while(*lock);
        if (!test_and_set(lock)) {
            break;
        }
    }
}

void spinlock_release(bool *lock) {
    tas_release(lock);
}
```

* TAS 전에 락이 `false`가 될 때까지 루프를 도는 것을 TTAS(Test and Test and Set)이라고 한다. 이렇게 하면 불필요한 아토믹 명령 수행을 줄일 수 있다. 아토믹 명령은 성능 패널티가 크다.
* 스핀락은 락을 획득할 수 있을 때까지 루프를 돌며 CPU 리소스를 소비하기 때문에 락을 얻지 못하면 다른 프로세스로 컨텍스트 스위칭하는 식으로 최적화하기도 한다.
* 하지만 애플리케이션 레벨에서 OS 스케줄링을 제어하기 어렵기 때문에 스핀락만을 사용하는 것은 권장하지 않는다.

## Semaphore

* 뮤텍스로는 락을 최대 1개 프로세스까지 허용하지만, 세마포어는 N개 프로세스가 동시에 락을 획득할 수 있다.
* 물리적인 계산 리소스 이용에 제한을 적용하고 싶은 경우 사용할 수 있다.

### 스핀락 기반 세마포어 구현

```c
#define NUM 4

void semaphore_acquire(volatile int *cnt) { // 락을 얻은 프로세스 수를 의미하는 공유 변수 포인터를 받는다.
    while (1) {
        while (*cnt >= NUM); // 락을 얻은 프로세스가 NUM 이상이면 스핀하며 대기한다.
        __sync_fetch_and_add(cnt, 1); // NUM 미만이면 값을 아토믹하게 증가한다.
        if (*cnt <= NUM) { // 증가한 공유 변수 값이 NUM 이하라면 루프를 벗어나 락을 얻는다.
            break;
        }
        __sync_fetch_and_sub(cnt, 1); // 증가한 공유 변수 값이 NUM을 초과하면 다시 시도한다.
    }
}

void semaphore_release(int *cnt) {
    __sync_fetch_and_sub(cnt, 1);
}
```

```c
int cnt = 0;

void do_something() {
    while (1) {
        semaphore_acquire(&cnt);
        // critical section
        semaphore_release(&cnt);
    }
}
```

### 러스트 세마포어 구현

```rust
use std::sync::{Condvar, Mutex};

pub struct Semaphore {
    mutex: Mutex<isize>,
    cond: Condvar,
    max: isize, // 동시에 락을 획득할 수 있는 프로세스 최대 수
}

impl Semaphore {
    pub fn new(max: iszie) -> Self {
        Semaphore {
            mutex: Mutex::new(0),
            cond: Condvar::new(),
            max,
        }
    }

    pub fn wait(&self) {
        let mut cnt = self.mutex.lock().unwrap();
        while *cnt >= self.max { // 락을 획득한 프로세스가 이미 최대치라면 대기한다.
            cnt = self.cond.wait(cnt).unwrap();
        }
        *cnt += 1; // 락을 획득할 수 있으면 카운터를 증가하고 크리티컬 섹션으로 진입한다.
    }

    pub fn post(&self) {
        let mut cnt = self.mutex.lock().unwrap();
        *cnt -= 1;
        if *cnt <= self.max {
            self.cond.notify_one();
        }
    }
}
```

```rust
use semaphore::Semaphore;
use std::sync::atomic::{AtomicUsize, Ordering}
use std::sync::Arc;

const NUM_LOOP: usize = 100000;
const NUM_THREADS: usize = 8;
const SEM_NUM: isize = 4;

static mut CNT: AtomicUsize = AtomicUsize::new(0);

fn main() {
    let mut v = Vec::new();
    let sem = Arc::new(Semaphore::new(SEM_NUM)); // SEM_NUM만큼 동시 실행 가능한 세마포어

    for i in 0..NUM_THREADS {
        let s = sem.clone();

        let t  = std::thread::spawn(move || {
            for _ in 0..NUM_LOOP {
                s.wait();

                unsafe { CNT.fetch_add(1, Ordering::SeqCst) };
                let n = unsafe { CNT.load(Ordering::SeqCst) };
                assert!((n as isize) <= SEM_NUM);
                unsafe { CNT.fetch_sub(1, Ordering::SeqCst) };

                s.post();
            }
        });

        v.push(t);
    }

    for t in v {
        t.join().unwrap();
    }
}
```

* `std::sync::Arc`: Atomically Reference Counted
  * 스레드 세이프한 레퍼런스 카운팅 포인터. `Rc` 타입과 다르게 아토믹하게 명령을 수행한다.
  * `Arc<T>` 타입은 타입 `T`의 값에 대한 공유된 오너십을 제공한다. (힙 메모리에 할당된다.)
  * `clone`을 호출하면 같은 힙 메모리 주소를 가리키는 새로운 `Arc` 인스턴스를 만들어낸다:
    ```rust
    let foo = Arc::new(vec![1.0, 2.0, 3.0]);

    let a = foo.clone();
    let b = Arc::clone(&foo); // `foo.clone()`과 동일하다.

    // `a`, `b`, `foo`는 모두 같은 메모리 주소를 가리키는 `Arc` 인스턴스다.
    ```
  * 스레드 사이에 데이터를 공유하고 싶을 때 `Arc`를 사용한다:
    ```rust
    let apple = Arc::new("the same apple");

    for _ in 0..10 {
        let apple = Arc::clone(&apple);

        thread::spawn(move || {
            println!("{:?}", apple);
        });
    }
    ```
* `Rc` 타입에 대한 자세한 내용은 [[trpl-smart-pointers]] 참고.

## Barrier synchronization

* 특정 지점에 도달한 프로세스가 N개 이상일 때 배리어를 벗어나 동기 처리를 수행하는 기법.

### 스핀락 기반 배리어 동기 구현

```c
void barrier(volatile int *cnt, int max) { // 프로세스 수와 임계값을 받는다.
    __sync_fetch_and_add(cnt, 1);
    while (*cnt < max); // 프로세스 수가 max가 될 때까지 대기한다.
}
```

```c
volatile int num = 0;

void *worker(void *arg) {
    barrier(&num, 10); // 모든 스레드가 이 지점에 도달할 때까지 기다린다.
    // critical section
    return NULL;
}

int main(int argc, char *argv[]) {
    pthread_t th[10];

    for (int i = 0; i < 10; i++) {
        if (pthread_create(&th[i], NULL, worker, NULL) != 0) {
            perror("pthread_create"); return -1;
        }
    }

    return 0;
}
```

* 스핀락으로 구현하면 불필요하게 루프를 돌아야 하므로 실제로는 Pthreads의 조건 변수를 이용한다.

### 러스트에서 배리어 동기 사용

```rust
use std::sync::{Arc, Barrier};
use std::thread;

fn main() {
    let mut v = Vec::new(); // 스레드 핸들러 벡터
    let barrier = Arc::new(Barrier::new(10)); // 10 스레드만큼의 배리어 동기

    for _ in 0..10 {
        let b  = barrier.clone();
        let th = thread::spawan(move || {
            b.wait(); // 스레드 10개가 이 지점에 도달할 때까지 대기
            println!("finished barrier");
        });
        v.push(th);
    }

    for th in v {
        th..join().unwrap()
    }
}
```

## Readers-Writer Lock (RW Lock)

* 레이스 컨디션이 발생하는 이유는 쓰기 때문이며, 쓰기만 배타적으로 수행하면 문제가 발생하지 않는다.
* RW 락은 읽기만 수행하는 프로세스와 쓰기만 수행하는 프로세스를 분류하고 다음 제약을 만족하도록 배타 제어를 수행한다:
  * 락을 획등 중인 reader는 같은 시각에 0개 이상 존재할 수 있다.
  * 락을 획득 중인 writer는 같은 시각에 1개만 존재할 수 있다.
  * reader와 writer는 같은 시각에 락 획득 상태가 될 수 없다.

### 스핀락 기반 RW 락 구현

```c
void rwloack_read_acquire(int *rcnt, volatile int *wcnt) {
    while (1) {
        while (*wcnt); // writer가 있으면 대기한다.
        __sync_fetch_and_add(rcnt, 1);
        if (*wcnt == 0) { // writer가 없으면 락을 획득한다.
            break;
        }
        __sync_fetch_and_sub(rcnt, 1)
    }
}

void rwlock_read_release(int *rcnt) {
    __sync_fetch_and_sub(rcnt, 1);
}

void rwlock_write_acquire(bool *lock, volatile int *rcnt, int *wcnt) {
    __sync_fetch_and_add(wcnt, 1);
    while (*rcnt); // reader가 있으면 대기한다.
    spinlock_acquire(lock);
}

void rwlock_write_release(bool *lock, int *wcnt) {
    spinlock_release(lock);
    __sync_fetch_and_sub(wcnt, 1);
}
```

```c
int rcnt = 0;
int wcnt = 0;
bool lock = false;

void reader() {
    while (1) {
        rwlock_read_acquire(&rcnt, &wcnt);
        // critical section (read only)
        rwlock_read_release(&rcnt);
    }
}

void writer() {
    while (1) {
        rwlock_write_acquire(&lock, &rcnt, &wcnt);
        // critical section (write only)
        rwlock_write_release(&lock, &wcnt);
    }
}
```

### 러스트에서 RW 락 사용

```rust
use std::sync::RwLock;

fn main() {
    let lock = RwLock::new(10);

    {
        // 이뮤터블한 참조(reader)를 얻는다.
        let v1 = lock.read().unwrap();
        let v2 = lock.read().unwrap();
        println!("{} {}", v1, v2); // 읽기 동작
    }

    {
        v = lock.write().unwrap(); // 뮤터블한 참조(writer)를 얻는다.
        *v = 7; // 쓰기 동작
        println!("{}", v); // 읽기 동작
    }
}
```
