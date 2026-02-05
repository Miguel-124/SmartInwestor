import React from "react";
import {
  Box,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Series = {
  id: string;
  name: string;
  history: Array<{ date: string; totalValue: number; marketValue?: number }>;
  assets?: Array<{
    id: string;
    symbol: string;
    name: string;
    history: Array<{ date: string; totalValue: number; marketValue?: number }>;
  }>;
};

function formatTick(dateIso: string) {
  const d = new Date(`${dateIso}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("pl-PL", {
    month: "short",
    year: "2-digit",
  }).format(d);
}

export function PortfolioCharts({
  currency,
  series,
}: {
  currency: string;
  series: Series[];
}) {
  const [selectedAssetByPortfolio, setSelectedAssetByPortfolio] =
    React.useState<Record<string, string>>({});

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        Wykresy per portfel
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.75, mb: 3 }}>
        Każdy portfel osobno — łatwo zobaczysz, kiedy wartość rosła.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        {series.map((portfolio) => {
          const assets = portfolio.assets ?? [];
          const selectedAssetId =
            selectedAssetByPortfolio[portfolio.id] ?? "portfolio";
          const selectedAsset = assets.find((a) => a.id === selectedAssetId);

          const baseSeries = selectedAsset?.history ?? portfolio.history;
          const data = baseSeries.map((x) => ({
            ...x,
            dateLabel: formatTick(x.date),
            marketValue: x.marketValue ?? x.totalValue,
          }));

          const titleSuffix = selectedAsset ? `• ${selectedAsset.symbol}` : "";
          const valueLabel = selectedAsset ? "Wartość aktywa" : "Wartość";
          const marketLabel = selectedAsset
            ? "Wartość rynkowa aktywa"
            : "Wartość rynkowa";

          return (
            <Paper key={portfolio.id} sx={{ p: 3, borderRadius: 2 }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {portfolio.name} {titleSuffix}
                </Typography>
                <TextField
                  select
                  size="small"
                  label="Aktywo"
                  value={selectedAssetId}
                  onChange={(e) =>
                    setSelectedAssetByPortfolio((prev) => ({
                      ...prev,
                      [portfolio.id]: e.target.value,
                    }))
                  }
                  sx={{ minWidth: 220 }}
                >
                  <MenuItem value="portfolio">Wartość portfela</MenuItem>
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="dateLabel" />
                    <YAxis />
                    <Tooltip
                      formatter={(v, name) => [
                        `${Number(v).toLocaleString("pl-PL")} ${currency}`,
                        name ?? "Wartość",
                      ]}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="totalValue"
                      strokeWidth={2}
                      dot={false}
                      name={valueLabel}
                    />
                    <Line
                      type="stepAfter"
                      dataKey="marketValue"
                      strokeWidth={2}
                      dot={false}
                      name={marketLabel}
                      stroke="#1e88e5"
                      strokeDasharray="6 4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
