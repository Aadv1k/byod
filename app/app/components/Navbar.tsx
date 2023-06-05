import { Typography, Box, Navbar as MuiNavbar } from "@mui/material";

export default function Navbar () {
    return (
        <Box
            display="flex" justifyContent="center" alignItems="center"
            px={2}
            py={2}
        >
            <Typography variant="h4" component="h1" fontWeight={800} color="grey.800">
                byod
            </Typography>
        </Box>
    )
} 
