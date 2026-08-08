/**
 * Q23: Tricky Array Method Output — sort, reduce, splice, holes
 * Difficulty: Hard
 * Concepts: default sort coercion, sort stability, reduce initial value, mutating methods, sparse arrays
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the output of EACH:

// A
console.log([10, 1, 2].sort());

// B
console.log([3, 1, 2].sort((a, b) => a - b));

// C
const people = [{n:'a',age:30},{n:'b',age:20},{n:'c',age:30},{n:'d',age:20}];
console.log(people.sort((x,y) => x.age - y.age).map(p => p.n).join(''));

// D
console.log([1,2,3].reduce((acc, cur) => acc + cur));

// E
console.log([].reduce((acc, cur) => acc + cur));

// F
console.log([1,2,3].reduce((acc, cur) => acc + cur, 10));

// G
const arr = [1,2,3,4,5];
arr.splice(1, 2, 'a', 'b', 'c');
console.log(arr);

// H
console.log([1, , 3].map(x => x * 2)); // note the hole at index 1
*/

// ============================================
// ANSWERS
// ============================================

/*
A: [1, 10, 2]
Array.prototype.sort() with NO comparator converts elements to STRINGS
and sorts lexicographically by default. "10" < "2" as strings because
'1' < '2' at the first character, so 10 sorts before 2.

B: [1, 2, 3] — correct numeric sort because a proper comparator is given.

C: "bdac" (order depends on engine, but since ES2019 Array#sort is
REQUIRED to be stable across all major engines). Stable sort means
elements that compare EQUAL (age:30 === age:30 for 'a' and 'c') retain
their RELATIVE ORIGINAL ORDER. Original order: a(30), b(20), c(30),
d(20). Sorted by age ascending: b(20), d(20) [original relative order
preserved: b before d], then a(30), c(30) [a before c] -> "bdac".

D: 6 — reduce with no initial value uses the array's first element (1)
as the initial accumulator and starts iterating from index 1.

E: TypeError: Reduce of empty array with no initial value — reduce
throws if the array is empty AND no initialValue is provided (there's
nothing to use as a seed).

F: 16 — 10 (initial) + 1 + 2 + 3.

G: ['1', ...] -- wait, precisely: splice(1, 2, 'a','b','c') removes 2
elements starting at index 1 (removes 2 and 3) and inserts 'a','b','c'
in their place. Result: [1, 'a', 'b', 'c', 4, 5]. splice MUTATES the
original array in place and returns the array of REMOVED elements
([2, 3]), which is discarded here since we didn't capture it.

H: [2, <1 empty item>, 6] — map() SKIPS holes in sparse arrays (it
never calls the callback for index 1, since there's no element there,
only a "hole"), but PRESERVES the hole at the same index in the result.
This is different from `undefined` — [1, undefined, 3].map(x => x*2)
WOULD call the callback for index 1 (giving NaN), because that index
genuinely holds the value `undefined`, not a hole.
*/

/*
============================================
FOLLOW-UP
============================================
Why does JS default `sort()` compare as strings? Historical design
decision from ES1 — sort needed SOME default total ordering that works
for any type, and lexicographic string comparison is well-defined for
everything via toString(), unlike numeric comparison which isn't
meaningful for e.g. objects. It's a classic interview trap precisely
because it's so counter-intuitive for numbers.
*/
