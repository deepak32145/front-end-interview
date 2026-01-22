/*
 ****** First problem *****
 */

// {
//   let a = 5;
//   let b = 10;
// }

// console.log(a);
// console.log(b);

/*
 ****** second problem *****
 */

// function test() {
//   var a = "hello";
//   let b = "go";

//   if (true) {
//     let a = "Hi";
//     var b = "don't go";
//     console.log(a);
//     console.log(b);
//   }
//   console.log(a);
//   console.log(b);
// }

// test();

/*
 ****** Third problem *****
 */

for (var i = 0; i < 5; i++) {
  function inner(i) {
    setTimeout(() => {
      console.log(i);
    }, i * 1000);
  }
  inner(i);
}

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}

// for (let i = 0; i < 5; i++) {
//   setTimeout(function () {
//     console.log(i);
//   }, i * 1000);
// }

/*
 ****** fourth problem *****
 */

const a = { firstName: "john", lastName: "cena" };
const b = { firstName: "john", lastName: "cena" };

console.log(a == b);

console.log(a === b);

/*
 ****** fifth problem *****
 */

const arr = [32, 45, 2, 1, 77, 11, 9, 12];

// Sorting using REDUCE (most practical)
const sortedWithReduce = arr.reduce((acc, num) => {
  const index = acc.findIndex(item => item > num);
  if (index === -1) {
    acc.push(num);
  } else {
    acc.splice(index, 0, num);
  }
  return acc;
}, []);

console.log("Sorted with reduce:", sortedWithReduce);

// Sorting using MAP + SORT (alternative approach)
const sortedWithMap = arr.map(x => x).sort((a, b) => a - b);
console.log("Sorted with map:", sortedWithMap);

// Sorting using FILTER (by building array with multiple filter calls - less practical)
const max = Math.max(...arr);
const sortedWithFilter = [];
for (let i = 0; i <= max; i++) {
  const filtered = arr.filter(num => num === i);
  sortedWithFilter.push(...filtered);
}
console.log("Sorted with filter:", sortedWithFilter);

// console.log(arr.map((data) => data * 2));
