/**
 * Q3: 'this' Binding — Implicit, Explicit, Lost, and Arrow Rules
 * Difficulty: Medium-Hard
 * Concepts: this binding rules, arrow functions, method extraction, strict mode
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the output of each console.log. Assume this runs as a normal
<script> in a browser (non-module, non-strict) unless stated otherwise.

const car = {
  brand: 'Toyota',
  start() {
    return `${this.brand} starting`;
  },
  startLater() {
    return setTimeout(function () {
      console.log('A:', this.brand);
    }, 0);
  },
  startLaterArrow() {
    return setTimeout(() => {
      console.log('B:', this.brand);
    }, 0);
  }
};

console.log('C:', car.start());

const extracted = car.start;
console.log('D:', extracted());

const bound = car.start.bind(car);
console.log('E:', bound());

car.startLater();
car.startLaterArrow();

const car2 = { brand: 'Honda', start: car.start };
console.log('F:', car2.start());
*/

// ============================================
// ANSWER
// ============================================

// C: "Toyota starting" — implicit binding, `this` is `car` at call time.

// D: TypeError (or "undefined starting" in non-strict global) —
// `extracted` is called as a bare function, so `this` is `undefined`
// in strict mode (throws when reading this.brand) or the global object
// in sloppy mode (this.brand is undefined, so "undefined starting").
// The KEY insight: `this` is determined by the CALL SITE, not where
// the function was defined or which object it "belongs to".

// E: "Toyota starting" — `.bind(car)` permanently locks `this` to `car`,
// regardless of how `bound` is later invoked.

// A: "undefined" — inside the plain `function` callback passed to
// setTimeout, `this` is the global object (or undefined in strict mode),
// NOT `car`. Classic lost-context bug with callbacks.

// B: "Toyota" — arrow functions don't have their own `this`; they
// capture `this` lexically from `startLaterArrow`, where `this` is `car`.

// F: "Honda starting" — this is the crux of "implicit binding": a
// function is just a value. Assigning `car.start` to `car2.start` means
// when CALLED AS `car2.start()`, `this` is whatever object is to the
// left of the dot at call time — `car2` — not the object it was
// originally defined on.

/*
============================================
FOLLOW-UP (hardest part)
============================================
What if `startLaterArrow` itself is extracted and called standalone?

const fn = car.startLaterArrow;
fn(); // logs what, inside the arrow's setTimeout callback?

Answer: "undefined". The arrow function inside still lexically resolves
`this` to whatever `this` was for `startLaterArrow` AT THE TIME `fn()`
executes it — and since `fn()` is called as a bare function, `this`
inside `startLaterArrow` is undefined/global, so the arrow captures
THAT, not `car`. Arrow functions inherit the ENCLOSING FUNCTION's `this`
at call time, not at definition time of the outer method's source code.
*/
