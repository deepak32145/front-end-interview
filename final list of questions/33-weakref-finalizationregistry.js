/**
 * Q33: WeakRef and FinalizationRegistry — Advanced Memory Management
 * Difficulty: Very Hard
 * Concepts: weak references to arbitrary objects, cleanup callbacks, caching patterns, non-determinism caveats
 */

// ============================================
// QUESTION
// ============================================
/*
1) How does WeakRef differ from WeakMap in terms of what it lets you do
   that WeakMap fundamentally cannot?

2) Implement a simple cache that holds values via WeakRef so cached
   objects can still be garbage collected under memory pressure, but
   returns the live value if it hasn't been collected yet.

3) Why is it considered a code smell / anti-pattern to rely on
   FinalizationRegistry for CRITICAL program logic (e.g. releasing a
   file handle or network connection)? What should you use instead for
   deterministic cleanup?
*/

// ============================================
// ANSWERS
// ============================================

/*
1) WeakMap only lets you associate metadata with an object AS A KEY —
   you must already have a reference to that object to look anything
   up, and you can never "get the object back" from just the WeakMap
   alone if you lost your only reference to it. WeakRef is different:
   it directly wraps a SINGLE object and lets you ask "is this object
   still alive, and if so, give it to me" via `.deref()`, independent
   of any Map-like key/value structure. In other words: WeakMap = weak
   KEYS in a lookup table; WeakRef = a weak HANDLE to one object that
   you can dereference later (or get `undefined` back if it was
   collected).
*/

class WeakValueCache {
  #refs = new Map(); // key -> WeakRef(value)
  #registry;

  constructor() {
    // Clean up the Map entry itself once the referenced value is
    // actually collected, so #refs doesn't accumulate dead WeakRefs
    // forever (a WeakRef object itself is NOT automatically removed
    // from a normal Map just because its target died).
    this.#registry = new FinalizationRegistry((key) => {
      this.#refs.delete(key);
    });
  }

  set(key, value) {
    this.#refs.set(key, new WeakRef(value));
    this.#registry.register(value, key);
  }

  get(key) {
    const ref = this.#refs.get(key);
    if (!ref) return undefined;
    const value = ref.deref();
    if (value === undefined) {
      this.#refs.delete(key); // was collected; clean up eagerly too
    }
    return value;
  }
}

/*
============================================
TEST (illustrative — GC timing is non-deterministic, so this is
conceptual, not something you can reliably assert in a test suite)
============================================
const cache = new WeakValueCache();
let bigObject = { data: new Array(1_000_000).fill('x') };
cache.set('key1', bigObject);

console.log(cache.get('key1')); // returns the live object

bigObject = null; // drop the only strong reference
// ... at some LATER, UNSPECIFIED point, the engine may collect it ...
// cache.get('key1') would then return undefined
*/

/*
3) WHY NOT FinalizationRegistry FOR CRITICAL CLEANUP:
The spec explicitly does NOT guarantee that finalizer callbacks run at
any predictable time — or even AT ALL (e.g. if the process exits first,
or if the engine decides GC pressure never requires collecting that
object during the program's lifetime). Relying on it to release a file
handle, close a database connection, or unlock a resource means your
program may leak that resource indefinitely or hold it far longer than
necessary, since you have zero control over WHEN (or whether) the
callback fires.

For deterministic cleanup you should use explicit lifecycle patterns:
try/finally, `using`/`await using` (the new Explicit Resource
Management proposal / Symbol.dispose), or explicit .close()/.dispose()
methods that calling code is required to invoke. FinalizationRegistry
is appropriate ONLY as a last-resort safety net / diagnostic aid (e.g.
logging a warning if a resource was garbage collected without being
explicitly closed) — never as the primary cleanup mechanism.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Clearly separates WeakRef's "handle to one object" model from
  WeakMap's "weak key in a lookup table" model.
- Cache implementation combines WeakRef + FinalizationRegistry
  correctly (many candidates forget the registry cleanup step and leave
  dead WeakRefs cluttering the backing Map forever).
- Strong, correct answer on WHY finalizers are non-deterministic and
  unsuitable for critical resource management — this is the
  differentiator most candidates miss entirely.
*/
