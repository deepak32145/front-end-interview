/**
 * Q24: Type Coercion and Equality Gotchas
 * Difficulty: Hard
 * Concepts: ToPrimitive algorithm, == coercion rules, valueOf/toString order, array/object coercion
 */

// ============================================
// QUESTION
// ============================================
/*
Predict each result. For the trickiest ones, explain the coercion steps.

console.log([] == ![]);            // ?
console.log([] == '');             // ?
console.log([] == 0);              // ?
console.log(['']  == false);       // ?
console.log([1,2] == '1,2');       // ?
console.log(null == undefined);    // ?
console.log(null == 0);            // ?
console.log(NaN == NaN);           // ?
console.log('0' == false);         // ?
console.log(' \t\n' == 0);         // ?
console.log([] + []);              // ?
console.log([] + {});              // ?
console.log({} + []);              // ? (in a statement context vs expression context — discuss)
console.log(1 < 2 < 3);            // ?
console.log(3 > 2 > 1);            // ?
*/

// ============================================
// ANSWERS
// ============================================

/*
[] == ![]  -> true
Step-by-step: `![]` evaluates first. `[]` is a truthy object, so
`![]` is `false`. Now we compare `[] == false`. One side is boolean,
so ToNumber(false) = 0. Now `[] == 0`. One side is an object, one is a
number, so ToPrimitive([]) is called: arrays have no valueOf returning
a primitive, so it falls to toString() -> "" (empty string). Now
`"" == 0` -> ToNumber("") = 0 -> `0 == 0` -> true.

[] == ''  -> true — ToPrimitive([]) -> "" , then "" == "" -> true.

[] == 0   -> true — same ToPrimitive path as above -> "" == 0 -> 0 == 0.

[''] == false -> true — ToPrimitive(['']) -> "" (array toString joins
with comma, single empty-string element -> ""), ToNumber(false) = 0,
"" == 0 -> ToNumber("") = 0 -> true.

[1,2] == '1,2' -> true — ToPrimitive([1,2]) -> "1,2" via Array.toString
(join with commas), then string === string comparison -> true.

null == undefined -> true — SPECIAL CASE written directly into the spec:
null and undefined are loosely equal ONLY to each other and themselves,
never coerced to numbers for ==.

null == 0 -> false — precisely because of the special case above: null
is NOT converted to 0 for == purposes (this trips people up who assume
null coerces to a "falsy zero").

NaN == NaN -> false — NaN is never equal to anything, including itself,
by IEEE 754 definition.

'0' == false -> true — ToNumber('0') = 0, ToNumber(false) = 0, 0==0.

' \t\n' == 0 -> true — whitespace-only strings convert to 0 via
ToNumber (ToNumber trims whitespace and treats an empty-after-trim
string as 0).

[] + []   -> "" — ToPrimitive on both sides for + with no numeric hint
prefers a string result when either side stringifies; [].toString()=""
so "" + "" = "".

[] + {}   -> "[object Object]" — [].toString() = "", {}.toString() =
"[object Object]", concatenated as a binary expression -> "[object Object]".

{} + []   -> DEPENDS ON CONTEXT. As a full statement at the START of a
line in a non-strict script, `{}` is parsed as an empty BLOCK STATEMENT,
not an object literal, so this becomes `+[]` (unary plus on []), which
is `0`. But as an EXPRESSION (e.g. `const x = {} + [];` or wrapped in
parens `({} + [])`), `{}` IS parsed as an object literal, giving
"[object Object]" (same as the previous case). This ambiguity is a
classic JS parser quirk interviewers love because it shows whether a
candidate understands statement vs expression parsing context.

1 < 2 < 3 -> true — evaluates left-to-right: (1 < 2) is true, then
true < 3 -> ToNumber(true)=1, 1 < 3 -> true.

3 > 2 > 1 -> false — (3 > 2) is true, then true > 1 -> ToNumber(true)=1,
1 > 1 -> false. Chained relational operators do NOT work like in math —
each comparison's BOOLEAN RESULT gets coerced into the next comparison.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly recalls the null/undefined special-case rule (most common
  wrong answer: assuming null==0 is true).
- Can walk through ToPrimitive/ToNumber step by step, not just recite
  memorized answers.
- Recognizes the {} + [] statement-vs-expression ambiguity — this is
  the standout "very hard" differentiator question in this file.
- Understands chained comparison operators aren't transitive/mathematical.
*/
