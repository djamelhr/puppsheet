var express = require('express');
const { google } = require("googleapis");
const moment = require("moment");
const keys = require("../keys.json");
const puppeteer = require("puppeteer");
var router = express.Router();
Object.defineProperty(Array.prototype, "chunk_inefficient", {
  value: function(chunkSize) {
    var array = this;
    return [].concat.apply(
      [],
      array.map(function(elem, i) {
        return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
      })
    );
  }
});
router.get('', async (req, res,next)=> {

res.send("goo")
});
/* GET users listing. */

router.get('/:ur', async (req, res,next)=> {
  let browserPromise = puppeteer.launch({
    args:[
      '--no-sandbox'  
    ],
  });
const URL = "https://www.oddsportal.com/matches/soccer/"+req.params.ur ;
console.log(URL);


    const browser = await browserPromise ;
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto(URL);
    let data = await page.evaluate(() => {
        let t = document.querySelector(".table-main");
        let n = t.getElementsByClassName("name").length;
        let len = t.getElementsByClassName("name").length * 3;
        let matchs = [];
        let odd = [];
    
        for (let i = 0; i < len; i++) {
          odd.push(t.getElementsByClassName("odds-nowrp")[i].innerText);
        }
    
        for (let index = 0; index < n; index++) {
          matchs.push([
           t.getElementsByClassName("name")[index].innerText.trim() ,
            t.getElementsByClassName("info-value")[index].innerText
          ]);
        }
    
        return {
          matchs,
          odd
        };
      });
      context.close();
      let odds = data.odd.chunk_inefficient(3);
      for (let i = 0; i < odds.length; i++) {
        data.matchs[i].push(odds[i][0]);
        data.matchs[i].push(odds[i][1]);
        data.matchs[i].push(odds[i][2]);
        data.matchs[i].push(moment().format("dddd:HH:mm"));
      }
     // console.log(data.matchs);
     let matchsArray = []
      data.matchs.forEach((bl)=>{
        matchsArray.push({
          match :bl[0],
          bx:bl[1],
          one :bl[2],
          x : bl[3],
          two : bl[4]
        }) ;

      });
      var answer = {link:req.params.URL,
        foot:matchsArray};

    
      
  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets"]
  );
  client.authorize((err, tokens) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("connected");
      gsrun(client);
    }
  });
  async function gsrun(cl) {
    const gsapi = google.sheets({ version: "v4", auth: cl });
    // const opt ={
    //     spreadsheetId : '1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc' ,
    //     range : 'odds!A1:E5'
    // };
    // let val = await gsapi.spreadsheets.values.get(opt);
    // console.log(val.data.values);

    const updateOpt = {
      spreadsheetId: "1O1kcu1G16R7WWa1sp0ouNwNuw8xfno2uII9Sj4L8MZc",
      range: "odds!A2:L",
      valueInputOption: "USER_ENTERED",
      resource: { values: data.matchs }
    };
    let result = await gsapi.spreadsheets.values.append(
      updateOpt,
      (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        
        console.log(response);
        res.send(answer);
      }
    );
  }
});

module.exports = router;
