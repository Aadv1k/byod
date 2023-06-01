# `@byod/crawler`

- Uses [`@byod/dork`](../dork)

This is the core crawler for the app. It takes in a natural query and returns either raw bytes or a link to the CSV resource. 

## How it works

The scraper works in layers, this means if a layer yields no result, we will proceed onto the next layer.

- Layer 1: for the layer one we query popular dataset providers like kaggle to find our match for the data
- Layer 2: we use a combination of filtering and search to extract data via *google*
- [TBD] Layer 3: we access our own internal datasets to try and find the desired output

When it finds any data, it will locally cache it to `.byod-cache` for better performance. You can modify the default path in [`const.ts`](./lib/const.ts)

## Usage

by default we export the primary scraper 

```
import crawl from "@byod/crawler";


crawl("bitcoin pricing data 2020");
```

Additionaly we also export each layer as it's own logic 


```
import { layer1, layer2 }  from "@byod/crawler";


const query = "bitcoin pricing data 2020";

layer1(query);
layer2(query)
```
