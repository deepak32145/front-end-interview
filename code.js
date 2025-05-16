const obj = {
  name: "John",
  address: {
    city: "Delhi",
    location: {
      lat: 123,
      lng: 456,
    },
  },
};
function flattenObject(obj, parentKey = "", result = {}) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      // Recursive call for nested object
      flattenObject(obj[key], newKey, result);
    } else {
      // Add primitive value to result
      result[newKey] = obj[key];
    }
  }

  return result;
}

console.log(flattenObject(obj));

// {
//   name: 'John',
//   'address.city': 'Delhi',
//   'address.location.lat': 123,
//   'address.location.lng': 456
// }
