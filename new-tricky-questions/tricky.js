const func = (function (a) {
  delete a;
  return a;
})(5);

console.log(func);
