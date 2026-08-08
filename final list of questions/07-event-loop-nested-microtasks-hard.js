/**
 * Q7: Event Loop — Nested Microtasks Spawning Macrotasks (Hard)
 * Difficulty: Very Hard
 * Concepts: microtask starvation, macrotask re-scheduling, async/await desugaring
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the exact output order and explain each hop:

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

(async () => {
  console.log('async start');
  await null;
  console.log('async end');
})();

console.log('end');
*/

// ============================================
// ANSWER
// ============================================
// Output:
// start
// async start
// end
// promise 1
// async end
// promise 2
// timeout 1
// promise inside timeout
// timeout inside promise

/*
============================================
EXPLANATION (step by step)
============================================
SYNCHRONOUS PASS:
- "start" logs.
- setTimeout #1 registered -> macrotask queue: [T1]
- Promise.resolve().then(...) registers its first .then -> microtask
  queue: [P1]
- The IIFE runs synchronously up to `await null`: logs "async start",
  then `await` immediately schedules the rest of the function as a
  microtask (this is exactly equivalent to
  `Promise.resolve(null).then(() => { console.log('async end'); })`)
  -> microtask queue: [P1, A1]
- "end" logs.
Call stack is now empty. Microtask queue: [P1, A1]

DRAIN MICROTASKS (in FIFO order, including newly added ones):
- Run P1: logs "promise 1", registers setTimeout #2 (macrotask queue
  becomes [T1, T2]), and its `.then(() => console.log('promise 2'))`
  chain schedules a NEW microtask P2 -> microtask queue: [A1, P2]
- Run A1: logs "async end". Nothing new queued.
- Run P2: logs "promise 2".
Microtask queue is now empty.

FIRST MACROTASK (T1):
- Runs: logs "timeout 1", schedules a microtask (Promise.resolve().then)
  -> microtask queue: [P3]
- Immediately after T1 finishes, drain microtasks again before the next
  macrotask: run P3 -> logs "promise inside timeout".

SECOND MACROTASK (T2):
- Runs: logs "timeout inside promise".

Final: start, async start, end, promise 1, async end, promise 2,
       timeout 1, promise inside timeout, timeout inside promise
*/

/*
============================================
WHY THIS QUESTION IS HIGH SIGNAL
============================================
- Tests whether the candidate knows `await` doesn't "pause and yield to
  macrotasks" — it yields to the MICROTASK queue only.
- Tests whether they know the engine drains the ENTIRE microtask queue,
  including tasks added mid-drain, before touching a single macrotask —
  this is why "async end" and "promise 2" both beat "timeout 1".
- Tests whether they know a macrotask callback that itself queues a
  microtask gets that microtask drained before the NEXT macrotask runs
  (not batched with unrelated later macrotasks).
*/
