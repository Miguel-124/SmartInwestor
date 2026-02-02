import { Button, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import { AuthShell } from "../../features/auth/components/AuthShell";

export function PublicNotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <AuthShell
      title="Nie znaleziono strony"
      subtitle={`Ścieżka: ${location.pathname}`}
    >
      <Stack spacing={2}>
        <Typography variant="h2" sx={{ fontWeight: 950, letterSpacing: -1 }}>
          404
        </Typography>

        <Typography color="text.secondary">
          Wygląda na to, że ta strona nie istnieje albo została przeniesiona.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ pt: 1 }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<HomeIcon />}
            component={RouterLink}
            to="/login"
            fullWidth
          >
            Przejdź do logowania
          </Button>

          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            fullWidth
          >
            Wróć
          </Button>
        </Stack>
      </Stack>
    </AuthShell>
  );
}
