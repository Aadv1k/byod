"use client"

import { ThemeProvider } from '@mui/material/styles';

import MuiTheme from "@/components/MuiTheme";

import { redirect } from 'next/router';
import { useState, useEffect } from 'react';

import { Paper, Stack, Typography, Chip } from "@mui/material";

export default function MyServerComponent({ params, searchParams }) {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const query = searchParams?.q || searchParams?.query;

    if (!query) {
      redirect("/")
      return;
    }

    fetch(`/api/v1/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data);
      });
  }, [searchParams]);

  return (
        <ThemeProvider theme={MuiTheme}>
    <Stack as="ul" direction="column" spacing={1} sx={{
        maxWidth: "800px",
        padding: "1.2rem",
    }}>
      {results &&
        results.map((result, index) => (
          <Paper
              as="li"
              key={index}
              elevation={2}
              sx={{
                  paddingBlock: "1.2rem",
                  paddingInline: "1rem",
              }}
          >


            <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            wrap="wrap"
            >

                <Typography variant="h6">
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
          </Paper>
        ))}
    </Stack>
        </ThemeProvider>
  );
}
