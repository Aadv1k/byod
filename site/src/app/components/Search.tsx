import MuiTheme from "@/components/MuiTheme";
import Logo from "@/components/Logo";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { TextField, Stack, Button } from "@mui/material";

export default function Search(props) {
    return (
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline />
            <Stack as="form" direction="row" action="/search" spacing={2}  sx={{
                width: "100%",
                alignItems: "center",
            }}>
                <Logo />
                <TextField label="Search"
                           size="small"
                           name="q"
                           defaultValue={props?.defaultValue ?? ""}
                           sx={{
                               flex: "100%"
                           }} />
                <Button variant="contained" type="submit">Search</Button>
            </Stack>
        </ThemeProvider>
    )
}



