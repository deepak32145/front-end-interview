/**
 * Q19: Memoization with TTL, Multi-Arg Keys, and LRU Eviction
 * Difficulty: Hard
 * Concepts: cache key serialization, expiry, Map iteration order, memory bounds
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `memoize(fn, { ttl, maxSize })`:
- Caches results keyed by ALL arguments (not just the first).
- `ttl` (ms): entries expire after this long; expired entries are
  recomputed transparently.
- `maxSize`: when exceeded, evict the LEAST RECENTLY USED entry (not
  insertion order — actual LRU: an entry counts as "used" both when
  written AND when read).
- Must work for functions returning any value, including `undefined`
  (a naive `if (cache.has(key))` check that also stores `undefined`
  must not be confused with "not cached").
- Bonus: support async functions without caching a REJECTED promise
  forever (a failed call should be retried next time, not permanently
  poison the cache).
*/

// ============================================
// ANSWER
// ============================================

function memoize(fn, { ttl = Infinity, maxSize = Infinity } = {}) {
  // Map preserves insertion order; we exploit that for LRU by deleting
  // and re-inserting a key whenever it's touched (read or write), which
  // moves it to the "most recently used" (last) position.
  const cache = new Map(); // key -> { value, expiresAt }

  function getKey(args) {
    return JSON.stringify(args);
  }

  function touch(key, entry) {
    cache.delete(key);
    cache.set(key, entry);
  }

  function evictIfNeeded() {
    while (cache.size > maxSize) {
      const oldestKey = cache.keys().next().value; // first = least recently used
      cache.delete(oldestKey);
    }
  }

  return function (...args) {
    const key = getKey(args);
    const now = Date.now();

    if (cache.has(key)) {
      const entry = cache.get(key);
      if (entry.expiresAt > now) {
        touch(key, entry); // mark as recently used
        return entry.value;
      }
      cache.delete(key); // expired
    }

    const result = fn.apply(this, args);

    // Async-safe: don't permanently cache a rejection.
    if (result instanceof Promise) {
      result.catch(() => cache.delete(key));
    }

    const entry = { value: result, expiresAt: now + ttl };
    cache.set(key, entry);
    evictIfNeeded();
    return result;
  };
}

/*
============================================
TEST
============================================
let calls = 0;
const slowSquare = (n) => { calls++; return n * n; };
const memoized = memoize(slowSquare, { ttl: 100, maxSize: 2 });

memoized(2); memoized(2); // calls === 1 (second is cache hit)
memoized(3);              // calls === 2
memoized(4);              // calls === 3, evicts key for `2` (LRU, since
                           // `3` was touched more recently than `2`
                           // — wait, `2` was touched last via the 2nd
                           // call, so eviction order depends on actual
                           // access pattern; walk through it with the
                           // candidate live)

setTimeout(() => {
  memoized(3); // calls === 4, ttl expired, recomputed
}, 150);

============================================
EVALUATION CRITERIA
============================================
- Uses cache.has() explicitly (never a falsy/undefined check) so
  caching `undefined` or `0` works correctly.
- LRU eviction touches entries on BOTH read and write.
- TTL check compares against a stored absolute expiry time, not a
  relative "last accessed" timer (those are different eviction
  policies — TTL vs LRU solve different problems and this implementation
  correctly does both simultaneously).
- Handles async functions so a rejected promise doesn't get stuck in
  the cache forever poisoning future calls.
- Key serialization caveat: JSON.stringify can't distinguish some
  distinct inputs (e.g. objects with undefined props, function
  arguments, Symbols, or key order in nested objects) — a strong
  candidate flags this as a known limitation.
*/
