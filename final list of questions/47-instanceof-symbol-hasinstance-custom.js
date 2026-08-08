/**
 * Q47: instanceof Internals and Symbol.hasInstance
 * Difficulty: Hard
 * Concepts: prototype chain walking, custom instanceof logic, duck-typing checks, primitive vs boxed instanceof
 */

// ============================================
// QUESTION
// ============================================
/*
1) What does `x instanceof Y` ACTUALLY check, step by step? Why does
   this fail for primitives?

console.log(5 instanceof Number);              // A
console.log(new Number(5) instanceof Number);  // B
console.log('' instanceof String);              // C

2) Implement a class `Even` such that `instanceof` performs a VALUE
   check instead of a prototype-chain check:

console.log(4 instanceof Even);   // should be true
console.log(5 instanceof Even);   // should be false
console.log([] instanceof Even);  // should be false (not even a number)

3) Predict this trickier case:

class Base {}
class Derived extends Base {}
const d = new Derived();

console.log(d instanceof Derived); // D
console.log(d instanceof Base);    // E

Object.setPrototypeOf(Derived.prototype, null);
console.log(d instanceof Base);    // F — did changing the prototype
                                     //     AFTER construction affect this?

4) Why is duck-typing (checking for the presence of expected
   methods/properties) sometimes preferred over instanceof for
   cross-realm or cross-bundle code (e.g. checking if something "is a
   Promise")?
*/

// ============================================
// ANSWERS
// ============================================

/*
1) `x instanceof Y` (without a custom Symbol.hasInstance) walks the
   PROTOTYPE CHAIN of `x`, checking at each step whether the current
   object's `[[Prototype]]` === `Y.prototype`. It returns true the
   moment it finds a match, false if it reaches `null` without one.

   This REQUIRES `x` to be an OBJECT with a prototype chain in the
   first place. Primitives (numbers, strings, booleans, excluding
   objects created via `new Number(...)` etc.) have NO prototype chain
   of their own — instanceof immediately returns FALSE for any
   primitive on the left side, regardless of the right side, because
   there's no [[Prototype]] to walk at all.

A: false — 5 is a primitive number, not a Number OBJECT, so instanceof
   returns false immediately regardless of typeof matching conceptually.

B: true — `new Number(5)` creates an actual boxed Number OBJECT whose
   prototype chain DOES include Number.prototype.

C: false — same reasoning as A, `''` is a primitive string.
*/

class Even {
  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && Number.isInteger(value) && value % 2 === 0;
  }
}

/*
TEST:
console.log(4 instanceof Even);   // true
console.log(5 instanceof Even);   // false
console.log([] instanceof Even);  // false

WHY THIS WORKS: when `Y[Symbol.hasInstance]` is defined, `instanceof`
DELEGATES ENTIRELY to that function instead of doing the normal
prototype-chain walk — `x instanceof Y` becomes literally
`Y[Symbol.hasInstance](x)`. This lets you redefine instanceof to mean
ANYTHING, including a pure value predicate with no relation to
prototypes at all, which is exactly why Even can accept primitive
numbers even though instanceof normally can't touch primitives — the
custom hasInstance function runs arbitrary code, unconstrained by the
usual "must be an object with a prototype chain" requirement.
*/

/*
3)
D: true — d's prototype chain includes Derived.prototype directly.

E: true — d's prototype chain, at construction time, was:
   d -> Derived.prototype -> Base.prototype -> Object.prototype -> null
   so Base.prototype IS found while walking.

F: FALSE — this is the subtle part. `Object.setPrototypeOf(Derived.prototype,
   null)` MUTATES Derived.prototype's OWN [[Prototype]] link, severing
   its connection to Base.prototype, RETROACTIVELY. Since `d`'s
   prototype chain is walked LIVE at the time instanceof is evaluated
   (not cached from construction time), this change DOES affect
   `d instanceof Base` going forward — it's now false, because walking
   from d: d -> Derived.prototype -> null (nothing further), and
   Base.prototype is never encountered. This proves instanceof performs
   a LIVE structural check at call time, not something fixed at
   construction — mutating the prototype chain after the fact changes
   behavior for ALL existing instances immediately.

4) Cross-realm/cross-bundle scenarios: if a value comes from a
   DIFFERENT realm (e.g. an iframe, a Node vm context, or simply a
   DIFFERENT COPY of a library bundled twice by two different
   dependencies), `value instanceof SomeClass` can be FALSE even though
   the value is conceptually "the same kind of thing" — because it was
   constructed against a DIFFERENT `SomeClass.prototype` object (a
   different realm has its own global Object/Array/Promise/etc., and
   bundlers can literally duplicate a class definition into two
   separate module instances). Checking `typeof value.then ===
   'function'` (duck-typing, e.g. exactly how Promise resolution
   itself detects "thenables") sidesteps this entirely by checking
   BEHAVIOR/SHAPE instead of exact prototype identity, at the cost of
   being less precise (anything with a `.then` method passes, even if
   it's not really Promise-like in other ways).
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly explains instanceof as a live prototype-chain walk, and why
  primitives always fail it.
- Implements Symbol.hasInstance correctly, understanding it fully
  REPLACES default behavior rather than supplementing it.
- Gets the "live check" subtlety in part F — many candidates assume
  instanceof result is somehow fixed at construction time.
- Can explain the cross-realm motivation for duck-typing without
  prompting.
*/
