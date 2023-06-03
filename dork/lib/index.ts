import stem from "./stemmer/porter";
import tokenize from "./tokenizer";
import parse from "./parser"; 
import { SearchIntent } from "@byod/types";

export default function dork(query: string): SearchIntent {
    const tokens = tokenize(query);
    return parse(tokens);
}



// Can you find a dataset containing global population trends over the past century

// I need a dataset on stock market prices for the past year. Can you assist me?

// Locate a dataset on energy consumption and renewable energy sources

// Can you find a dataset on educational attainment across different countries? Remove the 'Gender' column and ensure it's in CSV format


//const q = " Can you find a dataset on educational attainment across different countries? Remove the column called 'Gender' and ensure it's in CSV format"

//const q = "Find a dataset that includes historical data on GDP growth for different countries. Remove the 'Year' column and ensure it's in CSV format"

const q = "Locate a dataset on energy consumption and renewable energy sources. Add a 'Renewable Percentage' column and specify CSV format."

dork(q)



export {
    stem, tokenize
}
