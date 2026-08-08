/**
 * Q39: Async Task Queue with Concurrency Limiting (Rate Limiter)
 * Difficulty: Very Hard
 * Concepts: semaphore pattern, promise-based scheduling, backpressure, error isolation per task
 */

// ============================================
// QUESTION
// ============================================
/*
Implement `runWithConcurrencyLimit(tasks, limit)` where `tasks` is an
array of functions returning promises (`() => Promise<T>`), and at most
`limit` of them run simultaneously. It should:
  - Return a Promise that resolves with an array of results IN THE SAME
    ORDER as the input tasks (not completion order).
  - Start a new task IMMEDIATELY when a running one finishes (keep the
    pool always full until tasks run out) — NOT simple batching
    (chunking into groups of `limit` and awaiting each batch is a
    common but suboptimal approach because one slow task in a batch
    blocks the whole next batch from starting).
  - If a task rejects, its slot in the results array should hold the
    rejection reason (like allSettled), and OTHER tasks should be
    unaffected — the overall promise should NOT reject early.

Also explain: why is naive "chunk into groups of `limit`, Promise.all
each group sequentially" worse than a real work-stealing pool?
*/

// ============================================
// ANSWER
// ============================================

async function runWithConcurrencyLimit(tasks, limit) {
  const results = new Array(tasks.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex++;
      try {
        results[currentIndex] = await tasks[currentIndex]();
      } catch (err) {
        results[currentIndex] = { error: err };
      }
    }
  }

  // Spin up exactly `limit` workers; each one pulls the NEXT available
  // task index as soon as it's free, rather than waiting for an entire
  // fixed-size batch to finish together.
  const workerCount = Math.min(limit, tasks.length);
  const workers = Array.from({ length: workerCount }, () => worker());

  await Promise.all(workers);
  return results;
}

/*
============================================
TEST
============================================
function makeTask(id, delay, shouldFail = false) {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error(`task ${id} failed`));
      else resolve(`task ${id} done`);
    }, delay);
  });
}

const tasks = [
  makeTask(0, 300),
  makeTask(1, 100),
  makeTask(2, 200, true), // fails
  makeTask(3, 50),
  makeTask(4, 150),
];

runWithConcurrencyLimit(tasks, 2).then(console.log);
// results[2] will be { error: Error('task 2 failed') }, everything
// else resolves normally, order preserved by original index.

============================================
WHY WORK-STEALING BEATS FIXED BATCHING
============================================
Naive batching:
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit).map(t => t());
    await Promise.all(batch);
  }

Problem: within a batch, if task A takes 5 seconds and task B (running
concurrently) takes 50ms, task B's SLOT sits idle for the remaining
4.95 seconds waiting for the whole batch to finish before the NEXT
batch can start — even though a new task could have started using that
freed-up slot immediately. Over many tasks with variable duration, this
compounds into significant wasted throughput.

The worker-pool approach ("work stealing" / continuous pulling) keeps
exactly `limit` tasks in flight AT ALL TIMES until the queue is
drained — as soon as ANY task finishes, its worker immediately grabs
the next pending task, with no artificial batch boundaries. This is the
same fundamental pattern behind real thread/worker pools and connection
pools.

============================================
EVALUATION CRITERIA
============================================
- Does NOT implement naive chunked batching (a common wrong/suboptimal
  answer) — uses a continuous worker-pull pattern instead.
- Preserves original task ORDER in the results array (writes to
  results[currentIndex], not push).
- Isolates per-task errors so one failure doesn't reject the whole
  operation (allSettled-like semantics).
- Can clearly articulate WHY batching wastes concurrency slots with a
  concrete numeric example.
*/
