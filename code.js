function parseApiDate(input) {
  if (!input) return null;

  // Case: "yyyy-mm-dd"
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [year, month, day] = input.split('-').map(Number);
    return new Date(year, month - 1, day); // Local time, no shift
  }

  // Case: "yyyy-mm-dd hh:mm:ss.sss"
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(input)) {
    // Replace space with 'T' to make it ISO-like (still local)
    const isoLike = input.replace(' ', 'T');
    return new Date(isoLike);
  }

  // Case: Proper ISO date string or fallback
  return new Date(input); // Will be parsed as UTC or local based on format
}

console.log(parseApiDate("2023-10-05")); // Local date
console.log(parseApiDate("2023-10-05 14:30:00.000")); // Local date with time
