const arr = [23,43,55,66,1,2];

for(let i =0; i<arr.length; i++) {
    let temp = 0;
    for(let j= i; j<arr.length; j++) {
        if(arr[i] > arr[j]) {
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    }
}

console.log(arr);