/**
 * RXJS INTERVIEW QUESTIONS
 * Front-end Interview Series
 */

// ============================================
// QUESTION 1: Observables vs Promises
// ============================================
/*
QUESTION:
Explain the differences between Observables and Promises.
Create examples showing when to use each.

KEY DIFFERENCES:
*/

// PROMISES - Single value
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve('Hello'), 1000);
});

promise.then(value => console.log(value)); // Logs once

// OBSERVABLES - Multiple values over time
import { Observable, interval } from 'rxjs';

const observable = new Observable(subscriber => {
  let count = 0;
  const intervalId = setInterval(() => {
    subscriber.next(count++);
    if (count > 5) subscriber.complete();
  }, 1000);
  
  // Cleanup function
  return () => clearInterval(intervalId);
});

observable.subscribe(value => console.log(value)); // Logs multiple times

/*
COMPARISON:

PROMISES:
✓ Single value only
✓ Eager (executes immediately)
✓ Not cancellable
✓ Built-in error handling
✓ Simple for one-time operations

OBSERVABLES:
✓ Multiple values over time (streams)
✓ Lazy (executes when subscribed)
✓ Cancellable (unsubscribe)
✓ Rich operator ecosystem
✓ Complex async scenarios
✓ Better for event handling

EVALUATION CRITERIA:
✓ Explains key differences clearly
✓ Shows eager vs lazy execution
✓ Single vs multiple values
✓ Cancellation patterns
✓ Real-world use cases for each
✓ Practical examples
*/


// ============================================
// QUESTION 2: Creating Observables
// ============================================
/*
QUESTION:
Demonstrate different ways to create observables.
Show: from(), of(), interval(), timer(), create()
*/

// 1. from() - Convert array/promise/iterable to observable
import { from } from 'rxjs';

const array = [1, 2, 3, 4, 5];
from(array).subscribe(item => console.log(item)); // 1, 2, 3, 4, 5

const promise2 = Promise.resolve({ id: 1, name: 'John' });
from(promise2).subscribe(data => console.log(data));

// 2. of() - Emit specific values
import { of } from 'rxjs';

of(1, 2, 3).subscribe(value => console.log(value)); // 1, 2, 3

// 3. interval() - Emit values at regular intervals
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

interval(1000)
  .pipe(take(5))
  .subscribe(value => console.log(value)); // 0, 1, 2, 3, 4

// 4. timer() - Emit after delay or at intervals
import { timer } from 'rxjs';

timer(2000).subscribe(() => console.log('After 2 seconds'));
timer(1000, 2000).subscribe(value => console.log(value)); // Start at 1s, repeat every 2s

// 5. create() - Manual creation with complete control
import { Observable } from 'rxjs';

const customObservable = new Observable(subscriber => {
  subscriber.next('Hello');
  subscriber.next('RxJS');
  subscriber.complete();
});

customObservable.subscribe(
  value => console.log('Next:', value),
  error => console.error('Error:', error),
  () => console.log('Completed')
);

// 6. NEVER, EMPTY, THROW
import { NEVER, EMPTY, throwError } from 'rxjs';

NEVER.subscribe(); // Never emits or completes
EMPTY.subscribe(() => {}, () => {}, () => console.log('Done')); // Just completes
throwError(() => new Error('Oops')).subscribe(
  () => {},
  error => console.error(error)
);

/*
EVALUATION CRITERIA:
✓ Knows various creation methods
✓ Understands difference between from() and of()
✓ interval() and timer() usage
✓ Custom observable creation
✓ Subscription handling
✓ Complete, error, next observers
*/


// ============================================
// QUESTION 3: RxJS Operators - Transformation
// ============================================
/*
QUESTION:
Explain and demonstrate transformation operators:
map, flatMap/mergeMap, switchMap, concatMap, scan
*/

import { map, mergeMap, switchMap, concatMap, scan, filter } from 'rxjs/operators';

// 1. map() - Transform each emitted value
of(1, 2, 3).pipe(
  map(x => x * 2)
).subscribe(value => console.log(value)); // 2, 4, 6

// 2. mergeMap() - Subscribe to inner observable, all run parallel
of(1, 2, 3).pipe(
  mergeMap(x => interval(1000).pipe(take(3)))
).subscribe(value => console.log(value)); // All emit in parallel

// 3. switchMap() - Cancel previous and switch to new observable
import { Subject } from 'rxjs';

const search$ = new Subject<string>();
search$.pipe(
  switchMap(term => {
    console.log('Fetching:', term);
    return interval(1000).pipe(take(3)); // Simulated API call
  })
).subscribe(value => console.log('Result:', value));

// User types fast - previous requests cancelled
search$.next('react');
setTimeout(() => search$.next('angular'), 500); // Cancels react search

// 4. concatMap() - Queue observables, one after another
of(1, 2, 3).pipe(
  concatMap(x => {
    return interval(500).pipe(take(2));
  })
).subscribe(value => console.log(value)); // Sequential execution

// 5. scan() - Accumulator like reduce but emits each intermediate value
of(1, 2, 3, 4, 5).pipe(
  scan((acc, x) => acc + x, 0)
).subscribe(value => console.log(value)); // 1, 3, 6, 10, 15

// Real-world example: Running total
interface CartItem {
  id: string;
  price: number;
}

const addToCart$ = new Subject<CartItem>();

addToCart$.pipe(
  scan((total, item) => total + item.price, 0)
).subscribe(total => console.log('Cart total:', total));

addToCart$.next({ id: '1', price: 10 });
addToCart$.next({ id: '2', price: 20 }); // Total: 30

/*
COMPARISON:
mergeMap: All requests run in parallel, results come in any order
switchMap: Cancel previous, switch to new (best for search)
concatMap: Queue requests, process one at a time in order

EVALUATION CRITERIA:
✓ Correctly uses map()
✓ Understands mergeMap/flatMap
✓ Knows when to use switchMap (search scenarios)
✓ concatMap for sequential operations
✓ scan() for accumulators
✓ Real-world examples
*/


