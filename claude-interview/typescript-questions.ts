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


// ============================================
// QUESTION 26: The satisfies Operator
// ============================================
/*
QUESTION:
What is the difference between `as`, type annotation, and `satisfies`?
Given the following code, explain what type each variable has and which
approach catches the most errors at compile time.

TRICKY PART: satisfies validates without widening — the inferred type
is preserved, not replaced by the annotated type.
*/

type ColorMap = Record<string, string | [number, number, number]>;

// Type annotation — widened to ColorMap, loses literal knowledge
const colors1: ColorMap = {
  red: [255, 0, 0],
  blue: 'blue',
  green: [0, 255, 0],
};
// colors1.red is string | [number, number, number] — TS lost the tuple info
// colors1.red.toUpperCase(); // ERROR — could be array

// satisfies — validates against ColorMap but KEEPS inferred type
const colors2 = {
  red: [255, 0, 0],
  blue: 'blue',
  green: [0, 255, 0],
} satisfies ColorMap;
// colors2.red is [number, number, number] — tuple preserved!
colors2.red[0];            // OK — TS knows it's a tuple
colors2.blue.toUpperCase(); // OK — TS knows it's a string

// as — no validation at all, just assertion
const colors3 = { red: 'oops' } as ColorMap; // no error, wrong data

// Practical: config object that must match a shape but retain literal types
type Routes = Record<string, { path: string; exact?: boolean }>;
const routes = {
  home:    { path: '/' },
  about:   { path: '/about', exact: true },
  // missing:  { pat: '/typo' }, // satisfies catches typos — annotation doesn't always
} satisfies Routes;

/*
EVALUATION CRITERIA:
✓ satisfies validates without widening the inferred type
✓ Type annotation replaces the inferred type with the annotated one (widening)
✓ as is an escape hatch — no validation, just trust the developer
✓ satisfies is ideal for config/record objects where you need autocomplete + narrowing
✓ satisfies introduced in TypeScript 4.9
✓ satisfies + const = narrowest possible type with shape validation
*/


// ============================================
// QUESTION 27: Variance Annotations (in/out)
// ============================================
/*
QUESTION:
TypeScript 4.7 introduced explicit variance annotations (in, out).
Explain covariance vs contravariance with a real example, then show
how in/out annotations improve type checking and performance.

TRICKY PART: Function parameters are contravariant; return types are covariant.
*/

// Without annotation — TS must structurally compute variance
interface Producer<T> {
  produce(): T;
}

interface Consumer<T> {
  consume(value: T): void;
}

// With explicit variance annotation — faster checking, clearer intent
interface CovariantBox<out T> {       // out = covariant = read-only producer
  getValue(): T;
  // setValue(v: T): void; // Error! 'out' params cannot appear in contravariant position
}

interface ContravariantSink<in T> {   // in = contravariant = write-only consumer
  accept(value: T): void;
  // getValue(): T; // Error! 'in' params cannot appear in covariant position
}

class Mammal { name = 'mammal'; }
class Canine extends Mammal { bark() {} }

// Covariance: CovariantBox<Canine> is assignable to CovariantBox<Mammal>
const dogBox: CovariantBox<Canine> = { getValue: () => new Canine() };
const animalBox: CovariantBox<Mammal> = dogBox; // ✓ Canine is subtype of Mammal

// Contravariance: ContravariantSink<Mammal> is assignable to ContravariantSink<Canine>
const animalSink: ContravariantSink<Mammal> = { accept: (a) => console.log(a.name) };
const dogSink: ContravariantSink<Canine> = animalSink; // ✓ can accept more general type

/*
EVALUATION CRITERIA:
✓ Covariance: subtype can replace supertype (out/read positions)
✓ Contravariance: supertype can replace subtype (in/write positions)
✓ Function params are contravariant; return types are covariant
✓ in/out annotations prevent incorrect usage at the definition site
✓ Explicit variance speeds up type checking (TS skips structural computation)
✓ Arrays are bivariant in TS by default (unsound) — readonly arrays are covariant
*/


// ============================================
// QUESTION 28: Function Overloads — Tricky Signatures
// ============================================
/*
QUESTION:
Implement a createElement function with overloads that returns the
correct HTMLElement subtype based on the tag string. Why must the
implementation signature NOT be visible to callers?
*/

function createElement(tag: 'a'): HTMLAnchorElement;
function createElement(tag: 'canvas'): HTMLCanvasElement;
function createElement(tag: 'table'): HTMLTableElement;
function createElement(tag: string): HTMLElement;
// Implementation signature — NOT part of the public API
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// Callers see only overload signatures
const anchor = createElement('a');         // HTMLAnchorElement
anchor.href = '/home';                     // ✓ — anchor-specific property
const canvas = createElement('canvas');    // HTMLCanvasElement
canvas.getContext('2d');                   // ✓
// createElement('a' as string);           // HTMLElement — falls through to generic

// Overloads for union return types based on input
function parse(input: string): string[];
function parse(input: number): number;
function parse(input: string | number): string[] | number {
  if (typeof input === 'string') return input.split(',');
  return input * 2;
}
// parse('a,b') is string[]  — not string[] | number
// parse(5) is number

/*
EVALUATION CRITERIA:
✓ Implementation signature is invisible to callers — it's purely for implementation
✓ Each overload is checked top-to-bottom — order matters (specific before general)
✓ Implementation must be compatible with ALL overload signatures
✓ Better than union return type — callers get precise type without narrowing
✓ Alternative: conditional types + generics (more complex, sometimes clearer)
✓ Maximum ~5-6 overloads before readability degrades — use generics instead
*/


// ============================================
// QUESTION 29: Variadic Tuple Types and Labeled Tuples
// ============================================
/*
QUESTION:
Use variadic tuple types (...T) and labeled tuples to build type-safe
function composition and a zip utility. Predict the inferred type of
each result.
*/

