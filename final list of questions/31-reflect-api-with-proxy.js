/**
 * Q31: Reflect API — Why Pair It With Proxy
 * Difficulty: Hard
 * Concepts: Reflect vs manual target manipulation, invariant enforcement, receiver forwarding, Reflect.construct
 */

// ============================================
// QUESTION
// ============================================
/*
1) What's functionally different between these two `set` trap
   implementations? Construct a scenario where they behave differently.

// Version 1
const p1 = new Proxy(target, {
  set(target, prop, value) {
    target[prop] = value;
    return true;
  }
});

// Version 2
const p2 = new Proxy(target, {
  set(target, prop, value, receiver) {
    return Reflect.set(target, prop, value, receiver);
  }
});

Hint: consider `target` having a property defined via a SETTER on its
prototype that uses `this`.

2) What does Reflect.construct let you do that `new Target(...)`
   cannot express directly? Give a concrete use case.

3) Why does almost every Proxy trap implementation "default" to calling
   the matching Reflect method instead of just returning true / doing
   nothing?
*/

// ============================================
// ANSWERS
// ============================================

/*
1) The difference shows up with INHERITED SETTERS. Consider:

class Base {
  set value(v) {
    console.log('Base setter, this ===', this);
    this._value = v;
  }
}
const target = new Base();

const p1 = new Proxy(target, {
  set(t, prop, value) { t[prop] = value; return true; }
});
const p2 = new Proxy(target, {
  set(t, prop, value, receiver) { return Reflect.set(t, prop, value, receiver); }
});

class Derived extends Base {}
const instance = new Derived();
// If we proxy an object whose prototype has a setter, and we access the
// setter THROUGH a receiver that differs from target (e.g. via
// Object.create(p1) style inheritance), Version 1 always runs the
// setter with `this === target`. Version 2 forwards the ORIGINAL
// receiver (which could be a different object further down a
// prototype/proxy chain), so `this` inside the setter correctly refers
// to whichever object was originally being written to — matching
// exactly how normal (non-proxied) property assignment resolves `this`
// through inheritance. Version 1 subtly breaks `this` in inherited
// setter scenarios; Version 2 is spec-correct.

2) Reflect.construct(Target, argsList, newTarget) lets you call a
   constructor with an ARBITRARY newTarget — meaning you can construct
   an instance whose prototype comes from a DIFFERENT class than the
   one whose constructor logic actually runs. Concrete use case: a
   factory that lets subclasses customize construction while sharing a
   base constructor's initialization logic, or building a "mixin"
   system:

   function createInstance(Base, Derived, args) {
     return Reflect.construct(Base, args, Derived);
     // runs Base's constructor logic, but the resulting object's
     // prototype is Derived.prototype, not Base.prototype
   }

   This is also exactly how `Reflect.construct` is used internally to
   implement spec features like class field initialization order and
   how Proxy's `construct` trap default behavior is defined.

3) Because plain `target[prop] = value` (or `delete target[prop]`,
   etc.) inside a trap re-invokes the FULL [[Set]]/[[Delete]] algorithm
   on the raw target from scratch, including walking ITS OWN prototype
   chain and re-triggering nested traps if `target` also happens to be
   a proxy, but WITHOUT forwarding the receiver context. Reflect.* gives
   you the exact low-level operation the JS engine itself would perform
   for that trap, with full control over parameters like `receiver`,
   keeping Proxy behavior transparent/composable and avoiding subtle
   invariant violations (the Proxy spec enforces certain invariants —
   e.g. you cannot report a non-configurable property as deletable —
   and Reflect methods naturally respect these because they ARE the
   spec's underlying operations).
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly identifies `receiver` as the key differentiator, not just
  "Reflect is best practice" without being able to say why.
- Can articulate a real scenario (inherited accessors) where it matters.
- Understands Reflect.construct's newTarget parameter and one genuine
  use case beyond "it mirrors `new`".
- Mentions Proxy invariants (spec-enforced constraints on trap return
  values for non-configurable/non-writable properties) as a reason to
  prefer Reflect defaults over ad hoc implementations.
*/