// ============================================
// QUESTION 4: RxJS Operators - Filtering
// ============================================
/*
QUESTION:
Demonstrate filtering operators:
filter, distinct, distinctUntilChanged, debounceTime, throttleTime, take, skip
*/

// 1. filter() - Only emit values that match condition
of(1, 2, 3, 4, 5).pipe(
  filter(x => x > 2)
).subscribe(value => console.log(value)); // 3, 4, 5

// 2. distinct() - Emit each unique value only once
of(1, 2, 2, 3, 1, 4).pipe(
  distinct()
).subscribe(value => console.log(value)); // 1, 2, 3, 4

// 3. distinctUntilChanged() - Don't emit consecutive duplicates
of(1, 1, 2, 2, 3, 3, 2).pipe(
  distinctUntilChanged()
).subscribe(value => console.log(value)); // 1, 2, 3, 2

// Custom comparison
interface User {
  id: string;
  name: string;
}

of(
  { id: '1', name: 'John' },
  { id: '1', name: 'John' },
  { id: '2', name: 'Jane' }
).pipe(
  distinctUntilChanged((prev, curr) => prev.id === curr.id)
).subscribe(user => console.log(user.name)); // John, Jane

// 4. debounceTime() - Wait for specified time before emitting
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const searchInput = document.getElementById('search') as HTMLInputElement;
fromEvent(searchInput, 'input').pipe(
  debounceTime(300),
  map((event: any) => event.target.value),
  distinctUntilChanged()
).subscribe(value => {
  console.log('Searching for:', value);
  // Make API call
});

// 5. throttleTime() - Emit at most once per specified time
fromEvent(document, 'scroll').pipe(
  throttleTime(1000)
).subscribe(() => {
  console.log('Scroll event');
});

// 6. take() - Take first N values then complete
of(1, 2, 3, 4, 5).pipe(
  take(3)
).subscribe(value => console.log(value)); // 1, 2, 3

// 7. skip() - Skip first N values
of(1, 2, 3, 4, 5).pipe(
  skip(2)
).subscribe(value => console.log(value)); // 3, 4, 5

// skipUntil() - Skip until another observable emits
const stop$ = new Subject<void>();
interval(100).pipe(
  skipUntil(stop$)
).subscribe(value => console.log(value));

setTimeout(() => stop$.next(), 250); // Stop after 250ms

// Real-world: Pagination
const loadMore$ = new Subject<void>();
const pageSize = 10;
let page = 0;

loadMore$.pipe(
  throttleTime(1000), // Prevent repeated clicks
  scan(acc => acc + 1, 0),
  switchMap(pageNum => {
    return fetchPage(pageNum * pageSize);
  })
).subscribe(items => console.log('Loaded:', items));

/*
EVALUATION CRITERIA:
✓ Proper filter syntax
✓ Understands distinct vs distinctUntilChanged
✓ debounceTime for input/search
✓ throttleTime for events
✓ take/skip basics
✓ Comparison combinations
✓ Real-world use cases
*/


// ============================================
// QUESTION 5: Combining Observables
// ============================================
/*
QUESTION:
Explain combining operators:
merge, concat, combineLatest, zip, withLatestFrom, forkJoin
*/

import { merge, concat, combineLatest, zip, withLatestFrom, forkJoin } from 'rxjs';

// 1. merge() - Combine multiple observables, emit in any order
const stream1$ = interval(1000).pipe(take(3));
const stream2$ = interval(1500).pipe(take(3));

merge(stream1$, stream2$).subscribe(value => {
  console.log('Merged:', value); // Values from both in chronological order
});

// 2. concat() - Combine sequentially, one after another
const source1$ = of(1, 2, 3);
const source2$ = of(4, 5, 6);

concat(source1$, source2$).subscribe(value => {
  console.log('Concatenated:', value); // 1, 2, 3, 4, 5, 6
});

// 3. combineLatest() - Emit latest values from all observables
const age$ = of(27, 25, 29);
const name$ = of('Alice', 'Bob', 'Charlie');

combineLatest([age$, name$]).subscribe(([age, name]) => {
  console.log(`${name} is ${age}`); // Emits when both have values
});

// Real-world: Form validation combining multiple fields
const firstName$ = new Subject<string>();
const lastName$ = new Subject<string>();
const email$ = new Subject<string>();

combineLatest([firstName$, lastName$, email$]).pipe(
  map(([first, last, email]) => ({
    full: `${first} ${last}`,
    email
  }))
).subscribe(user => {
  console.log('User:', user);
});

// 4. zip() - Combine values at same index
of(1, 2, 3).pipe(
  zip(of('a', 'b', 'c'))
).subscribe(([num, letter]) => {
  console.log(`${num}${letter}`); // 1a, 2b, 3c
});

// 5. withLatestFrom() - Emit when first observable emits, combined with latest from others
const clicks$ = fromEvent(document, 'click');
const timer$ = interval(1000);

clicks$.pipe(
  withLatestFrom(timer$),
  take(3)
).subscribe(([click, timerValue]) => {
  console.log(`Clicked at ${timerValue}s`);
});

// 6. forkJoin() - Like Promise.all, waits for all to complete
const user$ = of({ id: 1, name: 'John' });
const posts$ = of([{ id: 1, title: 'Post 1' }]);
const comments$ = of([{ id: 1, text: 'Comment' }]);

forkJoin([user$, posts$, comments$]).subscribe(([user, posts, comments]) => {
  console.log('All loaded:', { user, posts, comments });
});

// Real-world: Load dashboard data
forkJoin({
  user: fetchUser(),
  analytics: fetchAnalytics(),
  config: fetchConfig()
}).subscribe(({ user, analytics, config }) => {
  console.log('Dashboard ready');
});

