function createBase(num) {
  return function (innerNum) {
    return innerNum + num;
  };
}

var addSix = createBase(6);
console.log(addSix(10)); // 16
