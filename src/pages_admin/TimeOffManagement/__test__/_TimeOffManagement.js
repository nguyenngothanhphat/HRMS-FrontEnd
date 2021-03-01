const puppeteer = require('puppeteer-core');

const test = (async () => {
    const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/time-off-management');
  console.log(await page.content())
  // puppeteer.
  await browser.close();
})()

test()