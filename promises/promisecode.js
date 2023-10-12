console.log("a");
setTimeout(() => {
  console.log("timeout");
}, 0);

Promise.resolve(() => console.log("pro")).then((res) => res());

console.log("b");
