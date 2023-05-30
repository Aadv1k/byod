import { Token, TokenType, FilterToken, WordToken, Filters}  from "@byod/types";

function parseFilter(filter: string): FilterToken {
  const [lhs, rhs] = filter.split(":");
  const filters = Object.keys(Filters);

  if (!filters.includes(lhs)) {
    throw new Error(`invalid filter: ${lhs}`)
  }
  
  return {
    type: TokenType.filter,
    lhs: Filters[lhs as keyof typeof Filters],
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
