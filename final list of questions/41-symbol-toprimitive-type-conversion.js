/**
 * Q41: Symbol.toPrimitive and Custom Type Conversion
 * Difficulty: Hard
 * Concepts: ToPrimitive algorithm, hint parameter (number/string/default), valueOf/toString fallback order
 */

// ============================================
// QUESTION
// ============================================
/*
class Money {
  constructor(cents) {
    this.cents = cents;
  }
  valueOf() {
    return this.cents / 100;
  }
  toString() {
    return `$${(this.cents / 100).toFixed(2)}`;
  }
}

const price = new Money(1999);

console.log(price + 1);          // A
console.log(`${price}`);         // B
console.log(price == 19.99);     // C
console.log(price > 10);         // D

Now add:
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.cents / 100;
    if (hint === 'string') return `$${(this.cents / 100).toFixed(2)}`;
    return `Money(${this.cents})`; // hint === 'default'
  }

Re-answer A-D with Symbol.toPrimitive present (it takes priority over
valueOf/toString entirely when defined). Also answer:

console.log(price + '');   // E — which hint is used for binary +?
console.log(String(price)); // F — which hint?
console.log(Number(price)); // G — which hint?
*/

// ============================================
// ANSWERS
// ============================================

/*
WITHOUT Symbol.toPrimitive (only valueOf/toString):

A: 20.99 — binary `+` uses the "default" hint, which tries valueOf()
   FIRST (before toString()) for ordinary objects. valueOf() returns
   19.99, so 19.99 + 1 = 20.99.

B: "$19.99" — template literal interpolation uses the "string" hint,
   which tries toString() FIRST. Result: "$19.99".

C: true — `==` with an object on one side coerces via ToPrimitive with
   "default" hint -> valueOf() -> 19.99, then 19.99 == 19.99.

D: true — relational operators use the "number" hint -> valueOf() ->
   19.99, then 19.99 > 10.

WITH Symbol.toPrimitive DEFINED:
Symbol.toPrimitive, when present, COMPLETELY REPLACES the
valueOf/toString fallback mechanism — it's consulted FIRST, and its
return value is used directly (whatever type it returns, assuming it's
a primitive), no further coercion attempts.

A: price + 1 -> hint 'default' -> "Money(1999)" + 1 -> "Money(19991)"
   (string concatenation now, NOT numeric addition!) — a significant
   BEHAVIOR CHANGE from before, and a common gotcha: adding
   Symbol.toPrimitive with a 'default' case that returns a STRING
   silently breaks arithmetic that used to work via valueOf().

B: `${price}` -> hint 'string' -> "$19.99" (same as before, by design
   in this implementation).

C: price == 19.99 -> hint 'default' -> "Money(1999)" == 19.99 -> string
   vs number, ToNumber("Money(1999)") is NaN -> NaN == 19.99 -> FALSE.
   (Changed from true to false! Another consequence of the 'default'
   hint returning a string here.)

D: price > 10 -> hint 'number' -> this.cents/100 = 19.99 -> 19.99 > 10
   -> true (relational operators always use 'number' hint, unaffected
   by the 'default' case).

E: price + ''  -> hint 'default' (binary + ALWAYS uses 'default', even
   when one operand is already a string) -> "Money(1999)" + "" ->
   "Money(1999)"

F: String(price) -> hint 'string' -> "$19.99"

G: Number(price) -> hint 'number' -> 19.99
*/

/*
============================================
KEY TAKEAWAY
============================================
Binary `+` and `==`/`!=` and template literals do NOT all use the same
hint. Relational operators (`<`,`>`,`<=`,`>=`) and explicit `Number()`
conversion use 'number'. Template literals and explicit `String()` use
'string'. Binary `+` and `==` (when coercing an object) and implicit
coercions in most other contexts use 'default'. Adding
Symbol.toPrimitive is powerful but DANGEROUS if the 'default' case
doesn't return something that behaves sanely under both string
concatenation and equality — this question specifically demonstrates
how a well-intentioned custom toPrimitive can silently break `+` and
`==` behavior that previously worked via valueOf().

============================================
EVALUATION CRITERIA
============================================
- Correctly identifies which hint applies to each operator BEFORE
  Symbol.toPrimitive is added (relies on knowing valueOf-first-for-
  default vs toString-first-for-string).
- Correctly identifies that Symbol.toPrimitive, once present, bypasses
  valueOf/toString ENTIRELY — not just adds a third option.
- Catches the regression in A and C caused by 'default' returning a
  string instead of a number — this is the "very hard" differentiator.
*/
