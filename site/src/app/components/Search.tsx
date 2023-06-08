import MuiTheme from "@/components/MuiTheme";
import Logo from "@/components/Logo";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { TextField, Stack, Button } from "@mui/material";

export default function Search() {
    return (
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline />
            <Stack direction="row" spacing={1}  sx={{
                width: "100%",
                alignItems: "center",
            }}>
                <Logo />
                <TextField label="Search"
size="small"
                           sx={{
                    flex: "100%"
                }} />
                <Button variant="contained">Search</Button>
            </Stack>
        </ThemeProvider>
    )
}
