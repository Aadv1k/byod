import puppeteer, { Page, Puppeteer } from "puppeteer";
import { SearchIntent, SearchMatch, BaseCrawler } from "@byod/types"

import { md5 } from "../utils";

type Layer1Fetcher = (i: SearchIntent) => Promise<Array<SearchMatch>>;

export default class Crawler implements BaseCrawler {
  query: SearchIntent;
  private fetchers: Array<Layer1Fetcher>;

  constructor(query: SearchIntent) {
    this.query = query;
    this.fetchers = [];
  }

  public register(i: Layer1Fetcher): void {
      this.fetchers.push(i);
  }

  async crawl(): Promise<Array<SearchMatch>> {
      if (this.fetchers.length === 0) {
          console.warn("[WARN] No loaders were specified for layer1 crawler")
          return [];
      }
      
      let result = [];
      for (const loader of this.fetchers) {
          let d = await loader(this.query);
          result.push(...d);
      }
      return result;
  }
}
