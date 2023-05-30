export enum FilterType {
    include = "include",
    exclude = "exclude",
    excludeSite = "-site",
    format = "format"
}

export type Token = FilterToken | WordToken;
export enum TokenType {
    word = "word",
    filter = "filter"
}
export interface FilterToken {
    type: TokenType;
    lhs: FilterType;
    rhs: string;
    word: string;
}
export interface WordToken {
    type: TokenType;
    word: string;
    category?: string;
}
