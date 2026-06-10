
var maxArea = function (arr) {
    let left = 0;
    let right = arr.length - 1;
    let maxHeight = 0;

    while (left < right) {
        let height = Math.min(arr[left], arr[right]);
        let width = right - left;
        let area = width * height;
        maxHeight = area > maxHeight ? area : maxHeight;

        if (arr[left] < arr[right]) {
            left++;
        }
        else {
            right--;
        }
    }
    return maxHeight;

};

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));