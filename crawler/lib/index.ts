import { SearchMatch } from "@byod/types"

import dork from "@byod/dork";
import layer1Resolver from "./layer1"
import { kaggle, google } from "./layer1/loaders";

import CacheHandler from "./CacheHandler";

const Cache = new CacheHandler();

export { layer1Resolver, kaggle as kaggleLoader, google as googleLoader } 

export default async function (query: string): Promise<Array<SearchMatch>> {
  let intent = dork(query);
  const layer1 = new layer1Resolver(intent);

  layer1.register(kaggle);
  layer1.register(google);
  const foundCache = Cache.get(intent.keywords.join(""));

  if (foundCache.length === 0) {
    let data = await layer1.crawl();
    Cache.cache(intent.keywords.join(""), data);
    return data;
  }

  return foundCache;
}
