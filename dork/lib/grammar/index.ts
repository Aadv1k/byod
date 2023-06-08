import fillers from "./fillers";
import verbs from "./verbs";
import adjectives from "./adjectives";
import nouns from "./nouns";

export function isFillerWord(word: string)  {
    return fillers.has(word);
}

export function isVerb(word: string): boolean {
    return verbs.has(word);
}

export function isAdjective(word: string): boolean {
    return adjectives.has(word);
}

export function isCommonNoun(word: string): boolean {
    return nouns.has(word);
}
