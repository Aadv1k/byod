import puppeteer, { Page, Puppeteer } from "puppeteer";
import { SearchIntent, SearchMatch } from "@byod/types"

import { sleep } from "../../utils";

export default async function (query: SearchIntent): Promise<Array<SearchMatch>> {
    const kaggleQuery = encodeURIComponent(query.keywords.join(" "));
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
              keywords: titles[idx].trim().split(" ").map((e: string) => e.toLowerCase()),
              download: `https://kaggle.com${link}/download`,
              origin: `https://kaggle.com${link}`
          }
      })
  }
