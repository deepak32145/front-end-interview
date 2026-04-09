// function recursionFlatten(arr) {
//     let result = [];
//     for (let i = 0; i < arr.length; i++) {
//         if (Array.isArray(arr[i])) {
//             result = result.concat(recursionFlatten(arr[i]));
//         } else {
//             result.push(arr[i]);
//         }
//     }
//     return result;


// }

// console.log(recursionFlatten([1, [2, 3], [4, [5, 6]], 7]));




// function fetchDataPromise() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ id: 1, name: 'John' });
//     }, 1000);
//   });
// }


// async function callMain() {
//     try{
//         const data = await fetchDataPromise();
//         console.log(data);
//     }
//     catch(err) {

//     }
// }
// callMain();


function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function add(a, b) {
    console.log("Result:", a + b);
}

const debouncedAdd = debounce(add, 1000);

debouncedAdd(2, 3);

setTimeout(() => {
    debouncedAdd(2, 3);
}, 100);

setTimeout(() => {
    debouncedAdd(2, 3);
}, 200);

setTimeout(() => {
    debouncedAdd(2, 3);
}, 800);

setTimeout(() => {
    debouncedAdd(2, 3);
}, 1000);

setTimeout(() => {
    debouncedAdd(2, 3);
}, 1800);