const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const COOKIE_CACHE = {};
function lastCookie() {
    let cookie = '';
    Object.keys(COOKIE_CACHE).forEach(key => {
        cookie = cookie + `${key}=${COOKIE_CACHE[key]}; `;
    });
    return cookie;
}
async function getCopart(uri) {
    const api = axios.create({
        baseURL: 'https://copart.com/',
        headers: {
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
            'Cookie': lastCookie()
        }
    });

    const result = await api.get(uri);

    console.log(result.headers);
    console.log(result.data);
    let cookies = result.headers['set-cookie'];
    for (let cookie of cookies) {
        let keyValue = cookie.split(';')[0].split('=');
        if (!keyValue[0].startsWith('___utm')) {
            COOKIE_CACHE[keyValue[0]] = keyValue[1];
        }
    }

    return result.data;
}
app.post('/api/parse', async (req, res, next) => {
    console.log('RECEIVED GET ' + req.body.uri);
    let image = '';

    try {
        let response = await getCopart(`public/data/lotdetails/solr/${req.body.uri}`);

        if (response.data) {
            try {
                let imgResponse = await getCopart(`public/data/lotdetails/solr/lotImages/${req.body.uri}/USA`);
                image = imgResponse.data.imagesList.FULL_IMAGE[0].url;
            } catch (e) {
                console.log(e);
            }
            if (!image) {
                image = response.data.lc;
            }
            console.log('image: ',image);
            res.status(200).json({data: response.data.lotDetails, image: image});
        } else {
            // request again with new cookie
            console.log('AAAAAAAAAAAAAAAa');
        }
    } catch (e) {
        console.log(e);
        res.status(503).json({errorText: 'Could not connect to Copart'});
    }
});

let timerId = setInterval(async () => {
    console.log('interval');
    try {
        const result = await getCopart('');
    } catch (e) {
        console.log('setInterval error: ');
        console.log(e);
    }


}, 900000);

app.use((req, res, next) => {
    res.send('hello');
});

module.exports = app;
