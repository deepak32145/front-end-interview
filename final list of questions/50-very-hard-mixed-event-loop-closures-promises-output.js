/**
 * Q50: The Final Boss — Mixed Closures, Prototypes, Generators, Async, and the Event Loop
 * Difficulty: Very Hard (capstone question)
 * Concepts: everything in this series combined — use this as the last question of the interview
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the EXACT output, in order, of running this entire program.
Explain every non-obvious hop. Take your time — this intentionally
combines closures, `this` binding, prototypes, generators, microtasks,
and macrotasks in one script.

class Counter {
  #count = 0;
  increment() {
    this.#count++;
    return this.#count;
  }
  get value() {
    return this.#count;
  }
}

function* idGenerator() {
  let id = 1;
  while (true) {
    const reset = yield id++;
    if (reset) id = 1;
  }
}

const counter = new Counter();
const ids = idGenerator();

console.log('1:', ids.next().value);
console.log('2:', ids.next().value);

const detachedIncrement = counter.increment;

console.log('3:', counter.increment());

setTimeout(() => {
  console.log('4: timeout');
  Promise.resolve().then(() => console.log('5: promise-in-timeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('6:', counter.increment());
    return new Promise((resolve) => {
      queueMicrotask(() => resolve('nested-microtask-value'));
    });
  })
  .then((value) => {
    console.log('7:', value);
  });

try {
  detachedIncrement(); // called with no receiver
} catch (err) {
  console.log('8: caught ->', err.constructor.name);
}

(async () => {
  console.log('9: async start');
  await null;
  console.log('10:', ids.next(true).value); // reset=true this time
  await new Promise((resolve) => setTimeout(resolve, 0));
  console.log('11: after macrotask await');
})();

console.log('12: sync end');
console.log('13:', counter.value);
*/

// ============================================
// ANSWER
// ============================================

/*
FULL OUTPUT, IN ORDER:

1: 1
2: 2
3: 1
8: caught -> TypeError
9: async start
12: sync end
13: 0
6: 2
9: async start... (wait, reorder carefully below in the trace)

Let's derive it CAREFULLY, step by step, instead of guessing:

--- SYNCHRONOUS PASS ---
"1: 1"   -> ids.next().value: generator starts, yields id=1, then
            increments id to 2 internally for next time.
"2: 2"   -> ids.next().value: resumes at the `yield id++` with `reset`
            = undefined (falsy) since no argument was passed, doesn't
            reset, yields id=2 (posts-increments to 3).
`detachedIncrement = counter.increment` -> just a reference, no call yet.
"3: 1"   -> counter.increment() called normally (this=counter),
            #count 0->1, returns 1.
setTimeout(...) registered -> macrotask queue: [T1]
Promise.resolve().then(cb1) registered -> microtask queue: [P1]
try { detachedIncrement(); } -> called with NO receiver, so inside
   increment(), `this` is undefined (class bodies are implicitly
   strict mode, always, regardless of surrounding code) -> attempting
   `this.#count++` on `undefined` throws IMMEDIATELY:
   "TypeError: Cannot read private member #count from an object whose
   class did not declare it" (or a similar private-field TypeError,
   engine wording varies slightly) -- practically it's a TypeError
   either way because `this` is undefined.
"8: caught -> TypeError" -> logs, confirming err.constructor.name.
IIFE starts executing synchronously up to its first `await`:
  "9: async start" logs.
  `await null` -> schedules the REST of the async function as a
  microtask continuation. microtask queue becomes: [P1, A1]
"12: sync end" -> logs (back in outer synchronous script).
"13: 0" -> counter.value read HERE is 0?? Wait — counter.increment()
  was called successfully once already (in "3:"), bringing #count to 1.
  So "13:" should log 1, not 0. Let's correct: counter.#count is 1
  after step "3:" (detachedIncrement's call FAILED before mutating
  anything, so it didn't change #count). So "13: 1" is correct.

Call stack now empty. DRAIN MICROTASKS: [P1, A1]

Run P1 (first .then callback):
  "6: 2" -> counter.increment() again, #count 1->2, logs 2.
  Returns a NEW promise that will resolve once its executor's
  queueMicrotask fires -> this SCHEDULES that queueMicrotask callback
  as ANOTHER microtask: [A1, M1]
  (P1's own .then chain is now waiting on this returned promise; the
  SECOND .then(cb2) for "7:" will only become eligible once that
  inner promise settles.)

Run A1 (async function continuation after `await null`):
  "10: 3" -> ids.next(true).value: resumes the generator at
  `const reset = yield id++` with reset=true this time. Since reset is
  truthy, `id` is reset to 1 INSIDE the generator body, THEN the loop
  continues to `yield id++` again, yielding the CURRENT id which is 1
  (post-increment happens after yielding), so the value yielded is 1,
  NOT 3. Correcting: "10: 1".
  Then hits `await new Promise((resolve) => setTimeout(resolve, 0))`
  -> this schedules a NEW setTimeout macrotask: [T1, T2], and pauses
  the async function here.

Microtask queue: [M1]
Run M1 (queueMicrotask resolving the inner promise from P1's chain):
  resolves with 'nested-microtask-value' -> this makes P1's SECOND
  .then eligible -> schedules it as a new microtask: [P2]

Run P2:
  "7: nested-microtask-value" logs.

Microtask queue now empty. Proceed to MACROTASKS: [T1, T2]

Run T1 (the very first setTimeout):
  "4: timeout" logs.
  Schedules Promise.resolve().then(...) -> microtask: [P3]
  Drain microtasks before next macrotask:
  Run P3: "5: promise-in-timeout" logs.

Run T2 (the setTimeout inside the async IIFE's await):
  resolves that promise -> resumes the async function:
  "11: after macrotask await" logs.

--- FINAL CORRECTED FULL ORDER ---
1: 1
2: 2
3: 1
8: caught -> TypeError
9: async start
12: sync end
13: 1
6: 2
10: 1
7: nested-microtask-value
4: timeout
5: promise-in-timeout
11: after macrotask await
*/

/*
============================================
WHY THIS IS THE CAPSTONE QUESTION
============================================
This single script forces the candidate to correctly track, SIMULTANEOUSLY:
- Generator state and the two-way yield/next(value) protocol (including
  a MID-STREAM reset via a truthy argument).
- Private class field access failing when `this` is unbound (detached
  method call), and that class bodies are always strict mode.
- The precise interleaving of multiple concurrent microtask chains (a
  .then chain that itself returns a promise resolved via
  queueMicrotask, racing against an async/await continuation).
- Macrotask queue ordering across TWO separate setTimeout calls
  registered at different points in the timeline.
- That microtasks are FULLY drained between every single macrotask,
  including microtasks generated as a SIDE EFFECT of running a
  macrotask callback.

A candidate who gets this exactly right, unprompted, has genuinely deep,
correct mental model of JS execution — this is an appropriate final
question to calibrate strong-hire vs strong-no-hire for a senior role.
Partial credit matters enormously here: watch HOW they reason through
it, not just whether the final trace is byte-perfect.
*/
