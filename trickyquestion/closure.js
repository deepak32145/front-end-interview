function subscribe() {
  var name = "deepak";
  function alert1() {
    console.log(name);
  }
  alert1();
}
subscribe();

function x() {
  var name = "javascript";
  function y() {
    console.log(name);
  }
  return y;
}

var z = x();
z();

var e = 10;
function sum(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        return a + b + c + d + e;
      };
    };
  };
}

console.log(sum(1)(2)(3)(4));

let count = 0;

(function printCount() {
  if (count == 0) {
    let count = 1;
    console.log(count);
  }
  console.log(count);
})();

const arr = [3, 4, 10, 13, 18, 19, 22];

arr.sort((a, b) => a - b);
