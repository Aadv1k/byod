import { test, describe } from "@jest/globals";


const outputs = [
    {
        intent: 'Bitcoin pricing data',
        filters: [],
        sorts: []
    },

    {

        intent: 'Bitcoin pricing data',
        filters: [
            {
                type: 'exclude',
                keyword: 'news'
            }
        ],
        sorts: []
    },

    {
        intent: 'Bitcoin pricing data',
        filters: [
            {
                type: 'date',
                before: '2023-12-31',
                after: '2012-01-01'
            }
        ],
        sorts: []
    },
]

describe("tests for the query parser", () => {
  test.todo('query: `bitcoin pricing data`');
  test.todo('query: `bitcoin pricing data exclude:news`');
  test.todo('query: `bitcoin pricing data after:2012-01-01 before:2023-12-31`');
  test.todo(`news data include:"covid","coronavirus"`)
  test.todo(`covid news data -site:cnet.com after:2019`)
  test.todo(`sports news include:nfl,"sports league" after:2023-01-01 format:SNo-decimal,TeamName-string,Points-integer`)
  test.todo(`news related to apple stock sort by views include:appl,"apple"`)
})
