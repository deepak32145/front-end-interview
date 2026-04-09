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


// ============================================
// QUESTION 26: WeakRef and FinalizationRegistry
// ============================================
/*
QUESTION:
What do WeakRef and FinalizationRegistry do?
Build a cache that holds weak references and runs cleanup callbacks
when entries are garbage-collected.

TRICKY PART: When is a WeakRef's deref() return value undefined,
and what guarantees (or doesn't) JS give you about timing?
*/

class WeakCache {
  #registry = new FinalizationRegistry((key) => {
    // Called AFTER the held value is GC'd — NOT guaranteed to run
    // immediately or even at all during program lifetime
    this.#map.delete(key);
    console.log(`Cache entry "${key}" was garbage-collected`);
  });

  #map = new Map(); // key -> WeakRef<value>

  set(key, value) {
    // Register cleanup BEFORE storing so the token (key) outlives value
    this.#registry.register(value, key, value);
    this.#map.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.#map.get(key);
    if (!ref) return undefined;
    const value = ref.deref(); // undefined if already GC'd
    if (value === undefined) {
      this.#map.delete(key); // proactive cleanup
    }
    return value;
  }

  get size() {
    return this.#map.size; // may be stale — GC is non-deterministic
  }
}

/*
EVALUATION CRITERIA:
✓ Knows WeakRef doesn't prevent GC (unlike Map / WeakMap)
✓ Understands deref() can return undefined at any point after creation
✓ FinalizationRegistry callback timing is non-deterministic
✓ Passes unregister token to allow manual unregistration
✓ Avoids using WeakRef for security or correctness guarantees
✓ Understands this differs from WeakMap (which can't be iterated)
*/


// ============================================
// QUESTION 27: Private Class Fields and Static Blocks
// ============================================
/*
QUESTION:
What is the difference between a TypeScript private modifier and a
JS private field (#)? Implement a class using private fields, static
private fields, private methods, and a static initialisation block.

TRICKY PART: Can a subclass access a parent's # field?
*/

class IdGenerator {
  static #counter;   // private static field

  // Static block runs once when the class is evaluated,
  // before any instance is created — ideal for async-free setup
  static {
    IdGenerator.#counter = Number(localStorage?.getItem('id') ?? 0);
  }

  #id; // private instance field — truly private, not on prototype

  constructor(prefix = '') {
    this.#id = `${prefix}${++IdGenerator.#counter}`;
  }

  getId() {
    return this.#id;
  }

  // Private method — cannot be overridden or called externally
  #validate() {
    return this.#id.length > 0;
  }

  toString() {
    return this.#validate() ? this.#id : '(invalid)';
  }
}

// class Child extends IdGenerator {
//   test() { return this.#id; } // SyntaxError — # fields are NOT inherited
// }

/*
EVALUATION CRITERIA:
✓ # fields live on the instance, not the prototype → no prototype pollution
✓ Subclasses CANNOT access parent # fields — hard error at parse time
✓ TypeScript `private` is erased at runtime — accessible via (obj as any).x
✓ Static blocks execute once at class evaluation, top-to-bottom
✓ Can use static blocks for logic that needs access to private statics
✓ Private methods can't be extracted and called independently
*/


// ============================================
// QUESTION 28: Async Generators and for-await-of
// ============================================
/*
QUESTION:
Implement a paginated API fetcher using an async generator so callers
can consume pages lazily with for-await-of, with support for early
termination (break).

TRICKY PART: What happens to the generator when the caller breaks early?
*/

async function* paginatedFetch(url, pageSize = 20) {
  let cursor = null;
  let page = 0;

  try {
    while (true) {
      const endpoint = cursor
        ? `${url}?cursor=${cursor}&limit=${pageSize}`
        : `${url}?limit=${pageSize}`;

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const { items, nextCursor } = await res.json();
      yield items; // pause here — caller controls when to ask for next page

      if (!nextCursor) break;
      cursor = nextCursor;
      page++;
    }
  } finally {
    // finally runs whether the loop completes normally OR the caller breaks
    console.log(`Fetched ${page + 1} pages total`);
  }
}

// Consumer
async function loadFirst100(url) {
  const results = [];
  for await (const page of paginatedFetch(url)) {
    results.push(...page);
    if (results.length >= 100) break; // triggers generator.return() internally
  }
  return results;
}

/*
EVALUATION CRITERIA:
✓ Async generator syntax: async function*
✓ yield suspends until consumer calls next()
✓ for-await-of calls generator.return() on break → triggers finally
✓ try/finally guarantees cleanup even on early termination
✓ Lazy evaluation — only fetches next page when needed
✓ Handles cursor-based pagination correctly
*/


// ============================================
// QUESTION 29: AbortController and Fetch Cancellation
// ============================================
/*
QUESTION:
Build a fetchWithTimeout utility that cancels a fetch after N ms.
Then extend it to support caller-provided AbortSignals (so the caller
can cancel independently).

TRICKY PART: How do you compose two AbortSignals (timeout + external)?
*/

function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
  const { signal: callerSignal, ...rest } = options;

  // AbortSignal.any() (ES2024) combines signals — aborts when ANY fires
  // Polyfill for older environments: use AbortController + event listener
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(
    () => timeoutController.abort(new DOMException('Timeout', 'TimeoutError')),
    timeoutMs
  );

  const signals = [timeoutController.signal];
  if (callerSignal) signals.push(callerSignal);

  // AbortSignal.any is the cleanest composition mechanism
  const combinedSignal = AbortSignal.any
    ? AbortSignal.any(signals)
    : timeoutController.signal; // fallback

  return fetch(url, { ...rest, signal: combinedSignal }).finally(() =>
    clearTimeout(timeoutId)
  );
}

// Usage
const controller = new AbortController();
fetchWithTimeout('/api/data', { signal: controller.signal }, 3000)
  .then(r => r.json())
  .catch(err => {
    if (err.name === 'AbortError') console.log('Cancelled or timed out');
    else throw err;
  });

/*
EVALUATION CRITERIA:
✓ AbortController/AbortSignal are the standard cancellation primitive
✓ clearTimeout in finally to avoid timer leaks
✓ Composing signals with AbortSignal.any (or manual listener approach)
✓ Distinguishes TimeoutError vs user-initiated AbortError
✓ signal passed to fetch is how the browser cancels in-flight XHR
✓ Works with any fetch-based library (not fetch-specific)
*/


