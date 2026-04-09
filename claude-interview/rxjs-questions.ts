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


// ============================================
// QUESTION 26: Cold vs Hot — The Multicast Problem
// ============================================
/*
QUESTION:
Predict what is logged when two observers subscribe to the same cold vs hot
observable. Then explain why share() alone isn't always the right fix, and
when you need shareReplay(1) instead.

TRICKY PART: shareReplay(1) with refCount:false keeps the source alive even
after all subscribers unsubscribe. When is that a memory leak and when is it
intentional caching?
*/

// import { Observable, Subject, timer, of } from 'rxjs';  // (removed duplicate import)
// import { share, shareReplay, take, tap, delay, refCount, publish } from 'rxjs/operators';  // (removed duplicate import)

// COLD — each subscriber gets its own producer
const cold$ = new Observable(sub => {
  console.log('Producer created'); // logs twice for two subscribers
  sub.next(Math.random());
  sub.complete();
});
cold$.subscribe(v => console.log('A:', v)); // A: 0.42 (Producer created)
cold$.subscribe(v => console.log('B:', v)); // B: 0.87 (Producer created again)

// HOT (shared) — one producer, multiple observers
const hot$ = cold$.pipe(share()); // multicasts via Subject internally
hot$.subscribe(v => console.log('A:', v));
hot$.subscribe(v => console.log('B:', v));
// Only one 'Producer created' but B may miss the value if it subscribes late!

// shareReplay(1) — caches last emission; late subscribers still get it
const cached$ = cold$.pipe(shareReplay(1));
cached$.subscribe(v => console.log('A:', v));
setTimeout(() => {
  cached$.subscribe(v => console.log('B late:', v)); // still gets the value
}, 1000);

// refCount:false PITFALL — source stays alive after all unsubscribe
const leaky$ = cold$.pipe(shareReplay({ bufferSize: 1, refCount: false }));
// Default shareReplay(1) = refCount:false in RxJS 6 → source never completes
// FIX for caching HTTP: { bufferSize: 1, refCount: true } — resets when all unsub

// refCount:true = unsubscribes from source when subscriber count drops to 0
// refCount:false = keeps source alive forever (good for lookup caches, risky for intervals)

/*
EVALUATION CRITERIA:
✓ Cold: new producer per subscriber — each gets independent stream
✓ Hot: shared producer — late subscribers miss past values
✓ share() = publish() + refCount(true) — multicasts, no replay
✓ shareReplay(n) replays last n values to late subscribers
✓ shareReplay default refCount:false in RxJS 6 = possible memory leak with intervals
✓ refCount:true — source unsubscribed when count hits 0; resubscribed on next subscriber
✓ Use shareReplay(1) for HTTP caching; use share() for event streams
✓ publishReplay + refCount = same as shareReplay(n, refCount:true)
*/


// ============================================
// QUESTION 27: switchMap vs mergeMap vs concatMap vs exhaustMap
// ============================================
/*
QUESTION:
For each of the four flattening operators, state: what happens to the
inner observable when a new outer value arrives, and give the canonical
real-world use case. Then predict the output order for the following marble:

outer: --a------b--c--|
inner (each takes 3 ticks): ---x|

switchMap:   --a---x------b---x-c---x--|   ← cancels prev on new outer
mergeMap:    --a---x------b---x-c---x--|   ← but if inner overlaps: interleaved
concatMap:   --a---x------b---x---c---x--| ← queues; waits for each inner to finish
exhaustMap:  --a---x------b---x-c--------|  ← ignores c while b's inner is running
*/

// import { fromEvent, interval, EMPTY } from 'rxjs';  // (removed duplicate import)
// import { switchMap, mergeMap, concatMap, exhaustMap, mapTo, take as takePipe } from 'rxjs/operators';  // (removed duplicate import)

// switchMap — cancel-on-new: live search / autocomplete
const search$ = (query: string) => of(`results for ${query}`).pipe(delay(300));
fromEvent<Event>(document, 'input').pipe(
  switchMap(e => search$((e.target as HTMLInputElement).value))
  // Previous in-flight search cancelled when user types again
).subscribe(console.log);

// mergeMap — parallel, no cancellation: fire-and-forget analytics
const logEvent$ = (event: string) => of(event).pipe(delay(100));
fromEvent(document, 'click').pipe(
  mergeMap(e => logEvent$('click'))
  // Every click spawns a concurrent inner observable
).subscribe();

// concatMap — serial queue: sequential API calls where order matters
of('step1', 'step2', 'step3').pipe(
  concatMap(step => of(`done: ${step}`).pipe(delay(200)))
  // step2 won't start until step1's inner completes
).subscribe(console.log);

// exhaustMap — ignore while busy: submit button (prevent double-submit)
fromEvent(document.querySelector('button')!, 'click').pipe(
  exhaustMap(() => of('submitted').pipe(delay(2000)))
  // Any click during the 2s window is silently dropped
).subscribe(console.log);

/*
EVALUATION CRITERIA:
✓ switchMap: unsubscribes from previous inner on each new outer — search/typeahead
✓ mergeMap: all inner observables run concurrently — fire-and-forget, parallel uploads
✓ concatMap: queues inner observables — sequential operations, ordered processing
✓ exhaustMap: ignores new outer while inner is active — submit button, login click
✓ All four flatten (subscribe to inner and forward its values to output)
✓ switchMap memory: cancelled inner subscriptions are cleaned up automatically
✓ mergeMap unbounded concurrency can overwhelm APIs — use mergeMap(fn, concurrency)
✓ concatMap = mergeMap with concurrency 1
*/


// ============================================
// QUESTION 28: Custom Operator — Pipeable Factory
// ============================================
/*
QUESTION:
Build a retryWithBackoff() operator that retries a failing observable
with exponential backoff (delay doubles each attempt) up to maxRetries,
then re-throws. Also build a rateLimit() operator using concatMap + delay.

TRICKY PART: Why must a custom operator return a function that takes and
returns an Observable? What breaks if you return the observable directly?
*/

// import { Observable, throwError, timer as timerOp } from 'rxjs';  // (removed duplicate import)
// import { retryWhen, mergeMap as mergeMapOp, delayWhen, take as takeOp, concat, catchError } from 'rxjs/operators';  // (removed duplicate import)

// Custom pipeable operator signature: (source: Observable<T>) => Observable<R>
function retryWithBackoff<T>(maxRetries: number, initialDelay = 1000) {
  return (source: Observable<T>): Observable<T> => {
    return source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMapOp((err, attempt) => {
            if (attempt >= maxRetries) return throwError(() => err);
            const backoff = initialDelay * Math.pow(2, attempt);
            console.log(`Retry ${attempt + 1} in ${backoff}ms`);
            return timerOp(backoff); // emit after backoff, triggering retry
          })
        )
      )
    );
  };
}

// Rate limiter — processes items at most once per intervalMs
function rateLimit<T>(intervalMs: number) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      concatMap(item =>
        // Zip item emission with a minimum-duration timer
        of(item).pipe(
          delayWhen((_, index) => index === 0 ? of(undefined) : timerOp(intervalMs))
        )
      )
    );
}

// Usage
// import { HttpClient } from '@angular/common/http';  // (removed duplicate import)
// httpClient.get('/api/data').pipe(retryWithBackoff(3, 500)).subscribe(...)

// API calls rate limited to 1 per second
// of('url1', 'url2', 'url3').pipe(
//   rateLimit(1000),
//   mergeMapOp(url => httpClient.get(url))
// ).subscribe(console.log);

