import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Paper,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Logo } from "../../../shared/UI/Logo";
import { useThemeMode } from "../../../app/theme/ThemeModeProvider";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();

  const primaryGlow = alpha(
    theme.palette.primary.main,
    mode === "dark" ? 0.22 : 0.18,
  );
  const secondaryGlow = alpha(
    theme.palette.secondary.main,
    mode === "dark" ? 0.22 : 0.18,
  );

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "background.default",
        backgroundImage: `
          radial-gradient(1100px 650px at 8% 10%, ${primaryGlow}, transparent 60%),
          radial-gradient(900px 560px at 92% 18%, ${secondaryGlow}, transparent 62%)
        `,
        display: "grid",
        // centrowanie "content max width", ale tło jest full screen
        placeItems: "center",
        p: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {/* wrapper: kontroluje maksymalną szerokość contentu na dużych ekranach */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1280,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.15fr 0.85fr" },
          gap: { xs: 2.5, md: 3.5 },
          alignItems: "stretch",
        }}
      >
        {/* LEFT: marketing/brand */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.text.primary, mode === "dark" ? 0.14 : 0.08)}`,
            boxShadow:
              mode === "dark"
                ? "0 18px 48px rgba(0,0,0,0.45), 0 2px 14px rgba(0,0,0,0.35)"
                : "0 14px 40px rgba(15,23,42,0.10), 0 2px 12px rgba(15,23,42,0.06)",
            display: "flex",
            flexDirection: "column",
            // na małych ekranach panel ma być niższy
            minHeight: { xs: "auto", md: 560 },
          }}
        >
          <Stack spacing={3} sx={{ height: "100%" }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Logo size={52} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 900, lineHeight: 1.1 }}
                >
                  SmartInwestor
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Twoje portfele. Twoje decyzje. Lepszy wgląd.
                </Typography>
              </Box>

              {/* theme toggle na górze (widoczny zawsze) */}
              <Tooltip title={mode === "light" ? "Tryb ciemny" : "Tryb jasny"}>
                <IconButton onClick={toggleMode} aria-label="Przełącz motyw">
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </Stack>

            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 950,
                  letterSpacing: -0.8,
                  lineHeight: 1.05,
                  maxWidth: 520,
                }}
              >
                Ogarnij inwestowanie w jednym miejscu.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "text.secondary", mt: 1.2, maxWidth: 560 }}
              >
                Dodawaj portfele, śledź wyniki, analizuj ryzyko i podejmuj
                lepsze decyzje na bazie danych.
              </Typography>
            </Box>

            <Stack spacing={1.2} sx={{ color: "text.secondary" }}>
              {[
                "Wiele portfeli i aktywów",
                "Dashboard z wykresami",
                "Analiza i rekomendacje",
                "Ustawienia profilu ryzyka",
              ].map((txt) => (
                <Stack
                  key={txt}
                  direction="row"
                  spacing={1.2}
                  alignItems="center"
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                  <Typography variant="body2">{txt}</Typography>
                </Stack>
              ))}
            </Stack>

            <Box sx={{ flex: 1 }} />

            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Aplikacja ma charakter informacyjny i nie stanowi porady
              inwestycyjnej.
            </Typography>
          </Stack>
        </Paper>

        {/* RIGHT: form */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4, // <= koniec z “telefonową pigułą”
            border: `1px solid ${alpha(theme.palette.text.primary, mode === "dark" ? 0.14 : 0.08)}`,
            boxShadow:
              mode === "dark"
                ? "0 18px 48px rgba(0,0,0,0.45), 0 2px 14px rgba(0,0,0,0.35)"
                : "0 14px 40px rgba(15,23,42,0.10), 0 2px 12px rgba(15,23,42,0.06)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minHeight: { xs: "auto", md: 560 },
          }}
        >
          <Stack spacing={1}>
            <Typography
              variant="h4"
              sx={{ fontWeight: 900, letterSpacing: -0.4 }}
            >
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {subtitle}
              </Typography>
            ) : null}
          </Stack>

          <Divider sx={{ my: 2.5 }} />

          {/* tu wchodzi formularz z LoginPage/RegisterPage */}
          {children}

          <Divider sx={{ my: 2.5 }} />

          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Logując się akceptujesz{" "}
            <Link component={RouterLink} to="/terms" underline="hover">
              regulamin
            </Link>{" "}
            i{" "}
            <Link component={RouterLink} to="/privacy-policy" underline="hover">
              politykę prywatności
            </Link>
            .
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
