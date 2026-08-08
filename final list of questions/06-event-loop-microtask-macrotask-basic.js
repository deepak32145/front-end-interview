/**
 * Q6: Event Loop — Call Stack, Microtasks, Macrotasks
 * Difficulty: Medium-Hard
 * Concepts: call stack, microtask queue (Promises), macrotask queue (setTimeout), execution order
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the exact console.log order:

console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');
*/

// ============================================
// ANSWER
// ============================================
// Output: 1, 5, 3, 4, 2

/*
============================================
EXPLANATION
============================================
1. Synchronous code runs first, top to bottom, on the call stack:
   logs "1", then registers the setTimeout callback (macrotask queue),
   then registers the first .then callback (microtask queue), then
   logs "5". At this point the call stack is: 1, 5.

2. Once the call stack is empty, the event loop does NOT go straight to
   the macrotask queue. It fully drains the MICROTASK queue first —
   including any NEW microtasks added while draining it.
   - Runs the first .then -> logs "3", and its return value schedules
     the SECOND .then as a new microtask.
   - Because the microtask queue is drained completely (not just one at
     a time per loop tick), that second .then also runs now -> logs "4".

3. Only after the microtask queue is completely empty does the event
   loop pick ONE task from the macrotask queue: the setTimeout callback
   -> logs "2".

Final order: 1, 5, 3, 4, 2
*/

/*
============================================
FOLLOW-UPS
============================================
1) What if there were TWO setTimeout(fn, 0) calls and a chain of THREE
   .then()s? -> All three .then()s still run before either setTimeout,
   because ALL pending microtasks are drained before even the FIRST
   macrotask runs, no matter how many microtasks pile up in the meantime.

2) Is `queueMicrotask()` any different from Promise.resolve().then()?
   -> Functionally equivalent ordering-wise; `queueMicrotask` is just a
   more direct/explicit API for scheduling a microtask without needing
   a Promise wrapper.

3) Where does `async/await` fit into this?
   -> `await` pauses the async function and schedules everything after
   it as a microtask continuation — functionally it's sugar over
   `.then()`, so it obeys the exact same "drain all microtasks before
   the next macrotask" rule.
*/
