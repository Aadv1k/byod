import puppeteer, { Page, Puppeteer } from "puppeteer";
import { EventEmitter } from "node:events";

import { SearchIntent } from "@byod/types"

import { CACHE_PATH } from "../const";

import path from "node:path";
import fs from "node:fs";

interface CrawlerStatus {
  status: "progress" | "success",
  message: string,
  data?: any
}

interface CrawlerIndex {
  title: string,
  keywords: Array<string>,
  download: string
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default class Crawler extends EventEmitter {
  query: SearchIntent;
  cacheDir: string;

  constructor(query: SearchIntent) {
    super();
    this.query = query;
    this.cacheDir = path.join(__dirname, CACHE_PATH);
  }

  async fetchKaggle(): Promise<Array<CrawlerIndex>> {
    const kaggleQuery = encodeURIComponent(this.query.keywords.join(" "));
    const kaggleFilters = encodeURIComponent("datasetFileTypes:csv") + "+" +
                      encodeURIComponent("datasetLicense:Commercial")
    const kaggleSearch = `https://www.kaggle.com/search?q=${kaggleQuery}+${kaggleFilters}` 

    const kaggleTarget = ".sc-dQDPHY"
    
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setJavaScriptEnabled(true);
    await page.goto(kaggleSearch);
    await sleep(1_500);

    await page.waitForSelector(kaggleTarget);
    const ulElement = await page.$(kaggleTarget);

    const pageLinks = (await ulElement?.$$("a"))?.map(e => {
        return e.evaluate((i) => i.getAttribute("href"));
    })
    const links = await Promise.all(pageLinks as any);

    const pageTitles = (await ulElement?.$$("li"))?.map((e, idx) => {
           return e.evaluate((i) => i.getElementsByTagName("h6")[0].textContent); 
    })
    let titles = await Promise.all(pageTitles as any);

    await browser.close();

    return links.map((link, idx) => {
          return {
              title: titles[idx],
              keywords: titles[idx].trim().split(" "),
              download: `https://kaggle.com${link}/download`,
          }
      })
  }

  index(filepath?: string): void {
     if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir)
     filepath = filepath ?? "./byod-layer1.json"
     const cachePath = path.join(this.cacheDir, filepath);
  }

}