// ============================================
// QUESTION 30: Structured Clone vs JSON Serialisation
// ============================================
/*
QUESTION:
What does structuredClone() support that JSON.parse(JSON.stringify())
does NOT? Identify the output of the following:

const a = { d: new Date(), m: new Map([[1,2]]), r: /abc/g };
const b = JSON.parse(JSON.stringify(a));
const c = structuredClone(a);

console.log(typeof b.d, b.m, b.r);
console.log(c.d instanceof Date, c.m instanceof Map, c.r instanceof RegExp);
*/

// ANSWER — output:
// "string"   {}   {}     ← JSON loses Date (→ string), Map (→ {}), RegExp (→ {})
// true  true  true       ← structuredClone preserves all three

// What structuredClone supports that JSON does NOT:
//   Date, Map, Set, RegExp, ArrayBuffer, TypedArrays, Blob (some envs),
//   circular references, Error objects (limited), undefined values

// What structuredClone CANNOT clone:
//   Functions, DOM nodes, class instances with prototype methods,
//   WeakMap/WeakSet, Symbol-keyed properties

function deepClone(value) {
  // Best-practice deep clone that falls back gracefully
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  // Fallback — loses special types
  return JSON.parse(JSON.stringify(value));
}

// Circular reference — JSON throws, structuredClone handles it
const obj = { a: 1 };
obj.self = obj;
const cloned = structuredClone(obj); // works
// JSON.stringify(obj); // TypeError: cyclic object value

/*
EVALUATION CRITERIA:
✓ Knows JSON limitations: Date→string, Map/Set→{}, undefined removed
✓ structuredClone handles cycles, typed arrays, Maps, Sets, Dates, RegExp
✓ structuredClone cannot clone functions — they are not "structured data"
✓ Class prototype methods are lost — only own enumerable data is cloned
✓ Knows structuredClone is synchronous and throws on non-cloneable input
*/


// ============================================
// QUESTION 31: Logical Assignment Operators
// ============================================
/*
QUESTION:
Predict the output. Explain the short-circuit difference between
||=, &&=, and ??=. When does each NOT perform the assignment?
*/

{
  let a = 0, b = 1, c = null, d = undefined, e = false;

  a ||= 99;   // a is falsy  → assigns  → a = 99
  b ||= 99;   // b is truthy → skips    → b = 1
  c ??= 42;   // c is null   → assigns  → c = 42
  d ??= 42;   // d is undefined → assigns → d = 42
  e ??= 42;   // e is false (not null/undefined) → skips → e = false
  b &&= 100;  // b is truthy → assigns  → b = 100
  a &&= 0;    // a is truthy (99) → assigns → a = 0 (re-assigns to falsy!)

  console.log(a, b, c, d, e); // 0  100  42  42  false
}

// KEY TRICKY PART: &&= assigns the RHS even if RHS is falsy
// The guard is "is LHS truthy?" not "is RHS truthy?"

// Practical use: default config with ??=
function initConfig(config = {}) {
  config.timeout ??= 5000;
  config.retries ??= 3;
  config.debug ??= false; // false is a valid value — ??= respects that
  return config;
}

/*
EVALUATION CRITERIA:
✓ ||= short-circuits on truthy LHS (like || itself)
✓ &&= short-circuits on falsy LHS
✓ ??= short-circuits on non-nullish LHS (0, false, '' are NOT nullish)
✓ Assignment only happens when the logical check would pass
✓ Practical: ??= is safer than ||= for defaults (doesn't clobber 0/''/false)
*/


// ============================================
// QUESTION 32: Promise.any and AggregateError
// ============================================
/*
QUESTION:
Explain Promise.any vs Promise.race vs Promise.allSettled vs Promise.all.
Write a "first healthy endpoint" function that tries 3 CDN URLs and
returns the first successful response, but throws if ALL fail.
*/

async function fetchFromFastest(urls) {
  // Promise.any — resolves with FIRST fulfilled, rejects only if ALL reject
  // Promise.race — settles with FIRST settled (fulfilled OR rejected)
  return Promise.any(
    urls.map(url =>
      fetch(url).then(res => {
        if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
        return res;
      })
    )
  ).catch(err => {
    // AggregateError.errors is an array of each individual rejection reason
    if (err instanceof AggregateError) {
      console.error('All CDNs failed:', err.errors);
    }
    throw err;
  });
}

/*
Comparison table:
┌───────────────────┬────────────────────────────────────────────────────┐
│ Promise.all       │ Rejects immediately on FIRST rejection              │
│ Promise.allSettled│ Always resolves with array of {status,value/reason} │
│ Promise.race      │ Settles (resolve OR reject) with FIRST settled      │
│ Promise.any       │ Resolves with FIRST fulfillment; AggregateError if  │
│                   │ ALL reject                                           │
└───────────────────┴────────────────────────────────────────────────────┘

EVALUATION CRITERIA:
✓ Promise.any ignores rejections until all have rejected
✓ AggregateError.errors preserves every rejection in order
✓ Promise.race rejects fast if fastest promise rejects — often a footgun
✓ Promise.allSettled never rejects — use when you need all outcomes
✓ Knows the order of resolution in Promise.any is not guaranteed
*/


// ============================================
// QUESTION 33: The Microtask Queue — Deep Dive
// ============================================
/*
QUESTION:
Predict the exact console output order:
*/

console.log('1');

setTimeout(() => console.log('2'), 0);  // macrotask

Promise.resolve()
  .then(() => console.log('3'))         // microtask 1
  .then(() => console.log('4'));        // microtask 2 (queued after 3 runs)

queueMicrotask(() => console.log('5')); // microtask 3

Promise.resolve().then(() => {
  console.log('6');
  setTimeout(() => console.log('7'), 0); // macrotask queued from microtask
});

console.log('8');

// OUTPUT: 1, 8, 3, 5, 6, 4, 2, 7
// WHY:
// Sync: 1, 8
// Microtask drain (all before next macrotask):
//   Queue after sync: [then→3, queueMicrotask→5, then→6]
//   Run 3 → queues then→4.  Queue: [5, 6, 4]
//   Run 5.                  Queue: [6, 4]
//   Run 6 → queues setTimeout→7 in macrotask queue.  Queue: [4]
//   Run 4.                  Queue: []
// Macrotask: 2  (first setTimeout)
// Macrotask: 7  (second setTimeout, queued by microtask 6)

/*
EVALUATION CRITERIA:
✓ Microtasks (Promise.then, queueMicrotask, MutationObserver) drain fully
  before the next macrotask runs
✓ Each .then() chains a NEW microtask — not queued at parse time
✓ setTimeout/setInterval are macrotasks (task queue)
✓ queueMicrotask is equivalent in timing to Promise.resolve().then()
✓ Macrotasks inside microtasks run AFTER the current microtask drain
*/


