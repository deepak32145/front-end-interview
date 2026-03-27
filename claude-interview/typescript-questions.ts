/**
 * TYPESCRIPT INTERVIEW QUESTIONS
 * Front-end Interview Series
 */

// ============================================
// QUESTION 1: Basic Types and Interfaces
// ============================================
/*
QUESTION:
Create a TypeScript interface for a User object with the following requirements:
- name (string, required)
- email (string, required)
- age (number, optional)
- isActive (boolean, default true)
- roles (array of strings)

Then create a function that validates and returns a User.
*/

interface User {
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
  roles: string[];
}

function createUser(data: Partial<User>): User {
  return {
    name: data.name || '',
    email: data.email || '',
    age: data.age,
    isActive: data.isActive ?? true,
    roles: data.roles || []
  };
}

// Type safety example:
const user: User = {
  name: 'John',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  roles: ['admin', 'user']
};

/*
EVALUATION CRITERIA:
✓ Understands interfaces and contracts
✓ Uses optional properties correctly (?)
✓ Uses default values appropriately
✓ Understands Partial<T> utility type
✓ Type-safe function implementation
✓ No 'any' types used
*/


// ============================================
// QUESTION 2: Generics
// ============================================
/*
QUESTION:
Implement a generic response wrapper that works with any data type.
Create a function that handles API responses with success/error states.
*/

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

function handleApiResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: Date.now()
  };
}

function handleApiError<T>(error: string): ApiResponse<T> {
  return {
    success: false,
    error,
    timestamp: Date.now()
  };
}

// Generic with constraints
interface Identifiable {
  id: string;
}

function getById<T extends Identifiable>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Usage:
interface Product extends Identifiable {
  id: string;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: '1', name: 'Laptop', price: 999 },
  { id: '2', name: 'Phone', price: 599 }
];

const product = getById(products, '1');

/*
EVALUATION CRITERIA:
✓ Correctly implements generics
✓ Uses generic constraints (extends)
✓ Generic function parameters properly typed
✓ Understands when to use generics vs unions
✓ Works with complex nested generics
✓ Proper usage with interfaces and types
*/


// ============================================
// QUESTION 3: Union and Intersection Types
// ============================================
/*
QUESTION:
Implement status handling using Union types and
create a combined type using Intersection types.
*/

// Union types
type Status = 'pending' | 'loading' | 'success' | 'error';

interface PendingState {
  status: 'pending';
}

interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AsyncState = PendingState | LoadingState | SuccessState | ErrorState;

