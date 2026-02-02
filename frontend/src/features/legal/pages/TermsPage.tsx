import { Container, Stack, Typography, Paper } from "@mui/material";

export function TermsPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            Regulamin
          </Typography>
          <Typography color="text.secondary">
            To jest placeholder. Tu wkleisz docelowy regulamin.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            1. Postanowienia ogólne
          </Typography>
          <Typography color="text.secondary">
            Aplikacja ma charakter informacyjny i nie stanowi porady
            inwestycyjnej (placeholder).
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