// ============================================
// QUESTION 34: Tagged Template Literals
// ============================================
/*
QUESTION:
Implement a sql tagged template that sanitises interpolated values
to prevent SQL injection. Also implement a highlight tag that wraps
interpolated values in <mark> tags.
*/

function sql(strings, ...values) {
  // strings: array of raw string parts (always length = values.length + 1)
  // values:  the interpolated expressions
  let query = '';
  const params = [];

  strings.forEach((str, i) => {
    query += str;
    if (i < values.length) {
      query += `$${i + 1}`; // parameterised placeholder
      params.push(values[i]);
    }
  });

  return { query, params };
}

{
  const userId = "1; DROP TABLE users; --";
  const { query, params } = sql`SELECT * FROM users WHERE id = ${userId}`;
  // query:  "SELECT * FROM users WHERE id = $1"
  // params: ["1; DROP TABLE users; --"]   ← safely passed as parameter
  console.log(query, params);
}

function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (values[i] !== undefined ? `<mark>${values[i]}</mark>` : ''),
    ''
  );
}

{
  const tagName = 'Alice';
  const score = 95;
  console.log(highlight`Name: ${tagName}, Score: ${score}`);
}
// "Name: <mark>Alice</mark>, Score: <mark>95</mark>"

/*
EVALUATION CRITERIA:
✓ strings.length === values.length + 1 — always one more string chunk
✓ Tag receives raw string array as first arg, rest are interpolated values
✓ strings.raw preserves escape sequences (useful for regex/SQL literals)
✓ Real-world use: sanitisation, i18n, styled-components, GraphQL gql tag
✓ Does NOT call toString() on values automatically — full control
*/


// ============================================
// QUESTION 35: Well-Known Symbols
// ============================================
/*
QUESTION:
Override Symbol.toPrimitive, Symbol.iterator, Symbol.hasInstance,
and Symbol.toStringTag on a custom class. Predict the output of
each operation.
*/

class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  // Controls how the object coerces to primitives
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.celsius;
    if (hint === 'string') return `${this.celsius}°C`;
    return this.celsius; // 'default' hint (e.g., +obj, obj == 5)
  }

  // Makes class iterable — yields fahrenheit, celsius, kelvin
  *[Symbol.iterator]() {
    yield this.celsius * 9 / 5 + 32; // fahrenheit
    yield this.celsius;               // celsius
    yield this.celsius + 273.15;      // kelvin
  }

  // Overrides Object.prototype.toString tag
  get [Symbol.toStringTag]() {
    return 'Temperature';
  }

  // Controls instanceof behaviour
  static [Symbol.hasInstance](instance) {
    return typeof instance?.celsius === 'number';
  }
}

const t = new Temperature(100);
console.log(+t);                          // 100   (number hint)
console.log(`${t}`);                      // "100°C" (string hint)
console.log([...t]);                      // [212, 100, 373.15]
console.log(Object.prototype.toString.call(t)); // "[object Temperature]"
console.log({ celsius: 37 } instanceof Temperature); // true (hasInstance)

/*
EVALUATION CRITERIA:
✓ Symbol.toPrimitive overrides valueOf + toString with hint context
✓ Generator syntax for Symbol.iterator allows spread/for-of
✓ Symbol.toStringTag affects Object.prototype.toString (not console.log)
✓ Symbol.hasInstance lets any object pretend to be an instance
✓ Well-known symbols are on Symbol — not created by Symbol()
*/


// ============================================
// QUESTION 36: Proxy — All Fundamental Traps
// ============================================
/*
QUESTION:
Build a deeply-observable object using Proxy. Any get/set/delete on
nested objects should also be intercepted. Identify which traps fire for:
  obj.a = 1        → set
  delete obj.a     → deleteProperty
  'a' in obj       → has
  Object.keys(obj) → ownKeys + getOwnPropertyDescriptor
  new MyClass()    → construct (on function proxies)
*/

function createObservable(target, onChange) {
  const handler = {
    get(t, prop, receiver) {
      const value = Reflect.get(t, prop, receiver);
      // Wrap nested objects lazily so deep mutations are also intercepted
      if (value !== null && typeof value === 'object') {
        return createObservable(value, onChange);
      }
      return value;
    },
    set(t, prop, value, receiver) {
      const old = t[prop];
      const result = Reflect.set(t, prop, value, receiver);
      if (old !== value) onChange({ type: 'set', prop, old, value });
      return result; // MUST return true or strict mode throws TypeError
    },
    deleteProperty(t, prop) {
      const had = prop in t;
      const result = Reflect.deleteProperty(t, prop);
      if (had) onChange({ type: 'delete', prop });
      return result;
    },
    has(t, prop) {
      onChange({ type: 'has', prop });
      return Reflect.has(t, prop);
    },
  };
  return new Proxy(target, handler);
}

const state = createObservable({ user: { name: 'Alice' } }, console.log);
state.user.name = 'Bob';   // fires set on nested proxy
delete state.user;         // fires deleteProperty

/*
EVALUATION CRITERIA:
✓ Reflect mirrors Proxy traps exactly — always delegate to Reflect
✓ set trap MUST return boolean; returning false in strict mode throws
✓ Wrapping nested values in new Proxy enables deep observation
✓ Proxy !== target — identity checks (===) can break if not careful
✓ ownKeys trap must include non-enumerable and symbol keys for correctness
✓ Knows construct trap applies to function proxies (new handler)
*/


// ============================================
// QUESTION 37: Memory Leak Patterns
// ============================================
/*
QUESTION:
Identify and fix 4 classic memory leak patterns in browser JavaScript.
*/

// LEAK 1: Detached DOM nodes still referenced by a closure
function attachListener() {
  const button = document.getElementById('btn');
  const bigData = new Array(100000).fill('*');

  button.addEventListener('click', () => {
    console.log(bigData.length); // closure holds bigData AND button
  });

  // FIX: Remove listener when no longer needed, or use { once: true }
  // button.addEventListener('click', handler, { once: true });
}

// LEAK 2: Growing event listener list on a long-lived target
class EventBus {
  #handlers = new Map();

