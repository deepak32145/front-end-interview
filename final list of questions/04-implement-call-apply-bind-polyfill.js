/**
 * Q4: Implement call, apply, and bind from Scratch
 * Difficulty: Hard
 * Concepts: Function.prototype internals, `this`, argument spreading, property collisions, new.target
 */

// ============================================
// QUESTION
// ============================================
/*
Without using the native Function.prototype.call/apply/bind, implement:

  Function.prototype.myCall(thisArg, ...args)
  Function.prototype.myApply(thisArg, argsArray)
  Function.prototype.myBind(thisArg, ...boundArgs)

Requirements:
- myCall/myApply must invoke the function with `this` set to thisArg and
  return its return value.
- thisArg of null/undefined must fall back to the global object in
  sloppy mode (mimic native behavior loosely — don't over-engineer).
- Must not permanently mutate the target object (watch out for property
  name collisions when you attach the function temporarily).
- myBind must support partial application (bound args + call-time args)
  AND must work correctly when the bound function is later called with
  `new` (the bound `this` should be ignored in that case).
*/

// ============================================
// ANSWER
// ============================================

Function.prototype.myCall = function (thisArg, ...args) {
  const context = thisArg === null || thisArg === undefined ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn'); // avoid clobbering existing properties
  context[fnKey] = this;
  const result = context[fnKey](...args);
  delete context[fnKey];
  return result;
};

Function.prototype.myApply = function (thisArg, argsArray) {
  const context = thisArg === null || thisArg === undefined ? globalThis : Object(thisArg);
  const fnKey = Symbol('fn');
  context[fnKey] = this;
  const result = context[fnKey](...(argsArray || []));
  delete context[fnKey];
  return result;
};

Function.prototype.myBind = function (thisArg, ...boundArgs) {
  const targetFn = this;

  function boundFn(...callArgs) {
    // If invoked with `new`, `this` here is a fresh instance whose
    // prototype chain we must preserve — native bind ignores the bound
    // thisArg in that case.
    const isNewCall = this instanceof boundFn;
    return targetFn.apply(
      isNewCall ? this : thisArg,
      [...boundArgs, ...callArgs]
    );
  }

  // Preserve prototype chain so `new boundFn()` produces a correct
  // `instanceof` relationship with the original function's prototype.
  if (targetFn.prototype) {
    boundFn.prototype = Object.create(targetFn.prototype);
  }

  return boundFn;
};

/*
============================================
TEST CASES
============================================
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: 'Ada' };

greet.myCall(person, 'Hello', '!');           // "Hello, Ada!"
greet.myApply(person, ['Hi', '?']);           // "Hi, Ada?"

const boundGreet = greet.myBind(person, 'Hey');
boundGreet('.');                              // "Hey, Ada."

function Point(x, y) { this.x = x; this.y = y; }
const BoundPoint = Point.myBind({ ignored: true }, 1);
const p = new BoundPoint(2);
console.log(p.x, p.y);        // 1 2
console.log(p instanceof Point); // true

============================================
EVALUATION CRITERIA
============================================
- Correct `this` substitution for primitives (boxing) vs objects.
- Avoids permanently polluting the target object (Symbol key + delete,
  or try/finally cleanup).
- myBind supports both partial application and `new` correctly.
- Explains WHY `Object(thisArg)` boxing matters (calling a method with
  a primitive `this` in sloppy mode auto-boxes it).
*/
