const p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("promise is resolved sdafasdfasd fsdaf ");
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

p.then((res) => console.log(res));
