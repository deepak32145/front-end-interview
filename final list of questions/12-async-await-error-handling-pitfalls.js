/**
 * Q12: async/await Error Handling Pitfalls
 * Difficulty: Hard
 * Concepts: try/catch scoping, unhandled rejections, Promise.all error handling, parallel vs sequential await
 */

// ============================================
// QUESTION
// ============================================
/*
Three snippets. For each, say whether the error is caught, and identify
any performance problem.

// Snippet A
async function loadA() {
  try {
    const user = await fetchUser();     // rejects
    const posts = await fetchPosts();
  } catch (err) {
    console.log('A caught:', err.message);
  }
}

// Snippet B
async function loadB() {
  const userPromise = fetchUser();  // rejects, NOT awaited yet
  const postsPromise = fetchPosts();
  try {
    const user = await userPromise;
    const posts = await postsPromise;
  } catch (err) {
    console.log('B caught:', err.message);
  }
}

// Snippet C
async function loadC() {
  try {
    const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  } catch (err) {
    console.log('C caught:', err.message);
  }
}

// Snippet D — the trap
async function loadD() {
  const userPromise = fetchUser(); // rejects
  await new Promise(r => setTimeout(r, 100)); // unrelated await, no catch yet
  try {
    const user = await userPromise;
  } catch (err) {
    console.log('D caught:', err.message);
  }
}
*/

// ============================================
// ANSWERS
// ============================================

/*
Snippet A: Error IS caught by the try/catch — straightforward.
Performance problem: fetchUser and fetchPosts run SEQUENTIALLY even
though they don't depend on each other — total time is
fetchUser_time + fetchPosts_time instead of max(both).

Snippet B: Error IS caught — same result as A, but FASTER. Calling both
fetch functions synchronously before any `await` starts both requests
immediately (promises begin executing as soon as they're created, not
when awaited). Then `await`ing them sequentially just waits for
already-in-flight work, so total time is roughly max(both), not the sum.
This is the classic "start work eagerly, await it later" pattern for
independent async operations.

Snippet C: Error IS caught — Promise.all rejects as soon as the first
promise rejects, and that rejection is awaited (throws) inside the try
block. Cleanest and most explicit for true "run in parallel" intent,
and it's the standard idiom.

Snippet D: Error IS still caught! This is the trap most candidates get
wrong. Even though `userPromise` was created before the unrelated
`await`, and its rejection technically happens "in the background"
during that unrelated await, the rejection just sits as a pending
rejected promise. It won't become an UNHANDLED rejection because the
`await userPromise` inside the try block later attaches a handler
to it before the microtask/macrotask queue would ever report it as
unhandled — Node/browsers only flag a rejection as "unhandled" if no
`.then`/`.catch`/`await` EVER attaches to it during that task's
lifecycle, and here one does, just delayed. In practice, though, this
pattern is risky: if `loadD` threw an early return before reaching the
inner try (e.g. an early `if` that returns), THAT would produce a real
unhandled rejection warning.
*/

/*
============================================
KEY TAKEAWAY / RULE OF THUMB
============================================
1. `await` inside try/catch catches BOTH synchronous throws in the
   `async function` body and rejections from any awaited promise.
2. To run independent async operations in parallel, either:
   a) start them without awaiting immediately, await both after, or
   b) use Promise.all/allSettled — prefer (b) for clarity and because
      it correctly short-circuits/aggregates.
3. A promise created but never awaited/handled by the time the current
   turn's microtask checkpoint passes IS reported as an unhandled
   rejection — "I'll await it later in this same function" is safe,
   but "I stored it and might check it conditionally" is not.
*/
