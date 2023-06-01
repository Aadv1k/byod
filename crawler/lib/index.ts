import puppeteer from "puppeteer";
import { EventEmitter } from "node:events";

import dork from "@byod/dork";
import { SearchIntent } from "@byod/types";

interface CrawlerStatus {
  status: "progress" | "success",
  message: string,
  data?: any
}

function emitEvent(context: EventEmitter, obj: CrawlerStatus) {
  context.emit(obj.status, obj);
}

class Crawler {
  query: SearchIntent;

  constructor(query: string) {
    this.query = dork(query);
  }

  async crawl(): Promise<void> {
    const kaggleQuery = encodeURIComponent(this.query.keywords.join(" "));
    const kaggleFilters = encodeURIComponent("datasetFileTypes:csv") + "+" +
                      encodeURIComponent("datasetLicense:Commercial")
    const kaggleSearch = `https://www.kaggle.com/search?q=${kaggleQuery}+${kaggleFilters}` 
    
    /*
    emitEvent(this, {
      status: "progress",
      message: `searching on kaggle: ${kaggleSearch}`
    })
    */
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setJavaScriptEnabled(true);
    await page.goto(kaggleSearch);

    setTimeout(async () => {
      await page.waitForSelector(".sc-dQDPHY");
      const ulElement = await page.$(".sc-dQDPHY");
      const pageLinks = (await ulElement?.$$("a"))?.map(e => {
          return e.evaluate((i) =>
            i.getAttribute("href")
          );
      })
      const links = await Promise.all(pageLinks as any);

      const pageMeta = (await ulElement?.$$("li"))?.map((e, idx) => {
          return e.evaluate((i) => {
            return {
              title: i.getElementsByTagName("h6")[0].textContent,
              published: i.querySelector("div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)")?.textContent,
            }
          }); 
        })
      let meta = await Promise.all(pageMeta as any);
      meta = meta.map((e: any, i) => {
        return {
          ...e,
          link: "https://kaggle.com" + links[i],
        };
      });
      console.log(meta);
      await browser.close();
    }, 3_000);
  }
}

const crawler = new Crawler("bitcoin pricing data 2023");
crawler.crawl();