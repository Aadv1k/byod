# `@byod/crawler`

- Uses [`@byod/dork`](../dork)

This is the core crawler for the app. It takes in a natural query and returns either raw bytes or a link to the CSV resource. 

## Example

> bitcoin pricing data

```javascript
[
  // ...
  {
    title: 'Bitcoin Historical Data',
    keywords: ["bitcoin", "historical"],
    download: 'https://kaggle.com/datasets/mczielinski/bitcoin-historical-data/download',
    origin: 'https://kaggle.com'
  },
  {
    title: 'Bitcoin Tweets',
    keywords: ["bitcoin", "tweets"],
    download: 'https://kaggle.com/datasets/kaushiksuresh147/bitcoin-tweets/download',
    origin: 'https://kaggle.com'
  }
  // ...
]
```

## How it works

The scraper works in layers, this means if a layer yields no result, we will proceed onto the next layer.

- Layer 1: source the data from exisiting resources, eg: [kaggle](https://kaggle.com) or filtered google searches.
- [TBD] Layer 2: we maintain our own database of datasets which are updated automatically. 

When it finds any data, it will locally cache it to `.byod-cache` for better performance. You can modify the default path in [`const.ts`](./lib/const.ts)

## Usage

by default we export the primary search feature, this handles both the *caching* and the fetching of the data.

```typescript
import search from "@byod/crawler";

search("bitcoin pricing data 2020");
```

We export the resolver for layer1. To this resolver you have to *register* loaders it will use to fetch data, this allows for more modular code and better control over the program.

> NOTE: to add your own "loader" implement it with the following signature `(i: SearchIntent) => Promise<Array<SearchMatch>>;` for more info refer to [@byod/types](../types)

```typescript
import { layer1Resolver, kaggleLoader, googleLoader } from "@byod/crawler";
import dork from "@byod/dork";

const query = "bitcoin pricing data"
const layer1 = new layer1Resolver(dork(query));

layer1.register(kaggleLoader);
layer1.register(googleLoader);

layer1.crawl()
```
