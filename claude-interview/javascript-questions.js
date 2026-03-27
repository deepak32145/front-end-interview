/**
 * JAVASCRIPT INTERVIEW QUESTIONS
 * Front-end Interview Series
 */

// ============================================
// QUESTION 1: Closure and Scope
// ============================================
/*
QUESTION:
Write a function that creates a private counter using closures.
The counter should have methods to increment, decrement, and get the current value.
Ensure the counter variable cannot be accessed directly from outside.

EXAMPLE USAGE:
const counter = createCounter(0);
console.log(counter.get());      // 0
console.log(counter.increment()); // 1
console.log(counter.decrement()); // 0
console.log(counter.value);      // undefined (private)
*/

function createCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    get() {
      return count;
    }
  };
}

/*
EVALUATION CRITERIA:
✓ Understanding of closures and private variables
✓ Proper use of encapsulation
✓ Methods return correct values
✓ Demonstrates immutability of count variable
✓ Uses arrow functions or function expressions appropriately
✓ Return object with proper methods
*/


// ============================================
// QUESTION 2: Array Methods and Higher Order Functions
// ============================================
/*
QUESTION:
Implement a flatten function that takes a nested array of any depth
and returns a single flat array. Do NOT use the built-in flat() method.

EXAMPLE USAGE:
flatten([1, [2, 3], [4, [5, 6]], 7]);
// Expected: [1, 2, 3, 4, 5, 6, 7]
*/

function flatten(arr) {
  return arr.reduce((acc, current) => {
    if (Array.isArray(current)) {
      return acc.concat(flatten(current));
    }
    return acc.concat(current);
  }, []);
}

// Alternative using spread operator and recursion
function flattenAlt(arr) {
  return arr.flatMap(item => 
    Array.isArray(item) ? flattenAlt(item) : item
  );
}

/*
EVALUATION CRITERIA:
✓ Handles nested arrays correctly
✓ Recursion is properly implemented
✓ Uses appropriate array methods (reduce, concat, or flatMap)
✓ Handles edge cases (empty array, single item)
✓ Demonstrates understanding of higher-order functions
✓ Code is clean and readable
*/


// ============================================
// QUESTION 3: Event Delegation and DOM Manipulation
// ============================================
/*
QUESTION:
Create a function that sets up event delegation on a parent element.
The function should handle click events for dynamically added child elements.

HTML:
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
<button id="addBtn">Add Item</button>

IMPLEMENT:
- Click handler for list items that logs item text
- Works for dynamically added items
- Clean up functionality
*/

function setupEventDelegation(parentSelector, itemSelector, callback) {
  const parent = document.querySelector(parentSelector);
  
  if (!parent) return;

  const handleClick = (e) => {
    const targetItem = e.target.closest(itemSelector);
    if (targetItem) {
      callback(targetItem);
    }
  };

  parent.addEventListener('click', handleClick);

  // Return cleanup function
  return () => {
    parent.removeEventListener('click', handleClick);
  };
}

// USAGE:
/*
const cleanup = setupEventDelegation('#list', 'li', (item) => {
  console.log('Clicked:', item.textContent);
});

// Add item dynamically
document.getElementById('addBtn').addEventListener('click', () => {
  const newItem = document.createElement('li');
  newItem.textContent = 'New Item';
  document.getElementById('list').appendChild(newItem);
});

// Cleanup when done
cleanup();
*/

/*
EVALUATION CRITERIA:
✓ Understands event delegation vs direct event handlers
✓ Uses closest() or target checking correctly
✓ Handles dynamically added elements
✓ Returns cleanup function for memory management
✓ Proper event listener management
✓ Explains bubbling vs capturing phases
*/


// ============================================
// QUESTION 4: Callback Hell and Async Patterns
// ============================================
/*
QUESTION:
Convert this callback-based function to use Promises,
then convert it to async/await.

Original (Callback):
*/

function fetchDataCallback(callback) {
  setTimeout(() => {
    callback(null, { id: 1, name: 'John' });
  }, 1000);
}

// Promise version:
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'John' });
    }, 1000);
  });
}

// Async/Await version:
async function fetchDataAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'John' });
    }, 1000);
  });
}

