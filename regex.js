const ssnRegex =  /^(?!([0-9])\1{2}-\1{2}-\1{4})\d{3}-\d{2}-\d{4}$/;
const EINregex = /^(?!([0-9])\1{1}-\1{7})\d{2}-\d{7}$/;






function validateSSN(ssn) {
    return ssnRegex.test(ssn);
}

console.log(validateSSN("123-45-6789")); // ✅ true (Valid)
console.log(validateSSN("000-12-3456")); // ❌ false (Invalid)
console.log(validateSSN("111-11-1111")); // ❌ false (All same digits)
