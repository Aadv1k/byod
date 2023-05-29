import {describe, test} from '@jest/globals';

describe("if the query parser works", () => {
  test.todo(`news data include:"covid","coronavirus"`)
  test.todo(`covid news data -site:cnet.com after:2019`)
  test.todo(`sports news include:nfl,"sports league" after:2023-01-01 format:SNo-decimal,TeamName-string,Points-integer`)
  test.todo(`news related to apple stock sort by views include:"appl","apple"`)
})
