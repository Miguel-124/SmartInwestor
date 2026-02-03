import { AppBar, Toolbar, Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "./Logo";

export function AppPublicHeader() {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit" }}
          aria-label="SmartInwestor - strona główna"
        >
          <Logo size={28} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            SmartInwestor
          </Typography>
        </Stack>

        <Button
          component={RouterLink}
          to="/login"
          variant="contained"
          aria-label="Zaloguj"
        >
          Zaloguj
        </Button>
      </Toolbar>
    </AppBar>
  );
}
