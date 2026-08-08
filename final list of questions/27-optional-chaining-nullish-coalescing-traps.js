/**
 * Q27: Optional Chaining and Nullish Coalescing Traps
 * Difficulty: Medium-Hard
 * Concepts: short-circuiting, ?. vs &&, ?? vs ||, mixing ?? with && / ||, function call chaining
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the output or error for each:

// A
const user = { profile: { age: 0 } };
console.log(user.profile?.age || 18);
console.log(user.profile?.age ?? 18);

// B
const obj = { greet: null };
console.log(obj.greet?.());

// C
console.log(obj.notAFunction?.());
console.log(obj.alsoMissing.deeper);

// D
const config = { count: 0, label: '' };
console.log(config.count ?? 10);
console.log(config.count || 10);
console.log(config.label ?? 'default');
console.log(config.label || 'default');

// E — this line, does it compile/run?
console.log(true ?? false || true);

// F
let calls = 0;
function withSideEffect() { calls++; return null; }
const result = withSideEffect()?.value ?? 'fallback';
console.log(result, calls);

// G
const arr = null;
console.log(arr?.[0]);
console.log(arr?.length);
*/

// ============================================
// ANSWERS
// ============================================

/*
A:
  user.profile?.age || 18   -> 18  ("age" is 0, which is FALSY, so ||
                                    incorrectly treats a legitimate 0 as
                                    "missing" and substitutes 18 — the
                                    classic bug ?? was invented to fix)
  user.profile?.age ?? 18   -> 0   (?? only falls back on null/undefined,
                                    so the real value 0 is preserved)

B: undefined — `obj.greet` exists but is `null`. `?.()` short-circuits
   the CALL (not just property access) when the thing being called is
   null/undefined, returning `undefined` instead of throwing
   "greet is not a function".

C:
  obj.notAFunction?.()      -> undefined (property doesn't exist ->
                                undefined, ?.() short-circuits the call)
  obj.alsoMissing.deeper    -> THROWS: Cannot read properties of
                                undefined (reading 'deeper'). No `?.`
                                was used here, so accessing `.deeper` on
                                undefined (obj.alsoMissing) throws
                                normally. This tests whether candidates
                                understand optional chaining must be
                                applied at EVERY link that might be
                                nullish, not just the first one.

D:
  config.count ?? 10   -> 0  (0 is not nullish)
  config.count || 10   -> 10 (0 is falsy)
  config.label ?? 'default' -> '' (empty string is not nullish)
  config.label || 'default' -> 'default' ('' is falsy)

E: SyntaxError: Unexpected token '||' — you CANNOT mix `??` directly
   with `||` or `&&` without explicit parentheses. The spec forbids it
   to avoid ambiguous precedence bugs; you must write
   `(true ?? false) || true` or `true ?? (false || true)` explicitly.

F: "fallback", 1 — `withSideEffect()` DOES execute (calls becomes 1)
   because `?.` only short-circuits what comes AFTER it in the chain,
   not the call itself. It returns `null`, so `null?.value` short-
   circuits to `undefined`, and `undefined ?? 'fallback'` gives
   'fallback'.

G:
  arr?.[0]     -> undefined (arr is null, optional chaining short-
                  circuits the whole rest of the expression)
  arr?.length  -> undefined (same reasoning)
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Explains WHY ?? exists (the 0/''/false-vs-missing distinction that ||
  gets wrong) — this is the headline concept.
- Knows optional chaining must be threaded through EVERY potentially-
  nullish link, not just the first.
- Knows mixing ?? with || / && without parens is a syntax error, not
  just bad style — many candidates guess wrong here.
- Understands ?.() short-circuits the CALL but earlier expressions in
  the chain (like the function invocation producing the null in case F)
  still execute.
*/
