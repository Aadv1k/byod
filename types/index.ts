export type Token = FilterToken | WordToken;

export interface GenericFilter {
  type: string,
  data: Array<string | Date>
}

export type Layer1Loader = (i: SearchIntent) => Promise<Array<SearchMatch>>;

export interface GenericSorter {
    type: string,
    condition?: string,
    by?: string
}

export interface SearchIntent {
  summary: string,
  keywords: Array<string>,
  filters: Array<GenericFilter>,
  sorters: Array<GenericSorter>
}


export interface SearchMatch {
  title: string,
  keywords: Array<string>,
  download: string,
  date?: string,
  origin: string
}

export interface BaseCrawler {
    query: SearchIntent;
    crawl(): Promise<Array<SearchMatch>>
}


export enum TokenType {
    word = "word",
    filter = "filter"
}

export interface FilterToken {
    type: TokenType;
    lhs: string;
    rhs: string;
}
export interface WordToken {
    type: TokenType;
    word: string;
}
