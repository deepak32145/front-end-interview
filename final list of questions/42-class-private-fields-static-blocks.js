/**
 * Q42: Class Private Fields, Private Methods, and Static Initialization Blocks
 * Difficulty: Hard
 * Concepts: true encapsulation via #fields, brand checks, static blocks, private methods, inheritance interaction
 */

// ============================================
// QUESTION
// ============================================
/*
class BankAccount {
  #balance;
  static #instanceCount = 0;
  static #nextId = 1000;

  static {
    // static initialization block
    console.log('BankAccount class initialized');
  }

  #id;

  constructor(initialBalance) {
    this.#balance = initialBalance;
    this.#id = BankAccount.#nextId++;
    BankAccount.#instanceCount++;
  }

  #validateAmount(amount) {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new TypeError('Amount must be a positive number');
    }
  }

  deposit(amount) {
    this.#validateAmount(amount);
    this.#balance += amount;
    return this.#balance;
  }

  static get instanceCount() {
    return BankAccount.#instanceCount;
  }

  static isBankAccount(obj) {
    // "brand check" pattern
    try {
      obj.#balance;
      return true;
    } catch {
      return false;
    }
  }
}

const acc = new BankAccount(100);
console.log(acc.deposit(50));           // A
console.log(acc.#balance);               // B — what happens?
console.log(BankAccount.instanceCount);  // C
console.log(BankAccount.isBankAccount(acc));           // D
console.log(BankAccount.isBankAccount({ balance: 1 })); // E

const acc2 = new BankAccount(0);
console.log(BankAccount.instanceCount);  // F

class SavingsAccount extends BankAccount {
  addInterest(rate) {
    return this.deposit(this.#balance * rate); // G — what happens?
  }
}
*/

// ============================================
// ANSWERS
// ============================================

/*
A: 150 — straightforward deposit.

B: SyntaxError (at PARSE time, not runtime!): "Private field '#balance'
   must be declared in an enclosing class". Unlike a normal property
   access on a nonexistent key (which just returns undefined), trying
   to access a `#privateField` from OUTSIDE any class body that
   declares it is a SYNTAX ERROR — the whole script/module fails to
   even parse, not just throw at that line. This is a fundamentally
   different (and much stronger) privacy guarantee than closures or
   naming conventions (_balance) ever provided — it's enforced by the
   grammar itself, not just runtime checks.

C: 1 — only one instance (`acc`) has been created at this point.

D: true — the "brand check" pattern works because `obj.#balance`
   inside a method of BankAccount is a genuine private-field ACCESS: it
   succeeds silently if `obj` actually has that private field
   (regardless of `this`), and THROWS a TypeError if it doesn't. This
   pattern is the standard, spec-endorsed way to check "is this object
   really an instance whose class declared this private field" —
   arguably more reliable than `instanceof`, which can be fooled by
   manually setting prototypes.

E: false — `{ balance: 1 }` was never constructed by a class that
   declares `#balance`, so `obj.#balance` throws inside the try, caught,
   returns false.

F: 2 — a second instance was created.

G: SyntaxError (again, at parse time) — `SavingsAccount` extends
   `BankAccount`, but PRIVATE FIELDS ARE NOT INHERITED in an accessible
   sense: `#balance` is scoped strictly to the BankAccount class body
   where it's declared. A subclass method CANNOT reference `this.#balance`
   directly, even though the private field genuinely exists on
   instances of SavingsAccount (since the BankAccount constructor ran
   via the implicit super() call and initialized it) — only CODE
   WRITTEN INSIDE BankAccount's class body can syntactically reference
   `#balance`. The fix is for BankAccount to expose a protected-like
   accessor (there's no true "protected" in JS) e.g. a `get balance()`
   or a `_getBalance()` method that subclasses can call instead.
*/

/*
============================================
FOLLOW-UP
============================================
1) When does the static initialization block run, relative to the
   class definition and first instantiation?
   -> Immediately when the class declaration itself is evaluated
      (i.e., right when the `class BankAccount { ... }` statement
      executes), BEFORE any instances are ever created — this is why
      "BankAccount class initialized" logs before "150" even though it
      appears "inside" the class body textually before the constructor.

2) Why prefer `#privateField` over the older WeakMap-based privacy
   pattern (see Q32)?
   -> Cleaner syntax, native engine optimization (private fields are
      implemented as fixed object slots, not hash lookups, so they're
      typically faster), built-in brand-check ergonomics via `in`
      (`#balance in obj`, ES2022+) or the try/catch pattern shown here,
      and no risk of accidentally leaking the WeakMap reference itself.
      The WeakMap pattern remains relevant for environments/tooling
      that don't yet support private fields, or for patterns needing
      TRUE cross-instance-shared weak state.
*/
