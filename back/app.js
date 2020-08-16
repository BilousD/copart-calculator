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
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
            'Cookie': 'visid_incap_242093=9dNaPzxwSASd4xVhKMb4DyC7Ll8AAAAAQUIPAAAAAACOm9EaaTHL34nP3BpK1qLv; s_fid=638B9F3B3EDCDEC8-3845CE712005482E; s_nr=1597573586398-Repeat; s_vnum=1599490083096%26vn%3D14; s_lv=1597573586399; s_vi=[CS]v1|2F975D918515C652-400008B7A928A38A[CE]; _gcl_au=1.1.686900853.1596898084; OAID=77530217dc92584eb54ef6557a9b305a; __gads=ID=81bcceec2283ee18:T=1597085665:S=ALNI_MYnJ10JHTeKz_ySd9McQCSsET3YJg; _ga=GA1.2.1670396552.1596898084; _fbp=fb.1.1596898084829.2075633830; __cfduid=d6bee61ce907ca4ff480807e32ae075621596904930; _gid=GA1.2.1508665504.1597334206; s_ppvl=public%253Apremier-member-fees%2C59%2C13%2C4214%2C1920%2C902%2C1920%2C1080%2C1%2CP; s_ppv=https%253A%2F%2Fwww.copart.com%2FContent%2Fus%2Fen%2Fpremier-member-fees%2C41%2C19%2C2903%2C1920%2C942%2C1920%2C1080%2C1%2CP; G2JSESSIONID=B6FCF81AF148EA7D89021AF6D4981DEE-n1; userLang=en; incap_ses_471_242093=+wkwXAZiLiNW6uDDKFSJBskJOV8AAAAAHQigPTwtbOOm9RxCutuACw==; copartTimezonePref=%7B%22displayStr%22%3A%22EEST%22%2C%22offset%22%3A3%2C%22dst%22%3Atrue%2C%22windowsTz%22%3A%22Europe%2FHelsinki%22%7D; timezone=Europe%2FHelsinki; s_cc=true; OAGEO=UA%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C; incap_ses_104_242093=DXoMJZXipxbbQ2h4xHtxAajFNl8AAAAAmpMrD91nricCV2l1RmFp3w==; s_sq=%5B%5BB%5D%5D; g2usersessionid=713bc97ef3fb607e35728bb615a1ad66; g2app.locationInfo=%7B%22countryCode%22%3A%22UKR%22%2C%22countryName%22%3A%22Ukraine%22%2C%22stateName%22%3A%22Kyiv%22%2C%22stateCode%22%3A%2218%22%2C%22cityName%22%3A%22Kiev%22%2C%22latitude%22%3A50.45466%2C%22longitude%22%3A30.5238%2C%22zipCode%22%3A%2238131%22%2C%22timeZone%22%3A%22%2B03%3A00%22%7D; s_depth=1; s_pv=public%3Apremier-member-fees; s_invisit=true; s_lv_s=Less%20than%201%20day; usersessionid=1e4a3cac16ebec272c21cc19ed4e1f1e; _uetsid=dfb12c13719eb8361831faec825bbd16; _uetvid=d638887c8d8b399ba48a3a5a3a218e7f; _gat_UA-90930613-1=1'
        }
    }).then(function (results) {
        if (results.data.data) {
            axios({
                method: 'GET',
                url: `https://www.copart.com/public/data/lotdetails/solr/lotImages/${req.body.uri}/USA`,
                headers: {
                    'Upgrade-Insecure-Requests': 1,
                    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
                    'Cookie': 'visid_incap_242093=9dNaPzxwSASd4xVhKMb4DyC7Ll8AAAAAQUIPAAAAAACOm9EaaTHL34nP3BpK1qLv; s_fid=638B9F3B3EDCDEC8-3845CE712005482E; s_nr=1597573586398-Repeat; s_vnum=1599490083096%26vn%3D14; s_lv=1597573586399; s_vi=[CS]v1|2F975D918515C652-400008B7A928A38A[CE]; _gcl_au=1.1.686900853.1596898084; OAID=77530217dc92584eb54ef6557a9b305a; __gads=ID=81bcceec2283ee18:T=1597085665:S=ALNI_MYnJ10JHTeKz_ySd9McQCSsET3YJg; _ga=GA1.2.1670396552.1596898084; _fbp=fb.1.1596898084829.2075633830; __cfduid=d6bee61ce907ca4ff480807e32ae075621596904930; _gid=GA1.2.1508665504.1597334206; s_ppvl=public%253Apremier-member-fees%2C59%2C13%2C4214%2C1920%2C902%2C1920%2C1080%2C1%2CP; s_ppv=https%253A%2F%2Fwww.copart.com%2FContent%2Fus%2Fen%2Fpremier-member-fees%2C41%2C19%2C2903%2C1920%2C942%2C1920%2C1080%2C1%2CP; G2JSESSIONID=B6FCF81AF148EA7D89021AF6D4981DEE-n1; userLang=en; incap_ses_471_242093=+wkwXAZiLiNW6uDDKFSJBskJOV8AAAAAHQigPTwtbOOm9RxCutuACw==; copartTimezonePref=%7B%22displayStr%22%3A%22EEST%22%2C%22offset%22%3A3%2C%22dst%22%3Atrue%2C%22windowsTz%22%3A%22Europe%2FHelsinki%22%7D; timezone=Europe%2FHelsinki; s_cc=true; OAGEO=UA%7C%7C%7C%7C%7C%7C%7C%7C%7C%7C; incap_ses_104_242093=DXoMJZXipxbbQ2h4xHtxAajFNl8AAAAAmpMrD91nricCV2l1RmFp3w==; s_sq=%5B%5BB%5D%5D; g2usersessionid=713bc97ef3fb607e35728bb615a1ad66; g2app.locationInfo=%7B%22countryCode%22%3A%22UKR%22%2C%22countryName%22%3A%22Ukraine%22%2C%22stateName%22%3A%22Kyiv%22%2C%22stateCode%22%3A%2218%22%2C%22cityName%22%3A%22Kiev%22%2C%22latitude%22%3A50.45466%2C%22longitude%22%3A30.5238%2C%22zipCode%22%3A%2238131%22%2C%22timeZone%22%3A%22%2B03%3A00%22%7D; s_depth=1; s_pv=public%3Apremier-member-fees; s_invisit=true; s_lv_s=Less%20than%201%20day; usersessionid=1e4a3cac16ebec272c21cc19ed4e1f1e; _uetsid=dfb12c13719eb8361831faec825bbd16; _uetvid=d638887c8d8b399ba48a3a5a3a218e7f; _gat_UA-90930613-1=1'
                }
            }).then(function (moreResults) {
                image = moreResults.data.data.imagesList.FULL_IMAGE[0].url;
            }).catch(() => {
                image = results.data.data.lc;
            })
                .finally(() => {
                    res.status(200).json({data: results.data.data.lotDetails, image: image});
                });
        } else {
            console.log(results.data);
            res.status(503).json({errorText: 'Could not connect to Copart'});
        }
    }).catch(res => console.log(res));
});

app.use((req, res, next) => {
    res.send('hello');
});

module.exports = app;
