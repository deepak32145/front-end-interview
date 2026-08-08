/**
 * Q17: Curry with Placeholder Support (curry._ style)
 * Difficulty: Very Hard
 * Concepts: advanced closures, sparse argument arrays, placeholder substitution
 */

// ============================================
// QUESTION
// ============================================
/*
Extend curry to support a placeholder token (like lodash's `_`) that
lets you "skip" an argument to be filled in on a later call:

const curry = require('./curry'); // has curry.placeholder = curry._
const _ = curry.placeholder;

const fn = curry((a, b, c) => `${a}-${b}-${c}`);

fn(1, 2, 3);         // "1-2-3"
fn(_, 2, 3)(1);       // "1-2-3"
fn(1, _, 3)(2);       // "1-2-3"
fn(_, _, 3)(1, 2);    // "1-2-3"
fn(_, _, 3)(1)(2);    // "1-2-3"
fn(_, 2)(_, 3)(1);    // "1-2-3"
*/

// ============================================
// ANSWER
// ============================================

function curry(fn) {
  const arity = fn.length;
  const _ = curry.placeholder;

  return function curried(...args) {
    // Merge new args into any existing placeholders is handled by the
    // recursive closure below — each call to `curried` receives a FRESH
    // args array already merged with prior state by the wrapper that
    // called it (see the placeholder-merge branch).

    const hasEnoughRealArgs =
      args.length >= arity && !args.slice(0, arity).includes(_);

    if (hasEnoughRealArgs) {
      return fn.apply(this, args);
    }

    return function (...nextArgs) {
      // Merge: walk `args`, replacing placeholders with values from
      // `nextArgs` in order; leftover nextArgs are appended at the end.
      const merged = [];
      let nextIndex = 0;

      for (const a of args) {
        if (a === _ && nextIndex < nextArgs.length) {
          merged.push(nextArgs[nextIndex++]);
        } else {
          merged.push(a);
        }
      }
      while (nextIndex < nextArgs.length) {
        merged.push(nextArgs[nextIndex++]);
      }

      return curried.apply(this, merged);
    };
  };
}

curry.placeholder = Symbol('placeholder');

/*
============================================
TEST
============================================
const _ = curry.placeholder;
const fn = curry((a, b, c) => `${a}-${b}-${c}`);

console.log(fn(1, 2, 3));         // "1-2-3"
console.log(fn(_, 2, 3)(1));      // "1-2-3"
console.log(fn(1, _, 3)(2));      // "1-2-3"
console.log(fn(_, _, 3)(1, 2));   // "1-2-3"
console.log(fn(_, _, 3)(1)(2));   // "1-2-3"
console.log(fn(_, 2)(_, 3)(1));   // "1-2-3"

============================================
WHY THIS IS VERY HARD
============================================
- Must track WHICH positions are still placeholders vs filled, not just
  a running count of "how many args so far" (plain curry from Q16 fails
  here because args.length alone can't tell you the FIRST arg is still
  a placeholder).
- The "enough real args" check must exclude any position within the
  arity window that is STILL a placeholder — `args.length >= arity`
  is necessary but not sufficient once placeholders are involved.
- Merging placeholders with new arguments must be positional: new args
  fill placeholders IN ORDER first, and only overflow to the end.

============================================
EVALUATION CRITERIA
============================================
- Correctly identifies unresolved placeholders before invoking fn.
- Fills placeholders positionally, not just appends.
- Supports placeholders across MULTIPLE chained calls (fn(_,2)(_,3)(1)).
- Uses a Symbol (or unique sentinel) for the placeholder, not a plain
  string/undefined that could collide with real argument values.
*/
