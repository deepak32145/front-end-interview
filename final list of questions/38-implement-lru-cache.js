/**
 * Q38: Implement an LRU Cache with O(1) get/put
 * Difficulty: Hard
 * Concepts: doubly linked list + hash map, Map insertion-order trick, capacity eviction
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `LRUCache` with O(1) average time complexity for both:
  - get(key): returns the value, or -1/undefined if not present; marks
    the key as most-recently-used.
  - put(key, value): inserts or updates; marks as most-recently-used;
    if capacity is exceeded, evicts the LEAST recently used entry.

const cache = new LRUCache(2);
cache.put(1, 'a');
cache.put(2, 'b');
cache.get(1);        // 'a' — 1 is now most recently used
cache.put(3, 'c');   // capacity exceeded, evicts 2 (least recently used)
cache.get(2);        // -1 (evicted)
cache.get(3);        // 'c'

Implement it TWO ways:
1. Using JS Map (which preserves insertion order) — simplest, leans on
   built-in guarantees.
2. Using a manual doubly linked list + plain object hash map — the
   "classic" interview answer that doesn't rely on Map's ordering
   guarantee, useful in languages/contexts without that feature.
*/

// ============================================
// ANSWER — Version 1 (Map-based)
// ============================================

class LRUCache {
  #capacity;
  #map = new Map();

  constructor(capacity) {
    this.#capacity = capacity;
  }

  get(key) {
    if (!this.#map.has(key)) return -1;
    const value = this.#map.get(key);
    // Move to the end (most recently used) by deleting and re-inserting.
    this.#map.delete(key);
    this.#map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.#map.has(key)) {
      this.#map.delete(key); // remove old position first
    } else if (this.#map.size >= this.#capacity) {
      // Map iterates in insertion order; the FIRST key is the least
      // recently used because every access moves a key to the end.
      const lruKey = this.#map.keys().next().value;
      this.#map.delete(lruKey);
    }
    this.#map.set(key, value);
  }
}

// ============================================
// ANSWER — Version 2 (manual doubly linked list + hash map)
// ============================================

class LRUCacheManual {
  #capacity;
  #hash = new Map(); // key -> node, still O(1) lookup, but ordering is
                      // maintained MANUALLY via the linked list, not by
                      // relying on Map's iteration-order guarantee.
  #head; // most-recently-used sentinel side
  #tail; // least-recently-used sentinel side

  constructor(capacity) {
    this.#capacity = capacity;
    // Sentinel nodes simplify edge cases (empty list, single node).
    this.#head = { key: null, value: null, prev: null, next: null };
    this.#tail = { key: null, value: null, prev: null, next: null };
    this.#head.next = this.#tail;
    this.#tail.prev = this.#head;
  }

  #remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  #insertAtFront(node) {
    node.next = this.#head.next;
    node.prev = this.#head;
    this.#head.next.prev = node;
    this.#head.next = node;
  }

  get(key) {
    if (!this.#hash.has(key)) return -1;
    const node = this.#hash.get(key);
    this.#remove(node);
    this.#insertAtFront(node);
    return node.value;
  }

  put(key, value) {
    if (this.#hash.has(key)) {
      const node = this.#hash.get(key);
      node.value = value;
      this.#remove(node);
      this.#insertAtFront(node);
      return;
    }

    if (this.#hash.size >= this.#capacity) {
      const lru = this.#tail.prev;
      this.#remove(lru);
      this.#hash.delete(lru.key);
    }

    const node = { key, value, prev: null, next: null };
    this.#insertAtFront(node);
    this.#hash.set(key, node);
  }
}

/*
============================================
TEST (both implementations)
============================================
const cache = new LRUCache(2);
cache.put(1, 'a'); cache.put(2, 'b');
console.log(cache.get(1)); // 'a'
cache.put(3, 'c');          // evicts 2
console.log(cache.get(2)); // -1
console.log(cache.get(3)); // 'c'

============================================
EVALUATION CRITERIA
============================================
- Version 1: correctly exploits Map's iteration-order guarantee (delete
  + re-insert to "touch") — candidates should be able to explain WHY
  this achieves O(1) amortized behavior and why plain object key order
  is NOT a safe substitute (integer-like keys get reordered numerically
  in plain objects, a classic gotcha).
- Version 2: correctly maintains sentinel head/tail nodes to avoid null
  checks; get/put both touch the linked list AND the hash map in sync;
  eviction always removes the node adjacent to the tail sentinel.
- Both handle updating an EXISTING key without incorrectly evicting.
*/
