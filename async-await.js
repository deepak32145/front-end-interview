const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 5000);
});

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 10000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 5000);
});

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved");
  }, 15000);
});

async function getData() {
  const result = await p;
  console.log(result);
}
getData();

async function getData1() {
  const val = await p2;
  console.log("hello1");
  console.log(val);
  const val2 = await p1;
  console.log("hello 2");
  console.log(val2);
}
getData1();
