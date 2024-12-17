let nums = {
  a: 100,
  b: 200,
  title: "my name",
};

multiplyNumeric(nums);

function multiplyNumeric(nums) {
  // execute this code only if the value is a number
}

function multiplyNumeric(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] *= 2;
    }
  }
}
