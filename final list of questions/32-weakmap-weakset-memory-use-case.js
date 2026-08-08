/**
 * Q32: WeakMap / WeakSet — Garbage Collection Semantics and Real Use Cases
 * Difficulty: Hard
 * Concepts: weak references, garbage collection eligibility, private data pattern, no-iteration constraint
 */

// ============================================
// QUESTION
// ============================================
/*
1) Why can't WeakMap/WeakSet be iterated (no .keys(), .forEach(),
   spread, or `.size` even)? Why is this a DELIBERATE spec design, not
   an oversight?

2) Implement a "private fields via WeakMap" pattern for a Counter class
   that works in engines WITHOUT native `#privateField` syntax support,
   and explain why WeakMap (not a plain object or Map) is the correct
   tool here.

3) Bug hunt — this cache implementation has a memory leak. Find and fix
   it using WeakMap:

const cache = new Map();
function getExpensiveComputation(domElement) {
  if (cache.has(domElement)) return cache.get(domElement);
  const result = domElement.getBoundingClientRect(); // expensive
  cache.set(domElement, result);
  return result;
}
*/

// ============================================
// ANSWERS
// ============================================

/*
1) WHY NO ITERATION:
The entire point of WeakMap/WeakSet is that entries can be silently
garbage collected the moment nothing else references the KEY object.
Garbage collection timing is NOT deterministic or observable in JS by
design (you never know exactly WHEN GC runs). If you could iterate a
WeakMap, the set of entries you'd see would depend on unpredictable GC
timing — running the same iteration code twice could yield DIFFERENT
results even with no code changes in between, purely because GC ran in
the background. That would make WeakMap's behavior non-deterministic
and unobservable-state-dependent, which violates a core principle of
predictable language semantics. Disallowing iteration entirely closes
off any way to depend on (or leak information about) GC timing.
*/

class Counter {
  static #state = new WeakMap();

  constructor(start = 0) {
    Counter.#state.set(this, { count: start });
  }

  increment() {
    const s = Counter.#state.get(this);
    s.count += 1;
    return s.count;
  }

  get value() {
    return Counter.#state.get(this).count;
  }
}

/*
WHY WeakMap HERE (not a plain object or Map):
- A plain object as a lookup table would need STRING keys — you'd have
  to invent an id per instance, which either requires mutating the
  instance (adding an id property, defeating the "private" goal) or a
  global counter with cleanup headaches.
- A regular Map WOULD work functionally, keyed by `this` directly, BUT
  it creates a STRONG reference from the Map to every Counter instance
  ever created. Even after all external references to a Counter
  instance are gone, the Map keeps it alive forever — a memory leak.
- WeakMap holds its keys WEAKLY: once a Counter instance is no longer
  referenced anywhere else in the program, both the instance AND its
  entry in Counter.#state become eligible for garbage collection
  together, automatically. This is exactly the "private data tied to
  object lifetime" pattern WeakMap was designed for (and predates
  native `#field` syntax, which is now generally preferred but this
  pattern is still common in libraries/polyfills and is a great test of
  fundamentals).
*/

// BUG FIX for part 3:
const domCache = new WeakMap(); // was: new Map()
function getExpensiveComputation(domElement) {
  if (domCache.has(domElement)) return domCache.get(domElement);
  const result = domElement.getBoundingClientRect();
  domCache.set(domElement, result);
  return result;
}
/*
THE BUG: using a regular `Map` keyed by DOM elements means that even
after an element is REMOVED from the document and has no other
references, the Map still holds a strong reference to it, preventing
garbage collection. Over time (e.g. in a single-page app that mounts
and unmounts many components), this leaks an ever-growing set of
detached DOM nodes. Switching to WeakMap lets removed/unreferenced
elements (and their cache entries) be collected automatically.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Gives the REAL reason for no-iteration (non-deterministic GC
  observability), not just "because the spec says so".
- Correctly implements the private-state-via-WeakMap pattern, keyed by
  `this`.
- Identifies the Map -> WeakMap fix for the DOM cache leak and explains
  WHY in terms of reference strength, not just "WeakMap is better".
*/
