/**
 * Q26: Destructuring Defaults and Edge Cases
 * Difficulty: Medium-Hard
 * Concepts: default value triggers, nested destructuring failures, swapping, computed keys, function param destructuring
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the output or error for each:

// A
const { a = 10 } = { a: undefined };
console.log(a);

// B
const { b = 10 } = { b: null };
console.log(b);

// C
const { c = 10 } = {};
console.log(c);

// D
const { x: { y } = {} } = {};
console.log(y);

// E
const { p: { q } } = {};
console.log(q);

// F
let m = 1, n = 2;
[m, n] = [n, m];
console.log(m, n);

// G
function greet({ name = 'Guest', opts: { loud = false } = {} } = {}) {
  return loud ? `${name.toUpperCase()}!` : name;
}
console.log(greet());
console.log(greet({ name: 'Ada' }));
console.log(greet({ name: 'Ada', opts: { loud: true } }));

// H
const key = 'dynamic';
const { [key]: value } = { dynamic: 'found me' };
console.log(value);
*/

// ============================================
// ANSWERS
// ============================================

/*
A: 10 — default values trigger ONLY when the extracted value is
   `undefined`, not just "falsy" or "missing". `a: undefined`
   explicitly IS undefined, so the default kicks in.

B: null — `null` is NOT `undefined`, so the default is NOT applied.
   This is the #1 trap: defaults check strictly for undefined, not
   falsiness.

C: 10 — key `c` doesn't exist at all, so it's undefined, default applies.

D: undefined — `x` is missing, so `{ y } = {}` (the default {} kicks
   in because x is undefined), then `y` is destructured from that empty
   object, giving undefined. No error, because a default for `x` was
   provided.

E: TypeError: Cannot destructure property 'q' of 'undefined' (or
   similar) — `p` doesn't exist on the source, so it's `undefined`. Then
   the code tries to destructure `q` FROM `undefined` directly (`{q}` =
   undefined), which throws immediately because there is no default
   fallback for `p` like there was for `x` in case D.

F: 2 1 — array destructuring swap idiom. The right-hand array
   `[n, m]` is evaluated FIRST (using original values, n=2, m=1),
   producing [2, 1], which is then destructured into [m, n], so m=2,
   n=1.

G: "Guest", "Ada", "ADA!"
   greet() -> the whole parameter defaults to {} (since called with no
   args), then name defaults to 'Guest', opts defaults to {} so loud
   defaults to false -> "Guest".
   greet({name:'Ada'}) -> opts is missing -> defaults to {} -> loud
   false -> "Ada".
   greet({name:'Ada', opts:{loud:true}}) -> loud is true -> "ADA!".

H: "found me" — computed property key destructuring works exactly like
   computed keys in object literals; `[key]` is evaluated to the string
   'dynamic' and used as the property name to extract.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly distinguishes "undefined triggers default" from "falsy
  triggers default" (cases A vs B are the key differentiator).
- Understands nested destructuring failure modes (D succeeds because of
  a provided default at the intermediate level; E throws because there
  isn't one).
- Knows the swap idiom evaluates the RHS fully before assigning.
- Comfortable with default parameter objects for functions (a very
  common React/Node function-signature pattern).
*/
