const fs = require('fs');

// shipping
let array = fs.readFileSync('shipping.txt').toString().split("\n");
let shipping = {};

for (let i in array) {
    if (array[i].length !== 0) {
        let arr = array[i].split(':');
        shipping[arr[0]] = parseFloat(arr[1]);
    }
}
console.log(shipping);

// excise
array = fs.readFileSync('excise.txt').toString().split("\n");
let excise = {};
let key = '';

for (let i = 0; i < array.length; i++) {
    if (('z' >= array[i][0] && array[i][0] >= 'a') || ('Z' >= array[i][0] && array[i][0] >= 'A')) {
        key = array[i];
        if (key === 'DEFAULT') {
            excise[key] = parseFloat(array[i+1]);
            // Default should be last on the list, so put it to get the fuck out of this shit
            i += 2;
        } else {
            excise[key] = [];
        }
    }
    if (9 >= array[i][0] && array[i][0] >= 0) {
        let arr = array[i].split(':');
        excise[key].push([parseFloat(arr[0]), parseFloat(arr[1])]);
    }
}
console.log(excise);

// some other shit
array = fs.readFileSync('auction.txt').toString().split("\n");
let auction = [];

for (let str of array) {
    if (!(str[0] === '/' || !str)) {
        let arr = str.split(':');
        auction.push([parseFloat(arr[0]),parseFloat(arr[1])]);
    }
}
console.log(auction);
let data = {shipping, excise, auction}
module.exports = data;
