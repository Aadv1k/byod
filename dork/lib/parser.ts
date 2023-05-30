import { Token, GenericFilter, SearchIntent }  from "@byod/types";
import util from "node:util"

import { isCommonNoun, isFillerWord } from "./grammar";

import tokenize from "./tokenizer";
function isRealYear(year: number): boolean {
  const currentYear = new Date().getFullYear(); // Get the current year

  // Check if the year is within a valid range
  if (year > currentYear || year < 1983) {
    return false;
  }
  return true;
}

function getStartAndEndDateOfYear(year: number): Array<any> {
  const startDate = new Date(year, 0, 1); // January 1st of the year
  const endDate = new Date(year, 11, 31); // December 31st of the year

  return [ startDate, endDate ];
}

function stripQuotes(str: string): string {
  if (str.length >= 2 && (str[0] === '"' || str[0] === "'") && str[0] === str[str.length - 1]) {
    return str.slice(1, -1);
  }
  return str;
}


function parse(tokens: Array<Token>): SearchIntent {
  const blob = {
    keywords: [],
    filters: [],
    summary: ""
  } as SearchIntent;

  for (const token of tokens) {
    switch (token.type) {
      case "word": 
         if (!token.word) continue;
        if (isFillerWord(token.word)) continue;
        if (Number(token.word)) { 
            if (isRealYear(token.word)) {
              blob.filters.push({
                type: "date",
                data: getStartAndEndDateOfYear(Number(token.word))
              })  
            }
            continue;
         }
        blob.keywords.push(token.word.trim());
        break;
      case "filter": 
        if (token.lhs === "language")  { blob.filters.push({type: "language", data: [token.rhs]}) }
        else if (token.lhs === "format")  { blob.filters.push( {type: "format", data: token.rhs.split(",").map(e => e.trim())}) }
        else if (token.lhs === "include")  { blob.filters.push( {type: "include", data: token.rhs.split(",").map(e => stripQuotes(e.trim()))}) }
        break;
      default:
        throw new Error("something went wrong in the parse function of the dork/lib/parser ")
    }
  }

  return blob;
}
const query = `get cool news data include:"covid","coronavirus"`
// "bitcoin pricing data 2023 language:en-in format:SNo,Price"
const output = parse(tokenize(query));

console.log(util.inspect(output, {showHidden: false, depth: null, colors: true}))