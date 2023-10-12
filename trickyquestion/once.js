function once(fun, context) {
  let ran;
  return function () {
    if (fun) {
      ran = fun.apply(context || this, arguments);
      fun = null;
    }
    return ran;
  };
}

const hello = once((a, b) => console.log("hello", a, b));

hello(1, 2);
hello(1, 2);
hello(1, 2);
hello(1, 2);