// Usage:
async function processData() {
  try {
    const data = await fetchDataAsync();
    console.log('Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/*
EVALUATION CRITERIA:
✓ Converts callback to Promise correctly
✓ Converts Promise to async/await
✓ Proper error handling with try/catch
✓ Understands Promise states (pending, resolved, rejected)
✓ Knows when to use each pattern
✓ Handles errors appropriately
*/


// ============================================
// QUESTION 5: This Keyword and Context Binding
// ============================================
/*
QUESTION:
Explain and demonstrate the different behaviors of 'this' keyword.
Implement methods for call, apply, and bind.
*/

const user = {
  name: 'Alice',
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

// This binding problem:
const greetFunc = user.greet;
console.log(greetFunc()); // undefined

// Solutions:

// 1. Using bind
const boundGreet = user.greet.bind(user);
console.log(boundGreet()); // Hello, I'm Alice

// 2. Using call
function greetWithTitle(title) {
  return `${title} ${this.name}`;
}
console.log(greetWithTitle.call(user, 'Mr.')); // Mr. Alice

// 3. Using apply (similar to call but takes array)
console.log(greetWithTitle.apply(user, ['Dr.'])); // Dr. Alice

// Custom implementation of bind:
function myBind(fn, context) {
  return function(...args) {
    return fn.apply(context, args);
  };
}

/*
EVALUATION CRITERIA:
✓ Understands 'this' context binding
✓ Knows difference between call, apply, bind
✓ Can debug 'this' related issues
✓ Implements custom bind correctly
✓ Knows about arrow functions and 'this'
✓ Practical examples demonstrating understanding
*/


// ============================================
// QUESTION 6: Debounce and Throttle
// ============================================
/*
QUESTION:
Implement debounce and throttle functions.
Explain when to use each and provide real-world examples.
*/

// Debounce: Delay execution until function stops being called
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Throttle: Limit function execution frequency
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Real-world usage:
/*
// Search input - debounce to avoid too many API calls
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
  // Make API call
}, 300);

document.getElementById('search').addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Scroll event - throttle for performance
const throttledScroll = throttle(() => {
  console.log('Processing scroll...');
}, 1000);

window.addEventListener('scroll', throttledScroll);
*/

/*
EVALUATION CRITERIA:
✓ Correct implementation of debounce
✓ Correct implementation of throttle
✓ Understands difference and use cases
✓ Handles 'this' context properly
✓ Manages timer/timeout correctly
✓ Real-world examples (search, scroll, resize)
*/


// ============================================
// QUESTION 7: Prototype and Inheritance
// ============================================
/*
QUESTION:
Explain prototypal inheritance and implement a shape hierarchy:
- Shape (base)
- Circle (extends Shape)
- Rectangle (extends Shape)
*/

// Constructor function (ES5 style)
function Shape(name) {
  this.name = name;
}

Shape.prototype.describe = function() {
  return `This is a ${this.name}`;
};

function Circle(radius) {
  Shape.call(this, 'Circle');
  this.radius = radius;
}

// Set up prototype chain
Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.getArea = function() {
  return Math.PI * this.radius ** 2;
};

function Rectangle(width, height) {
  Shape.call(this, 'Rectangle');
  this.width = width;
  this.height = height;
}

Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function() {
  return this.width * this.height;
};

// ES6 class version (modern):
class ShapeES6 {
  constructor(name) {
    this.name = name;
  }
  describe() {
    return `This is a ${this.name}`;
  }
}

class CircleES6 extends ShapeES6 {
  constructor(radius) {
    super('Circle');
    this.radius = radius;
  }
  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

/*
TEST CODE:
const circle = new Circle(5);
console.log(circle.describe());    // This is a Circle
console.log(circle.getArea());     // 78.54...
console.log(circle instanceof Circle);  // true
console.log(circle instanceof Shape);   // true
*/

/*
EVALUATION CRITERIA:
✓ Understands prototype chain
✓ Implements inheritance correctly
✓ Uses Object.create() appropriately
✓ Calls parent constructor with .call()
✓ Knows ES6 class syntax
✓ Understands super keyword
✓ Proper instanceof checks
*/


// ============================================
// QUESTION 8: Promise.all vs Promise.race
// ============================================
/*
QUESTION:
Explain and implement the differences between Promise.all and Promise.race.
Provide use cases for each.
*/

// Promise.all - waits for all promises to resolve
function fetchMultipleUsers(userIds) {
  const promises = userIds.map(id => fetchUserData(id));
  return Promise.all(promises);
}

function fetchUserData(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: `User ${id}` });
    }, 1000);
  });
}

// Promise.race - returns first completed promise
function fetchWithTimeout(promise, timeout = 5000) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

// Usage:
/*
// Promise.all - all must succeed
Promise.all([fetchUserData(1), fetchUserData(2)])
  .then(users => console.log(users))
  .catch(error => console.log('One failed:', error));

// Promise.race - first to complete wins
fetchWithTimeout(fetchUserData(1), 2000)
  .then(user => console.log(user))
  .catch(error => console.log('Timed out:', error));
*/

/*
EVALUATION CRITERIA:
✓ Understands Promise.all behavior
✓ Knows Promise.race use cases
✓ Handles errors correctly
✓ Real-world timeout implementation
✓ Explains performance implications
✓ Knows about Promise.allSettled (bonus)
*/


// ============================================
// QUESTION 9: Object and Array Destructuring
// ============================================
/*
QUESTION:
Demonstrate advanced destructuring patterns.
*/

// Object destructuring
const person = {
  firstName: 'John',
  lastName: 'Doe',
  address: {
    city: 'New York',
    zip: '10001'
  },
  hobbies: ['reading', 'gaming']
};

// Basic destructuring
const { firstName, lastName } = person;

// Nested destructuring
const { address: { city, zip } } = person;

// Renaming
const { firstName: name } = person;

// Default values
const { middleName = 'N/A' } = person;

// Array destructuring
const [hobby1, hobby2] = person.hobbies;

// Skip elements
const [first, , third] = person.hobbies;

// Rest operator
const { firstName: fn, ...rest } = person;

// In function parameters
function displayPerson({ firstName, lastName, address: { city } }) {
  console.log(`${firstName} ${lastName} from ${city}`);
}

/*
EVALUATION CRITERIA:
✓ Basic object and array destructuring
✓ Nested destructuring patterns
✓ Renaming variables
✓ Default values
✓ Rest operator usage
✓ Clean, readable code
✓ Use in function parameters
*/


// ============================================
// QUESTION 10: Memory Leaks and Performance
// ============================================
/*
QUESTION:
Identify and fix common memory leaked patterns in JavaScript.
*/

// BAD: Memory leak with event listeners
const element = document.getElementById('myElement');
element.addEventListener('click', function myHandler() {
  console.log('Clicked');
});
// Problem: listener not removed when element is deleted

// GOOD: Proper cleanup
const handler = function myHandler() {
  console.log('Clicked');
};
element.addEventListener('click', handler);

// Cleanup function
function cleanupElement(elem) {
  elem.removeEventListener('click', handler);
}

// BAD: Circular reference with closures
let obj = {};
obj.self = obj;
// Will prevent garbage collection

// GOOD: Use WeakMap for object references
const objectRegistry = new WeakMap();

// BAD: Global variables leak memory
function badFunction() {
  globalVar = 'This is global'; // No 'let', 'const', 'var'
}

// GOOD: Use proper scope
function goodFunction() {
  const localVar = 'This is local';
}

/*
EVALUATION CRITERIA:
✓ Identifies memory leak patterns
✓ Knows about reference cycles
✓ Understands garbage collection
✓ Proper listener cleanup
✓ Uses WeakMap/WeakSet appropriately
✓ Awareness of closure memory issues
✓ Practical debugging knowledge
*/


// ============================================
// QUESTION 11: Event Loop and Concurrency
// ============================================
/*
QUESTION:
Explain the JavaScript event loop.
Predict the output order of this code:

console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');

Explain callback queue, microtask queue, and call stack.
*/

// OUTPUT ORDER: 1, 4, 3, 2

