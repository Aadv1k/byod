import { Typography } from "@mui/material";

export default function Logo ({variant}: {variant: string}) {
  return (
            <Typography textAlign="center" variant={variant} component="h1" fontWeight={800} color="grey.800">
                BuildYourOwnData
            </Typography>
  )
}
