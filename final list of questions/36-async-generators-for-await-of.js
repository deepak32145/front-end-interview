/**
 * Q36: Async Generators and for-await-of
 * Difficulty: Very Hard
 * Concepts: async iterables, async iterator protocol, backpressure via pull-based streaming, mixing sync/async sources
 */

// ============================================
// QUESTION
// ============================================
/*
1) Implement an async generator `paginatedFetch(fetchPage)` that lazily
   yields items one page at a time from a paginated API, where
   `fetchPage(cursor)` returns `Promise<{ items: any[], nextCursor:
   string|null }>`. Consumers should be able to `for await...of` over
   INDIVIDUAL ITEMS (not pages), and pages should only be fetched when
   needed (lazy/pull-based — not all pages eagerly upfront).

2) What is the key architectural benefit of a PULL-based async
   generator over an EAGER approach that fetches everything into an
   array first? Name a concrete scenario where it matters.

3) Predict the output:

async function* countUp(n) {
  for (let i = 1; i <= n; i++) {
    await new Promise(r => setTimeout(r, 10));
    yield i;
  }
}

async function main() {
  for await (const num of countUp(3)) {
    console.log('got', num);
    if (num === 2) break; // does the generator clean up properly?
  }
  console.log('done');
}
main();
*/

// ============================================
// ANSWERS
// ============================================

async function* paginatedFetch(fetchPage) {
  let cursor = null;
  do {
    const { items, nextCursor } = await fetchPage(cursor);
    for (const item of items) {
      yield item; // yields ONE item at a time, pulling a new page only
                   // once the consumer has exhausted the current page's
                   // yielded items and asks for more.
    }
    cursor = nextCursor;
  } while (cursor !== null);
}

/*
============================================
TEST
============================================
async function fakeFetchPage(cursor) {
  const page = cursor ?? 0;
  if (page >= 3) return { items: [], nextCursor: null };
  return {
    items: [`item-${page}-a`, `item-${page}-b`],
    nextCursor: page + 1 < 3 ? page + 1 : null
  };
}

async function run() {
  for await (const item of paginatedFetch(fakeFetchPage)) {
    console.log(item);
    // only fetches page 2 once items from page 1 are consumed, etc.
  }
}
run();

============================================
2) PULL vs EAGER
============================================
Eager approach: `fetchAllPages()` that loops internally and pushes
every item into one giant array before returning, THEN the consumer
iterates the array. Downsides:
- Memory: for a huge/unbounded dataset (e.g. streaming millions of log
  lines, or a truly infinite feed), you'd OOM before ever processing a
  single item.
- Latency to first result: the consumer waits for EVERY page to
  download before seeing even the FIRST item, even if they only wanted
  the first 5 (e.g. searching for a match and breaking early).
- Wasted work: if the consumer breaks out of the loop early (like part
  3 below), an eager approach already did all the network calls for
  nothing.

Pull-based async generators fetch exactly as much as the consumer
actually asks for, support unbounded/streaming sources gracefully, and
let early termination (`break`) cancel further fetching automatically.

3) OUTPUT:
got 1        (after ~10ms)
got 2        (after ~20ms total)
done

Does NOT log "got 3" — breaking out of a for-await-of loop calls
`.return()` on the underlying ASYNC iterator automatically (just like
regular for-of does for sync iterators), which signals the generator
to stop at its current suspension point. Since `countUp` has no
try/finally, there's no observable cleanup code here, but if it had:

async function* countUp(n) {
  try {
    for (let i = 1; i <= n; i++) {
      await new Promise(r => setTimeout(r, 10));
      yield i;
    }
  } finally {
    console.log('generator cleaned up');
  }
}

...then "generator cleaned up" WOULD log right after "got 2", before
"done" — proving the early break correctly triggers cleanup, which
matters enormously for generators wrapping real resources (open file
handles, DB cursors, WebSocket subscriptions).
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Correctly implements a two-level lazy generator (pages -> items)
  without eagerly resolving all pages upfront.
- Articulates memory/latency/wasted-work tradeoffs of pull vs eager,
  ideally with a streaming/infinite-data example.
- Knows for-await-of calls .return() on early break/exception, enabling
  try/finally cleanup inside async generators — this is the standout
  "very hard" fact most candidates miss.
*/
