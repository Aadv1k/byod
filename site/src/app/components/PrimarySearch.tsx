import MuiTheme from "@/components/MuiTheme";
import Logo from "@/components/Logo";

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Link as MuiLink, Stack, Button, TextField} from "@mui/material";

export default function PrimarySearch(props: any) {
    return (
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline />

            <Stack direction="column" spacing={3} as="form" action="/search" alignItems="center"
            sx={{
                position: "absolute",
                top: "30%",
                maxWidth: "600px",
                width: "90%",
                left: "50%",
                transform: "translate(-50%, -50%)"
            }}>

                <Logo text="" fontSize="3.5rem" />
                <TextField label="Search"
                           name="q"
                           size="small"
                           sx={{
                               flex: "100%",
                               width: "100%"
                           }} />

                <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit">Search</Button>
                    <Button component="a" href="https://github.com/aadv1k/byod" target="_blank" variant="outlined" type="link">Support</Button>
                </Stack>
            </Stack>

        </ThemeProvider>
    )
}
