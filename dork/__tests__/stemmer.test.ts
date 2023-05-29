import {describe, test} from '@jest/globals';

import porterStemmer from "../lib/stemmer/porter";

describe("tests for the porter stemmer implementation", () => {
    const testCases = [
        { input: "running", expected: "run" },
    ];

    testCases.forEach(({ input, expected }) => {
        test(`should stem "${input}" to "${expected}"`, () => {
            expect(porterStemmer(input)).toBe(expected);
        });
    });
})
