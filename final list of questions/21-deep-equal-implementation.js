/**
 * Q21: Implement a Deep Equality Check
 * Difficulty: Hard
 * Concepts: recursive comparison, NaN/±0 edge cases, circular structures, type-specific equality (Date/Map/Set/Array)
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `deepEqual(a, b)` that:
- Returns true for structurally identical objects/arrays regardless of
  reference identity.
- Correctly handles NaN (deepEqual(NaN, NaN) === true, unlike ===).
- Correctly handles +0 vs -0 (deepEqual(0, -0) should be... discuss both
  answers and defend one).
- Compares Date objects by time value, RegExp by source+flags.
- Compares Map/Set by contents, not reference or insertion order.
- Does not infinite-loop on circular references.
- Object key comparison ignores key ORDER but not key PRESENCE.

deepEqual({a:1, b:{c:[1,2,3]}}, {b:{c:[1,2,3]}, a:1}); // true
deepEqual([1,2,3], [1,2,'3']);                          // false
deepEqual(NaN, NaN);                                     // true
*/

// ============================================
// ANSWER
// ============================================

function deepEqual(a, b, seen = new WeakMap()) {
  // Object.is correctly distinguishes NaN===NaN (true) and +0 vs -0
  // (false), which is usually what you want for a "deep equal" utility
  // that should be strict about numeric identity while still treating
  // NaN as equal to itself (unlike ===).
  if (Object.is(a, b)) return true;

  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;

  // Circular reference guard: if we're already comparing this exact
  // pair, assume equal for now (avoids infinite recursion; correct for
  // well-formed circular structures being compared to themselves).
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((item, i) => deepEqual(item, b[i], seen));
  }

  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key)) return false;
      if (!deepEqual(val, b.get(key), seen)) return false;
    }
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    // Sets have no keys to align by — for primitive values this simple
    // approach works; deep-equal SET MEMBERS (objects) would need a
    // more expensive bipartite matching, called out as a known limit.
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }

  // Plain objects
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key], seen)
  );
}

/*
============================================
TEST
============================================
console.log(deepEqual({a:1, b:{c:[1,2,3]}}, {b:{c:[1,2,3]}, a:1})); // true
console.log(deepEqual([1,2,3], [1,2,'3']));                          // false
console.log(deepEqual(NaN, NaN));                                     // true
console.log(deepEqual(0, -0));                                        // false (Object.is distinguishes them)
console.log(deepEqual(new Date(2024,0,1), new Date(2024,0,1)));       // true
console.log(deepEqual(new Set([{x:1}]), new Set([{x:1}])));           // true (reference-different objects, but this
                                                                        // Set impl only checks .has() by reference —
                                                                        // FLAG this as a discussion point, not a pass)

============================================
DISCUSSION: +0 vs -0
============================================
Using `===`, `0 === -0` is true — which is often surprising and masks
real bugs in numeric edge cases (e.g. -0 breaking a "sign" check
downstream). Using `Object.is`, they're treated as DIFFERENT. Which is
"correct" depends on the use case: for a general-purpose deep-equal
utility used in tests (like Jest's toEqual, which treats -0 and 0 as
DIFFERENT via Object.is-like semantics for .toBe but EQUAL for
.toEqual), there's no universally right answer — the important thing is
a candidate can articulate the tradeoff, not just pick one silently.

============================================
EVALUATION CRITERIA
============================================
- Uses Object.is (or manual NaN/+0/-0 handling) instead of naive ===.
- Doesn't accidentally treat arrays and object-likes the same (must
  check Array.isArray explicitly).
- Handles Map/Set/Date/RegExp as special cases, not generic objects.
- Recognizes/discusses the Set-of-objects limitation.
- Circular reference safety.
*/
