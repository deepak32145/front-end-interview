const arr = [22, 55, 1, 6, 9, 10, 4];
let temp = 0;

for (let i = 0; i < arr.length; i++) {
  for (let j = i; j < arr.length; j++) {
    if (arr[j] < arr[i]) {
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
  }
}

console.log(arr);
