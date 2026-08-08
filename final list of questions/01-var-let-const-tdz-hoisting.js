/**
 * Q1: var / let / const — Hoisting and the Temporal Dead Zone
 * Difficulty: Medium
 * Concepts: hoisting, TDZ, function scope vs block scope, redeclaration
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the exact output (or error) of each block below, in order.
Explain WHY each one behaves the way it does.

// Block A
console.log(a);
var a = 10;

// Block B
console.log(b);
let b = 10;

// Block C
function foo() {
  console.log(typeof c);
  let c = 5;
}
foo();

// Block D
let d = 1;
{
  console.log(d);
  let d = 2;
}

// Block E
if (true) {
  function e() { return 'block-scoped-ish'; }
}
console.log(typeof e);
*/

// ============================================
// ANSWER
// ============================================

// Block A -> undefined
// `var a` is hoisted to the top of the enclosing function/global scope
// and initialized with `undefined`. The assignment `a = 10` happens later.

// Block B -> ReferenceError: Cannot access 'b' before initialization
// `let b` IS hoisted (to the top of the block), but it stays in the
// Temporal Dead Zone until the `let` statement executes. Referencing it
// before that throws, unlike `var`.

// Block C -> ReferenceError: Cannot access 'c' before initialization
// Even `typeof` does not protect you from the TDZ for a block-scoped
// binding that has already been hoisted into that scope. (Compare this
// to `typeof neverDeclared`, which safely returns "undefined".)

// Block D -> ReferenceError: Cannot access 'd' before initialization
// The inner block has its OWN `d` (hoisted into the TDZ for that block).
// Because of this shadowing declaration, `console.log(d)` refers to the
// inner `d`, not the outer one, and throws.

// Block E -> "function" in non-strict sloppy mode in most engines (V8),
// but this is legacy, browser-specific "Annex B" behavior and is NOT
// reliable — in strict mode / ES modules it stays block-scoped and
// logs "undefined". This is a good one to flag as "it depends on the
// environment" — a mature answer says exactly that.

/*
============================================
FOLLOW-UPS
============================================
1) Why does `let`/`const` hoist at all if it just throws when accessed early?
   -> Because scoping is determined statically (lexically) before execution;
      the engine needs to know `b` belongs to this scope during the whole
      pass, it just delays making it usable until the declaration runs.

2) Is `const` hoisted the same way as `let`?
   -> Yes, identical hoisting/TDZ semantics. The only extra rule for `const`
      is that it must be initialized at declaration and cannot be reassigned.

3) What's the practical bug pattern this causes in real code?
   -> Using a variable inside a closure/callback defined above its `let`
      declaration in the same block (e.g. an early-return helper function
      referencing a config `let` declared later in the module).
*/
