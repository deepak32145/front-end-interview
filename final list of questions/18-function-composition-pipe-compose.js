/**
 * Q18: Function Composition — pipe, compose, and Async Variants
 * Difficulty: Medium-Hard
 * Concepts: reduce, function composition direction, async composition
 */

// ============================================
// QUESTION
// ============================================
/*
1) Implement `pipe(...fns)` (left-to-right execution) and
   `compose(...fns)` (right-to-left execution) as generic n-ary function
   combinators.

2) Given:
   const double = x => x * 2;
   const inc = x => x + 1;
   const square = x => x * x;

   What does pipe(double, inc, square)(3) evaluate to? Show the steps.
   What does compose(double, inc, square)(3) evaluate to?

3) Implement `pipeAsync(...fns)` that supports a mix of sync AND async
   (Promise-returning) functions in the chain, resolving to the final
   value.
*/

// ============================================
// ANSWER
// ============================================

function pipe(...fns) {
  return (initial) => fns.reduce((acc, fn) => fn(acc), initial);
}

function compose(...fns) {
  return (initial) => fns.reduceRight((acc, fn) => fn(acc), initial);
}

/*
2) pipe(double, inc, square)(3):
   step 1: double(3) = 6
   step 2: inc(6)    = 7
   step 3: square(7) = 49
   -> 49

   compose(double, inc, square)(3) runs RIGHT TO LEFT:
   step 1: square(3) = 9
   step 2: inc(9)    = 10
   step 3: double(10)= 20
   -> 20
*/

function pipeAsync(...fns) {
  return (initial) =>
    fns.reduce(
      (accPromise, fn) => accPromise.then((value) => fn(value)),
      Promise.resolve(initial)
    );
}

/*
============================================
TEST
============================================
const asyncDouble = async (x) => x * 2;
const asyncInc = (x) => x + 1; // sync function mixed in, still works
const asyncSquare = async (x) => x * x;

pipeAsync(asyncDouble, asyncInc, asyncSquare)(3).then(console.log); // 49

============================================
FOLLOW-UPS
============================================
1) Why does `.then((value) => fn(value))` work even when `fn` is a
   plain synchronous function?
   -> `.then()` automatically wraps whatever the callback returns in a
      resolved promise if it isn't already one, so sync and async
      functions compose transparently in the same chain.

2) How would you add error handling that stops the pipeline and reports
   WHICH step failed?
   -> Wrap each `fn(value)` call in a try/catch (for sync) or rely on
      promise rejection propagating through `.then` chain naturally
      (since a rejected promise skips subsequent .then and can be
      caught with one final `.catch`); to report the failing step,
      wrap each step: `.then(value => fn(value).catch(e => { throw
      new Error(`Step ${i} (${fn.name}) failed: ${e.message}`); }))`.

3) real-world use case?
   -> Middleware-style pipelines: request validation -> transformation
      -> business logic -> response formatting, especially in
      Express/Koa-like middleware chains or Redux-style selectors.
*/
