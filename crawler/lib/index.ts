import puppeteer, { Page, Puppeteer } from "puppeteer";
import { EventEmitter } from "node:events";

import dork from "@byod/dork";
import layer1Resolver from "./layer1"


async function scrape(query: string): Promise<void> {
  let intent = dork(query);
  const layer1 = new layer1Resolver(intent);
  const data = await layer1.get();
  console.log(data);
}

scrape("bitcoin");
