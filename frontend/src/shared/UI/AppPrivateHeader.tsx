import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { NavLink, useNavigate, Link as RouterLink } from "react-router-dom";
import { clearAuthToken } from "../auth/tokenStorage";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useThemeMode } from "../../app/theme/ThemeModeProvider";
import { Logo } from "./Logo";

const linkStyle = ({ isActive }: { isActive: boolean }) => ({
  textDecoration: "none",
  color: "inherit",
  fontWeight: isActive ? 700 : 500,
});

export function AppPrivateHeader() {
  const navigate = useNavigate();
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          component={RouterLink}
          to="/dashboard"
          sx={{ textDecoration: "none", color: "inherit" }}
          aria-label="SmartInwestor - dashboard"
        >
          <Logo size={28} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            SmartInwestor
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <NavLink to="/dashboard" style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/portfolios" style={linkStyle}>
            Portfele
          </NavLink>
          <NavLink to="/analysis" style={linkStyle}>
            Analiza
          </NavLink>
          <NavLink to="/profile/settings" style={linkStyle}>
            Profil
          </NavLink>

          <Button
            color="inherit"
            onClick={() => {
              clearAuthToken();
              navigate("/login");
            }}
            aria-label="Wyloguj"
          >
            Wyloguj
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