  on(event, handler) {
    if (!this.#handlers.has(event)) this.#handlers.set(event, new Set());
    this.#handlers.get(event).add(handler);
    // FIX: Return unsubscribe function — callers MUST call it on destroy
    return () => this.#handlers.get(event)?.delete(handler);
  }
}

// LEAK 3: Interval that captures a large object
function startPolling(service) {
  const cache = new Map(); // never freed while interval runs
  const id = setInterval(() => {
    service.poll().then(data => cache.set(Date.now(), data));
  }, 1000);
  // FIX: return a stop function; call clearInterval + cache.clear()
  return () => { clearInterval(id); cache.clear(); };
}

// LEAK 4: Global variable accumulation
function processRequests(requests) {
  // BAD: implicit global (missing let/const/var in sloppy mode)
  // result = requests.map(transform); // leaks to window.result
  // FIX:
  const result = requests.map(r => r);
  return result;
}

/*
EVALUATION CRITERIA:
✓ Detached DOM nodes: event listeners keep closure + node in memory
✓ Event buses / pub-sub: always provide unsubscribe; WeakRef can help
✓ setInterval without clearInterval — even after component unmount
✓ Accidental globals: always use strict mode / lint rules
✓ Circular references (less relevant post-mark-and-sweep but still poor practice)
✓ Can use Chrome DevTools Memory tab / heap snapshots to verify
*/


// ============================================
// QUESTION 38: Atomics and SharedArrayBuffer
// ============================================
/*
QUESTION:
Why do we need Atomics when using SharedArrayBuffer across workers?
Implement a lock-free counter that two workers can increment safely.
What is a data race and how does Atomics.add prevent it?
*/

// main.js
const sab = new SharedArrayBuffer(4); // 4 bytes = 1 Int32
const counter = new Int32Array(sab);

const worker = new Worker('worker.js');
worker.postMessage({ sab }); // transfer by reference — no copy

// worker.js (would be a separate file)
// self.onmessage = ({ data: { sab } }) => {
//   const counter = new Int32Array(sab);
//   for (let i = 0; i < 1_000_000; i++) {
//     Atomics.add(counter, 0, 1); // atomic increment — no race condition
//     // counter[0]++ would be: READ → ADD → WRITE (non-atomic — race!)
//   }
// };

// Mutex using Atomics.wait / Atomics.notify (only valid in Workers)
// Atomics.wait(int32, index, expectedValue) — blocks if value === expected
// Atomics.notify(int32, index, count)       — wakes waiting agents

/*
EVALUATION CRITERIA:
✓ SharedArrayBuffer shares memory between threads (unlike postMessage copy)
✓ Non-atomic read-modify-write creates data races with multiple writers
✓ Atomics.add / Atomics.compareExchange are guaranteed atomic operations
✓ Atomics.wait can ONLY be called in Workers (blocks main thread → deadlock)
✓ COOP/COEP headers required to enable SharedArrayBuffer (site isolation)
✓ Knows Spectre mitigation is why SAB was disabled and later re-enabled
*/


// ============================================
// QUESTION 39: Intl API — Locale-Aware Formatting
// ============================================
/*
QUESTION:
Format a price, a date, and a list using the Intl API for both
en-US and hi-IN locales. What native JS methods should you NEVER
use for locale-sensitive display?
*/

{
  const amount = 1234567.89;
  const date = new Date('2024-01-15');
  const items = ['apples', 'oranges', 'mangoes'];

  // Currency
  const usdFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  const inrFormatter = new Intl.NumberFormat('hi-IN', { style: 'currency', currency: 'INR' });
  console.log(usdFormatter.format(amount)); // "$1,234,567.89"
  console.log(inrFormatter.format(amount)); // "₹12,34,567.89" (Indian grouping)

  // Date
  const usDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' });
  const inDate = new Intl.DateTimeFormat('hi-IN', { dateStyle: 'long' });
  console.log(usDate.format(date)); // "January 15, 2024"
  console.log(inDate.format(date)); // "15 जनवरी 2024"

  // List
  const listFmt = new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' });
  console.log(listFmt.format(items)); // "apples, oranges, and mangoes"
}

// Collation (locale-aware sorting)
const words = ['banana', 'Äpfel', 'cherry'];
words.sort(new Intl.Collator('de').compare);

// NEVER USE for display: toLocaleDateString() without locale arg,
// Number.toLocaleString() without locale, String.localeCompare() without options

/*
EVALUATION CRITERIA:
✓ Intl.NumberFormat caches formatter — expensive to construct, cheap to reuse
✓ Indian number system uses 2-digit grouping after first 3 digits
✓ Intl.DateTimeFormat vs Date.toLocaleDateString — same engine, explicit locale better
✓ Intl.Collator for sorting locale-aware strings (handles diacritics)
✓ Intl.RelativeTimeFormat for "2 hours ago" style strings
✓ Knows to avoid host-default locale — always pass explicit locale
*/


// ============================================
// QUESTION 40: Advanced RegExp Features
// ============================================
/*
QUESTION:
Use named capture groups, lookbehind assertions, and the 'd' flag
(indices) to parse a date string. Explain the difference between
sticky (y) and global (g) flags, and why exec() in a loop on a
global regex has a footgun.
*/

{
  // Named capture groups
  const dateRe = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/d;
  const match = dateRe.exec('Event on 2024-01-15, more text');
  if (match) {
    console.log(match.groups);         // { year: '2024', month: '01', day: '15' }
    console.log(match.indices.groups); // { year: [9,13], month: [14,16], day: [17,19] }
  }

  // Lookbehind assertion (ES2018)
  const prices = '€10 $20 £30';
  const usdOnly = /(?<=\$)\d+/g;
  console.log(prices.match(usdOnly)); // ['20'] — only after $

  // Global flag footgun: regex.lastIndex persists between exec() calls
  const globalRe = /\d+/g;
  const str = 'a1 b2 c3';
  let m;
  while ((m = globalRe.exec(str)) !== null) {
    console.log(m[0], 'at', m.index); // 1, 2, 3
  }
}
// If you reuse globalRe without resetting lastIndex, second loop starts mid-string!
// FIX: reset globalRe.lastIndex = 0; or create a new RegExp each time

// Sticky flag 'y' — must match at lastIndex exactly (no skip)
const stickyRe = /\d+/y;
stickyRe.lastIndex = 3;
console.log(stickyRe.exec('abc123')); // ['123'] — matches at index 3
stickyRe.lastIndex = 0;
console.log(stickyRe.exec('abc123')); // null — no digit at index 0

/*
EVALUATION CRITERIA:
✓ Named capture groups via ?<name> and match.groups
✓ 'd' flag provides .indices with [start, end] for each group
✓ Lookbehind (?<=...) and negative lookbehind (?<!...)
✓ Global regex.lastIndex footgun when reusing across calls
✓ Sticky differs from global: y requires match at EXACT lastIndex
✓ String.matchAll() is safer than while+exec for global iteration
*/


// ============================================
// QUESTION 41: Object.groupBy and Array Grouping
// ============================================
/*
QUESTION:
Use Object.groupBy (ES2024) and Map.groupBy to group an array of
transactions by category. What is the key difference between the two?
*/

const transactions = [
  { id: 1, category: 'food',    amount: 20 },
  { id: 2, category: 'travel',  amount: 200 },
  { id: 3, category: 'food',    amount: 35 },
  { id: 4, category: 'travel',  amount: 150 },
  { id: 5, category: null,      amount: 5 },
];

// Object.groupBy — keys become plain object properties
// null/undefined keys become the string "null"/"undefined"
const byCategory = Object.groupBy(transactions, t => t.category ?? 'unknown');
// { food: [...], travel: [...], unknown: [...] }

// Map.groupBy — keys can be ANY value (including objects, null safely)
const byAmount = Map.groupBy(transactions, t =>
  t.amount < 50 ? 'small' : 'large'
);
// Map { 'small' => [...], 'large' => [...] }

// Older equivalent using reduce:
function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = String(keyFn(item));
    (acc[key] ??= []).push(item);
    return acc;
  }, Object.create(null)); // null prototype avoids key conflicts with 'constructor' etc.
}

