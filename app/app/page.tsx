"use client";

import Button from "@mui/material/button";
import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Search from "./components/Search";
import Navbar from "./components/Navbar";

import theme from "./components/MuiTheme";

import useMediaQuery from '@mui/material/useMediaQuery';

export default function Home() {
  return (
        <ThemeProvider theme={theme}>
            <main>
                <Search  />
            </main>
        </ThemeProvider>
  )
}
