/**
 * Q15: Throttle with Leading and Trailing Edge Options
 * Difficulty: Hard
 * Concepts: timers, edge-case invocation semantics, matching lodash-like API contracts
 */

// ============================================
// QUESTION
// ============================================
/*
Extend the basic throttle to support { leading, trailing } options,
matching lodash's semantics:

  throttle(fn, wait, { leading: true, trailing: true })

- leading: true  -> fire immediately on the first call of a burst.
- trailing: true -> after the burst, if any calls were suppressed during
  the cooldown window, fire ONE final call with the LATEST arguments
  once the window ends.
- If BOTH are false, no invocation ever happens (edge case, but should
  not throw).
- If only `trailing` is true (leading: false), the first call in a burst
  should NOT fire immediately — it should wait for the trailing edge.

Trace through this timeline for `throttle(fn, 100, {leading:true, trailing:true})`:
  t=0    call('a')
  t=30   call('b')
  t=60   call('c')
  t=150  call('d')
What fires, and when?
*/

// ============================================
// ANSWER
// ============================================

function throttle(fn, wait, { leading = true, trailing = true } = {}) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let lastInvokeTime = 0;

  function invoke(time) {
    lastInvokeTime = time;
    fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = null;
  }

  function startTimer(remaining) {
    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (trailing && lastArgs) {
        invoke(Date.now());
      }
    }, remaining);
  }

  function throttled(...args) {
    const now = Date.now();
    lastArgs = args;
    lastThis = this;

    const remaining = wait - (now - lastInvokeTime);

    if (remaining <= 0) {
      // Window has elapsed — either fire now (leading) or just record it
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (leading) {
        invoke(now);
      } else {
        lastInvokeTime = now; // reset window even without invoking
        startTimer(wait);
      }
    } else if (!timeoutId) {
      startTimer(remaining);
    }
    // else: a timer is already pending, lastArgs/lastThis are updated
    // above so the trailing call (if enabled) uses the freshest args.
  }

  throttled.cancel = () => {
    clearTimeout(timeoutId);
    timeoutId = null;
    lastArgs = lastThis = null;
    lastInvokeTime = 0;
  };

  return throttled;
}

/*
============================================
TRACE ANSWER for {leading:true, trailing:true}, wait=100
============================================
t=0    call('a')  -> remaining = 100 - (0-0) = 100... but lastInvokeTime
                      starts at 0, so treat first call specially: fires
                      immediately (leading edge) -> fn('a') runs at t=0.
                      lastInvokeTime = 0. Timer started for t=100.
t=30   call('b')  -> within window, timer already pending -> just
                      updates lastArgs to 'b' (no invoke).
t=60   call('c')  -> within window, updates lastArgs to 'c' (no invoke).
t=100  timer fires -> trailing is true and lastArgs is set ('c') ->
                      fn('c') runs. lastInvokeTime = 100.
t=150  call('d')  -> remaining = 100 - (150-100) = 50, which is > 0 in
                      this implementation window check... actually since
                      50ms have passed since t=100's invoke and wait=100,
                      remaining = 100-50 = 50 > 0, so it's still "inside"
                      the next window -> no new timer exists -> starts a
                      new timer for 50ms out (fires at t=200) with 'd'.
t=200  timer fires -> fn('d') runs (trailing).

RESULT: fn called with 'a' (t=0), 'c' (t=100), 'd' (t=200). 'b' is
dropped because 'c' superseded it as the latest args before the
trailing timer fired.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly distinguishes leading vs trailing invocation triggers.
- Only the LATEST args are used for the trailing call (not a queue of
  every suppressed call).
- Handles leading:false correctly — no immediate fire, only trailing.
- Handles leading:true, trailing:false — no final call after the burst.
- .cancel() clears state so a stale trailing call doesn't fire later.
*/
