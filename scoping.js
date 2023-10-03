var num1 = 20,
  num2 = 3,
  name = "Developer";

function getScore() {
  var num1 = 2,
    num2 = 3;
  function add() {
    return name + " scored " + (num1 + num2);
  }
  return add();
}
console.log(getScore());

for (let i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
