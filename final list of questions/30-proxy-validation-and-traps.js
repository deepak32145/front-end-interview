/**
 * Q30: Proxy Traps — Validation, Negative Array Indices, Default Values
 * Difficulty: Hard
 * Concepts: get/set/has/deleteProperty traps, invariant violations, Proxy composition
 */

// ============================================
// QUESTION
// ============================================
/*
Using Proxy, implement THREE utilities:

1. `createValidatedObject(schema)` — returns a proxy over `{}` where
   `schema` maps key -> validator function; assigning an invalid value
   throws a TypeError, and reading an unset key returns `undefined`
   (not throw).

2. `withNegativeIndices(arr)` — wraps an array so `proxy[-1]` returns the
   LAST element (Python-style negative indexing), while all normal
   behavior (positive indices, .length, .push, etc.) still works
   untouched.

3. `withDefault(obj, defaultValue)` — returns a proxy where reading ANY
   missing property returns `defaultValue` instead of `undefined`.

For (2), explain why you must trap `get` specifically and how you
detect "this key looks like a negative-index string" vs a real property
name like 'length' or 'push'.
*/

// ============================================
// ANSWER
// ============================================

function createValidatedObject(schema) {
  return new Proxy(
    {},
    {
      get(target, prop) {
        return target[prop]; // undefined for unset keys, as required
      },
      set(target, prop, value) {
        const validate = schema[prop];
        if (validate && !validate(value)) {
          throw new TypeError(`Invalid value for "${String(prop)}": ${JSON.stringify(value)}`);
        }
        target[prop] = value;
        return true; // MUST return true, or strict-mode assignment throws
      }
    }
  );
}

function withNegativeIndices(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      if (typeof prop === 'string') {
        const index = Number(prop);
        // Only intercept genuine negative-integer-looking keys; leave
        // 'length', 'push', Symbol.iterator, etc. completely untouched
        // so the array keeps behaving like a normal array otherwise.
        if (Number.isInteger(index) && index < 0) {
          return target[target.length + index];
        }
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

function withDefault(obj, defaultValue) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      if (!(prop in target)) {
        return defaultValue;
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

/*
============================================
TEST
============================================
const config = createValidatedObject({
  port: (v) => typeof v === 'number' && v > 0,
  host: (v) => typeof v === 'string'
});
config.port = 3000;   // OK
config.host = 'localhost'; // OK
// config.port = -1;  // throws TypeError

const arr = withNegativeIndices([10, 20, 30]);
console.log(arr[-1]);      // 30
console.log(arr[0]);       // 10
console.log(arr.length);   // 3
arr.push(40);
console.log(arr[-1]);      // 40

const scores = withDefault({ alice: 90 }, 0);
console.log(scores.alice); // 90
console.log(scores.bob);   // 0 (not undefined)

============================================
WHY get MUST USE Reflect.get(target, prop, receiver)
============================================
Using `target[prop]` directly instead of `Reflect.get(target, prop,
receiver)` breaks correctly for getter properties defined further up
the prototype chain that themselves reference `this` — Reflect.get lets
you pass the ORIGINAL receiver (the proxy) so `this` inside any such
getter still refers to the outer proxy, preserving correct behavior for
composed/inherited proxies. For plain data properties it usually
doesn't matter, but it's the technically correct/robust pattern the
Proxy spec expects you to use, and interviewers watch for it.

============================================
EVALUATION CRITERIA
============================================
- set trap returns `true` on success (proxies enforce this invariant —
  returning falsy causes a TypeError in strict mode: "'set' on proxy:
  trap returned falsish").
- Negative-index detection is narrow enough not to break `length`,
  methods, or Symbol.iterator lookups.
- withDefault uses `in` (not truthy check) to detect "missing" vs
  "present but falsy/undefined" — a value explicitly set to
  `undefined` should probably still return `undefined`, not the
  default (discuss this distinction with the candidate).
*/
