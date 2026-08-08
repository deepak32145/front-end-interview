/**
 * Q13: Implement Async Retry with Exponential Backoff + Jitter
 * Difficulty: Hard
 * Concepts: async recursion, exponential backoff, jitter, abort/cancellation, error classification
 */

// ============================================
// QUESTION
// ============================================
/*
Implement:

  async function retry(fn, options)

where `fn` is an async function that may reject. `options`:
  - retries: max retry attempts (default 3, so up to 4 total calls)
  - baseDelayMs: base delay (default 200)
  - factor: exponential factor (default 2)
  - jitter: boolean, add randomness to avoid thundering herd (default true)
  - shouldRetry: (error) => boolean, decide whether an error is retryable
    (default: always retry)
  - signal: an AbortSignal to allow cancelling the wait between retries

Requirements:
- Delay grows as baseDelayMs * factor^attempt.
- If shouldRetry returns false, fail immediately without further retries.
- If retries are exhausted, reject with the LAST error encountered.
- If `signal` is aborted during a wait, stop retrying and reject with
  an AbortError-like error.
*/

// ============================================
// ANSWER
// ============================================

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

async function retry(fn, options = {}) {
  const {
    retries = 3,
    baseDelayMs = 200,
    factor = 2,
    jitter = true,
    shouldRetry = () => true,
    signal
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;

      const isLastAttempt = attempt === retries;
      if (isLastAttempt || !shouldRetry(err)) {
        throw lastError;
      }

      let delay = baseDelayMs * factor ** attempt;
      if (jitter) {
        // full jitter: random value between 0 and computed delay
        delay = Math.random() * delay;
      }

      await wait(delay, signal); // throws AbortError if cancelled
    }
  }

  // unreachable, but keeps TS/linters happy
  throw lastError;
}

/*
============================================
TEST
============================================
let attempts = 0;
async function flaky() {
  attempts++;
  if (attempts < 3) throw new Error('fail #' + attempts);
  return 'success';
}

retry(flaky, { retries: 5, baseDelayMs: 50 })
  .then(console.log)   // "success" after 2 retries
  .catch(console.error);

// Non-retryable error class
class ValidationError extends Error {}
retry(
  async () => { throw new ValidationError('bad input'); },
  { shouldRetry: (e) => !(e instanceof ValidationError) }
).catch(e => console.log('failed fast:', e.message)); // no retries happen

============================================
EVALUATION CRITERIA
============================================
- Correct exponential growth formula and off-by-one attempt counting
  (retries=3 means up to 4 total calls: initial + 3 retries).
- shouldRetry short-circuits without waiting/retrying further.
- Rejects with the LAST real error, not a generic "retries exhausted"
  message (preserves the original stack/cause for debugging).
- AbortSignal support cleanly interrupts an in-progress wait.
- Awareness of "thundering herd" and why jitter matters at scale.
*/
