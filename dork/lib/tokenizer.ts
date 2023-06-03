import { Token, TokenType, FilterToken, WordToken }  from "@byod/types";
import stem from "./stemmer/porter";

function parseFilter(filter: string): FilterToken {
  const [lhs, rhs] = filter.split(":");

  return {
    type: TokenType.filter,
    lhs: lhs.toLowerCase(),
    rhs: rhs.toLowerCase(), 
  } 
}

function parseWord(word: string): WordToken {
  return {
    type: TokenType.word,
    word: word.replace(/[^A-Za-z]/g, "")
  }
}

export default function tokenize(query: string): Array<Token> {
  const queryRegex = /^[^,]+:[^\s]+$/
  const tokens = query.split(" ");
  let stack = [];

  for (const token of tokens) {
    if (!token.match(queryRegex)) {
      stack.push(parseWord(token.toLowerCase()));
      continue;
    }
    stack.push(parseFilter(token));
  }

  return stack;
}