/*
EVALUATION CRITERIA:
✓ Custom operator = function returning (source: Observable<T>) => Observable<R>
✓ Must be a function that RETURNS the transformed observable — not the observable itself
✓ retryWhen receives errors$ observable; emit from it to retry, throwError to rethrow
✓ mergeMap in retryWhen gets (error, index) — index is the attempt count (0-based)
✓ Exponential backoff: delay = initialDelay * 2^attempt
✓ timer(n) emits after n ms — use as a pausable trigger
✓ rateLimit uses concatMap to serialize + delayWhen to add minimum gap
✓ Operators compose — they are just functions: pipe(op1(), op2(), op3())
*/


// ============================================
// QUESTION 29: Marble Testing with TestScheduler
// ============================================
/*
QUESTION:
Write marble tests for switchMap with a debounced search and for
retryWithBackoff. Explain the marble syntax: what do -, |, #, ^, !
and letters represent? What is the difference between cold() and hot()
in TestScheduler? What does TestScheduler.run() vs legacy TestScheduler do?

TRICKY PART: In marble notation, each character = 10ms in the new run()
API but 1 frame in the legacy API. What is a "frame"?
*/

// import { TestScheduler } from 'rxjs/testing';  // (removed duplicate import)

const scheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected); // jasmine/jest assertion
});

scheduler.run(({ cold, hot, expectObservable, expectSubscriptions }) => {
  // Marble syntax (new run() API — each character = 1ms):
  // -  = 1ms passes, no emission
  // a  = emission with value mapped from { a: 'someValue' }
  // |  = complete
  // #  = error (default: new Error())
  // ^  = subscription point (hot observables only)
  // !  = unsubscription point
  // ()  = synchronous grouping — emissions in same frame

  // Test: debounceTime(30) + switchMap
  const source$ = hot('  -a-b----------c-|', { a: 'x', b: 'y', c: 'z' });
  const innerObs = cold('        ---r|');      // 30ms delay (inner)
  // Expected after debounce(30) + switchMap:
  // 'b' is debounced (cancels 'a'), 'c' emits independently
  const expected =      '--------------r---r|';

  // Test retryWhen — error then success
  const failThenSucceed$ = cold('#', undefined, new Error('fail'));
  // After retry logic, expected to emit value
  // ...

  // COLD vs HOT in TestScheduler:
  // cold(): subscription starts when test subscribes (time 0 relative to subscribe)
  // hot(): created at frame 0; subscriber joins mid-stream (may miss early values)

  // FRAME vs ms:
  // Legacy TestScheduler (without .run()): 1 char = 1 virtual frame
  // New .run() API: 1 char = 1ms — more intuitive, aligns with real time units

  expectObservable(source$).toBe('-a-b----------c-|', { a: 'x', b: 'y', c: 'z' });
  expectSubscriptions(source$.subscriptions).toBe('^---------------!');
});

/*
EVALUATION CRITERIA:
✓ - = empty frame/ms; letter = value; | = complete; # = error
✓ () = synchronous emissions in same frame; space = ignored (readability)
✓ ^ = subscription; ! = unsubscription (in subscriptions marble)
✓ cold() — each subscriber starts at its own time 0
✓ hot() — shared timeline; subscriber may miss emissions before ^
✓ .run() API uses ms (1 char = 1ms); legacy uses frames (virtual ticks)
✓ { a: 'hello' } maps marble letters to actual emission values
✓ expectSubscriptions verifies when and how long source was subscribed
*/


// ============================================
// QUESTION 30: Higher-Order Observables — Creation Patterns
// ============================================
/*
QUESTION:
What is a higher-order observable? Show three ways to create one and explain
when each pattern is useful: Observable<Observable<T>>, Subject emitting
observables, and from() wrapping an array of observables.
Then show the difference between mergeAll(), concatAll(), switchAll().

TRICKY PART: What happens if you forget to flatten a higher-order observable?
What type do you get in the template with the async pipe on Observable<Observable<T>>?
*/

// import { of as rxOf, from as rxFrom, merge as rxMerge } from 'rxjs';  // (removed duplicate import)
// import { mergeAll, concatAll, switchAll, map as rxMap } from 'rxjs/operators';  // (removed duplicate import)

// Higher-order observable: Observable<Observable<T>>
const higherOrder$ = rxOf(
  rxOf(1, 2, 3),       // inner observable 1
  rxOf(4, 5, 6),       // inner observable 2
  rxOf(7, 8, 9)        // inner observable 3
);

// mergeAll — subscribe to all inner observables concurrently
higherOrder$.pipe(mergeAll()).subscribe(console.log); // 1,2,3,4,5,6,7,8,9 (interleaved)

// concatAll — subscribe to each inner only after previous completes
higherOrder$.pipe(concatAll()).subscribe(console.log); // 1,2,3,4,5,6,7,8,9 (ordered)

// switchAll — subscribe to latest inner, unsubscribe from previous
const switchable$ = new Subject<Observable<number>>();
switchable$.pipe(switchAll()).subscribe(console.log);
switchable$.next(interval(100).pipe(takePipe(5)));  // starts emitting 0,1,2...
setTimeout(() => {
  switchable$.next(rxOf(99)); // previous interval cancelled, 99 emitted immediately
}, 250);

// FOOTGUN — forgetting to flatten
const unflattened$ = rxOf('a', 'b').pipe(
  rxMap(letter => rxOf(letter.toUpperCase())) // returns Observable<Observable<string>>
);
// unflattened$.subscribe(v => console.log(v)); // logs Observable{}, not 'A', 'B'!
// FIX: use mergeMap, switchMap, or concatMap instead of map

// Async pipe on Observable<Observable<T>> gives Observable<T> in template — still needs flattening
// {{ innerObs$ | async | async }} — double async pipe (antipattern — avoid)

/*
EVALUATION CRITERIA:
✓ Higher-order observable emits observables as values (not primitives)
✓ Must flatten to access inner values: mergeMap/switchMap/concatMap or *All variants
✓ mergeAll = subscribe to all concurrently; concatAll = sequential; switchAll = latest only
✓ map + mergeAll = mergeMap; map + concatAll = concatMap; map + switchAll = switchMap
✓ Forgetting to flatten: subscriber receives Observable objects, not values
✓ async pipe subscribes to outer observable; double async pipe for nested (antipattern)
✓ Subject emitting observables = dynamic stream switching (e.g., live video feed switching)
✓ from(arrayOfObservables) creates a higher-order observable from an array
*/


// ============================================
// QUESTION 31: BehaviorSubject vs ReplaySubject vs AsyncSubject
// ============================================
/*
QUESTION:
Predict the output for each Subject type when a late subscriber joins
after values have been emitted. Then show the practical use case for each.

TRICKY PART: What does ReplaySubject(1) give you that BehaviorSubject doesn't?
What is AsyncSubject's emission rule? What happens to BehaviorSubject.getValue()
after the source errors?
*/

// import { BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';  // (removed duplicate import)

// BehaviorSubject — requires initial value; late subscribers get CURRENT value
const behavior$ = new BehaviorSubject(0);
behavior$.next(1);
behavior$.next(2);
behavior$.subscribe(v => console.log('Late B:', v)); // logs: 2 (current value only)
behavior$.next(3); // logs: 3 (ongoing)

console.log(behavior$.getValue()); // synchronous read: 3
// After error: getValue() throws the error — dangerous to call without try/catch

