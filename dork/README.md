# `@byod/dork`

This is the natural-query parser for the search. It's aimed to be **minmal** and **zero-dependency**.

## How it works

At it's core it serializes natural (ish) language into a date first format.

> bitcoin pricing data 2023 language:en-in format:SNo,Price

```javascript
{
  summary: 'bitcoin price data 2023',
  keywords: [ 'bitcoin', 'price', 'data' ],
  filters: [
    {
      data: [ 2022-12-31T18:30:00.000Z, 2023-12-30T18:30:00.000Z ]
    },
    { type: 'language', data: [ 'en-in' ] },
    { type: 'format', data: [ 'SNo', 'Price' ] }
  ],
  sorters: []
}
```

The way we achieve this is a 2-step process. 

1. Tokenization
    1. Split the input by spaces
    2. Loop each word and determine if is a "word" or a "filter"
    3. Depending on the above, stem the word into it's base form
2. Parsing
    1. With the list of tokens, remove all "filler" words eg: prepositions, conjuations etc, put them into `keywords`
    2. The, parse through the filters with their appropriate logic, eg `-site:cnet.*`


## Usage

By default we export the parser.

```typescript
import dork from "@byod/dork" 

const query = "bitcoin pricing data 2023 language:en-in format:SNo,Price"

dork(query);
```

Optionally, you can also access the stemmer and the tokenizer for the module

```typescript
import { stem, tokenize } from "@byod/dork" 

const query = "bitcoin pricing data 2023 language:en-in format:SNo,Price"

tokenize(query);
stem("tempting") === stem("temptation") // true;
```


## Bootstrap

```shell
npm run test # jest
npm run build # tsc
npm run dev # tsc --watch
```
