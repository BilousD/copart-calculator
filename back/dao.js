const sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('./db/params.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the params SQlite database.');
});
class Dao {
    constructor() {
        db.run('CREATE TABLE IF NOT EXISTS params (shipping TEXT, excise TEXT, auction TEXT, id INTEGER PRIMARY KEY DEFAULT 0)');
        process.on('exit', () => db.close());
    }
    getParams() {
        let shippingTXT = '';
        let exciseTXT = '';
        let auctionTXT = '';
        return new Promise((resolve, reject) => {
            db.get('SELECT shipping, excise, auction from params where id = 0', [], (err, row) => {
            if (err) {
                reject(err);
            }
            shippingTXT = row.shipping;
            exciseTXT = row.excise;
            auctionTXT = row.auction;
            console.log('db get');
            resolve({shippingTXT, exciseTXT, auctionTXT});
        })});
    }
    async setParams(shipping, excise, auction) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE params SET shipping = ?, excise = ?, auction = ? where id = 0', [shipping, excise, auction], function(err) {
            if (err) {
                reject(err);
            }
        })});
    }
}
module.exports = Dao;
