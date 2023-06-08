import MuiTheme from "@/components/MuiTheme";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { Typography, Link} from "@mui/material";

export default function Logo() {
    return (
        <ThemeProvider theme={MuiTheme}>
            <CssBaseline />
            <Typography  variant="h4" fontWeight={900}>byod</Typography>
        </ThemeProvider>
    )
}
