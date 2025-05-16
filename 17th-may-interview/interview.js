
// 1. What is the output of the following code?

for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100);
}


// order of execution 

// 2. What is the output of the following code?

console.log('A');

setTimeout(() => {
  console.log('B');
}, 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');

// 🔍 Why does C (from the Promise) run before B (from setTimeout)?
// It’s due to task queues in the JavaScript event loop.

// ⚙️ Event Loop Task Queues
// Type	Queue Name	Executes After...
// Synchronous	Main stack	Immediately
// Microtask	Microtask queue	After current sync code
// Macrotask	Macrotask queue	After microtasks


const arr = [10, 2, 5, 1 , 88 , 0];
arr.sort();
console.log(arr);


// 3. What is the output of the following code?

function makeCounter() {
  let count = 0;
  return {
    inc: () => ++count,
    dec: () => --count,
    get: () => count
  };
}

const c1 = makeCounter();
const c2 = makeCounter();

c1.inc();
c1.inc();
c2.inc();

console.log(c1.get(), c2.get());


// execute this code 

function multiply(a) {
  return function(b) {
    return function(c) {
      return a * b * c;
    };
  };
}



{
  name: "John",
  address: {
    city: "Delhi",
    location: {
      lat: 123,
      lng: 456
    }
  }
}

function flattenObject(obj, parentKey = '', result = {}) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Recursive call for nested object
      flattenObject(obj[key], newKey, result);
    } else {
      // Add primitive value to result
      result[newKey] = obj[key];
    }
  }

  return result;
}