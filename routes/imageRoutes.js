var express = require("express");
const puppeteer = require("puppeteer");
const { google } = require("googleapis");
const moment = require("moment");
const keys = require("../keys.json");
var router = express.Router();

router.get("/", async (req, res, next) => {
  let browserPromise = await puppeteer.launch({
    headless: false,
    args: ["--incognito"],
  });

  const URL = "https://www.tvg.com/racetracks/GG/golden-gate-fields?race=11";
  //await page.waitFor(5000);
  const browser = await browserPromise;
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: "load", timeout: 0 });
  //debugger;
  await page.waitFor(5000);
  await page.goto(URL, { waitUntil: "load", timeout: 0 });

  let data = await page.evaluate(() => {
    let t = document.querySelector(".race-current-odds");

    return {
      t,
    };
  });
  await page.waitFor(60000);
  // await continueButton[0].click();
  await page.close();

  //await page.waitFor(10000);
  res.send(data.t);
});
module.exports = router;

//*[@id="closeQubitModal"]

//*[@id="maincontainer"]/section/ng-view/raceprogram/div/div[2]/main/div[2]/div/table/tbody/tr[1]/td[2]/strong