/*
OPERATOR COMPARISON:
- merge: All emit, any order, continuous
- concat: Sequential, one at a time
- combineLatest: Latest from each, emits continuously
- zip: Pair by index, one-to-one mapping
- withLatestFrom: Main stream triggers, get latest from others
- forkJoin: Waits for all to complete, emits once

EVALUATION CRITERIA:
✓ Knows difference between merge/concat
✓ combineLatest with multiple sources
✓ zip for pairing values
✓ withLatestFrom usage
✓ forkJoin for parallel operations
✓ Real-world dashboard/form examples
*/


// ============================================
// QUESTION 6: Error Handling in RxJS
// ============================================
/*
QUESTION:
Demonstrate error handling operators:
catchError, retry, retryWhen, timeout, default
*/

import { catchError, retry, retryWhen, timeout, defaultIfEmpty } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

// 1. catchError() - Handle errors and recover
function fetchData(): Observable<any> {
  return throwError(() => new Error('API failed'));
}

fetchData().pipe(
  catchError(error => {
    console.error('Error caught:', error.message);
    return of({ default: true }); // Return fallback value
  })
).subscribe(data => console.log('Data:', data));

// 2. retry() - Retry failed observable N times
fetchData().pipe(
  retry(3) // Retry 3 times before failing
).subscribe(
  data => console.log('Success:', data),
  error => console.error('Finally failed:', error)
);

// 3. retryWhen() - Custom retry logic with exponential backoff
fetchData().pipe(
  retryWhen(errors => 
    errors.pipe(
      mergeMap((error, index) => {
        const retryCount = index + 1;
        if (retryCount > 3) {
          return throwError(() => error);
        }
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
        console.log(`Retry ${retryCount} after ${delay}ms`);
        return timer(delay);
      })
    )
  )
).subscribe(
  data => console.log('Success after retries:', data),
  error => console.error('Failed after all retries:', error)
);

// 4. timeout() - Complete if no emission within time
interval(2000).pipe(
  timeout(1000)
).subscribe(
  value => console.log(value),
  error => console.error('Timed out:', error)
);

// 5. defaultIfEmpty() - Emit default if no values
empty().pipe(
  defaultIfEmpty('No data')
).subscribe(value => console.log(value)); // "No data"

// Real-world: API call with retry and fallback
function loadUserData(userId: string): Observable<User> {
  return of({ id: userId, name: 'John' }).pipe(
    timeout(5000),
    retryWhen(errors =>
      errors.pipe(
        mergeMap((error, index) => {
          if (index >= 2) return throwError(() => error);
          return timer((index + 1) * 1000);
        })
      )
    ),
    catchError(error => {
      console.error('Failed to load user:', error);
      return of({ id: userId, name: 'Unknown' }); // Fallback
    })
  );
}

/*
ERROR HANDLING PATTERNS:

1. Retry with exponential backoff (network requests)
2. Timeout for long-running operations
3. Fallback values
4. Chain multiple operators
5. Log before recovery
6. Separate error and success streams

EVALUATION CRITERIA:
✓ catchError syntax and recovery
✓ retry with count
✓ retryWhen with custom logic
✓ timeout implementation
✓ defaultIfEmpty usage
✓ Real-world error scenarios
✓ Exponential backoff pattern
*/


// ============================================
// QUESTION 7: Subjects - Publish and Subscribe
// ============================================
/*
QUESTION:
Explain different types of Subjects:
Subject, BehaviorSubject, ReplaySubject, AsyncSubject
*/

import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';

// 1. Subject - Simple multi-cast
const subject = new Subject<number>();

// Needs to be subscribed before emit
subject.subscribe(value => console.log('Observer 1:', value));
subject.next(1); // Emits
subject.next(2);

// Late subscriber misses values
subject.subscribe(value => console.log('Observer 2:', value));
subject.next(3); // Only Observer 2 sees this

// 2. BehaviorSubject - Has initial value, emits current to new subscribers
const behaviorSubject = new BehaviorSubject<string>('Initial');

behaviorSubject.next('Hello');

// New subscriber gets current value immediately
behaviorSubject.subscribe(value => {
  console.log('BehaviorSubject:', value); // "Hello"
});

// Get current value synchronously
const currentValue = behaviorSubject.value;

// Real-world: Current user state
class UserStore {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  setUser(user: User): void {
    this.currentUserSubject.next(user);
  }
  
  getUser(): User | null {
    return this.currentUserSubject.value;
  }
}

// 3. ReplaySubject - Replays previous values to new subscribers
const replaySubject = new ReplaySubject<number>(2); // Buffer size 2

replaySubject.next(1);
replaySubject.next(2);
replaySubject.next(3);

// New subscriber gets last 2 values
replaySubject.subscribe(value => {
  console.log('ReplaySubject:', value); // 2, 3, then future values
});

// Real-world: Chat history
const chatMessages$ = new ReplaySubject<string>(50); // Last 50 messages

// 4. AsyncSubject - Only emits last value after complete
const asyncSubject = new AsyncSubject<number>();

asyncSubject.subscribe(value => {
  console.log('AsyncSubject:', value); // Only the last value
});

asyncSubject.next(1);
asyncSubject.next(2);
asyncSubject.next(3);
asyncSubject.complete(); // Now emits: 3

// Real-world: HTTP request (emits single response)
function httpGet(url: string): Observable<any> {
  return new Observable(subscriber => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        subscriber.next(data);
        subscriber.complete();
      })
      .catch(error => subscriber.error(error));
  });
}

/*
SUBJECT COMPARISON:

Subject:
- No initial value
- Emit to current subscribers only
- Late subscribers miss values

BehaviorSubject:
- Has initial value
- New subscriber gets current value
- Synchronous .value access
- Best for state management

ReplaySubject:
- Buffers previous values
- New subscribers get buffered values
- Good for event history

AsyncSubject:
- Only emits last value on complete
- Useful for single-value async operations

EVALUATION CRITERIA:
✓ Knows Subject basic usage
✓ BehaviorSubject with initial value
✓ ReplaySubject buffer concept
✓ AsyncSubject complete behavior
✓ Real-world use cases
✓ Cold vs hot observable concepts
*/


