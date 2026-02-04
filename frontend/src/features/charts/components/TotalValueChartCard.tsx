import React from "react";
import {
  Paper,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

type Point = { date: string; totalValue: number };

type PortfolioSeries = {
  id: string;
  name: string;
  history: Array<{ date: string; totalValue: number }>;
};

const COLORS = [
  "#1976d2",
  "#d32f2f",
  "#388e3c",
  "#f57c00",
  "#7b1fa2",
  "#0097a7",
];

function formatTick(dateIso: string, pointsCount: number) {
  const d = new Date(`${dateIso}T00:00:00.000Z`);
  return new Intl.DateTimeFormat(
    "pl-PL",
    pointsCount <= 12
      ? { day: "2-digit", month: "short", year: "2-digit" }
      : { month: "short", year: "2-digit" },
  ).format(d);
}

export function TotalValueChartCard({
  currency,
  history,
  portfolios,
}: {
  currency: string;
  history: Point[];
  portfolios: PortfolioSeries[];
}) {
  const [visiblePortfolios, setVisiblePortfolios] = React.useState<string[]>(
    portfolios.map((p) => p.id),
  );

  const pointsCount = history.length;

  const chartData = history.map((point) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const row: Record<string, any> = {
      date: point.date,
      dateLabel: formatTick(point.date, pointsCount),
      total: point.totalValue,
    };

    portfolios.forEach((portfolio) => {
      const portfolioPoint = portfolio.history.find(
        (h) => h.date === point.date,
      );
      row[portfolio.id] = portfolioPoint?.totalValue ?? 0;
    });

    return row;
  });

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
        Wartość portfeli
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.75, mb: 2 }}>
        Porównanie wartości wszystkich portfeli w czasie.
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="caption"
          sx={{ opacity: 0.7, display: "block", mb: 1 }}
        >
          Wybierz portfele do wyświetlenia:
        </Typography>
        <ToggleButtonGroup
          value={visiblePortfolios}
          onChange={(_, newValues) => {
            if (newValues.length > 0) {
              setVisiblePortfolios(newValues);
            }
          }}
          size="small"
        >
          {portfolios.map((portfolio) => (
            <ToggleButton key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ height: 450 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="dateLabel" interval="preserveStartEnd" />
            <YAxis />
            <Tooltip
              formatter={(v) => [
                `${Number(v).toLocaleString("pl-PL")} ${currency}`,
                "Wartość",
              ]}
              contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
            />
            <Legend />
            <Line
              type="stepAfter"
              dataKey="total"
              strokeWidth={2}
              dot={false}
              name="Razem"
              stroke="#000"
            />
            {portfolios.map((portfolio, idx) =>
              visiblePortfolios.includes(portfolio.id) ? (
                <Line
                  key={portfolio.id}
                  type="stepAfter"
                  dataKey={portfolio.id}
                  strokeWidth={2}
                  dot={false}
                  name={portfolio.name}
                  stroke={COLORS[idx % COLORS.length]}
                />
              ) : null,
            )}
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
