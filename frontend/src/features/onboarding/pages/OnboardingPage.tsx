import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Checkbox,
  Container,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useSubmitOnboardingMutation } from "../api/hooks";
import type { OnboardingSubmitRequestDto } from "../types";

function isAdult(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();
  const adultDate = new Date(
    Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()),
  );

  return d <= adultDate;
}

const riskValues = ["conservative", "balanced", "aggressive"] as const;

const schema = z.object({
  birthDate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(isAdult, "Musisz mieć ukończone 18 lat"),
  riskProfile: z.enum(riskValues, {
    message: "Wybierz profil ryzyka",
  }),
  acceptRisk: z.boolean().refine((v) => v, "Musisz zaakceptować ryzyko"),
});

type FormValues = z.infer<typeof schema>;

export function OnboardingPage() {
  const navigate = useNavigate();
  const submitMutation = useSubmitOnboardingMutation();

  React.useEffect(() => {
    const allowed = sessionStorage.getItem("onboardingAllowed");
    if (!allowed) {
      navigate("/register", { replace: true });
    }
  }, [navigate]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      birthDate: "",
      acceptRisk: false,
    },
  });

  const onSubmit = handleSubmit(async (values: FormValues) => {
    await submitMutation.mutateAsync(values as OnboardingSubmitRequestDto);
    sessionStorage.removeItem("onboardingAllowed");
    navigate("/dashboard");
  });

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Stack spacing={2} aria-label="Onboarding page">
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Onboarding
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.75, pb: 2 }}>
            Uzupełnij dane, aby dopasować profil inwestycyjny.
          </Typography>

          {submitMutation.isError && (
            <Alert severity="error" aria-label="onboarding-error">
              {(submitMutation.error as Error).message ||
                "Nie udało się zapisać onboarding."}
            </Alert>
          )}

          <form onSubmit={onSubmit} noValidate>
            <Stack spacing={2}>
              <TextField
                label="Data urodzenia"
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
                inputProps={{ "aria-label": "Data urodzenia" }}
                {...register("birthDate")}
              />

              <FormControl error={!!errors.riskProfile}>
                <FormLabel sx={{ pb: 2 }}>Profil ryzyka</FormLabel>
                <Controller
                  name="riskProfile"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-label="Profil ryzyka"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      <FormControlLabel
                        value="conservative"
                        control={<Radio />}
                        sx={{ pb: 2 }}
                        label={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              Ostrożny
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              Niska zmienność, priorytetem jest bezpieczeństwo
                              kapitału.
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="balanced"
                        control={<Radio />}
                        sx={{ pb: 2 }}
                        label={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              Zrównoważony
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              Umiarkowane ryzyko i stabilny wzrost w dłuższym
                              terminie.
                            </Typography>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="aggressive"
                        control={<Radio />}
                        sx={{ pb: 2 }}
                        label={
                          <Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600 }}
                            >
                              Agresywny
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>
                              Wyższe ryzyko w zamian za potencjalnie większy
                              zysk.
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  )}
                />
                {!!errors.riskProfile && (
                  <FormHelperText>{errors.riskProfile.message}</FormHelperText>
                )}
              </FormControl>

              <FormControl error={!!errors.acceptRisk}>
                <FormControlLabel
                  control={<Checkbox />}
                  sx={{ pb: 2 }}
                  label="Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje."
                  {...register("acceptRisk")}
                />
                {!!errors.acceptRisk && (
                  <FormHelperText>{errors.acceptRisk.message}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                disabled={submitMutation.isPending}
                aria-label="Zapisz onboarding"
                size="large"
                sx={{ py: 1.2, fontWeight: 800 }}
              >
                {submitMutation.isPending ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} />
                    <span>Zapisywanie...</span>
                  </Stack>
                ) : (
                  "Zapisz i kontynuuj"
                )}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