// ReplaySubject(n) — replays last n values to late subscribers
const replay$ = new ReplaySubject<number>(2); // buffer of 2
replay$.next(1);
replay$.next(2);
replay$.next(3);
replay$.subscribe(v => console.log('Late R:', v)); // logs: 2, 3 (last 2)
// ReplaySubject(1) ≈ BehaviorSubject but without requiring initial value

// ReplaySubject with time window
const timedReplay$ = new ReplaySubject<number>(Infinity, 1000); // all values within 1 second
timedReplay$.next(1); // emitted > 1s ago → won't be replayed
setTimeout(() => {
  timedReplay$.next(2); // within 1s window → will be replayed to late subscribers
}, 500);

// AsyncSubject — emits ONLY the last value, and ONLY on complete
const async$ = new AsyncSubject<number>();
async$.next(1);
async$.next(2);
async$.next(3);
async$.subscribe(v => console.log('Async:', v)); // nothing yet
async$.complete(); // NOW emits: 3 (last value before complete)
async$.subscribe(v => console.log('Late Async:', v)); // immediately emits: 3

/*
PRACTICAL USE CASES:
BehaviorSubject  → component state, current user, selected tab (needs initial value)
ReplaySubject(1) → event bus where late subscribers still need the last event
ReplaySubject(n) → caching last n API responses, undo/redo buffer
AsyncSubject     → Promise-like: emit single result when work completes (rarely used)

EVALUATION CRITERIA:
✓ BehaviorSubject.getValue() is synchronous — can be called outside reactive context
✓ BehaviorSubject requires initial value; ReplaySubject(1) does not
✓ ReplaySubject(1) replays even after complete (unlike BehaviorSubject which stops)
✓ AsyncSubject emits nothing until complete(), then only the last value
✓ ReplaySubject time window: only values within window are replayed
✓ BehaviorSubject.getValue() after error throws that error
✓ All Subjects are both Observable AND Observer — can next/error/complete AND subscribe
*/


// ============================================
// QUESTION 32: Multicasting with connect() and connectable()
// ============================================
/*
QUESTION:
RxJS 7 deprecated publish(), publishReplay(), multicast(). What replaced them?
Show how to use connectable() and connect() to implement a "publish-then-subscribe"
pattern where the source starts only after all subscribers are ready.

TRICKY PART: What is the difference between connectable() and share()?
When does connect() call the setup function?
*/

// import { connectable, Subject as RxSubject, interval as rxInterval } from 'rxjs';  // (removed duplicate import)
// import { take as rxTake, tap as rxTap } from 'rxjs/operators';  // (removed duplicate import)

// connectable() — creates a multicasted observable that doesn't start until .connect() is called
const source$ = rxInterval(500).pipe(rxTake(5), rxTap(v => console.log('produced:', v)));

const multicast$ = connectable(source$, {
  connector: () => new RxSubject(),  // the Subject used internally for multicasting
  resetOnDisconnect: true            // resets when all subscribers disconnect
});

// Subscribe before connecting — no values yet
const sub1 = multicast$.subscribe(v => console.log('Sub1:', v));
const sub2 = multicast$.subscribe(v => console.log('Sub2:', v));

// Start the source — both subscribers receive from the same producer
const connection = multicast$.connect();

// Disconnect when done
setTimeout(() => connection.unsubscribe(), 3000);

// connect() operator — inline alternative, receives subscriber setup function
// import { connect } from 'rxjs';  // (removed duplicate import)

rxInterval(500).pipe(
  rxTake(10),
  connect(shared$ => rxMerge(
    shared$.pipe(rxMap((v: number) => `A:${v}`)),
    shared$.pipe(rxMap((v: number) => `B:${v * 2}`))
  ))
).subscribe(console.log);
// single producer, two derived streams — both share the same subscription

/*
EVALUATION CRITERIA:
✓ publish() = connectable() with Subject connector; deprecated in RxJS 7+
✓ multicast(Subject) = connectable(); deprecated in RxJS 7+
✓ connectable() requires explicit .connect() — gives control over when source starts
✓ share() auto-connects on first subscriber, disconnects on last unsubscribe
✓ connect() operator replaces publish().refCount() pattern inline in the pipe
✓ resetOnDisconnect:true — source restarts on next subscribe after all unsub
✓ The connector factory (()=>new Subject()) is called fresh on each connect/reset
✓ Multiple subscribe()s before connect() = all get values from the same producer
*/


// ============================================
// QUESTION 33: Error Boundary Patterns — Survive Errors in Streams
// ============================================
/*
QUESTION:
Build a stream that: (1) never dies on error, (2) reports errors to a
separate error stream, and (3) retries transient errors but not permanent ones.
Distinguish between catchError returning EMPTY vs throwError vs of(fallback).

TRICKY PART: catchError that returns EMPTY completes the stream — is that
always what you want? What is the difference between retry(3) and
retryWhen for conditional retry logic?
*/

// import { EMPTY, Subject as ErrSubject, throwError as rxThrow, of as rxOf2 } from 'rxjs';  // (removed duplicate import)
// import { catchError, retry, retryWhen as retryWhenOp, tap as tapOp, mergeMap as mergeMapErr } from 'rxjs/operators';  // (removed duplicate import)

const errors$ = new ErrSubject<Error>(); // separate error reporting channel

function isTransient(err: any): boolean {
  return err?.status === 429 || err?.status >= 500; // rate-limit or server error
}

// Pattern: never-dying stream with error isolation
function resilientStream<T>(source: Observable<T>) {
  return source.pipe(
    catchError((err: Error) => {
      errors$.next(err); // report to error channel

      if (isTransient(err)) {
        // Return EMPTY — stream completes silently on transient error
        // Caller retries by re-subscribing (e.g., via switchMap or repeat)
        return EMPTY;
      }

      // Permanent error: re-throw (caller handles or stream dies)
      return rxThrow(() => err);
    })
  );
}

// EMPTY vs of(fallback) vs throwError:
// EMPTY    — complete without value; downstream gets no item, just complete
// of(val)  — emit fallback value then complete; downstream gets one item
// throwError — re-throw; downstream error handler or stream dies

// Conditional retry — retry transient, rethrow permanent
function smartRetry<T>(maxRetries: number) {
  return (source: Observable<T>): Observable<T> =>
    source.pipe(
      retryWhenOp(errors =>
        errors.pipe(
          mergeMapErr((err, i) => {
            if (!isTransient(err) || i >= maxRetries) return rxThrow(() => err);
            return timerOp(1000 * (i + 1)); // linear backoff
          })
        )
      )
    );
}

// retry(3) vs retryWhen:
// retry(3)   — retries up to 3 times immediately, no delay, no condition check
// retryWhen  — full control: delay, condition, dynamic retry count

/*
EVALUATION CRITERIA:
✓ catchError intercepts error, must return an Observable (replacement stream)
✓ EMPTY completes the stream — good for "swallow and move on" patterns
✓ of(fallback) emits a default value — good for graceful degradation
✓ throwError re-throws — let upstream handle it
✓ Separate error Subject: decouple error reporting from stream lifecycle
✓ retry(n) immediate retry, no delay — risky for API calls (hammer the server)
✓ retryWhen gives error-by-error control over delay and condition
✓ isTransient check prevents retrying 404 / 401 — only retry recoverable errors
*/


