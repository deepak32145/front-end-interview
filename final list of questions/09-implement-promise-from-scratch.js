/**
 * Q9: Implement a Promise/A+-ish Promise from Scratch
 * Difficulty: Very Hard
 * Concepts: promise states, microtask deferral, then chaining, thenable resolution
 */

// ============================================
// QUESTION
// ============================================
/*
Implement a `MyPromise` class supporting:
  - new MyPromise((resolve, reject) => {...})
  - .then(onFulfilled, onRejected) that returns a NEW promise (chainable)
  - .catch(onRejected)
  - .finally(onFinally)
  - Once settled, state and value are immutable.
  - Handlers registered AFTER settlement still fire (async, not sync).
  - If a handler returns a thenable/promise, the outer promise must
    adopt its state (chain "flattening").

You do not need full Promises/A+ spec compliance, but the core async
scheduling and chaining semantics must be correct.
*/

// ============================================
// ANSWER
// ============================================

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  #state = PENDING;
  #value;
  #handlers = []; // { onFulfilled, onRejected, resolveNext, rejectNext }

  constructor(executor) {
    const resolve = (value) => this.#settle(FULFILLED, value);
    const reject = (reason) => this.#settle(REJECTED, reason);
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  #settle(state, value) {
    if (this.#state !== PENDING) return; // immutable once settled

    // Thenable adoption: if resolving with something "then-able",
    // adopt ITS eventual state instead of settling immediately.
    if (state === FULFILLED && value && typeof value.then === 'function') {
      value.then(
        (v) => this.#settle(FULFILLED, v),
        (e) => this.#settle(REJECTED, e)
      );
      return;
    }

    this.#state = state;
    this.#value = value;
    this.#flush();
  }

  #flush() {
    // Always async — defer to microtask queue, matching native Promise.
    queueMicrotask(() => {
      const handlers = this.#handlers;
      this.#handlers = [];
      for (const h of handlers) this.#run(h);
    });
  }

  #run({ onFulfilled, onRejected, resolveNext, rejectNext }) {
    try {
      if (this.#state === FULFILLED) {
        resolveNext(typeof onFulfilled === 'function' ? onFulfilled(this.#value) : this.#value);
      } else {
        if (typeof onRejected === 'function') {
          resolveNext(onRejected(this.#value));
        } else {
          rejectNext(this.#value);
        }
      }
    } catch (err) {
      rejectNext(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolveNext, rejectNext) => {
      const handler = { onFulfilled, onRejected, resolveNext, rejectNext };
      if (this.#state === PENDING) {
        this.#handlers.push(handler);
      } else {
        queueMicrotask(() => this.#run(handler));
      }
    });
  }

  catch(onRejected) {
    return this.then(undefined, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => { onFinally(); return value; },
      (err) => { onFinally(); throw err; }
    );
  }

  static resolve(value) {
    return value instanceof MyPromise ? value : new MyPromise(res => res(value));
  }

  static reject(reason) {
    return new MyPromise((_, rej) => rej(reason));
  }
}

/*
============================================
TEST
============================================
new MyPromise((resolve) => setTimeout(() => resolve(1), 10))
  .then(v => v + 1)
  .then(v => { throw new Error('boom:' + v); })
  .catch(err => console.log('caught:', err.message)) // caught: boom:2
  .finally(() => console.log('cleanup'));

MyPromise.resolve(MyPromise.resolve(42)).then(v => console.log(v)); // 42

============================================
EVALUATION CRITERIA
============================================
- State is settle-once and immutable.
- Handlers always run asynchronously via microtask, even if the promise
  is already settled when .then() is called.
- .then() returns a NEW promise, enabling chaining.
- Thenable/promise return values from handlers are "flattened" (adopted),
  not nested.
- Errors thrown synchronously in the executor reject the promise.
- .catch and .finally are correctly derived from .then.
*/
