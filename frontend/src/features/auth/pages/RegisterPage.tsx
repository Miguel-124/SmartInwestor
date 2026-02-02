import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../api/hooks";
import { AuthShell } from "../components/AuthShell";

const passwordSchema = z
  .string()
  .min(9, "Hasło musi mieć co najmniej 9 znaków")
  .refine((v) => /\d/.test(v), "Hasło musi zawierać co najmniej jedną cyfrę")
  .refine(
    (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v),
    "Hasło musi zawierać co najmniej jeden znak specjalny",
  );

const schema = z
  .object({
    firstName: z.string().trim().min(3, "Imię musi mieć co najmniej 3 znaki"),
    lastName: z
      .string()
      .trim()
      .min(3, "Nazwisko musi mieć co najmniej 3 znaki"),
    email: z
      .string()
      .trim()
      .min(1, "Email jest wymagany")
      .email("Nieprawidłowy format email"),
    password: passwordSchema,
    confirm: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Hasła muszą być takie same",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await registerMutation.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });

    navigate("/onboarding");
  });

  return (
    <AuthShell
      title="Rejestracja"
      subtitle="Utwórz konto, a potem uzupełnij onboarding"
    >
      <Stack spacing={2} aria-label="Register page">
        {registerMutation.isError && (
          <Alert severity="error" aria-label="register-error">
            {(registerMutation.error as Error).message ||
              "Nie udało się zarejestrować."}
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

            <TextField
              label="Hasło"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              inputProps={{ "aria-label": "Hasło" }}
              {...register("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Potwierdź hasło"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              error={!!errors.confirm}
              helperText={errors.confirm?.message}
              inputProps={{ "aria-label": "Potwierdź hasło" }}
              {...register("confirm")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showConfirm ? "Ukryj hasło" : "Pokaż hasło"}
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                    >
                      {showConfirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={registerMutation.isPending}
              aria-label="Zarejestruj"
              size="large"
              sx={{ py: 1.2, fontWeight: 800 }}
            >
              {registerMutation.isPending ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} />
                  <span>Rejestracja...</span>
                </Stack>
              ) : (
                "Utwórz konto"
              )}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate("/login")}
              aria-label="Przejdź do logowania"
              sx={{ fontWeight: 800 }}
            >
              Masz już konto? Zaloguj się
            </Button>

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Hasło: min. 9 znaków, 1 cyfra i 1 znak specjalny.
            </Typography>
          </Stack>
        </form>
      </Stack>
    </AuthShell>
  );
}