// ============================================
// QUESTION 34: Schedulers — Controlling Concurrency
// ============================================
/*
QUESTION:
Explain the four main RxJS schedulers and when to use each.
Show how asyncScheduler vs queueScheduler changes the execution order
of a synchronous observable. What does observeOn() do vs subscribeOn()?

TRICKY PART: queueScheduler is synchronous but orders recursion — what problem
does it solve that plain synchronous execution can't? Why does animationFrameScheduler
matter for smooth animations?
*/

import {
  asyncScheduler, queueScheduler, animationFrameScheduler, asapScheduler,
  scheduled, observeOn, subscribeOn, of as ofScheduler
} from 'rxjs';

// asyncScheduler — uses setTimeout(fn, 0) — macrotask queue
ofScheduler(1, 2, 3, asyncScheduler).subscribe(v => console.log('async:', v));
// Logs AFTER synchronous code finishes (macrotask)

// asapScheduler — uses Promise.resolve() — microtask queue
ofScheduler(1, 2, 3, asapScheduler).subscribe(v => console.log('asap:', v));
// Logs after current sync, before next macrotask

// queueScheduler — synchronous BUT flushes recursive schedules in order
// Prevents stack overflow for deeply recursive synchronous operators
ofScheduler(1, 2, 3, queueScheduler).subscribe(v => console.log('queue:', v));
// Logs synchronously: 1, 2, 3 immediately

// animationFrameScheduler — uses requestAnimationFrame — 60fps rendering
scheduled([0, 25, 50, 75, 100], animationFrameScheduler).pipe(
  rxMap((v: number) => `${v}%`)
).subscribe(v => {
  document.getElementById('progress')!.style.width = v;
  // Each emission synced to browser paint cycle — smooth animation
});

// observeOn — DOWNSTREAM: values delivered on specified scheduler
// subscribeOn — UPSTREAM: where the subscription work (producer) runs
rxOf2(1, 2, 3).pipe(
  observeOn(asyncScheduler),  // observer callbacks run async
  // subscribeOn(asyncScheduler) — producer runs async (useful for cold observables)
).subscribe(v => console.log('on async scheduler:', v));

/*
EVALUATION CRITERIA:
✓ asyncScheduler = setTimeout → macrotask; asapScheduler = Promise → microtask
✓ queueScheduler = synchronous but prevents recursive stack overflow
✓ animationFrameScheduler syncs emissions to browser paint (rAF)
✓ observeOn: controls where observer (next/error/complete) callbacks execute
✓ subscribeOn: controls where the subscribe() setup and producer run
✓ scheduled() creates an observable that emits on a given scheduler
✓ Use asyncScheduler in tests to control time; use animationFrame for animations
✓ Default RxJS operators don't add schedulers — fully synchronous by default
*/


// ============================================
// QUESTION 35: Window and Buffer Operators
// ============================================
/*
QUESTION:
Explain the difference between buffer vs window, and bufferCount vs bufferTime
vs bufferWhen. Build a "batch API calls" stream that collects user actions for
200ms and sends them in a single HTTP request. Then show windowCount for
pagination-style processing.

TRICKY PART: window returns Observable<Observable<T>> — you must flatMap the inner.
buffer returns Observable<T[]>. Which is more memory-efficient for large streams?
*/

import {
  bufferTime, bufferCount, bufferWhen, windowCount, windowTime,
  mergeMap as bufMerge, filter as bufFilter, interval as bufInterval
} from 'rxjs/operators';

// buffer — collects emissions into arrays, emits array as single value
const clicks$ = fromEvent(document, 'click');

// bufferTime — batch every 200ms
clicks$.pipe(
  bufferTime(200),
  bufFilter((batch: any[]) => batch.length > 0), // skip empty windows
  bufMerge((batch: any[]) => {
    // send entire batch as single HTTP POST
    return of(`sent ${batch.length} events`);
  })
).subscribe(console.log);

// bufferCount — collect exactly n items
bufInterval(100).pipe(
  bufferCount(5),       // emit array of 5; next starts immediately
  // bufferCount(5, 3) — emit 5, slide by 3 (overlapping windows)
).subscribe(batch => console.log('batch:', batch));

// window — emits Observable<T> for each window (lazy, streaming)
bufInterval(100).pipe(
  windowCount(5),
  bufMerge((win$: Observable<number>) => win$.pipe(
    // Process each window as a stream — more memory-efficient for large windows
    rxMap((v: number) => v * 2)
  ))
).subscribe(console.log);

// bufferWhen — dynamic boundary via closing observable
const bufferBoundary$ = () => bufInterval(200 + Math.random() * 300); // variable window
clicks$.pipe(
  bufferWhen(bufferBoundary$)
).subscribe(batch => console.log('variable batch:', batch.length));

/*
EVALUATION CRITERIA:
✓ buffer: collects into T[], emits array — simple, holds all items in memory
✓ window: emits Observable<T> for each window — streaming, more memory-efficient
✓ bufferTime(ms) — fixed time window
✓ bufferCount(n) — fixed count window; bufferCount(n, skip) for sliding window
✓ bufferWhen(() => obs$) — boundary controlled by closing observable
✓ windowCount/windowTime mirror buffer* but return higher-order observables
✓ Batch API pattern: bufferTime + filter(non-empty) + mergeMap(sendBatch)
✓ Memory: window is lazy — items processed and GC'd as they flow through
*/


// ============================================
// QUESTION 36: combineLatest vs zip vs withLatestFrom vs forkJoin
// ============================================
/*
QUESTION:
Show a scenario where combineLatest gives wrong results but withLatestFrom
is correct. Then explain when zip is appropriate and why forkJoin is the
"Promise.all" of RxJS. What is the subscription timing difference between
combineLatest and zip?

TRICKY PART: combineLatest emits on EVERY source emission after all have
emitted at least once — this can cause double-calculation. How do you
debounce it?
*/

// import { combineLatest, zip, forkJoin } from 'rxjs';  // (removed duplicate import)
// import { withLatestFrom, debounceTime as dbt } from 'rxjs/operators';  // (removed duplicate import)

const price$ = new BehaviorSubject(100);
const quantity$ = new BehaviorSubject(2);
const taxRate$ = new BehaviorSubject(0.1);

// combineLatest — recalculates when ANY source emits
// PROBLEM: if price and quantity update simultaneously (batched), fires twice
const total$ = combineLatest([price$, quantity$, taxRate$]).pipe(
  rxMap(([p, q, t]) => p * q * (1 + t)),
  dbt(0), // FIX: debounce to handle simultaneous emissions as one
);

// withLatestFrom — trigger from ONE source, sample others at that moment
// Use case: submit button click + current form state
const submit$ = fromEvent(document.querySelector('form')!, 'submit');
submit$.pipe(
  withLatestFrom(price$, quantity$),
  rxMap(([_, p, q]) => ({ price: p, quantity: q }))
).subscribe(order => console.log('Order:', order));
// quantity$/price$ changes don't trigger emissions — only submit$ does

// zip — pairs emissions by INDEX; waits for matching index from each source
// Use case: combine two streams that produce matching pairs (e.g., request+response logging)
zip(
  of('req1', 'req2', 'req3'),
  of('res1', 'res2', 'res3').pipe(delay(100))
).subscribe(([req, res]) => console.log(req, '->', res));
// Pairs: ['req1','res1'], ['req2','res2'], ['req3','res3']

