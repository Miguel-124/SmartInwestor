import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";
import type { ChartsRange } from "../types";
import { useChartsOverviewQuery } from "../api/hooks";
import { ChartsHeader } from "../components/ChartsHeader";
import { TotalValueChartCard } from "../components/TotalValueChartCard";
import { PortfolioCharts } from "../components/PortfolioCharts";

export function ChartsPage() {
  const [range, setRange] = React.useState<ChartsRange>("12m");
  const [points, setPoints] = React.useState<number>(15);

  const { data, isLoading, isError /*refetch*/ } = useChartsOverviewQuery(
    range,
    points,
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ChartsHeader
        range={range}
        points={points}
        onRangeChange={setRange}
        onPointsChange={setPoints}
        // onRefresh={() => refetch()}
      />

      {isLoading && (
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
          <Typography variant="h6">Ładowanie wykresów…</Typography>
        </Paper>
      )}

      {isError && (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6">Nie udało się pobrać wykresów.</Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            Spróbuj odświeżyć lub sprawdź MSW.
          </Typography>
        </Paper>
      )}

      {data && (
        <Box sx={{ mt: 3 }}>
          <TotalValueChartCard
            currency={data.currency}
            history={data.total.history}
            portfolios={data.portfolios}
          />
          <Box sx={{ mt: 4 }}>
            <PortfolioCharts
              currency={data.currency}
              series={data.portfolios}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
}
