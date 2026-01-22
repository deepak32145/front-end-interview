// Using Object.assign()
// const original = { name: "John", address: { city: "NYC" } };

// function deepClone(obj) {
//   if (obj === null || typeof obj !== "object") return obj;
//   if (obj instanceof Date) return new Date(obj);
//   if (obj instanceof Array) return obj.map(item => deepClone(item));
  
//   const cloned = {};
//   for (let key in obj) {
//     cloned[key] = deepClone(obj[key]);
//   }
//   return cloned;
// }

// const deepCopy3 = deepClone(original);

// console.log(deepCopy3);

const original = { name: "John", address: { city: "NYC" } };
const newObj = Object.assign({}, original);

newObj.name = "Jane"; 
newObj.address.city = "LA"; 

console.log(original); 

// // Using spread operator
// const shallowCopy2 = { ...original };
// shallowCopy2.address.city = "Boston"; // also affects original


// Using JSON (simple objects only)
// const original = { name: "John", address: { city: "NYC" } };
// const deepCopy = JSON.parse(JSON.stringify(original));

// deepCopy.address.city = "LA"; // doesn't affect original
// console.log(original.address.city); // "NYC" - unchanged!

// // Using structuredClone() (modern approach)
// const deepCopy2 = structuredClone(original);
// deepCopy2.address.city = "Boston"; // doesn't affect original

// // Using recursive function
// function deepClone(obj) {
//   if (obj === null || typeof obj !== "object") return obj;
//   if (obj instanceof Date) return new Date(obj);
//   if (obj instanceof Array) return obj.map(item => deepClone(item));
  
//   const cloned = {};
//   for (let key in obj) {
//     cloned[key] = deepClone(obj[key]);
//   }
//   return cloned;
// }

// const deepCopy3 = deepClone(original);


// const arr = [1, 2, 3, 4, 5];
// const update = arr.reduce((acc , val) =>{
//   acc.push({[val] : val});
//   return acc;
// }, []);

// console.log(update);

