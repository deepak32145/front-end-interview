/**
 * Q37: Implement an Event Emitter (Pub/Sub) from Scratch
 * Difficulty: Hard
 * Concepts: observer pattern, once-semantics, unsubscribe safety during emit, error isolation between listeners
 */

// ============================================
// QUESTION
// ============================================
/*
Implement an `EventEmitter` class with:
  - on(event, listener) -> returns an unsubscribe function
  - off(event, listener)
  - once(event, listener) -> auto-unsubscribes after first call
  - emit(event, ...args) -> calls all listeners synchronously, in
    registration order
  - Must be SAFE if a listener unsubscribes ITSELF (or another listener)
    DURING emit — no skipped or double-called listeners, no crashes.
  - One listener throwing an error must NOT prevent the remaining
    listeners for that event from running.
*/

// ============================================
// ANSWER
// ============================================

class EventEmitter {
  #listeners = new Map(); // event -> Set<listener>

  on(event, listener) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, new Set());
    }
    this.#listeners.get(event).add(listener);
    return () => this.off(event, listener);
  }

  off(event, listener) {
    this.#listeners.get(event)?.delete(listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    return this.on(event, wrapper);
  }

  emit(event, ...args) {
    const set = this.#listeners.get(event);
    if (!set) return;

    // Snapshot the listeners BEFORE iterating. If a listener calls
    // off()/on() during emit, it mutates the LIVE Set — iterating a
    // Set directly while it's mutated has well-defined but surprising
    // behavior (newly added items during iteration DO get visited;
    // removed items that haven't been visited yet are skipped). Taking
    // a snapshot guarantees emit() only notifies listeners that were
    // registered AT THE START of this emit call — the expected,
    // predictable contract for most event systems.
    const snapshot = [...set];

    for (const listener of snapshot) {
      // Skip listeners that unsubscribed themselves before their turn.
      if (!set.has(listener)) continue;
      try {
        listener(...args);
      } catch (err) {
        // Isolate errors: one bad listener must not stop the rest.
        console.error(`Listener for "${event}" threw:`, err);
      }
    }
  }
}

/*
============================================
TEST
============================================
const bus = new EventEmitter();

const unsubscribe = bus.on('greet', (name) => console.log('Hi', name));
bus.emit('greet', 'Ada'); // "Hi Ada"
unsubscribe();
bus.emit('greet', 'Ada'); // (nothing)

let calls = 0;
bus.once('ping', () => calls++);
bus.emit('ping'); bus.emit('ping'); bus.emit('ping');
console.log(calls); // 1

// Self-unsubscribing listener mid-emit:
const listenerA = () => { bus.off('x', listenerB); console.log('A ran'); };
const listenerB = () => console.log('B ran');
bus.on('x', listenerA);
bus.on('x', listenerB);
bus.emit('x');
// "A ran" logs; whether "B ran" logs depends on registration order —
// with the snapshot approach, B WAS in the snapshot when emit started,
// so B still runs even though A removed it mid-emit (this is a
// deliberate, defensible design choice — discuss the alternative
// with the candidate: SOME real emitters instead skip B here by
// checking `set.has(listener)` right before calling, which this
// implementation also does, meaning B's removal DOES take effect and
// "B ran" does NOT log. Walk through this precisely with the candidate
// to make sure they understand the snapshot vs live-check interaction.

// Error isolation:
bus.on('boom', () => { throw new Error('bad listener'); });
bus.on('boom', () => console.log('still runs'));
bus.emit('boom'); // logs the error, then "still runs"

============================================
EVALUATION CRITERIA
============================================
- Uses a Set (not array) per event to avoid duplicate-listener bugs and
  make removal O(1).
- once() correctly unsubscribes itself before invoking the real
  listener (so a listener that emits the SAME event recursively doesn't
  cause once() to fire twice).
- Snapshots listeners at the start of emit() for predictable iteration
  semantics, AND still respects same-tick unsubscription via the
  `set.has(listener)` check — candidates should be able to reason about
  BOTH mechanisms together, not just one.
- try/catch per-listener so one throwing listener doesn't abort emit()
  for the rest.
*/
