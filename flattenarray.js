let arr = [
  [1, 2],
  [3, 4],
  [5, 6, [7, [8, 9, 10]], 11],
  [12, 13, 14],
];

// [1,2,3,4,5,6,7,8,9,10,11,12,13,14]

let flattenArray = [].concat(...arr);

console.log(flattenArray);

function customFlat(arr, depth = 1) {
  let result = [];
  arr.forEach((arr) => {
    if (Array.isArray(arr) && depth > 0) {
      result.push(...customFlat(arr, depth - 1));
    } else {
      result.push(arr);
    }
  });
  return result;
}
console.log(customFlat(arr, (depth = 3)));

console.log(arr.flat(3));

//00 00 20 17 66
