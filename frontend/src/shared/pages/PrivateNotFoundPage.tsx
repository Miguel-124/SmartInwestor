import { Button, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DashboardIcon from "@mui/icons-material/Dashboard";

export function PrivateNotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2} alignItems="flex-start">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <SearchOffIcon fontSize="large" />
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Nie znaleziono strony
          </Typography>
        </Stack>

        <Typography color="text.secondary">
          Nie ma takiej ścieżki: <strong>{location.pathname}</strong>
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ pt: 1, width: "100%" }}
        >
          <Button
            variant="contained"
            startIcon={<DashboardIcon />}
            component={RouterLink}
            to="/dashboard"
            fullWidth
          >
            Wróć do dashboardu
          </Button>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            fullWidth
          >
            Cofnij
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
