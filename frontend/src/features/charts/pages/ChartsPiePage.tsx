import { Box, Container, Paper, Stack, Typography } from "@mui/material";
import { usePortfoliosQuery } from "../../portfolios/api/hooks";
import { useProfileQuery } from "../../profile/api/hooks";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";
import { PieChartCard, type PieItem } from "../components/PieChartCard";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

export function ChartsPiePage() {
  const portfoliosQuery = usePortfoliosQuery();
  const profileQuery = useProfileQuery();

  const baseCurrency =
    (profileQuery.data?.baseCurrency as CurrencyCode | undefined) ?? "USD";
  const fxQuery = useFxRates(baseCurrency);

  const isLoading =
    portfoliosQuery.isLoading || profileQuery.isLoading || fxQuery.isLoading;
  const isError =
    portfoliosQuery.isError || profileQuery.isError || fxQuery.isError;

  if (isLoading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6">Ładowanie wykresów kołowych…</Typography>
        </Paper>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Nie udało się pobrać danych.</Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Spróbuj odświeżyć lub sprawdź MSW.
          </Typography>
        </Paper>
      </Container>
    );
  }

  const portfolios = portfoliosQuery.data ?? [];
  const displayPortfolios = portfolios.map((p) => {
    const assets = p.assets.map((a) => ({
      ...a,
      value: convertToBase(a.value, a.currency, baseCurrency, fxQuery.data),
    }));

    return {
      ...p,
      assets,
    };
  });

  const totalMap = new Map<string, number>();
  displayPortfolios.forEach((p) => {
    p.assets.forEach((a) => {
      totalMap.set(a.name, (totalMap.get(a.name) ?? 0) + a.value);
    });
  });

  const totalItems: PieItem[] = Array.from(totalMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Wykresy kołowe
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.75, mt: 0.5 }}>
              Struktura portfeli i aktywów w walucie bazowej.
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <PieChartCard
        title="Struktura wszystkich portfeli"
        subtitle="Udział aktywów w łącznej wartości."
        items={totalItems}
        currency={baseCurrency}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>
          Struktura per portfel
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          {displayPortfolios.map((p) => {
            const items: PieItem[] = p.assets
              .map((a) => ({ name: a.name, value: a.value }))
              .sort((a, b) => b.value - a.value);
            return (
              <PieChartCard
                key={p.id}
                title={
                  <Button
                    component={RouterLink}
                    to={`/portfolios`}
                    variant="text"
                    sx={{
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      fontWeight: 900,
                      color: "text.primary",
                    }}
                  >
                    {p.name}
                  </Button>
                }
                subtitle="Udział aktywów w portfelu."
                items={items}
                currency={baseCurrency}
              />
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}
