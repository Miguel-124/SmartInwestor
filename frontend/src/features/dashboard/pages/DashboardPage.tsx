import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useDashboardSummaryQuery } from "../api/hooks";
import { PortfolioPieChart } from "../components/PortfolioPieChart";
import { PortfolioAssetsTable } from "../components/PortfolioAssetsTable";
import { AssetsLineChart } from "../components/AssetsLineChart";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

export function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardSummaryQuery();

  if (isLoading) {
    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ py: 6 }}
        aria-label="Dashboard loading"
      >
        <CircularProgress />
        <Typography color="text.secondary">Ładowanie dashboardu...</Typography>
      </Stack>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" aria-label="Dashboard error">
        {(error as Error).message || "Nie udało się pobrać danych dashboardu."}
      </Alert>
    );
  }

  if (!data || data.portfolios.length === 0) {
    return (
      <Stack spacing={1} sx={{ py: 4 }} aria-label="Dashboard empty">
        <Typography variant="h4" sx={{ fontWeight: 900 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Brak danych. Dodaj pierwszy portfel, aby zobaczyć wykresy i
          statystyki.
        </Typography>
      </Stack>
    );
  }

  const pieItems = data.portfolios.map((p) => ({
    name: p.name,
    value: p.totalValue,
  }));

  return (
    <Stack spacing={3} aria-label="Dashboard page">
      {/* Header */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 950 }}>
          Witaj, {data.userFullName} 👋
        </Typography>
        <Typography color="text.secondary">
          Łączna wartość aktywów:{" "}
          <strong>{formatMoney(data.totalValue, data.currency)}</strong>
        </Typography>
      </Box>

      {/* Charts */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.9fr 1.1fr" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <PortfolioPieChart items={pieItems} currency={data.currency} />
        <AssetsLineChart history={data.history} currency={data.currency} />
      </Box>

      {/* Table */}
      <PortfolioAssetsTable
        portfolios={data.portfolios}
        currency={data.currency}
      />
    </Stack>
  );
}