/*
EVALUATION CRITERIA:
✓ Object.groupBy uses string keys (null → "null") — same as object property rules
✓ Map.groupBy supports any key type, including object references
✓ Both return groups of references to original items (no clone)
✓ Polyfill with reduce uses ??= for clean default-or-push
✓ Object.create(null) avoids inherited keys like 'hasOwnProperty' polluting result
✓ Neither method is stable-sorted by default — insertion order is kept
*/


// ============================================
// QUESTION 42: Dynamic import() and Code Splitting
// ============================================
/*
QUESTION:
Explain how import() differs from require() and static import.
Implement route-level code splitting with import() and show how
to handle loading state, error boundaries, and module preloading.
*/

// Static import — synchronous, hoisted, resolved at module evaluation
// import { Chart } from './chart'; // always bundled

// Dynamic import — returns Promise<module>, deferred, can be conditional
async function renderChart(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '<p>Loading chart...</p>';

  try {
    // Vite/webpack recognises the magic comment as a chunk name
    const { Chart } = await import(/* webpackChunkName: "chart" */ './chart.js');
    new Chart(container, data);
  } catch (err) {
    container.innerHTML = `<p>Failed to load chart: ${err.message}</p>`;
  }
}

// Preloading — fetch module but don't execute yet
function preloadModule(path) {
  return import(path); // module is fetched and parsed, Promise cached
}

// On hover, preload heavy component
document.getElementById('open-modal')?.addEventListener('mouseenter', () => {
  preloadModule('./HeavyModal.js');
});

// Multiple imports in parallel
async function loadAll() {
  const [moduleA, moduleB] = await Promise.all([
    import('./a.js'),
    import('./b.js'),
  ]);
  return { ...moduleA, ...moduleB };
}

/*
EVALUATION CRITERIA:
✓ Dynamic import() is a language feature, not a function (can't store as variable)
✓ Returns Promise<namespace object> — default export is .default
✓ Bundlers (webpack/vite) create separate chunks from dynamic imports
✓ Module cache: same URL = same Promise (import() is idempotent)
✓ Preloading by calling import() without awaiting populates the module cache
✓ Works in both ESM and CJS contexts (Node 14+)
*/


// ============================================
// QUESTION 43: Symbols as Unique Keys
// ============================================
/*
QUESTION:
Explain Symbol.for() vs Symbol(). What is the global Symbol registry?
Show a case where Symbol metadata keys survive JSON serialisation
inadvertently and how to avoid it.
*/

// Symbol() — always unique, not in any registry
const s1 = Symbol('tag');
const s2 = Symbol('tag');
console.log(s1 === s2); // false — different identities every time

// Symbol.for() — registered globally, shared across realms (iframes, workers)
const shared1 = Symbol.for('app.auth.token');
const shared2 = Symbol.for('app.auth.token');
console.log(shared1 === shared2); // true — same registry entry

// Symbols are NOT included in JSON.stringify
const obj = { name: 'Alice', [Symbol('secret')]: 'hidden' };
console.log(JSON.stringify(obj)); // '{"name":"Alice"}' — Symbol key dropped

// BUT: Object.assign copies Symbol keys!
const copy = Object.assign({}, obj);
console.log(Object.getOwnPropertySymbols(copy)); // [Symbol(secret)]

// Unique symbol type: TypeScript has `unique symbol` for type-level branding
// In JS: use Symbol() — each call always returns a unique value
const uniqueSym = Symbol('brand'); // JS equivalent — never equal to any other Symbol()

// Well-known vs user symbols: well-known are properties on Symbol object
console.log(typeof Symbol.iterator); // "symbol" — but NOT in registry
console.log(Symbol.keyFor(Symbol.iterator)); // undefined — not registered

/*
EVALUATION CRITERIA:
✓ Symbol() uniqueness per call — cannot be recreated
✓ Symbol.for() is cross-realm shared registry (important for iframes)
✓ Symbol keys invisible to JSON / for...in / Object.keys
✓ Object.assign, spread, Reflect.ownKeys DO copy symbol keys
✓ Well-known symbols (Symbol.iterator etc.) are NOT in the registry
✓ Symbol.keyFor() only finds symbols registered with Symbol.for()
*/


// ============================================
// QUESTION 44: Iterable and Iterator Protocol
// ============================================
/*
QUESTION:
Implement a custom Range class that is both iterable AND an iterator.
Then implement an infinite Fibonacci sequence as a generator.
Explain the difference between iterable and iterator.
*/

// ITERABLE: has [Symbol.iterator]() returning an iterator
// ITERATOR: has next() returning { value, done }
// An object can be both (return this from [Symbol.iterator])

class Range {
  #current;
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.#current = start;
  }

  // Makes Range iterable
  [Symbol.iterator]() {
    this.#current = this.start; // reset on each for-of
    return this;
  }

  // Makes Range an iterator
  next() {
    if (this.#current > this.end) {
      return { value: undefined, done: true };
    }
    const value = this.#current;
    this.#current += this.step;
    return { value, done: false };
  }

  // Optional: return() called when for-of breaks early
  return(value) {
    this.#current = this.end + 1; // mark exhausted
    return { value, done: true };
  }
}

const range = new Range(1, 10, 2);
console.log([...range]); // [1, 3, 5, 7, 9]

