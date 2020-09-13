const fs = require('fs');
const Dao = require('./dao');
let db = new Dao();
console.log('created new Dao object');
async function getParameters() {
    let params = await db.getParams();
    console.log('params:', params);
    let shippingTXT = params.shippingTXT;
    let exciseTXT = params.exciseTXT;
    let auctionTXT = params.auctionTXT;
    console.log('ship: ',shippingTXT);

    let shipping = getShipping(shippingTXT);
    let excise = getExcise(exciseTXT);
    let auction = getAuction(auctionTXT);

    return {shipping, excise, auction};
}
async function getRaw() {
    let params = await db.getParams();
    return {shipping: params.shippingTXT, excise: params.exciseTXT, auction: params.auctionTXT};
}

function getShipping(shippingTXT) {
    // shipping
    let array = (shippingTXT?shippingTXT:fs.readFileSync('shipping.txt').toString()).split("\n");
    let shipping = {};

    for (let i in array) {
        if (array[i].length !== 0) {
            let arr = array[i].split(':');
            shipping[arr[0]] = parseFloat(arr[1]);
        }
    }
    return shipping;
}

function getExcise(exciseTXT) {
    // excise
    let array = (exciseTXT?exciseTXT:fs.readFileSync('excise.txt').toString()).split("\n");
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
    return excise;
}

function getAuction(auctionTXT) {
    // some other shit
    let array = (auctionTXT?auctionTXT:fs.readFileSync('auction.txt').toString()).split("\n");
    let auction = [];

    for (let str of array) {
        if (!(str[0] === '/' || !str)) {
            let arr = str.split(':');
            auction.push([parseFloat(arr[0]),parseFloat(arr[1])]);
        }
    }
    return auction;
}
module.exports.getParameters = getParameters;
module.exports.getRaw = getRaw;