// forkJoin — waits for ALL sources to complete, emits last value of each
// Use case: parallel HTTP calls (like Promise.all)
forkJoin({
  user: of({ id: 1, name: 'Alice' }).pipe(delay(100)),
  posts: of([{ title: 'Post 1' }]).pipe(delay(200)),
  prefs: of({ theme: 'dark' }).pipe(delay(50)),
}).subscribe(({ user, posts, prefs }) => {
  console.log(user.name, posts.length, prefs.theme);
});
// Emits only once when ALL complete; if ANY errors, result errors

/*
EVALUATION CRITERIA:
✓ combineLatest: emits when ANY source emits (after all have emitted once)
✓ withLatestFrom: trigger drives emission; others are sampled — no spurious fires
✓ zip: index-based pairing; waits for matching nth emission from each source
✓ forkJoin: waits for all to complete; emits array/object of last values
✓ combineLatest + debounce(0): coalesces simultaneous emissions into one
✓ forkJoin errors immediately if any source errors (no partial results)
✓ zip with infinite observable + finite = completes when shortest completes
✓ withLatestFrom doesn't subscribe to "latest" sources — they must already be active
*/


// ============================================
// QUESTION 37: takeUntil Patterns and Subscription Lifecycle
// ============================================
/*
QUESTION:
Show three patterns for unsubscribing from observables and explain the
pitfalls of each. Why is takeUntil(destroy$) called "the most dangerous
operator in Angular"? What is the correct placement of takeUntil in a
pipe chain?

TRICKY PART: If takeUntil is not the LAST operator, inner operators may
still run after unsubscription. Show what goes wrong and how to fix it.
*/

// import { Subject as DestroySubject } from 'rxjs';  // (removed duplicate import)
// import { takeUntil, switchMap as swMap, catchError as catchErrTU } from 'rxjs/operators';  // (removed duplicate import)

// Pattern 1: Subscription variable + manual unsubscribe
// const sub = obs$.subscribe(...);
// ngOnDestroy() { sub.unsubscribe(); }
// PITFALL: Easy to forget; must track every subscription

// Pattern 2: takeUntil with destroy$ Subject
class ComponentTU {
  private destroy$ = new DestroySubject<void>();

  ngOnInit() {
    interval(1000).pipe(
      switchMap(() => of('data')),
      // WRONG PLACEMENT — takeUntil before catchError:
      // takeUntil(this.destroy$),
      // catchError(err => of('fallback')), // catchError re-subscribes after destroy!

      // CORRECT — takeUntil LAST (except for operators that must be outermost)
      catchErrTU(err => of('fallback')),
      takeUntil(this.destroy$) // must be the outermost operator in most cases
    ).subscribe(console.log);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete(); // prevent memory leak in Subject itself
  }
}

// WHY "DANGEROUS": if takeUntil is placed before switchMap/mergeMap,
// the outer stream unsubscribes but inner observables may still run
// Example of the bug:
// interval(100).pipe(
//   takeUntil(destroy$),    // ← unsubscribes outer
//   mergeMap(() => http.get('/api').pipe(tap(() => console.log('still running!'))))
//   // inner http.get() was already subscribed BEFORE unsubscription — still runs!
// )

// Pattern 3: async pipe (Angular) — automatic unsubscription in template
// {{ data$ | async }} — Angular handles subscribe/unsubscribe with component lifecycle

// Pattern 4: takeUntilDestroyed() (Angular 16+)
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// interval(1000).pipe(takeUntilDestroyed()).subscribe(...) // in constructor/field init

/*
EVALUATION CRITERIA:
✓ takeUntil must be the LAST operator to prevent inner observable leaks
✓ destroy$.complete() is required — otherwise Subject itself leaks
✓ catchError after takeUntil can re-subscribe, defeating the takeUntil
✓ mergeMap/switchMap inner observables are NOT automatically cancelled by outer takeUntil
✓ async pipe is the safest Angular pattern — zero manual unsubscription
✓ takeUntilDestroyed() (Angular 16+) uses DestroyRef internally — works in injection context
✓ first() / take(1) for one-shot observables — no explicit cleanup needed
✓ Subscription.add() for grouping multiple subscriptions into one
*/


// ============================================
// QUESTION 38: RxJS and State — Scan, Reduce, Accumulation
// ============================================
/*
QUESTION:
Build a Redux-style state machine using scan(). Show the difference between
scan() (emits every accumulated value) and reduce() (emits only on complete).
Then implement an undo/redo stack using scan with a state history buffer.

TRICKY PART: scan's accumulator starts with the seed value. What happens
if no seed is provided and the source emits only one value?
*/

// import { scan, reduce, startWith } from 'rxjs/operators';  // (removed duplicate import)
// import { Subject as ActionSubject } from 'rxjs';  // (removed duplicate import)

// Redux-style state machine with scan()
interface AppState {
  count: number;
  items: string[];
}

type Action =
  | { type: 'INCREMENT' }
  | { type: 'ADD_ITEM'; payload: string }
  | { type: 'RESET' };

const initialState: AppState = { count: 0, items: [] };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'ADD_ITEM':  return { ...state, items: [...state.items, action.payload] };
    case 'RESET':     return initialState;
    default:          return state;
  }
}

const actions$ = new ActionSubject<Action>();
const state$ = actions$.pipe(
  scan(reducer, initialState), // emits NEW state after each action
  startWith(initialState)       // emit initial state immediately before any actions
);

state$.subscribe(state => console.log('State:', state));
actions$.next({ type: 'INCREMENT' });
actions$.next({ type: 'ADD_ITEM', payload: 'hello' });

// scan vs reduce:
// scan: emits accumulated value after EACH source emission
// reduce: emits accumulated value ONLY after source completes

of(1, 2, 3, 4, 5).pipe(
  scan((acc, val) => acc + val, 0)
).subscribe(console.log);    // 1, 3, 6, 10, 15

of(1, 2, 3, 4, 5).pipe(
  reduce((acc, val) => acc + val, 0)
).subscribe(console.log);   // 15 (only once, after complete)

// No seed provided — first emission is used as seed (accumulator called from index 1)
of(10, 20, 30).pipe(
  scan((acc, val) => acc + val) // no seed: acc=10 first, then 10+20=30, then 30+30=60
).subscribe(console.log); // 10, 30, 60

// Undo/redo using scan — maintain history buffer
interface HistoryState<S> { past: S[]; present: S; future: S[]; }

/*
EVALUATION CRITERIA:
✓ scan(reducer, seed) — emits running accumulation; does NOT wait for complete
✓ reduce(reducer, seed) — waits for complete, emits final accumulated value
✓ startWith(initial) — emits before first action; subscribers get initial state immediately
✓ Without seed: first emission = initial accumulator; reduce/scan starts from index 1
✓ Redux pattern: actions$ Subject + scan(reducer) = observable state machine
✓ History pattern: accumulate array of past states + current in scan
✓ scan vs reduce performance: reduce holds all values in memory until complete
✓ Immutable state updates in reducer — spread operator for new references
*/


// ============================================
// QUESTION 39: fromEvent Deep Dive — Events and Cleanup
// ============================================
/*
QUESTION:
Show how fromEvent wraps both DOM EventTarget and Node.js EventEmitter.
Build a drag observable using three composed fromEvent streams. Explain
why fromEvent is cold and how that affects multiple subscribers. Show
how to prevent memory leaks with takeUntil on drag streams.

TRICKY PART: What happens if you create fromEvent on a target that gets
removed from the DOM while the subscription is still active?
*/

// import { fromEvent as rxFromEvent, merge as rxMerge2 } from 'rxjs';  // (removed duplicate import)
// import { takeUntil as tul, map as evtMap, switchMap as evtSwitch, tap as evtTap } from 'rxjs/operators';  // (removed duplicate import)

