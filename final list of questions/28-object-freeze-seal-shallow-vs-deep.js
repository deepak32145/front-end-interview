/**
 * Q28: Object.freeze / Object.seal — Shallow vs Deep Immutability
 * Difficulty: Medium-Hard
 * Concepts: shallow freezing, strict mode failures, deep freeze implementation, seal vs freeze vs preventExtensions
 */

// ============================================
// QUESTION
// ============================================
/*
'use strict';

const obj = Object.freeze({ a: 1, nested: { b: 2 } });

obj.a = 100;              // A: what happens?
obj.nested.b = 200;       // B: what happens?
console.log(obj.a, obj.nested.b);

obj.c = 5;                 // C: what happens (adding a NEW property)?
delete obj.a;               // D: what happens?

const sealed = Object.seal({ x: 1 });
sealed.x = 100;             // E: what happens?
sealed.y = 200;             // F: what happens?
delete sealed.x;             // G: what happens?

Implement `deepFreeze(obj)` that recursively freezes nested objects and
arrays too.
*/

// ============================================
// ANSWERS
// ============================================

/*
A: THROWS TypeError: Cannot assign to read only property 'a' of object
   — in strict mode, mutating a frozen object's own property throws.
   (In SLOPPY mode, this would silently fail instead — no error, no
   effect. Strict mode is what most modern code runs under, especially
   ES modules which are ALWAYS strict.)

B: SUCCEEDS silently, no error — Object.freeze is SHALLOW. It only
   locks the top-level property descriptors of `obj` itself (making `a`
   and `nested` non-writable/non-configurable AS BINDINGS), but it does
   NOT freeze the object that `nested` POINTS TO. `obj.nested` is still
   a fully mutable object.

console.log: "1 200" — a stayed 1 (assignment was blocked), nested.b
   changed to 200 (that mutation succeeded).

C: THROWS in strict mode — frozen objects are also non-extensible, so
   adding brand new properties is blocked exactly like modifying
   existing ones.

D: THROWS in strict mode — frozen properties are non-configurable, so
   delete is also blocked.

E: SUCCEEDS — Object.seal prevents adding/removing properties but
   EXISTING properties remain writable (just not reconfigurable/
   deletable) unless individually marked non-writable. sealed.x becomes
   100.

F: FAILS silently in sloppy mode / THROWS in strict mode — seal makes
   the object non-extensible, so new properties cannot be added,
   exactly like freeze.

G: FAILS silently in sloppy mode / THROWS in strict mode — sealed
   properties are non-configurable, so delete is blocked, but note this
   is DIFFERENT from freeze: sealed.x is still WRITABLE via plain
   assignment (E succeeded), just not deletable or addable-alongside.
*/

function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Object.isFrozen(obj)) return obj; // avoid infinite loop on cycles

  // Freeze the object itself FIRST so recursive cycles don't re-enter.
  Object.freeze(obj);

  for (const key of Reflect.ownKeys(obj)) {
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return obj;
}

/*
============================================
TEST
============================================
const deep = deepFreeze({ a: 1, nested: { b: 2, list: [1, {c: 3}] } });
deep.nested.b = 999;              // fails silently/throws
deep.nested.list[1].c = 999;      // fails silently/throws
console.log(deep.nested.b, deep.nested.list[1].c); // 2 3 (unchanged)

============================================
QUICK REFERENCE
============================================
| Operation           | freeze | seal | preventExtensions |
|----------------------|--------|------|---------------------|
| Add new property     | no     | no   | no                  |
| Delete property       | no     | no   | yes                 |
| Modify existing value | no     | yes  | yes                 |

============================================
EVALUATION CRITERIA
============================================
- Correctly identifies freeze as SHALLOW — this is the most commonly
  missed fact, and the whole reason B is included.
- Knows strict mode changes throw-vs-silent-fail behavior.
- Correctly distinguishes freeze vs seal vs preventExtensions.
- deepFreeze handles circular references (checking isFrozen before
  recursing) and both arrays and plain objects (using Reflect.ownKeys
  or Object.getOwnPropertyNames to also catch symbol keys/array indices).
*/
