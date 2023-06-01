import puppeteer, { Page, Puppeteer } from "puppeteer";
import { EventEmitter } from "node:events";

import dork from "@byod/dork";
import layer1Resolver from "./layer1"


async function scrape(query: string): Promise<void> {
  let intent = dork(query);
  const layer1 = new layer1Resolver(intent);
  const data = await layer1.get();
  return data;
}

(async () => {
  const data = await scrape("bitcoin pricing data");

console.log(
    layer1Resolver.sortByKeywordMatches(
        data,
        ["historical"]))

})();

