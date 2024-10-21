function showText(text, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, time);
  });
}

function showName(text, time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(text);
    }, time);
  });
}

showText("hello", 2000).then((val) => {
  console.log(val);
});

// Promise.all([
//   showText("hello", 2000),
//   showName("hi", 6000),
//   Promise.resolve("ok"),
// ]).then((val) => {
//   console.log(val);
// });

// Promise.all([
//   showText("hello", 6000),
//   showName("hi", 10000),
//   Promise.reject("ok"),
// ])
//   .then((val) => {
//     console.log(val);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// function resolvePromises(promises) {
//   let result = [];

//   return new Promise((resolve, reject) => {
//     promises.forEach((p, index) => {
//       p.then((val) => {
//         result.push(val);
//         if (index == promises.length - 1) {
//           resolve(result);
//         }
//       }).catch((error) => reject(error));
//     });
//   });
// }

// resolvePromises([showName("hello", 1000), showText("hi", 20000)]).then((val) =>
//   console.log(val)
// );


//  