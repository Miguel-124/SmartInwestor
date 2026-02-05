import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useProfileQuery } from "../../profile/api/hooks";
import { usePortfoliosQuery } from "../../portfolios/api/hooks";
import { useAnalysisQuery } from "../api/hooks";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link as RouterLink } from "react-router-dom";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
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

  const baseCurrency =
    (profileQuery.data?.baseCurrency as CurrencyCode | undefined) ?? "USD";
  const fxQuery = useFxRates(baseCurrency);

  const params = React.useMemo(() => {
    if (!profileQuery.data || !portfoliosQuery.data) return null;

    const toBase = (amount: number, from: CurrencyCode) =>
      convertToBase(amount, from, baseCurrency, fxQuery.data);

    const portfoliosBase = portfoliosQuery.data.map((p) => {
      const assets = p.assets.map((a) => ({
        symbol: a.symbol,
        name: a.name,
        value: toBase(a.value, a.currency),
      }));

      const totalValue = assets.reduce((acc, a) => acc + a.value, 0);

      return {
        id: p.id,
        name: p.name,
        totalValue,
        assets,
      };
    });

    return {
      riskProfile: profileQuery.data.riskProfile ?? "balanced",
      portfolios: portfoliosBase,
    };
  }, [profileQuery.data, portfoliosQuery.data, baseCurrency, fxQuery.data]);

  const analysisQuery = useAnalysisQuery(params);

  const isLoading =
    profileQuery.isLoading ||
    portfoliosQuery.isLoading ||
    analysisQuery.isLoading ||
    fxQuery.isLoading;

  const isError =
    profileQuery.isError ||
    portfoliosQuery.isError ||
    analysisQuery.isError ||
    fxQuery.isError;

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
      (fxQuery.error as Error | undefined)?.message ||
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Analiza portfela
            </Typography>
            <Tooltip title="Wyniki i rekomendacje są wyliczane na podstawie profilu ryzyka i danych z portfeli.">
              <IconButton size="small" aria-label="Pomoc: Analiza">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography color="text.secondary">
            Wygenerowano: {new Date(data.generatedAt).toLocaleString("pl-PL")}
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/profile/help#instrukcja-analiza"
          variant="outlined"
          size="small"
          aria-label="Instrukcja analizy"
        >
          Instrukcja
        </Button>
      </Stack>

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
              {formatMoney(data.totalValue, baseCurrency)}
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
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Ekspozycja portfela
              </Typography>
              <Tooltip title="Udział największych ekspozycji w portfelu. Pomaga wykryć koncentrację ryzyka.">
                <IconButton
                  size="small"
                  aria-label="Pomoc: Ekspozycja portfela"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Rekomendacje
              </Typography>
              <Tooltip title="Lista działań sugerowanych na podstawie profilu ryzyka i struktury portfela.">
                <IconButton size="small" aria-label="Pomoc: Rekomendacje">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Sygnały i obserwacje
              </Typography>
              <Tooltip title="Anomalie i wnioski z danych portfela, które mogą wymagać uwagi.">
                <IconButton
                  size="small"
                  aria-label="Pomoc: Sygnały i obserwacje"
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
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
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Symulacje stress test
              </Typography>
              <Tooltip title="Scenariusze testów warunków skrajnych i szacowany wpływ na portfel.">
                <IconButton size="small" aria-label="Pomoc: Stress test">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
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
