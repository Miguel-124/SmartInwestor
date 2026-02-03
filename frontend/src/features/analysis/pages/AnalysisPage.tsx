import React from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useProfileQuery } from "../../profile/api/hooks";
import { usePortfoliosQuery } from "../../portfolios/api/hooks";
import { useAnalysisQuery } from "../api/hooks";

function formatMoney(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

function riskLabel(risk: string) {
  if (risk === "conservative") return "Ostrożny";
  if (risk === "balanced") return "Zrównoważony";
  return "Agresywny";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Wysoka zgodność";
  if (score >= 60) return "Średnia zgodność";
  return "Niska zgodność";
}

function scoreColor(score: number) {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "error";
}

export function AnalysisPage() {
  const profileQuery = useProfileQuery();
  const portfoliosQuery = usePortfoliosQuery();

  const params = React.useMemo(() => {
    if (!profileQuery.data || !portfoliosQuery.data) return null;
    return {
      riskProfile: profileQuery.data.riskProfile ?? "balanced",
      portfolios: portfoliosQuery.data,
    };
  }, [profileQuery.data, portfoliosQuery.data]);

  const analysisQuery = useAnalysisQuery(params);

  const isLoading =
    profileQuery.isLoading ||
    portfoliosQuery.isLoading ||
    analysisQuery.isLoading;

  const isError =
    profileQuery.isError || portfoliosQuery.isError || analysisQuery.isError;

  if (isLoading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
        <Typography color="text.secondary">Ładowanie analizy...</Typography>
      </Stack>
    );
  }

  if (isError) {
    const msg =
      (profileQuery.error as Error | undefined)?.message ||
      (portfoliosQuery.error as Error | undefined)?.message ||
      (analysisQuery.error as Error | undefined)?.message ||
      "Nie udało się pobrać analizy.";
    return <Alert severity="error">{msg}</Alert>;
  }

  const portfolios = portfoliosQuery.data ?? [];
  if (portfolios.length === 0) {
    return (
      <Stack spacing={1} sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Analiza portfela
        </Typography>
        <Typography color="text.secondary">
          Dodaj portfel i aktywa, aby wygenerować analizę i rekomendacje.
        </Typography>
      </Stack>
    );
  }

  const data = analysisQuery.data!;

  return (
    <Stack spacing={3} aria-label="Analysis page">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Analiza portfela
        </Typography>
        <Typography color="text.secondary">
          Wygenerowano: {new Date(data.generatedAt).toLocaleString("pl-PL")}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
          gap: 2,
        }}
      >
        <Card>
          <CardContent>
            <Typography color="text.secondary">Profil ryzyka</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {riskLabel(data.riskProfile)}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">Wartość portfela</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {formatMoney(data.totalValue)}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">Dywersyfikacja</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {data.diversificationScore}/100
            </Typography>
            <LinearProgress
              variant="determinate"
              value={data.diversificationScore}
              sx={{ mt: 1 }}
              aria-label="Poziom dywersyfikacji"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary">Zgodność z profilem</Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {scoreLabel(data.alignmentScore)}
            </Typography>
            <Chip
              label={`${data.alignmentScore}/100`}
              color={scoreColor(data.alignmentScore)}
              size="small"
              sx={{ mt: 1 }}
              aria-label="Ocena zgodności"
            />
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" },
          gap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Ekspozycja portfela
            </Typography>
            <Stack spacing={1.5}>
              {data.topExposures.map((item) => (
                <Box key={item.name}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{item.name}</Typography>
                    <Typography color="text.secondary">
                      {item.percent}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={item.percent}
                    aria-label={`Udział ${item.name}`}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Rekomendacje
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1.5} aria-label="Rekomendacje">
              {data.recommendations.map((rec) => (
                <Box key={rec.id}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography sx={{ fontWeight: 700 }}>
                      {rec.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={rec.priority}
                      color={
                        rec.priority === "high"
                          ? "error"
                          : rec.priority === "medium"
                            ? "warning"
                            : "success"
                      }
                    />
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {rec.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Sygnały i obserwacje
            </Typography>
            <List aria-label="Sygnały">
              {data.insights.map((ins) => (
                <ListItem key={ins.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          size="small"
                          label={ins.severity}
                          color={
                            ins.severity === "warning"
                              ? "warning"
                              : ins.severity === "success"
                                ? "success"
                                : "info"
                          }
                        />
                        <Typography sx={{ fontWeight: 700 }}>
                          {ins.title}
                        </Typography>
                      </Stack>
                    }
                    secondary={ins.description}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Symulacje stress test
            </Typography>
            <List aria-label="Stress test">
              {data.stressTests.map((t) => (
                <ListItem key={t.id} sx={{ px: 0 }}>
                  <ListItemText
                    primary={t.scenario}
                    secondary={`Szacowany wpływ: ${t.impactPercent}%`}
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}
