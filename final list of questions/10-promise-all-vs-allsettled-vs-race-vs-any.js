/**
 * Q10: Promise.all vs allSettled vs race vs any
 * Difficulty: Medium-Hard
 * Concepts: combinators, short-circuiting, aggregate errors, settle semantics
 */

// ============================================
// QUESTION
// ============================================
/*
Given:

const fast = new Promise(res => setTimeout(() => res('fast'), 10));
const slow = new Promise(res => setTimeout(() => res('slow'), 50));
const failFast = new Promise((_, rej) => setTimeout(() => rej('fail-fast'), 5));
const failSlow = new Promise((_, rej) => setTimeout(() => rej('fail-slow'), 30));

For EACH combinator below, state:
  a) what it resolves/rejects with
  b) whether it short-circuits before all inputs settle

1. Promise.all([fast, slow])
2. Promise.all([fast, failFast, slow])
3. Promise.allSettled([fast, failFast, slow])
4. Promise.race([fast, failFast, slow])
5. Promise.race([slow, failSlow])
6. Promise.any([failFast, failSlow, slow])
7. Promise.any([failFast, failSlow])
*/

// ============================================
// ANSWERS
// ============================================

/*
1. Promise.all([fast, slow])
   a) Resolves with ['fast', 'slow'] after ~50ms (waits for the SLOWEST).
   b) No short-circuit needed — nothing rejects.

2. Promise.all([fast, failFast, slow])
   a) Rejects with 'fail-fast' at ~5ms.
   b) YES — short-circuits immediately on the FIRST rejection, even
      though `fast` and `slow` are still pending. Their eventual
      settlement is not awaited or reported (though the promises
      themselves still resolve independently in the background — Promise.all
      just stops listening for the purposes of ITS OWN result).

3. Promise.allSettled([fast, failFast, slow])
   a) Resolves (never rejects) at ~50ms with:
      [
        { status: 'fulfilled', value: 'fast' },
        { status: 'rejected', reason: 'fail-fast' },
        { status: 'fulfilled', value: 'slow' }
      ]
   b) No short-circuit — always waits for ALL inputs to settle, success
      or failure, then reports every outcome individually.

4. Promise.race([fast, failFast, slow])
   a) Rejects with 'fail-fast' at ~5ms — `race` doesn't care whether the
      first settled promise fulfilled or rejected, it just adopts
      whichever settles FIRST chronologically.
   b) YES — settles as soon as the first input settles, regardless of
      fulfilled/rejected.

5. Promise.race([slow, failSlow])
   a) Rejects with 'fail-slow' at ~30ms (settles before `slow`'s 50ms).
   b) Yes, same as above — first to settle wins, even if it's a rejection.

6. Promise.any([failFast, failSlow, slow])
   a) Resolves with 'slow' at ~50ms.
   b) `any` ignores rejections and only short-circuits on the FIRST
      FULFILLMENT. It has to wait through both failures before `slow`
      finally succeeds.

7. Promise.any([failFast, failSlow])
   a) Rejects at ~30ms (after the LAST one settles) with an
      `AggregateError` whose `.errors` array is `['fail-fast', 'fail-slow']`.
   b) Only rejects once EVERY input has rejected — mirror image of `all`.
*/

/*
============================================
QUICK REFERENCE TABLE
============================================
| Combinator      | Settles on                  | Failure mode                    |
|------------------|------------------------------|----------------------------------|
| Promise.all       | first rejection OR all fulfilled | rejects with first reason      |
| Promise.allSettled | always all settle           | never rejects                   |
| Promise.race       | first settlement (any kind) | adopts whichever came first     |
| Promise.any        | first fulfillment           | AggregateError if ALL reject    |

FOLLOW-UP: Which one would you use to implement "fetch from primary CDN,
fall back to secondary CDN, whichever responds successfully first" while
tolerating one CDN being down?
-> Promise.any — you want the first SUCCESS, and you want to keep trying
   even if one source fails, only giving up if ALL sources fail.
*/
