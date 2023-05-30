import tokenize from "../lib/tokenizer";

describe("Tokenize", () => {
  it("should tokenize a query string with valid filters and words", () => {
    const query = "include:keyword1 exclude:keyword2 keyword3";
    const expectedTokens = [
      {
        type: "filter",
        lhs: "include",
        rhs: "keyword1",
        word: "include:keyword1"
      },
      {
        type: "filter",
        lhs: "exclude",
        rhs: "keyword2",
        word: "exclude:keyword2"
      },
      {
        type: "word",
        word: "keyword3"
      }
    ];

    const tokens = tokenize(query);

    expect(tokens).toEqual(expectedTokens);
  });

  it("should tokenize a query string with valid filters and words containing special characters", () => {
    const query = 'format:pdf -site:"example.com" word_with_special-characters';
    const expectedTokens = [
      {
        type: "filter",
        lhs: "format",
        rhs: "pdf",
        word: "format:pdf"
      },
      {
        type: "filter",
        lhs: "-site",
        rhs: '"example.com"',
        word: '-site:"example.com"'
      },
      {
        type: "word",
        word: "word_with_special-characters"
      }
    ];

    const tokens = tokenize(query);

    expect(tokens).toEqual(expectedTokens);
  });

  it("should tokenize a query string with only words and no filters", () => {
    const query = "keyword1 keyword2 keyword3";
    const expectedTokens = [
      {
        type: "word",
        word: "keyword1"
      },
      {
        type: "word",
        word: "keyword2"
      },
      {
        type: "word",
        word: "keyword3"
      }
    ];

    const tokens = tokenize(query);

    expect(tokens).toEqual(expectedTokens);
  });
});