// fromEvent is COLD — each subscriber attaches its own listener
const click1$ = rxFromEvent<MouseEvent>(document, 'click');
const click2$ = rxFromEvent<MouseEvent>(document, 'click');
// click1$ and click2$ each add a separate 'click' event listener to document
// Subscribing twice = two listeners = double handling

// FIX for shared event: share() — one listener, multiple observers
const sharedClick$ = rxFromEvent<MouseEvent>(document, 'click').pipe(share());

// Drag observable — composed from mousedown, mousemove, mouseup
function makeDraggable(element: HTMLElement) {
  const destroy$ = new DestroySubject<void>();

  const mousedown$ = rxFromEvent<MouseEvent>(element, 'mousedown');
  const mousemove$ = rxFromEvent<MouseEvent>(document, 'mousemove');
  const mouseup$   = rxFromEvent<MouseEvent>(document, 'mouseup');

  const drag$ = mousedown$.pipe(
    evtTap(e => e.preventDefault()),
    evtSwitch(startEvent => {
      const startX = startEvent.clientX - element.offsetLeft;
      const startY = startEvent.clientY - element.offsetTop;

      return mousemove$.pipe(
        evtMap(moveEvent => ({
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        })),
        tul(mouseup$) // stop tracking when mouse released
      );
    }),
    tul(destroy$) // cleanup when component destroyed
  );

  drag$.subscribe(({ x, y }) => {
    element.style.left = `${x}px`;
    element.style.top  = `${y}px`;
  });

  return () => { destroy$.next(); destroy$.complete(); };
}

// Node.js EventEmitter — fromEvent works with addListener/removeListener interface
// import { EventEmitter } from 'events';
// const emitter = new EventEmitter();
// fromEvent(emitter, 'data').subscribe(console.log);

// REMOVED DOM NODE — subscription keeps the node in memory (detached DOM leak)
// Even if element is removed from DOM, fromEvent listener holds a reference
// FIX: unsubscribe (takeUntil) before removing element from DOM

/*
EVALUATION CRITERIA:
✓ fromEvent is cold — each subscriber attaches a new event listener
✓ share() makes it hot — one listener, multiple observers
✓ Drag: mousedown → switchMap(mousemove) → takeUntil(mouseup) — classic composition
✓ takeUntil(mouseup$) completes inner stream on release; outer stream stays alive
✓ destroy$ outer takeUntil removes mousedown listener entirely on cleanup
✓ Detached DOM nodes: listeners keep node in memory — always unsubscribe first
✓ fromEvent works with any object implementing addEventListener/removeEventListener
✓ fromEvent(emitter, 'event') supports Node.js EventEmitter via addListener/removeListener
*/


// ============================================
// QUESTION 40: RxJS Interop — Signals, Promises, Async/Await
// ============================================
/*
QUESTION:
Show how to convert between Observable, Signal, and Promise in Angular 16+.
Use toSignal() and toObservable() from @angular/core/rxjs-interop. Then show
firstValueFrom() and lastValueFrom() as the modern replacements for .toPromise().
What are the pitfalls of mixing async/await with observables?

TRICKY PART: toSignal() requires an injection context. What happens if the
observable errors? What does the initialValue option do? How does
firstValueFrom() differ from take(1) followed by toPromise()?
*/

// import { toSignal, toObservable } from '@angular/core/rxjs-interop';
// import { firstValueFrom, lastValueFrom } from 'rxjs';

// toSignal — wraps an Observable into a Signal (requires injection context)
// const userSignal = toSignal(user$);
// toSignal(user$, { initialValue: null })  — avoids Signal<User | undefined>
// toSignal(user$, { requireSync: true })   — source must emit synchronously (e.g., BehaviorSubject)
// If observable errors → error is thrown when signal is read

// toObservable — wraps a Signal into an Observable
// const count$ = toObservable(countSignal); // emits on every signal change

// firstValueFrom / lastValueFrom — Promise-based extraction from Observable
async function getUserName(): Promise<string> {
  // firstValueFrom: resolves with FIRST emission, then unsubscribes
  // Replaces obs$.pipe(take(1)).toPromise() — safer typing, throws on empty
  // const name = await firstValueFrom(userName$);

  // lastValueFrom: resolves with LAST emission after source COMPLETES
  // Replaces obs$.toPromise() — but ONLY for finite observables
  // const name = await lastValueFrom(userName$.pipe(take(5)));

  return 'Alice'; // placeholder
}

// PITFALL — await on infinite observable NEVER resolves:
// const result = await firstValueFrom(interval(1000)); // resolves with 0 after 1s — OK
// const result = await lastValueFrom(interval(1000));  // NEVER resolves — infinite!

// from() — Observable from Promise (bridge the other direction)
// import { from as rxFromPromise } from 'rxjs';  // (removed duplicate import)
const fromFetch$ = rxFromPromise(fetch('/api/data').then(r => r.json()));
// from(promise) — cold observable; re-runs fetch on each subscribe!

// MIXING PITFALL: async/await swallows observable lifecycle
// async fetchAndProcess() {
//   const data = await firstValueFrom(data$); // single extraction
//   process(data); // if data$ emits multiple times, only first is used
// }

/*
EVALUATION CRITERIA:
✓ toSignal() reads observable in injection context — works in constructor/field init
✓ initialValue option types Signal<T> instead of Signal<T | undefined>
✓ requireSync: true throws if observable doesn't emit synchronously (good for BehaviorSubject)
✓ toObservable() emits synchronously on subscribe then on every signal change
✓ firstValueFrom() = take(1) + toPromise() but with EmptyError on empty observable
✓ lastValueFrom() requires observable to complete — never resolves on infinite streams
✓ from(promise) is cold — each subscription re-runs the promise factory
✓ .toPromise() deprecated in RxJS 7 — use firstValueFrom/lastValueFrom
*/


// ============================================
// QUESTION 41: Avoiding Common RxJS Pitfalls
// ============================================
/*
QUESTION:
Identify and fix the bug in each of the following code snippets. Explain
why each is wrong and give the correct pattern.
*/

// import { of as bugOf, interval as bugInterval } from 'rxjs';  // (removed duplicate import)
// import { tap as bugTap, map as bugMap } from 'rxjs/operators';  // (removed duplicate import)

// BUG 1: Nested subscribe (subscribe inside subscribe)
// WRONG:
// userIds$.subscribe(id => {
//   userService.getUser(id).subscribe(user => console.log(user)); // NESTED!
// });
// PROBLEM: Each outer emission creates an unmanaged inner subscription — leaks
// FIX: Use mergeMap / switchMap
// userIds$.pipe(mergeMap(id => userService.getUser(id))).subscribe(console.log);

// BUG 2: Forgetting to subscribe (cold observable never executes)
const sideEffect$ = bugOf(1, 2, 3).pipe(
  bugTap(v => console.log('side effect:', v))
);
// sideEffect$ defined but never subscribed — nothing happens!
// FIX: sideEffect$.subscribe();
// BETTER: tap is for side effects, not the primary purpose — rethink design

// BUG 3: Mutating state in map instead of using scan
const state: number[] = [];
bugOf(1, 2, 3).pipe(
  bugMap(v => { state.push(v); return state; }) // MUTATION — state is shared reference
).subscribe(s => console.log(s)); // all emissions show same mutated array!
// FIX: Use scan with immutable updates
// of(1,2,3).pipe(scan((acc, v) => [...acc, v], [])).subscribe(console.log);

