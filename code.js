var firstMissingPositive = function (nums) {
  nums = nums.filter((num) => num > 0);
  nums = nums.filter((value, index, self) => self.indexOf(value) === index);
  if (nums.length === 0) {
    return 1;
  }
  nums = nums.sort((a, b) => a - b);
  let missing = 1;
  for (const num of nums) {
    if (num === missing) {
      missing++;
    } else {
      break;
    }
  }
  return missing;
};

const arr = [0, 2, 2, 1, 1];

console.log(firstMissingPositive(arr));
