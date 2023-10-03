functionName();
console.log(x);

function functionName() {
  console.log("developer");
}
var x = 10;

//tricy question for hoisting
var y = 21;

var fun = function () {
  console.log(y);
  var y = 20;
};

fun();
