# Senior Frontend Interview — 10th June
**Candidate:** 23 years experience | JS, React, Node, Angular, Vue  
**Interviewer:** 11 years experience  
**Format:** Questions build iteratively — each section escalates in depth.

---

## SECTION 1 — JavaScript Core & Tricky Fundamentals

---

### Q1. Event Loop Warm-up
**What is the output and why?**
```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```
**Expected:** `1 → 4 → 3 → 2`  
**Look for:** Understanding of call stack, microtask queue (Promises) vs macrotask queue (setTimeout). Candidate should explain that microtasks drain before the next macrotask.

---

### Q2. Escalation — Nested Microtasks + setTimeout
**Now what is the output?**
```js
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('promise 1');
    setTimeout(() => console.log('timeout inside promise'), 0);
  })
  .then(() => console.log('promise 2'));

console.log('end');
```
**Expected:** `start → end → promise 1 → promise 2 → timeout 1 → promise inside timeout → timeout inside promise`  
**Look for:** Deep understanding that a setTimeout scheduled inside a microtask goes to the END of the macrotask queue, after already-queued macrotasks.

---

### Q3. Closures & Variable Capture
**Classic trap — what does this print?**
```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
```
**Follow-up:** Fix it 3 different ways.  
**Expected fixes:**
1. `let` instead of `var`
2. IIFE: `(function(j){ setTimeout(() => console.log(j), 0); })(i)`
3. `setTimeout(console.log, 0, i)` — passing `i` as argument

**Look for:** Understanding of closure over `var` vs block-scoped `let`, and that `setTimeout` delay 0 still runs after the loop finishes.

---

### Q4. `this` Binding & Arrow Functions
**What does this log?**
```js
const obj = {
  name: 'Alice',
  greet: function () {
    const inner = () => console.log(this.name);
    inner();
  },
  greetRegular: function () {
    function inner() { console.log(this.name); }
    inner();
  }
};

obj.greet();        // ?
obj.greetRegular(); // ?
```
**Expected:** `Alice` then `undefined` (in strict mode) or empty string (non-strict, global `this.name`)  
**Look for:** Arrow functions inherit `this` lexically; regular functions get their own `this` determined at call time.

---

### Q5. Prototype Chain & Inheritance Trap
**What is the output?**
```js
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);

const d = new Dog('Rex');
console.log(d instanceof Dog);    // ?
console.log(d instanceof Animal); // ?
console.log(d.constructor);       // ?
```
**Expected:** `true`, `true`, `Animal` (not `Dog` — constructor not reset)  
**Follow-up:** How do you fix the constructor issue?  
**Answer:** `Dog.prototype.constructor = Dog;`

---

### Q4b. `this` + `var` — The Runtime Environment Trap ⭐ (High Signal Question)

**Show this code. Ask: what does each call print?**
```js
var name = 'deepak';

const obj = {
  name: 'Alice',
  greet: function () {
    const inner = () => console.log(this.name);
    inner();
  },
  greetRegular: function () {
    function inner() { console.log(this.name); }
    inner();
  }
};

obj.greet();        // ?
obj.greetRegular(); // ?
```

**Expected answers:**
- `obj.greet()` → `"Alice"` — arrow function inherits `this = obj` from enclosing method
- `obj.greetRegular()` → depends on environment (see follow-ups)

---

**Follow-up 1:** Most candidates say `greetRegular` prints `undefined`. Push back — *"I have `var name = 'deepak'` at the top. Still undefined?"*

| Environment | `this` inside `inner()` | `var name` on `this`? | Prints |
|---|---|---|---|
| Browser (classic script) | `window` | Yes — top-level `var` attaches to `window` | `"deepak"` |
| Node.js | `global` | No — module wrapper isolates `var` | `undefined` |
| Strict mode / ES Module | `undefined` | — | `TypeError` |

**The trap:** A confident wrong answer is *"undefined"* without qualifying the environment. A senior should immediately ask *"is this running in a browser or Node?"*

---

**Follow-up 2:** Why does `var` attach to `window` in a browser but NOT in Node.js?

