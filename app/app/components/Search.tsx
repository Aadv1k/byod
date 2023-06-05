import Logo from "./Logo" ;
import { Box, TextField, Stack } from "@mui/material";
import { LoadingButton as Button } from "@mui/lab";

import useMediaQuery from '@mui/material/useMediaQuery';

import { useState } from "react";

export default function Search() {
    const isDesktop = useMediaQuery("(min-width: 650px)")
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const formProps = Object.fromEntries(new FormData(e.currentTarget));
        fetch("/api/v1/search?q=${encodeUriComponent(formProps.prompt)}")
    }

    return (
        <Box w="100%" display="flex" flexDirection="column" sx={{
            maxWidth: 550,
            width: "95%",
            marginInline: "auto",
            marginTop: "3rem",
        }}>
            <Logo variant={isDesktop ? "h4" : "h4"} />

            <Box as="form" display="flex" my={2} flexDirection="column" gap={2} onSubmit={handleSubmit}>
                <TextField name="prompt" required label="Provide a prompt" variant="outlined" w="full" size="small" />

                <Stack alignItems="center" spacing={2} direction="row" justifyContent="center">
                <Button variant="contained" loading={loading}  type="submit" disableElevation>search</Button>

                <Button disabled={loading} variant="outlined" href="https://github.com/aadv1k/byod" color="secondary" target="_blank" disableElevation>Support</Button>
                    
                </Stack>
            </Box>
        </Box>
    )
}
