import { Token, TokenType, FilterToken, WordToken }  from "@byod/types";
import stem from "./stemmer/porter";

function parseFilter(filter: string): FilterToken {
  const [lhs, rhs] = filter.split(":");

  return {
    type: TokenType.filter,
    lhs,
    rhs, 
  } 
}

function parseWord(word: string): WordToken {
  return {
    type: TokenType.word,
    word: word
  }
}

export default function tokenize(query: string): Array<Token> {
  const queryRegex = /^[^,]+:[^\s]+$/
  const tokens = query.split(" ");
  let stack = [];

  for (const token of tokens) {
    if (!token.match(queryRegex)) {
      stack.push(parseWord(token));
      continue;
    }
    stack.push(parseFilter(token));
  }
  return stack;
}
