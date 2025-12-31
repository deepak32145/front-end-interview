function coinChange(coins, amount) {
  return recCode(coins, amount);
}

function recCode(coins, amount) {
  if (amount === 0) return 0;
  if (amount < 0) return -1;
  let min = Infinity;
  coins.forEach((coin) => {
    let res = recCode(coins, amount - coin);
    console.log("res", res);
    if (res >= 0 && res < min) {
      min = res + 1;
    }
  });
  return min === Infinity ? -1 : min;
}

const arr = [5, 2, 1];
console.log(coinChange(arr, 11));