**Answer:** Node.js wraps every file in a module function:
```js
(function(exports, require, module, __filename, __dirname) {
  var name = 'deepak'; // local to this wrapper, NOT on global
});
```
`var name` is scoped to the wrapper function, not the global object. In a browser there is no such wrapper for classic scripts — top-level `var` goes straight onto `window`.

---

**Follow-up 3:** Fix `greetRegular` so it reliably prints `"Alice"` in ALL environments. Ask for 3 ways.

```js
// 1. Arrow function — inherits this lexically
greetRegular: function () {
  const inner = () => console.log(this.name);
  inner();
}

// 2. .call() — explicitly pass this
greetRegular: function () {
  function inner() { console.log(this.name); }
  inner.call(this);
}

// 3. Capture this (pre-ES6 pattern, seen in old Angular/jQuery code)
greetRegular: function () {
  const self = this;
  function inner() { console.log(self.name); }
  inner();
}
```

---

**Follow-up 4 (hardest):** What if `greet` itself is called without the object?
```js
const fn = obj.greet;
fn(); // what does inner arrow print now?
```
**Answer:** `undefined` (or `TypeError` in strict mode). When `fn()` is called as a plain function, `this` inside `greet` is `window`/`undefined`. The arrow `inner` still inherits — but now it inherits the wrong `this`. Arrow functions lock in `this` at the point the outer function is invoked, not just where it's written.

**Why this is a high-signal question:** Tests `this` rules, environment awareness, arrow vs regular, AND the `var`/global trap — all in one snippet. A 23-year candidate should nail every follow-up without hints.

---

## SECTION 2 — Advanced JS, Async & Design Patterns

---

### Q6. Implement `Promise.all` from Scratch
**Write a custom `myPromiseAll(promises)`.**
```js
// Usage:
myPromiseAll([
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.reject('error')
]).then(console.log).catch(console.error);
```
**Look for:**
- Tracking resolved count
- Rejecting immediately on first failure
- Preserving order of results (not order of resolution)
- Handling empty array → resolve with `[]`

---

### Q7. Debounce vs Throttle — Implement Both
**Implement `debounce(fn, delay)` and `throttle(fn, limit)`.**
```js
// debounce: fires AFTER delay of inactivity
// throttle: fires AT MOST once per limit ms
```
**Follow-up:** Which would you use for a search input? A scroll handler? Why?  
**Look for:** Debounce cancels pending call and restarts timer; throttle allows calls at intervals regardless of frequency.

---

### Q8. Currying & Partial Application
**Make this work:**
```js
const add = curry((a, b, c) => a + b + c);

add(1)(2)(3);   // 6
add(1, 2)(3);   // 6
add(1)(2, 3);   // 6
add(1, 2, 3);   // 6
```
**Look for:** Using `fn.length` to know arity, recursively returning a function if not enough args collected yet.

---

### Q9. Memoization with Cache Invalidation
**Implement `memoize(fn, ttl)` where cached results expire after `ttl` milliseconds.**
```js
const expensiveFn = (n) => n * n;
const memoized = memoize(expensiveFn, 2000);

memoized(5); // computed
memoized(5); // from cache
// after 2 seconds:
memoized(5); // computed again
```
**Look for:** Using `Map` with stored timestamp, comparing `Date.now()`, handling multiple arguments (serialize key).

---

### Q10. Tricky Equality & Type Coercion
**What does each expression evaluate to?**
```js
[] == ![]         // ?
null == undefined  // ?
null === undefined // ?
NaN === NaN        // ?
typeof null        // ?
0.1 + 0.2 === 0.3 // ?
```
**Expected:** `true`, `true`, `false`, `false`, `"object"`, `false`  
**Look for:** IEEE 754 floating point, the `==` coercion algorithm, the historic `typeof null` bug.

---

## SECTION 3 — React Deep Dive

---

### Q11. Reconciliation & Fiber Architecture
**Explain what happens under the hood when React re-renders a component.**  
**Follow-up:** What is React Fiber and why was it introduced over the original stack reconciler?  
**Look for:**
- Virtual DOM diffing with heuristics (same component type = update, different = unmount/remount)
- Fiber = linked list of work units enabling incremental rendering
- Fiber allows time-slicing, prioritization, Concurrent Mode, Suspense

