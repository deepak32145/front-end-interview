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

let userName = "deepak global";

let user = {
  userName: "deepak choudhary",
  rc1: () => {
    console.log(this.userName);
    //refers to global scope
  },
  rc2() {
    console.log(this.userName);
  },
};
user.rc1();
user.rc2();
