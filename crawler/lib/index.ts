import puppeteer, { Page, Puppeteer } from "puppeteer";
import { EventEmitter } from "node:events";

import dork from "@byod/dork";
import layer1Resolver from "./layer1"


async function crawl(query: string): Promise<void> {
  let intent = dork(query);
  console.log(`[INFO] searching: ${intent.summary}`);
  const layer1 = new layer1Resolver(intent);
  const data = await layer1.fetchKaggle();
  console.log(data);
}

crawl("bitcoin pricing data");