// EXPLANATION:
// 1. console.log('1') - Executes immediately (call stack)
// 2. setTimeout - Goes to callback queue (macrotask)
// 3. Promise.then - Goes to microtask queue
// 4. console.log('4') - Executes immediately (call stack)
// 5. Event loop checks microtask queue - runs Promise (3)
// 6. Event loop checks callback queue - runs setTimeout (2)

// Complex example with multiple microtasks
console.log('Start');

setTimeout(() => {
  console.log('setTimeout 1');
  Promise.resolve().then(() => console.log('Promise in setTimeout'));
}, 0);

Promise.resolve()
  .then(() => {
    console.log('Promise 1');
    setTimeout(() => console.log('setTimeout in Promise'), 0);
  })
  .then(() => console.log('Promise 2'));

requestAnimationFrame(() => console.log('RAF'));

console.log('End');

// OUTPUT: Start, End, Promise 1, Promise 2, RAF, setTimeout 1, Promise in setTimeout, setTimeout in Promise

/*
EVALUATION CRITERIA:
✓ Understands call stack basics
✓ Knows microtask vs callback queue
✓ Explains Promise microtasks
✓ setTimeout as macrotask
✓ Proper event loop order
✓ Complex execution predictions
✓ Understanding of async patterns
*/


// ============================================
// QUESTION 12: WeakMap and WeakSet
// ============================================
/*
QUESTION:
Explain WeakMap and WeakSet. Provide use cases where they're better than Map/Set.
*/

// WeakMap - Keys must be objects, automatically garbage collected
const wm = new WeakMap();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

wm.set(obj1, 'value1');
wm.set(obj2, 'value2');

console.log(wm.get(obj1)); // 'value1'
console.log(wm.has(obj2)); // true

// No iteration - wm.keys(), wm.values() don't exist
// When obj1 is deleted, the weak reference is garbage collected

// USE CASE 1: Private data for objects
class User {
  #privateData = new WeakMap();

  setPrivate(obj, data) {
    this.#privateData.set(obj, data);
  }

  getPrivate(obj) {
    return this.#privateData.get(obj);
  }
}

// USE CASE 2: DOM node metadata
const nodeMetadata = new WeakMap();

function attachMetadata(element, metadata) {
  nodeMetadata.set(element, metadata);
}

function getMetadata(element) {
  return nodeMetadata.get(element);
}

// USE CASE 3: Observer pattern without memory leaks
class EventEmitter {
  private observers = new WeakMap();

  subscribe(target, callback) {
    if (!this.observers.has(target)) {
      this.observers.set(target, []);
    }
    this.observers.get(target).push(callback);
  }

  notify(target, event) {
    if (this.observers.has(target)) {
      this.observers.get(target).forEach(cb => cb(event));
    }
  }
}

// WeakSet - Similar to WeakMap but for unique values
const weakSet = new WeakSet();

let user1 = { name: 'John' };
let user2 = { name: 'Jane' };

weakSet.add(user1);
weakSet.add(user2);

console.log(weakSet.has(user1)); // true

// USE CASE: Track visited nodes in tree traversal
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
}

function trackVisited(root) {
  const visited = new WeakSet();

  function traverse(node) {
    if (visited.has(node)) return;
    visited.add(node);
    console.log(node.value);
    node.children.forEach(traverse);
  }

  traverse(root);
}

/*
EVALUATION CRITERIA:
✓ Explains WeakMap vs Map
✓ Explains WeakSet vs Set
✓ Understands garbage collection benefit
✓ Knows WeakMap can only have object keys
✓ No iteration methods on weak structures
✓ Real-world use cases
✓ Private data pattern
✓ Memory efficiency awareness
*/


// ============================================
// QUESTION 13: Proxy and Reflect
// ============================================
/*
QUESTION:
Explain Proxy and Reflect.
Create a proxy that validates object properties and logs access.
*/

// BASIC PROXY - Intercept and validate
const user = {
  name: 'John',
  age: 30
};

const userProxy = new Proxy(user, {
  get(target, prop) {
    console.log(`Getting ${prop}`);
    return target[prop];
  },

  set(target, prop, value) {
    console.log(`Setting ${prop} to ${value}`);
    
    if (prop === 'age' && typeof value !== 'number') {
      throw new TypeError('Age must be a number');
    }
    
    if (prop === 'age' && value < 0) {
      throw new RangeError('Age cannot be negative');
    }

    target[prop] = value;
    return true;
  },

  has(target, prop) {
    console.log(`Checking if ${prop} exists`);
    return prop in target;
  },

  deleteProperty(target, prop) {
    console.log(`Deleting ${prop}`);
    delete target[prop];
    return true;
  }
});

userProxy.name = 'Jane'; // logs: Setting name to Jane
console.log(userProxy.age); // logs: Getting age
// userProxy.age = 'invalid'; // throws TypeError