---

### Q12. `useMemo` vs `useCallback` vs `React.memo` — When Each Fails
**What is wrong with this optimization?**
```jsx
const Parent = () => {
  const [count, setCount] = useState(0);

  const config = useMemo(() => ({ threshold: 10 }), []);
  const handleClick = useCallback(() => setCount(c => c + 1), []);

  return <Child config={config} onClick={handleClick} count={count} />;
};

const Child = React.memo(({ config, onClick, count }) => {
  console.log('Child rendered');
  return <button onClick={onClick}>{count}</button>;
});
```
**Look for:** This is actually correct — `Child` will not re-render when `count` changes because `config` and `onClick` are stable. Candidate should identify WHEN memoization is wasteful (cheap renders, rapidly changing deps) and when it's essential.

---

### Q13. Custom Hook with Cleanup Edge Case
**What is the bug?**
```jsx
function useData(url) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setData(data));
  }, [url]);

  return data;
}
```
**Look for:**
- Race condition: if `url` changes before first fetch resolves, both fetches can update state
- Fix: `AbortController` or a `cancelled` flag
- Memory leak: `setData` called after unmount

**Fixed version:**
```jsx
useEffect(() => {
  let cancelled = false;
  fetch(url)
    .then(res => res.json())
    .then(data => { if (!cancelled) setData(data); });
  return () => { cancelled = true; };
}, [url]);
```

---

### Q14. Context Performance Problem
**Why does this cause unnecessary re-renders and how do you fix it?**
```jsx
const AppContext = createContext();

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, setUser, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}
```
**Look for:**
- Every consumer re-renders when either `user` OR `theme` changes, even if they only use one
- Fix: Split into `UserContext` and `ThemeContext`, or use `useMemo` on the value object
- Deeper fix: use `useContextSelector` (from `use-context-selector` library) or Zustand/Redux for granular subscriptions

---

### Q15. React 18 — Concurrent Features
**Explain the difference between these two patterns and when you'd use each:**
```jsx
// Pattern A
startTransition(() => setSearchQuery(value));

// Pattern B
const deferredQuery = useDeferredValue(searchQuery);
```
**Look for:**
- `startTransition`: wraps the *state update* as non-urgent; you control the trigger
- `useDeferredValue`: wraps the *value* itself; useful when you can't control the update source (e.g., prop from parent)
- Both prevent the UI from freezing during expensive renders; `startTransition` is more explicit

---

## SECTION 4 — Node.js & Backend Fundamentals

---

### Q16. Node.js Event Loop vs Browser Event Loop
**What is the output and why is it different from a browser?**
```js
setImmediate(() => console.log('setImmediate'));
setTimeout(() => console.log('setTimeout'), 0);
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
```
**Expected:** `nextTick → promise → setTimeout → setImmediate` (in most cases)  
**Look for:** Node-specific phases — `process.nextTick` runs before Promises, both before I/O callbacks. `setImmediate` runs in the check phase after I/O. `setTimeout(0)` vs `setImmediate` order can vary outside I/O context.

---

### Q17. Streams & Backpressure
**What problem does this code have and how do you fix it?**
```js
const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
  const file = fs.readFileSync('./bigfile.mp4');
  res.end(file);
}).listen(3000);
```
**Look for:**
- `readFileSync` blocks the event loop; blocks ALL requests during file read
- Reads entire file into memory — fatal for large files
- Fix: `fs.createReadStream('./bigfile.mp4').pipe(res)` — streams data, handles backpressure automatically
- Backpressure: if `res` (writable) is slower than the read stream, `.pipe()` pauses the readable until the writable drains

---

### Q18. Memory Leak Detection
**This Express app has a memory leak. Find it.**
```js
const express = require('express');
const app = express();
const cache = [];

app.get('/data', (req, res) => {
  const result = computeExpensiveOperation(req.query.id);
  cache.push({ id: req.query.id, result, timestamp: Date.now() });
  res.json(result);
});
```
**Look for:**
- `cache` is a module-level array that grows unboundedly
- Fix: use a `Map` with LRU eviction, or TTL expiry, or use a proper cache like Redis
- Discussion: how to detect leaks — `--inspect` flag + Chrome DevTools heap snapshots, `clinic.js`

