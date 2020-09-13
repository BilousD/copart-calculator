const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const misc = require('./json-dresser');
const Dao = require('./dao');

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
    if (cookies) {
        for (let cookie of cookies) {
            let keyValue = cookie.split(';')[0].split('=');
            if (!keyValue[0].startsWith('___utm')) {
                COOKIE_CACHE[keyValue[0]] = keyValue[1];
            }
        }
    }
    return result.data;
}
app.get('/api/parse', async (req, res, next) => {
    console.log('RECIVED GET');
    const calculatedData = await misc.getParameters();
    console.log(calculatedData)
    res.status(200).json({data: calculatedData});
});
app.get('/api/parse/raw', async (req, res, next) => {
    console.log('RECIVED GET');
    const rawData = await misc.getRaw();
    console.log(rawData)
    res.status(200).json({data: rawData});
});

async function fetchData(req, res, next, retries) {
    let response = await getCopart(`public/data/lotdetails/solr/${req.body.uri}`);
    let image = '';

    if (response.data) {
        try {
            let imgResponse = await getCopart(`public/data/lotdetails/solr/lotImages/${req.body.uri}/USA`);
            if (imgResponse.data) {
                image = imgResponse.data.imagesList.FULL_IMAGE[0].url;
            }
        } catch (e) {
            console.log(e);
        }
        if (!image) {
            image = response.data.lc;
        }
        console.log('image: ',image);
        res.status(200).json({data: response.data.lotDetails, image: image});
    } else {
        if (retries < 3) {
            // request again with new cookie
            console.log('Fetching failed, retrying');
            await setTimeout(() => fetchData(req, res, next, retries), 5000);
        } else {
            console.log('Fetching failed, ABORTING');
            res.status(503).set('Retry-After', '180');
        }
    }
}
let pass = '';
let time = 0;
app.get('/pass', async (req, res, next) => {
    pass = '';
    for (let i = 0; i < 10; i++) {
        pass = pass + Math.round(Math.random()*10);
        time = Date.now();
    }
    console.log('password:');
    console.log(pass);
    res.status(200).json({message: 'done'});
})
app.put('/api/parse/params', async (req, res, next) => {
    if (req.body.pass.trim() === 'ne48gK*fYx7uekR.' && (Date.now() - time) < 300000) {
        let db = new Dao();
        let result = await db.setParams(req.body.shipping, req.body.excise, req.body.auction);
        if (result) {
            res.status(500).json({error:result});
        } else {
            res.status(200);
        }
    } else {
        res.status(401);
    }
});

app.post('/api/parse', async (req, res, next) => {
    console.log('RECEIVED POST ' + req.body.uri);
    try {
        let retries = 0;
        await fetchData(req, res, next, retries);
    } catch (e) {
        console.log(e);
        res.status(503).json({errorText: 'Could not connect to Copart'});
    }
});
//
// let timerId = setInterval(async () => {
//     console.log('interval');
//     try {
//         const result = await getCopart('g2mext/internationalShipping/1/currentStatus/41519370');
//     } catch (e) {
//         console.log('setInterval error: ');
//         console.log(e);
//     }
// }, 1800000);

app.use((req, res, next) => {
    res.send('hello');
});

module.exports = app;
