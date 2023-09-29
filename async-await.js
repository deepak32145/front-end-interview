const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 10000);
});

// function getData() {
//   p.then((res) => {
//     console.log(res);
//   });
//   console.log("Hello");
// }
// getData();

async function getData1() {
  const val = await p;
  console.log("hello1");
  console.log(val);
  const val2 = await p;
  console.log("hello 2");
  console.log(val2);
}
getData1();