---

## SECTION 5 — Angular Deep Dive

---

### Q19. Change Detection — Default vs OnPush
**What is the difference? When does `OnPush` NOT prevent re-rendering even if inputs haven't changed?**

**Look for:**
- Default: Angular checks entire component tree on every event/async operation
- OnPush: checks only when input references change, an event fires inside the component, an Observable subscribed via `async` pipe emits, or `markForCheck()` is called
- Trap: mutating an object that was passed as input won't trigger OnPush because the reference is the same — must create a new reference

---

### Q20. `trackBy` in `*ngFor` — Internals
**What is the performance problem and how does `trackBy` solve it?**
```typescript
// Without trackBy:
@Component({
  template: `<li *ngFor="let item of items">{{ item.name }}</li>`
})

// With trackBy:
@Component({
  template: `<li *ngFor="let item of items; trackBy: trackById">{{ item.name }}</li>`
})
trackById(index: number, item: any) { return item.id; }
```
**Look for:** Without `trackBy`, replacing the array destroys and recreates ALL DOM nodes even if most items are identical. `trackBy` lets Angular identify which items are new/removed/moved by a stable key.

---

### Q21. RxJS — Higher-Order Mapping Operators
**What is the difference and when would each cause a bug?**
```typescript
// A: switchMap
this.searchInput$.pipe(
  switchMap(query => this.api.search(query))
)

// B: mergeMap
this.formSave$.pipe(
  mergeMap(data => this.api.save(data))
)

// C: concatMap
this.uploadQueue$.pipe(
  concatMap(file => this.api.upload(file))
)
```
**Look for:**
- `switchMap`: cancels previous inner observable — correct for search (discard stale results), dangerous for saves (cancels in-flight save)
- `mergeMap`: runs all concurrently — dangerous if order matters or server can't handle concurrency
- `concatMap`: queues, runs one at a time — correct for ordered uploads, slow if operations are independent

---

## SECTION 6 — Vue & Framework-Agnostic Patterns

---

### Q22. Vue 3 Reactivity — `ref` vs `reactive` Gotchas
**What is the bug?**
```js
const state = reactive({ count: 0 });

// Later, destructuring:
const { count } = state;
count++; // does this update the reactive state?
```
**Look for:** Destructuring breaks reactivity — `count` is now a plain number, not a reactive reference. Fix: use `toRefs(state)` to get reactive refs, or access as `state.count`. Contrast with `ref` which wraps in an object so reactivity is preserved.

---

### Q23. `computed` Caching vs `watch` Side Effects
**When would you use `watchEffect` over `computed`?**
```js
// Computed — cached, synchronous, returns value
const fullName = computed(() => `${firstName.value} ${lastName.value}`);

// watchEffect — runs for side effects
watchEffect(() => {
  document.title = fullName.value;
});
```
**Look for:** `computed` is for deriving values synchronously — result is cached until deps change. `watch`/`watchEffect` is for side effects (DOM manipulation, API calls, logging). Misusing `computed` for side effects causes bugs since computed values may be lazily evaluated and side effects skipped.

---

## SECTION 7 — Algorithms & Problem Solving

---

### Q24. Flatten Nested Array — Multiple Approaches
**Implement `flatten(arr)` without using `Array.prototype.flat`.**
```js
flatten([1, [2, [3, [4]], 5]]) // [1, 2, 3, 4, 5]
```
**Ask for 3 approaches:**
1. Recursive
2. Iterative with stack
3. Using `reduce`

**Bonus:** What is the call stack risk with deep recursion? (Stack overflow for thousands of levels — iterative is safer)

---

