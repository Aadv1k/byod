import { Token, GenericFilter, SearchIntent, FilterToken, WordToken }  from "@byod/types";
import util from "node:util"

import { isCommonNoun, isFillerWord } from "./grammar";

import tokenize from "./tokenizer";

// https://stackoverflow.com/questions/1353684/detecting-an-invalid-date-date-instance-in-javascript
function isValidDate(d: string) {
  let ed = new Date(d)
  return ed instanceof Date;
}

function isRealYear(year: number): boolean {
  const currentYear = new Date().getFullYear();

  // 1990 is a resonable lower-limit since internet was desolate before it
  if (year > currentYear || year < 1990) {
    return false;
  }
  return true;
}

function getStartAndEndDateOfYear(year: number): Array<any> {
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  return [ startDate, endDate ];
}

function stripQuotes(str: string): string {
  if (str.length >= 2 && (str[0] === '"' || str[0] === "'") && str[0] === str[str.length - 1]) {
    return str.slice(1, -1);
  }
  return str;
}


function parseDate(dt: string): Date {
  return new Date(dt);
}

function parse(tokens: Array<Token>): SearchIntent {
  const blob = {
    summary: tokens.filter(e => e.type === "word").map((e: any) => e.word).join(" "),
    keywords: [],
    filters: [],
    sorters: []
  } as SearchIntent;

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    switch (token.type) {
      case "word": 
        token = token as WordToken;

        if (!token.word) continue;
        if (isFillerWord(token.word)) continue;
        if (Number(token.word)) { 
            if (isRealYear(Number(token.word))) {
              blob.filters.push({
                type: "date",
                data: getStartAndEndDateOfYear(Number(token.word))
              })  
              continue;
            }
         }
        
        if (token.word === "sort") {
          // we assume "sort by date" or "sort foo" so our offset makes sense
          let nextTokens = tokens.slice(i+1, tokens.length)
          let nextNonCommonTokenIndex =  nextTokens.findIndex((e: any ) =>  !isFillerWord(e.word)) + 1;
          let offset = nextNonCommonTokenIndex;

          blob.sorters.push({
            type: "length", // TODO: Find some way to determine this
            by: (tokens[i + nextNonCommonTokenIndex] as WordToken).word,
          })

          i+=offset;
          continue;
        }
        blob.keywords.push(token.word.trim());
        break;
      case "filter": 
        token = token as FilterToken;
        if (token.lhs === "language")  { blob.filters.push({type: "language", data: [token.rhs]}) }
        else if (token.lhs === "format")  { blob.filters.push( {type: "format", data: token.rhs.split(",").map(e => e.trim())}) }
        else if (token.lhs === "include")  { blob.filters.push( {type: "include", data: token.rhs.split(",").map(e => stripQuotes(e.trim()))}) }
        else if (token.lhs === "-site")  { blob.filters.push( {type: "excludeSite", data: token.rhs.split(",").map(e => stripQuotes(e.trim()))}) }
        else if (token.lhs === "after")  {
          if (!isValidDate(token.rhs)) continue;
          blob.filters.push( {type: "date", data: [parseDate(token.rhs), new Date()]}) 
        }
        else if (token.lhs === "before")  {
          if (!isValidDate(token.rhs)) continue;
          blob.filters.push( {type: "date", data: [new Date("2000"), parseDate(token.rhs)]}) 
        }
        break;
      default:
        throw new Error("something went wrong in the parse function of the dork/lib/parser")
    }
  }
  return blob;
}
//const query = `sports news include:nfl,sports_league before:2023-01-01 format:SNo,TeamName,Points`
const query = "bitcoin pricing data 2023 language:en-in format:SNo,Price"
// get cool news data include:"covid","coronavirus"
const output = parse(tokenize(query));

console.log(util.inspect(output, {showHidden: false, depth: null, colors: true}))