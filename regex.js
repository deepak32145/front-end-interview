const einRegex = /^(?!([0-9])\1{1}-\1{7})\d{2}-\d{7}$/;

function validateEIN(ein) {
    return einRegex.test(ein);
}

// ✅ Valid EINs
console.log(validateEIN("12-3456789")); // true
console.log(validateEIN("98-7654321")); // true

// ❌ Invalid EINs (All same digits)
console.log(validateEIN("11-1111111")); // false
console.log(validateEIN("22-2222222")); // false
console.log(validateEIN("99-9999999")); // false

// ❌ Invalid Formats
console.log(validateEIN("123456789"));  // false (Missing dash)
console.log(validateEIN("1-23456789")); // false (Wrong format)
console.log(validateEIN("12-34567"));   // false (Not enough digits)
console.log(validateEIN("12-34567890")); // false (Too many digits)