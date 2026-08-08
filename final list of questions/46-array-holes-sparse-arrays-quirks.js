/**
 * Q46: Array Holes and Sparse Array Quirks
 * Difficulty: Hard
 * Concepts: sparse vs dense arrays, hole-skipping iteration methods, length manipulation, Array.from vs spread
 */

// ============================================
// QUESTION
// ============================================
/*
Predict the output of each:

// A
const a = [1, , 3];
console.log(a.length);
console.log(a[1]);
console.log(1 in a);

// B
const b = new Array(3);
console.log(b.length);
console.log(b);
console.log(0 in b);

// C
console.log([1, , 3].map(x => x * 2));
console.log([1, , 3].filter(() => true));
console.log([1, , 3].forEach(x => console.log('visited', x)));

// D
const c = [1, 2, 3];
c.length = 1;
console.log(c);

// E
const d = [1, 2, 3];
d[10] = 99;
console.log(d.length);
console.log(d);

// F
console.log([...new Array(3)]);
console.log(Array.from(new Array(3)));
console.log(Array.from({ length: 3 }));

// G
console.log([1, , 3].join('-'));
console.log([1, undefined, 3].join('-'));
*/

// ============================================
// ANSWERS
// ============================================

/*
A: length=3, a[1]=undefined, `1 in a` -> false
   `[1, , 3]` has a genuine HOLE at index 1 — no value was ever
   assigned there. Reading a[1] returns undefined (same as any missing
   property), but critically the `in` operator distinguishes "has no
   own property at all" (hole) from "has the property, its value
   happens to be undefined". `1 in a` is false because index 1 was
   never actually set.

B: length=3, console.log shows `[ <3 empty items> ]`, `0 in b` -> false
   `new Array(3)` creates a sparse array with length 3 but NO actual
   indexed properties at all — completely empty slots, not even holes
   with undefined "set". This is different from `[undefined, undefined,
   undefined]`, which WOULD have `0 in arr` return true.

C:
   [1, , 3].map(x => x * 2)      -> [2, <1 empty item>, 6]
   [1, , 3].filter(() => true)   -> [1, 3]   (hole is SKIPPED, and the
                                     resulting array is DENSE — the hole
                                     doesn't even survive as a hole,
                                     unlike map which preserves the hole
                                     position)
   [1, , 3].forEach(x => ...)    -> logs "visited 1" then "visited 3"
                                     ONLY — forEach never invokes the
                                     callback for the hole at all.

   KEY RULE: map, filter, forEach, some, every, reduce ALL skip holes
   when invoking their callback (they never call the callback for an
   index that doesn't exist as an own property). map/some/every
   preserve holes in their structural sense where applicable; filter
   naturally produces a dense result since it only includes indices
   that were actually visited and passed the test.

D: [1] — setting `.length` to a SMALLER value TRUNCATES the array,
   deleting all elements at indices >= the new length. This works in
   reverse too: increasing `.length` creates trailing holes.

E: length=11, d becomes [1, 2, 3, <7 empty items>, 99] — assigning to
   an out-of-bounds index automatically grows `.length` to
   index+1 and creates HOLES for everything in between (not undefined
   values, genuine holes).

F:
   [...new Array(3)]        -> [undefined, undefined, undefined]
   Array.from(new Array(3)) -> [undefined, undefined, undefined]
   Array.from({length: 3})  -> [undefined, undefined, undefined]

   IMPORTANT: spread (`...`) and Array.from BOTH convert holes into
   REAL `undefined` values in the result — they do NOT skip or preserve
   holes like map/forEach do. This is because spread uses the iterator
   protocol (Array's default iterator DOES visit every index up to
   length, producing `undefined` for holes), and Array.from explicitly
   walks indices 0 to length-1 reading each one (also producing
   undefined for holes/missing indices), unlike the hole-aware
   iteration methods in part C. This inconsistency across "array
   methods that skip holes" vs "array conversions that fill holes with
   undefined" is one of the most commonly missed JS subtleties.

G:
   [1, , 3].join('-')          -> "1--3"  (hole treated as empty string,
                                    same as null/undefined in join)
   [1, undefined, 3].join('-') -> "1--3"  (identical output — join
                                    doesn't distinguish holes from
                                    actual undefined values; both become
                                    empty string segments)
*/

/*
============================================
EVALUATION CRITERIA
============================================
- Distinguishes holes (no own property) from explicit undefined (has
  own property, value is undefined) using the `in` operator correctly.
- Knows which array methods SKIP holes (map/filter/forEach/reduce/some/
  every) vs which CONVERT holes to undefined (spread, Array.from,
  join, and the default array iterator used by for...of).
- Understands `.length` truncation/growth mechanics and out-of-bounds
  assignment creating sparse regions.
*/
