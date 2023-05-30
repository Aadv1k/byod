import fs from "node:fs";
import path from "node:path";

import stem from "./stemmer/porter";

export function isFillerWord(word: string)  {
 const wordlist = new Set(
    fs.readFileSync(
        path.join(__dirname, "../data/fillers.txt"), "utf-8")
        .split("\r\n")
        );
 return wordlist.has(word)
}

export function isCommonNoun(word: string): boolean {
 const wordlist = new Set(
    fs.readFileSync(
        path.join(__dirname, "../data/nouns.txt"), "utf-8")
        .split("\r\n")
        );
 return wordlist.has(word)
}