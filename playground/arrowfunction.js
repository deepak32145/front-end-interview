
const obj = {
  name: 'Alice',
  greet: function () {
    const inner = () => console.log(this.name);
    inner();
  },
  greetRegular: function () {
    function inner() { console.log(this.name); }
    inner();
  }
};

obj.greet();        // ?
obj.greetRegular(); // ?