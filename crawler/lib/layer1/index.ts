import puppeteer, { Page, Puppeteer } from "puppeteer";
import { EventEmitter } from "node:events";

import { SearchIntent, SearchMatch } from "@byod/types"

import { CACHE_PATH } from "../const";

import path from "node:path";
import fs from "node:fs";

import crypto from "node:crypto";

interface CrawlerStatus {
  status: "progress" | "success",
  message: string,
  data?: any
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function md5(text: string): string {
    let hash = crypto.createHash("md5").update(text).digest("hex");
    return hash;
}

export default class Crawler extends EventEmitter {
  query: SearchIntent;
  cacheDir: string;
  cacheFileName: string;
  cachePath: string;

  constructor(query: SearchIntent) {
    super();
    this.query = query;
    this.cacheDir = path.join(__dirname, CACHE_PATH);
    this.cacheFileName = `./byod-${md5(this.query.keywords.join(""))}.json`
    this.cachePath = path.join(this.cacheDir, this.cacheFileName);
  }

  private async fetchKaggle(): Promise<Array<SearchMatch>> {
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
              keywords: titles[idx].trim().split(" ").map((e: string) => e.toLowerCase()),
              download: `https://kaggle.com${link}/download`,
              origin: `https://kaggle.com${link}`
          }
      })
  }

  private async fetchAndCacheQuery(): Promise<Array<SearchMatch>> {
      const data = await this.fetchAll();
      this.cache(data);
      return data;
  }

  public static sortByKeywordMatches(matches: Array<SearchMatch>, keywords: Array<string>): Array<SearchMatch> {
      return matches.sort((matchA, matchB) => {
          const numMatchesA = matchA.keywords.filter(keyword => keywords.includes(keyword)).length;
          const numMatchesB = matchB.keywords.filter(keyword => keywords.includes(keyword)).length;
          return numMatchesB - numMatchesA; // Sort in descending order
      });
  }

  private async cache(providedData?: any): Promise<string> {
     if (!fs.existsSync(this.cacheDir)) fs.mkdirSync(this.cacheDir)
     const data = providedData ?? await this.fetchAll();
     fs.writeFileSync(this.cachePath, JSON.stringify(data))
     return this.cachePath;
  }

  async fetchAll() {
    const kgle = await this.fetchKaggle();
    return kgle;
  }

  async get(): Promise<Array<SearchMatch> | null> {
     if (!fs.existsSync(this.cachePath)) {
        let data = await this.fetchAndCacheQuery();
        return data;
     }

     let data = JSON.parse(fs.readFileSync(this.cachePath, "utf-8"));

     if (data) return data;
     data = await this.fetchAndCacheQuery()
      return data;
  }
}
