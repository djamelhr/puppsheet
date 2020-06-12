var express = require('express');
var router = express.Router();
var request = require('request');
const moment = require("moment");

/* GET home page. */
router.get('/', function(req, res, next) {
  var model = {
    title:'Odds',
    value:'20200216',
    answer:''
  };

  res.render('index', model);

});

router.post('/', function(req, res) {
  var link = moment(req.body.link).format("YYYYMMDD");
  
  console.log(link)
  // "https://www.oddsportal.com/matches/soccer/"

  const url1 ="https://us-central1-nodepupp.cloudfunctions.net/sheetdjo/users/"
  const url2 = "http://localhost:8080/users/"

  request.get({url:url1+link},
  function(error, response, body) {
          if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
        console.log(data)
            var model = {
              title:"Successfully",
              value:req.body.link,
              answer:data.foot
            };
  
            res.render('date', model);
          }
        }
  
  )
  // if(req.body.conversion === 'Celsius'){
  //   whichFunction = 'to-celsius';
  // }
  // else{
  //   whichFunction = 'to-fahrenheit';
  // }
  
  //var URL = "https://us-central1-nodepupp.cloudfunctions.net/converter/api/conversions/";

  // request.get({ url: URL + whichFunction + "/" +  link},
  //     function(error, response, body) {
  //       if (!error && response.statusCode === 200) {

  //         var data = JSON.parse(body);

  //         var model = {
  //           title:'Converter',
  //           value:data.valueToConvert,
  //           answer:data.convertedValue
  //         };

  //         res.render('index', model);
  //       }
  //     });
  
});

module.exports = router;


