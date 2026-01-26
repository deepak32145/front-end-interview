const a = { firstName: "john", lastName: "cena" };
const b = { firstName: "john", lastName: "cena" };

console.log(a == b);

console.log(a === b);

/////

for (var i = 0; i < 5; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000);
}
/////

const original = { name: "John", address: { city: "NYC" } };
const newObj = Object.assign({}, original);

newObj.name = "Jane"; 
newObj.address.city = "LA"; 

console.log(original); 


////
console.log("a");
setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve(() => console.log("pro")).then((res) => res());

console.log("b");




/////    


const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 5000);
});

async function getData() {
  const result = await p;
  console.log(result);
}
getData();

p.then((res) => console.log(res));



/////



var e = 10;
function sum(a) {
  return function (b) {
    return function (c) {
      return function (d) {
        return a + b + c + d + e;
      };
    };
  };
}

//////


function showText(text, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, time);
  });
}


////////
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



