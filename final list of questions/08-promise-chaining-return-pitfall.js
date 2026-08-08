/**
 * Q8: Promise Chaining — the "Forgot to Return" Pitfall
 * Difficulty: Medium-Hard
 * Concepts: promise chaining, implicit undefined resolution, error propagation, unhandled rejections
 */

// ============================================
// QUESTION
// ============================================
/*
This code is meant to fetch a user, then fetch their posts, then log the
post count. It has THREE separate bugs. Find all of them.

function getUser(id) {
  return Promise.resolve({ id, name: 'Ada' });
}
function getPosts(userId) {
  return Promise.resolve([{ id: 1 }, { id: 2 }]);
}

function run() {
  getUser(1)
    .then(user => {
      getPosts(user.id); // BUG 1
    })
    .then(posts => {
      console.log('Post count:', posts.length); // BUG 2 (crashes)
    })
    .then(() => {
      throw new Error('Something failed downstream');
    })
    .then(() => {
      console.log('This should not run');
    }); // BUG 3
}

run();
*/

// ============================================
// ANSWER
// ============================================

/*
BUG 1 — Missing `return`:
`getPosts(user.id)` returns a Promise, but it's not returned from the
`.then()` callback. When a `.then()` callback returns nothing, the
NEXT `.then()` resolves with `undefined` immediately — it does NOT wait
for the inner promise. This breaks the chain's data flow silently
(no error, just wrong data).

BUG 2 — Consequence of Bug 1:
Because `posts` is `undefined` (not the actual posts array), calling
`posts.length` throws: "Cannot read properties of undefined (reading
'length')". This TypeError becomes a REJECTED promise for that link in
the chain (thrown errors inside a .then() automatically convert the
chain to rejected).

BUG 3 — No `.catch()`:
The rejection from Bug 2 propagates down through every subsequent
`.then()` (they're all skipped because there's no rejection handler),
including the deliberate `throw new Error(...)`. There's no final
`.catch()`, so this becomes an UNHANDLED PROMISE REJECTION — in Node
this can crash the process (or at minimum log an ugly unhandled
rejection warning); in browsers it fires a global 'unhandledrejection'
event silently.
*/

// FIXED VERSION:
function getUser(id) {
  return Promise.resolve({ id, name: 'Ada' });
}
function getPosts(userId) {
  return Promise.resolve([{ id: 1 }, { id: 2 }]);
}

function run() {
  return getUser(1)
    .then(user => getPosts(user.id)) // return the inner promise
    .then(posts => {
      console.log('Post count:', posts.length);
    })
    .catch(err => {
      console.error('Chain failed:', err.message);
    });
}

run();

/*
============================================
FOLLOW-UPS
============================================
1) Would `async/await` have prevented Bug 1?
   -> Yes, structurally: `const posts = await getPosts(user.id);` makes
      the "forgot to return" mistake much harder to make, since you're
      not composing nested callbacks — you're just writing sequential
      statements. This is the strongest practical argument for
      preferring async/await over raw .then() chains in application code.

2) Where exactly does a `.catch()` need to sit to catch errors from
   EVERY step above it?
   -> As long as it's the LAST link with no other `.then()` after an
      earlier rejection-producing step, one `.catch()` at the end of
      the chain catches synchronous throws AND rejected promises from
      any `.then()` above it (rejection short-circuits directly to the
      nearest downstream rejection handler).
*/