function handleAsyncState(state: AsyncState): string {
  switch (state.status) {
    case 'pending':
      return 'Waiting to start...';
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data received: ${JSON.stringify(state.data)}`;
    case 'error':
      return `Error: ${state.error}`;
  }
}

// Intersection types
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Entity {
  id: string;
}

type AuditedEntity = Entity & Timestamped;

const auditedData: AuditedEntity = {
  id: '123',
  createdAt: new Date(),
  updatedAt: new Date()
};

/*
EVALUATION CRITERIA:
✓ Properly uses Union types
✓ Implements discriminated unions (type guards)
✓ Uses Intersection types correctly
✓ Type narrowing with switch/if
✓ Exhaustiveness checking
✓ Clean pattern matching
*/


// ============================================
// QUESTION 4: Type Guards and Narrowing
// ============================================
/*
QUESTION:
Implement various type guards to safely handle different types.
*/

// Type predicate
function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

// Guard with instanceof
class Dog {
  bark() {
    console.log('Woof!');
  }
}

class Cat {
  meow() {
    console.log('Meow!');
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// Guard with 'in' operator
interface Admin {
  canDelete: boolean;
}

interface User {
  name: string;
}

function handleAccess(user: Admin | User) {
  if ('canDelete' in user) {
    console.log('Admin access');
  } else {
    console.log('User access');
  }
}

// Exhaustiveness check
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function processStatus(status: Status) {
  switch (status) {
    case 'pending':
    case 'loading':
    case 'success':
    case 'error':
      break;
    default:
      assertNever(status);
  }
}

/*
EVALUATION CRITERIA:
✓ Creates custom type guards
✓ Uses 'instanceof' correctly
✓ Uses 'in' operator for property checking
✓ Understands type narrowing
✓ Implements exhaustiveness checks
✓ Knows typeof operator limitations
*/


// ============================================
// QUESTION 5: Decorators
// ============================================
/*
QUESTION:
Implement class decorators for logging and validation.
(Note: Requires tsconfig "experimentalDecorators": true)
*/

// Simple logging decorator
function Logged(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with arguments:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
  
  return descriptor;
}

// Class decorator
function Serializable<T extends { new(...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    toJSON() {
      return JSON.stringify(this);
    }
  };
}

@Serializable
class User {
  constructor(public name: string, public email: string) {}
  
  @Logged
  getFullInfo() {
    return `${this.name} (${this.email})`;
  }
}

// Parameter decorator
function Validate(target: any, propertyKey: string | symbol, parameterIndex: number) {
  // Store metadata about which parameters to validate
}

/*
EVALUATION CRITERIA:
✓ Understands decorator syntax and order
✓ Implements method decorators
✓ Implements class decorators
✓ Knows parameter decorators
✓ Understands decorator factory pattern
✓ Real-world use cases (logging, validation, ORM)
✓ Knows experimental feature status
*/


// ============================================
// QUESTION 6: Advanced Utility Types
// ============================================
/*
QUESTION:
Demonstrate usage of advanced TypeScript utility types:
Partial, Pick, Omit, Record, Readonly
*/

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Partial - all properties optional
type PartialProduct = Partial<Product>;

// Pick - select specific properties
type ProductName = Pick<Product, 'id' | 'name'>;

// Omit - exclude specific properties
type ProductPreview = Omit<Product, 'description'>;

// Record - map keys to values
type CategoryProducts = Record<'electronics' | 'books' | 'clothes', Product[]>;

// Readonly - make properties immutable
type ReadonlyProduct = Readonly<Product>;

// Combining utilities
type ProductUpdate = Partial<Omit<Product, 'id'>>;

function updateProduct(product: Product, update: ProductUpdate): Product {
  return { ...product, ...update };
}

// Extract and Exclude
type StringOrNumber = string | number | boolean;
type StringOnly = Exclude<StringOrNumber, number | boolean>;
type NumberOrBoolean = Extract<StringOrNumber, number | boolean>;

/*
EVALUATION CRITERIA:
✓ Correctly uses Partial
✓ Correctly uses Pick and Omit
✓ Correctly uses Record
✓ Correctly uses Readonly
✓ Understands Extract and Exclude
✓ Combines utility types effectively
✓ Real-world practical applications
*/


// ============================================
// QUESTION 7: Generics with Constraints
// ============================================
/*
QUESTION:
Implement a reusable data repository with generic constraints.
*/

interface Repository {
  id: string;
}

interface User extends Repository {
  name: string;
  email: string;
}

interface Post extends Repository {
  title: string;
  content: string;
  authorId: string;
}

class DataStore<T extends Repository> {
  private items: Map<string, T> = new Map();
  
  add(item: T): void {
    this.items.set(item.id, item);
  }
  
  get(id: string): T | undefined {
    return this.items.get(id);
  }
  
  getAll(): T[] {
    return Array.from(this.items.values());
  }
  
  update(id: string, changes: Partial<T>): T | undefined {
    const item = this.items.get(id);
    if (!item) return undefined;
    
    const updated = { ...item, ...changes };
    this.items.set(id, updated);
    return updated;
  }
  
  delete(id: string): boolean {
    return this.items.delete(id);
  }
}

// Usage:
const userStore = new DataStore<User>();
userStore.add({ id: '1', name: 'John', email: 'john@example.com' });

const postStore = new DataStore<Post>();
postStore.add({ id: '1', title: 'Hello', content: 'World', authorId: '1' });

/*
EVALUATION CRITERIA:
✓ Properly constrains generic type
✓ Implements CRUD operations
✓ Uses Partial<T> for updates
✓ Type-safe generic methods
✓ Proper return types
✓ Real-world repository pattern
*/


// ============================================
// QUESTION 8: Module and Namespace Management
// ============================================
/*
QUESTION:
Organize code using TypeScript modules and explain
the difference between namespaces and modules.
*/

// File: models/user.ts
export interface User {
  id: string;
  name: string;
}

export class UserModel {
  constructor(private data: User) {}
  
  getName(): string {
    return this.data.name;
  }
}

// File: services/userService.ts
export interface IUserService {
  getUser(id: string): Promise<User>;
  createUser(user: User): Promise<User>;
}

export class UserService implements IUserService {
  async getUser(id: string): Promise<User> {
    // API call
    return { id, name: 'John' };
  }
  
  async createUser(user: User): Promise<User> {
    // API call
    return user;
  }
}

// File: app.ts - Consumer
import { User, UserModel } from './models/user';
import { IUserService, UserService } from './services/userService';

const service: IUserService = new UserService();

/*
EVALUATION CRITERIA:
✓ Proper module exports
✓ Uses interfaces for contracts
✓ Dependency injection understanding
✓ Knows modules vs namespaces
✓ Proper import/export syntax
✓ Clean separation of concerns
*/


// ============================================
// QUESTION 9: Async/Await and Promise Typing
// ============================================
/*
QUESTION:
Implement typed async/await patterns for API calls.
*/

interface ApiResponse<T> {
  status: number;
  data: T;
}

interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: User = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fetch error:', error.message);
    }
    throw error;
  }
}

// Typed Promise utility
function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(value), ms);
  });
}

// Handling multiple async operations
async function fetchUserData(userId: string) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId)
  ]);
  
  return { user, posts };
}

async function fetchUserPosts(userId: string): Promise<any[]> {
  // Implementation
  return [];
}

/*
EVALUATION CRITERIA:
✓ Proper async function signatures
✓ Correctly typed Promise returns
✓ Error handling with type guards
✓ Proper try/catch typing
✓ Generic Promise patterns
✓ Handles multiple async operations
*/


// ============================================
// QUESTION 10: Conditional Types
// ============================================
/*
QUESTION:
Implement conditional types for flexible type definitions.
*/

// Simple conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<'hello'>;  // true
type B = IsString<42>;       // false

// Conditional types with generics
type Flatten<T> = T extends Array<infer U> ? U : T;

type Str = Flatten<string[]>;     // string
type Num = Flatten<number>;       // number

// Practical example: API response types
type ApiReturnType<T> = T extends { data: infer U }
  ? U
  : T extends Promise<infer U>
  ? U
  : never;

interface UserResponse {
  data: User;
}

type ExtractedUser = ApiReturnType<UserResponse>;  // User
type ExtractedPromise = ApiReturnType<Promise<User>>;  // User

// Distributive conditional types
type ExtractArray<T> = T extends Array<infer U> ? U : T;

type Mixed = ExtractArray<string | string[] | number>;  // string | number

/*
EVALUATION CRITERIA:
✓ Understands conditional syntax
✓ Uses 'infer' keyword correctly
✓ Distributive conditionals
✓ Real-world type extraction
✓ Complex nested conditionals
✓ Performance considerations
*/


// ============================================
// QUESTION 11: Mapped Types Advanced
// ============================================
/*
QUESTION:
Create advanced mapped types for transforming object structures.
*/

// Basic mapped type - readonly version
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Make all properties optional
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Get only property names of a certain type
type PropertyNames<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  email: string;
}

type StringPropertyNames = PropertyNames<User, string>; // 'name' | 'email'

// Transform properties to getters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getId: () => number, getName: () => string, getEmail: () => string }

// Property mapping with conditionals
type Flatten<T> = {
  [K in keyof T]: T[K] extends { unwrap: () => infer U } ? U : T[K];
};

// Extract union from object properties
type UnionProperties<T> = T[keyof T];

type UserUnion = UnionProperties<User>; // number | string


// ============================================
// QUESTION 12: Infer in Conditional Types
// ============================================
/*
QUESTION:
Deep dive into 'infer' keyword for type extraction.
*/

// Extract function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type MyReturn = ReturnType<() => string>; // string

// Extract function parameters
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

type MyParams = Parameters<(a: string, b: number) => void>; // [string, number]

// Extract constructor parameters
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;

class MyClass {
  constructor(a: string, b: number) {}
}

type MyCtorParams = ConstructorParameters<typeof MyClass>; // [string, number]

// Recursive type extraction
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type PromiseReturn = Awaited<Promise<Promise<string>>>; // string

// Extract tuple types
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;
type Tail<T extends any[]> = T extends [any, ...infer T] ? T : never;

type FirstElement = Head<[string, number, boolean]>; // string
type RestElements = Tail<[string, number, boolean]>; // [number, boolean]

// Recursive property access type
type DeepProperty<T, K extends string> = K extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? DeepProperty<T[First], Rest>
    : never
  : K extends keyof T
  ? T[K]
  : never;

interface Config {
  db: {
    host: string;
    port: number;
  };
}

type DbHost = DeepProperty<Config, 'db.host'>; // string


// ============================================
// QUESTION 13: Type Guards and Assertions
// ============================================
/*
QUESTION:
Advanced type guards and assertion signatures.
*/

// Custom type predicate
function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string'
  );
}

// Assertion signature - tells TypeScript to narrow type
function assertIsUser(val: unknown): asserts val is User {
  if (!isUser(val)) {
    throw new Error('Not a user');
  }
}

function process(data: unknown) {
  assertIsUser(data);
  // data is now User
  console.log(data.name);
}

// Generic type assertion
function assertType<T>(val: unknown, check: (v: unknown) => boolean): asserts val is T {
  if (!check(val)) {
    throw new Error('Type assertion failed');
  }
}

// Assertion function for arrays
function assertIsArray<T>(val: unknown): asserts val is T[] {
  if (!Array.isArray(val)) {
    throw new Error('Not an array');
  }
}

function processArray(data: unknown) {
  assertIsArray<User>(data);
  data.forEach(user => console.log(user.name));
}


// ============================================
// QUESTION 14: Variance in TypeScript
// ============================================
/*
QUESTION:
Understand and work with covariance, contravariance, and invariance.
*/

// Covariance - can use subtype where parent type expected
interface Animal {
  name: string;
}

interface Dog extends Animal {
  bark(): void;
}

type AnimalReader = () => Animal;
type DogReader = () => Dog;

// DogReader can be used where AnimalReader is expected (covariant)
const getDog: DogReader = () => ({ name: 'Rex', bark: () => {} });
const getAnimal: AnimalReader = getDog; // OK

// Contravariance - parameter types
type AnimalProcessor = (animal: Animal) => void;
type DogProcessor = (dog: Dog) => void;

const processAnimal: AnimalProcessor = (animal) => console.log(animal.name);
const processDog: DogProcessor = processAnimal; // Error - contravariance!

const processDog2: DogProcessor = processAnimal as any; // Would work with any input

// Invariance - arrays are invariant (not covariant for mutations)
const dogs: Dog[] = [{ name: 'Rex', bark: () => {} }];
const animals: Animal[] = dogs; // WARNING: This is unsound in JS but TS allows it

// Proper workaround with readonly
type ReadonlyArray<T> = readonly T[];
const readonlyDogs: ReadonlyArray<Dog> = dogs;
const readonlyAnimals: ReadonlyArray<Animal> = readonlyDogs; // OK


// ============================================
// QUESTION 15: Template Literal Types
// ============================================
/*
QUESTION:
Use template literal types for string literal unions and paths.
*/

// Simple template literal type
type Direction = 'top' | 'bottom' | 'left' | 'right';
type EdgePosition = `${Direction}-edge`;
// 'top-edge' | 'bottom-edge' | 'left-edge' | 'right-edge'

// Creating database column names
type Columns = 'id' | 'username' | 'email';
type TableQuery = `SELECT ${Columns} FROM users`;

// Database getter/setter names
type Getters<T extends Record<string, any>> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Setters<T extends Record<string, any>> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (v: T[K]) => void;
};

// File path type safety
type ObjectPath<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]: T[K] extends Record<string, unknown>
        ? `${string & K}.${ObjectPath<T[K]>}`
        : `${string & K}`;
    }[keyof T]
  : never;

interface Config {
  db: { host: string; port: number };
  app: { name: string };
}

type ValidPaths = ObjectPath<Config>;
// 'db.host' | 'db.port' | 'app.name'

// Event handler type creation
type EventHandlers<T extends Record<string, any>> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

type FormHandlers = EventHandlers<FormState>;
// { onUsername: (v: string) => void, onPassword: ..., onRemember: ... }


// ============================================
// QUESTION 16: ThisType and method chaining
// ============================================
/*
QUESTION:
Use ThisType for method chaining and builder patterns.
*/

interface ChainBuilder {
  add(n: number): this;
  multiply(n: number): this;
  getValue(): number;
}

class Calculator implements ChainBuilder {
  private value = 0;

  add(n: number): this {
    this.value += n;
    return this;
  }

  multiply(n: number): this {
    this.value *= n;
    return this;
  }

  getValue(): number {
    return this.value;
  }
}

const result = new Calculator()
  .add(5)
  .multiply(2)
  .add(3)
  .getValue(); // 13

// Builder pattern with ThisType
type Builder<T> = {
  [K in keyof T]: (value: T[K]) => Builder<T>;
} & { build(): T };

function createBuilder<T>(defaults: T): Builder<T> {
  const obj = { ...defaults };
  
  return new Proxy(obj, {
    get: (target, prop: string) => {
      if (prop === 'build') {
        return () => ({ ...target });
      }
      return (value: any) => {
        (target as any)[prop] = value;
        return createBuilder({ ...target });
      };
    }
  }) as Builder<T>;
}

const user = createBuilder({ name: '', email: '' })
  .name('John')
  .email('john@example.com')
  .build();


// ============================================
// QUESTION 17: Namespace and Module Types
// ============================================
/*
QUESTION:
Organize types using namespaces and ambient type declarations.
*/

// Namespacing types
namespace API {
  export interface Request {
    method: string;
    url: string;
  }

  export interface Response<T> {
    status: number;
    data: T;
  }

  export namespace Auth {
    export interface Token {
      access: string;
      refresh: string;
    }
  }
}

// Using namespaced types
const req: API.Request = { method: 'GET', url: '/api/users' };
const token: API.Auth.Token = { access: 'xxx', refresh: 'yyy' };

// Ambient type declarations (d.ts files)
// window.d.ts
declare global {
  interface Window {
    myCustomAPI: {
      getData(): Promise<any>;
    };
  }
}

// Library augmentation
declare module 'express' {
  interface Request {
    user?: User;
  }
}


// ============================================
// QUESTION 18: Type Predicates and Narrowing
// ============================================
/*
QUESTION:
Create type predicates for runtime type checking.
*/

// Custom type guard with predicate
function isNumberArray(value: unknown): value is number[] {
  return (
    Array.isArray(value) &&
    value.every(item => typeof item === 'number')
  );
}

function process(value: unknown) {
  if (isNumberArray(value)) {
    value.reduce((a, b) => a + b, 0); // value is number[]
  }
}

// Object shape validation
interface User {
  id: number;
  name: string;
}

function hasProperty<T extends object, K extends PropertyKey>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

// Type narrowing with switch
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

function handleRequest(method: HttpMethod) {
  switch (method) {
    case 'GET':
      // method is 'GET'
      break;
    case 'POST':
      // method is 'POST'
      break;
  }
}

// Discriminated unions for exhaustiveness
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function handleResult<T>(result: Result<T>) {
  if (result.success) {
    return result.data;
  } else {
    throw result.error;
  }
}


// ============================================
// QUESTION 19: Advanced Generics Constraints
// ============================================
/*
QUESTION:
Deep dive into generic constraints and bounds.
*/

// Key constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const obj = { a: 1, b: 'hello' };
const val1 = getProperty(obj, 'a'); // number
const val2 = getProperty(obj, 'b'); // string
// getProperty(obj, 'c'); // Error

// Multiple constraints
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b } as T & U;
}

// Constrain to function types
function createCallback<T extends (...args: any[]) => any>(fn: T): T {
  return fn;
}

// Length constraints
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength('text'); // string has length
getLength([1, 2, 3]); // array has length
getLength({ length: 5 }); // object with length property

// Default type parameters
type Container<T = string> = {
  value: T;
};

const stringContainer: Container = { value: 'hello' };
const numberContainer: Container<number> = { value: 42 };


// ============================================
// QUESTION 20: Const Type Parameters
// ============================================
/*
QUESTION:
Use const type parameters for literal type inference.
*/

// Without const - infers widened type
function createObject(value) {
  return { value }; // value is widened
}

const obj1 = createObject(42); // { value: number }

// With const - preserves literal type
function createObjectConst<const T>(value: T) {
  return { value }; // value preserves literal type
}

const obj2 = createObjectConst(42 as const); // { value: 42 }
const obj3 = createObjectConst('hello' as const); // { value: 'hello' }

// Practical: Builder with const generics
function createBuilder2<const T extends Record<string, any>>(defaults: T) {
  return {
    set<K extends keyof T>(key: K, value: T[K]) {
      return { ...defaults, [key]: value };
    }
  };
}

const builder = createBuilder2({ name: '', age: 0 });
const updated = builder.set('name', 'John'); // Correct types


// ============================================
// QUESTION 21: Exhaustiveness Checking
// ============================================
/*
QUESTION:
Ensure all union cases are handled using exhaustiveness checking.
*/

type Action = 
  | { type: 'ADD'; payload: number }
  | { type: 'REMOVE'; payload: string }
  | { type: 'CLEAR' };

function handleAction(action: Action) {
  switch (action.type) {
    case 'ADD':
      console.log(action.payload); // number
      break;
    case 'REMOVE':
      console.log(action.payload); // string
      break;
    case 'CLEAR':
      // no payload
      break;
    // Missing a case will cause error
    // default: _exhaustiveSwitchCheck(action);
  }
}

function _exhaustiveSwitchCheck(x: never): never {
  throw new Error('Exhaustive switch check failed');
}

// Reducer with exhaustiveness
function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'ADD':
      return state + action.payload;
    case 'REMOVE':
      return state; // Remove needs different logic
    case 'CLEAR':
      return 0;
    default:
      return _exhaustiveSwitchCheck(action);
  }
}


// ============================================
// QUESTION 22: Branded Types and Nominal Typing
// ============================================
/*
QUESTION:
Create branded types for type safety (nominal typing simulation).
*/

// Branded type for user IDs
type UserId = string & { readonly __brand: 'UserId' };

function UserId(id: string): UserId {
  return id as UserId;
}

type PostId = string & { readonly __brand: 'PostId' };

function PostId(id: string): PostId {
  return id as PostId;
}

function getUser(id: UserId) {
  console.log('Fetching user', id);
}

const userId = UserId('123');
getUser(userId); // OK

const postId = PostId('456');
// getUser(postId); // Error - PostId is not UserId

// Currency example
type USD = number & { readonly __brand: 'USD' };
type EUR = number & { readonly __brand: 'EUR' };

function USD(amount: number): USD {
  return amount as USD;
}

function payUSD(amount: USD) {
  console.log('Paying', amount, 'USD');
}

payUSD(USD(100)); // OK
// payUSD(100); // Error
// payUSD(EUR(100) as any); // Would leak type!

// Validated string type
type Email = string & { readonly __brand: 'Email' };

function Email(email: string): Email | null {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? (email as Email) : null;
}

function sendEmail(email: Email) {
  console.log('Sending to', email);
}

const email = Email('test@example.com');
if (email) {
  sendEmail(email); // Only if validation passed
}


// ============================================
// QUESTION 23: Pick and Omit Deep Versions
// ============================================
/*
QUESTION:
Create recursive Pick and Omit for nested objects.
*/

// Deep Partial
type DeepPartial<T> = T extends object ? {
  [K in keyof T]?: DeepPartial<T[K]>;
} : T;

interface User {
  id: number;
  profile: {
    name: string;
    contact: {
      email: string;
      phone: string;
    };
  };
}

type PartialUser = DeepPartial<User>;
// Can now set any nested property as optional

// Deep Readonly
type DeepReadonly<T> = T extends object ? {
  readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;

// Deep Pick - select nested properties
type DeepPick<T, K extends string> = K extends `${infer F}.${infer R}`
  ? { [P in F]: DeepPick<T[P], R> }
  : Pick<T, K & keyof T>;

type UserNameEmail = DeepPick<User, 'profile.name' | 'profile.contact.email'>;


// ============================================
// QUESTION 24: Error Handling with Types
// ============================================
/*
QUESTION:
Create type-safe error handling patterns.
*/

// Result type pattern
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  return result.ok ? { ok: true, value: fn(result.value) } : result;
}

function flatMapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  return result.ok ? fn(result.value) : result;
}

// Using Result
function divide(a: number, b: number): Result<number, string> {
  return b === 0
    ? { ok: false, error: 'Division by zero' }
    : { ok: true, value: a / b };
}

const result = divide(10, 2);
const squared = mapResult(result, x => x * x);

// Error context
interface ErrorContext {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

type ResultWithContext<T> = Result<T, ErrorContext>;


// ============================================
// QUESTION 25: Performance Optimization in TypeScript
// ============================================
/*
QUESTION:
Optimize TypeScript compilation performance.
Avoid problematic patterns that slow down type checking.
*/

// BAD: Circular dependencies
// export interface A extends B {}
// export interface B extends A {}

// BAD: Overly complex mapped types
// type TooComplex<T> = { [K in keyof T as T[K] extends ... ]: ... }

// GOOD: Distribute union evaluation
type FlattenUnion<T> = T extends object ? T : never;

// BAD: Deep recursion without base case
// type Deep<T> = T extends Array<infer U> ? Deep<U> : T;

// GOOD: Recursion with limits
type DeepFlattenLimited<T, D extends number = 3> = D extends 0
  ? T
  : T extends Array<infer U>
  ? DeepFlattenLimited<U, [-1, 0, 1, 2][D]>
  : T;

// Use const type parameters for better inference
function processItems<const T extends readonly unknown[]>(...items: T): T {
  return items;
}

// Avoid index signatures when possible
interface BadInterface {
  [key: string]: any;
}

interface GoodInterface {
  name: string;
  age: number;
  // Explicit properties perform better than index signatures
}

/*
GENERAL PERFORMANCE TIPS:
✓ Avoid circular type references
✓ Limit recursion depth
✓ Use distributed conditional types
✓ Prefer explicit properties to index signatures
✓ Cache computed types in variables
✓ Use const type parameters
✓ Avoid overly complex conditional logic
✓ Enable isolatedModules for parallel compilation
*/
