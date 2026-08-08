/**
 * Q11: Implement Promise.all (and allSettled) from Scratch
 * Difficulty: Hard
 * Concepts: counters, order preservation, short-circuit rejection, non-promise values
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `myPromiseAll(iterable)` that mimics Promise.all:
- Resolves with results in the SAME ORDER as input, regardless of which
  settles first.
- Rejects immediately with the first rejection reason.
- Handles non-promise values in the array (they resolve immediately).
- Resolves with [] for an empty input.

Then implement `myPromiseAllSettled(iterable)` that never rejects and
reports every outcome.
*/

// ============================================
// ANSWER
// ============================================

function myPromiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;

    if (remaining === 0) {
      resolve([]);
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = value; // preserve input order, not resolve order
          remaining -= 1;
          if (remaining === 0) resolve(results);
        },
        (reason) => reject(reason) // short-circuit on first rejection
      );
    });
  });
}

function myPromiseAllSettled(iterable) {
  return new Promise((resolve) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;

    if (remaining === 0) {
      resolve([]);
      return;
    }

    items.forEach((item, index) => {
      Promise.resolve(item).then(
        (value) => {
          results[index] = { status: 'fulfilled', value };
          if (--remaining === 0) resolve(results);
        },
        (reason) => {
          results[index] = { status: 'rejected', reason };
          if (--remaining === 0) resolve(results);
        }
      );
    });
  });
}

/*
============================================
TEST
============================================
myPromiseAll([
  1,
  new Promise(res => setTimeout(() => res(2), 20)),
  Promise.resolve(3)
]).then(console.log); // [1, 2, 3] after ~20ms

myPromiseAll([
  Promise.resolve(1),
  Promise.reject('nope'),
  new Promise(res => setTimeout(() => res(3), 50))
]).catch(console.error); // "nope" almost immediately

myPromiseAllSettled([Promise.resolve(1), Promise.reject('x')])
  .then(console.log);
// [{status:'fulfilled', value:1}, {status:'rejected', reason:'x'}]

============================================
EVALUATION CRITERIA
============================================
- Uses `Promise.resolve(item)` to normalize plain values AND thenables.
- Writes to `results[index]` (not push) to preserve original order —
  this is the #1 mistake candidates make (pushing on resolution order).
- Handles the empty-array edge case explicitly (resolve([]) synchronously
  inside the executor before any async work).
- allSettled counts down remaining regardless of fulfilled/rejected and
  never calls reject.
*/