// BUG 4: Using share() when shareReplay(1) is needed
// const data$ = http.get('/api').pipe(share());
// data$.subscribe(handler1); // subscribes, triggers HTTP call
// setTimeout(() => data$.subscribe(handler2), 2000); // new HTTP call! (share refCounts to 0)
// FIX: shareReplay({ bufferSize: 1, refCount: true }) caches and replays

// BUG 5: Error not caught — stream dies silently
// interval(1000).pipe(
//   mergeMap(i => i === 3 ? throwError('oops') : of(i))
//   // No catchError — on i===3, entire stream terminates
// ).subscribe(console.log, err => console.error(err)); // error handler fires, stream done
// FIX: catchError inside mergeMap so only that inner observable errors, outer continues
// mergeMap(i => of(i).pipe(catchError(() => EMPTY)))

/*
EVALUATION CRITERIA:
✓ Nested subscribe = unmanaged subscriptions, potential race conditions, memory leaks
✓ Cold observables don't execute without subscribe — forgetting subscribe is a no-op
✓ Mutating external state in map breaks referential integrity — use scan + immutability
✓ share() refCounts — late subscriber after count=0 triggers new source subscription
✓ Error in outer stream kills entire stream — catch errors at the inner level
✓ tap is for side effects only — never use map for side effects (confusing, wrong)
✓ switchMap vs mergeMap: if old inner must be cancelled on new outer, use switchMap
✓ Subscribing in constructor (not ngOnInit) means subscription before view is ready
*/


// ============================================
// QUESTION 42: RxJS with WebSockets — Real-time Streams
// ============================================
/*
QUESTION:
Build a WebSocket observable that: auto-reconnects on error with exponential
backoff, multiplexes multiple logical channels over one connection, and
properly closes the socket on unsubscription.

TRICKY PART: WebSocket.readyState — what happens if you send a message before
the connection is open? How does RxJS webSocket() handle buffering? What is
the difference between socket.multiplex() and using a Subject?
*/

// import { webSocket, WebSocketSubject } from 'rxjs/webSocket';  // (removed duplicate import)
// import { retryWhen as wsRetry, delay as wsDelay, tap as wsTap, filter as wsFilter } from 'rxjs/operators';  // (removed duplicate import)

// RxJS webSocket() — creates a WebSocketSubject (both Observable and Observer)
function createWebSocketConnection(url: string) {
  const socket$: WebSocketSubject<any> = webSocket({
    url,
    openObserver: { next: () => console.log('WS connected') },
    closeObserver: { next: () => console.log('WS closed') },
    // serializer: (msg) => JSON.stringify(msg),   // default
    // deserializer: (event) => JSON.parse(event.data), // default
  });

  // Auto-reconnect with exponential backoff
  return socket$.pipe(
    wsRetry(errors =>
      errors.pipe(
        wsTap(err => console.error('WS error, reconnecting...', err)),
        wsDelay(1000) // wait 1s before reconnect (add exponential logic here)
      )
    )
  );
}

// Multiplexing — multiple logical channels over one physical WS connection
function createChannel(socket$: WebSocketSubject<any>, channel: string) {
  return socket$.multiplex(
    () => ({ subscribe: channel }),     // sent to server on subscribe
    () => ({ unsubscribe: channel }),   // sent to server on unsubscribe
    msg => msg.channel === channel      // filter: only this channel's messages
  );
}

// const ws$ = createWebSocketConnection('wss://api.example.com/ws');
// const prices$ = createChannel(ws$, 'prices');
// const notifications$ = createChannel(ws$, 'notifications');
// prices$.subscribe(price => console.log('Price:', price));
// notifications$.subscribe(notif => console.log('Notification:', notif));
// When prices$ unsubscribes → sends {unsubscribe:'prices'} to server

// Sending messages: socket$.next({ type: 'ping' }) — buffered if not yet open
// WebSocketSubject buffers messages during connection setup automatically

// Manual WebSocket observable (without RxJS webSocket helper)
function rawWebSocket$(url: string): Observable<MessageEvent> {
  return new Observable(subscriber => {
    const ws = new WebSocket(url);
    ws.onmessage = event => subscriber.next(event);
    ws.onerror = err => subscriber.error(err);
    ws.onclose = () => subscriber.complete();
    return () => ws.close(); // cleanup on unsubscribe
  });
}

/*
EVALUATION CRITERIA:
✓ webSocket() creates WebSocketSubject — acts as both source and sink
✓ Messages sent before open are buffered internally by WebSocketSubject
✓ retryWhen on webSocket$ triggers reconnection after error/close
✓ multiplex() sends subscribe/unsubscribe messages and filters by predicate
✓ Unsubscribing a multiplexed channel sends the unsubscribe message — server-side cleanup
✓ Custom WebSocket observable: cleanup function (return () => ws.close()) is critical
✓ onopen/onclose/onerror are callbacks — map them to subscriber methods
✓ One WS connection shared via multiplex is far more efficient than one per channel
*/


// ============================================
// QUESTION 43: Imperative to Reactive Refactoring
// ============================================
/*
QUESTION:
Refactor the following imperative code into a fully reactive RxJS pipeline.
The original code: polls an API every 5s, retries on failure, emits only when
data changes, logs the change, and cancels polling when a stop signal fires.

TRICKY PART: distinctUntilChanged does a shallow equality check. How do you
compare objects by a specific key? Does polling restart if the stop signal
fires and a new start signal fires later?
*/

// import { timer as pollTimer, NEVER } from 'rxjs';  // (removed duplicate import)
import {
  switchMap as pollSwitch, repeatWhen, delay as pollDelay,
  distinctUntilChanged as duc, pluck, catchError as pollCatch,
  takeUntil as pollTU
} from 'rxjs/operators';

// IMPERATIVE (what to refactor):
// let pollId;
// async function startPolling(stopSignal) {
//   while (!stopSignal.aborted) {
//     try {
//       const data = await fetch('/api/status').then(r => r.json());
//       if (data.version !== lastVersion) { log(data); lastVersion = data.version; }
//     } catch (e) { /* retry */ }
//     await sleep(5000);
//   }
// }

// REACTIVE EQUIVALENT:
const stop$ = new DestroySubject<void>();
const apiUrl = '/api/status';

const polling$ = pollTimer(0, 5000).pipe(         // emit at 0ms then every 5s
  pollSwitch(() =>
    of(apiUrl).pipe(                               // trigger HTTP fetch
      pollSwitch(url => of({ version: 1, data: 'mock' }).pipe(pollDelay(100))),
      pollCatch(err => {
        console.error('Fetch failed:', err);
        return EMPTY;                              // skip this tick on error
      })
    )
  ),
  duc((a, b) => a.version === b.version),         // custom comparator by key
  bugTap(data => console.log('Data changed:', data)),
  pollTU(stop$)                                   // cancel entire polling
);

polling$.subscribe();

// To restart polling after stop: use Subject to control start/stop
const startStop$ = new BehaviorSubject<boolean>(true);
const controlledPolling$ = startStop$.pipe(
  pollSwitch(active =>
    active
      ? pollTimer(0, 5000).pipe(pollSwitch(() => of('data')))
      : NEVER  // NEVER completes but emits nothing — pauses without unsubscribing
  )
);