// Infinite generator — pull-based, no memory issues
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

const fibs = fibonacci();
console.log(Array.from({ length: 8 }, () => fibs.next().value)); // [0,1,1,2,3,5,8,13]

/*
EVALUATION CRITERIA:
✓ Iterable protocol: [Symbol.iterator]() returns iterator object
✓ Iterator protocol: next() returns {value, done}
✓ Generator functions return an object that is both iterable AND iterator
✓ return() trap allows cleanup on break/throw within for-of
✓ Spread, destructuring, for-of, Array.from all call Symbol.iterator
✓ Infinite generators are fine — never pulls unless explicitly requested
*/


// ============================================
// QUESTION 45: Error.cause and Error Chaining
// ============================================
/*
QUESTION:
Use Error.cause (ES2022) to preserve error context through layers.
Build a multi-layer service where each layer wraps errors with cause.
How do you traverse the cause chain for logging?
*/

class DatabaseError extends Error {
  constructor(message, options) {
    super(message, options); // passes { cause } to Error constructor
    this.name = 'DatabaseError';
  }
}

class ServiceError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'ServiceError';
  }
}

async function queryDB(sql) {
  try {
    // simulate low-level failure
    throw new TypeError('connection refused');
  } catch (err) {
    throw new DatabaseError('Query failed', { cause: err });
  }
}

async function getUser(id) {
  try {
    return await queryDB(`SELECT * FROM users WHERE id = ${id}`);
  } catch (err) {
    throw new ServiceError(`Could not retrieve user ${id}`, { cause: err });
  }
}

// Traverse the cause chain for structured logging
function flattenCauses(err) {
  const chain = [];
  let current = err;
  while (current) {
    chain.push({ name: current.name, message: current.message });
    current = current.cause;
  }
  return chain;
}

getUser(1).catch(err => console.log(flattenCauses(err)));
// [{name:'ServiceError', ...}, {name:'DatabaseError', ...}, {name:'TypeError', ...}]

/*
EVALUATION CRITERIA:
✓ Error constructor options.cause is standard — no need for custom property
✓ cause can be any value, not just Error instances
✓ Preserves full stack trace of original error
✓ Logging should traverse the chain — top error alone loses context
✓ Custom Error subclasses should pass options to super() for cause support
✓ Serialising errors: JSON.stringify(err) only gives {} — must handle manually
*/


// ============================================
// QUESTION 46: Nullish Coalescing — Edge Cases
// ============================================
/*
QUESTION:
Predict the output of each expression. Explain the precedence
footgun when mixing ?? with && or ||.
*/

console.log(0 ?? 'default');         // 0    — 0 is NOT nullish
console.log('' ?? 'default');        // ''   — empty string is NOT nullish
console.log(false ?? 'default');     // false
console.log(null ?? 'default');      // 'default'
console.log(undefined ?? 'default'); // 'default'
console.log(NaN ?? 'default');       // NaN  — NaN is NOT nullish

// Precedence footgun — ?? has lower precedence than && and ||
// but CANNOT be mixed with them without parentheses (SyntaxError in strict parsing)
// console.log(x || y ?? z); // SyntaxError — mixing requires parens

{
  const nqA = null, nqB = 0, nqC = 'c';
  console.log((nqA || nqB) ?? nqC); // (null || 0) → 0 → 0 ?? 'c' → 0
  console.log(nqA ?? (nqB || nqC)); // null ?? (0 || 'c') → null ?? 'c' → 'c'
}

// Optional chaining + nullish coalescing
{
  const config = { server: { port: 0 } };
  const port = config?.server?.port ?? 3000;
  console.log(port); // 0 — port IS set, value 0 is valid

  const host = config?.server?.host ?? 'localhost';
  console.log(host); // 'localhost' — host is undefined (nullish)
}

/*
EVALUATION CRITERIA:
✓ ?? treats ONLY null and undefined as "missing" — 0/''/false are values
✓ || treats ANY falsy value as "missing" — common footgun with 0 and ''
✓ Mixing ?? with || or && without parens is a SyntaxError
✓ Optional chaining (?.) short-circuits the chain but returns undefined, not null
✓ config?.x?.y returns undefined when x is missing — ?? then fills in default
*/


// ============================================
// QUESTION 47: Reflect API
// ============================================
/*
QUESTION:
Explain why you should use Reflect.set() inside a Proxy set trap
instead of target[prop] = value. Show the difference in behaviour
with receiver and inherited setters.
*/

