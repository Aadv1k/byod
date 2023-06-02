import puppeteer, { Page, Puppeteer } from "puppeteer";

import { SearchMatch } from "@byod/types"

import dork from "@byod/dork";
import layer1Resolver from "./layer1"
import { kaggle } from "./layer1/loaders";

import CacheHandler from "./CacheHandler";


const Cache = new CacheHandler();

async function scrape(query: string): Promise<Array<SearchMatch>> {
  let intent = dork(query);
  const layer1 = new layer1Resolver(intent);
  layer1.register(kaggle);

  const foundCache = Cache.get(intent.keywords.join(""));
  if (foundCache.length === 0) {
    const data = await layer1.crawl();
    Cache.cache(intent.keywords.join(""), data);
    return data;
  }

  return foundCache;
}

(async () => {
  const data = await scrape("bitcoin pricing data");
  console.log(data);
})();

