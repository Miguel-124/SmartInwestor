import { Box, Typography } from "@mui/material";

export function AppFooter() {
  return (
    <Box component="footer" sx={{ py: 2, textAlign: "center", opacity: 0.8 }}>
      <Typography variant="body2">
        © {new Date().getFullYear()} SmartInwestor
      </Typography>
    </Box>
  );
}
