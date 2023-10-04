function createBase(num) {
  return function (innerNum) {
    return innerNum + num;
  };
}

var addSix = createBase(6);
console.log(addSix(10)); // 16

function find(index) {
  let a = [];
  for (let i = 0; i < 1000000; i++) {
    a[i] = i * i;
  }
  return a[index];
}
console.time("6");
find(6);

console.timeEnd("6");

console.time("50");

find(50);
console.timeEnd("50");
