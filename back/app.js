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

app.post('/api/parse', (req, res, next) => {
    console.log('RECEIVED GET');
    let image = '';
    axios({
        method: 'GET',
        url: `https://www.copart.com/public/data/lotdetails/solr/${req.body.uri}`,
        headers: {
            'Accept':	'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':	'gzip, deflate, br',
            'Accept-Language':	'en-US,en;q=0.5',
            'Connection':	'keep-alive',
            // 'Host':	'www.example.com',
            'Upgrade-Insecure-Requests':	1,
            'User-Agent':	'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
            Origin: '*'
        }
    }).then(function (results) {
        axios({
            method: 'GET',
            url: `https://www.copart.com/public/data/lotdetails/solr/lotImages/${req.body.uri}/USA`,
            headers: {
                'Accept':	'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding':	'gzip, deflate, br',
                'Accept-Language':	'en-US,en;q=0.5',
                'Connection':	'keep-alive',
                // 'Host':	'www.example.com',
                'Upgrade-Insecure-Requests':	1,
                'User-Agent':	'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
                Origin: '*'
            }
        }).then(function (moreResults) {
            image = moreResults.data.data.imagesList.FULL_IMAGE[0].url;
        }).catch(() => {
            image = results.data.data.lc;
        })
            .finally(() => {
                res.status(200).json({data: results.data.data.lotDetails, image: image});
            });
    }).catch(res => console.log(res));
});

app.use((req, res, next) => {
    res.send('hello \\(~.~)/');
});

module.exports = app;
