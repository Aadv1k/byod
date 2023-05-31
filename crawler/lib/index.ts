import puppeteer from "puppeteer";
import { EventEmitter } from "node:events";
import dork from "@byod/dork";

class Crawler extends EventEmitter {
  query: string;

  constructor(query: string) {
    super();
    this.query = dork(query);
  }
}


async function run() {
  const searchURL =
    "https://www.kaggle.com/search?q=bitcoin+price+datasetFileTypes%3Acsv";
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.setJavaScriptEnabled(true);
  await page.goto(searchURL);

  setTimeout(async () => {
    await page.waitForSelector(".sc-dQDPHY");
    const ulElement = await page.$(".sc-dQDPHY");
    if (ulElement) {
      const links = await ulElement.$$("a");

      for (const link of links) {
        const textContent = await link.evaluate((el) => el.getAttribute("href"));
        console.log(textContent);
      }
    }

    await browser.close();
  }, 5_000);
}

run();
