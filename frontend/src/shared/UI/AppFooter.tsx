import { Box, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function AppFooter() {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: "center", opacity: 0.9 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ mb: 0.5 }}
      >
        <Link component={RouterLink} to="/terms" underline="hover">
          Regulamin
        </Link>
        <Link component={RouterLink} to="/privacy-policy" underline="hover">
          Polityka prywatności
        </Link>
      </Stack>
      <Typography variant="body2">
        © {new Date().getFullYear()} SmartInwestor
      </Typography>
    </Box>
  );
}