// ============================================
// QUESTION 8: Hot vs Cold Observables
// ============================================
/*
QUESTION:
Explain hot and cold observables.
Show how to make cold observables hot using share() and shareReplay().
*/

// COLD OBSERVABLE - Creates new source for each subscriber
const coldObservable = interval(1000).pipe(take(3));

// Subscriber 1
coldObservable.subscribe(value => console.log('Subscriber 1:', value));

// Subscriber 2 (after 500ms) - starts its own instance
setTimeout(() => {
  coldObservable.subscribe(value => console.log('Subscriber 2:', value));
}, 500);

// HOT OBSERVABLE - Single source, all subscribers share it
const hotObservable = interval(1000).pipe(
  take(3),
  share() // Makes it hot
);

// Subscriber 1
hotObservable.subscribe(value => console.log('Hot 1:', value));

// Subscriber 2 (after 500ms) - joins existing stream
setTimeout(() => {
  hotObservable.subscribe(value => console.log('Hot 2:', value));
}, 500);

// MULTICASTING OPERATORS
import { share, shareReplay, multicast, publish } from 'rxjs/operators';

// 1. share() - Converts to hot observable
const dataWithShare$ = fetchData().pipe(share());

// 2. shareReplay() - Caches last emitted value
const dataWithReplay$ = fetchData().pipe(shareReplay(1));

// New subscriber immediately gets cached value
dataWithReplay$.subscribe(data => console.log('Cached:', data));

// Real-world: API response caching
function getUserData(id: string): Observable<User> {
  return of({ id, name: 'John' }).pipe(
    shareReplay(1)
  );
}

const user1$ = getUserData('1');
const user2$ = getUserData('1'); // Same observable, same subscription

user1$.subscribe(user => console.log('User1:', user));
user2$.subscribe(user => console.log('User2:', user)); // Gets cached value

// Real-world: Form validation
const firstName$ = new Subject<string>();
const lastName$ = new Subject<string>();

const validationState$ = combineLatest([firstName$, lastName$]).pipe(
  map(([first, last]) => ({
    isValid: first.length > 0 && last.length > 0
  })),
  shareReplay(1)
);

// Multiple places can subscribe to validation state
validationState$.subscribe(state => console.log('Form Valid:', state.isValid));
validationState$.subscribe(state => console.log('Submit Button:', state.isValid));

/*
COLD vs HOT:

COLD OBSERVABLE:
- Executes for each subscriber
- Independent executions
- No value until subscribed
- Examples: from(), interval() directly
- Problem: Redundant work if multiple subscribers

HOT OBSERVABLE:
- Single execution, shared by all
- Values shared among subscribers
- May miss values if subscribed late
- Examples: Subject, events
- Solution: Use share(), shareReplay()

WHEN TO USE:
- share(): Multiple subscribers, don't need replay
- shareReplay(1): Cache last value (API responses)
- shareReplay(n): Cache n values (event history)

EVALUATION CRITERIA:
✓ Understands hot vs cold
✓ Explains subscription behavior difference
✓ Knows share() and shareReplay()
✓ Practical caching scenarios
✓ Performance implications
*/


// ============================================
// QUESTION 9: Custom RxJS Operators
// ============================================
/*
QUESTION:
Create custom RxJS operators:
1. debounce with leading option
2. retry with jitter
3. Rate limiting operator
*/

// 1. Custom debounce with leading option
import { Observable } from 'rxjs';
import { debounceTime as rxDebounce } from 'rxjs/operators';

function debounceWithLeading<T>(
  dueTime: number,
  leading: boolean = false
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
      let timeout: NodeJS.Timeout;
      let lastValue: T;
      let hasValue = false;
      let shouldEmit = leading;

      return source.subscribe({
        next: (value: T) => {
          lastValue = value;
          hasValue = true;

          clearTimeout(timeout);

          if (shouldEmit) {
            subscriber.next(value);
            shouldEmit = false;
          }

          timeout = setTimeout(() => {
            if (hasValue) {
              subscriber.next(lastValue);
            }
            shouldEmit = leading;
          }, dueTime);
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
    });
}

// Usage:
fromEvent(document, 'click').pipe(
  debounceWithLeading(300, true) // Emit on leading edge
).subscribe(() => console.log('Clicked'));

// 2. Retry with exponential backoff and jitter
function retryWithBackoff(
  maxRetries: number = 3,
  baseDelay: number = 1000
): (source: Observable<any>) => Observable<any> {
  return (source: Observable<any>) =>
    source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error, index) => {
            if (index >= maxRetries) {
              return throwError(() => error);
            }

            // Exponential backoff with jitter
            const delay = baseDelay * Math.pow(2, index);
            const jitter = Math.random() * 1000;
            const totalDelay = delay + jitter;

            console.log(
              `Retry ${index + 1}/${maxRetries} after ${totalDelay.toFixed(0)}ms`
            );

            return timer(totalDelay);
          })
        )
      )
    );
}

// Usage:
fetchData().pipe(
  retryWithBackoff(3, 1000)
).subscribe(
  data => console.log('Success:', data),
  error => console.error('Failed:', error)
);

// 3. Rate limiting operator
function rateLimit<T>(
  requestsPerSecond: number
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) => {
    const interval = 1000 / requestsPerSecond;
    return source.pipe(
      concatMap(value => of(value).pipe(delay(interval)))
    );
  };
}

// Usage:
const apiRequests$ = new Subject<string>();
apiRequests$.pipe(
  rateLimit(5) // 5 requests per second
).subscribe(request => {
  console.log('Processing:', request);
});

