"use client";

import MuiTheme from "@/components/MuiTheme";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


import { Link as MuiLink } from "@mui/material";

import Link from 'next/link'

import { redirect } from 'next/router';

export default function Logo(props: any) {
    const handleLinkClick = (evt) => {
        evt.preventDefault();
        redirect("/")
    }

    return (
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline />
                <MuiLink
                    href="/"
                    component={Link}
                    fontWeight={800}
                    fontSize={props?.fontSize ?? "2rem"}
                    underline="none"
                    color="grey.800"
                > byod </MuiLink>
        </ThemeProvider>
    )
}
