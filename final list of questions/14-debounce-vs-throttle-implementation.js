/**
 * Q14: Implement Debounce and Throttle from Scratch
 * Difficulty: Medium-Hard
 * Concepts: closures, timers, `this`/args forwarding, cancel methods
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `debounce(fn, delay)` and `throttle(fn, limit)`.

Requirements for BOTH:
- Must forward `this` and all arguments to the underlying `fn` correctly.
- Must expose a `.cancel()` method to cancel any pending invocation.

debounce: only fires `delay` ms after the LAST call in a burst (silence
required before it runs).

throttle: fires at most once per `limit` ms, immediately on the first
call, then ignores subsequent calls until the window passes (trailing
call optional — implement "leading only" here, we cover leading+trailing
in the next question).

Also answer: for a search-as-you-type input, which do you use? For a
scroll/resize handler, which do you use? Why?
*/

// ============================================
// ANSWER
// ============================================

function debounce(fn, delay) {
  let timeoutId;

  function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn.apply(this, args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
  };

  return debounced;
}

function throttle(fn, limit) {
  let inCooldown = false;
  let timeoutId;

  function throttled(...args) {
    if (inCooldown) return;
    fn.apply(this, args);
    inCooldown = true;
    timeoutId = setTimeout(() => {
      inCooldown = false;
    }, limit);
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    inCooldown = false;
  };

  return throttled;
}

/*
============================================
TEST
============================================
const log = (msg) => console.log(msg, Date.now());

const debouncedLog = debounce(log, 300);
debouncedLog('a'); debouncedLog('b'); debouncedLog('c');
// only "c" logs, ~300ms later

const throttledLog = throttle(log, 1000);
setInterval(() => throttledLog('tick'), 100);
// logs roughly once per second, not every 100ms

============================================
DESIGN DISCUSSION
============================================
Search-as-you-type -> DEBOUNCE. You don't care about intermediate
keystrokes; you want to fire the API call only once the user pauses
typing — minimizes wasted requests.

Scroll/resize handler -> THROTTLE. You need periodic updates DURING the
continuous event stream (e.g. updating a sticky header or lazy-loading
check), not just at the end — debounce would make the UI feel laggy
because nothing happens until scrolling fully stops.

============================================
EVALUATION CRITERIA
============================================
- Correct `this`/args forwarding via `.apply(this, args)`.
- `.cancel()` actually clears pending timers and resets internal state.
- Explains the qualitative difference (rate limiting vs quiet-period
  waiting), not just the code.
- Bonus: mentions that `this` forwarding matters when used as a DOM
  event handler (`this` would be the element) vs an arrow function
  wrapper (which would break `this` forwarding).
*/
