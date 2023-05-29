import {describe, test} from '@jest/globals';

import porterStemmer from "../lib/stemmer/porter";

describe("tests for the porter stemmer implementation", () => {
    const testCases = [
        // Examples of verb forms
        { input: "running", expected: "run" },
        { input: "playing", expected: "play" },
        { input: "jumped", expected: "jump" },
        { input: "eating", expected: "eat" },

        // Examples of adjective forms
        { input: "happier", expected: "happy" },
        { input: "bigger", expected: "big" },
        { input: "brightest", expected: "bright" },
        { input: "cooler", expected: "cool" },

        // Examples of noun forms
        { input: "dogs", expected: "dog" },
        { input: "cities", expected: "city" },
        { input: "watches", expected: "watch" },
        { input: "horses", expected: "horse" },

        // Examples of words with "ing" and "ed" suffixes
        { input: "contexualize", expected: "contextual" },
        { input: "created", expected: "create" },
        { input: "dancing", expected: "dance" },

        // Examples of words with multiple suffixes
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
