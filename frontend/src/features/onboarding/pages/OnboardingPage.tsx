import { Stack, Typography } from "@mui/material";

export function OnboardingPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Onboarding</Typography>
      <Typography>
        Tu będzie ankieta: data urodzenia, profil ryzyka, akceptacja.
      </Typography>
    </Stack>
  );
}
