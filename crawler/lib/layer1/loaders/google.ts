import puppeteer, { Page, Puppeteer } from "puppeteer";
import { SearchIntent, SearchMatch } from "@byod/types"

export default async function google(query: SearchIntent, providedPage?: Page): Promise<Array<SearchMatch>> {

  let browser: any;
  let page: Page;

  page = providedPage as Page;

  if (!providedPage) {
    browser = await puppeteer.launch({headless: "new"});
    page = await browser.newPage();
  }

  let output = [];

  const gFilter = "filetype:xls OR filetype:xlsx"
  const gQuery  = `${gFilter} ${query.keywords.join(" ")}`;
  const url: string = `https://www.google.com/search?q=${encodeURIComponent(gQuery)}`;

  await page.goto(url);
  await page.waitForSelector('#search');

  const searchResults = await page.$$('#rso > div');

  for (const result of searchResults) {
    const linkElement  = await result.$('a');
    const titleElement = await result.$('h3');
    const ftElement = await result.$("div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)")
    //const descElement = await result.$("div:nth-child(1) > div > div > div:nth-child(2) > div > span")

    const href = await linkElement?.evaluate((e: Element) => e.getAttribute('href'));
    const title = await titleElement?.evaluate((e: Element) => e.textContent);
    const ft = await ftElement?.evaluate((e: Element) => e.textContent);
    //const desc = await descElement?.evaluate((e: Element) => e.textContent);

    if (![href, title, ft].every(e => e)) continue;

    const u = new URL(href as string);

    output.push({
        title: title as string,
        keywords: (title as string).trim().split(" "),
        download: u.href,
        origin: u.origin,
    })
  }

  await browser.close();
  return output;
}
