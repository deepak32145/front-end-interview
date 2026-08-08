/**
 * Q34: Symbol.iterator — Building Custom Iterables
 * Difficulty: Hard
 * Concepts: iterable protocol, iterator protocol, for...of internals, spread/destructuring reliance on iterators
 */

// ============================================
// QUESTION
// ============================================
/*
1) What's the precise difference between the "iterable protocol" and
   the "iterator protocol"? Why does an object need BOTH to work with
   `for...of`?

2) Implement a `Range` class that is iterable and supports:
   - for...of iteration
   - spreading: [...new Range(1, 5)]
   - destructuring: const [a, b] = new Range(1, 5)
   - being iterated MULTIPLE times independently (two separate for...of
     loops over the same instance must both start from the beginning)

3) Bug hunt: why does this NOT work as an iterable, and what's the fix?

const brokenRange = {
  from: 1,
  to: 3,
  next() {
    return this.from <= this.to
      ? { value: this.from++, done: false }
      : { done: true };
  }
};
for (const n of brokenRange) console.log(n); // TypeError!
*/

// ============================================
// ANSWERS
// ============================================

/*
1) ITERATOR protocol: an object with a `.next()` method that returns
   `{ value, done }` objects — this describes something that can be
   STEPPED THROUGH once.

   ITERABLE protocol: an object with a `[Symbol.iterator]()` method
   that RETURNS an iterator — this describes something that knows HOW
   TO PRODUCE an iterator (potentially a fresh one each time).

   `for...of` calls `obj[Symbol.iterator]()` to get an iterator, THEN
   repeatedly calls `.next()` on that iterator. An object needs BOTH
   protocols wired together (usually: iterable's [Symbol.iterator]
   method returns AN iterator object, often `this` or a fresh object)
   because for...of never calls `.next()` directly on the iterable
   itself — it insists on going through [Symbol.iterator] first. This
   separation is what allows an iterable to be iterated multiple times
   independently: each call to [Symbol.iterator]() can return a BRAND
   NEW iterator with its own internal position.
*/

class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    // Fresh position state PER call, so multiple simultaneous/repeated
    // iterations don't interfere with each other.
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
      // Being iterable-of-itself (returning `this`) is a common
      // convenience so the ITERATOR can also be used directly in a
      // for...of loop, not just the original Range.
      [Symbol.iterator]() {
        return this;
      }
    };
  }
}

/*
============================================
TEST
============================================
const r = new Range(1, 5);
console.log([...r]);             // [1,2,3,4,5]
const [a, b] = r;
console.log(a, b);                // 1 2

// Prove independent iteration:
for (const x of r) { if (x === 3) break; console.log('first pass', x); }
for (const x of r) console.log('second pass', x); // starts at 1 again
*/

/*
3) BUG: `brokenRange` has a `.next()` method (satisfies the ITERATOR
   protocol) but NO `[Symbol.iterator]` method (does NOT satisfy the
   ITERABLE protocol). `for...of` looks for `obj[Symbol.iterator]`
   FIRST — since it's missing, `for...of` throws
   "TypeError: brokenRange is not iterable" immediately, without ever
   even looking at `.next()`.

FIX:
const fixedRange = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    return this; // make the object BOTH the iterable and its own iterator
  },
  next() {
    return this.from <= this.to
      ? { value: this.from++, done: false }
      : { done: true, value: undefined };
  }
};
for (const n of fixedRange) console.log(n); // 1, 2, 3

Note: this "self-iterator" style CANNOT be iterated twice independently
(the internal `from` position is shared/mutated across iterations) —
that's the tradeoff vs the Range class above, which creates a fresh
closure-based iterator per [Symbol.iterator]() call.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Clearly separates iterable vs iterator protocol, not conflating them.
- Range implementation supports repeated/independent iteration (a
  common miss: reusing `this.start` as mutable state directly on the
  object breaks re-iteration).
- Correctly diagnoses the missing [Symbol.iterator] as the root cause
  in the bug hunt, not something wrong with the .next() logic itself.
*/
