function multiply(...nums) {
  // rest operator
  console.log(nums);
}

var arr = [5, 6];

multiply(...arr); //spread operator

const fn = (a , ...nums , x , y) =>{
    console.log(x , y);
}
fn(4 , 5 , 6, 7);
