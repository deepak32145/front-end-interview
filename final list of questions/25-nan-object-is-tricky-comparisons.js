/**
 * Q25: NaN, Object.is, and Numeric Edge Cases
 * Difficulty: Medium-Hard
 * Concepts: IEEE 754 floats, Object.is semantics, isNaN vs Number.isNaN, float precision
 */

// ============================================
// QUESTION
// ============================================
/*
console.log(NaN === NaN);                 // ?
console.log(Object.is(NaN, NaN));         // ?
console.log(Object.is(0, -0));            // ?
console.log(0 === -0);                    // ?
console.log(1/0);                         // ?
console.log(1/-0);                        // ?
console.log(isNaN('hello'));              // ?
console.log(Number.isNaN('hello'));       // ?
console.log(isNaN(undefined));            // ?
console.log(Number.isNaN(undefined));     // ?
console.log(0.1 + 0.2 === 0.3);           // ?
console.log(0.1 + 0.2);                   // ?

Implement `myIsNaN(value)` that behaves like `Number.isNaN` (strict, no
coercion) WITHOUT using Number.isNaN or Object.is, and
`floatEquals(a, b, epsilon)` for safe float comparison.
*/

// ============================================
// ANSWERS
// ============================================

/*
NaN === NaN               -> false (IEEE 754: NaN is never equal to
                              anything via ===, including itself)
Object.is(NaN, NaN)       -> true  (Object.is uses "SameValue" semantics,
                              specifically carved out to treat NaN as
                              equal to itself — this is its main
                              practical difference from ===)
Object.is(0, -0)          -> false (Object.is DOES distinguish signed
                              zero, unlike === which treats them equal)
0 === -0                  -> true
1/0                       -> Infinity
1/-0                      -> -Infinity (proof that -0 is a distinct
                              internal value even though 0 === -0)
isNaN('hello')            -> true — the GLOBAL isNaN() coerces its
                              argument to a Number FIRST (Number('hello')
                              is NaN), so it says "yes this is NaN" for
                              almost any non-numeric string.
Number.isNaN('hello')     -> false — Number.isNaN does NOT coerce; it
                              only returns true if the value IS the
                              number NaN already (type must already be
                              'number').
isNaN(undefined)          -> true  (Number(undefined) is NaN)
Number.isNaN(undefined)   -> false (undefined is not of type number)
0.1 + 0.2 === 0.3          -> false — classic floating point precision
                              issue (IEEE 754 double precision cannot
                              represent 0.1 or 0.2 exactly in binary).
0.1 + 0.2                  -> 0.30000000000000004
*/

function myIsNaN(value) {
  // NaN is the ONLY JS value that is not equal to itself under ===.
  // This is actually the canonical trick for detecting it without any
  // built-in helper.
  return typeof value === 'number' && value !== value;
}

function floatEquals(a, b, epsilon = Number.EPSILON * 8) {
  return Math.abs(a - b) < epsilon;
}

/*
============================================
TEST
============================================
console.log(myIsNaN(NaN));        // true
console.log(myIsNaN('hello'));    // false (not typeof number)
console.log(myIsNaN(0/0));        // true

console.log(floatEquals(0.1 + 0.2, 0.3)); // true
console.log(0.1 + 0.2 === 0.3);            // false

============================================
FOLLOW-UP
============================================
Why is `Number.EPSILON` alone often NOT enough for a robust float
comparison at larger magnitudes?
-> Number.EPSILON (~2.22e-16) represents the smallest difference near
1.0, but floating point precision loss SCALES with the magnitude of the
numbers involved. Comparing two numbers around 1e15 needs a much larger
absolute (or better, RELATIVE) epsilon: e.g.
`Math.abs(a-b) <= epsilon * Math.max(Math.abs(a), Math.abs(b))`.
A senior candidate should flag this rather than presenting a fixed
epsilon as a universal solution.
*/
