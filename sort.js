const original = { name: "John", address: { city: "NYC" } };
const newObj = Object.assign({}, original);

newObj.name = "Jane"; 
newObj.address.city = "LA"; 

console.log(original); 