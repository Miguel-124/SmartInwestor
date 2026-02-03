import { zodResolver } from "@hookform/resolvers/zod";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ProfileShell } from "../components/ProfileShell";

const helpFormSchema = z.object({
  topic: z
    .string()
    .min(3, "Podaj temat (min. 3 znaki).")
    .max(80, "Temat jest za długi (max. 80 znaków)."),
  message: z
    .string()
    .min(10, "Opisz problem trochę dokładniej (min. 10 znaków).")
    .max(1000, "Wiadomość jest za długa (max. 1000 znaków)."),
});

type HelpFormValues = z.infer<typeof helpFormSchema>;

type QuickActionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

function QuickAction({ icon, title, description, onClick }: QuickActionProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      role="button"
      tabIndex={0}
      aria-label={title}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <Stack spacing={1.25}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box aria-hidden="true">{icon}</Box>
          <Typography sx={{ fontWeight: 900 }}>{title}</Typography>
        </Box>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}

export function ProfileHelpPage() {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const defaultValues = useMemo<HelpFormValues>(
    () => ({
      topic: "",
      message: "",
    }),
    [],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HelpFormValues>({
    resolver: zodResolver(helpFormSchema),
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 150));
    setSnackbarOpen(true);
    reset(defaultValues);
  };

  return (
    <ProfileShell title="Pomoc">
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* QUICK START */}
          <Stack spacing={1.25}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900 }}>
                Szybki start
              </Typography>
            </Box>

            <Typography color="text.secondary">
              Najczęściej szukane akcje. Kliknij kafelek, żeby przejść od razu
              we właściwe miejsce.
            </Typography>

            <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
              <Box sx={{ flex: 1 }}>
                <QuickAction
                  icon={<SettingsSuggestIcon />}
                  title="Zmień profil ryzyka"
                  description="Wejdź w ustawienia i wybierz agresywność inwestowania."
                  onClick={() => navigate("/profile/settings")}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <QuickAction
                  icon={<AccountBalanceWalletIcon />}
                  title="Zarządzaj portfelami"
                  description="Dodawaj, edytuj i usuwaj portfele oraz aktywa."
                  onClick={() => navigate("/portfolios")}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <QuickAction
                  icon={<QueryStatsIcon />}
                  title="Zobacz analizę"
                  description="Sprawdź rekomendacje i wnioski na podstawie Twoich danych."
                  onClick={() => navigate("/analysis")}
                />
              </Box>
            </Stack>
          </Stack>

          <Divider />

          {/* FAQ */}
          <Stack spacing={1.25}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Najczęstsze pytania (FAQ)
            </Typography>

            <Accordion
              disableGutters
              elevation={0}
              sx={{ borderRadius: 2, "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq-1-content"
                id="faq-1-header"
              >
                <Typography sx={{ fontWeight: 800 }}>
                  Jak zmienić profil ryzyka?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Przejdź do{" "}
                  <Link
                    component="button"
                    onClick={() => navigate("/profile/settings")}
                    aria-label="Przejdź do ustawień profilu"
                  >
                    Ustawień profilu
                  </Link>{" "}
                  i wybierz nową agresywność inwestowania. Zmiana wpływa na
                  sposób interpretacji analiz i rekomendacji.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters
              elevation={0}
              sx={{ borderRadius: 2, "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq-2-content"
                id="faq-2-header"
              >
                <Typography sx={{ fontWeight: 800 }}>
                  Dlaczego wartości portfela nie zgadzają się co do grosza?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  W MVP część danych może być zaokrąglana, a wyceny mogą być
                  zależne od sposobu wprowadzenia pozycji. Jeśli widzisz duże
                  rozjazdy — sprawdź ilości, walutę i cenę zakupu dla aktywa.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              disableGutters
              elevation={0}
              sx={{ borderRadius: 2, "&:before": { display: "none" } }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="faq-3-content"
                id="faq-3-header"
              >
                <Typography sx={{ fontWeight: 800 }}>
                  Jak usunąć konto?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  Napisz do nas maila z prośbą o rozpoczęcie procesu. W treści
                  podaj adres e-mail konta i potwierdź decyzję.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>

          {/* TROUBLESHOOTING */}
          <Alert severity="warning" sx={{ borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 800 }}>
              Problem z logowaniem lub widzisz błąd?
            </Typography>
            <Typography color="text.secondary">
              Spróbuj odświeżyć stronę, wylogować i zalogować ponownie. Jeśli
              problem wraca — wyślij zgłoszenie poniżej.
            </Typography>
          </Alert>

          <Divider />

          {/* CONTACT */}
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Kontakt
            </Typography>
            <Typography color="text.secondary">
              Preferujemy mail — wróć do nas z odpowiedzią jak najszybciej.
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <MailOutlineIcon aria-hidden="true" />
              <Link
                href="mailto:oskarbrozdaa@gmail.com"
                aria-label="Napisz maila do wsparcia"
              >
                oskarbrozdaa@gmail.com
              </Link>
              <Chip label="Wsparcie" size="small" sx={{ fontWeight: 800 }} />
            </Box>
          </Stack>

          {/* REPORT FORM */}
          <Stack spacing={1.25}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Zgłoś problem
            </Typography>

            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
              <Stack
                spacing={2}
                component="form"
                onSubmit={handleSubmit(onSubmit)}
                aria-label="Formularz zgłoszenia problemu"
              >
                <TextField
                  label="Temat"
                  placeholder="np. Nie mogę edytować aktywa"
                  {...register("topic")}
                  error={Boolean(errors.topic)}
                  helperText={errors.topic?.message ?? " "}
                  inputProps={{ "aria-label": "Temat zgłoszenia" }}
                  fullWidth
                />

                <TextField
                  label="Opis"
                  placeholder="Co dokładnie się dzieje? Jak to odtworzyć?"
                  {...register("message")}
                  error={Boolean(errors.message)}
                  helperText={errors.message?.message ?? " "}
                  inputProps={{ "aria-label": "Opis zgłoszenia" }}
                  minRows={4}
                  multiline
                  fullWidth
                />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    aria-label="Wyślij zgłoszenie"
                  >
                    Wyślij
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => reset(defaultValues)}
                    disabled={isSubmitting}
                    aria-label="Wyczyść formularz"
                  >
                    Wyczyść
                  </Button>
                  <Button
                    type="button"
                    variant="text"
                    startIcon={<ManageAccountsIcon />}
                    onClick={() => navigate("/profile/settings")}
                    aria-label="Przejdź do ustawień profilu"
                  >
                    Ustawienia profilu
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Stack>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message="Dzięki! Zgłoszenie zostało przyjęte (MVP: symulacja wysyłki)."
        />
      </Paper>
    </ProfileShell>
  );
}
