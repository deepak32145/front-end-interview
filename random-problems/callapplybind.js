var person = {
  name: "john",
  hello: function (data) {
    console.log(this.name + "says hello" + data);
  },
};

person.hello("world");

var newName = {
  name: "dc",
};

person.hello.call(newName, "hello");

person.hello.apply(newName, ["hello"]);

const newHello = person.hello.bind(newName, "hi");

newHello();