class Base {
  #_val = 0;
  get val() { return this.#_val; }
  set val(v) { this.#_val = v * 2; } // setter doubles the value
}

class Child extends Base {}

const child = new Child();
const proxy = new Proxy(child, {
  set(target, prop, value, receiver) {
    console.log('intercepted set:', prop, value);

    // WRONG: target[prop] = value
    // This bypasses the prototype setter — writes directly to target instance
    // and ignores the inherited setter in Base

    // CORRECT: Reflect.set passes receiver so prototype chain setters fire correctly
    return Reflect.set(target, prop, value, receiver);
  }
});

proxy.val = 5;
console.log(proxy.val); // 10 — setter in Base ran correctly via Reflect

// Reflect.apply vs Function.prototype.apply — works with non-function objects safely
function greet(greeting) { return `${greeting}, ${this.name}`; }
console.log(Reflect.apply(greet, { name: 'Alice' }, ['Hello'])); // "Hello, Alice"

// Reflect.ownKeys — like Object.keys but includes symbols and non-enumerable
const reflectSym = Symbol('x');
const o = { a: 1, [reflectSym]: 2 };
Object.defineProperty(o, 'b', { value: 3, enumerable: false });
console.log(Reflect.ownKeys(o)); // ['a', 'b', Symbol(x)]

/*
EVALUATION CRITERIA:
✓ Reflect mirrors every Proxy trap — always use Reflect in traps
✓ receiver is the proxy (or object the prop was accessed on), not target
✓ Ignoring receiver in set breaks inherited setters
✓ Reflect.set returns boolean (success/failure) — same contract as set trap
✓ Reflect.ownKeys = Object.keys + non-enumerable + symbols
✓ Reflect.construct(Target, args, NewTarget) allows super() without calling constructor
*/


// ============================================
// QUESTION 48: BigInt — Edge Cases
// ============================================
/*
QUESTION:
Predict the output and explain each expression. When does BigInt throw,
and what are the implications for JSON serialisation and mixing with Number?
*/

console.log(typeof 42n);           // "bigint"
console.log(9007199254740993n === 9007199254740993); // TypeError (can't mix without explicit cast)

const big = 9007199254740993n;     // > Number.MAX_SAFE_INTEGER
const num = Number(big);
console.log(num === 9007199254740992); // true — precision lost in conversion!

console.log(5n / 2n);             // 2n — integer division (truncated, not 2.5n)
console.log(-7n % 3n);            // -1n — sign follows dividend (unlike Math.mod)

// JSON doesn't support BigInt — throws by default
try {
  JSON.stringify({ id: 1234567890123456789n }); // TypeError
} catch (e) {
  console.log(e.message); // "Do not know how to serialize a BigInt"
}

// Fix: custom replacer
const safeBigIntStr = JSON.stringify({ id: big }, (k, v) =>
  typeof v === 'bigint' ? v.toString() : v
);

// Bitwise ops work on BigInt (unlike Number — limited to 32-bit)
console.log(1n << 64n); // 18446744073709551616n — full 65-bit result

/*
EVALUATION CRITERIA:
✓ Cannot mix BigInt and Number in arithmetic without explicit cast
✓ Division truncates toward zero — no fractional BigInt
✓ JSON.stringify throws — requires custom serialiser
✓ BigInt loses precision when cast to Number (safe only up to 2^53-1)
✓ Bitwise on Number is 32-bit; bitwise on BigInt is arbitrary width
✓ Comparison: 1n == 1 (abstract) → true; 1n === 1 → false
*/


// ============================================
// QUESTION 49: Generators as State Machines
// ============================================
/*
QUESTION:
Implement a traffic light state machine using a generator.
The generator should accept input via next(input) and change state
accordingly. Show how two-way communication works with generators.
*/

function* trafficLight() {
  let state = 'red';

  while (true) {
    // yield both sends current state out AND receives input via next()
    const input = yield state;

    if (state === 'red' && input === 'go') {
      state = 'green';
    } else if (state === 'green' && input === 'slow') {
      state = 'yellow';
    } else if (state === 'yellow' && input === 'stop') {
      state = 'red';
    }
    // invalid transitions are silently ignored (idempotent)
  }
}

const light = trafficLight();
console.log(light.next().value);         // 'red'   — first next() starts generator
console.log(light.next('go').value);     // 'green' — input drives transition
console.log(light.next('slow').value);   // 'yellow'
console.log(light.next('stop').value);   // 'red'
console.log(light.next('invalid').value); // 'red'  — no valid transition

// KEY TRICKY PART:
// The FIRST next() call CANNOT pass a value — the generator hasn't
// reached a yield yet, so there is no yield expression to receive it.
// The first value passed to next() is silently discarded.

/*
EVALUATION CRITERIA:
✓ yield is an expression — value = yield state uses the value passed to next()
✓ First next() advances to first yield; its argument is discarded
✓ Generators maintain local state across invocations — no external state needed
✓ Infinite loop with yield is valid — generator is pull-based
✓ Generator.throw(err) injects an error at the yield point
✓ Generator.return(val) terminates the generator from outside
*/


// ============================================
// QUESTION 50: Prototype Chain Manipulation
// ============================================
/*
QUESTION:
What is the output? Explain each step. Then explain the performance
implications of modifying __proto__ at runtime.
*/

function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };

function Dog(name) { Animal.call(this, name); }
// Before ES6 class syntax, manual prototype chain setup:
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // restore constructor reference
Dog.prototype.bark = function() { return `${this.name} barks`; };

const dog = new Dog('Rex');
console.log(dog.speak());                       // "Rex speaks"
console.log(dog.bark());                        // "Rex barks"
console.log(dog instanceof Dog);                // true
console.log(dog instanceof Animal);             // true
console.log(dog.constructor === Dog);           // true
console.log(Object.getPrototypeOf(dog) === Dog.prototype); // true

// Object.create vs new: Object.create(proto) creates object with proto
// as its [[Prototype]] WITHOUT calling a constructor function

// __proto__ mutation at runtime defeats V8's hidden class optimisations
// because the engine caches property lookup paths per "shape"
// Changing [[Prototype]] after object creation invalidates the IC (inline cache)
const obj = { x: 1 };
Object.setPrototypeOf(obj, { y: 2 }); // valid but slow
// obj.__proto__ = { y: 2 }; // also works, also slow (deprecated accessor)

/*
EVALUATION CRITERIA:
✓ Object.create(proto) sets [[Prototype]] without invoking constructor
✓ Must manually restore .constructor after reassigning prototype
✓ instanceof traverses [[Prototype]] chain, not .constructor
✓ V8 hidden classes / shapes — property addition ORDER matters
✓ Changing [[Prototype]] after creation = deoptimisation (megamorphic IC)
✓ class syntax under the hood does the same prototype wiring automatically
*/


// ============================================
// QUESTION 51: Async Promise Chain — User → Order → Details → Shipping
// ============================================
/*
QUESTION:
You are given four async functions that form a data-fetching pipeline.
Each function depends on the result of the previous one.

  getUserId()        → resolves to a userId  (simulates auth/session lookup)
  getOrderId(userId) → resolves to an orderId (simulates fetching latest order)
  getOrderDetails(orderId) → resolves to an order object
  getShippingStatus(order) → resolves to a shipping status string

  PART A — Chain all four using .then() only (no async/await).
  PART B — Rewrite using async/await.
  PART C — Wrap the entire chain in a withTimeout(promise, ms) function that
            uses Promise.race() to reject with a TimeoutError if the chain
            takes longer than the given number of milliseconds.
  PART D — What is logged and in what order for the execution below?
            Identify every tricky output step.

TRICKY PARTS:
  1. What happens if getOrderId rejects — does getShippingStatus still run?
  2. Does Promise.race() cancel the losing promise?
  3. withTimeout is called with 50ms but the chain takes 120ms — what is thrown?
  4. If you attach .catch() AFTER .then() in a chain, which errors does it catch?
*/

// ─── Simulated async data layer ───────────────────────────────────────────────

function getUserId() {
  // Simulates a 40ms network call (e.g., reading a session token)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[1] getUserId resolved');
      resolve('user_42');
    }, 40);
  });
}

function getOrderId(userId) {
  if (!userId) return Promise.reject(new Error('No userId provided'));
  // Simulates a 40ms DB query
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[2] getOrderId resolved for', userId);
      resolve('order_99');
    }, 40);
  });
}

function getOrderDetails(orderId) {
  if (!orderId) return Promise.reject(new Error('No orderId provided'));
  // Simulates a 40ms API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[3] getOrderDetails resolved for', orderId);
      resolve({ id: orderId, item: 'Laptop', qty: 1 });
    }, 40);
  });
}

