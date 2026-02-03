import {
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../../shared/auth/tokenStorage";

const navItems = [
  { to: "/profile/settings", label: "Ustawienia profilu" },
  { to: "/profile/about", label: "O nas" },
  { to: "/profile/privacy", label: "Polityka prywatności" },
  { to: "/profile/terms", label: "Regulamin" },
  { to: "/profile/help", label: "Pomoc" },
];

export function ProfileNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }} aria-label="Nawigacja profilu">
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
        Profil
      </Typography>
      <List dense>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
            aria-label={item.label}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 1.5 }} />

      <List dense>
        <ListItemButton
          onClick={() => {
            clearAuthToken();
            navigate("/login");
          }}
          aria-label="Wyloguj"
          sx={{ color: "error.main" }}
        >
          <ListItemText primary="Wyloguj" />
        </ListItemButton>
      </List>
    </Paper>
  );
}
