import { Container, Paper, Stack, Typography } from "@mui/material";

export function PublicHomePage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h3" sx={{ fontWeight: 900 }}>
            SmartInwestor
          </Typography>
          <Typography color="text.secondary">
            To będzie strona marketingowa aplikacji. Tutaj opiszemy wartości,
            korzyści i zaprezentujemy produkt.
          </Typography>
        </Stack>
      </Paper>
    </Container>
  );
}
