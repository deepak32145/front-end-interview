/**
 * Q49: requestAnimationFrame vs setTimeout vs Microtasks — Rendering Pipeline Timing
 * Difficulty: Very Hard
 * Concepts: browser rendering pipeline, rAF timing relative to paint, microtask/macrotask interaction with rendering, requestIdleCallback
 */

// ============================================
// QUESTION
// ============================================
/*
1) Where exactly does requestAnimationFrame fire relative to: the
   microtask queue, the browser's style/layout/paint steps, and
   setTimeout(fn, 0)? Draw/describe the ordering.

2) Predict the LOGICAL order (not exact ms) of these logs in a browser:

console.log('sync');

setTimeout(() => console.log('setTimeout'), 0);

Promise.resolve().then(() => console.log('microtask'));

requestAnimationFrame(() => console.log('rAF'));

queueMicrotask(() => console.log('queueMicrotask'));

3) Why is it a common mistake to read layout properties (like
   `el.offsetHeight`) INSIDE a requestAnimationFrame callback right
   after changing a style, and what performance problem does it cause?

4) What is requestIdleCallback for, and why is it INAPPROPRIATE for
   anything involving visual updates or animation?
*/

// ============================================
// ANSWERS
// ============================================

/*
1) THE PIPELINE (per browser frame, simplified):
   1. Any currently running JS task finishes (call stack empties).
   2. ALL pending MICROTASKS drain completely (Promise .then,
      queueMicrotask, MutationObserver callbacks).
   3. If it's time to render a new frame, the browser runs ALL
      requestAnimationFrame callbacks (in registration order), which
      run BEFORE style recalculation/layout/paint for that frame — rAF
      callbacks are exactly where you're SUPPOSED to make visual
      changes intended for the upcoming frame.
   4. Browser performs style, layout, and paint.
   5. Browser picks the next MACROTASK from the queue (e.g. a
      setTimeout callback, an I/O event) to run next — macrotasks are
      NOT guaranteed to run once per frame; there might be zero, one,
      or many macrotasks between two consecutive rendered frames,
      entirely independent of the rAF/render cycle.

   setTimeout(fn, 0) is a MACROTASK — it has no defined relationship to
   rendering at all. It typically runs AFTER the current script and
   microtasks, but its relative position versus rAF/paint for a GIVEN
   frame is not something you should rely on precisely — practically,
   rAF callbacks tend to run before a same-tick setTimeout(0) because
   the browser prioritizes an already-scheduled paint, but this is an
   implementation behavior, not a hard guarantee across all engines.

2) LOGICAL ORDER:
   sync
   microtask
   queueMicrotask
   rAF
   setTimeout

   (Promise.resolve().then and queueMicrotask are BOTH microtasks and
   run in the order they were SCHEDULED, right after the synchronous
   script finishes and before anything else. rAF then runs at the next
   paint opportunity. setTimeout, being a macrotask, typically runs
   after rAF/paint in practice, though as noted above this specific
   ordering between rAF and setTimeout(0) is not something the spec
   strictly guarantees — a thorough answer flags this nuance rather
   than stating it with false certainty.)

3) FORCED SYNCHRONOUS LAYOUT ("layout thrashing"): the browser
   normally batches style changes and defers layout/paint calculations
   until it actually needs them (end of the current task, or right
   before rAF/paint). But READING a layout-dependent property (like
   offsetHeight, offsetWidth, getComputedStyle, getBoundingClientRect)
   forces the browser to IMMEDIATELY compute layout synchronously RIGHT
   THEN, flushing any pending style changes first, so it can give you
   an accurate number. If you then WRITE another style change and READ
   again in a loop (common in animation code inside rAF, e.g.
   "measure, then adjust, then measure again"), you force the browser
   to repeat this expensive recalculation MANY times per frame instead
   of once — this pattern is exactly what's called "layout thrashing"
   and is one of the most common real-world causes of janky animations.
   The fix is to batch ALL your reads together, then ALL your writes
   together (read-then-write, never interleaved read-write-read-write).

4) requestIdleCallback schedules a callback to run during the browser's
   IDLE PERIODS — whenever it has spare time left over after handling
   higher-priority work (input, rendering, other tasks) within a frame
   budget, with a `deadline.timeRemaining()` telling you how much idle
   time you actually have. It's designed for LOW-PRIORITY, NON-URGENT
   background work: analytics logging, prefetching, precomputing data
   you might need later, etc. It is INAPPROPRIATE for visual
   updates/animation because: (a) it may be significantly DELAYED or
   even NOT CALLED AT ALL for a long time if the browser stays busy
   (e.g. during heavy scrolling or animation — precisely when you
   WOULDN'T want more work competing for the frame budget anyway), and
   (b) it runs AFTER rendering has already happened for that frame,
   so any visual change made inside it would be invisible until the
   NEXT frame at the earliest — introducing an unpredictable extra
   frame (or more) of latency, which is unacceptable for smooth
   animation that MUST update every rendered frame reliably via rAF.
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly places rAF AFTER microtasks and BEFORE style/layout/paint
  for a given frame — this is the headline fact most candidates get
  wrong (many think rAF is just "a fancier setTimeout").
- Explains layout thrashing with the read-write-read-write causation,
  not just "reading layout is slow".
- Correctly distinguishes requestIdleCallback's "may not run soon or at
  all" guarantee from rAF's "runs before every rendered frame" guarantee.
*/
