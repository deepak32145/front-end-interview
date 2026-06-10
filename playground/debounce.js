

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