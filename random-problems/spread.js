/* ===== REST OPERATOR vs SPREAD OPERATOR ===== */

// ============ REST OPERATOR (...) ============
// Used in function parameters to collect remaining arguments into an array

function multiply(...nums) {
  // rest operator - collects arguments into an array
  console.log("Rest operator result:", nums); // [5, 6]
  return nums.reduce((a, b) => a * b);
}

console.log("Multiply:", multiply(5, 6)); // 30

// Rest with destructuring
const [first, ...rest] = [1, 2, 3, 4, 5];
console.log("First:", first); // 1
console.log("Rest:", rest); // [2, 3, 4, 5]

// Rest in object destructuring
const { name, ...otherProps } = { name: "John", age: 30, city: "NYC" };
console.log("Name:", name); // "John"
console.log("Other props:", otherProps); // { age: 30, city: "NYC" }

// ============ SPREAD OPERATOR (...) ============
// Used to expand array/object elements into individual elements

var arr = [5, 6];
multiply(...arr); // spread operator - expands array into individual arguments

// Spreading in arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
console.log("Combined array:", combined); // [1, 2, 3, 4, 5, 6]

// Spreading in objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const mergedObj = { ...obj1, ...obj2 };
console.log("Merged object:", mergedObj); // { a: 1, b: 2, c: 3, d: 4 }

// ============ KEY DIFFERENCES ============
/*
REST OPERATOR:
- Collects multiple arguments/elements into ONE array/object
- Used on LEFT SIDE of assignment or in function parameters
- Gathers values

SPREAD OPERATOR:
- Expands array/object into individual elements
- Used on RIGHT SIDE of assignment or in function calls
- Distributes values

SYNTAX: Both use ... but context determines their role
- Function definition: (a, ...rest) = REST
- Function call: func(...arr) = SPREAD
- Array/object literal: [...arr] = SPREAD
- Destructuring: [first, ...rest] = REST
*/
