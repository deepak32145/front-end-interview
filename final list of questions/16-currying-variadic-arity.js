/**
 * Q16: Currying with Variadic Arity Detection
 * Difficulty: Medium-Hard
 * Concepts: Function.length, closures, recursive argument accumulation
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `curry(fn)` so that ALL of these work for a 3-arg function:

const sum3 = (a, b, c) => a + b + c;
const curried = curry(sum3);

curried(1)(2)(3);   // 6
curried(1, 2)(3);   // 6
curried(1)(2, 3);   // 6
curried(1, 2, 3);   // 6

Follow-up: why does `curry(fn)` need to read `fn.length`, and what
breaks if `fn` uses a rest parameter, e.g. `(...args) => args.length`?
*/

// ============================================
// ANSWER
// ============================================

function curry(fn) {
  const arity = fn.length;

  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

/*
============================================
FOLLOW-UP ANSWER
============================================
`fn.length` reports the number of DECLARED parameters BEFORE the first
one with a default value or a rest parameter — it does NOT count rest
params at all, and stops counting at the first default-valued param.

So `curry((...args) => args.length)` breaks: `fn.length` is 0, meaning
`curried()` would immediately invoke `fn` with zero arguments on the
very first call, since `args.length (0) >= arity (0)` is already true.

There is no general way to auto-curry a variadic function — the caller
must explicitly tell curry how many arguments to expect, e.g.:

function curryN(fn, arity) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

const curriedVariadic = curryN((...args) => args.reduce((a,b) => a+b, 0), 3);
curriedVariadic(1)(2)(3); // 6
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly accumulates args across multiple partial calls.
- Handles any split of arguments (1+1+1, 2+1, 1+2, 3 at once).
- Recognizes the fn.length limitation with default/rest parameters —
  this is the "senior" differentiator; most candidates only get the
  happy path curry implementation right.
- Preserves `this` if the curried function is used as a method (bonus).
*/
