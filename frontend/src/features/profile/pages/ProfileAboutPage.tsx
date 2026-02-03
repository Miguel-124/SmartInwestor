import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import InsightsIcon from "@mui/icons-material/Insights";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { useNavigate } from "react-router-dom";
import { ProfileShell } from "../components/ProfileShell";

type ValueCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "100%",
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1.25}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box aria-hidden="true">{icon}</Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}

type StepProps = {
  no: string;
  title: string;
  description: string;
};

function Step({ no, title, description }: StepProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Stack spacing={1}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip label={no} size="small" sx={{ fontWeight: 800 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            {title}
          </Typography>
        </Box>
        <Typography color="text.secondary">{description}</Typography>
      </Stack>
    </Paper>
  );
}

export function ProfileAboutPage() {
  const navigate = useNavigate();

  return (
    <ProfileShell title="O nas">
      <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          {/* HERO */}
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 900 }}>
                SmartInwestor
              </Typography>

              <Chip
                icon={<TrendingUpIcon />}
                label="MVP"
                size="small"
                color="default"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                icon={<InsightsIcon />}
                label="Wizualizacje + analiza"
                size="small"
                color="default"
                sx={{ fontWeight: 800 }}
              />
              <Chip
                icon={<SecurityIcon />}
                label="Prywatność i bezpieczeństwo"
                size="small"
                color="default"
                sx={{ fontWeight: 800 }}
              />
            </Box>

            <Typography color="text.secondary">
              Budujemy narzędzie dla inwestorów indywidualnych, które pomaga
              ogarnąć portfele, zobaczyć realny obraz ryzyka i podejmować
              bardziej świadome decyzje — bez „magii” i bez nadęcia.
            </Typography>

            <Alert severity="info" sx={{ borderRadius: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>
                Ważne: nie jesteśmy doradcą inwestycyjnym.
              </Typography>
              <Typography color="text.secondary">
                SmartInwestor wspiera analizę i porządkowanie danych, ale nie
                gwarantuje zysków i nie ponosi odpowiedzialności za decyzje
                inwestycyjne użytkownika.
              </Typography>
            </Alert>
          </Stack>

          <Divider />

          {/* JAK TO DZIAŁA */}
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Jak działa SmartInwestor
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(3, minmax(0, 1fr))",
                },
              }}
            >
              <Step
                no="1"
                title="Dodajesz portfele i aktywa"
                description="Wprowadzisz portfele i pozycje w prosty sposób, a my pokażemy je w czytelnych widokach."
              />
              <Step
                no="2"
                title="Patrzysz na strukturę i zmianę w czasie"
                description="Dostajesz wykres kołowy portfeli, tabelę wartości i linię przyrostu aktywów."
              />
              <Step
                no="3"
                title="Otrzymujesz analizę i rekomendacje"
                description="Moduł analizy (API) pomoże wyłapać koncentrację ryzyka, braki dywersyfikacji i potencjalne kroki."
              />
            </Box>
          </Stack>

          {/* WARTOŚCI */}
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Co jest dla nas ważne
            </Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
              }}
            >
              <ValueCard
                icon={<AutoGraphIcon />}
                title="Czytelność ponad wszystko"
                description="Najpierw proste, zrozumiałe dane. Dopiero potem bardziej zaawansowane metryki."
              />
              <ValueCard
                icon={<SecurityIcon />}
                title="Bezpieczeństwo i prywatność"
                description="Projektujemy rozwiązania tak, aby Twoje dane były traktowane jak wrażliwe — od początku."
              />
              <ValueCard
                icon={<InsightsIcon />}
                title="Transparentność"
                description="Pokazujemy skąd wynikają wnioski. Bez czarnej skrzynki i bez obietnic bez pokrycia."
              />
              <ValueCard
                icon={<TrendingUpIcon />}
                title="Rozwój krok po kroku"
                description="MVP ma dowieźć wartość. Kolejne funkcje dokładamy dopiero, gdy fundament jest solidny."
              />
            </Box>
          </Stack>

          <Divider />

          {/* ROADMAP + CTA */}
          <Stack spacing={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Co planujemy dalej
            </Typography>

            <Typography color="text.secondary">
              • więcej metryk (alokacja, ryzyko, koncentracja, ekspozycja)
              <br />• automatyczny import danych (w zależności od integracji)
              <br />• porównania scenariuszy i „co jeśli”
              <br />• lepsze rekomendacje i alerty
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, pt: 1 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/dashboard")}
                aria-label="Przejdź do dashboardu"
              >
                Przejdź do Dashboardu
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/analysis")}
                aria-label="Przejdź do analizy portfela"
              >
                Zobacz analizę
              </Button>
              <Button
                variant="text"
                onClick={() => navigate("/profile/help")}
                aria-label="Przejdź do pomocy"
              >
                Pomoc
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Paper>
    </ProfileShell>
  );
}
