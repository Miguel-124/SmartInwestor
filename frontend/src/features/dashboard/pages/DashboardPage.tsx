import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDashboardSummaryQuery } from "../api/hooks";
import { PortfolioPieChart } from "../components/PortfolioPieChart";
import { PortfolioAssetsTable } from "../components/PortfolioAssetsTable";
import { AssetsLineChart } from "../components/AssetsLineChart";
import { useMeQuery } from "../../auth/api/useMeQuery";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useProfileQuery } from "../../profile/api/hooks";
import { useFxRates, convertToBase } from "../../../shared/api/fxRates";
import type { CurrencyCode } from "../../../shared/types/currency";

import { CardActionArea } from "@mui/material";

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(
    value,
  );
}

export function DashboardPage() {
  const meQuery = useMeQuery();
  const profileQuery = useProfileQuery();
  const summaryQuery = useDashboardSummaryQuery();

  const baseCurrency =
    (profileQuery.data?.baseCurrency as CurrencyCode | undefined) ?? "USD";
  const fxQuery = useFxRates(baseCurrency);

  const isLoading =
    meQuery.isLoading ||
    summaryQuery.isLoading ||
    profileQuery.isLoading ||
    fxQuery.isLoading;
  const isError =
    meQuery.isError ||
    summaryQuery.isError ||
    profileQuery.isError ||
    fxQuery.isError;

  const navigate = useNavigate();

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
    const msg =
      (meQuery.error as Error | undefined)?.message ||
      (summaryQuery.error as Error | undefined)?.message ||
      (fxQuery.error as Error | undefined)?.message ||
      "Nie udało się pobrać danych dashboardu.";

    return (
      <Alert severity="error" aria-label="Dashboard error">
        {msg}
      </Alert>
    );
  }

  const me = meQuery.data!;
  const data = summaryQuery.data!;
  const summaryCurrency = (data.currency as CurrencyCode) ?? "PLN";

  const toBase = (amount: number) =>
    convertToBase(amount, summaryCurrency, baseCurrency, fxQuery.data);

  const displayTotalValue = toBase(data.totalValue);
  const displayPortfolios = data.portfolios.map((p) => ({
    ...p,
    totalValue: toBase(p.totalValue),
    assets: p.assets.map((a) => ({
      ...a,
      price: toBase(a.price),
      value: toBase(a.value),
    })),
  }));
  const displayHistory = data.history.map((h) => ({
    ...h,
    totalValue: toBase(h.totalValue),
  }));

  if (data.portfolios.length === 0) {
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

  const pieItems = displayPortfolios.map((p) => ({
    name: p.name,
    value: p.totalValue,
  }));

  return (
    <Stack spacing={3} aria-label="Dashboard page">
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
        justifyContent="space-between"
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 950 }}>
              Witaj, {me.firstName} 👋
            </Typography>
            <Tooltip title="Podsumowanie wartości portfeli oraz kluczowe wskaźniki. Szczegóły w instrukcji.">
              <IconButton size="small" aria-label="Pomoc: Dashboard">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography color="text.secondary">
            Łączna wartość aktywów:{" "}
            <strong>{formatMoney(displayTotalValue, baseCurrency)}</strong>
          </Typography>
        </Box>

        <Button
          component={RouterLink}
          to="/profile/help#instrukcja-dashboard"
          variant="outlined"
          size="small"
          aria-label="Instrukcja dashboardu"
        >
          Instrukcja
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "0.9fr 1.1fr" },
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <PortfolioPieChart items={pieItems} currency={baseCurrency} />
        <Card sx={{ borderRadius: 2 }}>
          <CardActionArea
            onClick={() => navigate("/charts")}
            aria-label="Otwórz szczegółowe wykresy"
          >
            <AssetsLineChart history={displayHistory} currency={baseCurrency} />
          </CardActionArea>
        </Card>
      </Box>

      <PortfolioAssetsTable
        portfolios={displayPortfolios}
        currency={baseCurrency}
      />
    </Stack>
  );
}
