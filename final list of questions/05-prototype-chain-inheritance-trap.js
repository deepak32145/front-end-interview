/**
 * Q5: Prototype Chain & Inheritance Traps
 * Difficulty: Medium-Hard
 * Concepts: prototype chain, Object.create, constructor property, shadowing, hasOwnProperty
 */

// ============================================
// QUESTION
// ============================================
/*
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype);

const rex = new Dog('Rex');

console.log('1:', rex instanceof Dog);
console.log('2:', rex instanceof Animal);
console.log('3:', rex.constructor === Dog);
console.log('4:', rex.constructor === Animal);
console.log('5:', rex.speak());

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};

const buddy = new Dog('Buddy');
console.log('6:', rex.speak());   // does the FIRST instance also change?
console.log('7:', buddy.speak());

Animal.prototype.speak = function () {
  return `${this.name} makes a NEW sound`;
};
const plainAnimal = new Animal('Generic');
console.log('8:', plainAnimal.speak());
console.log('9:', rex.speak()); // does replacing Animal's method affect Dog?
*/

// ============================================
// ANSWER
// ============================================

// 1: true  — Dog.prototype is in rex's prototype chain.
// 2: true  — Object.create(Animal.prototype) puts Animal.prototype in
//            the chain too, so instanceof Animal is also true.
// 3: false — Dog.prototype = Object.create(Animal.prototype) creates a
//            brand-new object with NO `constructor` property of its own.
//            Looking up `.constructor` walks the chain and finds it on
//            Animal.prototype instead.
// 4: true  — exactly because of the above: rex.constructor resolves to
//            Animal, which is almost always a bug if unaddressed. Fix:
//            Dog.prototype.constructor = Dog;  (right after Object.create)
// 5: "Rex makes a sound" — found via the prototype chain on Animal.prototype
//            at the time of the call (methods are looked up lazily).

// 6: "Rex barks" — YES, it changes. `rex` doesn't own a `speak` property;
//            it looks it up on Dog.prototype every time `.speak()` is
//            called. Prototype methods are shared references, not
//            copied at instantiation, so replacing Dog.prototype.speak
//            retroactively affects EVERY existing and future Dog instance.
// 7: "Buddy barks"

// 8: "Generic makes a NEW sound"
// 9: "Rex barks" — NOT affected. Because Dog.prototype.speak was
//            overridden in step 6, `rex.speak` is now found directly on
//            Dog.prototype and the lookup never continues up to
//            Animal.prototype anymore. Reassigning Animal.prototype.speak
//            only matters for objects whose chain still resolves speak
//            there (e.g. plainAnimal, or a hypothetical Dog instance
//            that never got its own override).

/*
============================================
FOLLOW-UPS
============================================
1) Why use Object.create(Animal.prototype) instead of `Dog.prototype =
   new Animal()`?
   -> `new Animal()` actually RUNS the Animal constructor with no
      arguments just to steal its prototype, which can have side effects
      or throw if Animal requires arguments. Object.create only sets up
      the prototype link, no constructor execution.

2) How would `class Dog extends Animal` change any of the above?
   -> `class` syntax automatically wires up prototype AND sets
      Dog.prototype.constructor = Dog correctly — this whole class of
      bugs is why ES6 classes exist. `super(name)` replaces
      `Animal.call(this, name)`.

3) hasOwnProperty check:
   console.log(rex.hasOwnProperty('speak')); // false — proves it's
   inherited, not an own property.
*/
