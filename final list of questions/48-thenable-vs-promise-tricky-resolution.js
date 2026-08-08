/**
 * Q48: Thenables vs Real Promises — Resolution Quirks
 * Difficulty: Very Hard
 * Concepts: thenable duck-typing, Promise.resolve assimilation, infinite resolution loops, microtask timing differences
 */

// ============================================
// QUESTION
// ============================================
/*
1) What is a "thenable" and why does native Promise resolution treat
   ANY object with a callable `.then` method as one, even if it's not
   a real Promise instance?

2) Predict the output and ORDER:

const weirdThenable = {
  then(resolve, reject) {
    console.log('thenable.then called');
    resolve('thenable value');
  }
};

console.log('start');
Promise.resolve(weirdThenable).then(v => console.log('resolved with:', v));
console.log('end');

3) Malicious/buggy thenable — what happens, and why is it dangerous?

const evilThenable = {
  then(resolve, reject) {
    resolve('first');
    resolve('second'); // calling resolve AGAIN
    reject('third');    // and reject too
  }
};
Promise.resolve(evilThenable).then(console.log, console.error);

4) Infinite loop trap — what happens here, and why?

const selfReferencing = {
  then(resolve) {
    resolve(selfReferencing); // resolves with itself!
  }
};
Promise.resolve(selfReferencing).then(
  v => console.log('resolved', v),
  e => console.log('rejected', e.message)
);
*/

// ============================================
// ANSWERS
// ============================================

/*
1) A "thenable" is ANY value — object or function — that has a
   CALLABLE property named `.then`. Native Promise/A+ resolution
   deliberately does NOT check for `instanceof Promise`; it does DUCK
   TYPING specifically so that different Promise IMPLEMENTATIONS
   (jQuery's Deferred, older Promise libraries like Q or Bluebird,
   custom user-defined objects) can all interoperate seamlessly with
   native Promises, as long as they expose a spec-compliant `.then`.
   This interoperability requirement is written directly into the
   Promises/A+ specification, which native Promises implement.

2) OUTPUT:
   start
   end
   thenable.then called
   resolved with: thenable value

   TRACE: Promise.resolve(weirdThenable) does NOT immediately treat
   weirdThenable as the resolved value. Because it's a thenable, the
   Promise spec requires calling ITS `.then` method to figure out the
   REAL eventual value — and crucially, this call is deferred to a
   MICROTASK (never called synchronously during Promise.resolve()
   itself), so 'start' and 'end' both log first (synchronous code),
   THEN the microtask runs `weirdThenable.then(...)`, which logs
   "thenable.then called" and synchronously calls resolve('thenable
   value') — but that resolution ALSO has to propagate through another
   microtask hop before the outer `.then(v => ...)` callback actually
   runs, so "resolved with: thenable value" logs last.

3) OUTPUT: "first" only ever gets logged (via console.log, the resolve
   handler) — "second" and "third" are BOTH IGNORED.

   WHY: Promise resolution (native OR thenable-based) enforces a
   "resolve/reject exactly once" invariant. Once a promise has been
   settled (by the FIRST call to resolve OR reject, whichever comes
   first), ALL SUBSEQUENT calls to either resolve or reject on that
   same deferred are silently NO-OPS. This is a critical safety
   guarantee: user-supplied thenables (or executor functions) cannot
   "change their mind" after settling, and downstream consumers can
   rely on a promise settling EXACTLY once. This is precisely why this
   is "dangerous" to get wrong when hand-writing thenables or Promise
   executors — accidentally calling resolve/reject twice is a common
   bug that native Promises PROTECT you from silently, but a naive
   custom Promise implementation (like Q9 in this series, if
   implemented incorrectly) might NOT protect against.

4) OUTPUT: "rejected TypeError: Chaining cycle detected for promise..."
   (exact message varies by engine, but ALL compliant engines detect
   this).

   WHY: `selfReferencing.then` resolves itself WITH ITSELF — this would
   create logically infinite resolution (the engine would need to keep
   asking "what does this thenable resolve to?" and keep getting "this
   same thenable" forever). The Promise/A+ spec explicitly requires
   implementations to DETECT this cycle and reject with a TypeError
   instead of hanging or stack-overflowing. This is a mandatory,
   spec-required safety check, not an implementation detail — EVERY
   compliant Promise implementation must catch this specific case.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Explains thenable duck-typing as an intentional interop mechanism,
  not an accidental design.
- Correctly traces the EXTRA microtask hop that thenable resolution
  introduces compared to resolving with a plain value (this often adds
  one more microtask "tick" of delay than candidates expect).
- Knows the resolve/reject-exactly-once invariant and why it exists.
- Knows the spec mandates detecting self-referential resolution cycles
  and rejecting with a TypeError rather than hanging.
*/
