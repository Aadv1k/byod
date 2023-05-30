import {describe, test} from '@jest/globals';

import porterStemmer from "../lib/stemmer/porter";

describe("tests for the porter stemmer implementation", () => {
    const testCases = [
        { input: "running", expected: "run" },
        { input: "playing", expected: "plai" },
        { input: "jumped", expected: "jump" },
        { input: "eating", expected: "eat" },
        { input: "tempting", expected: "tempt" },
        { input: "temptation", expected: "tempt" },

        { input: "brightest", expected: "bright" },

        { input: "dogs", expected: "dog" },
        { input: "cities", expected: "citi" },
        { input: "watches", expected: "watch" },
        { input: "horses", expected: "hors" },

        { input: "contextualize", expected: "contextual" },

        { input: "happened", expected: "happen" },
        { input: "laughing", expected: "laugh" },
        { input: "studying", expected: "study" },

        { input: "apple", expected: "apple" },
        { input: "blue", expected: "blue" }
    ];

    testCases.forEach(({ input, expected }) => {
        test(`should stem "${input}" to "${expected}"`, () => {
            expect(porterStemmer(input)).toBe(expected);
        });
    });
})
