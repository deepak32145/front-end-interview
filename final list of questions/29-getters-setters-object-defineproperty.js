/**
 * Q29: Getters, Setters, and Object.defineProperty Internals
 * Difficulty: Hard
 * Concepts: accessor vs data descriptors, enumerable/configurable/writable flags, computed properties, validation patterns
 */

// ============================================
// QUESTION
// ============================================
/*
const person = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  get fullName() {
    console.log('getter called');
    return `${this.firstName} ${this.lastName}`;
  },
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
};

console.log(person.fullName);          // A
person.fullName = 'Grace Hopper';
console.log(person.firstName);         // B
console.log(Object.keys(person));      // C — does fullName show up?

Object.defineProperty(person, 'ssn', {
  value: '123-45-6789',
  writable: false,
  enumerable: false,
  configurable: false
});

console.log(person.ssn);                // D
person.ssn = 'hacked';                  // E (strict mode)
console.log(Object.keys(person));       // F — does ssn show up?
console.log(JSON.stringify(person));    // G — does ssn show up?

delete person.ssn;                       // H (strict mode)

Implement a `validatedProperty(obj, key, validator)` helper that uses
Object.defineProperty to add a property with a custom setter that
throws if `validator(value)` returns false, while still allowing normal
reads.
*/

// ============================================
// ANSWERS
// ============================================

/*
A: "getter called" then "Ada Lovelace" — accessing a getter property
   behaves like a normal property read syntactically, but actually
   invokes the function.

B: "Grace" — the setter destructures the assigned string and updates
   the underlying firstName/lastName fields.

C: ['firstName', 'lastName', 'fullName'] — accessor properties defined
   via object literal `get`/`set` syntax ARE enumerable by default,
   exactly like normal data properties, so they show up in
   Object.keys/for-in/JSON.stringify.

D: "123-45-6789" — direct value read works fine regardless of the
   descriptor flags (those flags control mutation/enumeration/
   reconfiguration, not readability).

E: THROWS TypeError: Cannot assign to read only property 'ssn' — because
   writable: false, in strict mode. (Silently fails in sloppy mode.)

F: ['firstName', 'lastName', 'fullName'] — ssn is EXCLUDED because
   enumerable: false. This is exactly why Object.defineProperty is used
   for things like private-ish metadata: hidden from casual enumeration
   but still directly accessible if you know the key.

G: '{"firstName":"Grace","lastName":"Hopper"}' — JSON.stringify only
   serializes ENUMERABLE own properties (and it also calls the getter
   for fullName... wait, fullName is enumerable so JSON.stringify WOULD
   include it too: actual G answer is
   '{"firstName":"Grace","lastName":"Hopper","fullName":"Grace Hopper"}'
   — ssn is still excluded because non-enumerable, but fullName IS
   included because getters that are enumerable DO get serialized,
   with their COMPUTED return value.

H: THROWS TypeError: Cannot delete property 'ssn' — configurable:false
   blocks deletion (and also blocks ever redefining the property again
   with defineProperty).
*/

function validatedProperty(obj, key, validator) {
  let internalValue;

  Object.defineProperty(obj, key, {
    get() {
      return internalValue;
    },
    set(value) {
      if (!validator(value)) {
        throw new TypeError(`Invalid value for "${key}": ${JSON.stringify(value)}`);
      }
      internalValue = value;
    },
    enumerable: true,
    configurable: true
  });

  return obj;
}

/*
============================================
TEST
============================================
const account = {};
validatedProperty(account, 'balance', (v) => typeof v === 'number' && v >= 0);

account.balance = 100;      // OK
console.log(account.balance); // 100
account.balance = -5;        // throws TypeError

============================================
EVALUATION CRITERIA
============================================
- Correctly predicts enumerable-by-default for object-literal getters
  (a very common miss — people assume defineProperty-like defaults,
  which are FALSE by default, apply everywhere).
- Knows Object.defineProperty defaults ALL flags to false when not
  specified (writable/enumerable/configurable), unlike literal syntax.
- Understands JSON.stringify calls getters and respects enumerable flag.
- Correctly implements a validating accessor property using closures to
  store the real value (since defining `get`/`set` on the SAME key that
  also has a `value` would throw — data and accessor descriptors are
  mutually exclusive).
*/
