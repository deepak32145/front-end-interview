/**
 * Q45: structuredClone vs JSON.parse(JSON.stringify()) — Pitfalls
 * Difficulty: Medium-Hard
 * Concepts: serialization limitations, data type loss, circular reference handling, performance
 */

// ============================================
// QUESTION
// ============================================
/*
For EACH value below, state what JSON.parse(JSON.stringify(value))
produces (including any thrown errors or silently dropped data), and
what structuredClone(value) produces instead:

const values = {
  a: undefined,
  b: function () {},
  c: Symbol('x'),
  d: new Date('2024-01-01'),
  e: NaN,
  f: Infinity,
  g: new Map([['k', 1]]),
  h: new Set([1, 2]),
  i: /abc/gi,
  j: new Int32Array([1, 2, 3]),
  k: undefined
};
values.circular = values; // self-reference

console.log(JSON.parse(JSON.stringify(values)));  // A
console.log(structuredClone(values));               // B
*/

// ============================================
// ANSWERS
// ============================================

/*
A) JSON.parse(JSON.stringify(values)) THROWS before even producing a
   result: "TypeError: Converting circular structure to JSON" — because
   of the `circular` self-reference. JSON.stringify has NO support for
   circular structures at all; it throws immediately upon detecting one
   during serialization.

   If we REMOVE the circular reference and re-run just to see how the
   OTHER fields fare:

   {
     "d": "2024-01-01T00:00:00.000Z",
     "e": null,
     "f": null,
     "g": {},
     "h": {},
     "i": {}
   }

   Breakdown of what happened to each key:
   - a (undefined): DROPPED ENTIRELY — object properties with an
     `undefined` value are omitted by JSON.stringify.
   - b (function): DROPPED ENTIRELY — functions are not valid JSON and
     are silently skipped as object properties (would become `null` if
     it were an array element instead).
   - c (Symbol): DROPPED ENTIRELY — same treatment as functions.
   - d (Date): converted to an ISO 8601 STRING (via Date's own
     .toJSON()/toISOString()) — you get a string back, NOT a Date
     object; re-parsing requires manually calling `new Date(...)` again.
   - e (NaN): becomes `null` — JSON has no representation for NaN.
   - f (Infinity): becomes `null` — same reasoning.
   - g (Map): becomes `{}` — an EMPTY plain object. Map has no
     .toJSON(), and JSON.stringify doesn't know how to iterate its
     entries, so it just serializes it as if it were a plain object
     with no own enumerable string-keyed properties (which is what a
     Map instance looks like when you ignore its internal slot).
   - h (Set): becomes `{}` — same reasoning as Map.
   - i (RegExp): becomes `{}` — RegExp has no own enumerable properties
     either (source/flags are accessor properties on the prototype),
     so it serializes to an empty object, LOSING the pattern entirely.
   - j (Int32Array): becomes a plain array-like object
     `{"0":1,"1":2,"2":3}` — typed arrays DO have enumerable indexed
     properties, so their VALUES survive, but the result is a plain
     object/array of numbers, not a reconstructed Int32Array.
   - k (undefined): dropped, same as `a`.

B) structuredClone(values) — with the circular reference INTACT this
   time (structuredClone natively supports it):
   - a, k (undefined): PRESERVED as actual `undefined` values (unlike
     JSON, which drops them).
   - b (function): THROWS — "DataCloneError: could not be cloned"
     because functions are NOT structured-cloneable at all. This is a
     genuine limitation, not a silent drop — the WHOLE clone operation
     fails.
   - c (Symbol): also THROWS — DataCloneError, symbols aren't cloneable.
   - d (Date): correctly cloned as an actual NEW Date object with the
     same time value (real Date instance, not a string).
   - e (NaN): preserved as actual NaN (structuredClone uses the
     structured clone ALGORITHM, not JSON, so it handles all IEEE 754
     values correctly).
   - f (Infinity): preserved as actual Infinity.
   - g (Map): correctly cloned as an actual NEW Map with the same
     entries.
   - h (Set): correctly cloned as an actual NEW Set with the same values.
   - i (RegExp): correctly cloned as an actual NEW RegExp with the same
     source and flags.
   - j (Int32Array): correctly cloned as an actual NEW Int32Array
     (typed arrays and ArrayBuffers are natively supported).
   - circular: correctly preserved — the clone's `circular` property
     points back to the CLONE itself, not the original, mirroring the
     self-reference structure faithfully.

   IN PRACTICE: because `values.b` (a function) is present,
   `structuredClone(values)` as literally written in the question WOULD
   THROW immediately due to the function, before any of the other nice
   behavior is observable — this is worth calling out explicitly: JSON
   silently DROPS unsupported types, while structuredClone FAILS LOUDLY
   on them. Neither is strictly "safer" in isolation, but structuredClone's
   loud failure is arguably better for catching bugs during development.
*/

/*
============================================
QUICK REFERENCE
============================================
| Type          | JSON.stringify        | structuredClone       |
|----------------|------------------------|-------------------------|
| undefined      | dropped                | preserved               |
| function       | dropped                | throws                  |
| Symbol         | dropped                | throws                  |
| Date           | -> ISO string          | -> real Date            |
| NaN/Infinity   | -> null                | preserved               |
| Map/Set        | -> {}                  | preserved               |
| RegExp         | -> {}                  | preserved               |
| circular refs  | throws                 | preserved               |
| TypedArray     | -> plain array-like    | preserved               |

============================================
EVALUATION CRITERIA
============================================
- Knows JSON.stringify SILENTLY drops undefined/functions/Symbols
  rather than erroring, while structuredClone THROWS for those same
  types — this asymmetry is the core lesson.
- Correctly identifies which types survive structuredClone natively
  (Date, Map, Set, RegExp, TypedArray, circular refs).
- Notes that structuredClone still has real limits (no functions, no
  DOM nodes in some host environments, no class instances with custom
  prototypes — prototype is lost, becomes a plain object).
*/
