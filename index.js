const axios=require('axios');
const cheerio=require('cheerio');
require('dotenv').config();

const url='https://www.amazon.in/Marvel-Encyclopedia-New-Stan-Lee/dp/1465478906/ref=sr_1_1?crid=9XPQ7W782VWN&keywords=marvel+encyclopedia&qid=1662238649&sprefix=%2Caps%2C262&sr=8-1';

const sid=process.env.ACCOUNT_SID;
const at=process.env.AUTH_TOKEN;
const client=require('twilio')(sid,at);
console.log(sid,at)
const product={name:"",price:"",link:""};
product.link=url;
async function scrapeData()
{
    const {data}= await axios.get(url);
    //console.log(data);
    const $=cheerio.load(data);
    const item=$('div#dp-container');
    product.name=$(item).find('h1#title span#productTitle').text();
    p=$(item).find('span .a-price-whole').first().text().replace(/,/g, '');
    const priceNum=parseInt(p);
    product.price=priceNum;
    console.log(product);

    if(priceNum<3000) // the price is set below 3000 to trigger for test purposes
    {  
        client.messages.create({
            body:`The price of ${product.name} went below ${p}. But at ${product.link}`,
            from:'+19793785300',
            to:'+917985701301'
        }).then((msg)=>{
            console.log(msg)
        }).catch((err)=>{
            console.log(err);
        })
        
    }
}
scrapeData();