// Labeled tuples (TS 4.0) — improve error messages and documentation
type Point2D = [x: number, y: number];
type Point3D = [x: number, y: number, z: number];

// Variadic tuples — spread another tuple type
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type ThreeD = Concat<Point2D, [z: number]>; // [x: number, y: number, z: number]

// Prepend / append
type Prepend<T, Tuple extends unknown[]> = [T, ...Tuple];
type Append<Tuple extends unknown[], T> = [...Tuple, T];

type WithId = Prepend<string, Point2D>;    // [string, x: number, y: number]
type WithLabel = Append<Point2D, string>;  // [x: number, y: number, string]

// Type-safe pipe — infer input/output of composed functions
type PipeArgs<Fns extends ((...args: any[]) => any)[]> =
  Fns extends [infer First extends (...args: any[]) => any, ...infer Rest extends ((...args: any[]) => any)[]]
    ? [Parameters<First>[0], ...{ [K in keyof Rest]: Rest[K] extends (...args: any[]) => any ? ReturnType<Rest[K]> : never }]
    : never;

// Zip two tuples element-wise
type Zip<T extends unknown[], U extends unknown[]> = {
  [K in keyof T]: K extends keyof U ? [T[K], U[K]] : never;
};

type Zipped = Zip<[string, number], [boolean, Date]>;
// [[string, boolean], [number, Date]]

/*
EVALUATION CRITERIA:
✓ Variadic tuples: [...T, ...U] — spread in type position
✓ Labeled tuples improve error messages but don't affect runtime
✓ keyof on a tuple type yields numeric string indices
✓ Spread tuple in function params: fn(...args: [...T, U]) allows flexible signatures
✓ Conditional type distribution over tuple elements via mapped type
✓ Optional tuple elements: [string, number?] — rest must be at the end
*/


// ============================================
// QUESTION 30: The override Keyword
// ============================================
/*
QUESTION:
What problem does the override keyword solve? Show a case where
omitting override hides a bug, then fix it with the noImplicitOverride
compiler flag.
*/

class BaseLogger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
  // Later: log is renamed to record in BaseLogger
}

class ChildLogger extends BaseLogger {
  // WITHOUT override: if BaseLogger renames log() → record(), this method
  // silently becomes a NEW method instead of an override — no compile error
  // override log(message: string): void {   // ← with 'override', rename breaks here

  override log(message: string): void {       // Error if base method doesn't exist
    console.log(`[CHILD] ${message}`);
    super.log(message);
  }
}

// With noImplicitOverride: true in tsconfig, ALL overrides must use 'override'
// Without the flag, 'override' is optional (no error if omitted on a real override)

abstract class Shape {
  abstract area(): number;

