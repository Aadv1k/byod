import { createTheme, theme } from "@mui/material/styles"

const defaultTheme = createTheme();

export default createTheme({
    typography: {
        fontFamily: "Inter " + defaultTheme.typography.fontFamily
    }
})