function getShippingStatus(order) {
  if (!order) return Promise.reject(new Error('No order provided'));
  // Simulates a 40ms shipping-service call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[4] getShippingStatus resolved for order', order.id);
      resolve(`Order ${order.id} is OUT_FOR_DELIVERY`);
    }, 40);
  });
}

// ─── PART A — .then() chain ───────────────────────────────────────────────────

function fetchShippingStatusThen() {
  return getUserId()
    .then(userId => getOrderId(userId))       // each .then returns a new Promise
    .then(orderId => getOrderDetails(orderId))
    .then(order => getShippingStatus(order))
    .catch(err => {
      // A single .catch at the end catches ANY rejection in the chain above.
      // Once a .then is skipped due to rejection, control jumps here directly.
      console.error('Chain failed (then):', err.message);
      throw err; // re-throw so the caller knows it failed
    });
}

// ─── PART B — async/await ────────────────────────────────────────────────────

async function fetchShippingStatusAsync() {
  try {
    const userId  = await getUserId();
    const orderId = await getOrderId(userId);  // awaiting inside try = automatic .catch
    const order   = await getOrderDetails(orderId);
    const status  = await getShippingStatus(order);
    return status;
  } catch (err) {
    console.error('Chain failed (async):', err.message);
    throw err;
  }
}

// ─── PART C — withTimeout using Promise.race() ───────────────────────────────

function withTimeout(promise, ms) {
  // Creates a "timer" promise that REJECTS after ms milliseconds
  const timeout = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error(`Timed out after ${ms}ms`));
    }, ms);
  });

  // Promise.race() settles with whichever promise settles FIRST
  // If timeout wins  → the result is a rejection with TimeoutError
  // If promise wins  → the result is the resolved value (or its rejection)
  return Promise.race([promise, timeout]);
}

// ─── PART D — Execution and output prediction ────────────────────────────────
/*
QUESTION D:
What is the EXACT console output (including order) when this runs?

  console.log('START');
  withTimeout(fetchShippingStatusAsync(), 200)
    .then(status => console.log('STATUS:', status))
    .catch(err  => console.log('ERROR:', err.message));
  console.log('END');

The chain takes 4 × 40ms = 160ms total.
The timeout is 200ms.

ANSWER:
  START                                     ← synchronous
  END                                       ← synchronous (Promise not awaited)
  [1] getUserId resolved                    ← after ~40ms
  [2] getOrderId resolved for user_42       ← after ~80ms
  [3] getOrderDetails resolved for order_99 ← after ~120ms
  [4] getShippingStatus resolved for order order_99  ← after ~160ms
  STATUS: Order order_99 is OUT_FOR_DELIVERY ← chain wins the race (160ms < 200ms)

KEY TRICKY INSIGHTS:
  • "END" logs before any async callbacks — the call stack runs to completion first.
  • withTimeout(fetchShippingStatusAsync(), ...) starts the async function immediately
    when called — it is already running; the returned Promise is passed to race().
  • Promise.race() does NOT cancel the losing promise. The timer promise that loses
    keeps its setTimeout alive until it fires — it just has no observers.
    In production, you should clear the timeout to avoid the leak:
      const timeout = new Promise((_, reject) => {
        const id = setTimeout(() => reject(...), ms);
        promise.finally(() => clearTimeout(id)); // cleanup win or lose
      });
  • If the timeout were 100ms (chain takes 160ms), race() would reject first:
      ERROR: Timed out after 100ms
    — BUT getOrderDetails and getShippingStatus are still running in the background
      because the JS runtime doesn't cancel setTimeout callbacks!
  • A .catch() at the end of a .then() chain catches rejections from ALL preceding
    .then() handlers, not just the immediately previous one.
*/

// ─── PART E — Error propagation quiz ─────────────────────────────────────────
/*
QUESTION E: What is logged for each case?
*/

// Case 1: rejection in the MIDDLE of the chain
getUserId()
  .then(() => Promise.reject(new Error('step 2 failed'))) // rejects here
  .then(orderId => {
    console.log('NEVER REACHED'); // skipped — promise is rejected
    return getOrderDetails(orderId);
  })
  .then(order => getShippingStatus(order))  // also skipped
  .catch(err => console.log('Caught:', err.message)); // → "Caught: step 2 failed"

// Case 2: .catch() followed by .then() — recovery
getUserId()
  .then(() => Promise.reject(new Error('boom')))
  .catch(err => {
    console.log('Recovered from:', err.message); // → "Recovered from: boom"
    return 'fallback_order_id';                   // catch RETURNS a value — chain continues!
  })
  .then(orderId => console.log('Continued with:', orderId)); // → "Continued with: fallback_order_id"

// Case 3: unhandled rejection (no .catch) — throws UnhandledPromiseRejection in Node
// getUserId().then(() => Promise.reject(new Error('unhandled')));

// ─── PART F — withTimeout with cleanup (production-grade) ────────────────────

function withTimeoutClean(promise, ms) {
  let timerId;

  const timeout = new Promise((_, reject) => {
    timerId = setTimeout(
      () => reject(new Error(`Timed out after ${ms}ms`)),
      ms
    );
  });

  // Whether promise wins or timeout wins, clear the timer to avoid the leak
  return Promise.race([promise, timeout])
    .finally(() => clearTimeout(timerId));
}

// Usage
withTimeoutClean(fetchShippingStatusAsync(), 200)
  .then(status => console.log('FINAL STATUS:', status))
  .catch(err   => console.log('FINAL ERROR:', err.message));

/*
EVALUATION CRITERIA:
✓ Understands Promise chaining — each .then() returns a NEW Promise
✓ Knows that a rejection skips all subsequent .then() until the next .catch()
✓ .catch() that returns a value RESOLVES the chain — it is a recovery point
✓ async/await is syntactic sugar over .then()/.catch() — same microtask semantics
✓ Promise.race() settles with the FIRST settled promise (resolved OR rejected)
✓ Promise.race() does NOT cancel or abort the losing promises
✓ Losing timeout keeps its setTimeout alive — must use .finally() to clear it
✓ "END" logs before async callbacks — event loop processes microtasks after call stack
✓ Total chain time = sum of sequential awaits (not parallel) — 4 × 40ms = 160ms
✓ Knows the difference between parallel (Promise.all) and sequential (await each) fetching
✓ Unhandled rejections crash Node.js and trigger window.onunhandledrejection in browsers
*/
