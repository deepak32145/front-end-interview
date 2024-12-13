let nums = {
  a: 100,
  b: 200,
  title: "my name",
};

multiplyNumeric(nums);

function multiplyNumeric(obj) {
  for (let key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] *= 2;
    }
  }
}