/*
OPERATOR CREATION PATTERN:

function customOperator<T>(
  ...params: any[]
): (source: Observable<T>) => Observable<T> {
  return (source: Observable<T>) =>
    new Observable(subscriber => {
      return source.subscribe({
        next: (value) => {
          // Transform value
          subscriber.next(value);
        },
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });
    });
}

EVALUATION CRITERIA:
✓ Proper operator structure
✓ Handles source subscription
✓ Error and complete handling
✓ Parameter passing
✓ Composition with other operators
✓ Real-world utility
*/


// ============================================
// QUESTION 10: Memory Leaks and Subscription Management
// ============================================
/*
QUESTION:
Identify and prevent memory leaks in RxJS.
Demonstrate proper subscription cleanup.
*/

import { takeUntil, unsubscribe } from 'rxjs/operators';

// BAD: Memory leak - never unsubscribe
class BadComponent {
  constructor(private data: DataService) {
    // Problem: subscription never cleaned up
    this.data.getStream().subscribe(value => {
      console.log(value);
    });
  }
}

// GOOD: Using takeUntil pattern
class GoodComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private data: DataService) {
    this.data.getStream()
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        console.log(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// GOOD: Using subscription property
class AlternativeComponent implements OnDestroy {
  private subscription: Subscription;

  constructor(private data: DataService) {
    this.subscription = this.data.getStream()
      .subscribe(value => {
        console.log(value);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

// GOOD: Using async pipe in template (automatic cleanup)
@Component({
  template: `
    <div>{{ data$ | async | json }}</div>
  `
})
class AsyncPipeComponent {
  data$ = this.data.getStream();

  constructor(private data: DataService) {}
  // No cleanup needed - async pipe handles it
}

// BEST: ReusableComponent base class
abstract class UnsubscribeComponent implements OnDestroy {
  protected destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected untilDestroy<T>(
    source: Observable<T>
  ): Observable<T> {
    return source.pipe(takeUntil(this.destroy$));
  }
}

// Usage:
class MyComponent extends UnsubscribeComponent {
  constructor(private data: DataService) {
    super();

    this.untilDestroy(this.data.getStream())
      .subscribe(value => console.log(value));
  }
}

// Common Memory Leak Patterns:

// 1. Multiple subscriptions to same observable
const data$ = new Subject<any>();
data$.subscribe(...); // Subscription 1
data$.subscribe(...); // Subscription 2
// Both need cleanup!

// 2. Nested subscriptions (Callback Hell)
source1$.subscribe(val1 => {
  source2$.subscribe(val2 => {
    source3$.subscribe(val3 => {
      // Problem: 3 subscriptions to manage
    });
  });
});
// Better: Use composition operators instead

// 3. Storing subjects without cleanup
class Store {
  private data$ = new BehaviorSubject<any>(null);
  // Must cleanup in ngOnDestroy!
}

// Prevention Checklist:
/*
✓ Use takeUntil(destroy$) in components
✓ Implement OnDestroy and call next()/complete()
✓ Use async pipe in templates when possible
✓ Use proper composition (switchMap, etc) instead of nesting
✓ Be aware of long-lived subscriptions
✓ Avoid storing multiple subscriptions
✓ Review code for unreleased subscriptions
*/

/*
EVALUATION CRITERIA:
✓ Identifies memory leak patterns
✓ Implements takeUntil pattern
✓ OnDestroy cleanup
✓ async pipe usage
✓ Understands subscription lifecycles
✓ Component architecture
✓ Real-world prevention strategies
*/


// ============================================
// QUESTION 11: Advanced Operators - Transformation
// ============================================
/*
QUESTION:
Master transformation operators: map, pluck, switchMap, mergeMap, concatMap.
Know when to use each.
*/

/*
// map - Transform each value
source$.pipe(
  map(x => x * 2)
).subscribe();

// pluck - Extract property from objects
users$.pipe(
  pluck('name') // Get name property from each user
).subscribe();

// switchMap - Cancel previous observable
searchTerm$.pipe(
  debounceTime(300),
  switchMap(term => apiService.search(term)) // Cancels previous search
).subscribe();

// mergeMap - Run all observables in parallel
userIds$.pipe(
  mergeMap(id => apiService.getUser(id)) // All parallel, no cancellation
).subscribe();

// concatMap - Sequential execution
userIds$.pipe(
  concatMap(id => apiService.getUser(id)) // One at a time, in order
).subscribe();

// Use cases:
// - switchMap: Search, autocomplete, route changes
// - mergeMap: Parallel requests (images, etc)
// - concatMap: Maintain order, sequential processing
*/

/*
EVALUATION CRITERIA:
✓ map, pluck, switchMap understanding
✓ mergeMap vs switchMap vs concatMap
✓ Proper operator selection
✓ Performance implications
✓ Real-world scenarios
*/


// ============================================
// QUESTION 12: Advanced Operators - Filtering & Combining
// ============================================
/*
QUESTION:
Master filtering and combining operators:
filter, distinct, debounce, throttle, combineLatest, merge, zip.
*/

/*
// Filtering
source$.pipe(
  filter(x => x > 5), // Only values > 5
  distinctUntilChanged(), // Skip duplicate values
  debounceTime(300), // Wait for pause
  throttleTime(1000) // Emit at most every 1000ms
).subscribe();

// Combining observables
combineLatest([obs1$, obs2$]).pipe(
  map(([val1, val2]) => val1 + val2)
).subscribe();

merge(obs1$, obs2$).subscribe(); // Emit from any source

zip(obs1$, obs2$, obs3$).pipe(
  map(([val1, val2, val3]) => ({val1, val2, val3}))
).subscribe(); // Wait for all to emit

// forkJoin - Wait for completion
forkJoin([obs1$, obs2$]).subscribe(([result1, result2]) => {
  // All observables completed
});

// withLatestFrom - Combine latest value
obs1$.pipe(
  withLatestFrom(obs2$),
  map(([val1, val2]) => `${val1}-${val2}`)
).subscribe();
*/

/*
EVALUATION CRITERIA:
✓ Filter, debounce, throttle usage
✓ combineLatest vs merge vs zip vs forkJoin
✓ withLatestFrom patterns
✓ Timing and sequencing
✓ Real-world use cases
*/


// ============================================
// QUESTION 13: Error Handling in RxJS
// ============================================
/*
QUESTION:
Master error handling operators: catchError, retry, timeout.
Implement resilient streams.
*/

/*
// catchError - Handle errors
source$.pipe(
  catchError(error => {
    console.error('Error:', error);
    return of(defaultValue); // Return fallback
  })
).subscribe();

// retry - Retry on error
source$.pipe(
  retry(3) // Simple retry
).subscribe();

// retry with config
source$.pipe(
  retry({
    count: 3,
    delay: (err, retryCount) => timer(Math.pow(2, retryCount) * 1000)
  })
).subscribe();

// timeout - Fail if no emission
source$.pipe(
  timeout(5000), // 5 second timeout
  catchError(err => {
    if (err.name === 'TimeoutError') {
      return of(defaultValue);
    }
    throw err;
  })
).subscribe();

// Exponential backoff pattern
function exponentialBackoff(
  maxRetries: number,
  initialDelay: number
): (src: Observable<any>) => Observable<any> {
  return (src: Observable<any>) =>
    src.pipe(
      retry({
        count: maxRetries,
        delay: (err, retryCount) => 
          timer(initialDelay * Math.pow(2, retryCount))
      })
    );
}

// Usage
api.call().pipe(
  exponentialBackoff(5, 1000)
).subscribe();
*/

/*
EVALUATION CRITERIA:
✓ catchError implementation
✓ retry with backoff
✓ timeout handling
✓ Error propagation
✓ Fallback values
✓ Resilience patterns
*/


// ============================================
// QUESTION 14: Higher-Order Observables & Flattening
// ============================================
/*
QUESTION:
Understand higher-order observables.
Master flattening with mergeAll, concatAll, switchAll.
*/

/*
// Higher-order observable
const clicks$ = mouseClicks();
const intervals$ = clicks$.pipe(
  map(click => interval(1000)) // Observable of Observables
); // Observable<Observable<number>>

// Flattening strategies
intervals$.pipe(
  mergeAll() // Run all overlapping intervals
).subscribe();

intervals$.pipe(
  concatAll() // Wait for first to complete before next
).subscribe();

intervals$.pipe(
  switchAll() // Subscribe to latest, unsubscribe from previous
).subscribe();

// Practical example - File uploads with retry
const fileSelection$ = fileInput.changes;
const uploads$ = fileSelection$.pipe(
  switchMap(files => 
    from(files).pipe(
      mergeMap(file => 
        uploadFile(file).pipe(
          retry(3),
          catchError(err => of({ error: err, file }))
        ),
        3 // Max 3 concurrent uploads
      )
    )
  )
);
*/

/*
EVALUATION CRITERIA:
✓ Higher-order observable concept
✓ mergeAll vs concatAll vs switchAll
✓ Practical flattening patterns
✓ Concurrency control
✓ Error handling in flattened streams
*/


// ============================================
// QUESTION 15: Custom Operators
// ============================================
/*
QUESTION:
Create reusable custom RxJS operators.
*/

/*
// Simple operator - Double values
function double<T extends number>(): OperatorFunction<T, number> {
  return (source: Observable<T>) =>
    source.pipe(map(x => x * 2));
}

// Complex operator - Retry with exponential backoff
function retryWithBackoff(
  maxRetries: number = 3,
  initialDelay: number = 1000
): OperatorFunction<any, any> {
  return (source: Observable<any>) =>
    source.pipe(
      retryWhen(errors =>
        errors.pipe(
          concatMap((error, index) => {
            if (index >= maxRetries) {
              return throwError(() => error);
            }
            const delay = initialDelay * Math.pow(2, index);
            return timer(delay);
          })
        )
      )
    );
}

// Operator with configuration
function retryWithConfig(config: RetryConfig) {
  return (source: Observable<any>) =>
    source.pipe(
      retry({
        count: config.maxRetries,
        delay: (err, retryCount) =>
          timer(config.initialDelay * Math.pow(2, retryCount))
      })
    );
}

// Usage
api.call().pipe(
  retryWithBackoff(5, 1000),
  timeout(10000),
  catchError(err => of(defaultValue))
).subscribe();
*/

/*
EVALUATION CRITERIA:
✓ Operator creation
✓ OperatorFunction typing
✓ Composition
✓ Configuration/options
✓ Reusability
*/


// ============================================
// QUESTION 16: Subjects and Subject Types
// ============================================
/*
QUESTION:
Deep dive into subject types and their use cases.
Know when to use each type.
*/

/*
// Subject - No initial value, no cache
const subject = new Subject<string>();
subject.next('hello');
// Late subscriber misses 'hello'

// BehaviorSubject - Has initial value, emits current
const behaviorSubject = new BehaviorSubject<string>('initial');
behaviorSubject.next('hello');
// Late subscriber gets 'hello' immediately

// ReplaySubject - Caches N previous values
const replaySubject = new ReplaySubject<string>(3);
// Caches last 3 values for new subscribers

// AsyncSubject - Only emits last value when complete
const asyncSubject = new AsyncSubject<string>();
asyncSubject.next('1');
asyncSubject.next('2');
asyncSubject.next('3');
asyncSubject.complete();
// Subscribers only get '3'

// Use cases:
// - Subject: Event bus, simple event emitter
// - BehaviorSubject: Current value/state
// - ReplaySubject: Recent history needed
// - AsyncSubject: Only final result matters

// Multicast pattern
const source$ = interval(1000);
const multicasted$ = source$.pipe(
  multicast(new Subject()),
  refCount() // Share single subscription
);

// All subscribers share same underlying subscription
*/

/*
EVALUATION CRITERIA:
✓ Subject differences
✓ Value caching
✓ Subscriber behavior
✓ Multicast/refCount
✓ Proper subject selection
✓ Performance implications
*/


// ============================================
// QUESTION 17: Advanced Patterns - State Management
// ============================================
/*
QUESTION:
Implement state management pattern with RxJS.
*/

/*
// Simple state management
@Injectable({
  providedIn: 'root'
})
export class StateService {
  private state$ = new BehaviorSubject<AppState>({
    user: null,
    loading: false
  });
  
  // Selectors
  user$ = this.state$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );
  
  loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );
  
  // Actions
  loadUser(id: string): void {
    this.setState({ loading: true });
    
    this.apiService.getUser(id).subscribe(
      user => this.setState({ user, loading: false }),
      err => this.setState({ error: err, loading: false })
    );
  }
  
  private setState(partial: Partial<AppState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}

// Usage in components
@Component({})
export class UserComponent {
  user$ = this.state.user$;
  loading$ = this.state.loading$;
  
  constructor(private state: StateService) {}
  
  loadUser(id: string): void {
    this.state.loadUser(id);
  }
}
*/

/*
EVALUATION CRITERIA:
✓ BehaviorSubject state
✓ Selector pattern
✓ Action methods
✓ Immutable state updates
✓ Subscription handling
*/


// ============================================
// QUESTION 18: Testing RxJS with Marble Diagrams
// ============================================
/*
QUESTION:
Test observable sequences using marble diagrams.
Know the testing operators: hot/cold observables.
*/

/*
import { TestScheduler } from 'rxjs/testing';

describe('Observable Testing', () => {
  let testScheduler: TestScheduler;
  
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });
  
  it('should emit values', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-b-c|', { a: 1, b: 2, c: 3 });
      expectObservable(source$).toBe('-a-b-c|', { a: 1, b: 2, c: 3 });
    });
  });
  
  it('should handle errors', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-b-#', { a: 1, b: 2 }, new Error('Test'));
      expectObservable(source$).toBe('-a-b-#', { a: 1, b: 2 });
    });
  });
  
  it('should transform with operators', () => {
    testScheduler.run(({ cold, expectObservable }) => {
      const source$ = cold('-a-b-c|', { a: 1, b: 2, c: 3 });
      const result$ = source$.pipe(map(x => x * 2));
      expectObservable(result$).toBe('-a-b-c|', { a: 2, b: 4, c: 6 });
    });
  });
});

// Marble diagram syntax:
// - : Frame/time unit
// a-z : Emission value
// | : Complete
// # : Error
// ( ) : Synchronous group
*/

/*
EVALUATION CRITERIA:
✓ TestScheduler setup
✓ Cold vs hot observables
✓ Marble diagram syntax
✓ Assertion expectations
✓ Error testing
✓ Operator testing
*/


// ============================================
// QUESTION 19: Backpressure and Flow Control
// ============================================
/*
QUESTION:
Handle backpressure in RxJS.
Implement flow control patterns.
*/

/*
// Buffering excess values
source$.pipe(
  buffer(interval(1000)) // Collect values for 1s, emit array
).subscribe();

// Windowing - Emit last N values
source$.pipe(
  scan((acc, val) => [...acc, val].slice(-3), [] as number[])
).subscribe();

// throttleTime - Limit emission rate
source$.pipe(
  throttleTime(1000) // Max once per second
).subscribe();

// debounceTime - Wait for pause
source$.pipe(
  debounceTime(300) // Wait 300ms since last emission
).subscribe();

// backpressure with buffer size
function backpressureBuffer(bufferSize: number) {
  return (source: Observable<any>) =>
    source.pipe(
      scan((acc, val) => {
        acc.push(val);
        return acc.length > bufferSize ? acc.slice(1) : acc;
      }, [] as any[])
    );
}

// Practical: API rate limiting
const requests$ = userActions$.pipe(
  debounceTime(100),
  throttleTime(500),
  switchMap(action => apiService.execute(action))
);
*/

/*
EVALUATION CRITERIA:
✓ Buffer and window operators
✓ throttle vs debounce
✓ Backpressure handling
✓ Flow control
✓ Real-world scenarios
*/


// ============================================
// QUESTION 20: Schedulers in RxJS
// ============================================
/*
QUESTION:
Understand RxJS schedulers and execution contexts.
When and how to use different schedulers.
*/

/*
// asyncScheduler - setTimeout
source$.pipe(
  subscribeOn(asyncScheduler),
  observeOn(asyncScheduler)
).subscribe();

// immediateScheduler - Synchronous
source$.pipe(
  observeOn(immediateScheduler)
).subscribe();

// animationFrameScheduler - requestAnimationFrame
source$.pipe(
  observeOn(animationFrameScheduler)
).subscribe();

// queueScheduler - Queue each action
source$.pipe(
  subscribeOn(queueScheduler)
).subscribe();

// Scheduler examples:
// subscribeOn - When to subscribe
// observeOn - When to emit

// Use cases:
// - animationFrameScheduler: Animation updates
// - asyncScheduler: HTTP requests
// - immediateScheduler: Synchronous processing
// - queueScheduler: Batch processing
*/

/*
EVALUATION CRITERIA:
✓ Scheduler types
✓ subscribeOn vs observeOn
✓ Execution context understanding
✓ Performance implications
✓ Real-world usage
*/


// ============================================
// QUESTION 21: Hot vs Cold Observables
// ============================================
/*
QUESTION:
Understand hot and cold observables.
Know how to convert between them.
*/

/*
// COLD Observable - Lazy, starts on subscription
const cold$ = new Observable(subscriber => {
  console.log('Cold observable started');
  subscriber.next(1);
  subscriber.next(2);
});

// Both subscribers trigger new execution
cold$.subscribe(x => console.log('Sub1:', x));
cold$.subscribe(x => console.log('Sub2:', x));
// Output: 
// Cold observable started
// Sub1: 1
// Sub1: 2
// Cold observable started  <-- New execution!
// Sub2: 1
// Sub2: 2

// HOT Observable - Eager, emits regardless
const hot$ = new Subject();
hot$.next(1);
hot$.next(2);

cold$.subscribe(x => console.log('Sub1:', x));
// Misses 1 and 2
cold$.next(3); // Sub1: 3

cold$.subscribe(x => console.log('Sub2:', x));
// Also misses 1, 2, 3

// Convert cold to hot with share/shareReplay
const shared$ = cold$.pipe(
  share() // Share single execution
);

// or with refCount
const hotConversion$ = cold$.pipe(
  multicast(new Subject()),
  refCount()
);
*/

/*
EVALUATION CRITERIA:
✓ Hot vs cold concept
✓ Subscription behavior
✓ share() operator
✓ refCount() operator
✓ shareReplay() for caching
*/


// ============================================
// QUESTION 22: RxJS with Angular HTTP
// ============================================
/*
QUESTION:
Integrate RxJS with Angular HTTP module.
Create declarative data flows.
*/

/*
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private baseUrl = '/api/users';
  
  // Simple request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  
  // Request with error handling
  getUserWithError(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      retry(3),
      timeout(10000),
      catchError(err => {
        console.error('Error loading user:', err);
        return throwError(() => err);
      })
    );
  }
  
  // Declarative search
  search(term: string): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl, {
      params: { q: term }
    });
  }
  
  // Combining requests
  getUserWithPosts(id: string): Observable<UserWithPosts> {
    return this.getUser(id).pipe(
      switchMap(user =>
        this.getPosts(id).pipe(
          map(posts => ({ ...user, posts }))
        )
      )
    );
  }
}
*/

/*
EVALUATION CRITERIA:
✓ HTTP observable patterns
✓ Error handling
✓ Request composition
✓ Retry strategies
✓ Timeout handling
*/


// ============================================
// QUESTION 23: Performance Optimization with RxJS
// ============================================
/*
QUESTION:
Optimize observable chains for performance.
Minimize subscriptions and memory usage.
*/

/*
// Share operator - Single subscription
const data$ = this.http.get('/api/data').pipe(
  share()
);

// shareReplay - Cache result
const cached$ = this.http.get('/api/data').pipe(
  shareReplay(1)
);

// Avoid unnecessary emissions
items$.pipe(
  distinctUntilChanged((prev, curr) => 
    prev.id === curr.id && prev.name === curr.name
  )
).subscribe();

// Use scan for accumulation instead of nested maps
items$.pipe(
  scan((acc, item) => [...acc, item], [])
).subscribe();

// Limit concurrent operations
source$.pipe(
  mergeMap(item => process(item), 3) // Max 3 concurrent
).subscribe();

// Clean up old observables
oldObservable$ = null;
newObservable$ = this.refreshData();
*/

/*
EVALUATION CRITERIA:
✓ share vs shareReplay
✓ distinctUntilChanged
✓ Concurrency limiting
✓ Memory management
✓ Subscription optimization
*/


// ============================================
// QUESTION 24: RxJS Composition Patterns
// ============================================
/*
QUESTION:
Master advanced composition patterns.
Create reusable observable chains.
*/

/*
// Operator composition
function searchUsers(searchTerm$: Observable<string>) {
  return searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length > 2),
    switchMap(term => this.api.search(term)),
    shareReplay(1)
  );
}

// Observable factory pattern
function createDataLoader(url: string) {
  return new Observable(subscriber => {
    this.http.get(url).subscribe(
      data => subscriber.next(data),
      err => subscriber.error(err),
      () => subscriber.complete()
    );
  });
}

// Connector pattern
function connect<A, B>(
  source: Observable<A>,
  transform: (src: Observable<A>) => Observable<B>
): Observable<B> {
  return transform(source);
}

// Usage
const result$ = connect(
  userIds$,
  obs => obs.pipe(
    switchMap(id => this.api.getUser(id)),
    shareReplay(1)
  )
);
*/

/*
EVALUATION CRITERIA:
✓ Operator composition
✓ Factory patterns
✓ Reusability
✓ Abstraction
✓ Type safety
*/


// ============================================
// QUESTION 25: Real-World RxJS Scenarios
// ============================================
/*
QUESTION:
Solve real-world problems with RxJS.
Implement complete event-driven systems.
*/

/*
// Form auto-save with debounce
formChanges$ = this.form.valueChanges.pipe(
  debounceTime(500),
  distinctUntilChanged(),
  switchMap(values => this.api.save(values)),
  retry(3),
  catchError(err => {
    console.error('Save failed:', err);
    return of(null);
  })
);

// Search with loading indicator
search(term: string) {
  const term$ = this.searchSubject.asObservable();
  
  return {
    results$: term$.pipe(
      debounceTime(300),
      switchMap(t => this.api.search(t))
    ),
    loading$: term$.pipe(
      debounceTime(300),
      switchMap(() => 
        of(true).pipe(
          concat(of(false).pipe(delay(3000)))
        )
      ),
      startWith(false)
    )
  };
}

// Real-time notifications
notifications$ = this.websocket.messages$.pipe(
  filter(msg => msg.type === 'notification'),
  map(msg => msg.data),
  share()
);

// Multiplexed streams
userUpdates$ = combineLatest([
  this.api.getUser(),
  this.api.getSettings(),
  this.api.getPreferences()
]).pipe(
  map(([user, settings, prefs]) => ({
    user,
    settings,
    prefs
  }))
);
*/

/*
EVALUATION CRITERIA:
✓ Real-world problem solving
✓ Complete implementations
✓ Error handling
✓ UX considerations
✓ Performance
✓ Code organization
*/
