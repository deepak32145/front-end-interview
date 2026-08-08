/**
 * Q20: Deep Clone with Circular References and Special Types
 * Difficulty: Very Hard
 * Concepts: WeakMap visited-tracking, recursive cloning, Map/Set/Date/RegExp handling, structuredClone comparison
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `deepClone(value)` WITHOUT using JSON.parse(JSON.stringify()),
supporting:
- Plain objects and arrays (nested, arbitrary depth)
- Circular references (an object that references itself, directly or
  indirectly) — must NOT infinite-loop or stack overflow
- Date, RegExp, Map, Set
- Preserves the correct prototype (cloned object should still be
  `instanceof` its original class where reasonable)
- Functions are copied BY REFERENCE (not cloned — they're not clonable
  in a meaningful way)

const a = { x: 1, date: new Date(), set: new Set([1,2]) };
a.self = a; // circular
const b = deepClone(a);
b.self === b;      // true (circular ref preserved in the CLONE's graph)
b.self === a;       // false (fully independent clone)
b.date !== a.date;  // true (new Date instance, same time value)
*/

// ============================================
// ANSWER
// ============================================

function deepClone(value, seen = new WeakMap()) {
  // Primitives (and null) are returned as-is.
  if (value === null || typeof value !== 'object') {
    return value;
  }

  // Functions are not meaningfully cloneable — return by reference.
  if (typeof value === 'function') {
    return value;
  }

  // Circular reference guard: if we've already started cloning this
  // exact object, return the (possibly still-being-populated) clone
  // instead of recursing again.
  if (seen.has(value)) {
    return seen.get(value);
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const clone = new Map();
    seen.set(value, clone);
    for (const [k, v] of value) {
      clone.set(deepClone(k, seen), deepClone(v, seen));
    }
    return clone;
  }

  if (value instanceof Set) {
    const clone = new Set();
    seen.set(value, clone);
    for (const v of value) {
      clone.add(deepClone(v, seen));
    }
    return clone;
  }

  if (Array.isArray(value)) {
    const clone = [];
    seen.set(value, clone);
    value.forEach((item, i) => {
      clone[i] = deepClone(item, seen);
    });
    return clone;
  }

  // Plain object (or class instance) — preserve prototype.
  const clone = Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone);
  for (const key of Object.keys(value)) {
    clone[key] = deepClone(value[key], seen);
  }
  // Also copy symbol-keyed own properties for completeness.
  for (const sym of Object.getOwnPropertySymbols(value)) {
    clone[sym] = deepClone(value[sym], seen);
  }
  return clone;
}

/*
============================================
TEST
============================================
const a = { x: 1, date: new Date(), set: new Set([1, 2]) };
a.self = a;
const b = deepClone(a);

console.log(b.self === b);   // true
console.log(b.self === a);   // false
console.log(b.date !== a.date && b.date.getTime() === a.date.getTime()); // true
console.log(b.set !== a.set && [...b.set].join() === [...a.set].join()); // true

============================================
WHY WeakMap AND NOT A REGULAR Map/Array FOR `seen`?
============================================
WeakMap keys are held weakly — they don't prevent the original objects
from being garbage collected once cloning finishes and nothing else
references them. Using a Map would work functionally identically here
(the map itself is short-lived) but WeakMap is the idiomatic/expected
answer for "track object identity without leaking memory."

============================================
FOLLOW-UP: How does this compare to the native structuredClone()?
============================================
`structuredClone()` (available in modern browsers/Node 17+) natively
handles circular refs, Date, RegExp, Map, Set, ArrayBuffer/TypedArrays,
and more — and is implemented in C++, so it's faster and more complete.
It CANNOT clone functions, DOM nodes (in some cases), or class instances
with custom prototypes (it loses the prototype, unlike this
implementation, and throws on functions instead of skipping them).
Use structuredClone in production; implement this by hand only to prove
you understand what it's doing internally.
*/
