/**
 * Q44: Garbage Collection, Closures, and Common Memory Leak Patterns
 * Difficulty: Hard
 * Concepts: mark-and-sweep basics, closure retention, detached DOM nodes, listener cleanup, accidental globals
 */

// ============================================
// QUESTION
// ============================================
/*
1) Briefly explain mark-and-sweep garbage collection and why reference
   counting alone (like older IE/Netscape engines used) fails for
   circular references, while mark-and-sweep does not.

2) Find the memory leak in each snippet and fix it.

// Snippet A
function setupHandler() {
  const hugeData = new Array(1_000_000).fill('leak me');
  document.getElementById('btn').addEventListener('click', function () {
    console.log('clicked'); // never actually uses hugeData
  });
}

// Snippet B
function createLogger(prefix) {
  const logs = [];
  return function log(message) {
    logs.push(message); // logs array grows forever
    console.log(`${prefix}: ${message}`);
  };
}
const logger = createLogger('APP');
setInterval(() => logger('tick'), 1000);

// Snippet C
class Widget {
  constructor(el) {
    this.el = el;
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }
  onResize() { /* ... */ }
  // no destroy/cleanup method at all
}
let w = new Widget(document.querySelector('.widget'));
w = null; // intent: let it be garbage collected

3) Does snippet A's `hugeData` actually leak, given the handler
   function never references it? Explain precisely why or why not,
   including how it depends on which variables the closure captures.
*/

// ============================================
// ANSWERS
// ============================================

/*
1) MARK-AND-SWEEP vs REFERENCE COUNTING:
Reference counting tracks how many references point to each object,
freeing it when the count hits zero. It fails for CIRCULAR references:
if object A references B and B references A, and nothing else in the
program references either, their count never reaches zero even though
they're both genuinely unreachable garbage — causing a permanent leak.

Mark-and-sweep instead starts from a set of GC ROOTS (global object,
currently executing call stack, etc.) and recursively MARKS every
object reachable by following references from those roots. Anything
left UNMARKED after this traversal — including mutually-referencing
cycles that are unreachable FROM THE ROOTS — is swept (freed). This
correctly handles cycles because reachability from roots, not raw
reference count, determines liveness. All modern JS engines use
mark-and-sweep (with generational/incremental optimizations).

3) THIS IS THE TRICKY PART: whether `hugeData` leaks in snippet A
   depends on the ENGINE's closure implementation, not just "does the
   inner function reference it". Modern V8 (used in Chrome/Node) is
   smart enough to determine, per-closure, EXACTLY which outer
   variables a given nested function actually references, and does NOT
   retain the rest of the enclosing scope just because they're
   textually in the same function. Since the click handler here never
   references `hugeData` at all, modern V8 will NOT keep it alive via
   this particular closure — it becomes eligible for collection once
   setupHandler() returns, PROVIDED nothing else references it.
   HOWEVER, this is engine-specific optimization behavior, not a
   language guarantee — some engines/versions historically retained the
   ENTIRE enclosing scope for any closure created within it, which
   would leak hugeData for as long as the click handler itself is
   reachable (which, since it's attached via addEventListener and never
   removed, is effectively forever). The safe, portable answer: DON'T
   RELY on engine-specific closure optimization — if hugeData isn't
   needed by the handler, don't declare it in a scope the handler
   closes over, or explicitly null it out / scope it more tightly.
*/

// Fix for A: keep hugeData out of any scope the persistent handler closes over
function setupHandlerFixed() {
  {
    const hugeData = new Array(1_000_000).fill('leak me');
    processHugeDataSynchronously(hugeData); // use it immediately, don't retain
  }
  document.getElementById('btn').addEventListener('click', function () {
    console.log('clicked'); // this closure never had access to hugeData at all
  });
}
function processHugeDataSynchronously() {}

/*
Fix for B: the logs array grows without bound because `logger` is
called every second FOREVER via setInterval, and every call pushes to
`logs`, which is captured by the closure and never cleared or capped.
*/
function createLoggerFixed(prefix, maxLogs = 100) {
  const logs = [];
  return function log(message) {
    logs.push(message);
    if (logs.length > maxLogs) logs.shift(); // cap growth
    console.log(`${prefix}: ${message}`);
  };
}
// Also: the setInterval itself is never cleared — that's a SEPARATE
// leak (the interval keeps the whole closure, including `logger` and
// therefore `logs`, alive forever, regardless of the array cap). A
// complete fix also needs `clearInterval` when the logger is no longer
// needed.

/*
Fix for C: setting `w = null` does NOT allow garbage collection here,
because `window.addEventListener('resize', this.onResize)` created a
STRONG reference from the global `window` object's listener list to
the bound `onResize` function, which itself closes over `this` (the
Widget instance). As long as that listener is registered, the Widget
instance stays reachable from a GC root (window), no matter how many
local variables pointing to it are nulled out.
*/
class WidgetFixed {
  constructor(el) {
    this.el = el;
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);
  }
  onResize() {}
  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.el = null;
  }
}
let widget = new WidgetFixed(document.querySelector('.widget'));
widget.destroy(); // now this is actually collectible
widget = null;

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly explains mark-and-sweep vs reference counting and cycles.
- For snippet C specifically: identifies that the leak comes from the
  GLOBAL listener holding a strong reference, and that nulling a local
  variable is irrelevant to reachability from a GC root.
- For snippet A: does NOT give an overconfident "yes it definitely
  leaks" or "no it definitely doesn't" — a strong candidate correctly
  flags that this depends on engine-specific closure variable capture
  analysis, and recommends not relying on it either way.
*/
