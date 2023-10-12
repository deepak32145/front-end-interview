const add = (firstNumber, secondNumber) => firstNumber + secondNumber;

console.log(add(3, 4));

function fn() {
  console.log(arguments);
  //this works fine..
}
fn(1, 2, 3);

const fnArrow = () => {
  console.log(arguments);
  //this will throw error
};

var userName = "deepak global";

let user = {
  userName: "deepak choudhary",
  rc1: () => {
    var userName = "dc";
    console.log(this.userName);
  },
  rc2() {
    console.log(this.userName);
  },
};
user.rc1();
user.rc2();
