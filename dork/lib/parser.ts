import { Token, FilterType }  from "@byod/types";

interface ExcludeFilter {
  type: FilterType.exclude,
  exclude: Array<string>,
}

interface ExcludeSiteFilter {
  type: FilterType.excludeSite
  sites: Array<string>,
}

interface IncludeFilter {
  type: FilterType.include,
  exclude: Array<string>,
}

interface FormatFilter {
  type: FilterType.format,
  fields: Array<string>,
}

type Filter = FormatFilter | IncludeFilter | ExcludeFilter | ExcludeSiteFilter;

interface SearchIntent {
  intent: string,
  filters: Array<Filter>
}

function parse(tokens: Array<Token>): void {
}