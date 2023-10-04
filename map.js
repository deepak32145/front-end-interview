const arr = [2, 3, 4, 5, 6];

const data = arr
  .map((data) => {
    return data + 2;
  })
  .filter((data) => {
    return data % 2 == 0;
  });
console.log(data);

const data1 = arr.forEach((data) => {
  return data + 2;
});

console.log(data1);
