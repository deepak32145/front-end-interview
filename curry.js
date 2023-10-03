//function declaration

function square(num) {
  return num * num;
}

//function expression

const order = function (order) {
  return order;
};

console.log(order("Deepak"));

//what is IIFE

(function square(num) {
  console.log(num * num);
})(5);

//IIFe sample function
(function (x) {
  return (function (y) {
    console.log(x);
  })(2);
})(1);
