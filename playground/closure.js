var e = 10;
function sum(a) {
    return function (b) {
        return function (c) {
            return function (d) {
                return a + b + c + d + e;
            };
        };
    };
}

const a = sum(1);
const b = a(2);
const c = b(3);
const d = c(4);
console.log(d);


