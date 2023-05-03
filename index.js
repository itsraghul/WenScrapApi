const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();


const cryptoDataLoad = async () => {
    const coinArray = [];
    const targetURL = 'https://coinmarketcap.com/';
    await axios(targetURL).then((response) => {
        const body = response.data;
        const $ = cheerio.load(body);
        const selectedElem = '#__next > div.sc-e000aecc-1 jOTqLC > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div.grid  > div > div.sc-beb003d5-2 bkNrIb  table.sc-beb003d5-3 ieTeVa cmc-table   > tbody > tr';
        const keys = [
            'No.',
            'Coin',
            'Price',
            '24h',
            '7d',
            'Marketcap',
            'Volume',
            'CirculatingSupply',
        ];
        $(selectedElem).each((parentIndex,parentElem)=>{
            let keyIndex = 0;
            const coinDetails = {};
            if(parentIndex <= 9){
                $(parentElem).children().each((childId,childElem)=>{
                    const value = $(childElem).text();
                    if(value){
                        coinDetails[keys[keyIndex]] = value;
                        keyIndex++;
                    }
                })
                coinArray.push(coinDetails);
            }
        });
    });
    return coinArray;
}

const driverList = async () =>{
    const targetURL = 'https://www.formula1.com/en/drivers.html';
    const items = [];
    await axios(targetURL).then((res)=>{
        const body = res.data;
        const $ = cheerio.load(body);
        $('.listing-items--wrapper > .row > .col-12').map((i, el) => {
            const rank = $(el).find('.rank').text();
            const points = $(el).find('.points > .f1-wide--s').text();
            const firstName = $(el).find('.listing-item--name span:first').text();
            const lastName = $(el).find('.listing-item--name span:last').text();
            const team = $(el).find('.listing-item--team').text();
            const photo = $(el).find('.listing-item--photo img').attr('data-src');

             items.push({
                rank,
                points,
                firstName,
                lastName,
                team,
                photo
            });
         });
         
    });

    return items;
}


app.get('/api/crypto',async (req,res)=>{
    try{
        const crypto = await cryptoDataLoad();
        return res.status(200).json({
            result :  crypto,
        })
    }catch(err){
        return res.status(500).json({
            err : err.toString(),
        })
    }
});

app.get('/api/f1-drivers',async (req,res)=>{
    try{
        const list = await driverList();
        return res.status(200).json({
            result :  list,
        })
    }catch(err){
        return res.status(500).json({
            err : err.toString(),
        })
    }

   
});

// setInterval(cryptoDataLoad, 10000);

app.listen(3500,()=>{
    console.log('Server listening on port 3500');
})