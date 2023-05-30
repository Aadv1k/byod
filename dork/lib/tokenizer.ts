import { Token, TokenType, FilterToken, WordToken, FilterType}  from "@byod/types";

function parseFilter(filter: string): FilterToken {
  const [lhs, rhs] = filter.split(":");
  let filters = Object.keys(FilterType);

  if (!filters.includes(lhs)) {
    throw new Error(`invalid filter: ${lhs}`)
  }
  
  return {
    type: TokenType.filter,
    lhs: FilterType[lhs as keyof typeof FilterType],
    rhs: rhs, 
    word: filter
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