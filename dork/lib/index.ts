import stem from "./stemmer/porter";
import tokenize from "./tokenizer";
import parse from "./parser"; 
import { SearchIntent } from "@byod/types";

export default function dork(query: string): SearchIntent {
    const tokens = tokenize(query);
    return parse(tokens);
}

export {
    stem, tokenize
}
