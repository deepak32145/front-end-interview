/**
 * Q2: Loop Closures — var vs let inside setTimeout
 * Difficulty: Medium
 * Concepts: closures, block scoping, per-iteration bindings, event loop timing
 */

// ============================================
// QUESTION
// ============================================
/*
1) What does this log, and why?

for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var:', i), 0);
}

2) What does this log, and why is it different?

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log('let:', j), 0);
}

3) Fix the `var` version WITHOUT changing `var` to `let`. Give two
   different fixes.

4) Trickier: what does this log?

for (let k = 0; k < 3; k++) {
  setTimeout(() => console.log('mutated:', k), 0);
  k += 10;
}
*/

// ============================================
// ANSWERS
// ============================================

// 1) "var: 3" three times.
// There is only ONE `i` binding shared across all iterations (function
// scoped). By the time any setTimeout callback runs (after the loop and
// the synchronous stack have finished), `i` has already reached 3.

// 2) "let: 0", "let: 1", "let: 2"
// `let` creates a NEW binding for `j` on every iteration (the spec calls
// this a "per-iteration environment" — the loop copies the value into a
// fresh binding at the top of each iteration). Each closure captures its
// own separate `j`.

// 3) Fix var without switching to let:

// Fix A: IIFE to create a new scope per iteration
for (var i = 0; i < 3; i++) {
  (function (iCopy) {
    setTimeout(() => console.log('fixA:', iCopy), 0);
  })(i);
}

// Fix B: pass the value as an extra argument to setTimeout
for (var i2 = 0; i2 < 3; i2++) {
  setTimeout((iCopy) => console.log('fixB:', iCopy), 0, i2);
}

// 4) "mutated: 0", "mutated: 11", "mutated: 22"
// Even though we mutate `k` inside the loop body, the mutation happens
// on that iteration's own binding BEFORE it gets copied forward to the
// next iteration's fresh binding. So iteration 1 logs the value at the
// time the callback fires: 0, then k becomes 10, loop increments to 11
// for iteration 2 (logs 11), then k becomes 21, increments to 22 for
// iteration 3 (logs 22), then k becomes 32, increments to 33 which fails
// the k < 3... wait — condition is k < 3, so after iteration 1 k=11,
// which already fails k < 3, so the loop actually only runs ONCE.
// Correct real output: "mutated: 0" only, then the loop condition
// (11 < 3) is false and the loop stops.
// This is intentionally deceptive — the lesson is: always trace the
// loop CONDITION check after any manual mutation of the loop variable.

/*
============================================
FOLLOW-UP
============================================
Why does `setTimeout(fn, 0)` not run synchronously even with a 0ms delay?
-> `setTimeout` always schedules a macrotask; it never runs the callback
   during the current synchronous execution, regardless of the delay
   value. The delay is a MINIMUM, and the callback still has to wait for
   the call stack to empty and the microtask queue to drain first.
*/
