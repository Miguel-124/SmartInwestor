import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Link as RouterLink } from "react-router-dom";
import { Logo } from "../UI/Logo";

const screenshots = [
  {
    src: "/assets/AppScreenshoots/dashboard.png",
    alt: "Dashboard SmartInwestor",
    description:
      "Szybki podgląd łącznej wartości portfela, wykresy i najważniejsze wskaźniki.",
  },
  {
    src: "/assets/AppScreenshoots/portfolio.png",
    alt: "Portfele SmartInwestor",
    description:
      "Lista portfeli i aktywów – łatwe dodawanie, edycja i kontrola wartości.",
  },
  {
    src: "/assets/AppScreenshoots/analysis.png",
    alt: "Analiza SmartInwestor",
    description:
      "Rekomendacje i insights dopasowane do Twojego profilu ryzyka.",
  },
];

const features = [
  {
    title: "Przejrzyste portfele",
    description: "Twórz portfele, dodawaj aktywa i obserwuj wartość w czasie.",
  },
  {
    title: "Analizy dopasowane do profilu",
    description: "Rekomendacje i insighty zgodne z Twoją tolerancją ryzyka.",
  },
  {
    title: "Wykresy i symulacje",
    description:
      "Zobacz strukturę portfela, ekspozycje i potencjalne scenariusze.",
  },
];

const steps = [
  { title: "Załóż konto", text: "Rejestracja trwa mniej niż minutę." },
  { title: "Uzupełnij onboarding", text: "Wybierz profil ryzyka." },
  { title: "Dodaj portfele", text: "Zacznij monitorować inwestycje." },
];

export function PublicHomePage() {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<
    (typeof screenshots)[number] | null
  >(null);

  const handleOpen = (item: (typeof screenshots)[number]) => {
    setActive(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setActive(null);
  };

  return (
    <Box>
      <Box
        sx={(theme) => ({
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(25,118,210,0.22), rgba(156,39,176,0.22))"
              : "linear-gradient(135deg, rgba(25,118,210,0.08), rgba(156,39,176,0.08))",
          py: { xs: 6, md: 10 },
        })}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 4,
              alignItems: "center",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Logo size={64} radius={1} />
                <Typography variant="h3" sx={{ fontWeight: 900 }}>
                  SmartInwestor
                </Typography>
              </Stack>

              <Typography color="text.secondary" sx={{ fontSize: 18 }}>
                Monitoruj portfele, analizuj ryzyko i podejmuj lepsze decyzje
                inwestycyjne.
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  aria-label="Załóż konto"
                >
                  Załóż konto
                </Button>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  size="large"
                  aria-label="Zaloguj"
                >
                  Zaloguj
                </Button>
              </Stack>
            </Stack>

            <Box
              sx={(theme) => ({
                borderRadius: 4,
                backgroundColor: theme.palette.background.paper,
                boxShadow: 3,
                overflow: "hidden",
                height: { xs: 240, md: 360 },
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <img
                src="/assets/AppScreenshoots/dashboard.png"
                alt="Podgląd dashboardu"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                  display: "block",
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Co dostajesz w MVP?
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {features.map((f) => (
              <Card key={f.title} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {f.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {f.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Stack>
      </Container>

      <Box sx={{ backgroundColor: "background.default", py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Symulacje i rekomendacje
            </Typography>
            <Typography color="text.secondary">
              Twój profil ryzyka wpływa na analizę portfela i priorytety
              rekomendacji. Zobacz, jak zmiana profilu wpływa na strategię.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 3,
              }}
            >
              {steps.map((s) => (
                <Card key={s.title}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {s.title}
                    </Typography>
                    <Typography color="text.secondary">{s.text}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Stack spacing={3}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            Zobacz aplikację
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {screenshots.map((s) => (
              <Box
                key={s.src}
                sx={(theme) => ({
                  borderRadius: 3,
                  p: 1,
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: 2,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: `1px solid ${theme.palette.divider}`,
                })}
                onClick={() => handleOpen(s)}
                aria-label={`Otwórz podgląd: ${s.alt}`}
                role="button"
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 220, md: 260 },
                    overflow: "hidden",
                    borderRadius: 2,
                  }}
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Stack>
      </Container>

      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Zacznij świadomie inwestować
            </Typography>
            <Typography color="text.secondary">
              Załóż konto i zobacz pierwsze analizy już po dodaniu portfela.
            </Typography>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              aria-label="Załóż konto teraz"
            >
              Załóż konto teraz
            </Button>
          </Stack>
        </Container>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        aria-label="Podgląd ekranu aplikacji"
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ flex: 1, fontWeight: 800 }}>
            {active?.alt}
          </Typography>
          <IconButton onClick={handleClose} aria-label="Zamknij podgląd">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {active && (
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 2,
                }}
              >
                <img
                  src={active.src}
                  alt={active.alt}
                  style={{ width: "100%", display: "block" }}
                />
              </Box>
              <Typography color="text.secondary">
                {active.description}
              </Typography>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