// VALIDATION PROXY
function createValidatedObject(schema) {
  return new Proxy({}, {
    set(target, prop, value) {
      const validator = schema[prop];
      
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for ${prop}`);
      }

      target[prop] = value;
      return true;
    }
  });
}

const config = createValidatedObject({
  port: value => typeof value === 'number' && value > 0,
  host: value => typeof value === 'string',
  https: value => typeof value === 'boolean'
});

config.port = 3000; // OK
config.host = 'localhost'; // OK
// config.port = -1; // Error: Invalid value for port

// LOGGING PROXY
function createLoggingProxy(obj, logPrefix = '') {
  return new Proxy(obj, {
    get(target, prop) {
      const value = target[prop];
      console.log(`${logPrefix}.${String(prop)} accessed, returned:`, value);
      return value;
    },

    set(target, prop, value) {
      console.log(`${logPrefix}.${String(prop)} set to:`, value);
      target[prop] = value;
      return true;
    }
  });
}

// REFLECT API - Metaprogramming
const handler = {
  get(target, prop, receiver) {
    console.log(`Getting ${prop}`);
    return Reflect.get(target, prop, receiver);
  },

  set(target, prop, value, receiver) {
    console.log(`Setting ${prop} to ${value}`);
    return Reflect.set(target, prop, value, receiver);
  }
};

const reflectProxy = new Proxy(user, handler);

// REFLECT methods parallel Proxy traps
Reflect.get(obj, prop, receiver);
Reflect.set(obj, prop, value, receiver);
Reflect.has(obj, prop);
Reflect.deleteProperty(obj, prop);
Reflect.getOwnPropertyDescriptor(obj, prop);
Reflect.defineProperty(obj, prop, descriptor);

// Practical: Observable objects
function createObservable(obj, onChange) {
  return new Proxy(obj, {
    set(target, prop, value) {
      if (target[prop] !== value) {
        const oldValue = target[prop];
        target[prop] = value;
        onChange({ prop, oldValue, newValue: value });
      }
      return true;
    }
  });
}

const appState = createObservable(
  { count: 0, user: null },
  ({ prop, oldValue, newValue }) => {
    console.log(`State changed: ${prop} from ${oldValue} to ${newValue}`);
    // Trigger UI update
  }
);

appState.count = 5; // logs: State changed: count from 0 to 5

/*
EVALUATION CRITERIA:
✓ Understands Proxy traps (get, set, deleteProperty, has)
✓ Validation in set trap
✓ Proper return values (true for successful operations)
✓ Reflect API usage
✓ Real-world use cases (validation, logging, observable)
✓ Error handling in proxies
✓ Deep proxy vs shallow proxy understanding
*/


// ============================================
// QUESTION 14: Symbol and Iterators
// ============================================
/*
QUESTION:
Explain Symbols and create custom iterables using Symbol.iterator.
*/

// SYMBOLS - Unique identifiers
const sym1 = Symbol('description');
const sym2 = Symbol('description');

console.log(sym1 === sym2); // false - each Symbol is unique

// Symbols as object keys (hidden properties)
const privateId = Symbol('id');
const obj = {
  name: 'John',
  [privateId]: 12345
};

console.log(obj.name); // 'John'
console.log(obj[privateId]); // 12345
console.log(Object.keys(obj)); // ['name'] - symbol keys are hidden

// Well-known Symbols
// Symbol.iterator - Make object iterable
const iterable = {
  data: [1, 2, 3],
  
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

// Now we can use for...of
for (const value of iterable) {
  console.log(value); // 1, 2, 3
}

// CUSTOM RANGE ITERATOR
class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    return {
      next: () => {
        if (current <= this.end) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

const range = new Range(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Spread operator uses Symbol.iterator
const arr = [...range]; // [1, 2, 3, 4, 5]

// OTHER WELL-KNOWN SYMBOLS
// Symbol.toStringTag - Custom toString
class MyClass {
  get [Symbol.toStringTag]() {
    return 'MyClass';
  }
}

console.log(Object.prototype.toString.call(new MyClass())); // [object MyClass]

// Symbol.hasInstance - instanceof behavior
class CustomError {
  static [Symbol.hasInstance](obj) {
    return obj && obj.isCustomError === true;
  }
}

// Symbol.toPrimitive - Type conversion
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.celsius;
    }
    if (hint === 'string') {
      return `${this.celsius}°C`;
    }
    return true; // hint === 'default'
  }
}

const temp = new Temperature(20);
console.log(+temp); // 20 (number)
console.log(`${temp}`); // "20°C" (string)

/*
EVALUATION CRITERIA:
✓ Understands Symbol uniqueness
✓ Symbols as object keys (privacy)
✓ Symbol.iterator implementation
✓ Custom iterable classes
✓ for...of loop usage
✓ Spread operator with iterables
✓ Well-known Symbols usage
✓ Real-world iterator examples
*/


// ============================================
// QUESTION 15: Generator Functions
// ============================================
/*
QUESTION:
Explain generator functions and yield.
Create generators for: pagination, infinite sequences, lazy evaluation.
*/

// BASIC GENERATOR
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// GENERATOR AS ITERATOR
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (const num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// PAGINATION GENERATOR
function* paginate(items, pageSize) {
  for (let i = 0; i < items.length; i += pageSize) {
    yield items.slice(i, i + pageSize);
  }
}

const data = Array.from({ length: 25 }, (_, i) => i + 1);
for (const page of paginate(data, 10)) {
  console.log('Page:', page); // [1..10], [11..20], [21..25]
}

// INFINITE GENERATOR
function* infiniteSequence() {
  let i = 0;
  while (true) {
    yield i++;
  }
}

const infGen = infiniteSequence();
console.log(infGen.next().value); // 0
console.log(infGen.next().value); // 1
console.log(infGen.next().value); // 2

// LAZY EVALUATION - Read file line by line
function* readLines(text) {
  const lines = text.split('\n');
  for (const line of lines) {
    yield line;
  }
}

const fileContent = `Line 1
Line 2
Line 3`;

for (const line of readLines(fileContent)) {
  console.log(line); // Process one line at a time
}

// GENERATOR WITH TWO-WAY COMMUNICATION
function* twoWay() {
  const a = yield 1;
  console.log('Received:', a);
  
  const b = yield 2;
  console.log('Received:', b);
  
  return 'Done';
}

const gen2 = twoWay();
console.log(gen2.next());         // { value: 1, done: false }
console.log(gen2.next('hello'));  // logs "Received: hello"
console.log(gen2.next('world'));  // logs "Received: world"

// GENERATOR DELEGATION with yield*
function* delegated() {
  yield 1;
  yield 2;
}

function* main() {
  yield* delegated();
  yield 3;
}

for (const num of main()) {
  console.log(num); // 1, 2, 3
}

// ASYNC-LIKE WITH GENERATORS
function* asyncSimulation() {
  try {
    const data = yield fetch('/api/data');
    console.log('Got data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

/*
EVALUATION CRITERIA:
✓ Understands yield keyword
✓ next() method and iteration
✓ Generator for lazy evaluation
✓ Infinite sequences
✓ Two-way communication with yield
✓ yield* delegation
✓ Practical pagination/streaming
✓ Knows generator.return() and generator.throw()
*/


// ============================================
// QUESTION 16: Async/Await Advanced Patterns
// ============================================
/*
QUESTION:
Implement advanced async patterns:
1. Concurrent operations with Promise.all()
2. Sequential operations with async/await
3. Handling race conditions
4. Timeout handling
5. Retry with exponential backoff
*/

// CONCURRENT WITH PROMISE.ALL
async function fetchUserData(userId) {
  const [user, posts, comments] = await Promise.all([
    fetch(`/api/users/${userId}`).then(r => r.json()),
    fetch(`/api/posts?userId=${userId}`).then(r => r.json()),
    fetch(`/api/comments?userId=${userId}`).then(r => r.json())
  ]);
  
  return { user, posts, comments };
}

// SEQUENTIAL WITH ASYNC/AWAIT
async function processSequentially() {
  const result1 = await fetchData1();
  const result2 = await fetchData2(result1);
  const result3 = await fetchData3(result2);
  return result3;
}

// TIMEOUT WITH PROMISE.RACE
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    )
  ]);
}

async function fetchWithTimeout(url) {
  const data = await withTimeout(fetch(url).then(r => r.json()), 5000);
  return data;
}

// RETRY WITH EXPONENTIAL BACKOFF
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// HANDLING RACE CONDITIONS
let lastRequestId = 0;

async function searchUsers(query) {
  const requestId = ++lastRequestId;
  
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  
  // Ignore if newer request already started
  if (requestId !== lastRequestId) {
    return null;
  }
  
  return results;
}

// PROMISE.ALL WITH ERROR HANDLING
async function safeParallelOps() {
  const results = await Promise.allSettled([
    operation1(),
    operation2(),
    operation3()
  ]);
  
  const successful = results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
  
  const failed = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);
  
  return { successful, failed };
}

// QUEUE WITH CONCURRENCY LIMIT
class AsyncQueue {
  private queue = [];
  private running = 0;
  private concurrency = 3;

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { fn, resolve, reject } = this.queue.shift();

    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

/*
EVALUATION CRITERIA:
✓ Promise.all for concurrent operations
✓ Sequential async/await chaining
✓ Timeout with Promise.race
✓ Exponential backoff retry logic
✓ Race condition prevention
✓ Promise.allSettled for partial success
✓ Queue/concurrency management
✓ Error handling in async patterns
*/


// ============================================
// QUESTION 17: Currying and Partial Application
// ============================================
/*
QUESTION:
Explain currying and partial application.
Implement: curry, partial, and practical examples.
*/

// CURRYING - Transform function to call with one argument at a time
function curry(fn) {
  const arity = fn.length; // number of parameters
  
  return function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }
    
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

// Example: multiply(a, b, c) => a * b * c
const multiply = (a, b, c) => a * b * c;
const curriedMultiply = curry(multiply);

curriedMultiply(2)(3)(4); // 24
curriedMultiply(2, 3)(4); // 24
curriedMultiply(2)(3, 4); // 24

// PARTIAL APPLICATION - Pre-fill some arguments
function partial(fn, ...prefilledArgs) {
  return (...args) => fn(...prefilledArgs, ...args);
}

const add = (a, b, c) => a + b + c;
const add5 = partial(add, 5);
add5(2, 3); // 10

// PRACTICAL: Configuration functions
const request = curry((method, url, data) => {
  return fetch(url, { method, body: JSON.stringify(data) });
});

const get = request('GET');
const post = request('POST');

const getUsers = get('/api/users');
const createUser = post('/api/users');

// URL currying
const apiRequest = curry((baseUrl, endpoint, method, data) => {
  const url = `${baseUrl}${endpoint}`;
  return fetch(url, { method, body: JSON.stringify(data) });
});

const apiCall = apiRequest('https://api.example.com');
const userApi = apiCall('/users');
const createUserApi = userApi('POST');

// COMPOSE - Combine functions
function compose(...fns) {
  return (value) => fns.reduceRight((acc, fn) => fn(acc), value);
}

const double = x => x * 2;
const addTen = x => x + 10;
const stringify = x => `Result: ${x}`;

const process = compose(stringify, double, addTen);
process(5); // "Result: 30"

// PIPE - Like compose but left-to-right
function pipe(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

const process2 = pipe(addTen, double, stringify);
process2(5); // "Result: 30"

/*
EVALUATION CRITERIA:
✓ Understands currying concept
✓ Implements curry function correctly
✓ Partial application pattern
✓ Function composition
✓ Practical use cases
✓ Combines with other patterns
*/


// ============================================
// QUESTION 18: Memoization and Performance
// ============================================
/*
QUESTION:
Implement memoization for expensive computations.
Cache API responses and computed values.
*/

// BASIC MEMOIZATION
function memoize(fn) {
  const cache = {};
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    if (key in cache) {
      console.log('Cache hit:', args);
      return cache[key];
    }
    
    console.log('Computing:', args);
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveComputation = (n) => {
  console.log('Computing...');
  return Array.from({ length: n }, (_, i) => i).reduce((a, b) => a + b, 0);
};

const memoizedComputation = memoize(expensiveComputation);
memoizedComputation(5); // Computing
memoizedComputation(5); // Cache hit

// MEMOIZATION WITH TIMEOUT
function memoizeWithTTL(fn, ttl = 60000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (now - timestamp < ttl) {
        return value;
      }
      cache.delete(key);
    }
    
    const result = fn(...args);
    cache.set(key, { value: result, timestamp: now });
    return result;
  };
}

// MEMOIZATION FOR RECURSIVE FUNCTIONS
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.time('Fibonacci');
memoizedFib(40);
console.timeEnd('Fibonacci'); // Much faster!

// ASYNC MEMOIZATION
function memoizeAsync(asyncFn) {
  const cache = new Map();
  const pending = new Map();
  
  return async function(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    // Return pending promise if already computing
    if (pending.has(key)) {
      return pending.get(key);
    }
    
    const promise = asyncFn(...args)
      .then(result => {
        cache.set(key, result);
        pending.delete(key);
        return result;
      })
      .catch(error => {
        pending.delete(key);
        throw error;
      });
    
    pending.set(key, promise);
    return promise;
  };
}

const fetchUserMemoized = memoizeAsync(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

/*
EVALUATION CRITERIA:
✓ Basic memoization pattern
✓ Cache key generation
✓ TTL/expiration handling
✓ Async memoization with pending requests
✓ Memory management (WeakMap for objects)
✓ Real-world optimization
✓ Trade-offs (memory vs speed)
*/


// ============================================
// QUESTION 19: Regular Expressions Advanced
// ============================================
/*
QUESTION:
Advanced regex patterns for:
1. Email validation
2. URL parsing
3. Password strength
4. HTML tag extraction
5. Custom tokenizer
*/

// EMAIL VALIDATION
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test('test@example.com')); // true

// STRONGER EMAIL VALIDATION
const strongEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// URL PARSING
const urlRegex = /^https?:\/\/([^\/?#]+)([^?#]*)(\?[^#]*)?(#.*)?$/;
const url = 'https://example.com:8080/path/to/page?key=value#section';
const match = url.match(urlRegex);

// PASSWORD STRENGTH CHECK
function checkPasswordStrength(pwd) {
  const checks = {
    hasUppercase: /[A-Z]/.test(pwd),
    hasLowercase: /[a-z]/.test(pwd),
    hasNumbers: /\d/.test(pwd),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    isLongEnough: pwd.length >= 8
  };
  
  const strength = Object.values(checks).filter(Boolean).length;
  return { checks, strength };
}

// HTML TAG EXTRACTION
const htmlContent = '<div class="container"><p>Hello</p></div>';
const tagRegex = /<([^/>]+)(\/?)>/g;

let tag;
while ((tag = tagRegex.exec(htmlContent)) !== null) {
  console.log('Tag:', tag[1]); // div, p, /div
}

// CUSTOM TOKENIZER
function tokenize(input) {
  const tokenPatterns = [
    ['NUMBER', /^\d+/],
    ['STRING', /^"[^"]*"/],
    ['OPERATOR', /^[+\-*/=]/],
    ['PAREN', /^[()]/],
    ['WHITESPACE', /^\s+/],
    ['IDENTIFIER', /^[a-zA-Z_]\w*/]
  ];
  
  const tokens = [];
  let position = 0;
  
  while (position < input.length) {
    let matched = false;
    
    for (const [type, pattern] of tokenPatterns) {
      const match = input.slice(position).match(pattern);
      
      if (match) {
        if (type !== 'WHITESPACE') {
          tokens.push({ type, value: match[0] });
        }
        position += match[0].length;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      throw new Error(`Unexpected character at ${position}: ${input[position]}`);
    }
  }
  
  return tokens;
}

const tokens = tokenize('x = 42 + "hello"');
console.log(tokens);
// [{ type: 'IDENTIFIER', value: 'x' },
//  { type: 'OPERATOR', value: '=' },
//  { type: 'NUMBER', value: '42' }, ...]

/*
EVALUATION CRITERIA:
✓ Email/URL regex patterns
✓ Character classes and quantifiers
✓ Grouping and capturing
✓ exec() and match() methods
✓ replace() with regex
✓ test() for validation
✓ Complex patterns
✓ Real-world tokenization
*/


// ============================================
// QUESTION 20: Module Systems and Bundling
// ============================================
/*
QUESTION:
Explain ES6 modules, CommonJS, and module loading.
Discuss tree-shaking and code splitting.
*/

// ES6 MODULES - EXPORT
// export.js
export const constant = 'value';

export function namedFunction() {
  return 'hello';
}

export class MyClass {
  method() {}
}

export default function defaultExport() {
  return 'default';
}

// ES6 MODULES - IMPORT
// import.js
import defaultExport, { constant, namedFunction, MyClass } from './export.js';
import * as all from './export.js';

// DYNAMIC IMPORT
async function loadModule() {
  const module = await import('./module.js');
  return module.defaultExport();
}

// CommonJS - Node.js
// module.js
module.exports = {
  constant: 'value',
  namedFunction() {
    return 'hello';
  }
};

// Requiring
const { constant, namedFunction } = require('./module');

// TREE-SHAKING - Remove unused code
// utils.js
export function used() {}
export function unused() {} // This will be removed by bundler

// main.js
import { used } from './utils.js';
used(); // only 'used' is bundled, 'unused' is tree-shaken

// CODE SPLITTING - Dynamic imports
const button = document.getElementById('load-module');
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.init();
}); // Module only loaded on demand

// NAMED VS DEFAULT EXPORTS
// file1.js
export const utils = {};
export default function main() {}

// file2.js  
import main, { utils } from './file1.js'; // OK
import defaultExport, * as all from './file1.js'; // OK
import * as all from './file1.js'; // all.default is the function

/*
EVALUATION CRITERIA:
✓ ES6 module syntax
✓ Named and default exports
✓ Import patterns
✓ Dynamic imports
✓ CommonJS understanding
✓ Tree-shaking concepts
✓ Code splitting benefits
✓ Module bundler knowledge
*/


// ============================================
// QUESTION 21: ArrayBuffer and TypedArrays
// ============================================
/*
QUESTION:
Explain TypedArrays, ArrayBuffer, and DataView.
Use cases: binary file handling, WebGL, audio processing.
*/

// ARRAYBUFFER - Fixed-length raw binary buffer
const buffer = new ArrayBuffer(16); // 16 bytes of zeros
console.log(buffer.byteLength); // 16

// TYPED ARRAYS - Interpret buffer as specific type
const int32Array = new Int32Array(buffer);
const uint8Array = new Uint8Array(buffer);

int32Array[0] = 255;
console.log(uint8Array[0]); // 255
console.log(uint8Array[1]); // 0

// CREATING TYPED ARRAYS
const arr1 = new Uint8Array(8); // 8 zero bytes
const arr2 = new Uint8Array([1, 2, 3, 4]); // From array
const arr3 = new Uint8Array(arrayBuffer, offset, length); // From buffer

// DATAVIEW - Access buffer with different types
const buffer2 = new ArrayBuffer(4);
const view = new DataView(buffer2);

view.setUint8(0, 255);
view.setUint16(2, 1000);

console.log(view.getUint8(0)); // 255
console.log(view.getUint16(2)); // 1000

// USE CASE: Image processing
function grayscale(imageData) {
  const data = imageData.data; // Uint8ClampedArray
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    const gray = (r + g + b) / 3;
    
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  
  return imageData;
}

// USE CASE: Binary file parsing
function parseWAVHeader(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  
  const riffHeader = String.fromCharCode(
    view.getUint8(0),
    view.getUint8(1),
    view.getUint8(2),
    view.getUint8(3)
  );
  
  const audioFormat = view.getUint16(20, true);
  const sampleRate = view.getUint32(24, true);
  const bitDepth = view.getUint16(34, true);
  
  return { riffHeader, audioFormat, sampleRate, bitDepth };
}

// USE CASE: Network protocol
function encodeMessage(type, payload) {
  const buffer = new ArrayBuffer(1 + payload.length);
  const view = new Uint8Array(buffer);
  
  view[0] = type;
  view.set(payload, 1);
  
  return buffer;
}

function decodeMessage(buffer) {
  const view = new Uint8Array(buffer);
  const type = view[0];
  const payload = view.slice(1);
  
  return { type, payload };
}

/*
EVALUATION CRITERIA:
✓ Understands ArrayBuffer concept
✓ Uses TypedArrays correctly
✓ DataView for mixed-type access
✓ Endianness awareness
✓ Memory alignment
✓ Real-world use cases
✓ Binary file handling
*/


// ============================================
// QUESTION 22: BigInt for Large Numbers
// ============================================
/*
QUESTION:
Explain BigInt for numbers beyond Number.MAX_SAFE_INTEGER.
Practical use cases and limitations.
*/

// Regular numbers limited to 53-bit precision
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(9007199254740992 === 9007199254740993); // true (precision lost)

// BigInt - arbitrary precision
const big1 = 9007199254740991n;
const big2 = big1 + 1n;
const big3 = big2 + 1n;

console.log(big2 === big3); // false

// Creating BigInt
const a = BigInt(123);
const b = BigInt('123456789012345678901234567890');
const c = 100n; // Literal

// ARITHMETIC OPERATIONS
const sum = 10n + 20n; // 30n
const diff = 30n - 10n; // 20n
const prod = 5n * 6n; // 30n
const quot = 30n / 5n; // 6n

// Cannot mix BigInt and Number
// 10n + 10 // TypeError

// MODULO AND EXPONENTIATION
console.log(10n % 3n); // 1n
console.log(2n ** 3n); // 8n

// COMPARISONS
console.log(10n < 20n); // true
console.log(10n == 10); // true (loose equality)
console.log(10n === 10); // false (strict equality)

// JSON SERIALIZATION
class BigIntJSON {
  constructor(value) {
    this.value = value;
  }
  
  toJSON() {
    return {
      type: 'BigInt',
      value: this.value.toString()
    };
  }
  
  static fromJSON(obj) {
    return new BigIntJSON(BigInt(obj.value));
  }
}

// Cryptography use case
function generatePrime(bits) {
  let prime;
  do {
    prime = BigInt(Math.random() * Number.MAX_SAFE_INTEGER);
    prime = (prime << BigInt(bits - 53)) | 1n; // Set high bits
  } while (!isPrime(prime));
  
  return prime;
}

function isPrime(n) {
  if (n <= 1n) return false;
  if (n <= 3n) return true;
  if (n % 2n === 0n) return false;
  
  for (let i = 3n; i * i <= n; i += 2n) {
    if (n % i === 0n) return false;
  }
  return true;
}

/*
EVALUATION CRITERIA:
✓ Knows MAX_SAFE_INTEGER limit
✓ BigInt literal syntax
✓ Arithmetic operations
✓ Type mixing issues
✓ Comparison operators
✓ JSON serialization workarounds
✓ Cryptography use cases
*/


// ============================================
// QUESTION 23: Intl API for Internationalization
// ============================================
/*
QUESTION:
Use Intl API for date, number, and string formatting.
Implement locale-aware applications.
*/

// NUMBER FORMATTING
const numberFormatter = new Intl.NumberFormat('en-US');
console.log(numberFormatter.format(1234567.89)); // 1,234,567.89

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});
console.log(currencyFormatter.format(100)); // $100.00

// PERCENTAGE FORMATTING
const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2
});
console.log(percentFormatter.format(0.25)); // 25.00%

// DATE FORMATTING
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});
console.log(dateFormatter.format(new Date())); // March 27, 2026

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
});

// COLLATION - String comparison
const collator = new Intl.Collator('en', { numeric: true });
const names = ['file10.txt', 'file2.txt', 'file1.txt'];
names.sort(collator.compare);
console.log(names); // file1.txt, file2.txt, file10.txt

// PLURAL RULES
const pluralRules = new Intl.PluralRules('en-US');
const items = 0;
const pluralForm = pluralRules.select(items);
console.log(`You have ${items} ${pluralForm === 'one' ? 'item' : 'items'}`);

// RELATIVE TIME FORMATTING
const rtf = new Intl.RelativeTimeFormat('en-US');
console.log(rtf.format(-1, 'day')); // 1 day ago
console.log(rtf.format(2, 'month')); // in 2 months

// LOCALE-AWARE APPLICATION
class I18n {
  constructor(locale = 'en-US') {
    this.locale = locale;
    this.numberFormatter = new Intl.NumberFormat(locale);
    this.dateFormatter = new Intl.DateTimeFormat(locale);
  }
  
  formatNumber(num) {
    return this.numberFormatter.format(num);
  }
  
  formatDate(date) {
    return this.dateFormatter.format(date);
  }
  
  formatCurrency(amount, currency) {
    const formatter = new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency
    });
    return formatter.format(amount);
  }
}

const i18n = new I18n('de-DE');
console.log(i18n.formatNumber(1234.56)); // 1.234,56
console.log(i18n.formatCurrency(100, 'EUR')); // 100,00 €

/*
EVALUATION CRITERIA:
✓ Intl.NumberFormat usage
✓ Currency and percentage formatting
✓ Intl.DateTimeFormat usage
✓ Collation for sorting
✓ PluralRules handling
✓ RelativeTimeFormat
✓ Locale-aware applications
✓ Options and format options
*/


// ============================================
// QUESTION 24: Template Literals and Tagged Templates
// ============================================
/*
QUESTION:
Advanced template literal usage including tagged templates.
Create: HTML sanitizer, query builder, multi-language templates.
*/

// BASIC TEMPLATE LITERALS
const name = 'John';
const age = 30;
const message = `Hello, ${name}! You are ${age} years old.`;

// MULTI-LINE STRINGS
const html = `
  <div>
    <p>Hello</p>
  </div>
`;

// TAGGED TEMPLATES - Custom string processing
function highlight(strings, ...values) {
  let result = '';
  
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += `<mark>${values[i]}</mark>`;
    }
  }
  
  return result;
}

const keyword = 'important';
const highlighted = highlight`This is ${keyword} text`;
// "This is <mark>important</mark> text"

// HTML SANITIZATION
function html(strings, ...values) {
  let result = '';
  
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      // Escape HTML entities
      result += String(values[i])
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  }
  
  return result;
}

const userInput = '<script>alert("XSS")</script>';
const safe = html`<div>${userInput}</div>`;
// <div>&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</div>

// SQL QUERY BUILDER
function sql(strings, ...values) {
  let query = '';
  const params = [];
  
  for (let i = 0; i < strings.length; i++) {
    query += strings[i];
    if (i < values.length) {
      query += '?';
      params.push(values[i]);
    }
  }
  
  return { query, params };
}

const userId = 123;
const { query, params } = sql`SELECT * FROM users WHERE id = ${userId}`;
// query: "SELECT * FROM users WHERE id = ?"
// params: [123]

// LOCALIZATION TEMPLATE
const translations = {
  en: { greeting: 'Hello', goodbye: 'Goodbye' },
  es: { greeting: 'Hola', goodbye: 'Adiós' }
};

function i18n(locale) {
  return (strings, ...values) => {
    return strings.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? translations[locale][values[i]] || values[i] : '');
    }, '');
  };
}

const greeting = i18n('es')`The word for hello is ${'greeting'}`;

/*
EVALUATION CRITERIA:
✓ Template literal syntax
✓ Expression interpolation
✓ Tagged template functions
✓ String and value parameters
✓ HTML sanitization
✓ SQL query building
✓ Localization patterns
✓ Security considerations
*/


// ============================================
// QUESTION 25: Comprehensive Real-World Scenarios
// ============================================
/*
QUESTION:
Solve a complex real-world scenario combining multiple concepts:
1. API client with caching, retries, and concurrent requests
2. Form validation with custom rules
3. Data transformation pipeline
4. Error recovery and logging
*/

// COMPREHENSIVE API CLIENT
class APIClient {
  private cache = new Map();
  private pending = new Map();
  private requestQueue = [];
  private concurrency = 3;
  private activeRequests = 0;

  async request(url, options = {}) {
    const cacheKey = `${options.method || 'GET'}:${url}`;
    
    // Return cached response
    if (options.cache && this.cache.has(cacheKey)) {
      const { data, timestamp } = this.cache.get(cacheKey);
      if (Date.now() - timestamp < (options.cacheTTL || 60000)) {
        return data;
      }
    }
    
    // Return pending request
    if (this.pending.has(cacheKey)) {
      return this.pending.get(cacheKey);
    }
    
    // Queue request if at concurrency limit
    const promise = new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const data = await this._fetch(url, options);
          if (options.cache) {
            this.cache.set(cacheKey, { data, timestamp: Date.now() });
          }
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
      this._processQueue();
    });
    
    this.pending.set(cacheKey, promise);
    promise.finally(() => this.pending.delete(cacheKey));
    
    return promise;
  }

  private async _processQueue() {
    while (this.activeRequests < this.concurrency && this.requestQueue.length > 0) {
      this.activeRequests++;
      const request = this.requestQueue.shift();
      await request();
      this.activeRequests--;
    }
  }

  private async _fetch(url, options) {
    let lastError;
    const maxRetries = options.retries || 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), options.timeout || 5000)
          )
        ]);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        return response.json();
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(r => setTimeout(r, delay));
        }
      }
    }
    
    throw lastError;
  }
}

// FORM VALIDATION ENGINE
class FormValidator {
  private rules = new Map();
  private errors = {};

  addRule(field, validator) {
    if (!this.rules.has(field)) {
      this.rules.set(field, []);
    }
    this.rules.get(field).push(validator);
  }

  validate(data) {
    this.errors = {};
    
    for (const [field, validators] of this.rules.entries()) {
      const value = data[field];
      
      for (const validator of validators) {
        const error = validator(value);
        if (error) {
          if (!this.errors[field]) {
            this.errors[field] = [];
          }
          this.errors[field].push(error);
        }
      }
    }
    
    return Object.keys(this.errors).length === 0;
  }

  getErrors() {
    return this.errors;
  }
}

// DATA TRANSFORMATION PIPELINE
class DataPipeline {
  private steps = [];

  addStep(fn) {
    this.steps.push(fn);
    return this;
  }

  async execute(data) {
    let result = data;
    
    for (const step of this.steps) {
      try {
        result = await Promise.resolve(step(result));
      } catch (error) {
        console.error('Pipeline error:', error);
        throw new Error(`Pipeline failed at step: ${error.message}`);
      }
    }
    
    return result;
  }
}

// USAGE EXAMPLE
const api = new APIClient();
const validator = new FormValidator();

validator.addRule('email', (value) => 
  !value ? 'Email is required' : null
);
validator.addRule('email', (value) => 
  !/@/.test(value) ? 'Invalid email' : null
);
validator.addRule('password', (value) =>
  value && value.length < 8 ? 'Must be 8+ characters' : null
);

const pipeline = new DataPipeline()
  .addStep(data => ({ ...data, timestamp: Date.now() }))
  .addStep(async data => {
    const response = await api.request('/api/transform', { 
      method: 'POST',
      body: JSON.stringify(data),
      cache: true,
      retries: 3
    });
    return response;
  })
  .addStep(data => ({ ...data, processed: true }));

/*
EVALUATION CRITERIA:
✓ Combines multiple concepts effectively
✓ Proper error handling and recovery
✓ Performance optimization (caching, concurrency)
✓ Validation patterns
✓ Async pipeline execution
✓ Real-world applicable
✓ Clean API design
✓ Proper state management
*/
