"use client"

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import MuiTheme from "@/components/MuiTheme";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Paper, Stack, Typography, Chip, Button, CircularProgress} from "@mui/material";

import Search from "@/components/Search";


export default function SearchPage({ params, searchParams }) {
    const [results, setResults] = useState(null);
    const router = useRouter();

    // just roll with it
    var query = searchParams?.q || searchParams?.query;
    if (!query) {
        router.push("/")
        return;
    }


  useEffect(() => {


    fetch(`/api/v1/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, [searchParams]);

  return (
        <ThemeProvider theme={MuiTheme}>
      <CssBaseline />

    <Stack direction="column" spacing={1} sx={{
        maxWidth: "900px",
        minHeight: "100vh",
        padding: "1.2rem",
    }}>

    <Search defaultValue={query} />


      {!results && <CircularProgress
                       sx={{
          margin: "0 auto"
      }} />}
      {results &&
        results.map((result, index) => (
          <Paper
              key={index}
              elevation={3}
              sx={{
                  paddingBlock: "1.2rem",
                  paddingInline: "1rem",
              }}
          >
            <Stack direciton="column" spacing={2} alignItems="flex-start">
            <Stack
            sx={{
                flexDirection: "column",
                alignItems: "flex-start",
                gap: ".5rem",
                "@media only screen and (min-width: 600px)": {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: ".8rem",
                }
            }}
            >

                <Typography variant="h6" fontWeight={600} color="grey.800">
                    {result.title}
                </Typography>

                <Chip
                    label={(new URL(result.origin)).host}
                    component="a"
                    href={(new URL(result.origin)).href}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{
                        borderRadius: ".3rem"
                    }}
                    clickable
                />
            </Stack>

            <Stack  sx={{alignSelf: "flex-end"}} direction="row" spacing={2}>
                <Button variant="outlined">
                    Download 
                </Button>

                <Button variant="contained" color="primary">Modify</Button>
            </Stack>


            </Stack>

          </Paper>
        ))}
    </Stack>
        </ThemeProvider>
  );
}
