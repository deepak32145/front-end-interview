/**
 * Q22: Flatten a Nested Array — Recursive, Iterative, and Depth-Limited
 * Difficulty: Medium-Hard
 * Concepts: recursion vs stack overflow risk, explicit stack simulation, generators, depth parameter
 */

// ============================================
// QUESTION
// ============================================
/*
Implement THREE versions of flatten (no Array.prototype.flat):

1. flattenRecursive(arr) — fully flattens arbitrary depth, recursive.
2. flattenIterative(arr) — fully flattens arbitrary depth, using an
   explicit stack (no recursion) — why would you need this version?
3. flattenDepth(arr, depth) — flattens only up to `depth` levels, like
   Array.prototype.flat(depth), depth defaults to 1.

flattenRecursive([1, [2, [3, [4, [5]]]]]);      // [1,2,3,4,5]
flattenDepth([1, [2, [3, [4]]]], 2);            // [1, 2, 3, [4]]

Also: what happens to flattenRecursive on an array nested 50,000 levels
deep? How does flattenIterative avoid that problem?
*/

// ============================================
// ANSWER
// ============================================

function flattenRecursive(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenRecursive(item));
    } else {
      result.push(item);
    }
  }
  return result;
}

function flattenIterative(arr) {
  const result = [];
  // Stack of items to process, seeded with the input reversed so we
  // pop in the original left-to-right order.
  const stack = [...arr].reverse();

  while (stack.length) {
    const item = stack.pop();
    if (Array.isArray(item)) {
      // Push nested items back on the stack (reversed) instead of
      // recursing — bounded by heap memory, not call-stack depth.
      stack.push(...[...item].reverse());
    } else {
      result.push(item);
    }
  }
  return result;
}

function flattenDepth(arr, depth = 1) {
  if (depth < 1) return arr.slice();
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenDepth(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}

/*
============================================
TEST
============================================
console.log(flattenRecursive([1, [2, [3, [4, [5]]]]])); // [1,2,3,4,5]
console.log(flattenIterative([1, [2, [3, [4, [5]]]]])); // [1,2,3,4,5]
console.log(flattenDepth([1, [2, [3, [4]]]], 2));        // [1,2,3,[4]]
console.log(flattenDepth([1, [2, [3, [4]]]]));            // [1,2,[3,[4]]] (default depth 1)

============================================
STACK OVERFLOW DISCUSSION
============================================
flattenRecursive on a 50,000-level-deep nested array WILL throw
"RangeError: Maximum call stack size exceeded" — each level of nesting
adds one more stack frame, and JS engines cap the call stack (typically
somewhere around 10,000-15,000 frames depending on engine/frame size).

flattenIterative avoids this because it uses an explicit array-based
stack living on the HEAP, not the call stack. Heap memory is vastly
larger than the fixed call stack, so it can handle much deeper (or even
technically unbounded, memory permitting) nesting without a
RangeError.

This is the same reason production-grade JSON parsers, deep-clone
utilities, and tree traversal libraries dealing with untrusted/unbounded
input depth often prefer iterative or trampolined approaches over naive
recursion.

============================================
EVALUATION CRITERIA
============================================
- All three variants produce correct results.
- Candidate can explain call-stack vs heap memory limits without
  prompting.
- flattenDepth correctly stops at the boundary (arrays deeper than
  `depth` remain nested, not fully flattened).
- Bonus: mentions trampolining or async chunked processing as another
  way to avoid stack overflow for deep recursive algorithms in general.
*/
