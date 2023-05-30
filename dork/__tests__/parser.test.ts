import { test, describe, expect } from "@jest/globals";

import dork from "../lib";

describe("tests for the query parser", () => {
  test('keywords are being extracted correctly', () => {
    const i = dork(`bitcoin pricing data`);
    expect(i.keywords).toEqual(["bitcoin", "price", "data"])
  });
  test(`the filters are being extracted`, () => {
    const i = dork(`news data include:"covid","coronavirus"`);
    expect(i.filters).toEqual([
        {
            type: "include",
            data: ["covid", "coronavirus"]
        }
    ])

  })
  test("if larger queries are being handled", () => {
    const i = dork(`sports news include:nfl,"sports_league" format:SNo,TeamName,Points`)
    expect(i.keywords).toEqual(["sport", "new"])
    expect(i.filters).toEqual([
        {type: "include", data: ["nfl", "sports_league"]},
        {type: "format", data: ["SNo","TeamName","Points"]},
    ])
  })

  test('should handle empty input', () => {
    const input = "";
    const expectedOutput = {
      summary: '',
      keywords: [],
      filters: [],
      sorters: []
    };

    const parsedOutput = dork(input);
    expect(parsedOutput).toEqual(expectedOutput);
  });

  test('should handle input with only keywords', () => {
    const input = "bitcoin price data";
    const expectedOutput = {
      summary: 'bitcoin price data',
      keywords: ['bitcoin', 'price', 'data'],
      filters: [],
      sorters: []
    };

    const parsedOutput = dork(input);
    expect(parsedOutput).toEqual(expectedOutput);
  });

  test('should handle input with multiple filters and sorters', () => {
    const input = "bitcoin pricing data language:en-in format:SNo,Price sort by length";
    const expectedOutput = {
      summary: 'bitcoin price data sort by length',
      keywords: ['bitcoin', 'price', 'data'],
      filters: [
        { type: 'language', data: ['en-in'] },
        { type: 'format', data: ['SNo', 'Price'] }
      ],
      sorters: [
        { type: 'length', by: 'length' }
      ]
    };

    const parsedOutput = dork(input);
    expect(parsedOutput).toEqual(expectedOutput);
  });
})
