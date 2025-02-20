function formatPhoneNumber(input: string): string {
  // Remove all non-numeric characters
  const digits = input.replace(/\D/g, "");

  // Ensure it has exactly 10 digits
  if (digits.length !== 10) {
      return "Invalid Number";
  }

  // Format the number (XXX) XXX-XXXX
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

// 🔹 Example Usage:
console.log(formatPhoneNumber("999-999-1234"));   // (999) 999-1234
console.log(formatPhoneNumber("9999991234"));     // (999) 999-1234
console.log(formatPhoneNumber("(999)-999-1234")); // (999) 999-1234
console.log(formatPhoneNumber("12345"));          // Invalid Number