/*
EVALUATION CRITERIA:
✓ timer(0, interval) replaces setInterval — emits immediately then on interval
✓ switchMap on timer: each tick triggers new HTTP request, cancels previous if slow
✓ catchError returning EMPTY: skip failed ticks, continue polling
✓ distinctUntilChanged(comparator) for deep/custom equality comparison
✓ takeUntil(stop$) cleanly terminates the entire polling chain
✓ NEVER observable: emits nothing, never completes — useful for "pause" state
✓ BehaviorSubject + switchMap: dynamic start/stop without recreating the chain
✓ Reactive chain is declarative — no mutable state variables needed
*/


// ============================================
// QUESTION 44: RxJS Performance — Operator Overhead and Optimization
// ============================================
/*
QUESTION:
Identify the performance issues in the following pipeline and suggest fixes.
Explain how operator fusion works in RxJS and when map+map is optimized.
When should you use auditTime() vs throttleTime() vs debounceTime()?

TRICKY PART: RxJS does NOT do operator fusion automatically (unlike most
stream libraries). Each pipe() call adds a wrapper. How many subscriptions
does a 10-operator pipeline create?
*/

// import { throttleTime, auditTime, debounceTime, sampleTime } from 'rxjs/operators';  // (removed duplicate import)

// PERFORMANCE ISSUE 1: Multiple map operators that can be merged
const inefficient$ = bugOf(1, 2, 3).pipe(
  bugMap(x => x * 2),
  bugMap(x => x + 1),
  bugMap(x => x.toString())
);
// Each map() adds one subscription layer — 3 layers for 3 maps
// FIX: compose into single map
const efficient$ = bugOf(1, 2, 3).pipe(
  bugMap(x => (x * 2 + 1).toString()) // one layer, same result
);

// PERFORMANCE ISSUE 2: Wrong time operator for scroll events
const scroll$ = rxFromEvent(window, 'scroll');
// debounceTime(200) — fires 200ms AFTER user STOPS scrolling (delay on trailing edge)
// throttleTime(200) — fires at MOST once per 200ms (leading edge by default)
// auditTime(200)    — fires once per 200ms on TRAILING edge (like throttle but trailing)
// sampleTime(200)   — fires every 200ms regardless, emitting latest value

// For scroll position updates: auditTime(16) — once per frame
scroll$.pipe(auditTime(16)).subscribe(updateScrollPosition);

// For autocomplete: debounceTime(300) — wait until typing pauses
fromEvent(document, 'keyup').pipe(debounceTime(300)).subscribe(search);

// For button click rate limit: throttleTime(1000) — max once per second
fromEvent(document.querySelector('button')!, 'click')
  .pipe(throttleTime(1000))
  .subscribe(handleClick);

// OPERATOR COUNT: each pipe operator creates one new Observable wrapper
// 10 operators = 10 Observable wrappers = 10 subscription levels
// RxJS does NOT auto-fuse — minimize operator count for hot high-frequency streams

// PERFORMANCE ISSUE 3: share() in wrong position — multicasting before heavy operators
// BAD: heavy computation per subscriber
// hot$.pipe(heavyMap(), share()) — each subscriber runs heavyMap independently
// GOOD: share before heavy computation
// hot$.pipe(share(), heavyMap()) — one producer, heavy computation once, shared

function updateScrollPosition() {}
function search() {}
function handleClick() {}

/*
EVALUATION CRITERIA:
✓ Multiple map() = multiple operator wrappers — merge into single map when possible
✓ debounceTime: fires after silence period (trailing edge, resets on each emission)
✓ throttleTime: fires immediately, ignores for the window (leading edge by default)
✓ auditTime: fires once at end of window — best for scroll/resize position reads
✓ sampleTime: timer-driven sampling regardless of source activity
✓ share() placement: before heavy operators = compute once; after = compute per subscriber
✓ RxJS has no automatic operator fusion — developer must manually merge
✓ For high-frequency events (mousemove): always apply auditTime/throttleTime early
*/


// ============================================
// QUESTION 45: RxJS in Node.js — Streams, CLI Tools, and Pipelines
// ============================================
/*
QUESTION:
Show how to use RxJS with Node.js Readable streams, file system operations,
and as a build pipeline. Convert a Node.js stream to an Observable. Build a
concurrent file processor that reads N files in parallel but processes results
in order. Explain how RxJS fits into Node.js vs using native async generators.

TRICKY PART: Node.js streams and RxJS observables have different backpressure
models. How do you prevent a fast source from overwhelming a slow consumer
in RxJS?
*/

// import { Observable as NodeObs, from as nodeFrom, bindNodeCallback } from 'rxjs';  // (removed duplicate import)
// import { mergeMap as nodeMerge, concatMap as nodeConcat, bufferCount as nodeBuf } from 'rxjs/operators';  // (removed duplicate import)

// Convert Node.js Readable stream to Observable
function fromReadableStream<T = Buffer>(readable: NodeJS.ReadableStream): NodeObs<T> {
  return new NodeObs(subscriber => {
    readable.on('data', chunk => subscriber.next(chunk as T));
    readable.on('end', () => subscriber.complete());
    readable.on('error', err => subscriber.error(err));
    return () => {
      // Backpressure: pause the stream when unsubscribed
      if (typeof (readable as any).destroy === 'function') {
        (readable as any).destroy();
      }
    };
  });
}

// Concurrent file reads with ordered output — mergeMap (parallel) + concatMap (ordered)
// Read files concurrently but emit results in input order:
// import { readFile } from 'fs';  // (removed duplicate import)
const readFile$ = bindNodeCallback(readFile); // converts (path, cb) into Observable

const filePaths = ['file1.txt', 'file2.txt', 'file3.txt', 'file4.txt'];

nodeFrom(filePaths).pipe(
  nodeMerge(path => readFile$(path), 3), // read up to 3 files concurrently (concurrency=3)
).subscribe(content => console.log(content.toString()));

// Ordered output — concatMap (serial: one at a time)
nodeFrom(filePaths).pipe(
  nodeConcat(path => readFile$(path)), // reads one by one in order, waits for each
).subscribe(content => console.log(content.toString()));

// Pipeline pattern — file transform pipeline
nodeFrom(filePaths).pipe(
  nodeMerge(path => readFile$(path), 2),         // read 2 at a time
  bugMap(buf => buf.toString().toUpperCase()),    // transform
  nodeBuf(2),                                    // batch results
  nodeConcat(batch => nodeFrom(batch)),           // flatten batches in order
).subscribe(console.log);

// BACKPRESSURE in RxJS: no built-in backpressure like Node.js streams
// Strategies:
// 1. mergeMap(fn, concurrency) — limit concurrent subscriptions
// 2. bufferTime/bufferCount — batch fast emissions
// 3. throttleTime/auditTime — rate-limit the source
// 4. Pause/resume source (Node streams): call readable.pause() in subscriber

/*
EVALUATION CRITERIA:
✓ bindNodeCallback converts (path, callback) Node APIs to Observable
✓ fromReadableStream: on('data') = next, on('end') = complete, on('error') = error
✓ mergeMap(fn, concurrency) limits parallel subscriptions — prevents overwhelming
✓ concatMap: serial processing — guaranteed order, one at a time
✓ RxJS has no native backpressure — must use concurrency limits or rate operators
✓ Node.js streams have pull-based backpressure (pause/resume) — fundamentally different
✓ bindNodeCallback vs fromPromise: for Node callback-style APIs vs promise-returning APIs
✓ RxJS shines for complex transformation pipelines; native streams for raw throughput
*/
