import puppeteer, { Page, Puppeteer } from "puppeteer";

import { SearchMatch } from "@byod/types"

import dork from "@byod/dork";
import layer1Resolver from "./layer1"
import { kaggle } from "./layer1/loaders";


async function scrape(query: string): Promise<Array<SearchMatch>> {
  let intent = dork(query);
  const layer1 = new layer1Resolver(intent);
  layer1.register(kaggle);

  const data = await layer1.crawl();
  return data ?? [];
}

(async () => {
  const data = await scrape("bitcoin pricing data");
})();
