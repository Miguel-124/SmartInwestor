import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import type { ChartsRange } from "../types";
import { useChartsOverviewQuery } from "../api/hooks";
import { ChartsHeader } from "../components/ChartsHeader";
import { TotalValueChartCard } from "../components/TotalValueChartCard";
import { PortfolioCharts } from "../components/PortfolioCharts";
import { useProfileQuery } from "../../profile/api/hooks";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";

export function ChartsPage() {
  const [range, setRange] = React.useState<ChartsRange>("12m");
  const [points, setPoints] = React.useState<number>(15);

  const { data, isLoading, isError /*refetch*/ } = useChartsOverviewQuery(
    range,
    points,
  );
  const profileQuery = useProfileQuery();
  const baseCurrency =
    (profileQuery.data?.baseCurrency as CurrencyCode | undefined) ?? "USD";
  const fxQuery = useFxRates(baseCurrency);

  const isFxLoading = fxQuery.isLoading || profileQuery.isLoading;
  const isFxError = fxQuery.isError || profileQuery.isError;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ChartsHeader
        range={range}
        points={points}
        onRangeChange={setRange}
        onPointsChange={setPoints}
        // onRefresh={() => refetch()}
      />

      {(isLoading || isFxLoading) && (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6">Ładowanie wykresów…</Typography>
        </Paper>
      )}

      {(isError || isFxError) && (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Nie udało się pobrać wykresów.</Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Spróbuj odświeżyć lub sprawdź MSW.
          </Typography>
        </Paper>
      )}

      {data && !isFxLoading && !isFxError && (
        <Box sx={{ mt: 3 }}>
          {(() => {
            const summaryCurrency = (data.currency as CurrencyCode) ?? "PLN";
            const toBase = (amount: number) =>
              convertToBase(
                amount,
                summaryCurrency,
                baseCurrency,
                fxQuery.data,
              );

            const convertedTotal = {
              history: data.total.history.map((p) => ({
                ...p,
                totalValue: toBase(p.totalValue),
                marketValue: toBase(p.marketValue ?? p.totalValue),
              })),
            };

            const convertedPortfolios = data.portfolios.map((p) => ({
              ...p,
              history: p.history.map((h) => ({
                ...h,
                totalValue: toBase(h.totalValue),
                marketValue: toBase(h.marketValue ?? h.totalValue),
              })),
              assets: p.assets?.map((a) => ({
                ...a,
                history: a.history.map((h) => ({
                  ...h,
                  totalValue: toBase(h.totalValue),
                  marketValue: toBase(h.marketValue ?? h.totalValue),
                })),
              })),
            }));

            return (
              <>
                <TotalValueChartCard
                  currency={baseCurrency}
                  history={convertedTotal.history}
                  portfolios={convertedPortfolios}
                />
                <Box sx={{ mt: 4 }}>
                  <PortfolioCharts
                    currency={baseCurrency}
                    series={convertedPortfolios}
                  />
                </Box>
              </>
            );
          })()}
        </Box>
      )}
    </Container>
  );
}
