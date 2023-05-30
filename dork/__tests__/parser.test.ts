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
})
