import { Container, Stack, Typography, Paper } from "@mui/material";

export function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Polityka prywatności
          </Typography>
          <Typography color="text.secondary">
            To jest placeholder. Tu wkleisz docelową treść polityki prywatności.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            1. Administrator danych
          </Typography>
          <Typography color="text.secondary">
            SmartInwestor (tu uzupełnisz dane firmy).
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            2. Zakres danych
          </Typography>
          <Typography color="text.secondary">
            Email, dane profilu, informacje o portfelach itd. (placeholder).
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
