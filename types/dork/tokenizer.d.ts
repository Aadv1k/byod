export enum Filters {
  include = "include",
  exclude = "exclude",
  "-site" = "-site",
  format = "format"
}

export type Token = FilterToken | WordToken;

export enum TokenType {
  word = "word",
  filter = "filter"
}


export interface FilterToken {
  type: TokenType,
  lhs: Filter,
  rhs: string
  word: string,
}


export interface WordToken {
  type: TokenType
  word: string
  category?: string
}

