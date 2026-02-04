import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Checkbox,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { useProfileQuery, useUpdateProfileMutation } from "../api/hooks";
import { mapProfile } from "../api/mappers";
import type { UpdateProfileRequestDto, RiskProfile } from "../types";
import type { MeModel } from "../../auth/types";
import { ProfileShell } from "../components/ProfileShell";

const riskValues = ["conservative", "balanced", "aggressive"] as const;

const riskOptions: Array<{
  value: RiskProfile;
  label: string;
  description: string;
}> = [
  {
    value: "conservative",
    label: "Ostrożny",
    description: "Niska zmienność, priorytetem jest bezpieczeństwo kapitału.",
  },
  {
    value: "balanced",
    label: "Zrównoważony",
    description: "Umiarkowane ryzyko i stabilny wzrost w dłuższym terminie.",
  },
  {
    value: "aggressive",
    label: "Agresywny",
    description: "Wyższe ryzyko w zamian za potencjalnie większy zysk.",
  },
];

function isAdult(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return false;

  const now = new Date();
  const adultDate = new Date(
    Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()),
  );

  return d <= adultDate;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium" }).format(date);
}

const schema = z.object({
  firstName: z.string().trim().min(2, "Imię musi mieć co najmniej 2 znaki"),
  lastName: z.string().trim().min(2, "Nazwisko musi mieć co najmniej 2 znaki"),
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy format email"),
  birthDate: z
    .string()
    .min(1, "Data urodzenia jest wymagana")
    .refine(isAdult, "Musisz mieć ukończone 18 lat"),
  riskProfile: z.enum(riskValues, {
    message: "Wybierz profil ryzyka",
  }),
  acceptRisk: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function ProfileSettingsPage() {
  const profileQuery = useProfileQuery();
  const updateMutation = useUpdateProfileMutation();
  const queryClient = useQueryClient();
  const [saved, setSaved] = React.useState(false);
  const [initialRisk, setInitialRisk] = React.useState<RiskProfile | null>(
    null,
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      riskProfile: "balanced",
      acceptRisk: false,
    },
  });

  const riskProfileValue = useWatch({
    control,
    name: "riskProfile",
  });

  React.useEffect(() => {
    if (!profileQuery.data) return;

    if (!initialRisk) {
      setInitialRisk(profileQuery.data.riskProfile ?? "balanced");
    }

    reset({
      firstName: profileQuery.data.firstName,
      lastName: profileQuery.data.lastName,
      email: profileQuery.data.email,
      birthDate: profileQuery.data.birthDate ?? "",
      riskProfile: profileQuery.data.riskProfile ?? "balanced",
      acceptRisk: profileQuery.data.acceptRisk ?? false,
    });
  }, [profileQuery.data, reset, initialRisk]);

  React.useEffect(() => {
    if (!initialRisk || !riskProfileValue) return;
    if (riskProfileValue !== initialRisk) {
      setValue("acceptRisk", false, { shouldValidate: true });
    }
  }, [riskProfileValue, setValue, initialRisk]);

  const isRiskChanged =
    !!initialRisk && !!riskProfileValue && riskProfileValue !== initialRisk;

  const onSubmit = handleSubmit(async (values) => {
    setSaved(false);

    if (isRiskChanged && !values.acceptRisk) {
      setError("acceptRisk", {
        type: "manual",
        message: "Musisz zaakceptować ryzyko przy zmianie profilu",
      });
      return;
    }

    const payload: UpdateProfileRequestDto = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      birthDate: values.birthDate,
      riskProfile: values.riskProfile,
      acceptRisk: values.acceptRisk,
    };

    const updatedDto = await updateMutation.mutateAsync(payload);
    const updated = mapProfile(updatedDto);

    queryClient.setQueryData(["profile"], updated);
    queryClient.setQueryData<MeModel | undefined>(["me"], (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        firstName: updated.firstName,
        lastName: updated.lastName,
        email: updated.email,
      };
    });

    setInitialRisk(values.riskProfile);

    reset({
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      birthDate: updated.birthDate ?? "",
      riskProfile: updated.riskProfile ?? "balanced",
      acceptRisk: updated.acceptRisk ?? false,
    });

    setSaved(true);
  });

  if (profileQuery.isLoading) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ py: 6 }}
        aria-label="Profile loading"
      >
        <CircularProgress />
        <Typography color="text.secondary">Ładowanie profilu...</Typography>
      </Stack>
    );
  }

  if (profileQuery.isError) {
    return (
      <Alert severity="error" aria-label="Profile error">
        {(profileQuery.error as Error).message ||
          "Nie udało się pobrać profilu."}
      </Alert>
    );
  }

  const profile = profileQuery.data!;

  return (
    <ProfileShell title="Ustawienia profilu">
      <Stack spacing={3} aria-label="Profile settings page">
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Podstawowe informacje
              </Typography>
              <Tooltip title="Tutaj znajdziesz identyfikator konta i datę utworzenia.">
                <IconButton
                  size="small"
                  aria-label="Pomoc: Podstawowe informacje"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Typography color="text.secondary">
              ID użytkownika: <strong>{profile.id}</strong>
            </Typography>
            <Typography color="text.secondary">
              Data utworzenia: <strong>{formatDate(profile.createdAt)}</strong>
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Dane kontaktowe
            </Typography>

            {updateMutation.isError && (
              <Alert severity="error" aria-label="Profile update error">
                {(updateMutation.error as Error).message ||
                  "Nie udało się zapisać profilu."}
              </Alert>
            )}

            {saved && (
              <Alert severity="success" aria-label="Profile update success">
                Zapisano zmiany profilu.
              </Alert>
            )}

            <form onSubmit={onSubmit} noValidate>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Imię"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                    inputProps={{ "aria-label": "Imię" }}
                    fullWidth
                    {...register("firstName")}
                  />
                  <TextField
                    label="Nazwisko"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                    inputProps={{ "aria-label": "Nazwisko" }}
                    fullWidth
                    {...register("lastName")}
                  />
                </Stack>

                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  inputProps={{ "aria-label": "Email" }}
                  {...register("email")}
                />

                <Divider />

                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Parametry inwestycyjne
                </Typography>

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
                  <FormLabel sx={{ pb: 1 }}>Profil ryzyka</FormLabel>
                  <Controller
                    name="riskProfile"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        aria-label="Profil ryzyka"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {riskOptions.map((opt) => (
                          <FormControlLabel
                            key={opt.value}
                            value={opt.value}
                            control={<Radio />}
                            sx={{ pb: 1 }}
                            label={
                              <Stack>
                                <Typography
                                  variant="body1"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {opt.label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.7 }}
                                >
                                  {opt.description}
                                </Typography>
                              </Stack>
                            }
                          />
                        ))}
                      </RadioGroup>
                    )}
                  />
                  {!!errors.riskProfile && (
                    <FormHelperText>
                      {errors.riskProfile.message}
                    </FormHelperText>
                  )}
                </FormControl>

                {isRiskChanged && (
                  <FormControl error={!!errors.acceptRisk}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label="Akceptuję ryzyko inwestycyjne i rozumiem, że aplikacja nie ponosi odpowiedzialności za moje decyzje."
                      {...register("acceptRisk")}
                    />
                    {!!errors.acceptRisk && (
                      <FormHelperText>
                        {errors.acceptRisk.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  disabled={updateMutation.isPending}
                  aria-label="Zapisz zmiany"
                  size="large"
                  sx={{ py: 1.2, fontWeight: 800 }}
                >
                  {updateMutation.isPending ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={18} />
                      <span>Zapisywanie...</span>
                    </Stack>
                  ) : (
                    "Zapisz zmiany"
                  )}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Stack>
    </ProfileShell>
  );
}
