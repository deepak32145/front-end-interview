function counter() {
  var _counter = 0;

  function add(increment) {
    _counter += increment;
  }
  function retrieve() {
    return _counter;
  }

  return { add, retrieve };
}

const c = counter();
c.add(10);
c.add(20);
console.log(c.retrieve());
