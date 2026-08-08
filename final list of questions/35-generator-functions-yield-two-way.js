/**
 * Q35: Generator Functions — Two-Way Communication and yield*
 * Difficulty: Hard
 * Concepts: yield expressions, .next(value) argument passing, generator delegation, generator.return/.throw
 */

// ============================================
// QUESTION
// ============================================
/*
1) Predict the exact sequence of logs:

function* gen() {
  console.log('A');
  const x = yield 1;
  console.log('B', x);
  const y = yield 2;
  console.log('C', y);
  return 'done';
}

const it = gen();
console.log(it.next());        // ?
console.log(it.next('hello')); // ?
console.log(it.next('world')); // ?
console.log(it.next('extra')); // ?

2) What does yield* do differently from a plain yield when delegating
   to another generator? Trace this:

function* inner() {
  yield 'a';
  yield 'b';
  return 'inner-return-value';
}
function* outer() {
  const result = yield* inner();
  yield result;
}
console.log([...outer()]);

3) What happens if you call `it.return('early')` or `it.throw(new
   Error('x'))` mid-iteration? How can a generator intercept a thrown
   error via try/catch INSIDE its body?
*/

// ============================================
// ANSWERS
// ============================================

/*
1) TRACE:
it.next() call #1:
  - Runs the generator body from the top up to (and including
    evaluating) the FIRST `yield 1` expression, but does NOT yet assign
    anything to `x` (the assignment happens only when this yield
    RESUMES).
  - Logs "A", then pauses at `yield 1`.
  - Returns { value: 1, done: false }.

it.next('hello') call #2:
  - Resumes execution AT the paused yield, and 'hello' becomes the
    RESULT of that `yield 1` expression — so `x = 'hello'`.
  - Logs "B hello".
  - Continues to `yield 2`, pauses there.
  - Returns { value: 2, done: false }.

it.next('world') call #3:
  - Resumes, `y = 'world'`.
  - Logs "C world".
  - Function returns 'done' (the return statement).
  - Returns { value: 'done', done: true }.

it.next('extra') call #4:
  - Generator already finished; calling .next() again just returns
    { value: undefined, done: true } every time from now on — the
    argument 'extra' is discarded since there's no pending yield to
    resume.

KEY INSIGHT: the value passed to `.next(v)` becomes the RESULT of the
yield expression that is CURRENTLY PAUSED — it is NOT the value that
gets yielded next. The FIRST `.next()` call's argument is always
discarded because there's no paused yield yet to receive it (the
generator hasn't started).

2) yield* fully delegates iteration to the inner generator: it forwards
   EVERY yielded value from `inner()` out through `outer()` as if
   `outer` itself yielded them directly, AND it evaluates to the inner
   generator's RETURN value (not its yielded values) once inner is
   exhausted.

   [...outer()] step by step:
   - yield* inner() starts pulling from inner: yields 'a', yields 'b'
     (both pass straight through outer as its own yields).
   - inner() then returns 'inner-return-value' — this becomes the
     value of the `yield* inner()` EXPRESSION itself, so
     `result = 'inner-return-value'`.
   - outer then does `yield result` -> yields 'inner-return-value' too.

   Final array: ['a', 'b', 'inner-return-value']

   Plain `yield inner()` (no star) would instead yield the ENTIRE
   generator OBJECT itself as a single value (since inner() just
   creates a generator without iterating it) — a common mistake when
   people forget the `*`.

3) it.return('early') immediately terminates the generator as if a
   `return 'early'` statement executed at the CURRENT paused yield
   point — any `finally` blocks around that point still run. It returns
   { value: 'early', done: true }, and the generator cannot be resumed
   afterward.

   it.throw(err) injects an exception AT the current paused yield point,
   as if `throw err` had been written there. If the generator body has
   a try/catch WRAPPING that yield, the catch block handles it and
   execution can CONTINUE (the generator isn't necessarily terminated —
   only if the error isn't caught inside does it propagate out and
   terminate the generator).

   function* resilient() {
     try {
       yield 1;
     } catch (e) {
       console.log('caught inside generator:', e.message);
       yield 2; // can keep yielding after recovering!
     }
   }
   const g = resilient();
   g.next();                       // { value: 1, done: false }
   g.throw(new Error('boom'));     // logs "caught inside generator: boom"
                                    // -> { value: 2, done: false }
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly explains that .next(v)'s argument feeds the PREVIOUSLY
  paused yield, not the upcoming one (the single most commonly confused
  point about generators).
- Understands yield*'s dual behavior: pass-through yielding PLUS
  evaluating to the delegate's return value.
- Knows .throw() can be caught and recovered from INSIDE the generator,
  not just used to kill it.
*/
