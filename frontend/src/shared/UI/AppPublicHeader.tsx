import {
  AppBar,
  Toolbar,
  Button,
  Stack,
  Typography,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useThemeMode } from "../../app/theme/ThemeModeProvider";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Logo } from "./Logo";

export function AppPublicHeader() {
  const { mode, toggleMode } = useThemeMode();

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
          <Logo size={28} radius={0.5} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            SmartInwestor
          </Typography>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            component={RouterLink}
            to="/login"
            variant="contained"
            aria-label="Zaloguj"
          >
            Zaloguj
          </Button>
          <Tooltip title={mode === "light" ? "Tryb ciemny" : "Tryb jasny"}>
            <IconButton
              onClick={toggleMode}
              color="inherit"
              aria-label="Przełącz motyw"
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