### Q25. LRU Cache Implementation
**Implement an LRU Cache with O(1) get and put.**
```js
const cache = new LRUCache(2); // capacity 2
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);    // 1
cache.put(3, 3); // evicts key 2
cache.get(2);    // -1 (evicted)
```
**Look for:** `Map` (maintains insertion order) + O(1) lookup; or doubly linked list + HashMap combo for the classic solution. Using `Map`, trick is to delete and re-insert on access to move to "most recently used" end.

---

### Q26. Async Waterfall with Rate Limiting
**Process an array of 1000 URLs, but only 5 concurrent requests at a time.**
```js
async function fetchWithConcurrency(urls, limit) {
  // implement this
}
```
**Look for:** Chunking via `for` loop with `Promise.all` on slices of `limit`, OR a pool/queue approach with a semaphore that keeps exactly `limit` requests in flight at all times (more efficient — no waiting for slow requests in a batch).

---

### Q27. Deep Clone Without `JSON.parse`
**Implement `deepClone(obj)` that handles circular references, `Date`, `Map`, `Set`, `undefined`, functions.**
```js
const a = { x: 1 };
a.self = a; // circular reference
deepClone(a); // should not throw
```
**Look for:** Using a `WeakMap` to track visited objects and return the clone instead of recursing infinitely. Handling special types: `Date` → `new Date(obj)`, `Map` → clone entries, `Set` → clone values, functions → reference (not cloned by default).

---

## SECTION 8 — Architecture, Performance & Senior-Level Thinking

---

### Q28. Micro-Frontend Architecture
**Your team is splitting a monolithic Angular SPA into micro-frontends. What are the key decisions and tradeoffs?**

**Look for discussion of:**
- Module Federation (Webpack 5) vs iframes vs Web Components vs single-spa
- Shared dependencies: versioning conflicts, shared vs isolated bundles
- Communication: custom events, shared state, URL params
- Team autonomy vs UX consistency: design system governance
- Performance: lazy loading, caching strategies, shell app bootstrap cost
- Testing: contract tests between MFEs, E2E across boundaries

---

### Q29. Performance Debugging — Real Scenario
**A React app has a page that takes 4 seconds to become interactive on a mid-range phone. Walk me through your debugging process.**

**Look for systematic approach:**
1. **Measure first:** Chrome DevTools Performance tab, Lighthouse, Web Vitals (LCP, FID/INP, CLS)
2. **Bundle analysis:** `webpack-bundle-analyzer`, check for duplicate deps, large unoptimized libraries
3. **Rendering:** React DevTools Profiler — identify expensive render trees, unnecessary re-renders
4. **Network:** waterfall analysis, critical path, preload/prefetch, CDN
5. **JavaScript execution:** long tasks blocking main thread, code splitting, lazy loading routes
6. **Runtime:** memory leaks, layout thrashing (forced reflows)

---

### Q30. State Management Philosophy — The Hardest Question
**You have a large application. The team argues: some want Redux Toolkit, some want Zustand, some want React Query + local state, some want server state in a cache only. How do you decide and what would you actually recommend?**

**Look for mature thinking:**
- Distinguish **server state** (async, cached, stale) from **client state** (UI, local interactions)
- React Query/TanStack Query or SWR for server state eliminates huge swaths of Redux boilerplate
- Zustand/Jotai/Recoil for lightweight client state without Redux ceremony
- Redux Toolkit is justified only when: complex state machines, time-travel debugging needed, large team needing strict patterns, heavy undo/redo requirements
- Anti-pattern: putting server data into Redux and manually managing loading/error/stale states
- **Best answer:** "It depends on the problem, not the trend — but I'd default to React Query + Zustand for most modern apps, and Redux only when the team or domain genuinely needs it."

---

## Scoring Guide

| Score | Meaning |
|-------|---------|
| Answers Q1–Q5 cleanly | Solid JS fundamentals |
| Handles Q6–Q9 (implementations) | Can write production-quality code |
| Deep on Q11–Q15 React internals | Senior React knowledge |
| Q28–Q30 with trade-off nuance | Architect-level thinking |
| Identifies edge cases unprompted | 20+ years mindset |

**Red flags:** Memorized answers without understanding WHY, cannot debug the tricky snippets, no mention of trade-offs in architecture questions, unfamiliar with Concurrent React or Fiber.