  // Template method — calls abstract method
  describe(): string {
    return `Area is ${this.area().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }

  override area(): number {  // must match signature exactly
    return Math.PI * this.radius ** 2;
  }
}

/*
EVALUATION CRITERIA:
✓ override causes compile error if base class method doesn't exist
✓ Catches bugs when base class refactors method names
✓ noImplicitOverride forces ALL overrides to be explicit
✓ Works with both regular and abstract methods
✓ override doesn't change runtime behaviour — purely compile-time safety
✓ Pairs well with sealed class patterns to prevent unintentional overrides
*/


// ============================================
// QUESTION 31: Declaration Merging
// ============================================
/*
QUESTION:
Explain interface merging, namespace merging, and module augmentation.
Show how to extend a third-party library's types (e.g., add a user
property to Express Request).
*/

// Interface merging — two declarations of the same interface are combined
interface Window {
  myAnalytics: { track(event: string): void };
}

interface Window {
  myFeatureFlags: Record<string, boolean>;
}
// Result: Window has BOTH myAnalytics and myFeatureFlags

// Namespace + class merging — add static members to a class
class Validator {
  validate(input: string): boolean { return input.length > 0; }
}

namespace Validator {
  export const maxLength = 255;
  export function sanitise(input: string): string {
    return input.trim().slice(0, maxLength);
  }
}

// Validator.maxLength — static namespace member
// new Validator().validate(…) — instance method

// Module augmentation — extend third-party types (in a real project with express installed)
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: { id: string; role: string };
//     requestId: string;
//   }
// }
// Now req.user and req.requestId are typed throughout the Express app

// Merging order matters for overloads: last declaration wins for conflicts,
// later declarations' overloads are tried FIRST (reverse order)

/*
EVALUATION CRITERIA:
✓ Interface merging is additive — no conflicts unless same property has different types
✓ Class + namespace merging adds static-like members
✓ Module augmentation uses declare module + interface merging
✓ Cannot merge two classes or two enums with the same name
✓ Global augmentation: declare global { interface Window { … } }
✓ Knows the overload priority order for merged interfaces
*/


// ============================================
// QUESTION 32: Index Access Types (Lookup Types)
// ============================================
/*
QUESTION:
Use index access types (T[K]) to derive types from nested structures.
Explain the difference between T[keyof T] and T[K] where K extends keyof T.
*/

interface Config {
  server: {
    host: string;
    port: number;
    ssl: boolean;
  };
  database: {
    url: string;
    poolSize: number;
  };
  features: string[];
}

// Access a nested property type
type ServerConfig = Config['server'];                     // { host: string; port: number; ssl: boolean }
type DbUrl = Config['database']['url'];                   // string
type FeatureItem = Config['features'][number];            // string (array element type)

// T[keyof T] — union of ALL value types
type ConfigValues = Config[keyof Config];
// { host: string; port: number; ssl: boolean } | { url: string; poolSize: number } | string[]

// Constrained access — avoids the wide union
function getConfigSection<K extends keyof Config>(key: K): Config[K] {
  // This return type is Config[K] — caller gets the precise type for the key they passed
  return {} as Config[K];
}

const server = getConfigSection('server'); // type is Config['server'], not ConfigValues

// Tuple index access
type RGB = [r: number, g: number, b: number];
type Red = RGB[0];   // number
type All = RGB[number]; // number (union of all element types)

/*
EVALUATION CRITERIA:
✓ T[K] extracts the type at key K from type T
✓ T[keyof T] is a union of all value types — often too wide
✓ Constrained generic K extends keyof T preserves the specific key
✓ Tuple index: T[0], T[1], or T[number] for element union
✓ Array element type: T extends (infer U)[] ? U : never OR T[number]
✓ Chaining: T['a']['b']['c'] drills into nested types
*/


// ============================================
// QUESTION 33: NoInfer<T> Utility Type
// ============================================
/*
QUESTION:
TypeScript 5.4 introduced NoInfer<T>. What problem does it solve?
Show the before/after with a createStateMachine function where
the default state must be one of the provided states.
*/

// PROBLEM: TS widens inference to include the default — allows invalid defaults
function createStateMachineBefore<S extends string>(
  states: S[],
  initial: S  // TS infers S from BOTH states array AND initial — initial widens S
): { current: S; transition(to: S): void } {
  return { current: initial, transition(to) { console.log(to); } };
}

// initial: 'invalid' causes 'invalid' to be added to S — no error!
const bad = createStateMachineBefore(['idle', 'running'], 'invalid' as any);

// SOLUTION with NoInfer<T> — prevents initial from contributing to inference of S
function createStateMachine<S extends string>(
  states: S[],
  initial: NoInfer<S>  // S is inferred from states ONLY; initial just validated against it
): { current: S; transition(to: S): void } {
  if (!states.includes(initial)) throw new Error(`Invalid state: ${initial}`);
  return { current: initial, transition(to) { console.log(to); } };
}

const machine = createStateMachine(['idle', 'running', 'stopped'], 'idle');  // OK
// createStateMachine(['idle', 'running'], 'invalid'); // Error! 'invalid' not in S

/*
EVALUATION CRITERIA:
✓ Without NoInfer, TypeScript infers S from all positions simultaneously
✓ NoInfer<T> makes T's position opaque to inference — it only validates
✓ S is inferred from states[], then initial is checked against inferred S
✓ Introduced in TS 5.4 — previously needed workarounds like [S] extends [never]
✓ Common use: default values, fallback types, tag/key parameters
✓ Similar workaround: S & {} prevents widening in older TS versions
*/


// ============================================
// QUESTION 34: using and await using (Explicit Resource Management)
// ============================================
/*
QUESTION:
TypeScript 5.2 supports the `using` keyword for deterministic resource
disposal. Implement a database connection pool that auto-releases when
the using block exits.
*/

// A resource must implement [Symbol.dispose]()
class DbConnection {
  constructor(private id: number) {
    console.log(`Connection ${id} acquired`);
  }

  query(sql: string) {
    return `Result of: ${sql}`;
  }

  // [Symbol.dispose]() requires tsconfig lib: ["ESNext.Disposable"]
  // Shown as string key to avoid compiler error in standard configs
  ['Symbol.dispose' as any]() {
    console.log(`Connection ${this.id} released`);
    // runs automatically when `using` block exits (even on throw)
  }
}

class AsyncDbConnection {
  constructor(private id: number) {}

  async query(sql: string) { return sql; }

  // [Symbol.asyncDispose]() requires tsconfig lib: ["ESNext.Disposable"]
  async ['Symbol.asyncDispose' as any]() {
    await new Promise(r => setTimeout(r, 10)); // async teardown
    console.log(`Async connection ${this.id} released`);
  }
}

function getConnection(id: number) { return new DbConnection(id); }
async function getAsyncConnection(id: number) { return new AsyncDbConnection(id); }

function processData() {
  using conn = getConnection(1);      // TS 5.2 — synchronous disposal
  const result = conn.query('SELECT 1');
  console.log(result);
  // conn[Symbol.dispose]() called here automatically — even if exception thrown
}

async function processAsync() {
  await using conn = await getAsyncConnection(2); // async disposal
  await conn.query('SELECT 2');
  // conn[Symbol.asyncDispose]() called here with await
}

/*
EVALUATION CRITERIA:
✓ using calls [Symbol.dispose]() at end of block (like try/finally)
✓ await using calls [Symbol.asyncDispose]() with await — must be in async fn
✓ Disposal happens in LIFO order when multiple using in same block
✓ Replaces verbose try/finally resource cleanup patterns
✓ Must target ES2022+ with lib: ["ES2022", "ESNext.Disposable"]
✓ DisposableStack / AsyncDisposableStack for composing multiple resources
*/


// ============================================
// QUESTION 35: Accessor Keyword (TypeScript 4.9)
// ============================================
/*
QUESTION:
What does the accessor keyword do in a TypeScript class?
How does it differ from a plain getter/setter pair?
Show a use case with validation and change tracking.
*/

class ReactiveModel {
  // accessor auto-generates a private backing field + get/set pair
  // The backing field name is implementation detail — not accessible directly
  accessor firstName: string = '';
  accessor lastName: string = '';

  // Under the hood, `accessor x = val` is roughly:
  // #x = val;
  // get x() { return this.#x; }
  // set x(v) { this.#x = v; }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim();
  }
}

// accessor enables DECORATOR-BASED interception — a key use case
function validate(min: number, max: number) {
  return function<T, V extends number>(
    target: ClassAccessorDecoratorTarget<T, V>,
    ctx: ClassAccessorDecoratorContext<T, V>
  ): ClassAccessorDecoratorResult<T, V> {
    return {
      get() { return target.get.call(this); },
      set(value: V) {
        if (value < min || value > max) {
          throw new RangeError(`${String(ctx.name)} must be between ${min} and ${max}`);
        }
        target.set.call(this, value);
      },
    };
  };
}

class Temperature {
  @validate(-273.15, 1e6)
  accessor celsius: number = 0;
}

const t = new Temperature();
t.celsius = 100;   // OK
// t.celsius = -300; // RangeError

/*
EVALUATION CRITERIA:
✓ accessor generates private backing field + get/set automatically
✓ Unlike get/set pair, accessor is a single declaration — fewer lines
✓ Key benefit: accessor is interceptable by Stage 3 decorators
✓ get/set on prototype are NOT interceptable by class field decorators
✓ ClassAccessorDecoratorTarget provides typed get/set for the backing field
✓ accessor fields are initialized in the instance (like regular fields)
*/


// ============================================
// QUESTION 36: Mixin Pattern in TypeScript
// ============================================
/*
QUESTION:
Implement type-safe mixins using constructor intersection. Create
Serializable and Validatable mixins and apply them to a base class.
*/

// Mixin function type — takes a constructor, returns augmented constructor
type MixinConstructor<T = {}> = new (...args: any[]) => T;

function Serializable<TBase extends MixinConstructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }

    static deserialize<T>(this: new (...args: any[]) => T, json: string): T {
      return Object.assign(new (this as any)(), JSON.parse(json));
    }
  };
}

function Timestamped<TBase extends MixinConstructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();

    touch() {
      this.updatedAt = new Date();
    }
  };
}

function Activatable<TBase extends MixinConstructor>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate() { this.isActive = true; }
    deactivate() { this.isActive = false; }
  };
}

// Applying multiple mixins — each wraps the previous
class BaseEntity {
  constructor(public id: string) {}
}

const MixedEntity = Serializable(Timestamped(Activatable(BaseEntity)));

class UserEntity extends MixedEntity {
  username: string;
  constructor(id: string, username: string) {
    super(id);
    this.username = username;
  }
}

const mixedUser = new UserEntity('1', 'alice');
mixedUser.activate();
mixedUser.touch();
console.log((mixedUser as any).serialize());   // includes id, username, isActive, createdAt, updatedAt
// Note: TS loses the serialize() return type through deep mixin nesting — cast needed here

/*
EVALUATION CRITERIA:
✓ Mixin function takes a base constructor and returns an extended class
✓ Constructor<T> constraint ensures base has correct shape
✓ Mixins compose left-to-right (innermost applied first)
✓ This approach preserves instanceof for all mixin classes
✓ Alternative: interface merging + Object.assign (loses type safety)
✓ Limitation: constructor parameter types can be tricky — use any[] + override
*/


// ============================================
// QUESTION 37: Recursive Types with Depth Limiting
// ============================================
/*
QUESTION:
TypeScript's recursive types can cause "Type instantiation is excessively deep"
errors. Show how to implement a DeepRequired<T> with a depth counter to avoid
this, using tuple-based counter trick.
*/

// Tuple-based depth counter — decrements by indexing into a fixed-size tuple
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ...0[]];

type DeepRequired<T, D extends number = 5> = D extends 0
  ? T
  : T extends object
  ? { [K in keyof T]-?: DeepRequired<NonNullable<T[K]>, Prev[D]> }
  : T;

interface NestedConfig {
  server?: {
    host?: string;
    db?: {
      url?: string;
      pool?: {
        min?: number;
        max?: number;
      };
    };
  };
}

type RequiredConfig = DeepRequired<NestedConfig>;
// All optional properties removed recursively up to depth 5

// Recursive union flattening — must limit depth to avoid infinite expansion
type DeepFlatten<T, D extends number = 5> = D extends 0
  ? T
  : T extends (infer U)[]
  ? DeepFlatten<U, Prev[D]>
  : T;

type Flat = DeepFlatten<number[][][][]>; // number

/*
EVALUATION CRITERIA:
✓ Prev tuple maps number N to N-1 via index access — avoids arithmetic
✓ D extends 0 is the base case — returns T unchanged at depth 0
✓ -? removes optionality (opposite of ?)
✓ NonNullable<T[K]> strips null/undefined before recursing
✓ Without depth limit, TS throws "Type instantiation is excessively deep"
✓ Depth 5 is usually sufficient; increase for very nested types
*/


// ============================================
// QUESTION 38: Template Literal Type Parsing
// ============================================
/*
QUESTION:
Parse a URL pattern string at the type level to extract named parameters.
E.g., '/users/:id/posts/:postId' → { id: string; postId: string }.
*/

// Split a string by a delimiter at the type level
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S];

// Extract :param segments from a path
type ExtractParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<`/${Rest}`>]: string }
    : Path extends `${string}:${infer Param}`
    ? { [K in Param]: string }
    : Record<never, never>;

type RouteParams = ExtractParams<'/users/:id/posts/:postId'>;
// { id: string; postId: string }

type NoParams = ExtractParams<'/about'>;
// Record<never, never> = {}

// Use it to type a router
function createRoute<Path extends string>(
  path: Path,
  handler: (params: ExtractParams<Path>) => void
) {
  return { path, handler };
}

const userRoute = createRoute('/users/:id/posts/:postId', ({ id, postId }) => {
  console.log(id, postId); // both typed as string
});

/*
EVALUATION CRITERIA:
✓ Template literal inference: S extends `${infer A}:${infer B}/${infer C}`
✓ Recursive conditional type to extract all params
✓ Mapped type over inferred string literal union: { [K in Param]: string }
✓ keyof on intersection/union of extracted types merges all params
✓ Practical: typed React Router, tRPC-style route definitions
✓ Limitation: doesn't handle optional (:param?) or regex segments without more complex parsing
*/


// ============================================
// QUESTION 39: Polymorphic this Type
// ============================================
/*
QUESTION:
Use polymorphic this to build a type-safe builder that returns the
concrete subclass from every chained method. Show the difference between
returning this vs returning the base class type.
*/

class QueryBuilder {
  protected conditions: string[] = [];
  protected limitVal: number | undefined;

  where(condition: string): this {  // 'this' resolves to the concrete subclass
    this.conditions.push(condition);
    return this;  // Returns the actual runtime type, not QueryBuilder
  }

  limit(n: number): this {
    this.limitVal = n;
    return this;
  }

  build(): string {
    const where = this.conditions.length
      ? `WHERE ${this.conditions.join(' AND ')}`
      : '';
    const limit = this.limitVal ? `LIMIT ${this.limitVal}` : '';
    return `SELECT * FROM table ${where} ${limit}`.trim();
  }
}

class UserQueryBuilder extends QueryBuilder {
  private roleFilter: string | undefined;

  withRole(role: string): this {   // also returns this — preserves chain
    this.roleFilter = role;
    return this;
  }

  override build(): string {
    const base = super.build();
    return this.roleFilter
      ? `${base} /* role: ${this.roleFilter} */`
      : base;
  }
}

// Without polymorphic this, where() would return QueryBuilder — losing withRole()
const result = new UserQueryBuilder()
  .where('isActive = true')   // returns UserQueryBuilder (via this)
  .withRole('admin')           // still available — not lost
  .limit(10)
  .build();

/*
EVALUATION CRITERIA:
✓ Returning this resolves to the runtime class type, not the declaring class
✓ Without this, subclass chain-calls would lose access to subclass methods
✓ Useful for builder pattern, fluent APIs, ORMs
✓ this type cannot be used in static methods (use typeof this equivalent)
✓ Interfaces can also use this: interface Cloneable { clone(): this }
✓ Pitfall: returning a new instance (not this) breaks the polymorphism
*/


// ============================================
// QUESTION 40: Unique Symbol and Type-Level Constants
// ============================================
/*
QUESTION:
What is a unique symbol? When does TS widen a symbol type to `symbol`?
Implement a type-safe event system where event keys are unique symbols.
*/

// Regular symbol — widened to 'symbol' type
const eventA = Symbol('click');         // type: symbol (widened)
const eventB: unique symbol = Symbol(); // type: typeof eventB (narrow — never equal to any other)

// Two unique symbols are NEVER assignable to each other
declare const sym1: unique symbol;
declare const sym2: unique symbol;
// sym1 === sym2; // always false at type level — different types

// Use case: branded event bus with unique symbol keys
const CLICK = Symbol('click') as const;     // unique symbol via const assertion workaround
const SUBMIT = Symbol('submit') as const;

interface EventMap {
  [CLICK]: { x: number; y: number };
  [SUBMIT]: { formId: string };
}

class TypedEventBus {
  private handlers = new Map<symbol, Set<Function>>();

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    if (!this.handlers.has(event as symbol)) {
      this.handlers.set(event as symbol, new Set());
    }
    this.handlers.get(event as symbol)!.add(handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    this.handlers.get(event as symbol)?.forEach(h => h(data));
  }
}

const bus = new TypedEventBus();
bus.on(CLICK, ({ x, y }) => console.log(x, y));     // x,y typed correctly
bus.emit(CLICK, { x: 10, y: 20 });                  // ✓
// bus.emit(CLICK, { formId: 'f1' });               // Error — wrong payload type

/*
EVALUATION CRITERIA:
✓ unique symbol is a subtype of symbol — narrower, distinct at type level
✓ Must be declared with const — let foo: unique symbol is an error
✓ Two unique symbols are distinct types even if runtime values could be equal
✓ Symbol-keyed interfaces use computed property syntax
✓ Use case: opaque event names, internal library slots, registry keys
✓ keyof an interface with symbol keys includes those symbols
*/


// ============================================
// QUESTION 41: Type-Only Imports and isolatedModules
// ============================================
/*
QUESTION:
What is `import type` and why is it necessary with isolatedModules?
What happens if you use a type-only import as a value?
Show how import type protects against accidental circular dependencies.
*/

// import type — erased at emit, guaranteed not a value
import type { User } from './user-model';  // only the type, no JS output

// import — may be a value OR type (TS decides at emit time)
// With isolatedModules: true, TS cannot defer this decision to later —
// each file is processed independently, so it must know NOW

// BAD with isolatedModules:
// import { SomeType } from './module'; // could be a type or value — TS can't know
// export { SomeType };                  // Error: Re-export of a type when isolatedModules is on

// GOOD:
// import type { SomeType } from './module';
// export type { SomeType };             // OK — explicitly type-only

// Inline type import — mix value and type in one statement (TS 4.5)
// import { someFunction, type SomeType } from './module';

// Circular dependency guard — import type creates NO module dependency at runtime
// Even if A imports type from B and B imports type from A, there's no JS-level cycle

// Verbatim module syntax (TS 5.0) — enforces that type-only imports use import type
// With "verbatimModuleSyntax": true in tsconfig, ALL type imports must use import type

/*
EVALUATION CRITERIA:
✓ import type emits nothing to JS — purely compile-time
✓ isolatedModules requires distinguishable type vs value imports (for transpilers)
✓ Babel/esbuild/swc transpile per-file — cannot know if an import is type-only
✓ Re-exporting a type from a value import is an error with isolatedModules
✓ Inline type: import { fn, type T } mixes value and type in one statement
✓ verbatimModuleSyntax enforces import type for all types (TS 5.0+)
*/


// ============================================
// QUESTION 42: Strict Function Types and Bivariance
// ============================================
/*
QUESTION:
With strictFunctionTypes enabled, what is the difference in assignability
for method syntax vs function property syntax? Why are method parameters
bivariant by default and what's the practical implication?
*/

interface WithMethod {
  greet(animal: Animal): void;  // method syntax — BIVARIANT for params
}

interface WithProp {
  greet: (animal: Animal) => void;  // function property — CONTRAVARIANT with strictFunctionTypes
}

// strictFunctionTypes only applies to function PROPERTIES (and standalone functions)
// NOT to methods declared with method syntax (shorthand methods)

class AnimalTS { name = 'animal'; }
class DogTS extends AnimalTS { bark() {} }

const dogHandler: (d: DogTS) => void = (d) => d.bark();

// Method syntax: bivariant — UNSAFE but allowed (for backward compat with common OOP patterns)
const withMethod: WithMethod = { greet: dogHandler };  // OK even with strictFunctionTypes
// withMethod.greet(new AnimalTS()); // runtime error — AnimalTS has no bark()!

// Function property: contravariant — safe
// const withProp: WithProp = { greet: dogHandler }; // Error with strictFunctionTypes

// Practical implication: use function properties in interfaces when strict type safety is needed
interface SafeHandler {
  handle: (event: Event) => void;  // strict — can't pass a MouseEvent-only handler
}

/*
EVALUATION CRITERIA:
✓ strictFunctionTypes only affects function-type positions, NOT method syntax
✓ Method bivariance is intentional: common patterns like Array.prototype callbacks
✓ Function properties are checked contravariantly — safer
✓ Bivariance means both covariant AND contravariant assignments are allowed
✓ Practical: prefer function property syntax in interfaces for callback types
✓ Array.prototype.forEach callback is bivariant due to method syntax — known unsoundness
*/


// ============================================
// QUESTION 43: never Type — Advanced Patterns
// ============================================
/*
QUESTION:
Explain 5 distinct uses of never in TypeScript:
1. Exhaustiveness checking
2. Filtering types from unions
3. Conditional type branches that are impossible
4. Overriding inherited properties to be forbidden
5. Bottom type in generics
*/

// 1. Exhaustiveness checking
type Shape2 = { kind: 'circle'; r: number } | { kind: 'rect'; w: number; h: number };

function area2(s: Shape2): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'rect':   return s.w * s.h;
    default:
      const _: never = s; // Error if a new variant is added without handling it
      throw new Error(_);
  }
}

// 2. Filtering types from a union
type NonNullableUnion<T> = T extends null | undefined ? never : T;
type Cleaned = NonNullableUnion<string | null | number | undefined>; // string | number

// 3. Impossible conditional branches
type IsArray<T> = T extends any[] ? true : false;
type ImpossibleBranch = IsArray<string & number>; // never — string & number is never

// 4. Forbid a property from subtype
interface ReadOnly {
  readonly id: string;
}

interface NoId extends ReadOnly {
  id?: never; // callers cannot set id — it exists but is typed as never
}

// 5. Bottom type — never extends everything, nothing extends never (except never)
type CheckNever<T> = [T] extends [never] ? 'is never' : 'not never';
type A = CheckNever<never>;  // 'is never'
type B = CheckNever<string>; // 'not never'
// Note: T extends never ? ... distributes over unions — use [T] to prevent it

/*
EVALUATION CRITERIA:
✓ never propagates through unions: string | never = string
✓ never is the return type of functions that never return (throw/infinite loop)
✓ [T] extends [never] prevents distributive behavior
✓ Filtering with conditional types returns never for excluded types
✓ never as property type makes that key functionally unusable
✓ empty intersection (string & number) resolves to never
*/


// ============================================
// QUESTION 44: Infer in Multiple Positions
// ============================================
/*
QUESTION:
Use infer in co-occurring positions to extract both input and output types
simultaneously. Build UnwrapPromise, ExtractEventPayload, and a ReturnIfTrue
type that uses multiple infer placeholders.
*/

// Multiple infer in one conditional type
type UnwrapFunction<T> =
  T extends (...args: infer P) => infer R
    ? { params: P; return: R }
    : never;

type FnInfo = UnwrapFunction<(a: string, b: number) => boolean>;
// { params: [string, number]; return: boolean }

// Infer from overloaded function — gets LAST overload (TS limitation)
type OverloadReturn<T> = T extends { (...args: any[]): infer R } ? R : never;

// Extracting promise value with recursive unwrapping
type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T;
type Resolved = DeepAwaited<Promise<Promise<Promise<string>>>>; // string

// Inferring from mapped type values
type ValueOf<T> = T extends Record<string, infer V> ? V : never;
type HttpMethods = ValueOf<{ get: 'GET'; post: 'POST'; delete: 'DELETE' }>; // 'GET' | 'POST' | 'DELETE'

// Contravariant infer position — intersects instead of unions
type UnionToIntersection<U> =
  (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type Merged = UnionToIntersection<{ a: string } | { b: number }>; // { a: string } & { b: number }

/*
EVALUATION CRITERIA:
✓ Multiple infer in one conditional: each captures a different structural position
✓ infer in covariant position (return) → union when distributed
✓ infer in contravariant position (param) → intersection when distributed
✓ Recursive infer for deeply nested types (Promise, arrays, wrappers)
✓ Overloads: TS always infers from the LAST overload signature
✓ UnionToIntersection is the classic contravariant infer trick
*/


// ============================================
// QUESTION 45: Abstract Classes — Deep Dive
// ============================================
/*
QUESTION:
Show an abstract class that defines a Template Method pattern.
Then demonstrate: abstract properties, abstract index signatures,
and the difference between `abstract new()` and a regular abstract constructor.
*/

// Template Method pattern with abstract class
abstract class DataProcessor<TInput, TOutput> {
  // Abstract property — must be defined in subclass
  abstract readonly name: string;

  // Template method — defines the algorithm skeleton
  async process(input: TInput): Promise<TOutput> {
    const validated = await this.validate(input);   // step 1 — subclass defines
    const transformed = this.transform(validated);  // step 2 — subclass defines
    await this.postProcess(transformed);            // step 3 — has default
    return transformed;
  }

  protected abstract validate(input: TInput): Promise<TInput>;
  protected abstract transform(input: TInput): TOutput;

  // Non-abstract with default — subclass may override
  protected async postProcess(_output: TOutput): Promise<void> {
    // no-op by default
  }
}

class JsonParser extends DataProcessor<string, object> {
  readonly name = 'JsonParser';

  protected async validate(input: string): Promise<string> {
    if (!input.trim()) throw new Error('Empty input');
    return input;
  }

  protected transform(input: string): object {
    return JSON.parse(input);
  }
}

// Abstract class as type (not new-able directly)
type ProcessorConstructor<I, O> = abstract new (config: object) => DataProcessor<I, O>;
// Cannot do: new ProcessorConstructor(…) — abstract prevents direct instantiation

/*
EVALUATION CRITERIA:
✓ abstract class cannot be instantiated — must be subclassed
✓ abstract methods have no body — subclass MUST implement them
✓ abstract properties work the same way as abstract methods
✓ Template method pattern: algorithm in base, steps in subclass
✓ Abstract class can have concrete methods, constructors, and static members
✓ typeof AbstractClass vs abstract new() — subtle distinction in type position
*/


// ============================================
// QUESTION 46: Module Augmentation and Global Scope
// ============================================
/*
QUESTION:
Extend the built-in Array prototype with a typed method using module
augmentation. What are the risks? Then show how to safely extend the
global Window object in an Angular or React app.
*/

// Augmenting built-in Array with a typed method
declare global {
  interface Array<T> {
    groupByKey<K extends keyof T>(key: K): Map<T[K], T[]>;
  }
}

// Implementation — must be added separately (declaration is separate from implementation)
Array.prototype.groupByKey = function<T, K extends keyof T>(
  this: T[],
  key: K
): Map<T[K], T[]> {
  const map = new Map<T[K], T[]>();
  for (const item of this) {
    const k = item[key];
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(item);
  }
  return map;
};

// Usage — fully typed
const users2 = [
  { role: 'admin', name: 'Alice' },
  { role: 'user',  name: 'Bob' },
  { role: 'admin', name: 'Charlie' },
];
const byRole = users2.groupByKey('role'); // Map<string, typeof users2[0][]>

// Safe Window extension — in a .d.ts file or with declare global
declare global {
  interface Window {
    __APP_VERSION__: string;
    __FEATURE_FLAGS__: Record<string, boolean>;
  }
}
// Now window.__APP_VERSION__ is typed throughout the app

/*
EVALUATION CRITERIA:
✓ declare global merges with the global scope — works in any module file
✓ Module augmentation: declare module 'lib' { … } adds to existing module types
✓ Runtime implementation must be added separately — declaration alone does nothing
✓ Risks: polyfill conflicts, enumerable prototype pollution, key collisions
✓ Prefer wrapper functions over prototype extension in library code
✓ Must be in a module file (has import/export) — ambient scripts work differently
*/


// ============================================
// QUESTION 47: Distributive vs Non-Distributive Conditional Types
// ============================================
/*
QUESTION:
Explain why ToArray<string | number> gives string[] | number[] but
[string | number][] is different. When does distribution NOT happen,
and how do you prevent it?
*/

// Distributive: T is a naked type parameter → distributes over unions
type ToArray<T> = T extends any ? T[] : never;
type R1 = ToArray<string | number>; // string[] | number[]  (distributed)

// Non-distributive: wrap T in a tuple to prevent distribution
type ToArrayFixed<T> = [T] extends [any] ? T[] : never;
type R2 = ToArrayFixed<string | number>; // (string | number)[]  (not distributed)

// Practical: IsNever check — must prevent distribution
type IsNeverDistributive<T> = T extends never ? true : false;
type R3 = IsNeverDistributive<never>;  // never (not true!) — distributed over 0 members
type IsNever<T> = [T] extends [never] ? true : false;
type R4 = IsNever<never>;  // true — tuple prevents distribution

// When to USE distribution:
type Nullable<T> = T extends any ? T | null : never;
type R5 = Nullable<string | number>; // string | null | number | null = string | number | null

// When to PREVENT distribution (use case: checking exact union shape)
type ExactUnion<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
type R6 = ExactUnion<'a' | 'b', 'a' | 'b'>; // true
type R7 = ExactUnion<'a', 'a' | 'b'>;        // false

/*
EVALUATION CRITERIA:
✓ Distribution happens when T is a "naked" type parameter in a conditional
✓ never distributed over 0 union members → produces never (common gotcha)
✓ Wrapping in tuple [T] prevents distribution in both branches
✓ Distribution is applied BEFORE the conditional is evaluated
✓ Non-naked: T[] extends any[] does NOT distribute (T is inside a type)
✓ Useful for building filter/exclude/extract utilities
*/


// ============================================
// QUESTION 48: keyof typeof — Common Patterns
// ============================================
/*
QUESTION:
Show 5 practical patterns using keyof typeof:
object literals, enums, class statics, runtime constants, and lookup tables.
*/

// 1. Object literal as enum-like structure
const Direction = {
  North: 'NORTH',
  South: 'SOUTH',
  East:  'EAST',
  West:  'WEST',
} as const;

type Direction = typeof Direction;             // The object type
type DirectionKey = keyof typeof Direction;    // 'North' | 'South' | 'East' | 'West'
type DirectionValue = typeof Direction[DirectionKey]; // 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'

// 2. Narrowing with typeof — runtime enum pattern
function move(dir: DirectionKey): DirectionValue {
  return Direction[dir];
}

// 3. Class static members
class HttpStatus {
  static readonly OK = 200;
  static readonly NOT_FOUND = 404;
  static readonly SERVER_ERROR = 500;
}

type StatusKey = keyof typeof HttpStatus;  // 'OK' | 'NOT_FOUND' | 'SERVER_ERROR'
type StatusCode = typeof HttpStatus[StatusKey]; // 200 | 404 | 500

// 4. Runtime lookup table with type-safe keys
const validators = {
  email: (s: string) => /\S+@\S+/.test(s),
  phone: (s: string) => /^\d{10}$/.test(s),
} as const;

type ValidatorKey = keyof typeof validators; // 'email' | 'phone'

function validate2(type: ValidatorKey, value: string): boolean {
  return validators[type](value);
}

// 5. Enum to union type
enum Color { Red, Green, Blue }
type ColorName = keyof typeof Color; // 'Red' | 'Green' | 'Blue'
type ColorValue = typeof Color[ColorName]; // 0 | 1 | 2 (numeric enum)

/*
EVALUATION CRITERIA:
✓ typeof on a value gets its TypeScript type
✓ keyof typeof gets the keys of a value's type (not the value itself)
✓ as const + keyof typeof is the pattern for JS object as enum-like type
✓ typeof Class gets the constructor type (static side), not the instance type
✓ Enum: keyof typeof Enum gives string keys; typeof Enum[key] gives values
✓ Useful for lookup tables, configuration objects, and API method maps
*/


// ============================================
// QUESTION 49: Strict Mode Flags — What Each Enables
// ============================================
/*
QUESTION:
What specific checks does each strictness flag enable?
Which flags does "strict": true include? What important checks
are NOT included in strict?

TRICKY: Several useful checks are NOT part of strict.
*/

/*
"strict": true enables ALL of these:
┌─────────────────────────────────┬──────────────────────────────────────────────────────┐
│ strictNullChecks                │ null/undefined not assignable to other types          │
│ strictFunctionTypes             │ contravariant function params (property syntax only)  │
│ strictBindCallApply             │ bind/call/apply are type-checked                      │
│ strictPropertyInitialization   │ class properties must be initialized in constructor   │
│ noImplicitAny                   │ implicit any is an error                              │
│ noImplicitThis                  │ this in non-class context must be typed               │
│ alwaysStrict                    │ emits "use strict" and parses in strict mode          │
│ useUnknownInCatchVariables      │ catch variable is unknown instead of any (TS 4.4)    │
└─────────────────────────────────┴──────────────────────────────────────────────────────┘

NOT included in strict (must enable separately):
┌─────────────────────────────────┬──────────────────────────────────────────────────────┐
│ noUncheckedIndexedAccess        │ T[i] returns T | undefined (arrays/index signatures) │
│ exactOptionalPropertyTypes      │ optional prop must be T, not T | undefined           │
│ noImplicitOverride              │ overriding methods must use override keyword          │
│ noPropertyAccessFromIndexSignature │ must use ['key'] not .key for index signatures  │
│ noFallthroughCasesInSwitch      │ switch case fallthrough is an error                  │
│ noUnusedLocals / noUnusedParameters │ unused vars/params are errors                  │
└─────────────────────────────────┴──────────────────────────────────────────────────────┘
*/

// noUncheckedIndexedAccess example:
const arr: string[] = ['a', 'b'];
// With noUncheckedIndexedAccess: arr[0] is string | undefined, not string
// const first: string = arr[0]; // Error — might be undefined

// exactOptionalPropertyTypes example:
interface WithOptional {
  name?: string; // without exactOptional: string | undefined; with: only string or absent
}

/*
EVALUATION CRITERIA:
✓ Knows all 8 flags under "strict": true
✓ Knows which powerful checks are NOT in strict (especially noUncheckedIndexedAccess)
✓ noUncheckedIndexedAccess prevents off-by-one and out-of-bounds type errors
✓ exactOptionalPropertyTypes: { name?: string } means name CAN be absent, not explicitly undefined
✓ Recommends "strict": true plus noUncheckedIndexedAccess as baseline for new projects
✓ useUnknownInCatchVariables added in TS 4.4 to strict
*/


// ============================================
// QUESTION 50: Type Narrowing via Control Flow Analysis
// ============================================
/*
QUESTION:
TypeScript performs sophisticated control flow analysis. Predict the
type of x in each branch, including tricky cases with assignments,
early returns, and loops.
*/

function demo(input: string | number | null | undefined) {
  // After typeof check
  if (typeof input === 'string') {
    input; // string
    return;
  }

  // After early return — null and undefined are eliminated? NO — only string was eliminated
  input; // number | null | undefined

  if (input == null) {  // == catches BOTH null and undefined
    input; // null | undefined
    return;
  }

  input; // number — both string and null/undefined eliminated

  // Assignment WIDENS the type back
  const val = input;  // val is number
}

// Tricky: loop with reassignment
function processItems2(items: Array<string | number>) {
  let current: string | number | undefined;

  for (const item of items) {
    current = item; // assignment — narrows to string | number
    if (typeof current === 'string') {
      current; // string
    }
    // After the if, current is back to string | number (TS doesn't track "didn't enter if")
  }

  // After the loop, current might still be undefined (if items was empty)
  current; // string | number | undefined
}

// Tricky: assertion function narrows permanently
function assertString(val: unknown): asserts val is string {
  if (typeof val !== 'string') throw new TypeError();
}

function process2(val: unknown) {
  val;             // unknown
  assertString(val);
  val;             // string — narrowed by assertion function, persists!
}

/*
EVALUATION CRITERIA:
✓ Narrowing persists after the check block only via early return/throw
✓ == null is equivalent to === null || === undefined
✓ Variable assignment (not const) can widen the type back
✓ Assertion functions (asserts val is T) narrow the type at the call site
✓ After a loop, TS must assume the variable could still be its pre-loop type
✓ Discriminant property narrowing works across all branches of a union
*/
