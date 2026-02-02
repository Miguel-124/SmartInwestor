import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useLoginMutation } from "../api/hooks";
import { setAuthToken } from "../../../shared/auth/tokenStorage";
import { AuthShell } from "../components/AuthShell";

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany")
    .email("Nieprawidłowy format email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const data = await loginMutation.mutateAsync(values);
    setAuthToken(data.token);
    navigate("/dashboard");
  });

  return (
    <AuthShell
      title="Logowanie"
      subtitle="Zaloguj się, aby przejść do dashboardu"
    >
      <Stack spacing={2} aria-label="Login page">
        {loginMutation.isError && (
          <Alert severity="error" aria-label="login-error">
            {(loginMutation.error as Error).message ||
              "Nie udało się zalogować."}
          </Alert>
        )}

        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={2}>
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
              autoComplete="current-password"
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

            <Button
              type="submit"
              variant="contained"
              disabled={loginMutation.isPending}
              aria-label="Zaloguj"
              size="large"
              sx={{ py: 1.2, fontWeight: 800 }}
            >
              {loginMutation.isPending ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} />
                  <span>Logowanie...</span>
                </Stack>
              ) : (
                "Zaloguj się"
              )}
            </Button>

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              <Button
                fullWidth
                variant="text"
                onClick={() => navigate("/register")}
                aria-label="Przejdź do rejestracji"
                sx={{ fontWeight: 800 }}
              >
                Zarejestruj się
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    </AuthShell>
  );
}
