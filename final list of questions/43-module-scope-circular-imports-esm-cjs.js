/**
 * Q43: Module Scope — Circular Imports and ESM vs CommonJS Semantics
 * Difficulty: Very Hard
 * Concepts: live bindings vs value copies, module evaluation order, circular dependency resolution, hoisting of ESM imports
 */

// ============================================
// QUESTION
// ============================================
/*
Two files, CommonJS:

// a.js
console.log('a.js start');
exports.done = false;
const b = require('./b.js');
console.log('in a.js, b.done =', b.done);
exports.done = true;
console.log('a.js end');

// b.js
console.log('b.js start');
exports.done = false;
const a = require('./a.js');
console.log('in b.js, a.done =', a.done);
exports.done = true;
console.log('b.js end');

// main.js
require('./a.js');

1) Predict the FULL console output when main.js runs.
2) Explain WHY b.js sees `a.done` as `false` even though a.js
   eventually sets it to true.

Now the SAME circular scenario in ES Modules:

// a.mjs
console.log('a.mjs start');
export let done = false;
import { done as bDone } from './b.mjs';
console.log('in a.mjs, b.done =', bDone);
done = true;
console.log('a.mjs end');

// b.mjs
console.log('b.mjs start');
export let done = false;
import { done as aDone } from './a.mjs';
console.log('in b.mjs, a.done =', aDone);
done = true;
console.log('b.mjs end');

3) Does ESM's LIVE BINDING behavior change what `bDone`/`aDone` observe
   compared to CommonJS's copied `exports` snapshot? Explain the core
   mechanical difference between the two module systems that causes
   this.
*/

// ============================================
// ANSWERS
// ============================================

/*
1) FULL OUTPUT (CommonJS):

a.js start
b.js start
in b.js, a.done = false
b.js end
in a.js, b.done = true
a.js end

TRACE:
- main.js requires a.js -> starts executing a.js.
- a.js logs "a.js start", sets exports.done = false.
- a.js requires b.js -> starts executing b.js (a.js execution PAUSES here).
- b.js logs "b.js start", sets exports.done = false.
- b.js requires a.js -> Node sees a.js is ALREADY in the require cache
  (currently mid-execution, marked as "loading") -> returns a.js's
  CURRENT (incomplete) exports object immediately WITHOUT re-running
  a.js -> at this point, a.js's exports object only has
  `{ done: false }` because a.js paused BEFORE it ever set done=true.
- b.js logs "in b.js, a.done = false" (exactly because of the above).
- b.js sets exports.done = true, logs "b.js end". b.js finishes, returns
  control to a.js.
- Back in a.js: `b` is the now-fully-finished b.js exports object,
  `{ done: true }` -> a.js logs "in a.js, b.done = true".
- a.js sets exports.done = true, logs "a.js end".

2) WHY b.js sees a.done as false: CommonJS `require()` returns a
   snapshot of `module.exports` AT THE TIME require() is called. Since
   b.js requires a.js WHILE a.js is still mid-execution (it hasn't
   reached `exports.done = true` yet), Node returns the PARTIALLY
   COMPLETED exports object as it exists at that exact moment — a plain
   object with `done: false` frozen into that snapshot. Later mutations
   to a.js's exports object (setting done=true) do NOT retroactively
   update the reference b.js already captured... actually a subtlety:
   since `exports.done = true` MUTATES THE SAME OBJECT (not replacing
   `exports` wholesale), and b.js's `a` variable IS a reference to that
   same object, if b.js read `a.done` LATER (after a.js fully finished),
   it WOULD see true. But b.js reads it immediately, synchronously,
   right after requiring — before a.js has resumed and set done=true —
   so it observes false at that moment. This demonstrates require()
   returns a reference to a live object, but the TIMING of when you
   read from it during a circular load matters enormously.

3) ESM produces a SIMILAR but not identical output, and the underlying
   mechanism is fundamentally different:

a.mjs start
b.mjs start
in b.mjs, a.done = false
b.mjs end
in a.mjs, b.done = true
a.mjs end

The VALUES observed happen to match CommonJS's output in this
particular trace, but the MECHANISM is different: ES Modules use LIVE
BINDINGS, not copied values. `import { done as bDone } from './b.mjs'`
doesn't copy b.mjs's `done` value at import time — it creates a live
reference to b.mjs's `done` BINDING itself. If b.mjs's `done` changes
LATER, `bDone` in a.mjs automatically reflects the new value too,
WITHOUT a.mjs doing anything — this is impossible in CommonJS, where
`b.done` is just a plain property read off a snapshot object (though as
shown above, if it's the SAME object reference, later property
mutations still propagate — the true difference shows up with
reassignment of the exported binding itself, e.g. `export let done`
being reassigned, which CommonJS cannot mirror at all since `exports`
destructured into a new local variable would NOT track subsequent
`exports.x = ...` reassignment the way ESM's binding does).

CORE MECHANICAL DIFFERENCE: CommonJS exports are a snapshot copy (of
an object reference) resolved eagerly at require() time. ESM imports
are live, read-only VIEWS into the exporting module's binding table,
re-evaluated on demand at access time, and modules are statically
analyzed/linked BEFORE any code runs (which is also why circular ESM
imports can reference not-yet-initialized `let`/`const` bindings and
hit the TDZ if accessed too early, producing a ReferenceError instead
of silently seeing `undefined` the way CommonJS would with a not-yet-
assigned exports property).
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly traces the interleaved circular require() execution order
  for CommonJS — this alone eliminates most candidates.
- Explains WHY the partial exports snapshot is returned during a
  circular require (module already in the require cache, marked
  loading).
- Articulates the "live binding" vs "value snapshot" distinction for
  ESM vs CommonJS, ideally with an example where they'd actually
  DIVERGE (e.g. reassigning the exported `let` after the circular
  import already captured a reference).
*/
