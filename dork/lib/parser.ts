import { Token, GenericFilter, SearchIntent, FilterToken, WordToken, ActionType }  from "@byod/types";
import util from "node:util"

import stem from "./stemmer/porter";

import { isCommonNoun, isFillerWord, isVerb, isAdjective} from "./grammar";

import tokenize from "./tokenizer";

function actionType(word: string): ActionType {
  const normalizedInput = word.toLowerCase().trim();

  const delKw = new Set(["drop", "remove", "delete", "pop"])
  const addKw = new Set(["append", "insert", "push", "add"])

  if (delKw.has(word)) {
    return ActionType.DELETE;
  } else if (addKw.has(word)) {
    return ActionType.CREATE;
  }

  return ActionType.NONE
}


function isKeyword(word: string): boolean {
    return (
        !isAdjective(word) && !isFillerWord(word) && !isVerb(word)
    )
}

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

export default function parse(tokens: Array<Token>): SearchIntent {
  const blob = {
    summary: tokens.filter(e => e.type === "word").map((e: any) => e.word).join(" "),
    keywords: [],
    actions: [],
    filters: [],
    sorters: []
  } as SearchIntent;



  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    switch (token.type) {
      case "word": 
        token = token as WordToken;
        if (Number(token.word)) { 
            if (isRealYear(Number(token.word))) {
              blob.filters.push({
                type: "date",
                data: getStartAndEndDateOfYear(Number(token.word))
              })  
              continue;
            }
         }

         const action = actionType(token.word);
          if (action !== ActionType.NONE) {
              let actionBlob = {
                  type: action,
                  argument: "",
              }
              // NOTE: this is a bit sussy
              const idx = tokens.slice(i+1, -1).findIndex((e: any) => e.word === "column") + i + 1;

              if (isKeyword((tokens[idx-1] as WordToken).word)) {
                  actionBlob.argument = (tokens[idx-1] as WordToken).word;
                  blob.actions.push(actionBlob);
                  i+=idx-1;
                  continue;
              }

              let nextTokens = tokens.slice(idx+1, -1);
              let nextIdx =  nextTokens.findIndex((e: any) => isKeyword(e.word) && !isVerb(stem(e.word))) + idx + 1;

              actionBlob.argument = (tokens[nextIdx] as WordToken).word;
              blob.actions.push(actionBlob);

              i+=nextIdx;
              continue;
          }


         if (isKeyword(token.word)) blob.keywords.push(token.word);
        break;
      case "filter": 
        token = token as FilterToken;
        if (token.lhs === "language")  { blob.filters.push({type: "language", data: [token.rhs]}) }
        else if (token.lhs === "format")  { blob.filters.push( {type: "format", data: token.rhs.split(",").map(e => e.trim())}) }

        else if (token.lhs === "include")  { blob.filters.push( {type: "include", data: token.rhs.split(",").map(e => stripQuotes(e.trim()))}) }

        else if (token.lhs === "exclude")  { blob.filters.push( {type: "exclude", data: token.rhs.split(",").map(e => stripQuotes(e.trim()))}) }

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

  console.log(JSON.stringify(blob, null, 2));
  return blob;
}
 
